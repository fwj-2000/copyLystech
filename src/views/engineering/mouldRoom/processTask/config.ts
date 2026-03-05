import { useI18n } from '/@/hooks/web/useI18n';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export const formSchema = [
  {
    fieldName: 'processName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '工序名称',
    },
  },
  {
    fieldName: 'status',
    i18nField: 'statusName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('planProgress'),
      placeholder: '工序状态',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
  },
  {
    fieldName: 'partNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '零件编号',
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
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    defaultValue: [],
  },
];

export const column = [
  {
    title: '工序状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.planProgress.0'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.planProgress.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.planProgress.2'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'statusName',
  },
  {
    title: '执行工序',
    field: 'processName',
    i18nField: 'CommonCol.executeProcess',
    width: 120,
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '厂内模号',
    field: 'factoryMoldNo',
    width: 120,
  },
  {
    title: '模具编号',
    field: 'moldNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '版本',
    field: 'version',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '零件编号',
    field: 'partNo',
    width: 120,
  },
  {
    title: '零件名称',
    field: 'partName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '工艺路线',
    field: 'routeMap',
    slots: { default: 'routeMap' },
    visible: true,
    showOverflow: false,
    resizable: true,
    width: 646,
  },
  {
    title: '零件数量',
    field: 'quantity',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '计划开工日期',
    field: 'planStartTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },
    width: 120,
  },
  {
    title: '实际完工时间',
    field: 'planEndTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },
    width: 120,
  },
  {
    title: '待完工数量',
    field: 'unFinishedQty',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '已完成数量',
    field: 'finishedQty',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  // {
  //   title: '返工数量',
  //   field: 'backQty',
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  //   width: 120,
  // },
  {
    title: '操作员',
    field: 'operatorUserName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'operatorUserId',
    },
  },
  {
    title: '操作时间',
    field: 'operateTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
];
