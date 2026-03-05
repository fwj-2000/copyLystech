export const importList = [
  // { title: 'excel行号', dataIndex: 'number', width: 150 },
  // { title: '数据', dataIndex: 'errorMsg', width: 150 },
  {
    title: '主要制程',
    dataIndex: 'mainProcessDesc',
    width: 180,
  },
  {
    title: '工序',
    dataIndex: 'workingProcedure',
    width: 200,
  },
  {
    title: '品名',
    dataIndex: 'productName',
    width: 170,
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    width: 150,
  },
  {
    title: '规格',
    dataIndex: 'specifications',
    width: 180,
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '基准',
    // width: 240,
    children: [
      { title: '固定制费(H)', dataIndex: 'benchmarkFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'benchmarkChangeCost', width: 150 },
      { title: '小计', dataIndex: 'benchmarkSubtotals', width: 150 },
    ],
  },
  {
    title: '不含折扣',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'excludingDiscountsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'excludingDiscountsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'excludingDiscountsSubtotals', width: 150 },
    ],
  },
  {
    title: '一年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'oneYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'oneYearsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'oneYearsSubtotals', width: 150 },
    ],
  },
  {
    title: '两年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'twoYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'twoYearsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'twoYearsSubtotals', width: 150 },
    ],
  },
  {
    title: '三年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'threeYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'threeYearsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'threeYearsSubtotals', width: 150 },
    ],
  },
  {
    title: '五年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'fiveYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'fiveYearsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'fiveYearsSubtotals', width: 150 },
    ],
  },
  {
    title: '七年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'sevenYearsChangeCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'sevenYearsFixedCost', width: 150 },
      { title: '小计', dataIndex: 'sevenYearsSubtotals', width: 150 },
    ],
  },
  {
    title: '八年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'eightYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'eightYearsSubtotals', width: 150 },
      { title: '小计', dataIndex: 'eightYearsChangeCost', width: 150 },
    ],
  },
  {
    title: '十年',
    // width: 200,
    children: [
      { title: '固定制费(H)', dataIndex: 'decadeYearsFixedCost', width: 150 },
      { title: '变动制费(H)', dataIndex: 'decadeYearsChangeCost', width: 150 },
      { title: '小计', dataIndex: 'decadeYearsSubtotals', width: 150 },
    ],
  },
];
