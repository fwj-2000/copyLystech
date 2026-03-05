import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

const { t } = useI18n();
export const columns = [
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  // 序号
  { field: 'seq', title: t('dict.CommonCol.seq'), type: 'seq', minWidth: 50 },
  // 工单号
  {
    title: t('dict.CommonCol.OrderNo'),
    field: 'workOrderNo',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'workOrderNo',
    },
  },
  // 内部料号
  {
    title: t('dict.CommonCol.innerMaterialCode'),
    field: 'innerMaterialNumber',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'innerMaterialNumber',
    },
  },
  // 生产日期
  {
    title: t('dict.CommonCol.materialProductionDate'),
    field: 'fBizDate',
    minWidth: 100,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'fBizDate',
    },
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  // 厂区物理位置
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.factoryAddress'),
    field: 'factoryAddress',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'factoryAddress',
    },
  },
  // 班别
  {
    title: t('dict.CloudMeasure.className'),
    field: 'classesDes',
    width: 100,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'classesDes',
    },
  },
  // 机台号
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.machineNo'),
    field: 'machineNo',
    width: 100,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'machineNo',
    },
  },
  // 状态
  {
    title: t('dict.MoldReceiveRefundColumn.status'),
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
          { fullName: t('dict.SMAHandleStatus.Handled'), enCode: 70 },
          { fullName: t('dict.SMAHandleStatus.Handling'), enCode: 10 },
        ],
      },
    },
    slots: { default: 'Status' },
    width: 140,
  },
  // 时效
  {
    title: '处理时效',
    field: 'processingDuration',
    width: 200,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      // searchField: 'introducerUserName',
      name: 'Input',
    },
  },

  // 处理人
  {
    title: t('dict.AbnormalTimelinessMonitoringColumn.introducerUserId'),
    field: 'introducerUserName',
    width: 200,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'introducerUserName',
      name: 'Input',
    },
  },
  // 处理时间
  {
    title: t('dict.CommonCol.handleTime'),
    field: 'processingTime',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      //searchField: 'processingTime',
    },
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  // 上报时间
  {
    title: '上报时间',
    field: 'reportTime',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      // searchField: 'introducerUserName',
      name: 'Input',
    },
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
];

export function getExportColumn() {
  return cloneDeep(columns).toSpliced(0, 1);
}

export const stackChartOptions: echarts.EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: [t('dict.ExceptionStatus.2'), t('dict.ExceptionStatus.5')],
    orient: 'horizontal',
    left: 'center',
    bottom: '-6',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
  },
  grid: {
    left: '12',
    right: '24',
    bottom: '24',
    top: '24',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    minInterval: 1,
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

export const lineChartOptions: echarts.EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: function (params) {
      let result = '';
      params.forEach(function (item) {
        result += item.marker + ` ${t('dict.OperationRateColumn.operationDate')}：` + item.name + '<br/>';
        result += item.marker + ` ${t('dict.ClosureRate')}：` + item.value + '%<br/>';
      });
      return result;
    },
  },
  legend: {
    data: [t('dict.ClosureRate')],
    orient: 'horizontal',
    left: 'center',
    bottom: '-6',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
  },
  grid: {
    left: '30',
    right: '24',
    bottom: '24',
    top: '24',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    max: 100,
    interval: 20,
    axisLabel: {
      formatter: '{value}%',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
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

export const pieChartOptions: echarts.EChartsOption = {
  // tooltip: {
  //   trigger: 'axis',
  //   axisPointer: {
  //     type: 'cross',
  //   },
  //   formatter: function (params) {
  //     let result = '';
  //     params.forEach(function (item) {
  //       result += item.marker + ` ${t('dict.OperationRateColumn.operationDate')}：` + item.name + '<br/>';
  //       result += item.marker + ` ${t('dict.ClosureRate')}：` + item.value + '%<br/>';
  //     });
  //     return result;
  //   },
  // },
  legend: {
    data: ['测量中', '编程中', '故障中', '停机中', '已完成'],
    orient: 'horizontal',
    left: 'center',
    bottom: '0',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
  },
  grid: {
    left: '3%', // 改用百分比
    right: '4%',
    top: '10%',
    bottom: '20%',
    containLabel: true,
  },
  // yAxis: {
  //   type: 'value',
  //   max: 100,
  //   interval: 20,
  //   axisLabel: {
  //     formatter: '{value}%',
  //   },
  //   splitLine: {
  //     lineStyle: {
  //       type: 'dashed',
  //     },
  //   },
  // },
  // dataZoom: [
  //   {
  //     type: 'inside',
  //   },
  //   {
  //     type: 'slider',
  //     dataBackground: {
  //       areaStyle: {
  //         color: 'rgba(0,0,0,0.03)',
  //       },
  //     },
  //     // 底部缩放配置
  //     selectedDataBackground: {
  //       areaStyle: {
  //         color: 'rgba(0,0,0,0.1)',
  //       },
  //       lineStyle: {
  //         color: 'rgba(0,0,0,0.1)',
  //       },
  //     },
  //     borderColor: '#FFF',
  //     fillerColor: 'rgba(33,33,33, 0.01)',
  //     moveHandleStyle: {
  //       opacity: 0,
  //     },
  //     handleIcon:
  //       'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
  //     handleStyle: {
  //       borderWidth: 0,
  //     },
  //   },
  // ],
};
