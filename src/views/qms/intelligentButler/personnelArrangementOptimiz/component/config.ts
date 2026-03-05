import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { thousandsFormat } from '/@/utils/lydc';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const baseStore = useBaseStore();
const { t } = useI18n();
// 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('common.enableText') },
  { id: 0, fullName: t('common.disableText') },
];

export const schemas: FormSchema[] = [
  {
    field: 'factoryArea',
    label: '',
    i18nField: 'factoryAreaName',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      defaultFirstOption: true,
      allowClear: false,
    },
  },
  {
    field: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '日期工单号', maxlength: 50 },
  },
  {
    field: 'productCode',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '内部料号', maxlength: 50 },
  },
  {
    field: 'machineNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '机台号', maxlength: 50 },
  },
  {
    field: 'classes',
    label: '',
    i18nField: 'classesName',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择班次',
      api: () => {
        return baseStore.getDictionaryData('ClassesName');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
];

export const columnsVxe = [
  { type: 'checkbox', field: 'checkbox', width: 40 },
  {
    title: '主机手',
    field: 'machineOperatorName',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '生产日期',
    field: 'scheduleData',
    width: 160,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    i18nField: 'CommonCol.produceDate',
  },
  {
    title: '班次',
    field: 'classesName',
    minWidth: 110,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'classes',
      props: {
        api: () => baseStore.getDictionaryData('className'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
  },
  {
    title: '机台号',
    field: 'machineNo',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: 'SAP工单号',
    field: 'sapWorkOrderNo',
    width: 130,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    width: 130,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '内部料号',
    field: 'productCode',
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: 'PCC产能(PCS)',
    field: 'pccProductionCapacity',
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '调机换模时间(min)',
    field: 'setupTimeMinute',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工单数量(PCS)',
    field: 'workOrderQuantity',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    formatter: ({ cellValue }) => (cellValue ? thousandsFormat(cellValue) : ''),
  },
  {
    title: '计划数量(PCS)',
    field: 'planQuantity',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    formatter: ({ cellValue }) => (cellValue ? thousandsFormat(cellValue) : ''),
  },
  {
    title: '计划工时(H)',
    field: 'planWorkHour',
    width: 130,
    sortable: true,
  },
  {
    title: '交期',
    field: 'deliveryTime',
    width: 110,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },

  {
    title: '操作',
    field: 'action',
    width: 50,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const importColumns = [
  {
    title: '行号',
    dataIndex: 'number',
    width: 120,
    i18nField: 'CommonCol.lineNumber',
  },
  // 生产日期
  {
    title: t('dict.CommonCol.produceDate'),
    dataIndex: 'scheduleData',
    format: 'date|YYYY-MM-DD',
    width: 120,
    // i18nField: 'CommonCol.produceDate'
  },
  {
    title: '班次',
    dataIndex: 'classesName',
    width: 110,
  },
  {
    title: '机台号',
    dataIndex: 'machineNo',
    width: 120,
  },
  {
    // SAP工单号
    title: t('dict.OptimalScheduleColumn.sapWorkOrderNo'),
    dataIndex: 'sapWorkOrderNo',
    width: 130,
  },
  {
    title: '日期工单号',
    dataIndex: 'workOrderNo',
    width: 130,
  },
  {
    title: '内部料号',
    dataIndex: 'productCode',
    width: 150,
  },
  {
    // PCC产能(PCS)
    title: t('dict.CommonCol.PCCCapacity'),
    dataIndex: 'pccProductionCapacity',
    width: 150,
  },
  {
    // 调机换模时间(min)
    title: t('dict.CommonCol.moldChangeTime'),
    dataIndex: 'setupTimeMinute',
    width: 160,
  },
  {
    title: '工单数量(PCS)',
    dataIndex: 'workOrderQuantity',
    width: 120,
  },
  {
    title: '计划数量(PCS)',
    dataIndex: 'planQuantity',
    width: 130,
  },
  {
    // 计划工时(H)
    title: t('dict.CommonCol.plannedWorkingHours'),
    dataIndex: 'planWorkHour',
    width: 130,
  },
  {
    title: '交期',
    dataIndex: 'deliveryTime',
    format: 'date|YYYY-MM-DD',
    width: 130,
  },
];
