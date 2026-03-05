<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <template v-if="props.searchKey === '0'">
              <a-button v-auth="'btn_edit'" type="primary" v-if="pageTurnConfig.bizType == '3'" @click="openWorkOrderModal()">{{
                t('dict.MouldRoom.maintainWorkOrderNo')
              }}</a-button>
              <a-button v-auth="'btn_edit'" v-if="pageTurnConfig.bizType == '3'" type="primary" ghost @click="openProcessBindModal()">
                {{ t('common.process') }}
              </a-button>
              <a-button v-auth="'btn_upload_pic'" type="primary" v-if="pageTurnConfig.bizType == '4'" @click="openUploadModal(1)">{{
                t(['common.uploadText', 'dict.MouldRoomColumn.programCodeName'])
              }}</a-button>
              <a-button v-auth="'btn_upload_pic'" type="primary" ghost v-if="pageTurnConfig.bizType == '4'" @click="openUploadModal(2)">{{
                t(['common.uploadText', 'dict.MouldRoomColumn.programProcessName'])
              }}</a-button>
              <!-- 审核 -->
              <a-button v-auth="'btn_review'" :loading="auditLoading" type="primary" ghost @click="handleAudit">{{ t('common.audit') }}</a-button>
            </template>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="downloadDrop">
                  <a-menu-item :key="0">{{ t('dict.PartNumberApplyDrawingsType.CustomerDrawings') }}</a-menu-item>
                  <a-menu-item :key="1">{{ t('dict.PartNumberApplyDrawingsType.EngineeringDrawings') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_download')">{{ t('common.downloadDrawingText') }}</a-button>
            </a-dropdown>
            <a-dropdown v-if="pageTurnConfig.bizType == '4'">
              <template #overlay>
                <a-menu @click="downloadDrop">
                  <a-menu-item :key="2">{{ t('dict.MouldRoomColumn.programCodeName') }}</a-menu-item>
                  <a-menu-item :key="3">{{ t('dict.MouldRoomColumn.programProcessName') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_download')">{{ t('dict.MouldRoom.downloadProgram') }}</a-button>
            </a-dropdown>
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #drawingshistory="{ row }">
            <a @click="handleDrawView(row)">查看详情</a>
          </template>
          <template #moldDrawings="{ row }">
            <FileListCell :row="row" :list="row.moldDrawings" />
          </template>
          <template #prjDrawingsName="{ row }">
            <a
              class="table-a"
              @click="
                () => {
                  filePreviewRef?.init &&
                    filePreviewRef.init({
                      name: row.prjDrawingsName,
                      Id: row.prjDrawingsId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                }
              "
              >{{ row.prjDrawingsName }}</a
            >
          </template>
          <template #programCodeName="{ row }">
            <a
              class="table-a"
              @click="
                () => {
                  filePreviewRef?.init &&
                    filePreviewRef.init({
                      name: row.programCodeName,
                      Id: row.programCodeId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                }
              "
              >{{ row.programCodeName }}</a
            >
          </template>
          <template #programProcessName="{ row }">
            <a
              class="table-a"
              @click="
                () => {
                  filePreviewRef?.init &&
                    filePreviewRef.init({
                      name: row.programProcessName,
                      Id: row.programProcessId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                }
              "
              >{{ row.programProcessName }}</a
            >
          </template>
          <template #material="{ row }">
            {{ row['materialName'] }}
          </template>
          <template #isProcessMeet="{ row }">
            {{ meetDict[row['isProcessMeet']] }}
          </template>
          <template #opera="{ row }">
            <a @click="openNodeRecordModalFn(row)" style="cursor: pointer">{{ t('dict.CommonCol.nodeDetail') }}</a>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <!-- <deliveryDateResponseModal @register="registerDeliveryDateResponseModal" @reload="reload" /> -->
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeRecord" />
    <Preview ref="filePreviewRef" />
    <DrawMViewodal @register="registerDrawViewModal" />
    <UploadModal @register="registerUpload" :title="uploadConfig.title" @getTable="reload" />
    <!-- <AddProcessBindPopup @register="registerProcessBind" @refresh="enableWorkOrderFn"></AddProcessBindPopup> -->
    <AddWorkOrderModal @register="registerWorkOrder" @added="relateWorkOrderFun">
      <template #prenext>
        <div class="toggle-current flex jumptool" v-if="state.wkodr.total > 1">
          <a-button preIcon="icon-ym icon-ym-left" @click="handleWorkOrder('pre')" :disabled="state.wkodr.current < 1"></a-button>
          <div class="state-box m-2">
            <span>{{ state.wkodr.current + 1 }}</span> / {{ state.wkodr.total }}
          </div>
          <a-button preIcon="icon-ym icon-ym-right" @click="handleWorkOrder('next')" :disabled="state.wkodr.current >= state.wkodr.total - 1"></a-button>
          <!-- <a-divider type="vertical" class="ml-10px"></a-divider> -->
        </div>
      </template>
    </AddWorkOrderModal>
    <!-- <detailPopup @register="registerDetailPop" @reload="reload" /> -->
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  // import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { reactive, inject, ref } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import {
    getNodelist,
    relateWorkOrder,
    enableWorkOrder,
    bulkProgramAudit,
    exportRequirementReview,
    uploadProjectDrawings,
    uploadProgramCode,
    uploadProgramProcess,
  } from '/@/api/engineering/mould';
  import { NodeModal } from '/@/components/CustomComponents';
  import UploadModal from './uploadModal.vue';
  import { APPLY_DETAIL_COLUMNS, getPageConfig } from './config';
  import { downloadMoldDrawings } from '/@/views/engineering/mouldBusiness/components/config';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import DrawMViewodal from '/@/views/business/quantitation/assess/components/DrawViewModal.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import AddWorkOrderModal from './addWorkOrder.vue';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import Dayjs from 'dayjs';

  const { t } = useI18n();
  const filePreviewRef = ref<InstanceType<typeof Preview>>();
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openProcessBindFn: any = inject('openProcessBindFn');
  const { hasBtnP } = usePermission();
  const meetOptions = ref<any[]>([
    { value: 1, label: t('dict.OpinionTypeEnum.Satisfy') },
    { value: 0, label: t('dict.OpinionTypeEnum.Discontent') },
  ]);
  const meetDict = meetOptions.value.reduce((obj, { value, label }) => {
    obj[value] = label;
    return obj;
  }, {});
  const props = defineProps({
    searchKey: { default: '0' },
  });
  const pageTurnConfig = getPageConfig();
  const searchInfo = reactive({
    type: props.searchKey,
    bizType: pageTurnConfig.bizType,
  });
  const uploadInfo = [
    {
      title: t('dict.MouldRoomColumn.prjDrawingsName'),
      uploadApi: uploadProjectDrawings,
    },
    {
      uploadApi: uploadProgramCode,
      title: t('dict.MouldRoomColumn.programCodeName'),
    },
    {
      uploadApi: uploadProgramProcess,
      title: t('dict.MouldRoomColumn.programProcessName'),
    },
  ];
  const uploadConfig = reactive({
    title: uploadInfo[0].title,
    uploadApi: uploadInfo[0].uploadApi,
  });

  interface State {
    wkodr: {
      total: number;
      current: number;
      rows: any[];
    };
    typeList: any[];
    processTypeList: any[];
  }

  const state = reactive<State>({
    wkodr: {
      total: 0,
      current: 0,
      rows: [],
    },
    typeList: [],
    processTypeList: [],
  });
  const { createMessage } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerDeliveryDateResponseModal, { openModal: openDeliveryDateResponseModal }] = useModal();
  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  // const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerUpload, { openModal: openUpload }] = useModal();
  // const [registerProcessBind, { openPopup: openProcessBind }] = usePopup();
  const [registerWorkOrder, { openModal: openWorkOrder }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();
  const [Grid, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, reload, setFieldValue, getFetchParams, setLatestSubmissionValues, getFromValue }] =
    useVbenVxeGrid({
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
        schema: pageTurnConfig.schema,
        i18nConfig: {
          moduleCode: 'MouldRoomColumn',
          transferRange: ['placeholder'],
        },
      },
      gridOptions: {
        id: 'engineering-mouldRoom-design-list',
        columns: pageTurnConfig.column.filter(o => o.field !== 'drawingshistory'),
        showIndexColumn: true,
        showFooter: false,
        api: pageTurnConfig.listApi,
        rowConfig: {
          keyField: 'id',
          isCurrent: false, // 完全禁用行高亮
        },
        i18nConfig: {
          moduleCode: 'MouldRoomColumn',
        },
        columnConfig: {
          isCurrent: true, // 启用列高亮
        },
        currentColumnConfig: {
          isFollowSelected: true, // 高亮跟随选中
        },
        beforeFetch: formatParams,
      },
    });

  /** 请求参数格式化 */
  function formatParams(params: any) {
    const obj = { ...params, ...searchInfo };
    obj.type = props.searchKey;
    if (Array.isArray(params.time)) {
      obj.startTime = Dayjs(params.time[0]).startOf('day').valueOf();
      obj.endTime = Dayjs(params.time[1]).endOf('day').valueOf();
      delete obj.time;
    }
    return obj;
  }

  function getTableActions(record): ActionItem[] {
    let actions = [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetailFn.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-upload',
        tooltip: t('common.uploadDrawingText'),
        onClick: handleUploadAction.bind(null, record),
        ifShow: props.searchKey === '0',
        auth: 'btn_upload_pic',
      },
    ];
    return pageTurnConfig.bizType == '3' ? actions : [actions[0]];
  }

  function handleDrawView(record) {
    openDrawViewModal(true, {
      id: record.insidePartNumberId,
      InsidePartNumber: record.innerMaterialNumber,
    });
  }

  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  function downloadDrop({ key }) {
    downloadFn(key);
  }
  function downloadFn(type: number) {
    const typeField = { 0: 'moldDrawingsId', 1: 'prjDrawingsId', 2: 'programCodeId', 3: 'programProcessId' };
    let rows = getSelectRows();
    if (rows.length) {
      if (type === 0) {
        downloadMoldDrawings(rows);
        return false;
      }

      for (let index = 0; index < rows.length; index++) {
        const curId = rows[index][typeField[type]];
        try {
          handleFileDownload(curId);
          console.log(`文件 ${curId} 下载成功`);
        } catch (error) {
          console.error(`文件 ${curId} 下载失败: `, error);
        }
      }
    } else {
      createMessage.warning(t('common.selectText'));
    }
  }

  async function handleFileDownload(id) {
    if (!id) {
      createMessage.warning('尚未上传文件');
      return;
    }
    const { data, code } = await fileDownload(id);
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
    }
  }

  //导出
  async function handleExport() {
    let params = await getFetchParams();
    params = formatParams(params);
    openExportModal(true, {
      api: exportRequirementReview,
      listQuery: params,
      exportOptions: APPLY_DETAIL_COLUMNS,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldApplyColumn', // 字典分类EnCode
      },
    });
  }

  function goDetailFn(record: any = '') {
    // columns: props.searchKey === '1' ? SUB_COLUMNS_PRUCUREMENT : SUB_COLUMNS,
    const status = pageTurnConfig.bizType === '3' ? record.designStatus : record.programStatus;
    openDetailPopFn({ id: record.id, title: t('common.detailText'), status });
  }
  function hasWorkOrder(record?): boolean {
    let row = record || getSelectRows()[0];
    if (!row.workOrderNo) {
      createMessage.warning(t('dict.MouldRoom.pleaseMaintainWorkOrderNo'));
      return false;
    }
    return true;
  }
  function singleSelect(): boolean {
    let rows = getSelectRows();
    if (rows.length == 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    if (rows.length > 1) {
      createMessage.warning(t('common.selectDataTip'));
      return false;
    }
    return true;
  }
  function openWorkOrderModal() {
    if (!singleSelect()) return;
    let rows = getSelectRows();
    if (rows.length == 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    let hasOdr = rows.filter(x => !!x.workOrderNo);
    if (hasOdr.length > 0) {
      createMessage.warning(hasOdr.map(x => x.workOrderNo) + ' ' + t('dict.MouldRoom.hadMaintainedWorkOrderNo'));
      return;
    }
    state.wkodr.total = rows.length;
    state.wkodr.current = 0;
    state.wkodr.rows = rows;
    let row = rows[0];
    openWorkOrder(true, { record: { workOrderType: '3', mouldNo: row.moldNo, factoryArea: row.factory, factoryAreaName: row.factoryName }, draft: true });
  }
  function handleWorkOrder(type: string) {
    if (type == 'pre') {
      state.wkodr.current--;
    } else {
      state.wkodr.current++;
    }
    openWorkOrder(true, { record: { workOrderType: '3', mouldNo: state.wkodr.rows[state.wkodr.current].moldNo }, draft: true });
  }

  function relateWorkOrderFun(data) {
    let id = getSelectRowKeys()[state.wkodr.current];
    relateWorkOrder({ id, workOrderNo: data.workOrderNo }).then(() => {
      reload();
    });
    if (state.wkodr.current < state.wkodr.total - 1) {
      handleWorkOrder('next');
    } else {
      clearAllSelectRowKeys();
    }
  }

  function openProcessBindModal() {
    if (!singleSelect()) return;
    if (!hasWorkOrder()) return;
    let row = getSelectRows()[0];
    let data = row.processRouteBind || { processRouteType: '3', material: row.moldNo };
    openProcessBindFn({ data, title: data.id ? t('common.editText') : t('common.addText'), from: 'generate', isShowReviewer: true, row });
  }
  function enableWorkOrderFn() {
    let id = getSelectRowKeys()[0];
    enableWorkOrder(id).then(() => {
      reload();
    });
  }
  function openUploadModal(type: number) {
    if (!singleSelect()) return;
    if (!hasWorkOrder()) return;
    uploadConfig.uploadApi = uploadInfo[type].uploadApi;
    uploadConfig.title = uploadInfo[type].title;
    openUpload(true, { Id: getSelectRowKeys().toString(), api: uploadConfig.uploadApi });
  }
  function handleUploadAction(record) {
    if (!hasWorkOrder(record)) return;
    // state.Id = record.Id;
    uploadConfig.title = uploadInfo[0].title;
    uploadConfig.uploadApi = uploadInfo[0].uploadApi;
    openUpload(true, {
      Id: record.id,
      api: uploadConfig.uploadApi,
    });
  }
  function clearAllSelectRowKeys() {
    clearSelectedRowKeys();
  }

  function initFn() {
    clearAllSelectRowKeys();
    reload();
  }

  /** 审核加载状态 */
  const auditLoading = ref(false);
  function handleAudit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    const isDesign = pageTurnConfig.bizType === '3';

    auditLoading.value = true;
    bulkProgramAudit({ ids: rows.map(x => x.id), auditType: isDesign ? 0 : 1 })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        initFn();
      })
      .finally(() => {
        auditLoading.value = false;
      });
  }

  /** 设置搜索表单的内容 */
  function setFormValue(form: Record<string, any>) {
    Object.entries(form).forEach(([key, value]) => {
      setFieldValue(key, value);
    });
    setLatestSubmissionValues(getFromValue());
  }

  defineExpose({
    initFn,
    enableWorkOrderFn,
    setFormValue,
  });
</script>
<style lang="less" scoped>
  .disabled-class {
    pointer-events: none;
  }

  .status-tag {
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    padding: 2px;
  }

  .jumptool {
    justify-content: right;
  }
</style>
