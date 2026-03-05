import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns = [
  // 日期
  {
    title: t('dict.PriceInquiryColumn.creatorTime'),
    field: 'entDate',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  // 班别
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.classes'),
    field: 'classesName',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 机台
  {
    title: '机台',
    field: 'machineNumber',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 状态
  {
    title: '状态',
    field: 'status',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '运行', enCode: 1 },
          { fullName: '调机', enCode: 2 },
        ],
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: '运行', theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: '调机', theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'statusName',
    width: 120,
  },
  // 开始时间
  {
    title: '开始时间',
    field: 'startTime',
    minWidth: 120,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 结束时间
  {
    title: '结束时间',
    field: 'endTime',
    minWidth: 120,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 用时
  {
    title: '用时',
    field: 'duration',
    minWidth: 120,
    sortable: true,
  },
];

export const CLASSES_OPTIONS = [
  { id: '1', fullName: t('common.dayShift') },
  { id: '2', fullName: t('dict.NightShift') },
];
