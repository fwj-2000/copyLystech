import { CSSProperties } from 'vue';

export const getAnalysisInfo = info => {
  const res: {
    type: 'text' | 'value';
    content: string | number;
    style?: CSSProperties;
  }[][] = [];
  // 组合标题
  const sbuCodeTemp = info[0].sbuCode;
  const busuTemp = info[0].buSbu;
  console.log('sbuCodeTemp', sbuCodeTemp, busuTemp);
  let isTitle = info.every(item => item.sbuCode === sbuCodeTemp);
  // res.push([
  //   {
  //     type: 'text',
  //     content: `${isTitle ? busuTemp + ': ' : '' + info[0].dimesionType.map(item => item.keys).join('+')}组合`,
  //   },
  // ]);
  // 组合标题
  res.push(
    [
      {
        type: 'text',
        content: `${isTitle ? busuTemp + ': ' : '' + info[0].dimesionType.map(item => item.keys).join('+')}组合`,
      },
    ],
    [
      {
        type: 'text',
        content: '本期结单产值',
      },
      {
        type: 'value',
        content: info
          .reduce((pre, cur) => {
            return pre + cur.finishedProductOutputValue;
          }, 0)
          .toFixed(2),
      },
      {
        type: 'text',
        content: '万，边贡损失',
      },
      {
        type: 'value',
        content: info
          .reduce((pre, cur) => {
            return pre + cur.borderTributeLossAmount;
          }, 0)
          .toFixed(2),
      },
      {
        type: 'text',
        content: '万，其中材料损失',
      },
      {
        type: 'value',
        content: info
          .reduce((pre, cur) => {
            return pre + cur.materialLossAmount;
          }, 0)
          .toFixed(2),
      },
      {
        type: 'text',
        content: '万，人工损失损失',
      },
      {
        type: 'value',
        content: info
          .reduce((pre, cur) => {
            return pre + cur.artificialLossAmount;
          }, 0)
          .toFixed(2),
      },
      {
        type: 'text',
        content: '万',
      },
    ],
  );
  // 组合数据
  info.forEach((item, idx) => {
    const {
      dimesionType,
      finishedProductOutputValue = 0,
      actualBorderTributRate = 0,
      standardBorderTributeRate = 0,
      borderTributeLossAmount = 0,
      materialLossAmount = 0,
      artificialLossAmount = 0,
    } = item;
    res.push([
      {
        type: 'text',
        content: `${idx + 1}）${isTitle ? '' : item.buSbu} ${dimesionType.map(item => item.values).join('+')}：本周/月结单产值`,
      },
      {
        type: 'value',
        content: finishedProductOutputValue.toFixed(2),
        style: {
          ...(Number.parseFloat(finishedProductOutputValue) < 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '万，边贡达成',
      },
      {
        type: 'value',
        content: actualBorderTributRate && `${actualBorderTributRate.toFixed(1)}%`,
        style: {
          ...(Number.parseFloat(actualBorderTributRate) < 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '，较标准Gap',
      },
      {
        type: 'value',
        content: `${(standardBorderTributeRate - actualBorderTributRate).toFixed(1)}%`,
        style: {
          ...(Number.parseFloat(standardBorderTributeRate - actualBorderTributRate) < 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '，边贡损失额',
      },
      {
        type: 'value',
        content: borderTributeLossAmount.toFixed(2),
        style: {
          ...(Number.parseFloat(borderTributeLossAmount) > 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '万，其中材料损失额',
      },
      {
        type: 'value',
        content: materialLossAmount.toFixed(2),
        style: {
          ...(Number.parseFloat(materialLossAmount) > 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '万，人工损失额',
      },
      {
        type: 'value',
        content: artificialLossAmount.toFixed(2),
        style: {
          ...(Number.parseFloat(artificialLossAmount) > 0 ? { color: 'red' } : {}),
        },
      },
      {
        type: 'text',
        content: '万',
      },
    ]);
  });
  return res;
};
