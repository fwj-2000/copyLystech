<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button type="primary" @click="handleAdd" v-if="activeKey === 'pending'">{{ t('common.add2Text') }}</a-button>
              <!-- 编辑" -->
              <a-button type="primary" @click="handleEdit" v-if="activeKey === 'pending' || activeKey === 'processing'">{{ t('common.editText') }}</a-button>
              <!-- 撤回 -->
              <a-button type="primary" ghost v-if="activeKey === 'pending' || activeKey === 'processing'" @click="handleWithdraw">{{
                t('common.revoke')
              }}</a-button>
              <!-- 终止 -->
              <a-button danger v-if="activeKey === 'pending'" @click="handleStop">{{ t('common.stopText') }}</a-button>
              <!-- 释放独占物料 -->
              <a-button type="primary" ghost v-if="activeKey === 'pending'" @click="handleOpenReleaseMaterials">{{
                t('dict.PRList.releaseExclusiveMaterial')
              }}</a-button>
              <!-- 计划使用日期 -->
              <a-button type="primary" ghost v-if="activeKey === 'pending'" @click="handleOpenPlanUseDate">{{ t('tip.PR.adjustPlanUseDate') }}</a-button>
              <!-- 批量删除 -->
              <a-button danger v-if="activeKey === 'pending'" @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
              <!-- 批量导出 -->
              <a-button class="mr-12px" block @click="handleExport" v-if="activeKey !== 'pending'">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>

          <template #nodeRecords="{ row }">
            <span class="table-a text-hover" @click="handleNodeModal(row)">
              {{ t('common.searchDetail') }}
            </span>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <ReleaseMaterialsModal @register="registerReleaseMaterials" @reload="reload"> </ReleaseMaterialsModal>
    <PlanUseDateModal @register="registerPlanUseDate" @reload="reload"> </PlanUseDateModal>
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { PRprorderList, prorderExport, prBulkdelete, prWithdraw, prStop } from '/@/api/mps/productionPlan/MPS';
  import ReleaseMaterialsModal from './components/ReleaseMaterialsModal.vue';
  import PlanUseDateModal from './components/PlanUseDateModal.vue';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const emit = defineEmits(['handleAdd']);
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    const PRStatusEnum = {
      pending: 1,
      processing: 2,
      handled: 3,
    };
    return PRStatusEnum[props.activeKey];
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerReleaseMaterials, { openModal: openReleaseMaterials }] = useModal();
  const [registerPlanUseDate, { openModal: openPlanUseDate }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗
  const { createConfirm, createMessage } = useMessage();

  const [Grid, { reload, getFetchParams, reloadColumn, resetForm, getFromValue, setLatestSubmissionValues, getSelectRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      handleSubmit: reloadTable,
      handleReset,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: `productionPlan-main-PRList-list-${props.activeKey}`,
      columns: [],
      api: PRprorderList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PrOrderColumn',
      },
      proxyConfig: {
        autoLoad: false,
      } as any,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          queryType: status.value,
          ...params,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
    },
  });

  // 打开节点弹窗
  const handleNodeModal = record => {
    openNodeModal(true, {
      // api: getnodelist,
      id: record.id,
    });
  };

  const handleOpenReleaseMaterials = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    // 只能勾选不公开的
    const hasInvalidStatus = rows.some(item => item.isOpen === 1);
    if (hasInvalidStatus) {
      return createMessage.warning(t('tip.MPS.tip4')); // 只能勾选 未公开 状态数据进行操作
    }
    const ids = rows.map(item => item.id);
    openReleaseMaterials(true, { ids });
  };

  const handleOpenPlanUseDate = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    // 只能勾选不公开的
    const hasInvalidStatus = rows.some(item => item.isOpen === 1);
    if (hasInvalidStatus) {
      return createMessage.warning(t('tip.MPS.tip4')); // 只能勾选 未公开 状态数据进行操作
    }
    const ids = rows.map(item => item.id);
    openPlanUseDate(true, { ids });
  };

  // 新增
  const handleAdd = async () => {
    const formValue = await getFromValue();
    emit('handleAdd', { searchDate: formValue.searchDate, type: 'add', rows: {}, orderType: 2 });
  };

  const handleEdit = async () => {
    const formValue = await getFromValue();
    const rows = await getSelectRows();

    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    // 选择同一种PR来源进行操作
    const firstOrderType = rows[0].orderType;
    const hasSameType = rows.every(row => row.orderType === firstOrderType);
    if (!hasSameType) return createMessage.warning(t('tip.MPS.tip6')); // 请选择同一种PR来源的数据进行操作
    // 只能待处理、驳回、撤回才能编辑
    const isValidSelection = rows.every(row => [1, 3, 4].includes(row.orderStatus));
    if (!isValidSelection) return createMessage.warning(t('tip.MPS.tip10')); // 只有待处理、驳回、撤回状态的数据才能进行编辑，请重新选择

    emit('handleAdd', { searchDate: formValue.searchDate, type: 'edit', rows, orderType: firstOrderType });
  };

  // 批量删除
  const handelDelete = async () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    const hasErrorStatus = rows.some(item => item.orderType == 1);
    if (hasErrorStatus) {
      return createMessage.warning(t('tip.MPS.tip7')); // 只能删除手动新增的PR单
    }
    const ids = rows.map(item => item.id);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const res = await prBulkdelete(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  const handleWithdraw = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        const { code } = await prWithdraw(ids);
        if (code === 200) {
          reload();
        }
      },
    });
  };

  const handleStop = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchStopTip'),
      onOk: async () => {
        const { code } = await prStop(ids);
        if (code === 200) {
          reload();
        }
      },
    });
  };

  // 批量导出
  const handleExport = async () => {
    const formValue = await getFromValue();
    const weeksDayjs = dayjs(formValue.searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...formValue,
        ...(await getFetchParams()),
        queryType: status.value,
        searchDate: formValue.searchDate && yearWeekFormat,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    prorderExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  async function reloadTable() {
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    const weeks = getWeekDays(fields.searchDate);
    weeks.unshift({
      title: '备库存',
      field: 'reserveStock',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      width: 100,
      cellRender: {
        name: 'Number',
      },
    });
    const dataList = getColumn(props.activeKey).map(item => {
      if (item.field === 'time') {
        return {
          ...item,
          children: weeks,
        };
      } else {
        return { ...item };
      }
    });
    reloadColumn(dataList);
    reload();
  }

  async function handleReset() {
    await resetForm();
    reloadTable();
  }

  onMounted(() => {
    reloadTable();
  });

  defineExpose({ reloadTable });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
