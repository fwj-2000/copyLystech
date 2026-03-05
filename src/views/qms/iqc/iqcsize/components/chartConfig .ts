import * as echarts from 'echarts';
import { useFullscreen } from '@vueuse/core';

// 折线图
export const basicOptions = ({ xAxisData, yAxisData, dom }: { xAxisData: string[]; yAxisData: number[]; dom: HTMLElement | undefined }) => {
  const { toggle } = useFullscreen(dom);

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
    toolbox: {
      show: true,
      feature: {
        // dataZoom: {
        //   yAxisIndex: 'none',
        // },
        // dataView: {
        //   readOnly: false,
        // },
        // magicType: {
        //   type: ['line', 'bar'],
        // },
        restore: {},
        saveAsImage: {},
        myFullscreen: {
          show: true,
          title: '全屏',
          icon: 'path://M3 4l9 0 0 12-9 0 0 -12z',
          onclick: function () {
            toggle();
          },
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
