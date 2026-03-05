import { BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const waitGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECN单号',
    field: 'applyCode',
  },
  {
    title: '状态',
    field: 'status',
    // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '变更主题',
    field: 'changeTheme',
  },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
  },
  {
    title: 'PD',
    field: 'applyUserName',
  },
  {
    title: '申请人',
    field: 'applyUserName',
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
  },
  {
    title: '申请日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
];

export const doneGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECN单号',
    field: 'applyCode',
  },
  {
    title: '状态',
    field: 'status',
    // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '变更主题',
    field: 'changeTheme',
  },
  // {
  //   title: '产品内部料号',
  //   dataIndex: 'insidePartNumber',
  // },
  // {
  //   title: '新版本',
  //   dataIndex: 'version',
  // },
  // {
  //   title: '产品描述',
  //   dataIndex: 'productDesc',
  // },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
  },
  // {
  //   title: 'PD',
  //   dataIndex: 'pd',
  // },
  {
    title: '申请人',
    field: 'applyUserName',
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
  },
  {
    title: '申请日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  // {
  //   title: '处理人',
  //   dataIndex: 'handlerName',
  // },
  {
    title: '处理日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
];

const baseStore = useBaseStore();
export function getFormConfig() {
  return [
    // autoAdvancedLine: 1,
    // actionColOptions: {
    //   span: 3,
    // },
    // baseColProps: {
    //   span: 4,
    // },
    // schemas: [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: 'ECN单号/产品内部料号',
        submitOnPressEnter: true,
      },
      colProps: {
        span: 3,
      },
    },
    {
      label: '',
      fieldName: 'changeTheme',
      component: 'Input',
      componentProps: {
        placeholder: '变更主题',
        submitOnPressEnter: true,
      },
      colProps: {
        span: 3,
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
        submitOnPressEnter: true,
      },
      colProps: {
        span: 3,
      },
    },
    {
      label: '',
      fieldName: 'pd',
      component: 'Input',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'time',
      component: 'RangePicker',
      componentProps: {
        submitOnPressEnter: true,
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
      },
    },
    {
      label: '',
      fieldName: 'status',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '状态',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('Flow.BillStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
    // ],
    // i18nConfig: {
    //   moduleCode: 'ECNColumn',
    //   transferRange: ['placeholder'],
    // },
  ];
}

export const DOCUMENT_TYPE_OPTIONS = [
  { id: 1, theme: 'gray', fullName: 'PCC', rowKey: 'statusDesc' },
  { id: 2, theme: 'gray', fullName: '工程图纸', rowKey: 'statusDesc' },
];
export const REVIEW_RESULT_OPTIONS = [
  { id: 0, fullName: '处理中', theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: '同意', theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: '不同意', theme: 'red', rowKey: 'statusDesc' },
];

export function getApplyColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: '请选择产品内部料号',
        api: getPartNumberApplySearch,
        showSearch: true,
        resultField: 'data',
        notFoundContent: null,
        labelField: 'insidePartNumber',
        valueField: 'insidePartNumber',
        immediate: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        onChange: (insidePartNumber, data, record) => {
          console.log(insidePartNumber);
          const { factory, productDesc, members } = data;
          const { editValueRefs } = record;
          console.log(members);
          editValueRefs.factory = factory;
          editValueRefs.productDesc = productDesc;
          const PD = members.find(item => item.configType === 'PDPerson')?.memberName;
          editValueRefs.pd = PD || '';
        },
      },
      width: 120,
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      editRow: true,
      width: 120,
    },
    {
      title: 'PD',
      dataIndex: 'pd',
      editRow: true,
      width: 120,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      editRow: true,
      width: 120,
    },
  ];
}

export const ROW_DATA = {
  insidePartNumber: '',
  factory: '',
  pd: '',
  productDesc: '',
  onEdit: true,
  editable: true,
  disabled: {
    factory: true,
    pd: true,
    productDesc: true,
  },
};
