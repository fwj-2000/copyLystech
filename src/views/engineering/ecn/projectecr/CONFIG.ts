import { BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const REVIEW_RESULT_OPTIONS = [
  { id: 0, fullName: '处理中', theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: '同意', theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: '不同意', theme: 'red', rowKey: 'statusDesc' },
];

export const waitGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECR单号',
    field: 'applyCode',
    width: 120,
  },
  {
    title: '变更主题',
    field: 'changeTheme',
    width: 120,
  },
  {
    title: '状态',
    field: 'status',
    // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
    width: 180,
  },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 150,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
    width: 150,
  },
  {
    title: '申请人',
    field: 'applyUserName',
    width: 200,
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
    width: 180,
  },
  {
    title: '申请日期',
    field: 'applyDate',
    // format: 'date|YYYY-MM-DD',
    cellRender: {
      name: 'Date',
    },
    width: 150,
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
];

export const doneGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECR单号',
    field: 'applyCode',
  },
  {
    title: '变更主题',
    field: 'changeTheme',
    width: 120,
  },
  {
    title: '状态',
    field: 'status',
    // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
    width: 180,
  },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 140,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
    width: 120,
  },
  {
    title: '审批结果',
    field: 'reviewResult',
    // format: 'tag|' + JSON.stringify(REVIEW_RESULT_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: REVIEW_RESULT_OPTIONS,
    },
    width: 120,
  },
  {
    title: '申请人',
    field: 'applyUserName',
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
    width: 180,
  },
  {
    title: '申请日期',
    field: 'applyDate',
    // format: 'date|YYYY-MM-DD',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

const baseStore = useBaseStore();

export function getFormConfig() {
  return [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: 'ECR单号',
        submitOnPressEnter: true,
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
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
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
  ];
}

// export function getFormConfig(): Partial<FormProps> {
//   return {
//     autoAdvancedLine: 1,
//     actionColOptions: {
//       span: 4,
//     },
//     baseColProps: {
//       span: 4,
//     },
//     schemas: [
//       {
//         label: '',
//         field: 'applyCode',
//         component: 'Input',
//         componentProps: {
//           placeholder: 'ECR单号',
//           submitOnPressEnter: true,
//         },
//       },
//       {
//         label: '',
//         field: 'changeTheme',
//         component: 'Input',
//         componentProps: {
//           placeholder: '变更主题',
//           submitOnPressEnter: true,
//         },
//       },
//       {
//         label: '',
//         field: 'applyUserName',
//         component: 'Input',
//         componentProps: {
//           placeholder: '申请人',
//           submitOnPressEnter: true,
//         },
//       },
//       {
//         label: '',
//         field: 'time',
//         component: 'DateRange',
//         componentProps: {
//           submitOnPressEnter: true,
//           placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
//         },
//       },
//       {
//         label: '',
//         field: 'status',
//         component: 'ApiSelect',
//         componentProps: {
//           placeholder: '状态',
//           submitOnPressEnter: true,
//           api: () => baseStore.getDictionaryData('Flow.BillStatus'),
//           labelField: 'fullName',
//           valueField: 'enCode',
//         },
//       },
//     ],
//     i18nConfig: {
//       moduleCode: 'ECNColumn',
//       transferRange: ['placeholder'],
//     },
//   };
// }

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
      title: '资料类型',
      dataIndex: 'documentType',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: '请选择资料类型',
        api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType', true),
        showSearch: true,
        resultField: 'data',
        notFoundContent: null,
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        onChange: (documentType, data, record) => {
          if (documentType == 1) {
            // PCC
            console.log(record);
          } else if (documentType == 2) {
            // 工程图纸
          }
        },
      },
      width: 120,
    },
    {
      title: '变更后版本',
      dataIndex: 'version',
      editRow: true,
      editComponentProps: {
        placeholder: '变更后版本',
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
  documentType: '',
  productDesc: '',
  onEdit: true,
  editable: true,
  disabled: {
    insidePartNumber: true,
    factory: true,
    pd: true,
    productDesc: true,
  },
};
