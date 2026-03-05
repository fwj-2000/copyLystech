import { dimensionCommonFormOptionsSimple } from '/@/views/dataAnalysis/financial/config';
import { commonValueOption, commonMediumTextOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, parseDateByDimension } from '/@/views/dataAnalysis/utils';
import { getWorkOrderLossAnalysisOption38, getWorkOrderLoss38auazhparam } from '/@/api/dataAnalysis/financial';
import dayjs from 'dayjs';

export const formOptions: TFormItemOption[] = [
  ...dimensionCommonFormOptionsSimple,
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: ['factory'],
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    // setDefault: options => {
    //   return options[0] ? [options[0].value] : [];
    // },
    getOptions: async () => {
      const { data } = await getWorkOrderLossAnalysisOption38({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      // return { dimensionType: value };
      return { dimensionType: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '结单情况',
    default: '0',
    key: 'isCleared',
    attrs: {
      allowClear: false,
    },
    options: [
      // { text: '全部', value: '' },
      { text: '已结', value: '1' },
      { text: '未结', value: '0' },
    ],
  },
  {
    type: EFormItemType.SELECT,
    default: [],
    label: '工单类型',
    key: 'auaZh',
    attrs: {
      // allowClear: false,
      mode: 'multiple',
      style: {
        minWidth: '150px',
      },
    },
    options: [],
    getOptions: async () => {
      const { data } = await getWorkOrderLoss38auazhparam({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: value as string,
      }));
    },
    getParam: (value, _, options) => {
      return { auaZh: Array.isArray(value) ? value.join(';') : [] };
    },
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
    },
    {
      ...commonMediumTextOption,
      field: 'list',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: {
        ...commonValueOption,
        slots: {
          default: ESlotDefault.LINK_DEFAULT,
        },
        params: {
          getPathUrl: () => {
            return '/dataAnalysis/financial/biangong/workorderloss38/detail';
          },
          getPathParams: ({ row, column, searchFormValue }) => {
            const { field } = column;
            const { orgCode } = row;
            const { isCleared, dimension } = searchFormValue;

            // {
            //   "ufName": "模切工",
            //   "workOrderNo": "工单",
            //   "machineId": "机台号",
            //   "team": "班次"
            // },
            // console.log('row==>', row, column, searchFormValue);
            console.log('field.split ', field); //2025WK35 NaN
            return {
              orgCode: orgCode ?? searchFormValue.orgCode,
              dimension,
              dateRange: parseDateByDimension(field.split('_')[0], dimension),
              isCleared,
              ufName: row[`dimesionType_模切工`] ?? '',
              workOrderNo: row[`dimesionType_工单`] ?? '',
              machineId: row[`dimesionType_机台号`] ?? '',
              team: row[`dimesionType_班次`] ?? '',
              auaZh: row[`dimesionType_工单类型`] ?? '',
              dsnam: row[`dimesionType_车间`] ?? '',
            };
          },
        },

        formatter: ({ cellValue, column }) => {
          const { title } = column;
          return (title as string).includes('率') ? transThouIntEx(cellValue, '%', 1) : transThouIntEx(cellValue, '', 0, true);
        },
        exportMethod: ({ row, column }) => {
          const { title } = column;
          return (title as string).includes('率') ? transThouIntEx(row[column.field], '%', 1) : transThouIntEx(row[column.field], '', 4);
        },
      },
    },

    {
      title: '环比',
      field: 'lossAmountH',
      headerAlign: 'center',
      children: [
        {
          ...commonValueOption,
          field: 'lossAmountEnv',
          title: '损失额',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
          exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4),
        },
        {
          ...commonValueOption,
          field: 'lossRateEnv',
          title: '损耗率',
          formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
        },
      ],
    },
    {
      title: '累计',
      field: 'lossSum',
      headerAlign: 'center',
      children: [
        {
          ...commonValueOption,
          field: 'lossAmountSum',
          title: '损失额',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
          exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4),
        },
        {
          ...commonValueOption,
          field: 'lossRateSum',
          title: '损耗率',
          formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
        },
      ],
    },
  ];

  return columns;
};
export const dimensionTypeKeyMap = {
  厂区: 'factory',
  机台号: 'machineId',
  班次: 'team',
  模切工: 'ufName',
  工单: 'workOrderNo',
  工单类型: 'auaZh',
  车间: 'dsnam',
};
