import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { FormSchema } from '/@/components/Form';

// export const STATUS_OPTIONS = [
//   { id: 0, fullName: t('common.draft'), theme: 'gray' }, //草稿
//   { id: 1, fullName: t('common.doing'), theme: 'blue' }, //在办
//   { id: 2, fullName: t('common.stopText'), theme: 'red' }, //终止
//   { id: 3, fullName: t('common.rejectText'), theme: 'yellow' }, //驳回
//   { id: 4, fullName: t('common.revoke'), theme: 'purple' }, //撤回
//   { id: 5, fullName: t('common.endding'), theme: 'green' }, //结案
//   { id: 6, fullName: t('common.todoText'), theme: 'gray' }, //待处理
//   { id: 7, fullName: t('common.doneText'), theme: 'green' }, //已处理
//   { id: 8, fullName: t('common.delText'), theme: 'gray' }, //删除
//   { id: 9, fullName: t('common.submitTodo'), theme: 'gray' }, //待提交
//   { id: 10, fullName: t('common.submitted'), theme: 'green' }, //已提交
//   { id: 11, fullName: t('common.agree'), theme: 'green' }, //同意
//   { id: 12, fullName: t('common.disagree'), theme: 'yellow' }, //不同意
//   { id: 13, fullName: t('status.applyStatus.waiting'), theme: 'blue' }, //待回复
//   { id: 16, fullName: t('common.toConfirm'), theme: 'gray' }, //待确认
// ];

const closeStatusThemeMap = {
  0: 'gray',
  1: 'green',
  2: 'red',
};
const mrbApplyThemeMap = {
  0: 'gray',
  1: 'blue',
  2: 'yellow',
  3: 'green',
  4: 'red',
};

const executionResultThemeMap = {
  0: 'green',
  1: 'blue',
  2: 'yellow',
  3: 'red',
  4: 'purple',
  5: 'red',
  6: 'gray',
  7: 'red',
};

const { t } = useI18n();
const baseStore = useBaseStore();

export const mrbApplyStatusOptions = formatDictOptionsFn({
  dictList: await baseStore.getDictionaryData('mrbApplyStatus'),
  themeMap: mrbApplyThemeMap,
});
export const executionResultOptions = formatDictOptionsFn({
  dictList: await baseStore.getDictionaryData('executionResult'),
  themeMap: executionResultThemeMap,
});
export const closeStatusOptions = formatDictOptionsFn({
  dictList: await baseStore.getDictionaryData('closeStatus'),
  themeMap: closeStatusThemeMap,
});
export const badProductTypeOptions = formatDictOptionsFn({
  dictList: await baseStore.getDictionaryData('badProductType'),
  themeMap: executionResultThemeMap,
});

// () => baseStore.getDictionaryData('badProductType')

// export const executionNoteOptions = formatDictOptionsFn((await baseStore.getDictionaryData('executionNoteOptions')) as any[]);
// export const executionResultOptions = formatDictOptionsFn((await baseStore.getDictionaryData('executionResult')) as any[]);
// export const closeStatusOptions = formatDictOptionsFn((await baseStore.getDictionaryData('closeStatus')) as any[]);

function formatDictOptionsFn({ dictList, key = 'statusDesc', themeMap }) {
  return dictList.map(item => {
    const theme = mrbApplyThemeMap[Number(item.enCode)];
    return {
      ...item,
      _id: item.id,
      id: item.enCode,
      theme: theme || 'gray',
      rowKey: key,
    };
  });
}

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.PartNumberApplyStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
];

export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '40',
    align: 'center',
    // fixed: 'left',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
    // fixed: 'left',
  },
  {
    title: 'MRB申请单号',
    field: 'mrbApplyNo', // 对应接口中的 mrbApplyNo
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    minWidth: 160,
    sortable: true,
    // fixed: 'left',
  },
  {
    title: '关联单号',
    field: 'relationNo', // 对应接口中的 relationNo
    minWidth: 160,
    sortable: true,

    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '不良品类型',
    field: 'badProductTypeName', // 对应接口中的 badProductType
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'badProductType',
      name: 'ASelect',
      props: {
        options: badProductTypeOptions,
      },
    },
  },
  {
    title: '状态',
    field: 'status', // 对应接口中的 status
    cellRender: {
      name: 'Tag',
      options: mrbApplyStatusOptions,
    },
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'ASelect',
      props: {
        options: mrbApplyStatusOptions,
      },
    },
    width: 120,
    sortable: true,
  },
  {
    title: '提交时间',
    field: 'applyTime', // 对应接口中的 applyTime
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '审批结束时间',
    field: 'reviewEndTime', // 对应接口中的 applyTime
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '评审结论',
    field: 'reviewResult', // 对应接口中的 status
    i18nField: 'reviewResultName',
    cellRender: {
      name: 'Tag',
      options: executionResultOptions,
    },
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'ASelect',
      props: {
        options: executionResultOptions,
      },
    },
    width: 120,
    sortable: true,
  },
  {
    title: 'PO单号',
    field: 'poNo', // 对应接口中的 lotNo
    minWidth: 220,
    sortable: true,
  },
  {
    title: '产品料号',
    field: 'insidePartNumber', // 对应接口中的 insidePartNumber
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // {
  //   title: '内部料号描述',
  //   field: '', // 对应接口中的 supplierMaterialBatchNo
  //   minWidth: 220,
  //   sortable: true,
  // },
  {
    title: '数量',
    field: 'quantity', // 对应接口中的 quantity
    minWidth: 120,
    sortable: true,

    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '计量单位',
    field: 'unit', // 对应接口中的 unit
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '不良数量',
    field: 'badQuantity', // 对应接口中的 badQuantity
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // {
  //   title: '外部料号描述',
  //   field: 'specification', // 对应接口中的 specification
  //   minWidth: 220,
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  // },
  {
    title: '材料类型',
    field: 'materialType', // 对应接口中的 specification
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '供应商',
    field: 'supplierName', // 对应接口中的 supplierMaterialBatchNo
    minWidth: 220,
    sortable: true,
  },
  {
    title: '抽检数',
    field: 'checkQuantity', // 对应接口中的 checkQuantity
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '申请人',
    field: 'creatorUserName', // 对应接口中的 applyUserId
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注',
    field: 'remark', // 对应接口中的 checkQuantity
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // {
  //   title: 'SMR单据号',
  //   field: 'checkQuantity', // 对应接口中的 checkQuantity
  //   minWidth: 160,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  // },

  // {
  //   title: 'SMR单据进度',
  //   field: 'checkQuantity', // 对应接口中的 checkQuantity
  //   minWidth: 160,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  // },
  {
    title: t('common.action'),
    width: '180',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'mrbApplyNo', // MRB申请单号
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入MRB申请单号',
      allowClear: true,
    },
  },
  {
    field: 'creatorUserId', // 申请人
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '申请人',
      allowClear: true,
    },
  },
  {
    field: 'badProductType', // 不良品类型
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入不良品类型',
      allowClear: true,
      api: () => baseStore.getDictionaryData('badProductType'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    field: 'insidePartNumber', // 产品料号
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品料号',
      allowClear: true,
    },
  },
  {
    field: 'startTime', // 申请时间
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择开始时间',
      allowClear: true,
    },
  },
  {
    field: 'endTime', // 结束时间
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择结束时间',
      allowClear: true,
    },
  },
];
