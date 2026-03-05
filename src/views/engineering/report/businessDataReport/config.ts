import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { COLUMN_TYPE_ENUM } from './utils';
const baseStore = useBaseStore();
const { t } = useI18n();

export const Schema = [
  {
    field: 'flow',
    label: t('dict.bisFlow'),
    component: 'ApiSelect',
    defaultValue: '1',
    componentProps: {
      api: () => baseStore.getDictionaryData('bisFlow'),
      showSearch: true,
      apiSearch: {
        show: false,
        // searchName: 'equipmentCode',
      },
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      immediate: true,
      placeholder: t('dict.bisFlow'),
    },
    width: '150px',
  },
];

export const chartOptions = {
  grid: {
    left: '10',
    right: '10',
    bottom: '35',
    top: '25',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0, // 强制显示全部标签
      // rotate: 45,
      fontSize: 12,
    },
  },
  yAxis: {
    type: 'value',
    name: 'PCS', // y轴名称
    nameLocation: 'end', // 名称位置
    nameGap: 10,
    nameTextStyle: {
      // color: "#fff",
      // fontSize: 12,
      padding: [0, 0, 0, -20], // 上、右、下、左
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params) {
      const filteredParams = params.filter(param => param.seriesIndex > 0 && param.seriesIndex < 4);
      if (filteredParams.length === 0) return '';
      let result = filteredParams[0].name + '<br/>';
      filteredParams.forEach(param => {
        // 使用ECharts内置的marker模板
        const marker =
          param.marker ||
          `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>`;
        result += `${marker} ${param.seriesName}: ${param.value}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: [],
    orient: 'horizontal',
    right: '20',
    top: '-3',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
  },
  series: [
    {
      type: 'custom',
      itemStyle: {
        color: 'rgba(200, 200, 200, 0.2)',
      },
      data: [],
    },
    {
      name: '',
      data: [],
      type: 'bar',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear', // 线性渐变
          x: 0, // 渐变起点（0：左侧，1：右侧）
          y: 0, // 渐变起点（0：顶部，1：底部）
          x2: 0, // 渐变终点
          y2: 1, // 垂直向下渐变
          colorStops: [
            {
              offset: 0,
              color: 'rgba(205.0625, 205.0625, 205.0625, 1)', // 起始颜色（0%处）
            },
            {
              offset: 1,
              color: 'rgba(238, 238, 238, 0.74)', // 结束颜色（100%处）
            },
          ],
        },
        borderRadius: [6, 6, 0, 0], // 左上+右上圆角6px，底部直角
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(103, 79, 255, 0.86)',
            },
            {
              offset: 1,
              color: 'rgba(255, 204.80909729003906, 160.4375, 0.1)',
            },
          ],
        },
        borderRadius: [6, 6, 0, 0],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 160.933349609375, 78.625, 0.86)',
            },
            {
              offset: 1,
              color: 'rgba(255, 204.80909729003906, 160.4375, 0.1)',
            },
          ],
        },
        borderRadius: [6, 6, 0, 0],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    // {
    //   name: '变化率',
    //   type: 'custom',
    //   itemStyle: {
    //     color: 'rgba(255, 123, 0, 1)',
    //   },
    // }
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 60,
      zoomLock: true,
    },
    {
      type: 'slider',
      start: 0, // 默认起始位置
      end: 60,
      zoomLock: true,
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

export const chartOptionsPCC = {
  grid: {
    left: '10',
    right: '10',
    bottom: '35',
    top: '25',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      // rotate: 45,
      fontSize: 12,
    },
  },
  yAxis: {
    type: 'value',
    name: 'PCS',
    nameLocation: 'end',
    nameGap: 10,
    nameTextStyle: {
      // color: "#fff",
      // fontSize: 12,
      padding: [0, 0, 0, -20],
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params) {
      const filteredParams = params.filter(param => param.seriesIndex > 0 && param.seriesIndex < 7);
      if (filteredParams.length === 0) return '';
      let result = filteredParams[0].name + '<br/>';
      filteredParams.forEach(param => {
        const marker =
          param.marker ||
          `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>`;
        result += `${marker} ${param.seriesName}: ${param.value}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: [],
    orient: 'horizontal',
    right: '20',
    top: '-3',
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
  },
  series: [
    {
      type: 'custom',
      itemStyle: {
        color: 'rgba(200, 200, 200, 0.2)',
      },
      data: [],
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'lastTwoWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(14, 167, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(156, 227, 245, 1)',
            },
          ],
        },
        borderRadius: [8, 8, 8, 8],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'lastTwoWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(205.0625, 205.0625, 205.0625, 1)',
            },
            {
              offset: 1,
              color: 'rgba(238, 238, 238, 0.74)',
            },
          ],
        },
        borderRadius: [6, 6, 6, 6],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'lastWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(14, 167, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(156, 227, 245, 1)',
            },
          ],
        },
        borderRadius: [6, 6, 6, 6],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'lastWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(103, 79, 255, 0.86)',
            },
            {
              offset: 1,
              color: 'rgba(255, 204.80909729003906, 160.4375, 0.1)',
            },
          ],
        },
        borderRadius: [6, 6, 6, 6],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'currentWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(14, 167, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(156, 227, 245, 1)',
            },
          ],
        },
        borderRadius: [6, 6, 6, 6],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
    {
      name: '',
      data: [],
      type: 'bar',
      stack: 'currentWeek',
      barWidth: '15px',
      barGap: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 160.933349609375, 78.625, 0.86)',
            },
            {
              offset: 1,
              color: 'rgba(255, 204.80909729003906, 160.4375, 0.1)',
            },
          ],
        },
        borderRadius: [6, 6, 6, 6],
      },
      label: {
        show: false,
        position: 'top',
      },
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 60,
      zoomLock: true,
    },
    {
      type: 'slider',
      start: 0, // 默认起始位置
      end: 60,
      zoomLock: true,
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

export const columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    align: 'center',
    width: '50',
    fixed: 'left',
  },
  {
    field: 'factory',
    title: t('dict.CommonCol.factoryAreaName'),
    align: 'center',
    width: '150',
    fixed: 'left',
  },
  {
    field: 'list',
    title: t('dict.CommonCol.errorMsg'),
    align: 'center',
    columnType: COLUMN_TYPE_ENUM.Dim_KEYS_VALUES,
    getChilrenTitle: ({ key }) => (typeof key === 'string' ? key.slice(-4) : key),
    getChildrenConfig: () => ({ align: 'center', headerAlign: 'center', width: '70' }),
  },
];
