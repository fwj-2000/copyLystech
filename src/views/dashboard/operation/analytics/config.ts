// 获取线条样式
export const getSeriesLineDataSyle = ({ lineColor = '#FF7B00', itemColor = '#FF6347', suffix = '%' }) => ({
  type: 'line',
  smooth: true,
  lineStyle: {
    color: lineColor,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowBlur: 4,
    shadowOffsetY: 4,
  }, // 添加阴影区域
  label: {
    show: true,
    formatter: `{c}${suffix}`,
  },
  symbolSize: 8,
  itemStyle: {
    color: itemColor, // 数据点的颜色
  },
});

// 通用样式
export const getSeriesBarDataSyle = ({
  linearItemColor = {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(75, 123, 236, 1)',
      },
      {
        offset: 1,
        color: 'rgba(189, 206, 245, 0.12)',
      },
    ],
  },
}) => ({
  type: 'bar',
  barWidth: 14,
  itemStyle: {
    color: linearItemColor,
    borderRadius: [50, 50, 0, 0],
  },
});

// tooltip html字符串
export const getTooltipHtmlStrMth = ({ metricName = '', seriesData }) => {
  console.log('seriesData: ', seriesData);
  return params => {
    const { dataIndex } = params[0];
    return `
    <div class="analytics-tooltips">
      <div class="mb-6px">
        <p>${metricName} ${params[0].axisValue}</p>
      </div>
      <div class="min-w-[144px] bg-[#f2f2f2] rounded-4px">
        ${seriesData.reduce((pre, cur) => {
          return `${pre}
          <div class="flex ct-between px-16px py-2px">
            <p class="mr-16px">${cur.metric}</p>
            <p>${cur.data[dataIndex]}${cur.suffix}</p>
          </div>`;
        }, '')}
      </div>
    </div>
    `;
  };
};
