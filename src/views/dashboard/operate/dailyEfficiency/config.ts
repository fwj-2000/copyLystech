// 前端显示配置

import { BasicColumn } from '/@/components/Table';

const smallSize = '68px';
const normalSize = '88px';

const getCustomHeaderCellFunc = color => {
  return () => ({
    style: {
      backgroundColor: color,
    },
  });
};

export const ColumnsOption: BasicColumn[] = [
  {
    title: '日期',
    dataIndex: 'EntDate',
    width: normalSize,
    fixed: 'left',
  },
  {
    title: '厂区',
    width: normalSize,
    dataIndex: 'Factory',
    fixed: 'left',
  },
  {
    title: '机台号',
    width: normalSize,
    dataIndex: 'MachineNo',
    fixed: 'left',
  },
  {
    title: '控制者',
    width: normalSize,
    dataIndex: 'FMRP',
    fixed: 'left',
  },
  {
    title: '计划编号',
    dataIndex: 'FPlanNumber',
    fixed: 'left',
  },
  {
    title: '产品名',
    dataIndex: 'FProduct',
    fixed: 'left',
  },
  {
    title: '生产楼层',
    dataIndex: 'Floor',
    fixed: 'left',
    width: normalSize,
  },
  {
    title: '是否零手工',
    width: smallSize,
    dataIndex: 'IsHand',
  },
  {
    title: '产品类型',
    width: smallSize,
    dataIndex: 'ProdType',
  },
  {
    title: '机台类型',
    width: smallSize,
    dataIndex: 'MachineType',
  },
  {
    title: '生产工艺',
    width: smallSize,
    dataIndex: 'Craft',
  },
  {
    title: '模切操作员',
    width: normalSize,
    dataIndex: 'Operator',
  },
  {
    title: '姓名',
    width: normalSize,
    dataIndex: 'Name',
  },
  {
    title: '技能等级',
    width: normalSize,
    dataIndex: 'SkillLevel',
  },
  {
    title: '单排模数',
    width: normalSize,
    dataIndex: 'SingleModulus',
  },
  {
    title: '步距',
    width: normalSize,
    dataIndex: 'Step',
  },
  {
    title: '是否过AOI',
    width: normalSize,
    dataIndex: 'IsAOI',
  },
  {
    title: 'AOI视野',
    width: normalSize,
    dataIndex: 'AOIFOV',
  },
  {
    title: 'AOI单次检测数',
    width: normalSize,
    dataIndex: 'AOICheckNum',
  },
  {
    title: '模切',
    customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
    children: [
      {
        title: '调机时间',
        customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'StAdjustTime',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'AdjustTime',
          },
        ],
      },
      {
        title: '标准速度（次（米）/分钟）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQStSpeed',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQSpeed',
          },
        ],
      },
      {
        title: '稼动率 %',
        customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQStJDL',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQJDL',
          },
        ],
      },
      {
        title: '标准人力配置（人/线）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'StManpower',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'AcManpower',
          },
        ],
      },
      {
        title: '标准模切效率（K/H）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQStUPH',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(250, 173, 20, 0.2)'),
            width: normalSize,
            dataIndex: 'MQUPH',
          },
        ],
      },
    ],
  },
  {
    title: 'AOI',
    customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
    children: [
      {
        title: '标准速度（M/分钟）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIStSpeed',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOISpeed',
          },
        ],
      },
      {
        title: '配置（人/线）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIStManpower',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIAcManpower',
          },
        ],
      },
      {
        title: '稼动',
        customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIStJDL',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIJDL',
          },
        ],
      },
      {
        title: '标准 AOI 效率（K/H）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIStUPH',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(24, 144, 255, 0.2)'),
            width: normalSize,
            dataIndex: 'AOIUPH',
          },
        ],
      },
    ],
  },
  {
    title: '手工',
    customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
    children: [
      {
        title: '标准手工效率（K/H）',
        customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
            width: normalSize,
            dataIndex: 'HandStUPH',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
            width: normalSize,
            dataIndex: 'HandUPH',
          },
        ],
      },
      {
        title: '手工良率',
        customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
        children: [
          {
            title: '标准',
            customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
            width: normalSize,
            dataIndex: 'HandStYield',
          },
          {
            title: '实际',
            customHeaderCell: getCustomHeaderCellFunc('rgba(82, 196, 26, 0.2)'),
            width: normalSize,
            dataIndex: 'HandYield',
          },
        ],
      },
    ],
  },
];

// 下载表格显示配置
export const DownloadColumnsOption = [
  {
    title: '日期',
    dataIndex: 'EntDate',
  },
  {
    title: '厂区',
    dataIndex: 'Factory',
  },
  {
    title: '机台号',
    dataIndex: 'MachineNo',
  },
  {
    title: '控制者',
    dataIndex: 'FMRP',
  },
  {
    title: '计划编号',
    dataIndex: 'FPlanNumber',
  },
  {
    title: '产品名',
    dataIndex: 'FProduct',
  },
  {
    title: '生产楼层',
    dataIndex: 'Floor',
  },
  {
    title: '是否零手工',
    dataIndex: 'IsHand',
  },
  {
    title: '产品类型',
    dataIndex: 'ProdType',
  },
  {
    title: '机台类型',
    dataIndex: 'MachineType',
  },
  {
    title: '生产工艺',
    dataIndex: 'Craft',
  },
  {
    title: '模切操作员',
    dataIndex: 'Operator',
  },
  {
    title: '姓名',
    dataIndex: 'Name',
  },
  {
    title: '技能等级',
    dataIndex: 'SkillLevel',
  },
  {
    title: '单排模数',
    dataIndex: 'SingleModulus',
  },
  {
    title: '步距',
    dataIndex: 'Step',
  },
  {
    title: '是否过AOI',
    dataIndex: 'IsAOI',
  },
  {
    title: 'AOI视野',
    dataIndex: 'AOIFOV',
  },
  {
    title: 'AOI单次检测数',
    dataIndex: 'AOICheckNum',
  },
  {
    title: '调机时间',
    dataIndex: 'StAdjustTime',
  },
  {
    title: '实际调机时间',
    dataIndex: 'AdjustTime',
  },
  {
    title: '标准人力',
    dataIndex: 'StManpower',
  },
  {
    title: '实际人力',
    dataIndex: 'AcManpower',
  },
  {
    title: '模切标准速度',
    dataIndex: 'MQStSpeed',
  },
  {
    title: '模切实际平均速度',
    dataIndex: 'MQSpeed',
  },
  {
    title: '模切标准稼动率',
    dataIndex: 'MQStJDL',
  },
  {
    title: '模切实际稼动率',
    dataIndex: 'MQJDL',
  },
  {
    title: '模切标准效率',
    dataIndex: 'MQStUPH',
  },
  {
    title: '模切实际效率',
    dataIndex: 'MQUPH',
  },
  {
    title: 'AOI标准人力',
    dataIndex: 'AOIStManpower',
  },
  {
    title: 'AOI实际人力',
    dataIndex: 'AOIAcManpower',
  },
  {
    title: 'AOI标准速度',
    dataIndex: 'AOIStSpeed',
  },
  {
    title: 'AOI实际速度',
    dataIndex: 'AOISpeed',
  },
  {
    title: 'AOI标准稼动率',
    dataIndex: 'AOIStJDL',
  },
  {
    title: 'AOI实际稼动率',
    dataIndex: 'AOIJDL',
  },
  {
    title: 'AOI标准效率',
    dataIndex: 'AOIStUPH',
  },
  {
    title: 'AOI实际效率',
    dataIndex: 'AOIUPH',
  },
  {
    title: '手工标准效率',
    dataIndex: 'HandStUPH',
  },
  {
    title: '手工实际效率',
    dataIndex: 'HandUPH',
  },
  {
    title: '手工标准良率',
    dataIndex: 'HandStYield',
  },
  {
    title: '手工实际良率',
    dataIndex: 'HandYield',
  },
];
