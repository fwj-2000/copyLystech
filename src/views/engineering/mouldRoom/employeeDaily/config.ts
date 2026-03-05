import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();
// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'pickerVal',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        submitOnPressEnter: true,
        placehoder: [''],
      },
    },
    {
      fieldName: 'processName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请选择工序名称',
      },
      i18nField: t('CommonCol.processName'),
    },
    {
      fieldName: 'partNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零件编号',
      },
      i18nField: t('CommonCol.partNo'),
    },
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模具编号',
      },
    },
    {
      fieldName: 'factoryMoldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入厂内模号',
      },
      i18nField: t('CommonCol.factoryMoldNo'),
    },
  ];
}

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  {
    title: '零件加工计划日期',
    sortable: true,
    field: 'planDate',
    cellRender: {
      name: 'Date',
    },
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '加工工序',
    field: 'processName',
    sortable: true,
    width: 160,
  },
  {
    title: '完成情况',
    field: 'status',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'completionStatus',
      props: {
        api: () => baseStore.getDictionaryData('planProgress'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSea: true,
        searrch: {
          showchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.planProgress.0'), theme: 'gray', rowKey: '' },
        { id: 1, fullName: t('dict.planProgress.1'), theme: 'yellow', rowKey: '' },
        { id: 2, fullName: t('dict.planProgress.2'), theme: 'green', rowKey: '' },
      ],
    },
  },
  {
    title: '厂内模号',
    field: 'factoryMoldNo',
    sortable: true,
    width: 100,
  },
  {
    title: '模具编号',
    field: 'moldNo',
    sortable: true,
    width: 160,
  },
  {
    title: '版本',
    field: 'version',
    sortable: true,
    width: 60,
  },
  {
    title: '零件编号',
    field: 'partNo',
    sortable: true,
    width: 100,
  },
  {
    title: '类型',
    field: 'category',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '加工数量',
    field: 'quantity',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 110,
  },
  {
    title: '完成数量(K)',
    field: 'completedQuantity',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '预估工时',
    field: 'presetDuration',
    width: 80,
  },
  {
    title: '实际工时',
    field: 'actualDuration',
    width: 80,
  },
  {
    title: '加工者',
    field: 'processor',
    minWidth: 160,
  },
];

export function getExportColumn() {
  return cloneDeep(column);
}
