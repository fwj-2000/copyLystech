import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { getlistbyfactory } from '/@/api/engineering/mould';

const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        allowClear: false,
      },
      defaultValue: [dayjs(), dayjs().add(2, 'month')],
    },
    {
      field: 'processS',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getlistbyfactory,
        showSearch: true,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        filterOption: (value: string, option: { label: string }) => option.label.includes(value),
        notFoundContent: null,
        placeholder: '工序名称',
        mode: 'multiple',
      },
      i18nField: 'processName',
    },
  ];
}

// 主页表格column配置
export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50, fixed: 'left' },
  {
    title: '工序名称',
    field: 'processName',
    width: 180,
    fixed: 'left',
  },
  {
    title: '标准产能',
    field: 'normCapacity',
    editRender: {
      name: 'InputNumber',
    },
    fixed: 'left',
    width: 150,
  },
  {
    title: '总负荷',
    field: 'totalLoad',
    width: 160,
    fixed: 'left',
  },
];

export const processColumn = [
  {
    title: '工单号',
    field: 'workOrderNo',
  },
  {
    title: '当前工序',
    field: 'processName',
  },
  {
    title: '上一个工序',
    field: 'lastProcessName',
  },
  {
    title: '模具编号',
    field: 'moldNo',
  },
  {
    title: '零件编号',
    field: 'partNo',
  },
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
  },
  {
    title: '数量',
    field: 'quantity',
  },
  {
    title: '预估工时',
    field: 'presetDuration',
  },
  {
    title: '计划开工时间',
    field: 'planStartTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '计划完工时间',
    field: 'planEndTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];
