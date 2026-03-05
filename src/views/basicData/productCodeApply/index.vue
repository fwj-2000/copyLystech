<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleSingleApply">{{ t('common.add2Text') }} </a-button>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload_desensitized_pic')" @click="uploadSign(UPLOAD_TYPES.DESENSITIZED)">
                    {{ t('dict.MoldApplyColumn.drawingshistory') }}</button
                  >
                  <button v-if="hasBtnP('btn_upload_customer_pic')" @click="uploadSign(UPLOAD_TYPES.CUSTOMER)">{{ t('common.customerOriginalImage') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload_desensitized_pic') || hasBtnP('btn_upload_customer_pic')" type="primary" ghost
                  >{{ t('common.batchUploadDrawings') }}
                </a-button>
              </vShowDropdown>
              <!-- <a-button v-if="hasBtnP('btn_upload_pic')" type="primary" ghost>{{ t('common.batchUploadDrawings') }} </a-button>-->
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_detail') && hasBtnP('btn_enable')" @click="handleDrawing(DRAWING_ACTIONS.CHECK_DRAWING)"
                    >{{ t('common.checkDrawing') }}
                  </button>
                  <button v-if="hasBtnP('btn_enable')" @click="handleDrawing(DRAWING_ACTIONS.BATCH_ENABLE)">{{ t('dict.enableStatus.1') }} </button>
                  <button v-if="hasBtnP('btn_enable')" @click="handleDrawing(DRAWING_ACTIONS.BATCH_DISABLED)">{{ t('common.disableText') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_detail') && hasBtnP('btn_enable')"> {{ t('common.drawingHandle') }} </a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_push'" @click="handlePushMES"> {{ t('common.push3.8') }}</a-button>
              <a-button v-auth="'btn_assignDrawings'" @click="handleAssignDrawings"> {{ t('dict.PartNumberApply.assignDrawings') }}</a-button>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport(BATCH_OPERATION_TYPES.IMPORT)">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_specialImport')" @click="batchImportOrExport(BATCH_OPERATION_TYPES.SPECIAL_IMPORT)">{{
                    t('dict.CommonCol.dedicatedImport')
                  }}</button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport(BATCH_OPERATION_TYPES.EXPORT)">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_specialImport') || hasBtnP('btn_download')">{{
                  t('common.batchImportOrExport')
                }}</a-button>
              </vShowDropdown>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_bindProject')" @click="handleBindProject('bind')">{{ t('dict.PartNumberApply.bindProject') }} </button>
                  <button v-if="hasBtnP('btn_disabledBindProject')" @click="handleBindProject('disable')">{{
                    t('dict.PartNumberApply.bindProjectDisabled')
                  }}</button>
                </template>
                <a-button v-if="hasBtnP('btn_bindProject') || hasBtnP('btn_disabledBindProject')">{{ t('dict.PartNumberApply.commonPart') }}</a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_bind'" @click="handleBindFactory('bind')">
                {{ t('common.bind', [t('common.factory')]) }}
              </a-button>
              <a-button v-auth="'btn_unbind'" @click="handleBindFactory('unbind')">
                {{ t('common.unbind', [t('common.factory')]) }}
              </a-button>
            </a-space>
          </template>
          <template #DesensitizedDrawingsName="{ row }">
            <div
              class="table-a"
              @dblclick="
                () => {
                  if (!hasBtnP('btn_detail')) return createMessage.warning(t('common.noViewingPermission'));
                  filePreviewRef.init({
                    name: row.DesensitizedDrawingsName,
                    Id: row.DesensitizedDrawingsId,
                    previewType: 'localPreview',
                    noCache: false,
                    isCopy: 0,
                  });
                }
              ">
              {{ row.DesensitizedDrawingsName }}
            </div>
          </template>
          <template #projectFile="{ row }">
            <div class="table-a" @click="handelFileDetail(row)">
              {{ t('common.searchDetail') }}
            </div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <Detail @register="registerDetail" @reload="reload" />
    <UploadModal @register="registerUpload" @getTable="reload" />
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <ApplyPopup @register="registerApply" @reload="reload" />
    <ImportModal @register="registerImportPop" @reload="reload"></ImportModal>
    <PreviewModal ref="filePreviewRef">
      <template #cancel-before="{ row, pageInfo }">
        <a-button @click="handleReview(row, pageInfo)">
          {{ row.Status == 1 ? t('common.disableText') : row.Status == 2 ? t('dict.enableStatus.1') : t('common.audit') }}
        </a-button>
      </template>
    </PreviewModal>
    <UploadPopup @register="registerUploadPopup" @reload="reload" />
    <FilesModal @register="registerFiles" @reload="reload" />
    <BindFactoryModal @register="registerBindFactoryModal" @reload="reload" />
    <AssignDrawingsModal @register="registerAssignDrawingsModal" @reload="reload" />
    <BindProjectModal @register="registerBindProjectModal" @reload="reload" />
    <Tour v-model:current="current" @change="handleToruChange" :open="open" :steps="steps" @close="handleTourClose" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { reactive, ref, defineAsyncComponent, onMounted } from 'vue';
  import {
    cancelImportTask,
    cancelImportTaskSpecial,
    deletePartNumberApply,
    exportPartNumberApplyExcel,
    getImportTask,
    getImportTaskSpecial,
    getImportTaskData,
    getImportTaskDataSpecial,
    getPartNumberApply,
    getTemplateDownload,
    getTemplateDownloadSpecial,
    importExcel,
    importExcelSpecial,
    importTaskRead,
    importTaskReadSpecial,
    partnumberapplyDisable,
    partnumberapplyEnable,
    partnumberapplyReview,
    saveBatchData,
    saveBatchDataSpecial,
    pushToMES,
    bindFactory,
    unbindFactory,
  } from '/@/api/basicData/productCodeApply';
  import { usePopup } from '/@/components/Popup';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getColumn, getExportColumn, getVxeSchema, importColumns } from '/@/views/basicData/productCodeApply/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import { isEmpty } from '/@/utils/is';
  import { cloneDeep } from 'lodash-es';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { BATCH_OPERATION_TYPES, DRAWING_ACTIONS, POLLING_CONFIG, STATUS_TYPES, UPLOAD_TYPES } from './constants';
  import type { TourProps } from 'ant-design-vue';
  import { Tour } from 'ant-design-vue';

  const UploadModal = defineAsyncComponent(() => import('./components/uploadModal.vue'));
  const ExportModal = defineAsyncComponent(() => import('/@/components/ExportModal/index.vue'));
  const ImportModal = defineAsyncComponent(() => import('/@/components/ImportModal').then(m => m.ImportModal));
  const ApplyPopup = defineAsyncComponent(() => import('./components/ApplyPopup.vue'));
  const Detail = defineAsyncComponent(() => import('./components/Detail.vue'));
  const PreviewModal = defineAsyncComponent(() => import('/@/components/Upload').then(m => m.PreviewModal));
  const UploadPopup = defineAsyncComponent(() => import('./components/uploadPopup.vue'));
  const FilesModal = defineAsyncComponent(() => import('/@/views/business/basicInformation/projectFiles/components/Files/FilesModal.vue'));
  const BindFactoryModal = defineAsyncComponent(() => import('/@/components/CustomComponents').then(m => m.BindFactoryModal));
  const AssignDrawingsModal = defineAsyncComponent(() => import('./components/AssignDrawingsModal.vue'));
  const BindProjectModal = defineAsyncComponent(() => import('./components/BindProjectModal.vue'));

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'basicData-productCodeApply' });

  const { createMessage } = useMessage();

  const filePreviewRef = ref<ModalComponent | null>(null);
  type BatchOperationKey = (typeof BATCH_OPERATION_TYPES)[keyof typeof BATCH_OPERATION_TYPES];
  type DrawingActionKey = (typeof DRAWING_ACTIONS)[keyof typeof DRAWING_ACTIONS];
  type UploadType = (typeof UPLOAD_TYPES)[keyof typeof UPLOAD_TYPES];
  type StatusKey = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

  const open = ref<boolean>(false);
  const current = ref(0);

  const steps: TourProps['steps'] = [
    {
      title: t('dict.productCodeApplyColumn.stepsTitle1'),
      description: t('dict.productCodeApplyColumn.stepsDesc1'),
      target: () => document.querySelector('.vxe-table--header-wrapper.body--wrapper'),
    },
    {
      title: t('dict.productCodeApplyColumn.stepsTitle2'),
      description: t('dict.productCodeApplyColumn.stepsDesc2'),
      target: () => document.querySelector('.vxe-toolbar-custom-target'),
    },
    {
      title: t('dict.productCodeApplyColumn.stepsTitle3'),
      description: t('dict.productCodeApplyColumn.stepsDesc3'),
      target: () => {
        return document.querySelector('.vxe-table-custom-wrapper');
      },
      nextButtonProps: {
        onClick: (...rest) => {
          localStorage.setItem('has_seen_product_code_tour', 'true');
        },
      },
    },
  ];

  function handleOpen(val) {
    current.value = 0;
    open.value = val;
  }
  function handleTourClose() {
    localStorage.setItem('has_seen_product_code_tour', 'true');
    handleOpen(false);
  }
  function handleToruChange(val) {
    console.log(val);
    if (val === 2) {
      document.querySelector('.vxe-toolbar-custom-target')?.click?.();
    }
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      // fieldMappingTime: [['date', ['start', 'end']]],
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-productCodeApply-list',
      columns: getColumn(),
      toolbarConfig: {
        superQuery: true,
      },
      rowConfig: {
        keyField: 'Id',
      },
      api: getPartNumberApply,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
      virtualXConfig: {
        enabled: false,
        // gt: 0,
      },
      afterFetch: data => {
        state.cacheList = data.list;
        setTimeout(() => {
          const hasSeenTour = localStorage.getItem('has_seen_product_code_tour');
          if (hasSeenTour !== 'true') {
            handleOpen(true);
          }
        }, 1500);
      },
    },
  });
  const { reload, setLoading, clearSelectedRowKeys } = gridApi;
  const getSelectedRows = (showMessage = true) => {
    const rows = gridApi.grid?.getCheckboxRecords?.(true) || gridApi.getSelectRows?.() || [];
    if (showMessage && isEmpty(rows)) {
      createMessage.warning(t('common.selectText'));
    }
    return rows;
  };

  const [registerUploadPopup, { openPopup: openUploadPopup }] = usePopup();
  const [registerDetail, { openPopup: openDetailPopup }] = usePopup();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const state = reactive({
    Id: '',
    cacheList: [],
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerFiles, { openModal: openFilesModal }] = useModal();

  /**
   * 统一处理API响应，显示成功或失败消息
   * @param apiCall - Promise a function that returns an API call
   * @param options - Optional callbacks for success and finally
   */
  async function handleApiResponse(apiCall: Promise<{ code: number; msg: string }>, options: { onSuccess?: () => void; onFinally?: () => void } = {}) {
    try {
      const { code, msg } = await apiCall;
      if (code === 200) {
        createMessage.success(msg);
        options.onSuccess?.();
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      console.error('API Error:', error);
      // 在此上下文中无法直接使用 t, 如需国际化需传入 t 函数
      // createMessage.error(t('sys.api.networkExceptionMsg'));
    } finally {
      options.onFinally?.();
    }
  }

  async function onDelete(Id: string) {
    await handleApiResponse(deletePartNumberApply(Id), { onSuccess: reload });
  }

  function exportAction(query) {
    exportPartNumberApplyExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  function uploadSign(key: UploadType) {
    openUploadPopup(true, { key });
  }

  function batchImportOrExport(key: BatchOperationKey) {
    const actions: Record<BatchOperationKey, () => void> = {
      [BATCH_OPERATION_TYPES.IMPORT]: () => batchImportFile(BATCH_OPERATION_TYPES.IMPORT),
      [BATCH_OPERATION_TYPES.SPECIAL_IMPORT]: () => batchImportFile(BATCH_OPERATION_TYPES.SPECIAL_IMPORT),
      [BATCH_OPERATION_TYPES.EXPORT]: handleExport,
    };
    actions[key]?.();
  }

  function createImportConfig(type: BatchOperationKey) {
    const isSpecialImport = type === BATCH_OPERATION_TYPES.SPECIAL_IMPORT;
    const columns = cloneDeep(importColumns());

    if (isSpecialImport) {
      const sku = {
        title: '中间七码',
        dataIndex: 'SKU',
        width: 180,
      };
      columns.splice(7, 0, sku);
    }

    return {
      title: isSpecialImport ? t('dict.CommonCol.dedicatedImport') : t('common.batchImport'),
      importPreviewApi: isSpecialImport ? importExcelSpecial : importExcel,
      importSaveApi: isSpecialImport ? saveBatchDataSpecial : saveBatchData,
      templateApi: isSpecialImport ? getTemplateDownloadSpecial : getTemplateDownload,
      previewColumn: columns,
      usePolling: true,
      pollingParams: {
        interval: POLLING_CONFIG.INTERVAL,
        getTaskStatus: isSpecialImport ? getImportTaskSpecial : getImportTask,
        getTaskDataList: isSpecialImport ? getImportTaskDataSpecial : getImportTaskData,
        cancelTask: isSpecialImport ? cancelImportTaskSpecial : cancelImportTask,
        taskRead: isSpecialImport ? importTaskReadSpecial : importTaskRead,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    };
  }

  function batchImportFile(type: BatchOperationKey) {
    const config = createImportConfig(type);
    openImportPopup(true, config);
  }

  function handleUploadAction(record) {
    state.Id = record.Id;
    openUpload(true, {
      Id: record.Id,
      InsidePartNumber: record.InsidePartNumber,
    });
  }

  const handleRuleEdit = (record: any) => {
    if (!hasBtnP('btn_detail')) return;
    openDetailPopup(true, record);
  };

  const handleSingleApply = () => {
    openApplyPop(true, {});
  };
  const handleExport = async () => {
    const exportColumns = getExportColumn();
    const index = exportColumns.findIndex(item => item.field === 'DesensitizedDrawingsName');
    openExportModal(true, {
      listQuery: {
        ...(await gridApi.getFetchParams()),
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
    });
  };

  function handleBatchEnable() {
    const selectRows = getSelectedRows();
    if (isEmpty(selectRows)) return;

    const enableList = selectRows.filter(item => item.Status === STATUS_TYPES.DISABLED).map(item => item.Id);
    const reviewList = selectRows.filter(item => item.Status === STATUS_TYPES.PENDING_REVIEW).map(item => item.Id);

    const promises: Promise<unknown>[] = [];
    if (enableList.length > 0) {
      promises.push(partnumberapplyEnable(enableList));
    }
    if (reviewList.length > 0) {
      promises.push(partnumberapplyReview(reviewList));
    }
    if (promises.length === 0) return;

    setLoading(true);
    Promise.all(promises)
      .then(() => {
        createMessage.success(t('common.operatorSuccess'));
      })
      .finally(() => {
        clearSelectedRowKeys();
        setLoading(false);
        reload();
      });
  }

  // 打开文件详情
  function handelFileDetail(record) {
    openFilesModal(true, {
      params: {
        insidePartNumber: record.InsidePartNumber,
      },
    });
  }

  // 推送3.8
  function handlePushMES() {
    const selectRows = getSelectedRows();
    if (isEmpty(selectRows)) return;
    const ids = selectRows.map(item => item.Id);
    handleApiResponse(pushToMES(ids));
  }

  // 批量禁用
  function handleBatchDisabled() {
    const selectRows = getSelectedRows();
    if (isEmpty(selectRows)) return;
    const ids = selectRows.map(item => item.Id);
    handleApiResponse(partnumberapplyDisable(ids), {
      onSuccess: reload,
      onFinally: clearSelectedRowKeys,
    });
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-upload',
        // label: t('common.uploadDrawingText'),
        auth: 'btn_upload_pic',
        tooltip: t('common.uploadDrawingText'),
        onClick: handleUploadAction.bind(null, row),
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_detail',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleRuleEdit.bind(null, {
          ...row,
          cacheList: state.cacheList,
        }),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: onDelete.bind(null, row.Id),
        },
        tooltip: t('common.delText'),
      },
    ];
  }

  function handleCheckDrawing() {
    const rows = getSelectedRows();
    if (isEmpty(rows)) return;
    try {
      const list = rows.map((row, index) => {
        if (!row.DesensitizedDrawingsId) {
          throw new Error(t('dict.productApplyColumn.enterDesensitized', [index + 1]));
        }
        return {
          Id: row.DesensitizedDrawingsId,
          viewId: row.Id,
          name: row.DesensitizedDrawingsName,
          previewType: 'localPreview',
          noCache: false,
          isCopy: 0,
          Status: row.Status,
        };
      });
      filePreviewRef.value.init({
        fileList: list,
      });
    } catch (e) {
      createMessage.warning(e.message);
    }
  }

  const statusReviewApiMap: Record<StatusKey, typeof partnumberapplyDisable> = {
    [STATUS_TYPES.ENABLED]: partnumberapplyDisable, // 禁用
    [STATUS_TYPES.DISABLED]: partnumberapplyEnable, // 启用
    [STATUS_TYPES.PENDING_REVIEW]: partnumberapplyReview, // 审核
  };

  function handleReview(row, pageInfo) {
    const { list, currentIndex } = pageInfo;
    const api = statusReviewApiMap[row.Status as StatusKey];
    if (!api) return;

    handleApiResponse(api([row.viewId]), {
      onSuccess: () => {
        if (currentIndex < list.length - 1) {
          filePreviewRef.value.init({
            fileList: list,
            currentIndex: currentIndex + 1,
          });
        } else {
          // 如果是最后一张，刷新列表
          reload();
        }
      },
    });
  }

  // 绑定、解绑工厂
  const [registerBindFactoryModal, { openModal: openBindFactoryModal }] = useModal();
  const handleBindFactory = async (type: 'bind' | 'unbind') => {
    const rows = getSelectedRows();
    if (isEmpty(rows)) return;
    // 不允许存在主要制程不一样的
    const mainProcess = rows[0].mainProcessEnum;
    if (rows.some(item => item.mainProcessEnum !== mainProcess)) {
      return createMessage.warning(t('dict.semifinishedproducts.bindFactoryTip'));
    }
    const params: any = {
      list: rows,
      mainProcess,
      type,
      tableConfig: {
        columns: [
          {
            title: '产品内部料号',
            field: 'InsidePartNumber',
            width: 200,
          },
          {
            title: '工厂',
            field: 'FactoryNames',
            i18nField: 'Factory',
            minWdith: 200,
          },
        ],
        i18nConfig: {
          moduleCode: 'PartNumberApplyColumn',
        },
      },
    };
    if (type === 'unbind') {
      params.submitApi = unbindFactory;
    } else {
      params.submitApi = bindFactory;
    }
    openBindFactoryModal(true, params);
  };

  const drawingActions: Record<DrawingActionKey, () => void> = {
    [DRAWING_ACTIONS.CHECK_DRAWING]: handleCheckDrawing,
    [DRAWING_ACTIONS.BATCH_ENABLE]: handleBatchEnable,
    [DRAWING_ACTIONS.BATCH_DISABLED]: handleBatchDisabled,
  };
  function handleDrawing(actionKey: DrawingActionKey) {
    drawingActions[actionKey]?.();
  }

  const [registerAssignDrawingsModal, { openModal: openAssignDrawingsModal }] = useModal();
  /** 共用图纸 */
  function handleAssignDrawings() {
    const rows = getSelectedRows();

    if (isEmpty(rows)) return;

    // 只能选择一条数据
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectedOneData'));
      return;
    }

    const { TerminalCustomerPartNumber, TerminalCustomerPartVersion, Id, Status, InsidePartNumber } = rows[0];

    // 只选选择启用状态的数据
    if (+Status != STATUS_TYPES.ENABLED) {
      createMessage.warning(t('dict.CommonCol.selectedEnabledData'));
      return;
    }

    // 打开选择父级料号的弹窗
    openAssignDrawingsModal(true, {
      insidePartNumber: InsidePartNumber,
      parentId: Id,
      terminalCustomerPartNumber: TerminalCustomerPartNumber,
      terminalCustomerPartVersion: TerminalCustomerPartVersion,
    });
  }

  const [registerBindProjectModal, { openModal: openBindProjectModal }] = useModal();
  /**
   * 共用件绑定、禁用
   * @param param0
   */
  function handleBindProject(action: 'bind' | 'disable') {
    const rows = getSelectedRows();

    if (isEmpty(rows)) return;

    openBindProjectModal(true, {
      list: rows,
      type: action,
    });
  }
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
