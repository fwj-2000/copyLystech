<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <template v-for="item in btnList" :key="item.auth">
              <a-button v-if="!item.type" v-show="!item.hidden" v-auth="item.auth" :type="item?.props?.type" :ghost="item?.props?.ghost" @click="item.onClick">
                {{ item.label }}
              </a-button>
              <vShowDropdown v-if="item.type === 'btn_download_and_btn_upload' && !item.hidden">
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button>{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
            </template>
          </template>
          <template #actionLog="{ row }">
            <span class="table-a" @click="handleViewDetail('actionLog', row)">{{ t('common.view') }}</span>
          </template>
          <template #useRecord="{ row }">
            <span class="table-a" @click="handleViewDetail('useRecord', row)">{{ t('common.view') }}</span>
          </template>
          <template #returnRecord="{ row }">
            <span class="table-a" @click="handleViewDetail('returnRecord', row)">{{ t('common.view') }}</span>
          </template>
          <template #maintenanceRecord="{ row }">
            <span class="table-a" @click="handleViewDetail('repairRecord', row)">{{ t('common.view') }}</span>
          </template>
          <template #moldDrawing="{ row }">
            <span class="table-a" @click="handleDrawView(row)">{{ t('common.view') }}</span>
          </template>
        </Grid>
      </div>
    </div>
    <!-- 导出 -->
    <ExportModal @register="registerExportModal" />
    <!-- 修改代维修供应商 -->
    <ModifyBillModal @register="registerModifyBillInfoModal" @reload="reload" />
    <!-- 文件预览 -->
    <PreviewModal ref="previewModalRef" />
    <!-- 批量导入 -->
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <FileListModal @register="registerFile"></FileListModal>
  </div>
</template>

<script lang="ts" setup>
  import { omit, cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getMoidBillList,
    exportMoldLedger,
    backupData,
    updateShippingAddress,
    downloadTemplate,
    importPreview,
    getImportTasks,
    cancelImportTask,
    importTaskRead,
    importTaskData,
    batchSave,
  } from '/@/api/warehouse/moIdBill';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ModifyBillModal from './ModifyBillModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { tabsOptions, configModal, getFormConfig, importColumns } from './config';
  import { configViewModal } from './viewConfig';
  import { TABSKEY, BILLACTIONVIEW } from '../type';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { computed, ref } from 'vue';
  import { PreviewModal, FileListModal } from '/@/components/Upload';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { getFileInfoHistory } from '/@/api/engineering/drawingReview';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useRoute } from 'vue-router';
  const props = defineProps({
    type: {
      type: String as PropType<TABSKEY>,
      default: '1',
    },
  });
  const route = useRoute();
  const getCurrMenuId = computed(() => (route.meta.modelId as string) || '');
  // 按钮列表
  const btnList = computed(() => {
    const _Type = props.type || '1';
    const currentType: TABSKEY = typeof _Type === 'string' ? _Type : _Type?.toString();
    const list = [
      {
        auth: 'btn_backup',
        props: {
          type: 'primary',
        },
        onClick: handleDataBackup,
        label: t('common.backup'),
        hidden: currentType != '9',
      },
      {
        // 修改代维修供应商
        auth: 'btn_editSupllier',
        props: {
          type: 'primary',
        },
        onClick: handleModifyBillInfo.bind(null, 'editSupllier'),
        label: t('common.editReplaceSupplier'),
        hidden: currentType !== '1',
      },
      {
        // 调整仓位
        auth: 'btn_editShip',
        props: {
          type: 'primary',
        },
        onClick: handleModifyBillInfo.bind(null, 'editShip'),
        label: t('common.editShip'),
        hidden: !['4', '5', '6'].includes(currentType),
      },
      {
        // 修改货架号
        auth: 'btn_editShelvesNum',
        onClick: handleModifyBillInfo.bind(null, 'editShelvesNum'),
        props: {
          type: 'primary',
          ghost: true,
        },
        label: t('common.editShelvesNum'),
        hidden: !['1', '4'].includes(currentType),
      },
      {
        // 修改仓库地址
        auth: 'btn_shipAddress',
        onClick: handleShipAddr,
        label: t('common.editWareAddr'),
        hidden: !['1', '4'].includes(currentType),
      },
      //  剩余寿命
      {
        auth: 'btn_editRemainLife',
        props: {
          type: 'primary',
          ghost: true,
        },
        onClick: handleModifyBillInfo.bind(null, 'editRemainLife'),
        label: t('common.editExptLife'),
        hidden: !['1', '2', '4', '8', '9'].includes(currentType),
      },
      // 转报废
      {
        auth: 'btn_scrap',
        onClick: handleModifyBillInfo.bind(null, 'toScrap'),
        label: t('common.toscrap'),
        hidden: !['1', '4', '5'].includes(currentType),
      },
      // 转收货
      {
        auth: 'btn_toGeted',
        props: {
          type: 'primary',
          ghost: true,
        },
        onClick: handleModifyBillInfo.bind(null, 'toGeted'),
        label: t('common.toGeted'),
        hidden: currentType != '2',
      },
      // 转入库
      {
        auth: 'btn_toInShip',
        onClick: handleModifyBillInfo.bind(null, 'toInShip'),
        label: t('common.toInShip'),
        hidden: !['3', '5', '6', '7'].includes(currentType),
      },
      // 转封存
      {
        auth: 'btn_toStore',
        onClick: handleModifyBillInfo.bind(null, 'toStore'),
        label: t('common.toStore'),
        hidden: !['1', '4'].includes(currentType),
      },
      {
        auth: 'btn_remarks',
        onClick: handleModifyBillInfo.bind(null, 'editRemark'),
        label: t('common.editRm'),
      },
      {
        auth: 'btn_download',
        type: '',
        onClick: handleExport,
        label: t('common.batchExport'),
      },
      {
        auth: 'btn_upload',
        type: '',
        onClick: handleImport,
        label: t('common.batchImport'),
        hidden: currentType !== '1',
      },
    ];

    if (currentType === '1' && hasBtnP('btn_download') && hasBtnP('btn_upload')) {
      const btnDownloadIndex = list.findIndex(item => item.auth === 'btn_download');
      list.splice(btnDownloadIndex, 2, {
        auth: 'btn_download,btn_upload',
        type: 'btn_download_and_btn_upload',
        onClick: () => {},
        label: t('common.batchImportOrExport'),
        hidden: false,
      });
    }

    return list;
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal(); // 导出弹窗
  const [registerModifyBillInfoModal, { openModal: openModifyBillInfoModal }] = useModal(); // 修改供应商弹窗
  const [registerFile, { openModal: openFileList }] = useModal();

  const { createMessage, createConfirm } = useMessage();

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 按下回车时是否提交表单
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `warehouse-mouldBusiness-bill-${tabsOptions[props.type].id}`,
      columns: handleColumn(tabsOptions[props.type].columns),
      beforeFetch: params => {
        return {
          ...params,
          identification: tabsOptions[props.type].key,
        };
      },
      api: getMoidBillList,
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
      showIndexColumn: true,
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  const { getSelectRows, getSelectRowKeys, getFetchParams, reload } = gridApi;

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), identification: tabsOptions[props.type].key },
      api: exportMoldLedger,
      exportOptions: handleColumn(tabsOptions[props.type].columns),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
    });
  };

  // 导入
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: batchSave,
      templateApi: downloadTemplate,
      previewColumn: importColumns,
      usePolling: true,
      pollingParams: {
        getTaskStatus: getImportTasks,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  /**
   * 修改台账基础信息
   */
  function handleModifyBillInfo(key: string) {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    const params = configModal[key];
    params.list = selectedRows.map(item => {
      return {
        ...item,
        factoryCode: item.factory.split('/')[0],
      };
    });
    openModifyBillInfoModal(true, params);
  }

  // 查看操作详情
  function handleViewDetail(key: BILLACTIONVIEW, row) {
    const params = configViewModal[key];
    params.detailApiParams = { id: row.id };
    openModifyBillInfoModal(true, params);
  }

  // 数据备份
  function handleDataBackup() {
    createConfirm({
      title: t('common.backup'),
      iconType: 'info',
      content: t('tip.beforeBackup'),
      okText: t('common.backupStart'),
      onOk: () => {
        backupData({
          ...getFetchParams(),
          identification: tabsOptions[props.type].key,
          menuId: getCurrMenuId.value,
        }).then(res => {
          if (res.code === 200) {
            createMessage.success(t('tip.backupSuccess'));
          }
        });
      },
    });
  }

  // 基于当前登录账号，判断是否有权限查看
  function handleColumn(columns) {
    const hasPermission = hasBtnP('btn_shelvesNum');
    if (hasPermission) {
      return columns;
    }
    return columns.filter(item => item.field !== 'goodsShelvesNumber');
  }

  // 更新仓库地址
  function handleShipAddr() {
    const selectedRows = getSelectRowKeys() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    createConfirm({
      title: t('common.editWareAddr'),
      iconType: 'info',
      content: '',
      onOk: () => {
        updateShippingAddress(selectedRows).then(res => {
          if (res.code === 200) {
            createMessage.success(t('sys.api.operationSuccess'));
            reload();
          }
        });
      },
    });
  }

  function getDrawingshistoryFn({ id }) {
    return getFileInfoHistory({
      id,
      DrawingsType: 'MoldDrawings',
    });
  }
  function handleDrawView(record) {
    openFileList(true, {
      id: record.moldDrawing,
      downloadApi: fileDownload,
      listApi: getDrawingshistoryFn.bind(null, { id: record.moldDrawing }),
    });
  }

  // 文件预览
  const previewModalRef = ref();
  function handleDraw(row) {
    const { fileUrl, fileName } = row;
    previewModalRef.value.init({ fileUrl, fileName, version: '2' });
  }

  function handleTodo(val) {
    createMessage.info('待后续对接维修流程');
  }
</script>
