import echarts from 'echarts';
import { merge } from 'lodash-es';

// 特殊柱状01
interface ISpecialBarData01Params {
  data: any[];
  barWidth?: number;
  color?: echarts.Color;
  markPointColor?: echarts.Color;
  markPointHeight?: number;
  selfSeriesOption?: echarts.SeriesOption;
}
const getSpecialBarData01DefaultParams = {
  color: {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 1,
        color: 'rgba(90, 188, 254, 1)',
      },
      {
        offset: 0,
        color: 'rgba(181, 225, 255, 0.15)',
      },
    ],
  },
  barWidth: 16,
  markPointColor: 'rgba(90, 188, 254, 1)',
  markPointHeight: 4,
  data: [],
  selfSeriesOption: {},
};

export const getSpecialBarData01 = ({
  data = getSpecialBarData01DefaultParams.data,
  barWidth = getSpecialBarData01DefaultParams.barWidth,
  markPointColor = getSpecialBarData01DefaultParams.markPointColor,
  markPointHeight = getSpecialBarData01DefaultParams.markPointHeight,
  color = getSpecialBarData01DefaultParams.color as echarts.Color,
  selfSeriesOption = getSpecialBarData01DefaultParams.selfSeriesOption,
}: ISpecialBarData01Params): echarts.SeriesOption => {
  return merge(
    {
      type: 'bar',
      barWidth: barWidth,
      data,
      markPoint: {
        silent: true,
        itemStyle: {
          color: markPointColor,
        },
        data: data.map((value, idx) => ({
          name: '',
          coord: [idx, value],
          symbol: 'rect',
          symbolSize: [barWidth, markPointHeight],
          symbolOffset: [0, markPointHeight / 2],
        })),
      },
      itemStyle: {
        color,
      },
    },
    selfSeriesOption,
  );
};

// 山峰状
interface IMountainPeakDataParams {
  data: any[];
  colors?: echarts.Color[];
}
const getMountainPeakDataDefaultParams = {
  colors: [
    {
      type: 'linear',
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#AEAEAE',
        },
        {
          offset: 1,
          color: 'rgba(255, 255, 255, 0.45) ',
        },
      ],
    },
    {
      type: 'linear',
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: 'rgba(255, 161, 79, 0.86)',
        },
        {
          offset: 1,
          color: 'rgba(255, 205, 160, 0.10)',
        },
      ],
    },
  ],
  data: [],
};
export const getMountainPeakData = ({
  data = getMountainPeakDataDefaultParams.data,
  colors = getMountainPeakDataDefaultParams.colors as echarts.Color[],
}: IMountainPeakDataParams): echarts.SeriesOption => {
  return {
    type: 'pictorialBar',
    barGap: 0,
    barCategoryGap: 0,
    symbolPosition: 'start',
    symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
    symbolSize: ['150%', '100%'],
    data: data.map((item, idx) => {
      return {
        value: item.value,
        itemStyle: {
          color: colors[idx] ?? colors[0],
        },
      };
    }),
  };
};

// 方柱体
interface IGetSquareCylindersDataParams {
  barWidth?: number;
  colors?: any[];
  barNames?: string[];
  dataList: any[][];
}
const getSquareCylindersDataDefaultParams = {
  barWidth: 16,
  colors: [
    {
      foot: {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(0, 21, 69, 0)',
          },
          {
            offset: 1,
            color: 'rgba(0, 61, 208, 0.13)',
          },
        ],
      },
      head: '#6b91ea',
      bar: {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 1,
            color: 'rgba(104, 140, 226, 0.05)',
          },
          {
            offset: 0,
            color: 'rgba(64, 109, 214, 1)',
          },
        ],
      },
    },
    {
      foot: {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(220, 241, 255, 0.4)',
          },
          {
            offset: 1,
            color: 'rgba(61, 156, 221, 0.4)',
          },
        ],
      },
      head: 'rgba(94, 190, 255, 1)',
      bar: {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 1,
            color: 'rgba(220, 241, 255, 0.69)',
          },
          {
            offset: 0,
            color: 'rgba(61, 156, 221, 1)',
          },
        ],
      },
    },
  ],
  barNames: [],
  dataList: [[120, 200, 150, 80, 70, 110, 130]],
};
export const getSquareCylindersData = (params: IGetSquareCylindersDataParams = getSquareCylindersDataDefaultParams) => {
  const { barWidth = getSquareCylindersDataDefaultParams.barWidth, dataList, barNames = [], colors = getSquareCylindersDataDefaultParams.colors } = params;

  const sum = dataList.length - 1;
  const sumOffset = sum * 100;

  return dataList.reduce((pre, dataItem, idx) => {
    const offset = -sumOffset + (sumOffset * 2 * idx) / sum;
    return [
      ...pre,
      // 底部方块
      {
        data: dataItem.map(value => ({
          value,
          itemStyle: {
            opacity: Number.parseInt(value, 10) > 0 ? 1 : 0,
          },
        })),
        type: 'pictorialBar',
        symbol: 'diamond', //底部组件形状，不写默认为椭圆
        symbolSize: [barWidth, barWidth / 2], //底面[宽，高]
        symbolOffset: [`${offset}%`, '50%'],
        symbolPosition: 'start',
        stack: `stack-${idx}`,
        name: barNames[idx] ?? `data-${idx}`,
        color: (colors[idx] ?? colors[0]).foot,
        z: 3,
      },
      // 数据柱子
      {
        data: dataItem,
        type: 'bar',
        stack: `stack-${idx}`,
        name: barNames[idx] ?? `data-${idx}`,
        color: (colors[idx] ?? colors[0]).bar,
        z: 2,
      },
      // 顶部方块
      {
        data: dataItem.map(value => ({
          value,
          itemStyle: {
            opacity: Number.parseInt(value, 10) > 0 ? 1 : 0,
          },
        })),
        type: 'pictorialBar',
        symbol: 'diamond', //底部组件形状，不写默认为椭圆
        symbolSize: [barWidth, barWidth / 2], //底面[宽，高]
        symbolOffset: [`${offset}%`, '-50%'],
        symbolPosition: 'end',
        stack: `stack-${idx}`,
        name: barNames[idx] ?? `data-${idx}`,
        color: (colors[idx] ?? colors[0]).head,
        z: 3,
      },
    ];
  }, []);
};

interface IGetCylinderSeriesDataParams {
  barWidth: number;
  data: {
    value: number | string;
    colors: {
      top: echarts.Color;
      bottom: echarts.Color;
      bar: echarts.Color;
    };
  }[];
}

// 圆柱体默认参数
const getCylinderSeriesDataDefaultParams: IGetCylinderSeriesDataParams = {
  barWidth: 12,
  data: [
    {
      value: 40,
      colors: {
        top: '#98d5ff',
        bottom: '#3da4eb',
        bar: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(61, 167, 238)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(61, 167, 238, 0.74)', // 100% 处的颜色
            },
          ],
        },
      },
    },
  ],
};
// 圆柱体
export const getCylinderSeriesData = (params: Partial<IGetCylinderSeriesDataParams>): echarts.SeriesOption[] => {
  const { barWidth = getCylinderSeriesDataDefaultParams.barWidth, data = getCylinderSeriesDataDefaultParams.data } = params;
  return [
    {
      // 底部
      name: '',
      type: 'pictorialBar',
      symbolSize: [barWidth, barWidth / 2 + 0.5],
      symbolOffset: [0, 0],
      z: 2,
      tooltip: {
        show: false,
      },
      data: data.map(item => ({
        value: 1,
        itemStyle: {
          opacity: Number.parseInt(item.value, 10) > 0 ? 1 : 0,
          color: item.colors.bottom,
        },
      })),
    },
    // 顶部
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [barWidth, barWidth / 2 + 0.5],
      symbolOffset: [0, 0],
      z: 2,
      symbolPosition: 'end',
      tooltip: {
        show: false,
      },
      data: data.map(item => ({
        value: item.value,
        itemStyle: {
          opacity: Number.parseInt(item.value, 10) > 0 ? 1 : 0,
          color: item.colors.top,
        },
      })),
    },
    {
      type: 'bar',
      barWidth,
      z: 1,
      data: data.map(item => ({
        value: item.value,
        itemStyle: {
          opacity: 1,
          borderRadius: 50,
          color: item.colors.bar,
          barGap: '100%',
        },
      })),
    },
  ];
};
