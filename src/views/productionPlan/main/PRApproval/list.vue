<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 同意-auth="'btn_approve'" -->
              <a-button type="primary" v-if="activeKey === 'pending'" @click="handleAgree">{{ t('common.agree') }}</a-button>
              <!-- 驳回 -->
              <a-button type="primary" ghost @click="handleReject" v-if="activeKey === 'pending'">{{ t('common.rejectText') }}</a-button>
              <!-- 撤回 -->
              <!-- /Information/prorder/withdraw -->
              <a-button type="primary" ghost v-if="activeKey === 'pending'" @click="handleWithdraw">{{ t('common.revoke') }}</a-button>
              <a-button type="primary" ghost v-if="activeKey === 'pending'" @click="handleStop">{{ t('common.stopText') }}</a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <a-button class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
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
    <RejectModal @register="registerRejectModal" @reload="reload" />
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
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  import { getAuditpage, exportaudit, prAgree, prReject, prWithdraw, prStop } from '/@/api/mps/productionPlan/MPS';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { RejectModal, NodeModal } from '/@/components/CustomComponents';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 1 : 2;
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗

  const [Grid, { reload, getSelectRowKeys, getFetchParams, reloadColumn, resetForm, getFromValue, setLatestSubmissionValues }] = useVbenVxeGrid({
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
      id: props.activeKey === 'pending' ? 'productionPlan-main-PRApproval-list-wait12' : 'productionPlan-main-PRApproval-list-done23',
      columns: [],
      api: getAuditpage,
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
      id: record.id,
    });
  };

  const handleAgree = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchConsentTip'),
      onOk: async () => {
        const { code } = await prAgree(ids);
        if (code === 200) {
          reload();
        }
      },
    });
  };

  const handleReject = async () => {
    const ids = getSelectRowKeys() || [];
    if (ids.length) {
      return openRejectModal(true, {
        api: prReject,
        ids,
      });
    }
    message.warning(t('common.selectText'));
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
    exportaudit(query).then(res => {
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
