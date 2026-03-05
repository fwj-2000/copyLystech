import { commonMiniTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
export const formOptions: TFormItemOption[] = [];

export const jumpButtonOptions = [
  {
    text: '维度分组',
    getPathUrl: () => {
      return '/dataAnalysis/financial/biangong/groupDimension';
    },
  },
  {
    text: '维度排名',
    getPathUrl: () => {
      return '/dataAnalysis/financial/biangong/rank';
    },
  },
];

const columns: BaseVxeTableTypes.Columns = [
  { type: 'checkbox', width: 60 },
  {
    ...commonMiniTextOption,
    field: 'PriceStart',
    title: '开始',
  },
  {
    ...commonMiniTextOption,
    field: 'PriceEnd',
    title: '结束',
  },
  {
    ...commonMiniTextOption,
    field: 'PriceRange',
    title: '区间',
  },
  {
    slots: {
      default: ESlotDefault.ACTION,
    },
    title: '操作',
    width: 50,
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return columns;
};
