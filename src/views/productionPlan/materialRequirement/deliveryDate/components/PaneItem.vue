<template>
  <Grid>
    <template #toolbar-actions>
      <div v-if="props.type === '1'">
        <a-button v-auth="'btn_review'" type="primary" @click="handleSubmit">{{ t('common.deliveryDate') }}</a-button>
        <vShowDropdown>
          <template #overlay>
            <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
            <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
            <button @click="batchImportOrExport({ key: 'exportBOM' })" v-if="hasBtnP('btn_downloadBOM')">{{ t('common.exportMaterialBOM') }} </button>
          </template>
          <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
        </vShowDropdown>
        <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
        <a-button v-auth="'btn_reject'" @click="handleReject"> {{ t('common.rejectText') }} </a-button>
      </div>
      <div v-else>
        <ModelConfirmButton
          v-auth="'btn_recall'"
          v-bind="{
            modelConfirm: {
              title: t('common.tipTitle'),
              content: t('common.withdrawSelectedData'),
              onOk: handleRecall.bind(null),
            },
          }">
          <span>{{ t('common.revoke') }}</span>
        </ModelConfirmButton>
        <a-dropdown>
          <template #overlay>
            <a-menu @click="batchImportOrExport">
              <a-menu-item v-if="hasBtnP('btn_download')" key="export"> {{ t('common.batchExport') }} </a-menu-item>
              <a-menu-item v-if="hasBtnP('btn_downloadBOM')" key="exportBOM"> {{ t('common.exportMaterialBOM') }} </a-menu-item>
            </a-menu>
          </template>
          <a-button v-if="hasBtnP('btn_download') || hasBtnP('btn_downloadBOM')">{{ t('common.batchImportOrExport') }}</a-button>
        </a-dropdown>
      </div>
    </template>
    <template #pdReview="{ row }">
      <span class="table-a" @click="openPdDetailFn(row)"> {{ t('common.viewDetails') }} </span>
    </template>
    <template #engineeringRemarks="{ row }">
      <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
        <div v-html="row.engineeringRemarks"></div>
      </a-tooltip>
    </template>
    <template #nodeDetail="{ row }">
      <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
    </template>
    <template #action="{ row }">
      <TableAction outside :actions="getunReviewActions(row)" />
    </template>
  </Grid>

  <NodeModal @register="registerNodeModal"></NodeModal>
  <ExportModal @register="registerExportModal" />
  <TransferModal @register="registerTransferModal" @reload="reload" />
  <RejectModal @register="registerRejectModal" @reload="reload" />
  <!-- <ImportModal @register="registerImportPop" @refresh="reload" /> -->
  <!-- <Teleport to="#outsizeTab">
    <DetailPopup @register="registerDetail" @reload="reload" />
    <ViewPopup @register="registerView" />
  </Teleport> -->
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { nextTick, onMounted, reactive, watch, unref, inject } from 'vue';
  import { getColumnsTodo, getFormConfigTodo, importPreviewColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, trim, replace } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { downloadByUrl } from '/@/utils/file/download';
  import {
    getMcListAPI,
    getMctransferuserAPI,
    exportMcExleAPI,
    rejectMcApi,
    recallMcApi,
    exportBom,
    template,
    importPreview,
    saveImportData,
    importTask,
    importTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/productionPlan/mainplan';
  import { useModal } from '/@/components/Modal';
  import { TransferModal, RejectModal, NodeModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodelist } from '/@/api/business/quantitation';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const openViewPopFn: any = inject('openViewPopFn');
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openImportPopFn: any = inject('openImportPopFn');
  const openPdDetailFn: any = inject('openPdDetailFn');
  defineOptions({ name: 'materialRequirement-deliveryDate' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const props = withDefaults(defineProps<{ type: string }>(), { type: '1' });

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: props.type,
  });

  const [Grid, { reload, getFetchParams, getSelectRows, getSelectRowKeys, clearSelectedRowKeys, setLoading, query }] = useVbenVxeGrid({
    formOptions: getFormConfigTodo(props.type == '1'),
    gridOptions: {
      showIndexColumn: true,
      id: 'business-quota-list',
      columns: getColumnsTodo(),
      clipConfig: {
        copyMethod: ({ column, row, cellValue }) => {
          if (column.field == 'engineeringRemarks') {
            return richTextToPlainText(cellValue);
          }
          return cellValue;
        },
      },
      api: params => getMcListAPI({ ...params, identification: state.activeKey }),
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
    },
  });

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  // const [registerDetail, { openPopup: openDetailPop }] = usePopup();
  // const [registerView, { openPopup: openViewPop }] = usePopup();

  watch(
    () => props.type,
    val => {
      try {
        setLoading(true);
        state.activeKey = val;
        searchFn();
      } finally {
        setLoading(false);
      }
    },
    { immediate: true },
  );

  function searchFn(): Promise<void> {
    return query();
  }

  function getunReviewActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
        // auth: 'btn_detail',
      },
    ];
  }
  function handleDetail(id) {
    openViewPopFn({
      type: 'view',
      ids: [id],
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.quantitativeApplyId,
    });
  }

  function handleTransfer(id = '') {
    const idList = getSelectRowKeys();
    if (!idList.length) return message.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }
  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await getMctransferuserAPI({
      ids: id,
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };

  async function handleUnReviewExport() {
    const exportColumns = cloneDeep(getColumnsTodo());
    openExportModal(true, {
      api: exportMcExleAPI,
      listQuery: {
        ...(await getFetchParams()),
        identification: state.activeKey,
      },
      defaultSelectedKeys: ['innerMaterialNumber', 'applyNo', 'factory', 'peakQty', 'demandQty', 'requirementRegression', 'estimatedMaterialsTime', 'mcRemark'],
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
    });
  }

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectMcApi,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  }

  // 撤回
  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    const r = await recallMcApi(idList);
    if (r.code == 200) {
      // message.success(t('sys.api.operationSuccess'));
      message.success('操作成功');
      reload();
      clearSelectedRowKeys();
    }
  }

  function handleSubmit() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openDetailPopFn({
        index: 0,
        ids: idList,
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  // 批量导入
  function batchImportFile() {
    openImportPopFn({
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: template,
      previewColumn: importPreviewColumn,
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: importTask,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
    });
  }

  async function handleExportMaterialBOM() {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('common.selectText'));
    setLoading(true);
    exportBom({
      ...(await getFetchParams()),
      ids: ids.join(','),
      identification: state.activeKey,
    })
      .then(res => {
        res.code === 200 && downloadByUrl({ url: res.data.url, fileName: res.data.name });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function batchImportOrExport({ key }) {
    if (key === 'export') {
      handleUnReviewExport();
    } else if (key === 'exportBOM') {
      handleExportMaterialBOM();
    } else if (key === 'import') {
      batchImportFile();
    }
  }

  const route = useRoute();
  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleDetail(id);
      });
    }
  });

  // 复制富文本
  function richTextToPlainText(html) {
    if (!html) return '';

    // 创建一个临时的div元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 获取纯文本内容
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // 使用lodash处理文本
    text = trim(text);
    text = replace(text, /\s+/g, ' '); // 将多个空白字符替换为单个空格
    text = replace(text, /\n\s*\n/g, '\n'); // 清理多余的空行

    return text;
  }
</script>
