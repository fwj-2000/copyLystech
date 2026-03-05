import UtilizationRate from '../components/UtilizationRate/index.vue'; // AOI
import DieCutting from '../components/DieCutting/index.vue'; // 模切稼动(废弃)
import DieCutToday from '../components/DieCutToday/index.vue'; // 模切达成
import TomorrowProduction from '../components/TomorrowProduction/index.vue'; // 明日生产准备
import QualityAudit from '../components/QualityAudit/index.vue'; // 品质稽核
import ProductAchievement from '../components/ProductAchievement/index.vue';
import Attendance from '../components/Attendance/index.vue'; // 出勤概况
import StatusOfTicket from '../components/StatusOfTicket/index.vue'; // 工单状况
import TimeUtilizationRate from '../components/TimeUtilizationRate/index.vue'; // 时间稼动率
import Uptime from '../components/Uptime/index.vue'; // 开机率
import ProcessYield from '../components/ProcessYield/index.vue'; // 制程良率
import Head from '../components/Head.vue'; // 总览
import CustomerComplaints from '../components/CustomerComplaints/index.vue'; // 客诉
import Output from '../components/Output/index.vue'; // 产值
import Financeeconomic from '../components/Financeeconomic/index.vue'; // 边贡
import Loss from '../components/Loss/index.vue'; // 损耗
import Artificial from '../components/Artificial/index.vue'; // 人工
import Profit from '../components/Profit/index.vue'; // 损益
import Expenses from '../components/Expenses/index.vue'; // 費用
import Manpower from '../components/Manpower/index.vue'; // 人力
import Production from '../components/Production/index.vue'; // 产销
import DieCuttingUtilizationRate from '../components/DieCuttingUtilizationRate/index.vue'; // 模切稼动率
import ThreePointEightLoss from '../components/ThreePointEightLoss/index.vue'; // 3.8损耗
import ModularPerformance from '../components/ModularPerformance/index.vue'; // 模块性能
import { useI18n } from '/@/hooks/web/useI18n';
import { CustomCompoInfo } from '../types';
const { t } = useI18n();

// 默认的视图配置
const COMMON_DEFAULT_CONFIG = {
  block: 1,
  show: false,
  values: {},
  disabled: false,
};

// 全部组件的初始配置
export const ALL_CUSTOMIZE_COMPO_LIST: CustomCompoInfo[] = [
  {
    id: 0,
    ...COMMON_DEFAULT_CONFIG,
    block: 4,
    disabled: true,
    name: t('views.dashboard.operate.metricsCenter.overview'),
    component: Head,
  },
  {
    id: 1,
    ...COMMON_DEFAULT_CONFIG,
    block: 1,
    name: t('views.dashboard.operate.aoiIsInActionToday.title'),
    component: UtilizationRate,
  },
  {
    id: 2,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.attendanceProfile'),
    component: Attendance,
  },
  {
    id: 3,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.dieCutToday.title'),
    component: DieCutToday,
  },
  {
    id: 4,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.statusOfTicket'),
    component: StatusOfTicket,
  },
  {
    id: 5,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.qualityAudit'),
    component: QualityAudit,
  },
  {
    id: 6,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.todaySDieCuttingCrops'),
    component: DieCutting,
  },
  {
    id: 7,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.tomorrowProductionPreparation.name'),
    component: TomorrowProduction,
  },
  {
    id: 8,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.todayProductAchievement'),
    component: ProductAchievement,
  },
  {
    id: 9,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.oee.timeUtilizationRate'),
    component: TimeUtilizationRate,
  },
  {
    id: 10,
    ...COMMON_DEFAULT_CONFIG,
    block: 1,
    name: t('views.dashboard.operate.uptime'),
    component: Uptime,
  },
  {
    id: 11,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.processYield.title'),
    component: ProcessYield,
  },
  {
    id: 12,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.customerComplaints.title'),
    component: CustomerComplaints,
  },
  {
    id: 13,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.output.title'),
    component: Output,
  },
  {
    id: 14,
    ...COMMON_DEFAULT_CONFIG,
    name: t('views.dashboard.operate.financeeconomic.title'),
    component: Financeeconomic,
  },
  {
    id: 15,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.loss.title'),
    component: Loss,
  },
  {
    id: 16,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: t('views.dashboard.operate.artificial.title'),
    component: Artificial,
  },
  {
    id: 17,
    ...COMMON_DEFAULT_CONFIG,
    block: 1,
    name: '损益',
    component: Profit,
  },
  {
    id: 18,
    ...COMMON_DEFAULT_CONFIG,
    block: 1,
    name: '費用',
    component: Expenses,
  },
  {
    id: 19,
    ...COMMON_DEFAULT_CONFIG,
    block: 2,
    name: '人力',
    component: Manpower,
  },
  {
    id: 20,
    ...COMMON_DEFAULT_CONFIG,
    block: 3,
    name: '产销',
    component: Production,
  },
  {
    id: 21,
    ...COMMON_DEFAULT_CONFIG,
    name: '模切稼动率',
    component: DieCuttingUtilizationRate,
  },
  {
    id: 22,
    ...COMMON_DEFAULT_CONFIG,
    name: '3.8损耗',
    component: ThreePointEightLoss,
  },
  {
    id: 23,
    ...COMMON_DEFAULT_CONFIG,
    name: '模切绩效',
    component: ModularPerformance,
  },
];

// 本地开发调试组件
const devCompConfig = [
  // {
  //   id: 23,
  //   show: true,
  // },
];
export const devConfig = process.env.NODE_ENV === 'development' ? devCompConfig : [];
