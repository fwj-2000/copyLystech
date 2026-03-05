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
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '厂区',
    field: 'factoryName',
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '供应商名称',
    field: 'supplierName',
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
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
    title: '产品料号',
    field: 'insidePartNumber',
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: 'SQE',
    // title: 'SQE DRI',
    field: 'sqeUserName',
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '审核结果',
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

  // 评审相关字段
  // {
  //   title: '审核结果',
  //   field: 'reviewResultStatus', // ✓ 显示最终评审结果
  //   cellRender: {
  //     name: 'Tag',
  //     options: executionResultOptions,
  //   },
  //   width: 120,
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'ASelect',
  //     props: { options: executionResultOptions },
  //   },
  // },
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
    title: '不良品描述',
    field: 'badDescription', // ✓ 正确映射
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'factory',
    label: '',
    i18nField: 'CommonCol.factory',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryAreaList,
      placeholder: '厂区',
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
    field: 'badProductType', // 不良品类型
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '不良品类型',
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
    field: 'supplierName',
    label: '',
    i18nField: 'CommonCol.supplierName',
    component: 'Input',
    componentProps: {
      placeholder: '请输入供应商',
      allowClear: true,
    },
  },
  {
    field: 'dateVal',
    label: '',
    component: 'DateRange',
    componentProps: {
      placeholder: '请选择开始时间',
      allowClear: true,
    },
  },
];
