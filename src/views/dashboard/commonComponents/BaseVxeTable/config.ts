import { BaseVxeTableTypes, EFilterSlot } from './types';

export const commonColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 80,
};
export const commonMediumColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 100,
};
export const commonLargeColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 120,
};
const textOption: Partial<BaseVxeTableTypes.Column> = {
  align: 'left',
  filters: [{ data: [] }],
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT,
  },
};
export const commonTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonColumnOptions,
  ...textOption,
};
export const commonMediumTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  ...textOption,
};
export const commonLargeTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonLargeColumnOptions,
  ...textOption,
};
export const commonValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
export const commonMediumValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
