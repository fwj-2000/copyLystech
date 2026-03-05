import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns = [
  { field: 'radio', width: 50, type: 'radio' },
  // 序号
  // { field: 'seq', title: t('dict.CommonCol.seq'), type: 'seq', width: 50 },
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
  // 厂区物理位置
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.factoryAddress'),
    field: 'factoryAddress',
    minWidth: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 班别
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.classes'),
    field: 'className',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 组别
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.group'),
    field: 'groupName',
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 工单号
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.workOrderNo'),
    field: 'workOrderNo',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'workOrderNo',
    },
  },
  // 内部料号
  {
    title: t('views.productionPlan.insidePartNumber'),
    field: 'innerMaterialCode',
    minWidth: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 姓名
  {
    title: t('dict.CommonCol.fullName'),
    field: 'userName',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // 技能等级
  {
    title: t('dict.SkillLevelColumn.SkillLevel'),
    field: 'skillLevel',
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  //是否有客诉
  {
    title: t('dict.TargetRateConfigColumn.isCustomerComplain'),
    field: 'isCustomerComplain',
    minWidth: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
];

export const lineChartOptions: echarts.EChartsOption = {
  grid: {
    left: '30',
    right: '24',
    bottom: '24',
    top: '24',
    containLabel: true,
  },

  dataZoom: [
    {
      type: 'inside',
    },
    {
      type: 'slider',
      dataBackground: {
        areaStyle: {
          color: 'rgba(0,0,0,0.03)',
        },
      },
      // 底部缩放配置
      selectedDataBackground: {
        areaStyle: {
          color: 'rgba(0,0,0,0.1)',
        },
        lineStyle: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      borderColor: '#FFF',
      fillerColor: 'rgba(33,33,33, 0.01)',
      moveHandleStyle: {
        opacity: 0,
      },
      handleIcon:
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
      handleStyle: {
        borderWidth: 0,
      },
    },
  ],
};

export const CLASSES_OPTIONS = [
  { id: '1', fullName: t('common.dayShift') },
  { id: '2', fullName: t('dict.NightShift') },
];
