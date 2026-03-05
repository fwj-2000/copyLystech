import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '时间稼动率',
    content: ['机台运行时间/排产时间'],
  },
  {
    title: '性能利用率',
    content: [
      '自动采集模切产出数/（机台运行时间*产品标准产能）',
      '自动采集模切产出计算：',
      '1.平板冲切次数*模数',
      '2.圆刀机直接产出',
      '3.自主PLC米数/步距*模数',
    ],
  },
  {
    title: '模切良率',
    content: [
      '材料损耗报表中用料米数换算标准产量',
      '模切报数/标准产量*100%/排产时间',
    ],
  },
];
