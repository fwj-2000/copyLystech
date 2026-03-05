import { BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { STATUS_OPTIONS } from '/@/utils/status';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const waitGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECR单号',
    field: 'ecrCode',
    width: 120,
  },
  {
    title: 'ECN单号',
    field: 'applyCode',
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
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 200,
  },
  {
    title: '产品描述',
    field: 'productDesc',
  },
  {
    title: '资料类型',
    field: 'documentType',
    // format: 'tag|' + JSON.stringify(DOCUMENT_TYPE_OPTIONS),
    formatter: ({ cellValue }) => {
      if (cellValue == 1) {
        // 工程图纸
        return t('dict.EngineeringDocApply.DocType.1');
      } else if (cellValue == 2) {
        // 模切SOP
        return t('dict.EngineeringDocApply.DocType.2');
      } else if (cellValue == 3) {
        // 手工SOP
        return t('dict.EngineeringDocApply.DocType.3');
      } else if (cellValue == 4) {
        // 包装POP
        return t('dict.EngineeringDocApply.DocType.4');
      } else if (cellValue == 5) {
        return 'PCC';
      } else if (cellValue == 6) {
        return 'SIP';
      }
      return '';
    },
    width: 120,
  },
  {
    title: '变更后版本',
    field: 'version',
    // customRender: ({ text }) => {
    //   return `T${text}`;
    // },
    formatter: ({ cellValue }) => {
      return `T${cellValue}`;
    },
    width: 150,
  },
  // {
  //   title: '文档状态',
  //   field: 'docStatus',
  // },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 120,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
    width: 120,
  },
  {
    title: '申请人',
    field: 'applyUserName',
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
    width: 160,
  },
  {
    title: '申请日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

export const doneGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECN单号',
    field: 'applyCode',
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
    width: 120,
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
    width: 160,
  },
  {
    title: '申请日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

const baseStore = useBaseStore();
export function waitGetFormConfig() {
  return [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: '单号/产品内部料号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'productDesc',
      component: 'Input',
      componentProps: {
        placeholder: '产品描述',
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
    {
      label: '',
      fieldName: 'documentType',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '资料类型',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
  ];
}
// export function waitGetFormConfig() {
//   return [
// autoAdvancedLine: 1,
// actionColOptions: {
//   span: 4,
// },
// baseColProps: {
//   span: 4,
// },
// schemas: [
//       {
//         label: '',
//         field: 'applyCode',
//         component: 'Input',
//         componentProps: {
//           placeholder: '单号/产品内部料号',
//           submitOnPressEnter: true,
//         },
//       },
//       // {
//       //   label: '',
//       //   field: 'changeTheme',
//       //   component: 'Input',
//       //   componentProps: {
//       //     placeholder: '变更主题',
//       //     submitOnPressEnter: true,
//       //   },
//       // },
//       {
//         label: '',
//         field: 'productDesc',
//         component: 'Input',
//         componentProps: {
//           placeholder: '产品描述',
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
//       {
//         label: '',
//         field: 'documentType',
//         component: 'ApiSelect',
//         componentProps: {
//           placeholder: '资料类型',
//           submitOnPressEnter: true,
//           api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType'),
//           labelField: 'fullName',
//           valueField: 'enCode',
//         },
//       },
//     ],
// i18nConfig: {
//   moduleCode: 'ECNColumn',
//   transferRange: ['placeholder'],
// },
//   }
export function getFormConfig() {
  return [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
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
//           placeholder: '单号',
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
