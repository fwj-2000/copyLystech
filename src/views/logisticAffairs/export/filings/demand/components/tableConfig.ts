import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const userStore = useUserStore();

export const approveStatusList = [
  { id: 0, fullName: t('dict.FilingsApplyDataStatusEnum.0'), theme: 'gray' },
  { id: 1, fullName: t('dict.FilingsApplyDataStatusEnum.1'), theme: 'green' },
  { id: 2, fullName: t('dict.FilingsApplyDataStatusEnum.2'), theme: 'green' },
  { id: 3, fullName: t('dict.FilingsApplyDataStatusEnum.3'), theme: 'yellow' },
  { id: 4, fullName: t('dict.FilingsApplyDataStatusEnum.4'), theme: 'purple' },
  { id: 5, fullName: t('dict.FilingsApplyDataStatusEnum.5'), theme: 'red' },
];

export const statusOptions = [
  { id: 1, fullName: t('dict.FilingsApplyStatusEnum.1'), theme: 'gray' },
  // { id: 2, fullName: t('dict.FilingsApplyStatusEnum.2'), theme: 'blue' },
  // { id: 3, fullName: t('dict.FilingsApplyStatusEnum.3'), theme: 'green' },
  { id: 4, fullName: t('dict.FilingsApplyStatusEnum.4'), theme: 'yellow' },
  { id: 5, fullName: t('dict.FilingsApplyStatusEnum.5'), theme: 'purple' },
  { id: 7, fullName: t('dict.FilingsApplyStatusEnum.7'), theme: 'gray' },
  { id: 8, fullName: t('dict.FilingsApplyStatusEnum.8'), theme: 'green' },
];

export function getSchemas(_isTodoPage = false) {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '工厂', allowClear: true },
    },
    {
      fieldName: 'customsPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customsPersonName',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '关务',
        allowClear: true,
        defaultValue: _isTodoPage ? undefined : userStore.getUserInfo?.userId,
      },
    },
    // {
    //   fieldName: 'pdPersonId',
    //   label: '',
    //   component: 'CustomUserSelect',
    //   i18nField: 'pdPersonName',
    //   labelWidth: 100,
    //   colProps: {
    //     span: 3,
    //   },
    //   componentProps: {
    //     placeholder: 'PD',
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'produceCreateId',
    //   label: '',
    //   component: 'CustomUserSelect',
    //   i18nField: 'produceCreateName',
    //   labelWidth: 100,
    //   colProps: {
    //     span: 3,
    //   },
    //   componentProps: {
    //     placeholder: '生产备案员',
    //     allowClear: true,
    //   },
    // },
    {
      fieldName: 'handlerId',
      i18nField: 'handlerName',
      label: '',
      component: 'CustomUserSelect',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '请选择处理人',
        allowClear: true,
        defaultValue: _isTodoPage ? userStore.getUserInfo?.userId : undefined,
      },
    },
    {
      fieldName: 'customersId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customersName',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '客服', allowClear: true },
    },
    {
      fieldName: 'sellCorporation',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '出货备案法人', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerName',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '直接客户名称', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '直接客户料号', allowClear: true },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '请输入终端客户料号', allowClear: true },
    },
    {
      fieldName: 'reviewStatus',
      label: '',
      component: 'Select',
      labelWidth: 100,
      i18nField: 'status',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
        fieldNames: { value: 'id', label: 'fullName' },
      },
    },
    {
      fieldName: 'engineeringStatus',
      label: '',
      component: 'Select',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '工程数据',
        options: approveStatusList,
        allowClear: true,
        fieldNames: { value: 'id', label: 'fullName' },
      },
    },
    {
      fieldName: 'produceStatus',
      label: '',
      component: 'Select',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '生产数据',
        options: approveStatusList,
        allowClear: true,
        fieldNames: { value: 'id', label: 'fullName' },
      },
    },
  ];
}

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: '备案需求单号',
    field: 'filingsApplyNo',
    sortable: true,
    width: 180,
    slots: {
      default: 'filingsApplyNo',
    },
    aqpFilter: {
      enabled: true,
      cSharpType: 'string',
      name: 'Input',
    },
  },
  { title: '产品内部料号', field: 'insidePartNumber', sortable: true, width: 180 },
  // {
  //   title: '脱敏图纸',
  //   field: 'desensitizedDrawingsName',
  //   width: 220,
  //   slots: { default: 'DesensitizedDrawingsName' },
  // },
  {
    title: '状态',
    field: 'reviewStatus',
    i18nField: 'status',
    width: 150,
    sortable: true,
    cellRender: {
      name: 'Tag',
      options: statusOptions,
      cSharpType: 'int',
    },
  },
  {
    title: '当前处理人',
    field: 'handlerName',
    i18nField: 'CommonCol.currentNodeUser',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '当前节点',
    field: 'currentNode',
    i18nField: 'CommonCol.currentNode',
    width: 200,
    aqpFilter: {
      enabled: false,
    },
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 200,
    slots: {
      default: 'nodeDetail',
    },
  },
  { title: 'PD', field: 'pdPersonName', sortable: true, width: 180 },
  {
    title: '工程数据',
    field: 'engineeringStatus',
    sortable: true,
    width: 180,
    cellRender: {
      name: 'Tag',
      options: approveStatusList,
      cSharpType: 'int',
    },
  },
  { title: '生产备案员', field: 'produceCreateName', width: 180 },
  {
    title: '生产数据',
    field: 'produceStatus',
    sortable: true,
    width: 180,
    cellRender: {
      name: 'Tag',
      options: approveStatusList,
      cSharpType: 'int',
    },
  },
  {
    title: '审核记录',
    field: 'auditRecord',
    i18nField: 'CommonCol.auditRecord',
    width: 100,
    slots: {
      default: 'auditRecord',
    },
  },
  { title: '客服', field: 'customersName', sortable: true, width: 180 },
  { title: '工厂', field: 'factory', sortable: true, width: 180 },
  { title: '出货备案法人', field: 'sellCorporation', sortable: true, width: 180 },
  { title: '直接客户料号', field: 'immediateCustomerPartNumber', sortable: true, width: 180 },
  { title: '直接客户简称', field: 'immediateCustomerName', sortable: true, width: 180 },
  { title: '终端客户料号', field: 'terminalCustomerPartNumber', sortable: true, width: 180 },
  { title: '关务', field: 'customsPersonName', sortable: true, width: 180 },
  { title: '创建时间', field: 'creatorTime', cellRender: { name: 'Date' }, width: 180 },
];

export function getColumnsDone() {
  return [...columns];
}
