<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 同步SAPv-auth="'btn_approve'" -->
              <a-button type="primary" @click="syncSAP">{{ t('common.syncSap') }}</a-button>
              <!-- 释放独占物料 -->
              <a-button type="primary" ghost @click="releaseMaterials">{{ t('dict.PRList.releaseExclusiveMaterial') }}</a-button>
              <!-- 计划使用日期 -->
              <a-button type="primary" ghost @click="handleOpenPlanUseDate">{{ t('tip.PR.adjustPlanUseDate') }}</a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <a-button class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>

          <template #poOrderNo="{ row }">
            <div class="table-a cursor-pointer" @click="openPODetail(row)"> {{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <ReleaseMaterialsModal @register="registerReleaseMaterialsModal" @reload="reloadTable"> </ReleaseMaterialsModal>
    <PlanUseDateModal @register="registerPlanUseDate" @reload="reloadTable"> </PlanUseDateModal>
    <PODetailListModal @register="registerPODetailList" @reload="reloadTable"> </PODetailListModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted } from 'vue';
  import { poOrderList, poOrderExport, poSyncsap } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ReleaseMaterialsModal from './components/ReleaseMaterialsModal.vue';
  import PlanUseDateModal from './components/PlanUseDateModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  import dayjs from 'dayjs';
  import PODetailListModal from './components/PODetailListModal.vue';

  defineOptions({ name: 'productionPlan-main-POList' });

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  const emit = defineEmits(['handleAdd']);

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerReleaseMaterialsModal, { openModal: openReleaseMaterialsModal }] = useModal();
  const [registerPlanUseDate, { openModal: openPlanUseDate }] = useModal();
  const [registerPODetailList, { openModal: openPODetailList }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams, reloadColumn, getSelectRowKeys, getFromValue, setLatestSubmissionValues, resetForm }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      handleSubmit: reloadTable,
      handleReset,
      // i18nConfig: {
      //   moduleCode: 'PoOrderColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'productionPlan-main-POList-list',
      columns: [],
      api: poOrderList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PoOrderColumn',
      },
      proxyConfig: {
        autoLoad: false,
      } as any,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
    },
  });

  // 同步SAP
  const syncSAP = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.POList.syncSAPTip'),
      onOk: async () => {
        const res = await poSyncsap(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 释放独占物料
  const releaseMaterials = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    // 只能勾选不公开的
    const hasInvalidStatus = rows.some(item => item.isOpen === 1);
    if (hasInvalidStatus) {
      return createMessage.warning(t('tip.MPS.tip4')); // 只能勾选 未公开 状态数据进行操作
    }
    const ids = rows.map(item => item.id);
    openReleaseMaterialsModal(true, { ids });
  };

  // 计划使用日期
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

  const openPODetail = row => {
    openPODetailList(true, { prOrderNo: row.prOrderNo });
  };

  // 批量导出
  const handleExport = async () => {
    const formValue = await getFromValue();
    const weeksDayjs = dayjs(formValue.searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        searchDate: formValue.searchDate && yearWeekFormat,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    poOrderExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  async function reloadTable() {
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    console.log(fields.searchDate, 'fields.searchDate');
    const weeks = getWeekDays(fields.searchDate);
    weeks.unshift({
      title: '备库存',
      field: 'reserveStock',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 160,
      cellRender: {
        name: 'Number',
      },
    });
    const dataList = getColumn().map(item => {
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

  defineExpose({ reload });
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
