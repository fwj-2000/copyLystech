import dayjs from 'dayjs';
import { getClassName, getFormatter } from '../config';
import { isBainOptions } from '/@/views/dataAnalysis/financial/config';
import {
  commonMediumTextOption,
  commonMiniValueOption,
  commonValueOption,
  commonMediumValueOption,
  commonSeqOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EBuSbuDimension, ETimeDimension } from '../types';
import { getDimensionDimensionTypeparameter } from '/@/api/dataAnalysis/financial';

export const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季度', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];

// 维度字段对应的key
export const dimensionTypeKeyMap = {
  厂区: 'factory',
  中间10码: 'zj10m',
  成品编号: 'productNo',
  大项目: 'largeProject',
  订单号: 'orderNo',
  单价区间: 'priceRange',
  项目: 'programType',
  车间: 'workShopType',
  客户: 'customerType',
  产品类别: 'productType',
  中间6码: 'sixCodes',
  工程师: 'engineer',
  产品线: 'productLine',
  新老项目: 'newOldProject',
  小项目: 'smallProject',
  通用1: 'general1',
  通用2: 'general2',
  通用3: 'general3',
  通用4: 'general4',
  通用5: 'general5',
  '转出/接收方': 'transfer',
};

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  // {
  //   type: EFormItemType.SELECT,
  //   default: EBuSbuDimension.SBU,
  //   key: 'busbuDim',
  //   isHide: false,
  //   attrs: {
  //     allowClear: false,
  //   },
  //   options: [
  //     { text: 'BU', value: EBuSbuDimension.BU },
  //     { text: 'SBU', value: EBuSbuDimension.SBU },
  //   ],
  //   getParam: (value, searchFormValue) => {
  //     const isHide = searchFormValue.orgCode !== 'MQ';
  //     return isHide ? {} : { busbuDim: value };
  //   },
  // },
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '纳入边贡',
    default: '1',
    key: 'isBian',
    attrs: {
      allowClear: false,
    },
    options: isBainOptions,
  },
  {
    type: EFormItemType.SELECT,
    label: '维度',
    // default: ['zcplb', 'zzdkh'],
    default: [],
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    setDefault: options => {
      return options[0] ? [options[0].value] : [];
    },
    getOptions: async () => {
      const { data } = await getDimensionDimensionTypeparameter({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      return { dimensionType: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '工单类型',
    default: [],
    key: 'workNoType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { workNoType: value.join(';') };
    },
  },
  {
    type: EFormItemType.NUMBER_INPUT,
    label: 'TOP料件',
    key: 'top',
    default: '10',
    attrs: {},
  },
];

const commonValueOption65: Partial<BaseVxeTableTypes.Column> = {
  ...commonMiniValueOption,
  width: 65,
};

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonSeqOption,
      title: '排名',
    },
    // {
    //   ...commonMiniTextOption,
    //   title: '厂区',
    //   field: 'buSbu',
    //   slots: {
    //     default: ESlotDefault.LINK_DEFAULT,
    //   },
    //   params: {
    //     getPathUrl: ({ searchFormValue }) => {
    //       const { dimensionType } = searchFormValue;
    //       return dimensionType.includes('zj6m') ? '/dataAnalysis/financial/biangong/sixCodeDimension' : '/dataAnalysis/financial/biangong/materialTransfer';
    //     },
    //     getPathParams: ({ row, searchFormValue }) => {
    //       const { buCode, sbuCode } = row;
    //       const { isBian, dateRange, busbuDim, dimensionType } = searchFormValue;
    //       const isIncluded = dimensionType.includes('zj6m');
    //       const query = {
    //         orgCode: busbuDim === EBuSbuDimension.BU ? buCode : sbuCode,
    //         dimension: ETimeDimension.WEEK,
    //         isBian,
    //         dateRange,
    //         ...(isIncluded ? {} : { dimensionType: ['zj6m'] }),
    //       };
    //       return query;
    //     },
    //   },
    // },
    // {
    //   ...commonTextOption,
    //   title: '中间六码',
    //   field: 'transferCode',
    // },
    // {
    //   ...commonTextOption,
    //   title: '转出方/接收方',
    //   field: 'transfer',
    // },
    {
      ...commonMediumTextOption,
      title: '维度类型',
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ column }) => {
          const { title } = column;
          return title === '转出/接收方' ? '' : '/dataAnalysis/financial/biangong/groupDimension';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const orgCodeParams = {};
          if (searchFormValue.orgCode === 'MQ' && searchFormValue.busbuDim === EBuSbuDimension.BU) {
            orgCodeParams['orgCode'] = row.buCode;
          } else {
            orgCodeParams['orgCode'] = row.sbuCode;
          }
          let { orgCode, busbuDim, ...res } = searchFormValue;
          const info = {
            ...res,
            ...orgCodeParams,
            ...Object.keys(dimensionTypeKeyMap).reduce((pre, cur) => {
              const key = `dimesionType_${cur}`;
              if (row[key]) {
                pre[dimensionTypeKeyMap[cur]] = row[key];
              }
              return pre;
            }, {}),
          };
          // console.log(info, 'info', orgCodeParams);
          return info;
        },
      },
    },

    {
      ...commonMiniValueOption,
      title: '产值均价',
      field: 'outputValueAvege',
      formatter: getFormatter({ decimal: 4 }),
      className: getClassName(),
    },

    {
      ...commonValueOption,
      title: '结单产值(万元)',
      field: 'finishedProductOutputValue',
      formatter: getFormatter({ decimal: 2 }),
      className: getClassName(),
    },

    {
      title: '边贡部分',
      field: 'borderTribut',
      align: 'center',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardBorderTributeRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualBorderTributRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '达成%',
          field: 'achieveRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'borderTributGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          width: 65,
          title: '损失额(万元)',
          field: 'borderTributeLossAmount',
          formatter: getFormatter({ decimal: 2 }),
          className: getClassName(),
        },
      ],
    },

    {
      title: '损耗率',
      align: 'center',
      field: 'lossRate',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardLossRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualLossRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'lossRateGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
        {
          ...commonValueOption,
          width: 65,
          title: '损失额(万元)',
          field: 'materialLossAmount',
          formatter: getFormatter({ decimal: 2 }),
          className: getClassName({ rollback: true }),
        },
      ],
    },

    {
      title: '人工部分',
      align: 'center',
      field: 'labor',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardLaborRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualLaborRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'laborRateGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
        {
          ...commonMediumValueOption,
          width: 65,
          title: '损失额(万元)',
          field: 'artificialLossAmount',
          formatter: getFormatter({ decimal: 2 }),
          className: getClassName({ rollback: true }),
        },
      ],
    },

    {
      title: '材料占比',
      align: 'center',
      field: 'material',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardMaterialPropor',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualMaterialPropor',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'materialGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
      ],
    },

    {
      title: '变动制费占比',
      align: 'center',
      field: 'variableCost',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardVariableCost',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualVariableCost',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'variableCostGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
      ],
    },
    {
      title: '毛利部分',
      align: 'center',
      field: 'grossProfit',
      children: [
        {
          ...commonValueOption65,
          title: '标准%',
          field: 'standardGrossProfit',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: '实际%',
          field: 'actualGrossProfit',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption65,
          title: 'Gap',
          field: 'grossProfitGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
      ],
    },
  ];

  return columns;
};

// 判断total中是否存在 `边贡损失额(万元) borderTributeLossAmount`、`结单产值(万元) finishedProductOutputValue`、
// `产值均价 outputValueAvege`、`材料损失额(万元) materialLossAmount`、`人工损失额(万元) artificialLossAmount`
// 如果不存在，隐藏这些列
export const customFieldOptions = {
  borderTributeLossAmount: {
    getColumns: ({ data }) => {
      return {
        ...commonMediumValueOption,
        title: '边贡损失额(万元)',
        field: 'borderTributeLossAmount',
        formatter: getFormatter({ decimal: 2 }),
        className: getClassName(),
        visible: data !== undefined,
      };
    },
  },
  finishedProductOutputValue: {
    getColumns: ({ data }) => {
      return {
        ...commonValueOption,
        title: '结单产值(万元)',
        field: 'finishedProductOutputValue',
        formatter: getFormatter({ decimal: 2 }),
        className: getClassName(),
        visible: data !== undefined,
      };
    },
  },
  outputValueAvege: {
    getColumns: ({ data }) => {
      return {
        ...commonMiniValueOption,
        title: '产值均价',
        field: 'outputValueAvege',
        formatter: getFormatter({ decimal: 4 }),
        className: getClassName(),
        visible: data !== undefined,
      };
    },
  },
  materialLossAmount: {
    getColumns: ({ data }) => {
      return {
        ...commonMediumValueOption,
        title: '材料损失额(万元)',
        field: 'materialLossAmount',
        formatter: getFormatter({ decimal: 2 }),
        className: getClassName({ rollback: true }),
        visible: data !== undefined,
      };
    },
  },
  artificialLossAmount: {
    getColumns: ({ data }) => {
      return {
        ...commonMediumValueOption,
        title: '人工损失额(万元)',
        field: 'artificialLossAmount',
        formatter: getFormatter({ decimal: 2 }),
        className: getClassName({ rollback: true }),
        visible: data !== undefined,
      };
    },
  },
};
