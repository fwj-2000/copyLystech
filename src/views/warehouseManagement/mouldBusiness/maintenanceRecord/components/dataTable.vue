<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 待处理 按钮 -->
              <template v-if="props.type === TABS_ENUM.待处理">
                <!-- 确认接收 -->
                <a-button v-auth="'btn_receive'" type="primary" @click="showConfirmReceiptModal">
                  {{ t('common.confirmReceipt') }}
                </a-button>
                <!-- 驳回 -->
                <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">
                  {{ t('common.rejectText') }}
                </a-button>
                <!-- 修改代维修供应商 -->
                <a-button v-auth="'btn_replaceSupplier'" @click="showModifySupplierModal">
                  {{ t('dict.mouldBusiness.modifyMaintenanceSupplier') }}
                </a-button>
                <!-- 转办 -->
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">
                  {{ t('common.transfer') }}
                </a-button>
              </template>
              <!-- 已处理按钮 -->
              <template v-else>
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
                  }">
                  <span>{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
              </template>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #moldRepairApplyNo="{ row }">
            <span class="table-a cursor-pointer" @click="openDetail(row)">{{ row.moldRepairApplyNo }}</span>
          </template>
          <template #repairChangeLog="{ row }">
            <span class="table-a cursor-pointer" @click="showRepairRecordDetail(row)" style="cursor: pointer">{{ t('common.view') }}</span>
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <!-- 导出 -->
    <ExportModal @register="registerExportModal" />
    <!-- 节点详情 -->
    <NodeModal @register="registerNodeModal" />
    <!-- 驳回 -->
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <!-- 转办 -->
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <!-- 确认接收 -->
    <ConfirmReceiptModal @register="registerConfirmReceiptModal" @reload="reload" />
    <!-- 修改代维修供应商 -->
    <ModifySupplierModal @register="registerModifySupplierModal" @reload="reload" />
    <!-- 维修记录 -->
    <RepairModifyRecordModal @register="registerRepairModifyRecordModal" @reload="reload" />

    <Teleport to="#ProductionDealMouldBusinessMaintenanceAudit">
      <MaintenancePopup @register="registerMaintenancePopup" @reload="reload" />
      <AbnormalPopup @register="registerAbnormalPopup" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { omit, cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMoldBusinessMaintenanceList, bulkbackreview, exportExcel, getnodelist, bulkreject } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RejectModal, TransferModal } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn } from './configVxe';
  import { TABS_ENUM } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TYPE_ENUM as MAINTENANCE_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopupConfig';
  import { TYPE_ENUM as ABNORMAL_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopupConfig';
  import { DEMAND_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/config';

  import MaintenancePopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopup.vue';
  import AbnormalPopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopup.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import ConfirmReceiptModal from './confirmReceiptModal.vue';
  import ModifySupplierModal from './modifySupplierModal.vue';
  import RepairModifyRecordModal from '/@/views/productionDeal/mouldBusiness/maintenance/components/repairModifyRecordModal.vue';

  const props = defineProps({
    type: {
      type: String as PropType<`${TABS_ENUM}`>,
      default: TABS_ENUM.待处理,
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const { createMessage } = useMessage();

  const { t } = useI18n();

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
      routeConfig: {
        enabled: true,
      },
    },
    gridOptions: {
      id: `warehouseManagement-mouldBusiness-maintenanceRecord-${props.type === TABS_ENUM.待处理 ? 'todo' : 'done'}-list`,
      columns: getColumn(),
      api: (params: any) => getMoldBusinessMaintenanceList({ ...params, identification: props.type }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    },
  });

  const { getSelectRowKeys, getSelectRows, getFetchParams, reload } = gridApi;

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getnodelist,
      id: record.id,
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), identification: props.type },
      api: exportExcel,
      exportOptions: getColumn().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    });
  };

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

  /**
   * 打开详情
   * @param row 详情数据
   */
  function openDetail(row: any) {
    if (`${row.demandType}` === DEMAND_TYPE_ENUM.在库维修) {
      showMaintenancePopup({
        ...row,
        type: MAINTENANCE_TYPE_ENUM.详情,
      });
    } else {
      showAbnormalPopup({
        ...row,
        type: ABNORMAL_TYPE_ENUM.详情,
      });
    }
  }

  /**
   * 撤回
   */
  async function handleRecall() {
    const selectedRows = getSelectRows() || [];

    // const idList = selectedRows.reduce((arr, item) => {
    //   // item.confirmStatus === STATUS_ENUM.不满足 && arr.push(item.id);
    //   arr.push(item.id);
    //   return arr;
    // }, []);
    // if (idList.length === 0 && selectedRows.length !== 0) {
    //   message.warning(t('dict.SampleApply.revokeTip'));
    //   return Promise.resolve();
    // }
    const idList = selectedRows.map(item => item.id);

    if (idList.length) {
      return bulkbackreview(idList).finally(reload);
    }
    message.info(t('common.selectText'));
    // return Promise.resolve();
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 驳回
   */
  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];

    if (idList.length) {
      return openRejectModal(true, {
        api: bulkreject,
        beforeFetch: (params: any) => {
          return {
            list: idList.map(item => ({
              id: item,
              rejectRemark: params.rejectRemark,
            })),
          };
        },
      });
    }
    message.info(t('common.selectText'));
  };

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  /**
   * 转办
   */
  function handleTransfer() {
    const checkedList = gridApi.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    openTransferModal(true, {
      id: gridApi.grid.getCheckboxRecords() || [],
      submitCallback: ({ remark, transferUser }) => {
        return Promise.resolve({ ids: checkedList.map(item => item.id), transferRemark: remark, reviewUserId: transferUser });
      },
    });
  }

  const [registerConfirmReceiptModal, { openModal: openConfirmReceiptModal }] = useModal();
  /**
   * 确认接收
   */
  function showConfirmReceiptModal() {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    openConfirmReceiptModal(true, selectedRows);
  }

  const [registerModifySupplierModal, { openModal: openModifySupplierModal }] = useModal();
  /**
   * 修改代维修供应商
   */
  function showModifySupplierModal() {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    openModifySupplierModal(true, cloneDeep(selectedRows));
  }

  const [registerRepairModifyRecordModal, { openModal: openRepairModifyRecordModal }] = useModal();
  /**
   * 查看维修类型变更日志
   * @param row 行数据
   */
  function showRepairRecordDetail(row: any) {
    openRepairModifyRecordModal(true, { id: row.id });
  }

  async function searchDataByCode(code: string) {
    return gridApi.setFieldValue('moldRepairApplyNo', code).then(() => gridApi.query());
  }

  defineExpose({
    openDetail,
    searchDataByCode,
  });
</script>
