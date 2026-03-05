import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '人均产值',
    content: ['人均产值=入库产值/(总在职、IDL、DL、DL1、DL2、模切、手工在职)'],
  },
  {
    title: '开线人线比',
    content: ['开线人线比=(平板+圆刀+激光+成型模切工出勤数)/白晚班汇总开线数'],
  },
  {
    title: '总人线比',
    content: [
      '总人线比=(平板+圆刀+激光+成型模切工在职数)/(总线体数*2)',
      '圆刀人线比=圆刀模切工出勤数/圆刀开线数',
      '平板人线比=平板模切工出勤数/平板开线数',
      '激光人线比=激光模切工出勤数/激光开线数',
      '成型人线比=(成型+注塑模切工出勤数)/(成型+注塑开线数)',
    ],
  },
];
