import { BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { h } from 'vue';
import { STATUS_OPTIONS } from '/@/utils/status';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { DateRange } from '/@/components/DatePicker';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';

const { t } = useI18n();
export const REVIEW_RESULT_OPTIONS = [
  { id: 0, fullName: t('dict.prOrderStatus.2'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: t('dict.SFCReviewStatus.2'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disagree'), theme: 'red', rowKey: 'statusDesc' },
];

export const column = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECR单号',
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
    title: '变更主题',
    field: 'changeTheme',
    width: 150,
  },
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
    title: '审批结果',
    field: 'reviewResult',
    // format: 'tag|' + JSON.stringify(REVIEW_RESULT_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: REVIEW_RESULT_OPTIONS,
    },
    // customRender: ({ text }) => {
    //   if (text == 1) {
    //     return h('div', { style: 'color:#52C41A' }, '同意');
    //   } else if (text == 2) {
    //     return h('div', { style: 'color:#FAAD14' }, '不同意');
    //   }
    // },
    width: 120,
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
    // format: 'date|YYYY-MM-DD',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
];

const baseStore = useBaseStore();

export function getVxeSchema() {
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
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
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
//           placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
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

// export const STATUS_OPTIONS = [
//   { id: 0, fullName: '待处理', theme: 'gray', rowKey: 'statusDesc' },
//   { id: 1, fullName: '暂存', theme: 'gray', rowKey: 'statusDesc' },
//   { id: 2, fullName: '在办', theme: 'blue', rowKey: 'statusDesc' },
//   { id: 3, fullName: '结案', theme: 'green', rowKey: 'statusDesc' },
//   { id: 4, fullName: '撤回', theme: 'yellow', rowKey: 'statusDesc' },
//   { id: 5, fullName: '驳回', theme: 'yellow', rowKey: 'statusDesc' },
//   { id: 6, fullName: '终止', theme: 'red', rowKey: 'statusDesc' },
// ];

export function getApplyColumns(): BasicColumn[] {
  return [
    {
      title: t('dict.CommonCol.insidePartNumber'),
      dataIndex: 'insidePartNumber',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: t('dict.CommonCol.insidePartNumber'),
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
          const PD = members.find(item => item.configType === 'PDPerson')?.memberId;
          editValueRefs.pd = PD || '';
        },
      },
      width: 120,
    },
    {
      title: t('dict.CommonCol.factory'),
      dataIndex: 'factory',
      editRow: true,
      width: 120,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getPartNumberFactoryList,
        showSearch: true,
        originParams: {
          partNumber: 'record.insidePartNumber',
        },
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        onChange: (_value, option, record) => {
          const { editValueRefs } = record;
          const { Members } = option;
          const PD = Members.find(item => item.configType === 'PDPerson')?.memberId;
          editValueRefs.pd = PD || '';
        },
      },
    },
    // PD
    {
      title: t('dict.CommonCol.nextHandler', ['PD']),
      dataIndex: 'pd',
      editRow: true,
      width: 120,
      editComponent: 'CustomUserSelect',
      editComponentProps: {
        allowClear: true,
        showSearch: true,
      },
    },
    {
      title: t('dict.PriceInquiryColumn.productDesc'),
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
    // factory: true,
    // pd: true,
    productDesc: true,
  },
};
