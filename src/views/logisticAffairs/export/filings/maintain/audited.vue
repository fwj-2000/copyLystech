<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_modify'" type="primary" @click="handleModify">{{ t('common.modify') }}</a-button>
            <!-- <a-button v-auth="'btn_recall'" type="primary" @click="handleRevoke">{{ t('common.revoke') }}</a-button> -->
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
    <ApplyPop @register="registerApplyPop" @reload="refresh"></ApplyPop>
    <DetailPop @register="registerDetailPop" @reload="refresh"></DetailPop>
  </Teleport>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getList, exportExcel, bulkBackReview } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumns } from './auditedConfig';
  import { getNodeList } from '/@/api/customerSerivce/customsAffairsApply';
  import { downloadByUrl } from '/@/utils/file/download';

  import ExportModal from '/@/components/ExportModal/index.vue';
  // import dynamicTableTitle from './components/dynamicTableTitle/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import DetailPop from './components/DetailPop.vue';
  import ApplyPop from './components/ApplyPop.vue';

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
      id: 'logisticAffairs-export-filings-maintain-aduited-list',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params, identification: 3, customerConfigId: state.customerConfigId }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, clearSelectedRowKeys, getSelectRowKeys } = gridApi;

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

    const selectRows = gridApi.getSelectRows();
    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    gridApi.setLoading(true);
    exportExcel({
      identification: '3',
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

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  /** 修改 */
  function handleModify() {
    const list = gridApi.getSelectRows().map(item => item.id);

    if (list.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    openMenuPopup(true, {
      ids: list,
      customerConfigId: state.customerConfigId,
      customerInfo: state.customerInfo,
      isModify: true,
    });
  }

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
