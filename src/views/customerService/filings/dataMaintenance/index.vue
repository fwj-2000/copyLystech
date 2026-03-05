<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" ghost v-auth="'btn_extra_download'" @click="handleDown">{{
              t('views.filings.filingsInfo') + t('component.upload.download')
            }}</a-button>
            <!-- <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button> -->
            <dynamicTableTitle type="view" @change="handleCurrentCustomerChange"></dynamicTableTitle>
          </template>

          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>

  <ExportModal @register="registerExportModal" />
  <!-- <ApplyPop @register="registerApplyPop" @refresh="reload"></ApplyPop> -->
  <!-- <downModal @register="registerDownModal"></downModal> -->
  <!-- <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal> -->
  <DetailPop @register="registerDetailPop" @refresh="reload"></DetailPop>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getColumns, getFormConfig } from './config';
  import { expostReplayCustom } from '/@/api/business/filings';
  // import { exportCharts } from '/@/api/customerSerivce/filling';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import DetailPop from '/@/views/logisticAffairs/export/filings/maintain/components/DetailPop.vue';
  import dynamicTableTitle from '/@/views/logisticAffairs/export/filings/maintain/components/dynamicTableTitle/index.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  // import downModal from './components/DownModal.vue';
  // import ApplyPop from './components/ApplyPop.vue';
  // import { ImportModal } from '/@/components/ImportModal';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  // import { configList } from '/@/api/customerSerivce/filling';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCustomsAffairsInfoList, exportCustomsAffairsInfo } from '/@/api/customerSerivce/customsAffairsApply';
  import { omit } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'logisticAffairs-filings-demand' });

  // const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  // const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerDownModal, { openModal: openDownModal }] = useModal();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  const { createMessage } = useMessage();

  const { t } = useI18n();

  const state = reactive({
    customerConfigId: '',
    customerInfo: {},
    tplList: [],
  });

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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-filings-dataMaintenance-list',
      columns: getColumns() as any,
      api: (params: any) => getCustomsAffairsInfoList({ ...params, customerConfigId: state.customerConfigId }),
      pagerConfig: {
        autoHidden: false,
      },
      // toolbarConfig: {
      //   delStatus: true
      // },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, getFetchParams, getSelectRowKeys /** clearSelectedRowKeys */ } = gridApi;

  // function getForm() {
  //   return gridApi.formApi;
  // }

  // 表头功能
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: goDetail.bind(null, record),
      },
      // {
      //   icon: 'icon-ym icon-ym-edit',
      //   auth: 'btn_edit',
      //   onClick: goEdit.bind(null, record),
      // },
      // {
      //   icon: 'icon-ym icon-ym-lianxi',
      //   auth: 'btn_call',
      //   onClick: goCall.bind(null, record),
      // },
    ];
  }

  function goDetail(record) {
    // const { Id, QId } = record;
    // openDetailPopup(true, {
    //   ids: [Id],
    //   role: 'GW',
    //   qid: QId,
    //   type: 'view',
    //   title: t('views.filings.filingsInfo'),
    // });
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

  // function goEdit(record) {
  //   const { Id, QId } = record;
  //   openMenuPopup(true, {
  //     id: Id,
  //     qid: QId,
  //     role: 'KF',
  //     type: 'edit',
  //     title: t('common.editText'),
  //     list: [record],
  //   });
  // }
  // function goCall(record) {
  //   const { Id, QId } = record;
  //   openMenuPopup(true, {
  //     id: Id,
  //     qid: QId,
  //     role: 'KF',
  //     type: 'call',
  //     title: '告知用户',
  //     list: [record],
  //   });
  // }

  // const handleExport = async () => {
  //   const params = await getFetchParams();
  //   const { pager } = gridApi.grid.getProxyInfo()!;

  //   openExportModal(true, {
  //     api: expostReplayCustom,
  //     listQuery: { ...params, ...omit(pager, 'total'), customerConfigId: state.customerConfigId },
  //     exportOptions: getColumns().slice(2, -1),
  //     nameProps: 'title',
  //     idProps: 'field',
  //     i18nConfig: {
  //       moduleCode: 'CAApplyColumn',
  //     },
  //   });
  // };

  const handleDown = () => {
    // openDownModal(true, {
    //   ids: getSelectRowKeys(),
    // });
    const ids = getSelectRowKeys();
    if (!ids || ids.length === 0) return createMessage.warn(t('common.selectText'));
    if (state.customerConfigId === '') return createMessage.info(t('common.pleaseSelectCustomer'));
    gridApi.setLoading(true);
    exportCustomsAffairsInfo({
      selectIds: ids.join(','),
      customerConfigId: state.customerConfigId,
    })
      .then(res => {
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  };

  // 更新表头
  const handleCurrentCustomerChange = (e: string, option: any) => {
    state.customerConfigId = e;
    state.customerInfo = option;
    gridApi.reload();
  };
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
