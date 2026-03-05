import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '累计达成',
    content: ['1月到上月实际值+当月周KPI预测值较预算达成'],
  },
  {
    title: '当月达成',
    content: ['当月周预测值较预算达成'],
  },
  {
    title: '数据来源',
    content: ['海波龙系统', '每周3出上周KPI数据，每月10号出上月损益数据'],
  },
];

export const DATE_DIFFERENCE = 45;
export const DATE_DIFFERENCE_PERIOD = 'day';
