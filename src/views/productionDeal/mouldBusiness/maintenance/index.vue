<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增维修 -->
              <a-button v-auth="'btn_addMaintenance'" type="primary" @click="() => showMaintenancePopup({})">{{
                t('dict.mouldBusiness.addMouldMaintenance')
              }}</a-button>
              <!-- 新增异常 -->
              <a-button v-auth="'btn_addAbnormal'" type="primary" @click="() => showAbnormalPopup({})">{{ t('dict.mouldBusiness.addMouldAbnormal') }}</a-button>
              <!-- 免费改付费 -->
              <a-button v-auth="'btn_changeToPaid'" type="primary" ghost @click="changeFreeToPay">{{ t('dict.mouldBusiness.freeToPayChange') }}</a-button>
              <!-- 终止维修 -->
              <a-button v-auth="'btn_stopMaintenance'" danger ghost class="danger-btn" @click="showTerminateMaintenanceModal">{{
                t('dict.mouldBusiness.terminateMaintenance')
              }}</a-button>
              <!-- 撤回 -->
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('views.filings.sureRevokeData'),
                    onOk: handleRecall.bind(null),
                  },
                  type: 'primary',
                  ghost: true,
                  class: 'purple-btn',
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <!-- 终止 -->
              <a-button v-auth="'btn_stop'" ghost danger class="danger-btn" @click="handleStop">{{ t('common.stopText') }}</a-button>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" ghost danger class="danger-btn" @click="handleBatchDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #moldRepairApplyNo="{ row }">
            <span class="table-a" @click="openDetail(row)">{{ row.moldRepairApplyNo }}</span>
          </template>
          <template #repairChangeLog="{ row }">
            <span class="table-a" @click="showRepairRecordDetail(row)">{{ t('common.viewDetails') }}</span>
          </template>
          <template #drawingsName="{ row }">
            <span v-if="row.drawingsId" class="table-a" @click="handlePreview(row)">{{ row.drawingsName }}</span>
            <FileCell v-else :list="row.fileJson" @click="handlePreview" />
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>

    <!-- 导出 界面 -->
    <ExportModal @register="registerExportModal" />
    <!-- 节点详情 界面 -->
    <NodeModal @register="registerNodeModal" />
    <!-- 终止 界面 -->
    <StopModal @register="registerStopModal" @reload="reload" />
    <!-- 免费转付费 界面 -->
    <FreeToPayModal @register="registerFreeToPayModal" @reload="reload" />
    <!-- 终止维修 -->
    <TerminateMaintenanceModal @register="registerTerminateMaintenanceModal" @reload="reload" />
    <!-- 维修记录 -->
    <RepairModifyRecordModal @register="registerRepairModifyRecordModal" @reload="reload" />

    <!-- 申请维修 -->
    <MaintenancePopup @register="registerMaintenancePopup" @reload="reload" />
    <!-- 申请异常 -->
    <AbnormalPopup @register="registerAbnormalPopup" @reload="reload" />
    <!-- 文件预览 -->
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import {
    getMoldBusinessMaintenanceList,
    bulkbackreview,
    bulktermination,
    exportExcel,
    getDetailById,
    batchDelete,
  } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumn, STATUS_ENUM, DEMAND_TYPE_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TYPE_ENUM as ABNORMAL_TYPE_ENUM } from './components/abnormalPopupConfig';
  import { TYPE_ENUM as MAINTENANCE_TYPE_ENUM } from './components/maintenancePopupConfig';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  import { ModelConfirmButton } from '/@/components/Button';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import MaintenancePopup from './components/maintenancePopup.vue';
  import AbnormalPopup from './components/abnormalPopup.vue';
  import FreeToPayModal from './components/freeToPayModal.vue';
  import TerminateMaintenanceModal from './components/terminateMaintenanceModal.vue';
  import RepairModifyRecordModal from './components/repairModifyRecordModal.vue';
  import { PreviewModal, FileCell } from '/@/components/Upload';

  defineOptions({ name: 'productionDeal-mouldBusiness-maintenance' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-mouldBusiness-maintenance-list',
      columns: getColumn(),
      api: (params: any) => getMoldBusinessMaintenanceList({ ...params }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
      rowStyle: ({ row }) => {
        if (row.isOvertime) {
          return { background: '#FF4D4F10', color: '#FF4D4F' };
        }
        return {};
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload, getSelectRows, clearSelectedRowKeys } = gridApi;

  function handleNodeModal(record) {
    openNodeModal(true, {
      id: record.id,
    });
  }

  async function handleRecall() {
    // const selectedRows = getSelectRows() || [];

    // const idList = selectedRows.reduce((arr, item) => {
    //   arr.push(item.id);
    //   return arr;
    // }, []);
    // if (idList.length === 0 && selectedRows.length !== 0) {
    //   message.warning(t('dict.SampleApply.revokeTip'));
    //   return Promise.resolve();
    // }

    const idList = getSelectRowKeys() || [];

    if (idList.length) {
      return bulkbackreview(idList)
        .catch(() => {})
        .finally(reload);
    }
    message.info(t('common.selectText'));
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      exportOptions: getColumn().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    });
  };

  // 删除
  async function handleBatchDelete() {
    const selectRows = getSelectRows();

    if (selectRows.some(item => `${item.status}` !== `${STATUS_ENUM.暂存}`)) {
      message.warning(t('dict.SampleApply.applyDeleteTip'));
      return false;
    }

    const selectedRowKeys = selectRows.map(item => item.id);
    if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: async () => {
        try {
          const res = await batchDelete(selectedRowKeys);
          if (res.code === 200) {
            clearSelectedRowKeys();
            message.success(t('sys.api.operationSuccess'));
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  //  终止
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openStopModal(true, {
      api: bulktermination,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          idList: idList,
          remark: params.remark,
        };
      },
    });
  }

  // 维修详情
  const [registerMaintenancePopup, { openPopup: openMaintenancePopup }] = usePopup();
  /**
   * 展示维修详情弹窗
   */
  function showMaintenancePopup(data: any = {}) {
    openMaintenancePopup(true, data);
  }

  // 异常详情
  const [registerAbnormalPopup, { openPopup: openAbnormalPopup }] = usePopup();
  /**
   * 展示异常详情弹窗
   */
  function showAbnormalPopup(data: any = {}) {
    openAbnormalPopup(true, data);
  }

  function openDetail(row: any) {
    if (`${row.demandType}` === DEMAND_TYPE_ENUM.在库维修) {
      showMaintenancePopup({
        ...row,
        type: MAINTENANCE_TYPE_ENUM.编辑,
      });
    } else {
      showAbnormalPopup({
        ...row,
        type: ABNORMAL_TYPE_ENUM.编辑,
      });
    }
  }

  const [registerFreeToPayModal, { openModal: openFreeToPayModal }] = useModal();
  /** 免费改付费 */
  function changeFreeToPay() {
    const rows = getSelectRows() || [];
    if (!rows.length) {
      return message.info(t('common.selectText'));
    }
    // 校验是否存在付费单，若是存在，则提示不给予操作
    const hasPayORder = rows.find(item => item.repairType == 2);
    if (hasPayORder) {
      message.error(t('存在维修单为付费单，不能进行免费改付费操作'));
      return;
    }

    openFreeToPayModal(true, { ids: rows.map(item => item.id) });
  }

  const [registerTerminateMaintenanceModal, { openModal: openTerminateMaintenanceModal }] = useModal();
  /** 终止维修 */
  function showTerminateMaintenanceModal() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openTerminateMaintenanceModal(true, { ids: idList });
  }

  const [registerRepairModifyRecordModal, { openModal: openRepairModifyRecordModal }] = useModal();
  /**
   * 查看维修类型变更日志
   * @param row 行数据
   */
  function showRepairRecordDetail(row: any) {
    openRepairModifyRecordModal(true, { id: row.id });
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item: any) {
    const params = item.drawingsId
      ? {
          name: item.drawingsName,
          Id: item.drawingsId,
          previewType: 'localPreview',
          noCache: false,
          isCopy: 0,
          // previewApi: Promise.resolve(),
        }
      : {
          name: item.fileName,
          filePath: item.filePath,
          version: 2,
        };
    filePreviewRef.value?.init(params);
  }

  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    getDetailById(params.id).then(res => {
      openDetail(res.data);
    });
  });
</script>

<style lang="less" scoped>
  .purple-btn,
  .purple-btn:not(:disabled):hover {
    color: #da5bfb;
    border-color: #da5bfb;
  }

  .danger-btn.ant-btn-default.ant-btn-background-ghost,
  .danger-btn:not(:disabled):hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
</style>
