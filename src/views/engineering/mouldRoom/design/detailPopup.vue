<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" :showCancelBtn="true" :title="title" :destroyOnClose="true" :showFooter="false">
    <template #insertToolbar> </template>
    <div class="lydc-content-wrapper-search-box pt-6px pr-8px pl-6px mb-6px">
      <Subtitle :title="t('views.quantitation.common.basicInfo')" />
      <BasicForm @register="registerForm">
        <template #moldDrawings="{ model, field }">
          <div class="truncate drawings-item vxe-cell">
            <FileListCell :row="model" :list="model[field]" />
          </div>
        </template>
      </BasicForm>
    </div>
    <div class="mt-6px mr-6px pl-6px">
      <a-row :gutter="[8, 8]">
        <a-col v-if="bizType == '3'" :span="24" style="max-height: 450px">
          <Subtitle :title="t('dict.PartNumberApplyDrawingsType.EngineeringDrawings')" />
          <div style="height: 400px; overflow: auto">
            <designGridOne>
              <template #status="{ rowIndex, row }">
                <LydcTag v-if="row.status == 1" theme="green" :text="t('common.enableText')"></LydcTag>
                <LydcTag v-if="row.status == 2" theme="red" :text="t('common.disableText')"></LydcTag>
              </template>
              <template #originFileName="{ rowIndex, row }">
                <a @dblclick="handlePreview(row)">{{ row.originFileName }}</a>
              </template>
              <template #creatorTime="{ rowIndex, row }">
                {{ dayjs(row.creatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template #action="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_upload_pic'" :disabled="!state.isCanEdit" @click="handleUpload(row, 0)"
                  >{{ t('common.uploadText') }}
                </a-button>
              </template>
              <template #enable="{ rowIndex, row }">
                <a-button v-if="row.status == 2" type="link" :disabled="!state.isCanEdit" v-auth="'btn_enable'" @click="handleEnable(row)"
                  >{{ t('common.enableText') }}
                </a-button>
                <a-button v-if="row.status == 1" type="link" disabled>{{ t('common.disableText') }} </a-button>
              </template>
              <template #download="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_download_pic'" @click="handleHistoryDownload(row)">{{ t('common.downloadText') }} </a-button>
              </template>
              <template #delete="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_delete_cust_pic'" :disabled="!state.isCanEdit" @click="handleDeletePic(row, 1)"
                  >{{ t('common.delText') }}
                </a-button>
              </template>
            </designGridOne>
          </div>
        </a-col>
        <a-col v-if="bizType == '4'" :span="24" style="max-height: 450px">
          <Subtitle :title="t('dict.MouldRoomColumn.programCodeName')" />
          <div style="height: 420px; overflow: auto">
            <programGrid>
              <template #status="{ rowIndex, row }">
                <LydcTag v-if="row.status == 1" theme="green" :text="t('common.enableText')"></LydcTag>
                <LydcTag v-if="row.status == 2" theme="red" :text="t('common.disableText')"></LydcTag>
              </template>
              <template #originFileName="{ rowIndex, row }">
                <a @dblclick="handlePreview(row)">{{ row.originFileName }}</a>
              </template>
              <template #creatorTime="{ rowIndex, row }">
                {{ dayjs(row.creatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template #action="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(row, 0)">{{ t('common.uploadText') }} </a-button>
              </template>
              <template #enable="{ rowIndex, row }">
                <a-button v-if="row.status == 2" type="link" v-auth="'btn_enable'" @click="handleEnable(row)">{{ t('common.enableText') }} </a-button>
                <a-button v-if="row.status == 1" type="link" disabled>{{ t('common.disableText') }} </a-button>
              </template>
              <template #download="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_download_pic'" @click="handleHistoryDownload(row)">{{ t('common.downloadText') }} </a-button>
              </template>
              <template #delete="{ rowIndex, row }">
                <a-button type="link" v-auth="'btn_delete_cust_pic'" @click="handleDeletePic(row, 1)">{{ t('common.delText') }} </a-button>
              </template>
            </programGrid>
          </div>
        </a-col>
        <a-col v-if="bizType == '4'" :span="24" style="max-height: 450px">
          <Subtitle :title="t('dict.MouldRoomColumn.programProcessName')" />
          <!-- <Carousel>
            <div class="cad-drawing" v-for="item in cadPicList" :key="item.id">
              <img :src="item.url" :title="item.originFileName+item.url"/>
            </div>
          </Carousel> -->
          <programGridTwo>
            <template #status="{ rowIndex, row }">
              <LydcTag v-if="row.status == 1" theme="green" :text="t('common.enableText')"></LydcTag>
              <LydcTag v-if="row.status == 2" theme="red" :text="t('common.disableText')"></LydcTag>
            </template>
            <template #originFileName="{ rowIndex, row }">
              <a @dblclick="handlePreview(row)">{{ row.originFileName }}</a>
            </template>
            <template #creatorTime="{ rowIndex, row }">
              {{ dayjs(row.creatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #action="{ rowIndex, row }">
              <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(row, 0)">{{ t('common.uploadText') }} </a-button>
            </template>
            <template #enable="{ rowIndex, row }">
              <a-button v-if="row.status == 2" type="link" v-auth="'btn_enable'" @click="handleEnable(row)">{{ t('common.enableText') }} </a-button>
              <a-button v-if="row.status == 1" type="link" disabled>{{ t('common.disableText') }} </a-button>
            </template>
            <template #download="{ rowIndex, row }">
              <a-button type="link" v-auth="'btn_download_pic'" @click="handleHistoryDownload(row)">{{ t('common.downloadText') }} </a-button>
            </template>
            <template #delete="{ rowIndex, row }">
              <a-button type="link" v-auth="'btn_delete_cust_pic'" @click="handleDeletePic(row, 1)">{{ t('common.delText') }} </a-button>
            </template>
          </programGridTwo>
        </a-col>
        <a-col v-if="bizType == '3'" :span="24" style="max-height: 450px">
          <Subtitle :title="t('common.process')" />
          <designGridTwo> </designGridTwo>
        </a-col>
        <a-col v-if="bizType == '3'" :span="0" style="max-height: 450px">
          <Subtitle title="配件申请" />
          <designGridThree> </designGridThree>
        </a-col>
      </a-row>
    </div>
  </BasicPopup>
  <UploadModal @register="registerUpload" @get-table="getDrawingList" :title="title" />
  <Preview ref="filePreviewRef" />
  <!-- <rejectModal @register="registerRejectModal" @reload="reload" /> -->
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import {
    uploadProjectDrawings,
    uploadProgramCode,
    uploadProgramProcess,
    deleteDrawings,
    deleteCode,
    deleteProcess,
    getMoldapplyDetailSingle,
  } from '/@/api/engineering/mould';
  import { APPLY_DETAIL_COLUMNS, getPageConfig, STATUS_ENUM } from './config';
  import dayjs from 'dayjs';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { getDrawingshistory, previewDrawingshistory, enableDrawings, downloadDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import UploadModal from './uploadModal.vue';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';

  const { t } = useI18n();
  const filePreviewRef = ref<ModalComponent | null>(null);
  const baseStore = useBaseStore();
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    id: string;
    orgId: string;
    tableData: any;
    columns: any;
    status: any;
    customerPicList: any;
    programCodeList: any;
    programProcessList: any;
    bizType: string;
    uploadTitle: string;
    /** 是否可以编辑，目前用于【工程图纸】的编辑 */
    isCanEdit: boolean;
  }
  const pageTurnConfig = getPageConfig();
  const uploadInfo = [
    {
      title: '工程图纸',
      uploadApi: uploadProjectDrawings,
      deleteApi: deleteDrawings,
    },
    {
      uploadApi: uploadProgramCode,
      deleteApi: deleteCode,
      title: '程序代码',
    },
    {
      uploadApi: uploadProgramProcess,
      deleteApi: deleteProcess,
      title: '程序工艺',
    },
  ];
  const state = reactive<State>({
    title: '',
    uploadTitle: 'CAD图纸',
    id: '',
    orgId: '',
    tableData: [],
    columns: [],
    status: null,
    customerPicList: [],
    programCodeList: [],
    programProcessList: [],
    bizType: pageTurnConfig.bizType,
  });
  const cadPicList = reactive<any[]>([]);
  const { title, bizType, customerPicList, programCodeList, programProcessList } = toRefs(state);
  const { createMessage, createConfirm } = useMessage();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const schemas: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'applyNo',
      label: '模具申请单号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'moldNo',
      label: '模具料号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'moldDrawings',
      i18nField: 'moldDrawingsName',
      label: '模具图纸',
      component: 'Input',
      slot: 'moldDrawings',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'requireDeliveryTime',
      label: '要求交期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        format: 'YYYY-MM-DD',
        disabled: true,
      },
    },
    {
      field: 'deliveryTime',
      label: '交期回复',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        format: 'YYYY-MM-DD',
        disabled: true,
      },
    },
    {
      field: pageTurnConfig.bizType === '3' ? 'designatedAuditUserName' : 'programAuditUserName',
      i18nField: 'CommonCol.auditUserName',
      label: '审核人',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: pageTurnConfig.bizType === '3' ? 'designatedAuditDate' : 'programAuditDate',
      i18nField: 'CommonCol.auditTime',
      label: '审核时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        format: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
    },
    {
      field: 'designatedEngineerName',
      i18nField: 'designatedEngineerId',
      label: '设计工程',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'designatedEngineerDate',
      label: '设计时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        format: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
    },
    {
      field: 'insidePartNumber',
      label: '产品内部料号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'insidePartNumberOld',
      label: '旧版成品编码',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'factoryName',
      label: '工厂',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'moldTypeName',
      i18nField: 'moldType',
      label: '模具类型',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'productTypeName',
      i18nField: 'productType',
      label: '产品类型',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'material',
      label: '材质',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'isProcessMeetName',
      i18nField: 'isProcessMeet',
      label: '工艺是否满足',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'purchaseUserName',
      i18nField: 'purchaseUserId',
      label: '模具采购',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'designatedPmcReviewerName',
      i18nField: 'designatedPmcReviewerId',
      label: 'PMC',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'applyUserName',
      i18nField: 'applyUserId',
      label: '申请人',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      field: 'applyDate',
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        format: 'YYYY-MM-DD',
        disabled: true,
      },
    },
  ];

  const [registerForm, { setFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    layout: 'vertical',
    labelWidth: '100%',
    rowProps: {
      gutter: 6,
    },
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'MouldRoomColumn',
    },
  });
  function init({ id, title, status }) {
    state.title = title;
    state.id = id;
    state.status = status;
    if (!id) return;
    getMoldapplyDetailFn(id);
    // getCadPics();
    getDrawingList();
  }

  const customColumns = [
    {
      title: t('component.upload.version'),
      field: 'version',
      i18nField: 'component.upload.version',
      key: 'version',
      width: 40,
    },
    {
      title: t('component.upload.fileStatue'),
      field: 'status',
      i18nField: 'component.upload.fileStatue',
      key: 'status',
      slots: { default: 'status' },
    },
    {
      title: t('component.upload.name'),
      field: 'originFileName',
      slots: { default: 'originFileName' },
      i18nField: 'component.upload.name',
      key: 'originFileName',
    },
    {
      title: t('component.upload.time'),
      field: 'creatorTime',
      i18nField: 'component.upload.time',
      width: 150,
      cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      title: t('component.upload.user'),
      field: 'creatorUserName',
      i18nField: 'component.upload.user',
    },
    {
      title: t('common.action'),
      align: 'center',
      field: 'demo',
      children: [
        {
          title: t('common.uploadText'),
          field: 'action',
          i18nField: 'common.action',
          slots: { default: 'action' },
          colSpan: 4,
        },
        {
          title: t('dict.enableStatus'),
          colSpan: 0,

          field: 'enable',
          slots: { default: 'enable' },
        },
        {
          title: t('common.downloadText'),
          colSpan: 0,

          field: 'download',
          slots: { default: 'download' },
        },
        {
          title: t('dict.ProgressStatusEnum.8'),
          colSpan: 0,
          field: 'delete',
          slots: { default: 'delete' },
        },
      ],
    },
  ];

  const codeColumns = customColumns.map(d => {
    let x = { ...d };
    if (['version', 'status', 'action', 'enable'].includes(x.field as string)) {
      x.customCell = (record, index, column) => {
        const rowSpan = getCodeRowSpan(record, index);
        return { rowSpan };
      };
    }
    return x;
  });

  const processColumns = customColumns.map(d => {
    let x = { ...d };
    if (['version', 'status', 'action', 'enable'].includes(x.field as string)) {
      x.customCell = (record, index, column) => {
        const rowSpan = getProcessRowSpan(record, index);
        return { rowSpan };
      };
    }
    return x;
  });
  const [designGridOne, designGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-design-detailPopup-one',
      columns: customColumns,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      pagerConfig: {
        enabled: false,
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      toolbarConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['version', 'status', 'action', 'enable'];
        const diffField = 'version';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
    },
  });

  const [designGridTwo, designGridTwoApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-design-detailPopup-two',
      columns: [
        { title: '工序编码', field: 'code', minWidth: 100 },
        { title: '执行工序', field: 'name' },
        { title: '生产类型', field: 'typeDesc' },
        { title: '工序类型', field: 'processTypeDesc' },
      ],
      toolbarConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      pagerConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      data: state.tableData,
    },
  });
  const [designGridThree, designGridThreeApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-design-detailPopup-three',
      // columns: [
      //   { title: '物料编码', field: 'poNo', minWidth: 100 },
      //   { title: '物料名称', field: 'poNo' },
      //   { title: '材质', field: 'poNo' },
      //   { title: '物料类型', field: 'poNo' },
      // ],
      columns: [],
      showIndexColumn: true,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      pagerConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      data: state.tableData,
    },
  });
  const [programGrid, programGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-detailPopup-program',
      columns: codeColumns,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      pagerConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['version', 'status', 'action', 'enable'];
        const diffField = 'version';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      data: state.programCodeList,
    },
  });
  const [programGridTwo, programGridTwoApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-detailPopup-programTwo',
      columns: processColumns,
      showIndexColumn: true,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      pagerConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['version', 'status', 'action', 'enable'];
        const diffField = 'version';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      data: state.programProcessList,
    },
  });
  function getCustomerRowSpan(record, index) {
    return getRowSpan.bind(null, record, index, state.customerPicList)();
  }
  function getCodeRowSpan(record, index) {
    return getRowSpan.bind(null, record, index, state.programCodeList)();
  }
  function getProcessRowSpan(record, index) {
    return getRowSpan.bind(null, record, index, state.programProcessList)();
  }
  function getRowSpan(record, index, list) {
    if (index === 0 || record?.version !== list[index - 1]?.version) {
      const count = list.slice(index).filter(item => item.version === record.version).length;
      return count;
    }
    return 0;
  }
  function getDrawingList() {
    emits('reload'); //文件发生变化，则主列表需要重载
    if (state.bizType == '3') {
      // 工程图纸
      getDrawingshistory({
        id: state.id,
        DrawingsType: 'EngineeringDrawings',
      }).then(({ data, code }) => {
        state.customerPicList = data;
        designGridApi.reloadData(state.customerPicList);
      });
    } else {
      getCodeList();
      getProcessList();
      // 程序代码
      function getCodeList() {
        getDrawingshistory({
          id: state.id,
          DrawingsType: 'ProgramCode',
        }).then(({ data, code }) => {
          state.programCodeList = data;
          programGridApi.reloadData(state.programCodeList);
        });
      }
      // 程序工艺
      function getProcessList() {
        getDrawingshistory({
          id: state.id,
          DrawingsType: 'ProgramProcess',
        }).then(({ data, code }) => {
          state.programProcessList = data;
          programGridTwoApi.reloadData(state.programProcessList);
        });
      }
    }
  }

  async function handleHistoryDownload(val) {
    const {
      data: { name, url },
    } = await downloadDrawingshistory({
      Id: val.id,
    });
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }
  function handleUpload(record, type) {
    state.title = uploadInfo[type].title;
    openUpload(true, {
      Id: state.id,
      Version: record.version,
      api: uploadInfo[type].uploadApi,
    });
  }

  function handleEnable(record) {
    if (record.status == '2') {
      // 启用
      enableDrawings(record.id)
        .then(({ code, msg }) => {
          if (code == 200) {
            createMessage.success(msg);
            getDrawingList();
          }
        })
        .finally(e => {
          // emit('changeLoading', false);
        });
    }
  }
  function handleDeletePic(val, type) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: () => {
        // emits('changeLoading', true);
        let api = uploadInfo[type].deleteApi;
        api(val.id)
          .then(({ code }) => {
            if (code === 200) {
              message.success(t('common.delSuccess'));
              getDrawingList();
            }
          })
          .finally(e => {
            // emits('changeLoading', false);
          });
      },
    });
  }
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }
  async function getCadPics() {
    console.log(state.id);
    // 工程图纸
    let { data, code } = await getDrawingshistory({
      id: state.id,
      DrawingsType: 'EngineeringDrawings',
    });
    data.forEach(async d => {
      let curD = d;
      let res = await previewDrawingshistory({
        name: d.originFileName,
        Id: d.id,
        previewType: 'localPreview',
        noCache: false,
        isCopy: 0,
      });
      if (res.data) {
        curD.url = res.data;
        cadPicList.push(curD);
      }
    });
  }

  async function getMoldapplyDetailFn(id) {
    changeLoading(true);
    try {
      const { data, code } = await getMoldapplyDetailSingle(id);
      if (code === 200) {
        state.tableData = data.processSeqList.map(o => {
          return o;
        });
        setFieldsValue(data.applyDetail);
        /** 【已审核】的数据，是不可编辑的 */
        state.isCanEdit = `${data.applyDetail.status}` !== STATUS_ENUM.已审核;
        getRowSpanRuleFn();
        if (state.bizType === '3') {
          designGridTwoApi.reloadData(state.tableData);
        }
      }
    } catch (error) {
      console.error(error, 'getMoldapplyDetailFn error');
    } finally {
      changeLoading(false);
    }
  }

  function getRowSpanRuleFn() {
    APPLY_DETAIL_COLUMNS[0].customCell = (_, index) => {
      if (index === 0) return { rowSpan: state.tableData.length };
      else return { rowSpan: 0 };
    };
  }
  function initFn() {
    emits('reload');
    closePopup();
  }
</script>

<style lang="less" scoped>
  .upload-wrapper-item {
    display: flex;
    flex-direction: column;
    width: 49%;

    span {
      height: 100%;
    }

    .upload-btn-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .tip {
        margin-left: 8px;
      }
    }
  }

  .cad-drawing {
    height: 100%;
    background-color: rgb(209 206 206);
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }

  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0;
  }

  :deep(.pic-list .ant-table-thead > tr > th, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
    padding: 8px;
  }

  :deep(.pic-list .ant-table-tbody > tr > td) {
    padding: 8px;
  }

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }

  .drawings-item {
    height: 32px;
    background-color: rgb(0 0 0 / 4%);
    border: 1px solid rgb(217 217 217);
    border-radius: 4px;
    padding: 4px 11px;
  }
</style>
