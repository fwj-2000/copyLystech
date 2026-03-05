import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { getClassName, getFormatter } from '../config';
import { commonMediumColumnOptions, commonMediumValueOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { ETimeDimension } from '../types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { isBainOptions } from '/@/views/dataAnalysis/financial/config';
import { getDimensiontypeSixCode } from '/@/api/dataAnalysis/financial';

export const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季度', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];

// SAP状态更新
export const sapOptions = [
  {
    label: '反接收',
    value: '1',
  },
  {
    label: '已接收',
    value: '2',
  },
  {
    label: '已结算',
    value: '3',
  },
  {
    label: '反结算',
    value: '4',
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumColumnOptions,
      field: 'factory',
      title: '厂区',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ranking`;
        },
      },
    },
    {
      ...commonMediumColumnOptions,
      field: 'workShop',
      title: '车间',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ranking`;
        },
      },
    },
    {
      ...commonMediumColumnOptions,
      field: 'customer',
      title: '客户',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ranking`;
        },
      },
    },
    {
      ...commonMediumColumnOptions,
      field: 'product',
      title: '产品类别',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ranking`;
        },
      },
    },
    {
      ...commonMediumColumnOptions,
      field: 'code3',
      title: '内部3码',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ranking`;
        },
      },
    },
    {
      ...commonMediumColumnOptions,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return `/dataAnalysis/financial/biangong/ticketDimension`;
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { dimensionType, dateRange } = searchFormValue;
          const filterKeyMap = {
            zj6m: 'sixCodes',
            largeproject: 'largeProject',
            xxm: 'smallProject',
            matnr: 'productNo',
            other1: 'general1',
            other2: 'general2',
            other3: 'general3',
            other4: 'general4',
            other5: 'general5',
          };
          const dimensionKey = filterKeyMap[dimensionType] ?? '';
          const query = {
            orgCode: row.sbuCode,
            dateRange,
          };
          if (dimensionKey) query[dimensionKey] = row[column.field];
          console.log('quer1y', query);
          return query;
        },
      },
    },

    {
      field: 'total',
      title: '累计',
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          ...commonValueOption,
          field: 'totalOutputValue',
          title: '产值权重',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalStandardBg',
          title: '标准边贡',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonMediumValueOption,
          field: 'totalStandardClzb',
          title: '标准含损耗材料占比',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalStandardRgzb',
          title: '标准人工占比',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalStandardShl',
          title: '标准损耗率',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalStandardSgxl',
          title: '标准手工效率',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualBg',
          title: '实际边贡',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualClzb',
          title: '实际材料占比',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualRgzb',
          title: '实际人工占比',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualShl',
          title: '实际损耗率',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualSgxl',
          title: '实际手工效率',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualBgcy',
          title: '实际边贡差异',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualClcy',
          title: '实际材料差异',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonValueOption,
          field: 'totalActualRgcy',
          title: '实际人工差异',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
        {
          ...commonMediumValueOption,
          field: 'totalActualRgxlcy',
          title: '实际手工效率差异',
          headerClassName: 'bg-purple',
          ...commonValue,
        },
      ],
    },
    {
      field: 'standardList',
      columnType: EColumnType.MONTH_KEY_KEYS_VALUES,
      childOption: {
        ...commonMediumValueOption,
        width: 90,
        ...commonValue,
      },
    },
    {
      field: 'actualList',
      columnType: EColumnType.MONTH_KEY_KEYS_VALUES,
      childOption: {
        ...commonMediumValueOption,
        width: 90,
        ...commonValue,
      },
    },
    // end
  ];
  return columns;
};

// 搜索表单配置
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
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
    default: ['zj6m'],
    isOverrideDefault: false,
    key: 'dimensionType',
    attrs: {
      allowClear: false,
    },
    options: [],
    getOptions: async () => {
      const { data } = await getDimensiontypeSixCode({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    // setDefault(options) {
    //   console.log(options, 'optionsoptions');
    //   if (options.findIndex(item => item.value === 'zj6m') !== -1) {
    //     return ['zj6m'];
    //   }
    //   return [];
    // },
  },
];

const exportMethod = ({ row, column }) => {
  if (!row[column.field]) return '';
  return `${row[column.field].toFixed(1)}%`;
};
const commonValue = {
  formatter: getFormatter({ decimal: 1, isRate: true }),
  exportMethod,
  className: getClassName(),
};
