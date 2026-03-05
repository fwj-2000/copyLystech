import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { FormSchema } from '/@/components/Form';
import { getFactoryAreaList } from '/@/api/productionPlan/planProduceQuantity';

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
  // 保持序号列不变
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },

  // 修正字段映射
  {
    title: 'MRB申请单号',
    field: 'mrbApplyNo', // ✓ 正确映射
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '关联单号',
    field: 'relationNo', // ❗需确认数据中是否存在该字段
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '厂区',
    field: 'factoryName', // ✓ 改为显示名称字段
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '状态',
    field: 'status', // ✓ 显示状态名称
    cellRender: {
      name: 'Tag',
      options: mrbApplyStatusOptions,
    },
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: { options: mrbApplyStatusOptions },
    },
  },
  {
    title: '不良品类型',
    field: 'badProductTypeName', // ✓ 正确映射
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'badProductType',
      name: 'ASelect',
      props: { options: badProductTypeOptions },
    },
  },
  {
    title: '提交时间',
    field: 'applyTime', // ✓ 修正为实际时间戳字段
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },

  // 评审相关字段
  {
    title: '评审结论',
    field: 'reviewResult', // ✓ 显示最终评审结果
    i18nField: 'reviewResultName',
    cellRender: {
      name: 'Tag',
      options: executionResultOptions,
    },
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: { options: executionResultOptions },
    },
  },
  {
    title: '评审总耗时',
    field: 'reviewTakeTime', // ✓ 修正耗时字段
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },

  // SQE相关字段
  {
    title: 'SQE',
    field: 'sqeUserName', // ✓ 显示处理人
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: 'SQE评审状态',
    field: 'sqeReviewStatus', // ✓ 显示评审结果
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    className: ({ row }) => {
      return row.sqeReviewStatus === 1 ? 'text-[green]' : 'text-[red]';
    },
    formatter: ({ cellValue }) => {
      return cellValue === 1 ? '已评' : '未评';
    },
  },
  {
    title: 'SQE评审耗时',
    field: 'sqeReviewTakeTime', // ✓ 修正耗时字段
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },

  // 工程（PD）相关字段
  {
    title: '工程',
    field: 'pdUserName', // ✓ 显示处理人
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '工程评审状态',
    field: 'pdReviewStatus', // ✓ 显示评审结果
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    className: ({ row }) => {
      return row.sqeReviewStatus === 1 ? 'text-[green]' : 'text-[red]';
    },
    formatter: ({ cellValue }) => {
      return cellValue === 1 ? '已评' : '未评';
    },
  },
  {
    title: '工程评审耗时',
    field: 'pdReviewTakeTime', // ✓ 修正耗时字段
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },

  // 采购相关字段
  {
    title: '采购',
    field: 'purchaseUserName', // ✓ 显示处理人
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '采购评审状态',
    field: 'purchaseReviewStatus', // ✓ 显示评审结果
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    className: ({ row }) => {
      return row.sqeReviewStatus === 1 ? 'text-[green]' : 'text-[red]';
    },
    formatter: ({ cellValue }) => {
      return cellValue === 1 ? '已评' : '未评';
    },
  },
  {
    title: '采购评审耗时',
    field: 'purchaseReviewTakeTime', // ✓ 修正耗时字段
    minWidth: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },

  // 操作列保持不变
  {
    title: t('common.action'),
    width: '180',
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
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
    label: '状态',
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
    field: 'factory',
    label: '',
    i18nField: 'factoryName',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryAreaList,
      placeholder: '请选择厂区',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'searchKey',
      },
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      useChangeCopy: true,
      labelField: 'name',
      valueField: 'code',
    },
  },
  {
    field: 'startTime',
    i18nField: 'CommonCol.startTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择开始时间',
      allowClear: true,
    },
  },
  {
    field: 'endTime',
    i18nField: 'CommonCol.endTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择结束时间',
      allowClear: true,
    },
  },
  {
    field: 'reviewUserId', // 审批人
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '评审人',
      allowClear: true,
    },
  },
];
