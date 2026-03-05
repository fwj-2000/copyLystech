import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { useBaseStore } from '/@/store/modules/base';
import { getdutypersonlist } from '/@/api/qms/personnelArrangementOptimiz';
import { thousandsFormat } from '/@/utils/lydc';
const baseStore = useBaseStore();
// 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('common.enableText') },
  { id: 0, fullName: t('common.disableText') },
];

export const columns = [
  // { field: 'checkbox', minWidth: 50, type: 'checkbox' },

  { field: 'expand', type: 'expand', width: 60, align: 'center', slots: { content: 'expandContent' } },
  {
    title: t('dict.CommonCol.seq'),
    field: 'seq',
    type: 'seq',
    minWidth: 50,
  },

  {
    title: '生产日期',
    field: 'scheduleData',
    minWidth: 120,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    // editRender: {
    //   name: 'Input',
    // },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '班别',
    field: 'classesName',
    minWidth: 60,
    sortable: true,
    // editRender: {
    //   name: 'ApiSelect',
    //   props: {
    //     placeholder: '班别',
    //     api: () => baseStore.getDictionaryData('className'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     filterOption: true,
    //   },
    // },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ApiSelect',
    //   searchField: 'classes',
    //   props: {
    //     api: () => baseStore.getDictionaryData('className'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     showSearch: true,
    //     apiSearch: {
    //       show: true,
    //       searchName: '',
    //     },
    //     filterOption: false,
    //     notFoundContent: null,
    //   },
    // },
  },
  {
    title: '机台号',
    field: 'machineNo',
    width: 90,
    sortable: true,
    editRender: {
      name: 'Input',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '主机手',
    field: 'machineOperator',
    width: 160,
    formatter: 'ApiSelect',
    slots: {
      default: 'machineOperator',
    },
    // editRender: {
    //   name: 'ApiSelect',
    //   props: {
    //     api: getdutypersonlist,
    //     showSearch: true,
    //     apiSearch: {
    //       show: false,
    //       // searchName: 'keyword',
    //     },
    //     rowParams: {
    //       scheduleData: 'scheduleData',
    //       classes: 'classes',
    //       groupInfoIds: 'groupInfoIds',
    //     },
    //     resultField: 'data',
    //     labelField: 'name',
    //     valueField: 'id',
    //     immediate: true,
    //     filterOption: (value: string, option: { label: string }) => option.label.includes(value),
    //   },
    // },
    i18nField: 'machineOperatorName',
  },
  {
    title: 'SAP工单号',
    field: 'sapWorkOrderNo',
    width: 120,
    sortable: true,
    // editRender: {
    //   name: 'Input',
    // },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '日期工单号',
    field: 'workOrderNo',
    width: 120,
    sortable: true,
    // editRender: {
    //   name: 'Input',
    // },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '内部料号',
    field: 'productCode',
    width: 140,
    sortable: true,
    // editRender: {
    //   name: 'Input',
    // },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: 'PCC产能(PCS)',
    field: 'pccProductionCapacity',
    width: 150,
    sortable: true,
    editRender: {
      name: 'Input',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '调机换模时间(min)',
    field: 'setupTimeMinute',
    width: 170,
    sortable: true,
    editRender: {
      name: 'Input',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  // {
  //   title: '状态',
  //   field: 'status',
  //   width: 100,
  //   cellRender: {
  //     name: 'Tag',
  //     options: STATUS_OPTIONS,
  //   },
  //   sortable: true,
  // },
  {
    title: '工单数量',
    field: 'workOrderQuantity',
    minWidth: 120,
    sortable: true,
    editRender: {
      name: 'Input',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    formatter: ({ cellValue }) => (cellValue ? thousandsFormat(cellValue) : ''),
  },
  {
    title: '计划数量(PCS)',
    field: 'planQuantity',
    minWidth: 140,
    sortable: true,
    editRender: {
      name: 'Input',
    },
    formatter: ({ cellValue }) => (cellValue ? thousandsFormat(cellValue) : ''),
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '计划工时(H)',
    field: 'planWorkHour',
    width: 120,
    sortable: true,
  },
  {
    title: '交期',
    field: 'deliveryTime',
    width: 100,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '距上次排产间隔天数(D)',
    field: 'lastScheduleSinceDay',
    width: 170,
    sortable: true,
  },
  {
    title: '相似料件工艺代码',
    field: 'similarMaterialsProcessCode',
    width: 160,
    sortable: true,
  },
  {
    title: '是否排产 同一机台',
    field: 'isSameMachineName',
    width: 160,
    sortable: true,
  },
  {
    title: '操作',
    field: 'action',
    width: 50,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export function exitValue(value: any) {
  if (value !== undefined && value !== null && value !== '') {
    return value;
  }
  return '/';
}
