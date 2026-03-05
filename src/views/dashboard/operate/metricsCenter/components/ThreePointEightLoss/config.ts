import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '工单材料损失额',
    content: ['已结单：边贡周结实际材料损失', '未结单：3.8系统不良品数 * 标准材料成本', '损耗率 = 损失额 / 实际材料成本 * 100%'],
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
