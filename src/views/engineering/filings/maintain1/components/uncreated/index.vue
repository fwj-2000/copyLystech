<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" @click="updateFiling">{{ t('common.maintenance') }}</a-button>
      <a-button @click="addOrUpdateHandle">{{ t('common.transfer') }}</a-button>
      <a-button @click="addOrUpdateHandle">{{ t('common.batchExport') }}</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction :actions="getTableActions(record)" />
      </template>
    </template>
  </BasicTable>

  <ExportModal @register="registerExportModal" />
  <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  <ApplyPop @register="registerApplyPop" @refresh="handleReload"></ApplyPop>
  <EditPopup @register="registerEditPopup" @refresh="handleReload"></EditPopup>
</template>

<script lang="ts" setup>
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { columns, formConfig, subColumns } from './config';
  import { getFilingsApplyList, exportTableData } from '/@/api/business/filings';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import ApplyPop from './ApplyPop.vue';
  import EditPopup from '../extends/EditPopup.vue';
  import { useModal } from '/@/components/Modal';
  // import { useRouter } from 'vue-router';
  // import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { downloadTemplate, importQuantitationApply, saveImportData } from '/@/api/business/quantitation';
  import { getFilingsList } from '/@/api/customerSerivce/index';

  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerEditPopup, { openPopup: openEditPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const { t } = useI18n();

  const [registerTable, { reload, getFetchParams, getSelectRows, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    api: getFilingsList,
    beforeFetch: params => {
      if (params.StartTime) {
        params.StartTime = dayjs(params.StartTime).format('YYYY-MM-DD');
      }
      if (params.EndTime) {
        params.EndTime = dayjs(params.EndTime).format('YYYY-MM-DD');
      }
      params.status = '0';
      params.Role = 1;
    },
    columns,
    useSearchForm: true,
    striped: true,
    ellipsis: true,
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
    // actionColumn: {
    //   width: 100,
    //   title: t('common.action'),
    //   dataIndex: 'action',
    // },
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 50,
    },
    tableSetting: {
      delStatus: true,
    },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
    },
    formConfig: formConfig as any,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        // auth: 'btn_view',
        onClick: handleView.bind(null, record.Id),
      },
    ];
  }

  function handleView(id) {
    console.log(id, 'handleView');
    // router.push({
    //   path: '/business/quantitation/requirement',
    //   query: {
    //     Qid: id,
    //   },
    // });
  }

  function updateFiling() {
    // createMessage.success('创建备案需求');
    // const selectKeys = getSelectRowKeys();
    // if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    openEditPopup(true, {
      type: 'view',
      ids: [],
      title: t('common.maintenance'),
    });
    // createConfirm({
    //   iconType: 'warning',
    //   title: t('common.tipTitle'),
    //   content: '确认创建备案需求？',
    //   onOk: async () => {
    //     try {
    //       const { code, msg } = await batchDelFilingsApply(selectKeys);
    //       if (code === 200) {
    //         createMessage.success(msg);
    //         reload();
    //       }
    //     } catch (e) {
    //       reload();
    //     }
    //   },
    // });
  }

  function addOrUpdateHandle() {
    const list = getSelectRows();
    console.log(list, '======================');
    openMenuPopup(true, {
      type: 'add',
      // title: t('common.add'),
      title: t('views.customerService.filingRequirement'),
      list: list || [],
    });
  }
  // const router = useRouter();
  // function goDetail(QId = '') {
  //   if (!QId) {
  //     return message.info('无量试来源');
  //   }
  //   router.push({
  //     path: '/business/quantitation/requirement',
  //     query: {
  //       Qid: QId,
  //     },
  //   });
  // }

  function handleReload() {
    reload();
    clearSelectedRowKeys();
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importQuantitationApply,
      importSaveApi: saveImportData,
      templateApi: downloadTemplate,
      previewColumn: columns.concat(subColumns),
    });
  }

  const handleExport = async () => {
    openExportModal(true, {
      api: exportTableData,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
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

  .ant-form {
    padding: 10px 12px 0;
    margin-bottom: 12px;
    position: relative;

    &::after {
      background: @app-main-background;
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 10px;
      // border-left: 16px solid transparent;
      // border-right: 16px solid transparent;
      // border-bottom: 16px solid #f2f2f2;
    }
  }
</style>
