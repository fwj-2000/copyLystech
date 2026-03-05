import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

import { useBaseStore } from '/@/store/modules/base';
import { formatFileSize } from '/@/utils/file/base64Conver';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const { t } = useI18n();
const baseStore = useBaseStore();

const column = [
  {
    title: '单据号',
    sortable: true,
    field: 'documentNumber',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '模具类型',
    field: 'moldTypeName',
    width: 120,
  },
  {
    title: '厂内模号',
    field: 'factoryMoldNo',
    width: 160,
  },
  {
    title: '模具编号',
    field: 'moldNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '状态',
    field: 'issueNumber',
    sortable: true,
    filters: [{ data: '' }],
    slots: { default: 'IssueNumber' },
    width: 120,
    i18nField: 'statusName',
  },

  {
    title: '外发/内制',
    field: 'outsourceOrInternallyName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'outsourceOrInternally',
      props: {
        api: () => baseStore.getDictionaryData('outsourceOrInternally'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 120,
  },
  {
    title: '项目名称',
    field: 'projectName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '产品名称',
    field: 'productName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '版本',
    field: 'version',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '模具工程负责人',
    field: 'pdUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 220,
  },
  {
    title: 'T0交期',
    field: 't0DeliveryDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },

  {
    title: 'DFM附件',
    field: 'dfmAttaFile',
    width: 120,
    slots: { default: 'DfmAttaFile' },
    i18nField: 'DFMAttachment',
  },
  {
    title: '客户图纸',
    field: 'customerFile',
    width: 120,
    slots: { default: 'CustomerFile' },
  },
  {
    title: '报价单附件',
    field: 'quotationFile',
    width: 120,
    slots: { default: 'QuotationFile' },
    i18nField: 'quotationAttachment',
  },
  {
    title: '模流分析附件',
    field: 'mfaFile',
    width: 120,
    slots: { default: 'MfaFile' },
    i18nField: 'moldFlowAttachment',
  },

  {
    title: '厂区',
    field: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    filters: [{ data: '' }],
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
  {
    title: '备注',
    field: 'remark',
    filters: [{ data: '' }],
    width: 180,
  },
];

export function getColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  if (hasBtnP('btn_detail')) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    columnData.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export function getFormColumn() {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具编号',
      },
    },
    {
      fieldName: 'outsourceOrInternally',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '外发/内制',
        api: () => baseStore.getDictionaryData('outsourceOrInternally'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
      i18nField: 'outsourceOrInternallyName',
    },
    {
      fieldName: 'projectName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
    {
      fieldName: 'factoryMoldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '厂内模号',
      },
    },
    {
      fieldName: 'pdUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '模具工程负责人',
      },
      i18nField: 'pdUserName',
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      defaultValue: [],
    },
  ];
}

export const DFMGridColumn: any[] = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: 'DFM原件',
    field: 'attachmentName',
    width: 300,
    slots: {
      default: 'AttachmentName',
    },
    i18nField: 'DFMPart',
  },
  {
    title: 'DFM客户回复件',
    field: 'dfmDeliveryAttaName',
    width: 300,
    slots: {
      default: 'DfmDeliveryAttaName',
    },
    i18nField: 'DFMCustomerReply',
  },
  {
    title: '文件大小',
    field: 'dfmDeliveryAttaSize',
    formatter: ({ cellValue }) => (cellValue ? formatFileSize(cellValue) : ''),
    i18nField: 'attachmentSize',
  },
  {
    title: '上传人',
    field: 'uploadUserName',
    i18nField: 'CommonCol.uploadUserName',
  },
  {
    title: '上传时间',
    field: 'uploadTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.uploadTime',
  },
  {
    title: '启用状态',
    field: 'status',
    slots: { default: 'Status' },
    i18nField: 'CommonCol.enableStatus',
  },
];

export const CustomerGridColumn: any[] = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '图纸名称',
    field: 'attachmentName',
    slots: {
      default: 'AttachmentName',
    },
    i18nField: 'CommonCol.attachmentName',
  },
  {
    title: '文件大小',
    field: 'attachmentSize',
    formatter: ({ cellValue }) => (cellValue ? formatFileSize(cellValue) : ''),
    i18nField: 'attachmentSize',
  },
  {
    title: '上传人',
    field: 'uploadUserName',
    i18nField: 'CommonCol.uploadUserName',
  },
  {
    title: '上传时间',
    field: 'uploadTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.uploadTime',
  },
];

export const QuotationGridColumn: any[] = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '文件名称',
    field: 'attachmentName',
    slots: {
      default: 'AttachmentName',
    },
    i18nField: 'CommonCol.fileName',
  },
  {
    title: '文件大小',
    field: 'attachmentSize',
    formatter: ({ cellValue }) => (cellValue ? formatFileSize(cellValue) : ''),
    i18nField: 'attachmentSize',
  },
  {
    title: '上传人',
    field: 'uploadUserName',
    i18nField: 'CommonCol.uploadUserName',
  },
  {
    title: '上传时间',
    field: 'uploadTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.uploadTime',
  },
];

const getColumns = (type: string) => {
  switch (type) {
    case 'DFMGrid':
      return DFMGridColumn;
    case 'CustomerGrid':
      return CustomerGridColumn;
    case 'QuotationGrid':
      return QuotationGridColumn;
    case 'MoldFlow':
      return QuotationGridColumn;
    default:
      return DFMGridColumn;
  }
};

export function getGridColumn(type: string): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(getColumns(type));
  if (hasBtnP('btn_detail')) {
    columnData.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  if (type === 'DFMGrid') {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  }
  return columnData;
}

const moldTypes = ['2', '3', '4', '5'];

export const detailFormSchemas = [
  {
    field: 'moldType',
    label: '模具类型',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('moldType'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
    i18nField: 'moldTypeName',
  },
  {
    field: 'factoryMoldNo',
    label: '厂内模号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    required: true,
  },
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: {
      placeholder: t('请输入'),
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'version',
    label: '版本',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'pdUserId',
    label: '模具工程负责人',
    component: 'CustomUserSelect',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    i18nField: 'pdUserName',
  },
  {
    field: 'orderDate',
    label: '开单日期',
    component: 'DatePicker',
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
    ifShow: ({ values }) => {
      return moldTypes.includes(values.moldType);
    },
  },
  {
    field: 'successTime',
    label: '完成时间',
    component: 'DatePicker',
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
    ifShow: ({ values }) => {
      return moldTypes.includes(values.moldType);
    },
  },
  {
    field: 'urgentLevel',
    label: '紧急程度',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    ifShow: ({ values }) => {
      return moldTypes.includes(values.moldType);
    },
    i18nField: 'urgentLevelName',
  },
  {
    field: 'isModifyDraw',
    label: '是否涉及改图',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('YesOrNo'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
      defaultValue: '1',
    },
    ifShow: ({ values }) => {
      return moldTypes.includes(values.moldType);
    },
  },
  {
    field: 'factoryArea',
    label: '厂区',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '请选择厂区',
      showSearch: true,
      apiSearch: {
        show: true,
      },
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      useChangeCopy: true,
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Name'],
      defaultFirstOption: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    i18nField: 'factoryAreaName',
  },
  {
    field: 't0DeliveryDate',
    label: 'T0交期',
    component: 'DatePicker',
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'outsourceOrInternally',
    label: '外发/内制',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('outsourceOrInternally'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    i18nField: 'outsourceOrInternallyName',
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
  },
];

export const formSchema = [
  {
    field: 'meetPersonIds',
    label: '与会人员',
    component: 'Select',
    componentProps: {
      multiple: true,
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'dqeUserId',
    label: '签核',
    component: 'Select',
    componentProps: {
      multiple: true,
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
      placeholder: '请选择DQE',
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'pdLeaderId',
    label: ' ',
    component: 'Select',
    componentProps: {
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
      placeholder: '请选择PD/leader',
    },
  },
  {
    field: 'teLeaderId',
    label: ' ',
    component: 'Select',
    componentProps: {
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
      placeholder: '请选择TE主管',
    },
  },
  {
    field: 'rdLeaderId',
    label: ' ',
    component: 'Select',
    componentProps: {
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
      placeholder: '请选择研发经理',
    },
  },
  {
    field: 'moldUndertakerId',
    label: ' ',
    component: 'Select',
    componentProps: {
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.Name.toLowerCase().includes(input.toLowerCase());
      },
      placeholder: '请选择模具部承办',
    },
  },
];
