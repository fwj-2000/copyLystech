<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- <a-button type="primary" @click="handleAssignReviewer">{{ t('views.filings.assignReviewer') }}</a-button> -->
            <a-button v-auth="'btn_review'" type="primary" @click="handleAudit">{{ t('common.audit') }}</a-button>
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="handleRevoke">{{ t('common.revoke') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            <!-- <div>
              <dynamicTableTitle @change="handleCurrentCustomerChange" />
            </div> -->
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>

  <ExportModal @register="registerExportModal" />
  <NodeModal @register="registerNodeModal" />
  <Teleport defer to="#popupWrap">
    <AssignReviewer @register="registerTransferModal" @reload="refresh" />
    <DetailPop @register="registerDetailPop" @reload="refresh"></DetailPop>
  </Teleport>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getList, exportExcel, bulkReviewTransfer, bulkBackReview } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumns } from './waitAuditConfig';
  import { getNodeList } from '/@/api/customerSerivce/customsAffairsApply';
  import { downloadByUrl } from '/@/utils/file/download';

  import ExportModal from '/@/components/ExportModal/index.vue';
  // import dynamicTableTitle from './components/dynamicTableTitle/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import DetailPop from './components/DetailPop.vue';
  import AssignReviewer from './components/AssignReviewer.vue';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage, createConfirm } = useMessage();

  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const state = reactive<any>({
    dynamicColumn: getColumns().slice(2, -1),
    customerConfigId: '',
    FillingBillCustomerTemplateList: [],
    customerInfo: {},
    tplList: [],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'logisticAffairs-export-filings-maintain-waitAduit-list',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params, identification: 2, customerConfigId: state.customerConfigId }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, clearSelectedRowKeys, getSelectRowKeys, getSelectRows } = gridApi;

  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  function goDetail(record: any) {
    // if (!state.customerConfigId || state.customerConfigId == '') {
    //   createMessage.warning(t('common.chooseText') + ' ' + t('views.filings.customerText'));
    //   return;
    // }
    const { id } = record;
    openDetailPopup(true, {
      ids: [id],
      type: 'view',
      title: t('views.filings.filingsInfo'),
      customerConfigId: state.customerConfigId,
      customerInfo: state.customerInfo,
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  // 更新表头
  const handleCurrentCustomerChange = (e: number | string, option: any) => {
    // 拿到表头列表，重新排列显示
    state.customerConfigId = e;
    state.customerInfo = option;
    gridApi.reload();
  };

  // 导出功能
  const handleExport = async () => {
    // if (!state.customerConfigId || state.customerConfigId == '') {
    //   createMessage.warning(t('common.chooseText') + ' ' + t('views.filings.customerText'));
    //   return;
    // }

    const selectRows = getSelectRows();
    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    gridApi.setLoading(true);
    exportExcel({
      identification: '2',
      selectIds: selectRows.map(item => item.id).join(','),
      customerConfigId: state.customerConfigId,
    })
      .then(res => {
        res?.data?.url && downloadByUrl({ url: res.data.url });
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  };

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点详情 */
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  function handleAssignReviewer() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      title: t('views.filings.assignReviewer'),
      labelText: t('views.filings.reviewer'),
      submitCallback: (data: any) => {
        return bulkReviewTransfer({
          ids: idList,
          transferUserId: data.transferUser,
          transferRemarks: data.remarks,
        });
      },
    });
  }

  const handleAudit = async () => {
    // if (!state.customerConfigId || state.customerConfigId == '') {
    //   createMessage.warning(t('common.chooseText') + ' ' + t('views.filings.customerText'));
    //   return;
    // }

    const idList = getSelectRows();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    openDetailPopup(true, {
      ids: idList.map(el => {
        return el.id;
      }),
      type: 'audit',
      title: t('views.filings.filingsInfo'),
      customerConfigId: state.customerConfigId,
      customerInfo: state.customerInfo,
    });
  };

  /**
   * 撤回
   */
  const handleRevoke = async () => {
    const selectedRowKeys = getSelectRowKeys();
    if (selectedRowKeys?.length === 0) return createMessage.warning(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.withdrawSelectedData'),
      onOk: async () => {
        try {
          const { msg, code } = await bulkBackReview(selectedRowKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
          throw e;
        }
      },
    });
  };

  defineExpose({
    openDetail: goDetail,
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
