// tooltips 样式
export const getTooltipHtmlStr = params => {
  let start = 0;
  return `
  <div class="die-cutting-tooltip">
    <div class="head-container flex ct-between mb-4px">
      <p>${params[0].axisValue}</p>
      <p style="font-size: 16px;">${params[0].value}%</p>
    </div>
    <div class="content-container flex column all-start" ${params.length === 3 ? 'style="width: 152px"' : ''}>
    ${params[0].dimensionNames.reduce((pre, cur) => {
      let res = pre;
      if (cur) {
        res = `${pre}${getItemHtmlStr(cur, start, params)}`;
        start = start + 1;
      }
      return res;
    }, '')}
    </div>
  </div>
  `;
};
const getItemHtmlStr = (title, idx, params) => {
  if (!params[idx + 1]) return '';
  return `
    <div class="item flex ct-between" style="width: 100%">
      <p>${title}</p>
      <p>${params[idx + 1].value || '0'}%</p>
    </div>
  `;
};

// 通用样式
export const commonSeriesDataSyle = {
  normal: {
    type: 'bar',
    showBackground: true,
    backgroundStyle: {
      color: 'none',
      borderWidth: 1,
      borderRadius: [50, 50, 0, 0],
      borderColor: '#DBDBDB',
    },
    itemStyle: {
      borderRadius: [50, 50, 0, 0],
    },
  },
};
