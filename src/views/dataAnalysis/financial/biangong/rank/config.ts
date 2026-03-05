import dayjs from 'dayjs';
import { getClassName, getFormatter } from '../config';
import { isBainOptions } from '/@/views/dataAnalysis/financial/config';
import {
  commonMediumTextOption,
  commonMediumValueOption,
  commonTextOption,
  commonValueOption,
  commonSeqOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import InfoDetail from './infoDetail/index.vue';
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
};
const centerHeaderAlign: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: '75',
};
const centerListAlign: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: '75',
};
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: EBuSbuDimension.SBU,
    key: 'busbuDim',
    isHide: false,
    attrs: {
      allowClear: false,
    },
    options: [
      { text: 'BU', value: EBuSbuDimension.BU },
      { text: 'SBU', value: EBuSbuDimension.SBU },
    ],
    getParam: (value, searchFormValue) => {
      const isHide = searchFormValue.orgCode !== 'MQ';
      return isHide ? {} : { busbuDim: value };
    },
  },
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
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonSeqOption,
      title: '排名',
      width: 60,
    },
    {
      title: 'BU/SBU',
      field: 'buSbu',
      ...centerHeaderAlign,
      width: 95,
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ searchFormValue }) => {
          const { dimensionType } = searchFormValue;
          return dimensionType.includes('zj6m') ? '/dataAnalysis/financial/biangong/sixCodeDimension' : '/dataAnalysis/financial/biangong/rank';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { buCode, sbuCode } = row;
          const { isBian, dateRange, busbuDim, dimensionType } = searchFormValue;
          const isIncluded = dimensionType.includes('zj6m');
          const query = {
            orgCode: busbuDim === EBuSbuDimension.BU ? buCode : sbuCode,
            dimension: ETimeDimension.WEEK,
            isBian,
            dateRange,
            ...(isIncluded ? {} : { dimensionType: ['zj6m'] }),
          };
          return query;
        },
      },
    },
    {
      ...commonMediumTextOption,
      ...centerHeaderAlign,
      title: '维度类型',
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT, // DIALOGUE
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/biangong/groupDimension';
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
          console.log(info, 'info', orgCodeParams);
          return info;
        },

        // dialogueCompo: InfoDetail,
        // getDialogueInfo: ({ row, searchFormValue }) => {
        //   const orgCodeParams = {};
        //   if (searchFormValue.orgCode === 'MQ' && searchFormValue.busbuDim === EBuSbuDimension.BU) {
        //     orgCodeParams['bu'] = row.buCode;
        //   } else {
        //     orgCodeParams['orgCode'] = row.sbuCode;
        //   }
        //   const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, searchFormValue.dateRange);
        //   const info = {
        //     ...orgCodeParams,
        //     isBian: searchFormValue.isBian,
        //     dimension: ETimeDimension.WEEK,
        //     workNoType:searchFormValue.workNoType.join(';'),
        //     dimensionType: searchFormValue.dimensionType.join(';'),
        //     startDim,
        //     endDim,
        //     ...Object.keys(dimensionTypeKeyMap).reduce((pre, cur) => {
        //       const key = `dimesionType_${cur}`;
        //       if (row[key]) {
        //         pre[dimensionTypeKeyMap[cur]] = row[key];
        //       }
        //       return pre;
        //     }, {}),
        //   };
        //   console.log(info, 'dialogueCompoinfo');
        //   return info;
        // },
      },
    },

    {
      ...commonValueOption,
      ...centerHeaderAlign,
      width: '70',
      title: '产值均价',
      field: 'outputValueAvege',
      formatter: getFormatter({ decimal: 4 }),
      className: getClassName(),
    },

    {
      ...commonMediumValueOption,
      ...centerHeaderAlign,
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
          ...commonValueOption,
          ...centerListAlign,
          title: '标准%',
          field: 'standardBorderTributeRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,

          title: '实际%',
          field: 'actualBorderTributRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,

          title: '达成%',
          field: 'achieveRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,

          title: 'Gap',
          field: 'borderTributGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonMediumValueOption,
          ...centerListAlign,
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
          ...commonValueOption,
          ...centerListAlign,

          title: '标准%',
          field: 'standardLossRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,

          title: '实际%',
          field: 'actualLossRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,
          title: 'Gap',
          field: 'lossRateGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
        {
          ...commonMediumValueOption,
          ...centerListAlign,
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
          ...commonValueOption,
          ...centerListAlign,

          title: '标准%',
          field: 'standardLaborRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,
          title: '实际%',
          field: 'actualLaborRate',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,
          title: 'Gap',
          field: 'laborRateGap',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName({ rollback: true }),
        },
        {
          ...commonMediumValueOption,
          ...centerListAlign,
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
          ...commonValueOption,
          ...centerListAlign,
          title: '标准%',
          field: 'standardMaterialPropor',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,
          title: '实际%',
          field: 'actualMaterialPropor',
          formatter: getFormatter({ decimal: 1, isRate: true }),
          className: getClassName(),
        },
        {
          ...commonValueOption,
          ...centerListAlign,
          title: 'Gap',
          field: 'materialGap',
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
        ...commonMediumValueOption,
        title: '结单产值(万元)',
        ...centerHeaderAlign,
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
        ...commonValueOption,
        ...centerHeaderAlign,
        width: '80',
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
