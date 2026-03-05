import type { VxeGridPropTypes } from 'vxe-table';

import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { toLower } from 'lodash-es';
import { useRoute } from 'vue-router';
import { getProgramPage } from '/@/api/engineering/mould';
import { getProductType } from '/@/api/engineering/pcc';
import { IS_MEET_OPTIONS } from '/@/views/engineering/mouldRoom/mouldRequirementReview/config';

// 扩展 BasicColumn 接口，添加 disabled 属性
type InputTypeOptions = 'cn' | 'en' | 'number' | 'code' | 'text' | '';
interface ExtendedBasicColumn extends BasicColumn {
  disabled?: boolean;
  isEdit?: boolean;
  border?: boolean;
  placeholder?: string;
  inputType?: InputTypeOptions;
}

const baseStore = useBaseStore();
const { t } = useI18n();

export const P_R__STATUS_COLOR_MAP = {
  0: { background: 'rgba(200, 200, 200, 0.20)', color: '#999999', text: '待处理' },
  1: { background: 'rgba(82, 196, 26, 0.10)', color: '#52C41A', text: '已处理' },
  2: { background: 'rgba(218, 91, 251, 0.10)', color: '#DA5BFB', text: '撤回' },
  3: { background: 'rgba(24, 144, 255, 0.10)', color: '#1890FF', text: '比价中' },
  4: { background: 'rgba(24, 144, 255, 0.10)', color: '#1890FF', text: '在制中' },
};

export const URGENTLEVEL_STATUS_COLOR_MAP = {
  0: { color: '#000000' },
  1: { color: '#FAAD14' },
  2: { color: '#FF4D4F' },
};

/** 状态 取自字典`MoldApply.DesignStatus` */
export enum STATUS_ENUM {
  待维护 = '0',
  待审核 = '1',
  已审核 = '2',
}

const statusOptions = [
  { id: STATUS_ENUM.待维护, fullName: t('dict.MoldApply.DesignStatus.0'), theme: 'gray' },
  { id: STATUS_ENUM.待审核, fullName: t('dict.MoldApply.DesignStatus.1'), theme: 'blue' },
  { id: STATUS_ENUM.已审核, fullName: t('dict.MoldApply.DesignStatus.2'), theme: 'green' },
];

export const BASIC_SEARCH_FORM_SCHEMA = [
  {
    fieldName: 'poNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '需求单号',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '工单号',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具编号',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    labelWidth: 100,
    component: 'RangePicker',
    componentProps: {
      placeholder: ['请选择开始时间', '请选择结束时间'],
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'status',
    i18nField: 'statusName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.Status'),
      placeholder: '状态',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 2 },
  },
  {
    fieldName: 'moldType',
    i18nField: 'moldTypeName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
      placeholder: '工艺',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 3 },
  },
];

export const SEARCH_FORM_SCHEMA = [...BASIC_SEARCH_FORM_SCHEMA];

// 条件选项
export const P_R_SEARCH_FORM_OPTIONS = [
  { id: 0, fullName: '待处理' },
  { id: 1, fullName: '已处理' },
  { id: 3, fullName: '比价中' },
];

export const P_R_SEARCH_FORM_SCHEMA = [
  {
    fieldName: 'applyNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具申请单号',
      allowClear: true,
    },
  },
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '工单号',
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    i18nField: 'statusName',
    label: '',
    component: 'Select',
    componentProps: {
      options: statusOptions,
      allowClear: true,
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
    },
  },
  {
    fieldName: 'time',
    label: '',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      allowClear: true,
    },
  },
];

const DESIGN_SCHEMA = [
  ...P_R_SEARCH_FORM_SCHEMA,
  {
    fieldName: 'designatedEngineerName',
    i18nField: 'designatedEngineerId',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设计工程',
      allowClear: true,
    },
  },
  {
    fieldName: 'designatedAuditUserName',
    label: '',
    component: 'Input',
    i18nField: 'CommonCol.auditUserName',
    componentProps: {
      placeholder: '审核人',
      allowClear: true,
    },
  },
];

const PROGRAM_SCHEMA = [
  ...P_R_SEARCH_FORM_SCHEMA,
  {
    fieldName: 'programEngineerName',
    i18nField: 'programEngineerId',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '编程工程',
      allowClear: true,
    },
  },
  {
    fieldName: 'programAuditUserName',
    label: '',
    component: 'Input',
    i18nField: 'CommonCol.auditUserName',
    componentProps: {
      placeholder: '审核人',
      allowClear: true,
    },
  },
];

export const COLUMNS: BasicColumn[] = [
  { title: '模具需求单号', dataIndex: 'poNo' },
  { title: '模具图纸', dataIndex: 'moldDrawingsName' },
  // { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 260 },
  { title: '工厂', dataIndex: 'factoryName' },
  { title: '创建人', dataIndex: 'creatorUser' },
  { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD' },
];

export const DESIGN_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  { title: '模具图纸', field: 'moldDrawingsName', width: 150, slots: { default: 'moldDrawings' } },
  { title: '模具申请单号', field: 'applyNo', width: 150 },
  { title: '工单号', field: 'workOrderNo', width: 150 },
  { title: '模具料号', field: 'moldNo', width: 150 },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  {
    title: '交期回复',
    field: 'deliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  { title: '状态', field: 'designStatus', width: 80, i18nField: 'CommonCol.status', cellRender: { name: 'Tag', options: statusOptions } },
  { title: '审核人', field: 'designatedAuditUserName', i18nField: 'CommonCol.auditUserName', width: 150 },
  {
    title: '审核时间',
    field: 'designatedAuditDate',
    i18nField: 'CommonCol.auditTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  { title: '设计工程', field: 'designatedEngineerName', width: 150 },
  {
    title: '设计时间',
    field: 'designatedEngineerDate',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 150,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工厂',
    field: 'factoryName',
    width: 150,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '模具类型',
    field: 'moldType',
    formatter: ({ row }) => {
      return row.moldTypeName || '';
    },
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    formatter: ({ row }) => {
      return row.productTypeName || '';
    },
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: getProductType,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCategory',
        },
        rowParams: {
          factory: 'factory',
          bussniessType: 'businessType',
        },
        resultField: 'data',
        labelField: 'productCategory',
        valueField: 'id',
        filterOption: false,
      },
    },
  },
  {
    title: '材质',
    field: 'material',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    width: 150,
    cellRender: { name: 'Tag', options: IS_MEET_OPTIONS },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: IS_MEET_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  {
    title: '模具采购',
    field: 'purchaseUserId',
    formatter: ({ row }) => {
      return row.purchaseUserName || '';
    },
    width: 150,
    i18nField: 'moldPurchaseName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: 'PMC',
    field: 'designatedPmcReviewerId',
    formatter: ({ row }) => {
      return row.designatedPmcReviewerName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '申请人',
    field: 'applyUserId',
    formatter: ({ row }) => {
      return row.applyUserName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  { title: '申请时间', field: 'applyDate', width: 150, cellRender: { name: 'Date', format: 'YYYY-MM-DD hh:mm:ss' } },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];

export const PROGRAM_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  { title: '模具图纸', field: 'moldDrawingsName', width: 150, slots: { default: 'moldDrawings' } },
  { title: '模具申请单号', field: 'applyNo', width: 150 },
  { title: '工单号', field: 'workOrderNo', width: 150 },
  { title: '模具料号', field: 'moldNo', width: 150 },
  { title: '程序代码', field: 'programCode', width: 150, slots: { default: 'programCodeName' } },
  { title: '程序工艺', field: 'programProcess', width: 150, slots: { default: 'programProcessName' } },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  {
    title: '交期回复',
    field: 'deliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  { title: '状态', field: 'programStatus', width: 80, i18nField: 'CommonCol.status', cellRender: { name: 'Tag', options: statusOptions } },
  { title: '审核人', field: 'programAuditUserName', i18nField: 'CommonCol.auditUserName', width: 150 },
  {
    title: '审核时间',
    field: 'programAuditDate',
    i18nField: 'CommonCol.auditTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  { title: '编程工程', field: 'programEngineerName', width: 150 },
  {
    title: '编程时间',
    field: 'programEngineerDate',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 150,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工厂',
    field: 'factoryName',
    width: 150,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '模具类型',
    field: 'moldType',
    formatter: ({ row }) => {
      return row.moldTypeName || '';
    },
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    formatter: ({ row }) => {
      return row.productTypeName || '';
    },
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: getProductType,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCategory',
        },
        rowParams: {
          factory: 'factory',
          bussniessType: 'businessType',
        },
        resultField: 'data',
        labelField: 'productCategory',
        valueField: 'id',
        filterOption: false,
      },
    },
  },
  {
    title: '材质',
    field: 'material',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    width: 150,
    cellRender: { name: 'Tag', options: IS_MEET_OPTIONS },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: IS_MEET_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  {
    title: '模具采购',
    field: 'purchaseUserId',
    formatter: ({ row }) => {
      return row.purchaseUserName || '';
    },
    width: 150,
    i18nField: 'moldPurchaseName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: 'PMC',
    field: 'designatedPmcReviewerId',
    formatter: ({ row }) => {
      return row.designatedPmcReviewerName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  { title: '设计工程', field: 'designatedEngineerName', width: 150 },
  {
    title: '申请人',
    field: 'applyUserId',
    formatter: ({ row }) => {
      return row.applyUserName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  { title: '申请时间', field: 'applyDate', width: 150, cellRender: { name: 'Date', format: 'YYYY-MM-DD hh:mm:ss' } },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];

export const SUB_COLUMNS: BasicColumn[] = [
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '收货厂址', dataIndex: 'deliveryAddress' },
  { title: '供应商', dataIndex: 'supplier' },
  { title: '状态', dataIndex: 'statusName', width: 80 },
  { title: '当前处理人', dataIndex: 'currentProcessorName' },
  { title: '当前节点', dataIndex: 'currentNodeName' },
  { title: '节点记录', dataIndex: 'opera' },
  { title: '模具类型', dataIndex: 'moldTypeName' },
  { title: '产品类型', dataIndex: 'productTypeName' },
  { title: '客户要求交期', dataIndex: 'requireDeliveryTime', format: 'date|YYYY-MM-DD' },
  { title: '备注', dataIndex: 'moldRemark' },
];

export const SUB_COLUMNS_PRUCUREMENT: BasicColumn[] = [
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: 'PO单号', dataIndex: 'poNo' },
  { title: '收货厂址', dataIndex: 'deliveryAddress' },
  { title: '供应商', dataIndex: 'supplier' },
  { title: '状态', dataIndex: 'statusName' },
  { title: '模具类型', dataIndex: 'moldTypeName' },
  { title: '模具备注', dataIndex: 'moldRemark' },
  {
    title: '紧急程度',
    dataIndex: 'urgentLevelName',
    customRender: ({ record, text }: any) => {
      try {
        const _color = URGENTLEVEL_STATUS_COLOR_MAP[record.urgentLevel].color;
        return h('span', { style: { color: _color } }, text);
      } catch {
        return text;
      }
    },
  },
  { title: '预估寿命(K)', dataIndex: 'estimateLifespan' },
  { title: '模具用途', dataIndex: 'moldUseName' },
  { title: '费用归属', dataIndex: 'costAttribution', width: 300 },
  { title: '要期回复', dataIndex: 'requireDeliveryTime', format: 'date|YYYY-MM-DD' },
  { title: '交期回复', dataIndex: 'replyDeliveryTime', format: 'date|YYYY-MM-DD' },
  { title: '当前处理人', dataIndex: 'currentProcessorName' },
  { title: '当前节点', dataIndex: 'currentNodeName' },
  { title: '节点记录', dataIndex: 'opera' },
  { title: '处理时间', dataIndex: 'currentProcessorDate', format: 'date|YYYY-MM-DD' },
];

export const APPLY_DETAIL_COLUMNS: ExtendedBasicColumn[] = [
  // {
  //   title: '模具图纸',
  //   dataIndex: 'moldDrawingsId',
  //   disabled: true,
  //   isEdit: false,
  //   inputType: '',
  //   width: 300,
  //   border: true,
  // },
  { title: '模具需求单号', dataIndex: 'poNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '' },
  { title: '模具编号', dataIndex: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '' },
  {
    title: '紧急程度',
    dataIndex: 'urgentLevel',
    i18nField: 'urgentLevelName',
    disabled: true,
    isEdit: true,
    inputType: '',
    placeholder: '选择紧急程度',
  },
  { title: '模具类型', dataIndex: 'moldType', i18nField: 'moldTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '预估寿命(K)', dataIndex: 'estimateLifespan', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '产品内部料号', dataIndex: 'insidePartNumber', disabled: true, isEdit: true, inputType: 'code', width: 240, placeholder: '' },
  { title: '模具备注', dataIndex: 'moldRemark', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '内部项目代码', dataIndex: 'insideProjectCode', disabled: true, isEdit: true, placeholder: '自动带入', inputType: '' },
  { title: '直接客户代码', dataIndex: 'immediateCustomerCode', disabled: true, isEdit: true, placeholder: '自动带入', inputType: '' },
  { title: '工厂', dataIndex: 'factory', i18nField: 'factoryName', disabled: true, isEdit: true, placeholder: '自动带入', inputType: '' },
  { title: '模具采购', dataIndex: 'moldPurchaseId', i18nField: 'moldPurchaseName', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '模具用途', dataIndex: 'moldUse', i18nField: 'moldUseName', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '费用归属', dataIndex: 'costAttribution', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '' },
  { title: '产品类型', dataIndex: 'productType', i18nField: 'productTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '默认自动带入' },
  { title: '主材厚度(MM)', dataIndex: 'mainMaterialThickness', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '项目阶段', dataIndex: 'projectPhase', i18nField: 'projectPhaseName', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '数量', dataIndex: 'quantity', disabled: true, isEdit: true, inputType: '', placeholder: '' },
  { title: '销售', dataIndex: 'salespersonId', i18nField: 'salespersonName', disabled: true, isEdit: true, inputType: '', placeholder: '自动带入' },
  { title: '要求交期', dataIndex: 'requireDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '', format: 'date|YYYY-MM-DD' },
];

export const PROCUREMENT_COLUMNS: any[] = [
  { title: '费用归属', dataIndex: 'costAttribution', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '费用归属' },
  { title: '收货厂址', dataIndex: 'deliveryAddress', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '收货厂址' },
  { title: '供应商', dataIndex: 'supplier', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '供应商' },
  { title: '申请时间', dataIndex: 'applyDate', disabled: true, isEdit: true, inputType: '', placeholder: '供应商', format: 'date|YYYY-MM-DD' },
  { title: '要求交期', dataIndex: 'requireDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  { title: '回复交期', dataIndex: 'replyDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  { title: '产品类型', dataIndex: 'productTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '默认自动带入' },
  { title: '模具编号', dataIndex: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '模具编号' },
  { title: '模具备注', dataIndex: 'moldRemark', disabled: true, isEdit: true, inputType: '', placeholder: '模具备注' },
  { title: '数量', dataIndex: 'quantity', disabled: true, isEdit: true, inputType: '', placeholder: '数量' },
  { title: '模具用途', dataIndex: 'moldUseName', disabled: true, isEdit: true, inputType: '', placeholder: '模具用途' },
  { title: '工程负责人', dataIndex: 'applyUserName', disabled: true, isEdit: true, inputType: '', placeholder: '模具用途' },
  { title: '备注', dataIndex: 'remark', disabled: true, isEdit: true, inputType: '', placeholder: '模具用途' },
];

export const UPLOADPAPER_COLUMNS: ExtendedBasicColumn[] = [
  { title: '流水订单号', dataIndex: 'poNo', disabled: true, isEdit: true, inputType: '', placeholder: '流水订单号' },
  { title: '模具编号', dataIndex: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '模具编号' },
  // { title: '状态', dataIndex: 'status', disabled: true, isEdit: true, inputType: '', placeholder: '状态', width: 80 },
  // { title: '节点记录', dataIndex: 'opera' },
  { title: '模具类型', dataIndex: 'moldTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '模具类型' },
  { title: '产品类型', dataIndex: 'productTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '默认自动带入' },
  { title: '客户要求交期', dataIndex: 'requireDeliveryTime', disabled: true, isEdit: true, inputType: '', format: 'date|YYYY-MM-DD' },
  { title: '材料', dataIndex: 'material', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '材质' },
  { title: '材质', dataIndex: 'material', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '材质' },
  { title: '交期', dataIndex: 'deliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '交期', format: 'date|YYYY-MM-DD' },
  { title: '工艺是否满足', dataIndex: 'isProcessMeet', disabled: true, isEdit: true, inputType: '', placeholder: '工艺是否满足' },
  { title: '确认交期', dataIndex: 'deliveryTime', format: 'date|YYYY-MM-DD' },
];

const pageConfig = {
  design: {
    bizType: '3',
    column: DESIGN_COLUMNS, // .filter(x => !['programCodeName', 'programProcessName'].includes(x.field)),
    reviewColumn: UPLOADPAPER_COLUMNS,
    reject: true,
    edit: true,
    listApi: getProgramPage,
    schema: DESIGN_SCHEMA,
  },
  program: {
    bizType: '4',
    column: PROGRAM_COLUMNS, //.filter(x=>!(["moldDrawingsName","prjDrawingsName"].includes(x.dataIndex))),
    reviewColumn: UPLOADPAPER_COLUMNS,
    reject: false,
    edit: false,
    listApi: getProgramPage,
    schema: PROGRAM_SCHEMA,
  },
};
export function getPageConfig() {
  const route = useRoute();
  const page = toLower(route.query.page as any);
  console.log(page);
  const pgType = page?.includes('program') ? 'program' : 'design'; //设计还是编程流程页面
  return pageConfig[pgType];
}
