import * as echarts from 'echarts';

// 折线图
export const todayActivationOptions = ({ xAxisData, yAxisData }: { xAxisData: string[]; yAxisData: number[] }) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          width: 1,
          color: '#ff7b00',
        },
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: '#fff',
        fontSize: 12,
      },
    },
    yAxis: [
      {
        type: 'value',
        // max: 200,
        axisLabel: { formatter: '{value} %', color: '#fff', fontSize: 12 },
        splitNumber: 5,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(102, 255, 255, 0.23)',
            width: 1,
          },
        },
      },
    ],

    grid: {
      left: '3%', // 改用百分比
      right: '4%',
      top: '10%',
      bottom: '10%',
      containLabel: true,
    },
    series: [
      {
        data: yAxisData,
        type: 'line',
        showSymbol: true,
        connectNulls: true, // 空数据连接点
        symbolSize: 18,
        symbolOffset: [0, -2],
        lineStyle: {
          width: 8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#0d65fe', // 0% 处的颜色
              },
              {
                offset: 0.1,
                color: '#00F2EF', // 0% 处的颜色
              },
              {
                offset: 0.3,
                color: '#00F2EF', // 0% 处的颜色
              },
              {
                offset: 0.6,
                color: '#00F2EF', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#0d65fe', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        smooth: true, // 圆弧转角

        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: 'rgba(64,158,255,0.3)',
        //     },
        //     {
        //       offset: 1,
        //       color: 'rgba(64,158,255,0.1)',
        //     },
        //   ]),
        // },

        // animationEasing: function (k) {
        //   if (k === 0) {
        //     return 0;
        //   }
        //   if (k === 1) {
        //     return 1;
        //   }
        //   if ((k *= 2) < 1) {
        //     return 0.5 * Math.pow(1024, k - 1);
        //   }
        //   return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        // },
        // animationDuration: 1000,
      },
    ],
  };
};

// 柱状图
export const timeActivationOptions = (
  dom: HTMLElement,
  { xAxisData, yAxisData }: { xAxisData: string[]; yAxisData: number[] },
  { onClick }: { onClick: (params: any) => void },
) => {
  const chartInstance = echarts.init(dom);
  // 通用数据格式化函数（所有系列共享）
  const formattedData = yAxisData.map(value => ({
    value,
    // 初始样式
    // itemStyle: {
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     { offset: 1, color: '#0058FF' },
    //     { offset: 0.5, color: '#00AAFF' },
    //   ]),
    // },
  }));

  const options = {
    grid: {
      left: '5%', // 改用百分比
      right: '5%',
      top: '10%',
      bottom: '12%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'slider', // 滑动条型数据区域缩放组件
        show: xAxisData.length >= 30 ? true : false, // 数据量大于20时显示
        xAxisIndex: [0],
        bottom: 0,
        height: 20,
        borderColor: 'rgba(255,255,255,0.2)',
        textStyle: {
          color: '#fff',
        },
        backgroundColor: 'rgba(47,69,84,0.3)',
        fillerColor: 'rgba(167,183,204,0.3)',
        handleStyle: {
          color: '#00AAFF',
        },
        // 当数据量大时，设置初始展示区域
        start: 0,
        end: xAxisData.length <= 30 ? 100 : (30 / xAxisData.length) * 100, // 如果数据超过30个，初始只显示30个
      },
    ],
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        interval: 0, // 强制显示所有标签
        rotate: 45, // 倾斜45度
        color: '#fff',
        fontSize: 12,
      },
      lineHeight: 18, // 行高控制换行间距
      formatter: function (value) {
        // 自动换行逻辑（每8个字换行）
        let maxLength = 4;
        let str = value;
        let result = '';
        while (str.length > maxLength) {
          result += str.substring(0, maxLength) + '';
          str = str.substring(maxLength);
        }
        return result + str;
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value} %', color: '#fff', fontSize: 12 },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)',
        },
      },
    },
    series: [
      // 顶部装饰柱
      {
        type: 'pictorialBar',
        data: formattedData,
        selectedMode: 'single', // 启用单选模式
        label: {
          show: true,
          formatter: row => {
            return `${row.value} %`;
          },
          position: 'top',
          color: '#fff',
          fontSize: 12,
        },
        select: {
          // itemStyle: {
          //   color: '#ff7b00', // 高亮颜色
          // },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: '#ffaa00' },
              { offset: 0.5, color: '#ff7b00' },
            ]),
          },
        },
        symbolPosition: 'start',
        symbolSize: [24, 10],
        symbolOffset: [0, 5],
        z: 12,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 1, color: '#0058FF' },
            { offset: 0.5, color: '#00AAFF' },
          ]),
        },
      },
      // 主体柱
      {
        type: 'bar',
        data: formattedData,
        selectedMode: 'single',
        select: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(255, 145, 0, 0.8)' },
              { offset: 0.5, color: 'rgba(255, 195, 135, 0.8)' },
              { offset: 1, color: 'rgba(255, 145, 0, 0.80)' },
            ]),
          },
        },
        barWidth: '25',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(0, 102, 255, 0.80)' },
            { offset: 0.5, color: 'rgba(135, 212, 255, 0.80)' },
            { offset: 1, color: 'rgba(0, 102, 255, 0.80)' },
          ]),
        },
      },
      // 底部装饰柱
      {
        type: 'pictorialBar',
        data: formattedData,
        selectedMode: 'single',
        select: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 1, color: '#ffaa00' },
              { offset: 0.5, color: '#ff7b00' },
            ]),
          },
        },
        symbolSize: [24, 15],
        symbolPosition: 'end',
        symbolOffset: [0, '-10'],
        z: 12,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 1, color: '#0058FF' },
            { offset: 0.5, color: '#00AAFF' },
          ]),
        },
      },
    ],
  };
  chartInstance.setOption(options);
  // 点击事件处理
  let currentSelectedIndex: number | null = null;
  chartInstance.on('click', params => {
    if (params.componentType === 'series') {
      // 遍历所有系列同步操作
      [0, 1, 2].forEach(seriesIndex => {
        chartInstance.dispatchAction({
          type: currentSelectedIndex === params.dataIndex ? 'unselect' : 'select',
          seriesIndex: seriesIndex,
          dataIndex: params.dataIndex,
        });
      });
      // 更新选中状态
      currentSelectedIndex = currentSelectedIndex === params.dataIndex ? null : params.dataIndex;
    }
    onClick({ currentSelectedIndex, params });
  });

  return chartInstance;
};

// 饼图
export const devicesStatusOptions = ({ legendData, chartData }: { legendData: string[]; chartData: any[] }) => {
  return {
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b}: {c} ({d}%)',
    // },
    legend: {
      data: legendData,
      itemStyle: {
        // color: '#fff',
      },
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    series: [
      {
        // name: '',
        type: 'pie',
        radius: ['55%', '25%'],
        labelLine: {
          length: 40,
        },
        label: {
          // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          // formatter: '{b} \n{hr|}\n  {d}%  ',
          formatter: '{b}:  {d}%  ',
          color: '#19ECFF',
          fontSize: 12,
          rich: {
            //   a: {
            //     color: '#6E7079',
            //     lineHeight: 22,
            //     align: 'center',
            //   },
            // hr: {
            //   lineHeight: 20,
            //   borderColor: '#19ECFF',
            //   width: '100%',
            //   borderWidth: 1,
            //   height: 1,
            // },
            //   b: {
            //     color: '#4C5058',
            //     fontSize: 14,
            //     fontWeight: 'bold',
            //     lineHeight: 33,
            //   },
            //   per: {
            //     color: '#fff',
            //     backgroundColor: '#4C5058',
            //     padding: [3, 4],
            //     borderRadius: 4,
            //   },
          },
        },
        data: chartData,
        // [
        //   { value: 335, name: '测量中', itemStyle: { color: '#6FF' } },
        //   { value: 310, name: '编程中', itemStyle: { color: '#0D63FE' } },
        //   { value: 251, name: '故障中', itemStyle: { color: ' #FF4D4F' } },
        //   { value: 20, name: '停机中', itemStyle: { color: '#314569' } },
        // ],
      },
    ],
  };
};

// 侧面柱状图
export const devicesErrorOptions = ({ xAxisData, yAxisData }: { xAxisData: number[]; yAxisData: string[] }) => {
  const series = [
    {
      type: 'pictorialBar',
      data: yAxisData,
      label: {
        show: true,
        formatter: row => {
          return `${row.value} %`;
        },
        position: 'right',
        color: '#fff',
        fontSize: 12,
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(
          0,
          0,
          0,
          1,
          [
            {
              offset: 1, //0%处的颜色
              color: '#0058FF',
            },

            {
              offset: 0.5, //100%处的颜色
              color: '#00AAFF',
            },
          ],
          false,
        ),
      },
      symbolPosition: 'start',
      symbolSize: [10, 15], //图形的大小用数组分别比表示宽和高,也乐意设
      symbolOffset: [-1, 0], //图形相对于原本位置的偏移
      z: 12, //象形柱状图组件的所有图形的z值.控制图形的前后顺序.z值小
    },

    {
      type: 'pictorialBar',
      symbolSize: [10, 15], //图形的大小用数组分别比表示宽和高,也乐意设
      symbolPosition: 'end',
      symbolOffset: ['5', '0'], //图形相对于原本位置的偏移
      z: 12, //象形柱状图组件的所有图形的z值.控制图形的前后顺序.z值小
      itemStyle: {
        color: new echarts.graphic.LinearGradient(
          0,
          0,
          1,
          0,
          [
            {
              offset: 1, //0%处的颜色
              color: '#0058FF',
            },

            {
              offset: 0.5, //100%处的颜色
              color: '#00AAFF',
            },
          ],
          false,
        ),
      },
      data: yAxisData,
    },
  ];
  return {
    grid: {
      left: '5%', // 改用百分比
      right: '15%',
      top: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      // name: '数量',
      axisLabel: {
        formatter: '{value}',
        color: '#fff',
      },
    },
    yAxis: {
      type: 'category',
      // name: '设备',
      data: xAxisData,
      axisLabel: {
        formatter: '{value}',
        color: '#fff',
      },
    },
    series: [
      yAxisData.length
        ? {
            ...series,
            type: 'bar',
            data: yAxisData,
            barWidth: '15',
            barGap: '10%',
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0, //0%处的颜色
                  color: 'rgba(0, 102, 255, 0.80)',
                },
                {
                  offset: 0.5, //0%处的颜色
                  color: 'rgba(135, 212, 255, 0.80)',
                },
                {
                  offset: 1, //100%处的颜色
                  color: 'rgba(0, 102, 255, 0.80)',
                },
              ],
              false,
            ),
          }
        : [],
    ],
  };
};
