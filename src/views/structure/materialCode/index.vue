<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_code'" type="primary" @click="handleCode"> {{ t('dict.PurchaseQuotation.Tag.1') }} </a-button>
            <a-button v-auth="'btn_transfer'" type="primary" @click="handleBatchTransfer"> {{ t('dict.Flow.NodeAction.4') }} </a-button>
            <!-- <a-button v-auth="'btn_upload'" type="primary" @click="batchImportFile"> {{ t('common.importText') }} </a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">
              {{ t('common.batchExport') }}
            </a-button> -->
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'importUpdate' })" v-if="hasBtnP('btn_uploadUpdate')">{{ t('common.batchImportUpdate') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button @click="handleReject" v-auth="'btn_reject'"> {{ t('common.rejectText') }} </a-button>
            <!-- <a-button v-auth="'btn_upload'" @click="handleImport">
              {{ t('common.batchImport') }}
            </a-button> -->
            <a-button @click="batchModify({ key: 'strategyMaterial' })" v-auth="'btn_batchModifyStrategyMaterial'"> {{ t('common.updateSelected') }} </a-button>
            <a-button @click="batchModify({ key: 'baseInfo' })" v-auth="'btn_batchModifyBaseInfo'"> {{ t('common.updateBase') }} </a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleBatchDelete">
              {{ t('common.batchDelText') }}
            </a-button>
            <!-- 推送3.8 -->
            <a-button v-auth="'btn_sync38'" :loading="sync38Loaindg" @click="handleSync38"> {{ t('dict.CommonCol.syncEquipmentLedger') }} </a-button>
          </template>
          <!-- <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template> -->
          <template #files="{ row }">
            <span v-if="row.materialDevelopImportId" class="table-a" @click="handleFileView(row)"> {{ t('dict.DocumentControlColumn.files') }} </span>
            <span v-else>/</span>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeDetail(row)">{{ t('common.viewDetails') }}</span>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <viewPopup @register="registerViewModal" @reload="reload"></viewPopup>
    <NodeModal @register="registerModal"></NodeModal>
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <FileListModal @register="registerFileList"></FileListModal>
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <BaseInfoPopup @register="registerBaseInfoPopup" @reload="reload" />
    <StrategyMaterialPopup @register="registerStrategyMaterialPopup" @reload="reload" />
    <TransferModal @register="registerTransferModal" @reload="gridApi.reload"></TransferModal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getList,
    exportExcel,
    reject,
    getNodelist,
    template,
    importPreview,
    saveImportData,
    importTask,
    importTaskData,
    cancelImportTask,
    importTaskRead,
    bulkDelete,
    getTransferuserAPI,
    sync38MaterialInfo,
  } from '/@/api/structure/materialCode';
  import { getMaterialList } from '/@/api/purchase/materialBase';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { columns, importColumns } from './configVxe';
  import viewPopup from './components/DetailPopupVxe.vue';
  import { NodeModal, TransferModal, RejectModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import { FileListModal } from '/@/components/Upload';
  import { fileDownload, getFiles } from '/@/api/purchase/importMateria';
  import { ImportModal } from '/@/components/ImportModal';
  import BaseInfoPopup from './components/baseInfoPopup.vue';
  import StrategyMaterialPopup from './components/strategyMaterialPopup.vue';
  import { omit } from 'lodash-es';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  defineOptions({ name: 'structure-materialCode' });

  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerViewModal, { openPopup: openViewModal }] = usePopup();
  const [registerModal, { openModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerBaseInfoPopup, { openPopup: openBaseInfoPopup }] = usePopup();
  const [registerStrategyMaterialPopup, { openPopup: openStrategyMaterialPopup }] = usePopup();
  const { hasBtnP } = usePermission();

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
      schema: [
        {
          fieldName: 'status',
          label: '',
          component: 'Select',
          componentProps: {
            allowClear: true,
            placeholder: '状态',
            options: [
              {
                label: t('common.pendingEntry'),
                value: 23,
              },
              {
                label: t('common.existEntry'),
                value: 24,
              },
              { label: t('common.rejectText'), value: 3 },
            ],
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'materialCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料内部料号',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'originalModelNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '原厂商型号',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'materialAreaId',
          i18nField: 'materialAreaName',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '材料归属',
            allowClear: true,
            api: getMaterialList,
            apiSearch: {
              show: false,
            },
            params: {
              isSelectRoot: 'true',
              displayArea: 'MaterialWarehouse',
            },
            resultField: 'data.list',
            labelField: 'fullName',
            valueField: 'id',
            showSearch: false,
            immediate: true,
            filterOption: false,
          },
        },
        {
          fieldName: 'materialClassName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料类型',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'threeLevelName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '三级分类',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'materialQualityName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '基材类型',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },

        {
          fieldName: 'totalThickness',
          i18nField: 'materialThicknessTotal',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '总厚度',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },

        {
          fieldName: 'materialColor',
          i18nField: 'colour',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '颜色',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'materialDesc',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料描述',
            allowClear: true,
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'isStrategyMaterial',
          i18nField: 'isStrategyMaterialDesc',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: '是否可选',
            allowClear: true,
            options: [
              { label: '否', value: '0' },
              { label: '是', value: '1' },
            ],
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'creatorUserId',
          i18nField: 'creatorUserName',
          label: '',
          component: 'CustomUserSelect',
          componentProps: {
            placeholder: '创建人',
            submitOnPressEnter: true,
            allowClear: true,
          },
        },
        {
          fieldName: 'lastModifyUserId',
          i18nField: 'CommonCol.updateUser',
          label: '',
          component: 'CustomUserSelect',
          componentProps: {
            placeholder: '修改人',
            submitOnPressEnter: true,
            allowClear: true,
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'structure-materialCode',
      api: getList,
      columns: columns as any,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  function reload() {
    gridApi.reload();
  }

  const handleReject = async () => {
    const idList = gridApi.getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: reject,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };

  function handleNodeDetail(record) {
    openModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }
  function handleCommon(method, tipText) {
    const selectKeys = gridApi.getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tipText,
      onOk: async () => {
        try {
          const { code, msg } = await method(selectKeys);
          if (code === 200) {
            gridApi.clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          gridApi.clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  function handleFileView(record) {
    if (record.materialDevelopImportId) {
      openFileList(true, {
        id: record.materialDevelopImportId,
        downloadApi: fileDownload,
        listApi: getFiles,
        hideVersion: true,
        title: t('dict.MaterialDevelopApplyColumn.files'),
      });
    }
  }

  // 处理转办
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  // 批量转办
  const handleBatchTransfer = async () => {
    const ids = gridApi.getSelectRows() || [];
    if (ids && ids.length === 0) {
      return message.warning(t('common.selectTransferContent'));
    }
    openTransferModal(true, {
      id: ids || [],
      submitCallback: handleTransferCB,
    });
  };

  const handleTransferCB = async data => {
    const r = await getTransferuserAPI({
      ids: data.id.map(el => el.id),
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };

  // function getTableActions(record): ActionItem[] {
  //   return [
  //     {
  //       icon: 'icon-ym icon-ym-btn-edit',
  //       onClick: handleEdit.bind(null, record),
  //       auth: 'btn_detail',
  //     },
  //   ];
  // }

  function handleCode() {
    const selectedRows = gridApi.getSelectRows();
    // 获取选中的数据，并且过滤掉状态为 `已录入(24)`
    const idList = selectedRows.filter(item => item.status !== 24).map(item => item.id);
    if (selectedRows.length > 0 && idList.length === 0) {
      return message.warning(t('common.existEntryTip'));
    }

    if (idList.length) {
      return openViewModal(true, {
        ids: idList,
        roleType: 2,
      });
    }
    message.info(t('common.selectText'));
  }

  // function handleEdit(record) {
  //   openViewModal(true, {
  //     ids: [record.id],
  //     roleType: 2,
  //   });
  // }

  async function handleExport() {
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // 批量导入
  const batchImportFile = isUpdate => {
    // 添加导入传参判断
    const apiParams: any = {};
    if (isUpdate == 1) {
      apiParams.importPreview = {
        isUpdate: 1,
      };
    }
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: template,
      previewColumn: importColumns,
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: importTask,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: apiParams,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  };

  function batchImportOrExport({ key }) {
    switch (key) {
      case 'import':
        batchImportFile(0);
        break;
      case 'importUpdate':
        batchImportFile(1);
        break;
      default:
        handleExport();
        break;
    }
  }

  function handleBatchDelete() {
    handleCommon(bulkDelete, t('common.delTip'));
  }

  /**
   * 批量修改
   */
  function batchModify({ key }) {
    const selectKeys = gridApi.getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    if (key === 'baseInfo') {
      // 修改基础资料
      openBaseInfoPopup(true, { ids: selectKeys });
    } else if (key === 'strategyMaterial') {
      openStrategyMaterialPopup(true, { ids: selectKeys });
    }
  }

  const sync38Loaindg = ref<boolean>(false);
  /**
   * 推送数据到3.8
   */
  function handleSync38() {
    const selectKeys = gridApi.getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    sync38Loaindg.value = true;
    sync38MaterialInfo(selectKeys)
      .then(() => {
        createMessage.success(t('common.operatorSuccess'));
        reload();
      })
      .finally(() => {
        sync38Loaindg.value = false;
      });
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym) {
    font-size: 18px;
  }
</style>
