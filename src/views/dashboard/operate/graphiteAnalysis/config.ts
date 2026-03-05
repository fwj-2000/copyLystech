export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '二维码信息',
    field: 'QrCode',
    width: 180,
  },
  {
    title: 'AOI判定结果',
    field: 'AoiStatus',
    width: 140,
  },
  {
    title: '手工复判是否OK',
    field: 'HandStatus',
    width: 120,
  },
  {
    title: '手工复判时间',
    field: 'HandTime',
    width: 120,
  },
  {
    title: '手工复判人员',
    field: 'HandUser',
    width: 120,
  },
  {
    title: '创建人',
    field: 'CreateUser',
    width: 80,
  },
  {
    title: '模切工工号',
    field: 'FOperator',
    width: 100,
  },
  {
    title: '17um石墨',
    field: 'Graphite1',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    //   searchField: 'orgName',
    // },
    children: [
      {
        field: 'Graphite',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'GraphiteProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'SmBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: 'PET',
    field: 'Pet1',
    children: [
      {
        field: 'Pet',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'PetProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'PetBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: '双面胶A',
    field: 'DoubleGlue1',
    children: [
      {
        field: 'DoubleGlue',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'DoubleGlueProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'SmjBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: 'AB胶1',
    field: 'AbGlue11',
    children: [
      {
        field: 'AbGlue1',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'AbGlue1ProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'Ab1BllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: 'AB胶2',
    field: 'AbGlue21',
    children: [
      {
        field: 'AbGlue2',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'AbGlue2ProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'Ab2BllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: 'BOTTOMPF',
    field: 'BottomPf1',
    children: [
      {
        field: 'BottomPf',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'BottomPfProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'BotBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: '黑色PF膜',
    field: 'BlackPf1',
    children: [
      {
        field: 'BlackPf',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'BlackPfProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'HsBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: 'AB胶3',
    field: 'AbGlue31',
    children: [
      {
        field: 'AbGlue3',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'AbGlue3ProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'Ab3BllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: '轻膜',
    field: 'LightFilm1',
    children: [
      {
        field: 'LightFilm',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'LightFilmProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'QmBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },
  {
    title: '承载膜',
    field: 'BearingFilm1',
    children: [
      {
        field: 'BearingFilm',
        title: '批次',
        headerClassName: 'last-predict-header',
        width: 100,
      },
      {
        field: 'BearingFilmProdNo',
        title: '内部物料编码',
        headerClassName: 'last-predict-header',
        width: 140,
      },
      {
        field: 'CzBllAvg',
        title: '剥离力平均值',
        headerClassName: 'last-predict-header',
        width: 100,
      },
    ],
  },

  {
    title: '黄色单面filter1',
    field: 'Hsdma',
    width: 120,
  },
  {
    title: '黄色单面filter2',
    field: 'Hsdmb',
    width: 120,
  },
  {
    title: '黄色双面filter',
    field: 'Hssm',
    width: 120,
  },
  {
    title: '透明filter',
    field: 'Tm',
    width: 100,
  },
  {
    title: '石墨',
    field: 'Sm',
    width: 100,
  },
  {
    title: '破刀线',
    field: 'Pdx',
    width: 100,
  },
  {
    title: '主刀',
    field: 'Zd',
    width: 100,
  },
];
