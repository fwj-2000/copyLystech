// 上周预测和当周预测柱子对比
export const getPridictBarSeriesData = (value1, value2) => {
  return [
    {
      value: Number.parseInt(value1, 10),
      colors: {
        bottom: '#BFBFBF',
        top: '#dcdcdc',
        bar: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#BFBFBF', // 100% 处的颜色
            },
            {
              offset: 1,
              color: '#FFF', // 0% 处的颜色
            },
          ],
        },
      },
    },
    {
      value: Number.parseInt(value2, 10),
      colors: {
        bottom: '#3DA4EB',
        top: '#98D5FF ',
        bar: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(94, 190, 255, 1)', // 100% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(135, 207, 255, 0.74)', // 0% 处的颜色
            },
          ],
        },
      },
    },
  ];
};

// 上周预测和当周实际柱子对比
export const getPridictAndActualBarSeriesData = (value1, value2) => {
  return [
    {
      value: Number.parseInt(value1, 10),
      colors: {
        bottom: '#BFBFBF',
        top: '#dcdcdc',
        bar: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#BFBFBF', // 100% 处的颜色
            },
            {
              offset: 1,
              color: '#FFF', // 0% 处的颜色
            },
          ],
        },
      },
    },
    {
      value: Number.parseInt(value2, 10),
      colors: {
        bottom: '#F2A96A',
        top: '#FFC99B ',
        bar: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 161, 79, 1)', // 100% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(255, 201, 154, 0.53)', // 0% 处的颜色
            },
          ],
        },
      },
    },
  ];
};
