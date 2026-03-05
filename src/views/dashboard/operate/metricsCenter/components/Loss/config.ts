import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '',
    content: ['经管周结边贡数据，来源SAP'],
  },
];

// 是否纳入边贡
export const IS_INCLUDE_OPTIONS = [
  {
    label: '是',
    value: '是',
  },
  {
    label: '否',
    value: '否',
  },
  {
    label: '全部',
    value: 'ALL',
  },
];

export enum EIsInClude {
  YES = '是',
  NO = '否',
  ALL = 'ALL',
}
export const DEFAULT_IS_INCLUDE = EIsInClude.YES;