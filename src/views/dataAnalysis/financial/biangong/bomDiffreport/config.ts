import { dimensionCommonFormOptions } from '/@/views/dataAnalysis/financial/config';

import { commonValueOption, commonMediumTextOption, commonMediumFormatValueOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getBomdiffreportgroupname } from '/@/api/dataAnalysis/financial';

export const formOptions: TFormItemOption[] = [
  ...dimensionCommonFormOptions.filter(item => item.key !== 'isBian'),
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: [],
    isOverrideDefault: false,
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getBomdiffreportgroupname({});
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
    type: EFormItemType.NUMBER_INPUT,
    label: 'TOP',
    default: '10',
    key: 'top',
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      // mergeConfig: {
      //   needMergeRow: true,
      // },
    },
    {
      ...commonMediumTextOption,
      field: 'types',
      title: '类型',
    },
    {
      ...commonMediumFormatValueOption,
      width: 80,
      field: 'quantity',
      title: '个数',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          return ['模切效率达成', '手工效率达成'].includes(row.types)
            ? '/dataAnalysis/financial/biangong/papersDimension'
            : '/dataAnalysis/financial/biangong/workOrderLossAnaly';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { dimensionType, orgCode, dateRange } = searchFormValue;
          const { types, matnrData } = row;

          const isPaperType = ['模切效率达成', '手工效率达成'].includes(types);
          const paramKey = isPaperType ? 'productNo' : 'productCode';
          const paramValue = matnrData.split(';');
          console.log('🚀 ~ getAllColumns ~ paramValue:', paramValue);

          return {
            orgCode,
            dateRange,
            dimensionType,
            [paramKey]: paramValue,
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'proportion',
      title: '占比',
      formatter: getFormatter({ isRate: true }),
    },
  ];

  return columns;
};
