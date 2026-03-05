export const chartOptions = {
  legend: {
    data: ['温度', '湿度'],
    orient: 'horizontal', // 方向，可选值有'horizontal'和'vertical'
    left: 'center', // 水平位置
    top: 'bottom', // 垂直位置
    itemWidth: 12, // 图例标记的图形宽度
    itemHeight: 1.8,
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: [
      // '04/23 8时',
      // '04/23 21时',
      // '04/24 9时',
      // '04/24 22时',
      // '04/25 10时',
      // '04/25 20时',
      // '04/26 6时',
      // '04/26 16时',
      // '04/27 6时',
      // '04/27 16时',
      // '04/27 22时',
      // '04/27 6时',
      // '04/27 16时',
      // '04/27 22时',
    ],
    axisLabel: {
      interval: 0,
      rotate: 40,
    },
  },
  yAxis: {
    type: 'value',
    interval: 100000,
    minInterval: 100
  },
  series: [
    {
      name: '温度',
      type: 'line',
      data: [],
      // data: [5, 7, 10, 12, 10, 18, 21, 22, 23, 24, 25, 26, 27, 28],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 1,
      },
      itemStyle: {
        normal: {
          borderWidth: 2,
          color: '#46B5FF', // 控制圆点颜色
        },
      },
      markLine: {
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          color: '#46B5FF',
        },
        data: [
          { name: '温度下限', yAxis: 4, symbol: 'none', label: { position: 'start', fontSize: 12, formatter: '温度下限4' } }, // 下限标线
          { name: '温度上限', yAxis: 18, symbol: 'none', label: { position: 'start', fontSize: 12, formatter: '温度上限18' } }, // 上限标线
        ],
      },
    },
    {
      name: '湿度',
      type: 'line',
      data: [],
      // data: [8, 10, 16, 13, 15, 20, 22, 23, 24, 25, 26, 27, 28, 29],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: '#4373E3', // 这里设置折线的颜色
        width: 1,
      },
      itemStyle: {
        normal: {
          borderWidth: 2,
          color: '#4373E3', // 控制圆点颜色
        },
      },
      markLine: {
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          color: '#4373E3',
        },
        data: [
          { name: '湿度下限', yAxis: 6, symbol: 'none', label: { position: 'end', fontSize: 14, formatter: '湿度下限6' } }, // 下限标线
          { name: '湿度上限', yAxis: 15, symbol: 'none', label: { position: 'end', fontSize: 14, formatter: '湿度上限15' } }, // 上限标线
        ],
      },
    },
  ],
  // 超出标记线需要标记红色
  visualMap: [
    // 温度
    {
      top: 10,
      right: 10,
      show: false,
      precision: 1,
      seriesIndex: 0,
      pieces: [
        {
          gt: 4, // 设置最小值
          lte: 18, // 设置最大值
          color: '#46B5FF',
        },
      ],
      outOfRange: {
        color: '#46B5FF', // 设置超出部分的颜色
      },
    },
    // 湿度
    {
      top: 10,
      right: 10,
      show: false,
      precision: 1,
      seriesIndex: 1,
      pieces: [
        {
          gt: 7, // 设置最小值
          lte: 15, // 设置最大值
          color: '#4373E3',
        },
      ],
      outOfRange: {
        color: '#4373E3', // 设置超出部分的颜色
      },
    },
  ],
  grid: {
    x: '5.5%',
    y: '10%',
    containLabel: true,
  },
  dataZoom: [
    {
      type: 'slider',
      selectedDataBackground: {
        areaStyle: {
          color: 'rgba(204, 204, 204, 1)',
        },
        lineStyle: {
          color: 'rgba(204, 204, 204, 1)',
        },
      },
      borderColor: '#FFF',
      fillerColor: 'rgba(204, 204, 204, 0.1)',
      moveHandleStyle: {
        opacity: 0,
      },
      handleSize:'150%',
      handleIcon:
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
      handleStyle: {
        borderWidth: 5,
      },
      height: '20px',
      bottom: '15%',
    },
  ],
};
