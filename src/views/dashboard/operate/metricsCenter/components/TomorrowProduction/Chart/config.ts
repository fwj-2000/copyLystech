import { EChartsOption } from 'echarts';

interface ChartInfo {
  category: string;
  data: {
    name: string;
    value: number;
  }[]
}

export const getOptions = (info: ChartInfo[]): EChartsOption => {
  const pendingValues = getValuesByKey('Pending', info)
  const ongoingValues = getValuesByKey('Ongoing', info)
  const okValues = getValuesByKey('Ok', info)
  return {
    tooltip: {
      trigger: 'item',
      confine: true,
      appendToBody: true,
    },
    grid: {
      left: 12,
      right: 12,
      top: 42,
      bottom: 18,
      containLabel: true,
    },
    xAxis: {
      data: info.map(item => item.category),
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        margin: 8 //刻度标签与轴线之间的距离。
      }
    },
    yAxis: {
      show: true,
      name: '',
      nameGap: 12,
      nameTextStyle: {
        align: 'right',
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
      }
    },
    legend: {
      show: true,
      top: 0,
      left: 0,
      itemWidth: 12,
      itemHeight: 12,
      data: [{
        name: 'Pending',
        itemStyle: {
          color: '#5f8aee',
        }
      }, {
        name: 'Ongoing',
        itemStyle: {
          color: '#5ebeff',
        }
      }, {
        name: 'Ok',
        itemStyle: {
          color: '#d8d8d8',
        }
      }],
    },
    series: [
      {
        // 最低下的圆片
        name: '',
        type: 'pictorialBar',
        symbolSize: [12, 6.5],
        symbolOffset: [0, 1],
        z: 12,
        tooltip: {
          show: false,
        },
        itemStyle: {
          opacity: 1,
          color: '#6385d6'
        },
        data: pendingValues.map(item => item ? 1 : null)
      },
      // 2层
      {
        name: '',
        type: 'pictorialBar',
        symbolSize: [12, 6.5],
        symbolOffset: [0, -1],
        z: 12,
        symbolPosition: 'end',
        itemStyle: {
          color: '#3DA5EB',
          opacity: 1
        },
        tooltip: {
          show: false,
        },
        data: pendingValues.map((item) => {
          return item ? item : null
        })
      },
      // 3层
      {
        name: '',
        type: 'pictorialBar',
        symbolSize: [12, 6.5],
        symbolOffset: [0, -2],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: 'rgba(167, 191, 207, 0.8)'
        },
        tooltip: {
          show: false,
        },
        symbolPosition: 'end',
        data: ongoingValues.map((item, idx) => {
          const value = pendingValues[idx] + item;
          return value ? value : null
        })
      },
      // 4层
      {
        name: '',
        type: 'pictorialBar',
        symbolSize: [12, 6.5],
        symbolOffset: [0, -2],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: 'rgba(239, 240, 241, 0.74)'
        },
        tooltip: {
          show: false,
        },
        symbolPosition: 'end',
        data: okValues.map((item, idx) => {
          const value = pendingValues[idx] + ongoingValues[idx] + item;
          return value ? value : null
        })
      },
      {
        type: 'bar',
        stack: 'one',
        name: 'Pending',
        barWidth: 12,
        showBackground: true,
        backgroundStyle: {
          color: '#F4FBFF',
          opacity: 0.72,
          borderColor: '#E6E6E6',
          borderWidth: 1,
          borderRadius: 50
        },
        data: pendingValues.map((item) => ({
          value: item,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              x2: 0,
              y: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgb(75, 123, 236)',
              },
              {
                offset: 1,
                color: 'rgba(75, 123, 236, 0.74)',
              }],
            },
          }
        }))
      },
      {
        type: 'bar',
        stack: 'one',
        name: 'Ongoing',
        barWidth: 12,
        showBackground: true,
        backgroundStyle: {
          color: '#F4FBFF',
          opacity: 0.72,
          borderColor: '#E6E6E6',
          borderWidth: 1,
          borderRadius: 50
        },
        data: ongoingValues.map(item => (
          {
            value: item,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgb(61, 165, 235)',
                },
                {
                  offset: 1,
                  color: 'rgba(61, 165, 235, 0.74)',
                }],
              },
            }
          }))
      },
      {
        type: 'bar',
        stack: 'one',
        name: 'Ok',
        barWidth: 12,
        showBackground: true,
        backgroundStyle: {
          color: '#F4FBFF',
          opacity: 0.72,
          borderColor: '#E6E6E6',
          borderWidth: 1,
          borderRadius: 50
        },
        data: okValues.map(item => (
          {
            value: item,
            itemStyle: {
              borderRadius: [50, 50, 0, 0],
              color: {
                type: "linear",
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgb(216, 216, 216)',
                },
                {
                  offset: 1,
                  color: 'rgba(216, 216, 216, 0.74)',
                }],
              },
            }
          }))
      }
    ],
    barGap: '100%'
  }
}

// 根据name获取所有的value值
const getValuesByKey = (key: string, info: ChartInfo[]): (number)[] => {
  return info.map((item) => {
    const itemInfo = item.data.find((info) => info.name === key) || { value: 0 }
    return itemInfo.value;
  })
}