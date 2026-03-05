import type { AppRouteRecordRaw } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, COMMON_ROUTE } from '/@/router/routes/basic';
import { LAYOUT } from '/@/router/constant';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { HRRoute } from './dashboard/hr';
import { FCMetricRoute } from './fc';
import { SalesRoute } from './dashboard/sales';
import { FinancialRoute } from './dataAnalysis/financial';
import { OperationRoute } from './dataAnalysis/operation';
import { ScreenRoute } from './screen';
import { PMTDataRoute } from './PMTData';
import { humanMachineRoute } from './dataAnalysis/humanMachine';
import { PCCDetailPreview } from '/@/router/routes/dashboard/PCCDetailPreview';

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/basic/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
// 表单外链
export const FormShortLinkRoute: AppRouteRecordRaw = {
  path: '/formShortLink',
  name: 'FormShortLink',
  component: () => import('/@/views/common/formShortLink/index.vue'),
  meta: {
    title: '',
  },
};
// PCC详情页预览
export const PCCDetailPreviewRoute: AppRouteRecordRaw = {
  path: '/PCCDetailPreview',
  name: 'PCCDetailPreview',
  component: () => import('/@/views/engineering/PCCBeta/PCCDetailPreview/index.vue'),
  meta: {
    title: 'PCC详情页预览',
    ignoreAuth: true,
  },
};

// ipqc数据看板-临时
export const ipqcDashboardRoute: AppRouteRecordRaw[] = [
  {
    path: '/productionDeal/dashboard',
    name: 'ipqcDashboard',
    component: () => import('/@/views/productionDeal/dashboard/index.vue'),
    meta: {
      title: 'ipqc数据看板',
    },
  },
  {
    path: '/productionDeal/ipqcDashboardDetail',
    name: 'ipqcDashboardDetail',
    component: () => import('/@/views/productionDeal/dashboard/ipqcDashboardDetail/index.vue'),
    meta: {
      title: 'ipqc数据看板',
    },
  },
  {
    path: '/productionDeal/ipqcDashboardChart',
    name: 'ipqcDashboardChart',
    component: () => import('/@/views/productionDeal/dashboard/ipqcDashboardChart/index.vue'),
    meta: {
      title: 'ipqc数据看板',
    },
  },
];

// 看板-运营-oee详情页路由
const oeeDetailModules = import.meta.glob('../../views/dashboard/operate/oee/detail/*/index.vue', { eager: false });
const oeeDetailRoutes: AppRouteRecordRaw[] = Object.entries(oeeDetailModules).reduce((pre, [key, componentFactory]) => {
  const componentName = key.split('/').slice(-2, -1)[0]; // 取倒数第二项
  if (!componentName) {
    return pre;
  }
  return [
    ...pre,
    {
      path: `/dashboard/operate/oee/detail/${componentName}`,
      name: `dashboard-operate-oee-detail-${componentName}`,
      component: componentFactory,
      meta: {
        title: t(`views.dashboard.operate.oee.detail.${componentName}`),
      },
    },
  ];
}, []);

export const DashboardLargeRoute: AppRouteRecordRaw = {
  path: '/dashboardv1/large/map',
  name: 'dashboardv1-large-map',
  component: () => import('/@/views/dashboard/large/map/index.vue'),
  meta: {
    title: '数据大屏',
  },
};

export const DashboardLargeRateRoute: AppRouteRecordRaw = {
  path: '/dashboardv1/large/rate',
  name: 'dashboardv1-large-rate',
  component: () => import('/@/views/dashboard/large/map/rate.vue'),
  meta: {
    title: '数据大屏',
  },
};

export const WriteSignatureRoute: AppRouteRecordRaw[] = [
  {
    path: '/hrtrain/employeeSign',
    name: 'write-signature',
    component: () => import('/@/views/hrBis/writeSignature/index.vue'),
    meta: {
      title: '培训员工信息提交',
    },
  },
  {
    path: '/hrtrain/mentorAudit',
    name: 'hremp-mentoraudit',
    component: () => import('/@/views/hrBis/writeSignature/mentorAudit.vue'),
    meta: {
      title: '培训员工导师签审',
    },
  },
];

export const DashboardRoute: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboardRoute',
  component: LAYOUT,
  redirect: '/dashboard/operate/metricsCenter',
  meta: {
    title: 'dashboardRoute',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '/dashboard/operate/metricsCenter',
      component: () => import('/@/views/dashboard/operate/metricsCenter/index.vue'),
      name: 'dashboard-operate-metricsCenter',
      meta: {
        title: '运营指标中心',
        defaultTitle: '运营指标中心',
      },
    },
    {
      path: '/dashboard/operation/analytics',
      component: () => import('/@/views/dashboard/operation/analytics/index.vue'),
      name: 'dashboard-operation-analytics',
      meta: {
        title: '运营分析',
        defaultTitle: '运营分析',
      },
    },
    {
      path: '/dashboard/operate/uptime',
      component: () => import('/@/views/dashboard/operate/uptime/index.vue'),
      name: 'dashboard-operate-uptime',
      meta: {
        title: '开机率',
      },
    },
    {
      path: '/dashboard/operate/uptime/detail',
      component: () => import('/@/views/dashboard/operate/uptime/detail/index.vue'),
      name: 'dashboard-operate-uptime-detail',
      meta: {
        title: '开机率详情',
      },
    },
    {
      path: '/dashboard/operate/uptime/machineDetails',
      component: () => import('/@/views/dashboard/operate/uptime/detail/MachineDetails.vue'),
      name: 'dashboard-operate-uptime-machineDetails',
      meta: {
        title: '机台详情',
      },
    },
    {
      path: '/dashboard/operate/attendanceRate',
      component: () => import('/@/views/dashboard/operate/attendanceRate/index.vue'),
      name: 'dashboard-operate-attendanceRate',
      meta: {
        title: '出勤概况',
      },
    },
    {
      path: '/dashboard/operate/attendanceRate/detail',
      component: () => import('/@/views/dashboard/operate/attendanceRate/detail/index.vue'),
      name: 'dashboard-operate-attendanceRate-detail',
      meta: {
        title: '出勤率详情',
      },
    },
    {
      path: '/dashboard/operate/attendanceRate/personnelDetail',
      component: () => import('/@/views/dashboard/operate/attendanceRate/detail/PersonnelAttendanceDetail.vue'),
      name: 'dashboard-operate-attendanceRate-personnelDetail',
      meta: {
        title: '出勤人员详情',
      },
    },
    {
      path: '/dashboard/operate/processYield',
      component: () => import('/@/views/dashboard/operate/processYield/index.vue'),
      name: 'dashboard-operate-processYield',
      meta: {
        title: '制程良率',
      },
    },
    {
      path: '/dashboard/operate/processYield/detail',
      component: () => import('/@/views/dashboard/operate/processYield/detail/index.vue'),
      name: 'dashboard-operate-processYield-detail',
      meta: {
        title: '制程良率详情',
      },
    },
    {
      path: '/dashboard/operate/processYield/processDetail',
      component: () => import('/@/views/dashboard/operate/processYield/detail/processDetail.vue'),
      name: 'dashboard-operate-processYield-processDetail',
      meta: {
        title: '包装产出明细',
      },
    },
    {
      path: '/dashboard/operate/processYield/handInfoDetail',
      component: () => import('/@/views/dashboard/operate/processYield/detail/handInfoDetail.vue'),
      name: 'dashboard-operate-processYield-handInfoDetail',
      meta: {
        title: '手工明细',
      },
    },
    {
      path: '/dashboard/operate/processYield/stateInfoDetail',
      component: () => import('/@/views/dashboard/operate/processYield/detail/stateInfoDetail.vue'),
      name: 'dashboard-operate-processYield-stateInfoDetail',
      meta: {
        title: '结单良率明细',
      },
    },
    {
      path: '/dashboard/operate/dieCutting',
      component: () => import('/@/views/dashboard/operate/dieCuttingIsAchieved/index.vue'),
      name: 'dashboard-operate-dieCutting',
      meta: {
        title: '模切达成',
      },
    },
    {
      path: '/dashboard/operate/dieCutting/detail',
      component: () => import('/@/views/dashboard/operate/dieCuttingIsAchieved/detail/index.vue'),
      name: 'dashboard-operate-dieCutting-detail',
      meta: {
        title: '模切达成详情',
      },
    },
    {
      path: '/dashboard/operate/dieCutting/infoDetail',
      component: () => import('/@/views/dashboard/operate/dieCuttingIsAchieved/detail/InfoDetails.vue'),
      name: 'dashboard-operate-dieCutting-infoDetail',
      meta: {
        title: '模切达成明细',
      },
    },
    {
      path: '/dashboard/operate/customerComplaints',
      component: () => import('/@/views/dashboard/operate/customerComplaints/index.vue'),
      name: 'dashboard-operate-customerComplaints',
      meta: {
        title: '客诉',
      },
    },
    {
      path: '/dashboard/operate/customerComplaints/detail',
      component: () => import('/@/views/dashboard/operate/customerComplaints/detail/index.vue'),
      name: 'dashboard-operate-customerComplaints-detail',
      meta: {
        title: '客诉详情',
      },
    },
    {
      path: '/dashboard/operate/customerComplaints/infoDetail',
      component: () => import('/@/views/dashboard/operate/customerComplaints/detail/InfoDetails.vue'),
      name: 'dashboard-operate-customerComplaints-infoDetail',
      meta: {
        title: '客诉明细',
      },
    },
    {
      path: '/dashboard/operate/output',
      component: () => import('/@/views/dashboard/operate/output/index.vue'),
      name: 'dashboard-operate-output',
      meta: {
        title: '产值',
      },
    },
    {
      path: '/dashboard/operate/output/detail',
      component: () => import('/@/views/dashboard/operate/output/detail/index.vue'),
      name: 'dashboard-operate-output-detail',
      meta: {
        title: '产值详情',
      },
    },
    {
      path: '/dashboard/operate/output/infoDetail',
      component: () => import('/@/views/dashboard/operate/output/detail/InfoDetails.vue'),
      name: 'dashboard-operate-output-infoDetail',
      meta: {
        title: '产值明细',
      },
    },
    {
      path: '/dashboard/operate/financeeconomic',
      component: () => import('/@/views/dashboard/operate/financeeconomic/index.vue'),
      name: 'dashboard-operate-financeeconomic',
      meta: {
        title: '边贡',
      },
    },
    {
      path: '/dashboard/operate/financeeconomic/detail',
      component: () => import('/@/views/dashboard/operate/financeeconomic/detail/index.vue'),
      name: 'dashboard-operate-financeeconomic-detail',
      meta: {
        title: '边贡详情',
      },
    },
    {
      path: '/dashboard/operate/mpf',
      component: () => import('/@/views/dashboard/operate/mpf/index.vue'),
      name: 'dashboard-operate-mpf',
      meta: {
        title: '模切绩效',
      },
    },
    {
      path: '/dashboard/operate/threePointEightLoss',
      component: () => import('/@/views/dashboard/operate/threePointEightLoss/index.vue'),
      name: 'dashboard-operate-threePointEightLoss',
      meta: {
        title: '3.8损耗',
      },
    },
    {
      path: '/dashboard/operate/threePointEightLoss/detail',
      component: () => import('/@/views/dashboard/operate/threePointEightLoss/detail/index.vue'),
      name: 'dashboard-operate-threePointEightLoss-detail',
      meta: {
        title: '3.8损耗详情',
      },
    },
    {
      path: '/dashboard/operate/loss',
      component: () => import('/@/views/dashboard/operate/loss/index.vue'),
      name: 'dashboard-operate-loss',
      meta: {
        title: '损耗',
      },
    },
    {
      path: '/dashboard/operate/loss/detail',
      component: () => import('/@/views/dashboard/operate/loss/detail/index.vue'),
      name: 'dashboard-operate-loss-detail',
      meta: {
        title: '损耗详情',
      },
    },
    {
      path: '/dashboard/operate/artificial',
      component: () => import('/@/views/dashboard/operate/artificial/index.vue'),
      name: 'dashboard-operate-artificial',
      meta: {
        title: '人工',
      },
    },
    {
      path: '/dashboard/operate/artificial/detail',
      component: () => import('/@/views/dashboard/operate/artificial/detail/index.vue'),
      name: 'dashboard-operate-artificial-detail',
      meta: {
        title: '人工详情',
      },
    },
    {
      path: '/dashboard/operate/expense',
      component: () => import('/@/views/dashboard/operate/expense/index.vue'),
      name: 'dashboard-operate-expense',
      meta: {
        title: '费用',
      },
    },
    {
      path: '/dashboard/operate/expense/detail',
      component: () => import('/@/views/dashboard/operate/expense/detail/index.vue'),
      name: 'dashboard-operate-expense-detail',
      meta: {
        title: '费用详情',
      },
    },
    {
      path: '/dashboard/operate/expense/ranking',
      component: () => import('/@/views/dashboard/operate/expense/ranking/index.vue'),
      name: 'dashboard-operate-expense-ranking',
      meta: {
        title: '费用排名',
      },
    },
    {
      path: '/dashboard/operate/expense/info',
      component: () => import('/@/views/dashboard/operate/expense/info/index.vue'),
      name: 'dashboard-operate-expense-info',
      meta: {
        title: '费用明细',
      },
    },
    {
      path: '/dashboard/operate/expense/table',
      component: () => import('/@/views/dashboard/operate/expense/table/index.vue'),
      name: 'dashboard-operate-expense-table',
      meta: {
        title: '费用明细',
      },
    },
    {
      path: '/dashboard/operate/expense/manualData',
      component: () => import('/@/views/dashboard/operate/expense/manualData/index.vue'),
      name: 'dashboard-operate-expense-manualData',
      meta: {
        title: '手工数据',
      },
    },
    {
      path: '/dashboard/operate/expense/draftPage',
      component: () => import('/@/views/dashboard/operate/expense/draftPage/index.vue'),
      name: 'dashboard-operate-expense-draftPage',
      meta: {
        title: '底稿数据',
      },
    },
    {
      path: '/dashboard/operate/utilizationRate',
      component: () => import('/@/views/dashboard/operate/utilizationRate/index.vue'),
      name: 'dashboard-operate-utilizationRate',
      meta: {
        title: 'AOI稼动',
      },
    },
    {
      path: '/dashboard/operate/utilizationRate/detail',
      component: () => import('/@/views/dashboard/operate/utilizationRate/detail/index.vue'),
      name: 'dashboard-operate-utilizationRate-detail',
      meta: {
        title: 'AOI稼动详情',
      },
    },
    {
      path: '/dashboard/operate/utilizationRate/infoDetail',
      component: () => import('/@/views/dashboard/operate/utilizationRate/detail/InfoDetails.vue'),
      name: 'dashboard-operate-utilizationRate-infoDetail',
      meta: {
        title: 'AOI稼动明细',
      },
    },
    {
      path: '/dashboard/operate/qualityAudit',
      component: () => import('/@/views/dashboard/operate/qualityAudit/index.vue'),
      name: 'dashboard-operate-qualityAudit',
      meta: {
        title: '品质稽核',
      },
    },
    {
      path: '/dashboard/operate/qualityAudit/detail',
      component: () => import('/@/views/dashboard/operate/qualityAudit/detail/index.vue'),
      name: 'dashboard-operate-qualityAudit-detail',
      meta: {
        title: '品质稽核详情',
      },
    },
    {
      path: '/dashboard/operate/qualityAudit/problemDetail',
      component: () => import('/@/views/dashboard/operate/qualityAudit/detail/problemDetail.vue'),
      name: 'dashboard-operate-qualityAudit-problemDetail',
      meta: {
        title: '稽核问题点明细',
      },
    },
    {
      path: '/dashboard/operate/qualityAudit/fqcDetail',
      component: () => import('/@/views/dashboard/operate/qualityAudit/detail/fqcDetail.vue'),
      name: 'dashboard-operate-qualityAudit-fqcDetail',
      meta: {
        title: 'FQC明细',
      },
    },
    {
      path: '/dashboard/operate/qualityAudit/faiDetail',
      component: () => import('/@/views/dashboard/operate/qualityAudit/detail/faiDetail.vue'),
      name: 'dashboard-operate-qualityAudit-faiDetail',
      meta: {
        title: '首件明细',
      },
    },
    {
      path: '/dashboard/operate/dailyEfficiency',
      component: () => import('/@/views/dashboard/operate/dailyEfficiency/index.vue'),
      name: 'dashboard-operate-dailyEfficiency',
      meta: {
        title: '模切每日效率',
      },
    },
    {
      path: '/dashboard/operate/mqkpi',
      component: () => import('/@/views/dashboard/operate/mqkpi/index.vue'),
      name: 'dashboard-operate-mqkpi',
      meta: {
        title: '模切KPI',
      },
    },
    {
      path: '/dashboard/operate/mqkpi/detail',
      component: () => import('/@/views/dashboard/operate/mqkpi/detail/index.vue'),
      name: 'dashboard-operate-mqkpi-detail',
      meta: {
        title: '模切KPI指标明细',
      },
    },
    {
      path: '/dashboard/operate/profitkpi',
      component: () => import('/@/views/dashboard/operate/profitkpi/index.vue'),
      name: 'dashboard-operate-profitkpi',
      meta: {
        title: '损益KPI',
      },
    },
    {
      path: '/dashboard/operate/profitkpi/detail',
      component: () => import('/@/views/dashboard/operate/profitkpi/detail/index.vue'),
      name: 'dashboard-operate-profitkpi-detail',
      meta: {
        title: '损益KPI指标明细',
      },
    },
    {
      path: '/dashboard/operate/profitkpi/ranking',
      component: () => import('/@/views/dashboard/operate/profitkpi/ranking/index.vue'),
      name: 'dashboard-operate-profitkpi-ranking',
      meta: {
        title: '损益KPI排名',
      },
    },
    {
      path: '/dashboard/operate/profitkpi/manualData',
      component: () => import('/@/views/dashboard/operate/profitkpi/manualData/index.vue'),
      name: 'dashboard-operate-profitkpi-manualData',
      meta: {
        title: '损益-手工数据',
      },
    },
    {
      path: '/dashboard/operate/profit',
      component: () => import('/@/views/dashboard/operate/profit/index.vue'),
      name: 'dashboard-operate-profit',
      meta: {
        title: '损益达成',
      },
    },
    {
      path: '/dashboard/operate/profit/detail',
      component: () => import('/@/views/dashboard/operate/profit/detail/index.vue'),
      name: 'dashboard-operate-profit-detail',
      meta: {
        title: '损益达成',
      },
    },
    {
      path: '/dashboard/operate/mpf/detail',
      component: () => import('/@/views/dashboard/operate/mpf/detail/index.vue'),
      name: 'dashboard-operate-mpf-detail',
      meta: {
        title: '模切绩效',
      },
    },
    {
      path: '/dashboard/operate/biangongDimension/grouping',
      component: () => import('/@/views/dashboard/operate/biangongDimension/grouping/index.vue'),
      name: 'dashboard-operate-biangongDimension-grouping',
      meta: {
        title: '维度分组',
      },
    },
    {
      path: '/dashboard/operate/biangongDimension/ticket',
      component: () => import('/@/views/dashboard/operate/biangongDimension/ticket/index.vue'),
      name: 'dashboard-operate-biangongDimension-ticket',
      meta: {
        title: '工单维度',
      },
    },
    {
      path: '/dashboard/operate/biangongDimension/zj6m',
      component: () => import('/@/views/dashboard/operate/biangongDimension/zj6m/index.vue'),
      name: 'dashboard-operate-biangongDimension-zj6m',
      meta: {
        title: '六码维度',
      },
    },
    {
      path: '/dashboard/operate/oee',
      component: () => import('/@/views/dashboard/operate/oee/index.vue'),
      name: 'dashboard-operate-oee',
      meta: {
        title: 'OEE',
        defaultTitle: 'OEE',
      },
    },
    {
      path: '/dashboard/operate/oee/detail',
      component: () => import('/@/views/dashboard/operate/oee/Detail.vue'),
      name: 'dashboard-operate-oee-detail',
      meta: {
        title: 'OEE详情',
        defaultTitle: 'OEE详情',
      },
    },
    {
      path: '/dashboard/operate/report',
      component: () => import('/@/views/dashboard/operate/report/index.vue'),
      name: 'dashboard-operate-report',
      meta: {
        title: '运营日报',
        defaultTitle: '运营日报',
      },
    },
    {
      path: '/dashboard/operate/ranking',
      component: () => import('/@/views/dashboard/operate/ranking/index.vue'),
      name: 'dashboard-operate-ranking',
      meta: {
        title: '绩效排名',
        defaultTitle: '绩效排名',
      },
    },
    {
      path: '/dashboard/operate/timeUtilizationRate',
      component: () => import('/@/views/dashboard/operate/timeUtilizationRate/index.vue'),
      name: 'dashboard-operate-timeUtilizationRate',
      meta: {
        title: '时间稼动率',
        defaultTitle: '时间稼动率',
      },
    },
    {
      path: '/dashboard/operate/timeUtilizationRate/detail',
      component: () => import('/@/views/dashboard/operate/timeUtilizationRate/detail/index.vue'),
      name: 'dashboard-operate-timeUtilizationRate-detail',
      meta: {
        title: '时间稼动率',
        defaultTitle: '时间稼动率',
      },
    },
    // oee 详情页路由挂载
    ...oeeDetailRoutes,
    {
      path: '/dashboard/production/timeEfficiency',
      component: () => import('/@/views/dashboard/production/timeEfficiency/index.vue'),
      name: 'timeEfficiency',
      meta: {
        title: '时间稼动率',
        defaultTitle: '时间稼动率',
      },
    },
    {
      path: '/dashboard/production/downtimeAnalysis',
      component: () => import('/@/views/dashboard/production/downtimeAnalysis/index.vue'),
      name: 'downtimeAnalysis',
      meta: {
        title: '停机原因分析',
        hideMenu: true,
      },
    },
    {
      path: '/dashboard/production/manualYield',
      component: () => import('/@/views/dashboard/production/manualYield/index.vue'),
      name: 'manualYield',
      meta: {
        title: '手工良率',
        defaultTitle: '手工良率',
      },
    },
    {
      path: '/dashboard/production/oee',
      component: () => import('/@/views/dashboard/production/oee/index.vue'),
      name: 'oee',
      meta: {
        title: 'oee',
        defaultTitle: 'oee',
      },
    },
    {
      path: 'dashboard/production/completionYield',
      component: () => import('/@/views/dashboard/production/completionYield/index.vue'),
      name: 'completionYield',
      meta: {
        title: '结单良率',
        defaultTitle: '结单良率',
      },
    },
    {
      path: '/dashboard/production/temperatureHumidityMonitorEchartShow',
      component: () => import('/@/views/dashboard/production/temperatureHumidityMonitor/components/trendChart.vue'),
      name: 'temperatureHumidityMonitorEchartShow',
      meta: {
        title: 'routes.basic.temperatureHumidityMonitorEchartShow',
        defaultTitle: '温湿度监控中心详情',
      },
    },
    {
      path: '/dashboard/operation/salesRate',
      component: () => import('/@/views/dashboard/operation/salesRate/index.vue'),
      name: 'dashboard-operation-salesRate',
      meta: {
        title: '产销率报表',
        defaultTitle: '产销率报表',
      },
    },
    {
      path: '/dashboard/operation/salesRate/group',
      component: () => import('/@/views/dashboard/operation/salesRate/group/index.vue'),
      name: 'dashboard-operation-salesRate-group',
      meta: {
        title: '产销率报表分组',
        defaultTitle: '产销率报表分组',
      },
    },
    {
      path: '/dashboard/operation/salesRate/detail',
      component: () => import('/@/views/dashboard/operation/salesRate/detail/index.vue'),
      name: 'dashboard-operation-salesRate-detail',
      meta: {
        title: '产销率明细',
        defaultTitle: '产销率明细',
      },
    },
    {
      path: '/dashboard/operation/salesRate/wosTrend',
      component: () => import('/@/views/dashboard/operation/salesRate/wosTrend/index.vue'),
      name: 'dashboard-operation-salesRate-wosTrend',
      meta: {
        title: 'WOS趋势',
        defaultTitle: 'WOS趋势',
      },
    },
    {
      path: '/dashboard/operation/salesRate/wosTrend/detail',
      component: () => import('/@/views/dashboard/operation/salesRate/wosTrend/detail/index.vue'),
      name: 'dashboard-operation-salesRate-wosTrend-detail',
      meta: {
        title: 'WOS趋势明细',
        defaultTitle: 'WOS趋势明细',
      },
    },
    {
      path: '/dashboard/operation/salesRate/fcTrend',
      component: () => import('/@/views/dashboard/operation/salesRate/fcTrend/index.vue'),
      name: 'dashboard-operation-salesRate-fcTrend',
      meta: {
        title: 'FC趋势',
        defaultTitle: 'FC趋势',
      },
    },
    {
      path: '/dashboard/operation/salesRate/fcTrend/detail',
      component: () => import('/@/views/dashboard/operation/salesRate/fcTrend/detail/index.vue'),
      name: 'dashboard-operation-salesRate-fcTrend-detail',
      meta: {
        title: 'FC趋势明细',
        defaultTitle: 'FC趋势明细',
      },
    },
    // MC周报
    {
      path: '/dashboard/operation/mcWeekly',
      component: () => import('/@/views/dashboard/operation/mcWeekly/index.vue'),
      name: 'dashboard-operation-mcWeekly',
      meta: {
        title: 'MC周报',
        defaultTitle: 'MC周报',
      },
    },
    {
      path: '/dashboard/operation/mcWeekly/detail',
      component: () => import('/@/views/dashboard/operation/mcWeekly/detail/index.vue'),
      name: 'dashboard-operation-mcWeekly-detail',
      meta: {
        title: 'MC周报明细',
        defaultTitle: 'MC周报明细',
      },
    },
    {
      path: '/dashboard/operate/manpower',
      component: () => import('/@/views/dashboard/operate/manpower/index.vue'),
      name: 'dashboard-operate-manpower',
      meta: {
        title: '人力',
        defaultTitle: '人力',
      },
    },
    // 人力 - 人均产值排名
    {
      path: '/dashboard/operate/manpower/ranking/percapita',
      component: () => import('/@/views/dashboard/operate/manpower/ranking/percapita/index.vue'),
      name: 'dashboard-operate-manpower-percapita-ranking',
      meta: {
        title: '人均产值排名',
        defaultTitle: '人均产值排名',
      },
    },
    // 人力 - 人均产值详情
    {
      path: '/dashboard/operate/manpower/detail/percapita',
      component: () => import('/@/views/dashboard/operate/manpower/detail/percapita/index.vue'),
      name: 'dashboard-operate-manpower-percapita-detail',
      meta: {
        title: '人均产值详情',
      },
    },
    // 产销汇总
    {
      path: '/dashboard/operate/production/detail',
      component: () => import('/@/views/dashboard/operate/production/detail/index.vue'),
      name: 'dashboard-operate-production-detail',
      meta: {
        title: '产销详情',
        defaultTitle: '产销详情',
      },
    },
    // 模切稼动率
    {
      path: '/dashboard/operate/dieCuttingUtilizationRate',
      component: () => import('/@/views/dashboard/operate/dieCuttingUtilizationRate/index.vue'),
      name: 'dashboard-operate-dieCuttingUtilizationRate',
      meta: {
        title: '模切稼动率',
        defaultTitle: '模切稼动率',
      },
    },
    // 模切稼动率
    {
      path: '/dashboard/operate/dieCuttingUtilizationRate/detail',
      component: () => import('/@/views/dashboard/operate/dieCuttingUtilizationRate/detail/index.vue'),
      name: 'dashboard-operate-dieCuttingUtilizationRate-detail',
      meta: {
        title: '模切稼动率',
        defaultTitle: '模切稼动率',
      },
    },
    // 石墨分析子页面
    {
      path: '/dashboard/operate/multipleAnalysis',
      component: () => import('/@/views/dashboard/operate/graphiteAnalysis/multipleAnalysis.vue'),
      name: 'dashboard-dashboard-operate-graphiteAnalysis-multipleAnalysis',
      meta: {
        title: '自定义因子分析',
        defaultTitle: '自定义因子分析',
      },
    },
    {
      path: '/dashboard/operate/reportForm',
      component: () => import('/@/views/dashboard/operate/graphiteAnalysis/reportForm.vue'),
      name: 'dashboard-dashboard-operate-graphiteAnalysis-reportForm',
      meta: {
        title: 'SN明细数据',
        defaultTitle: 'SN明细数据',
      },
    },
  ],
};

export const BusinessRoute: AppRouteRecordRaw = {
  path: '/business',
  name: 'businessRoute',
  component: LAYOUT,
  redirect: '/business/quota',
  meta: {
    title: '商务',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'business/quantitation/requirement',
      component: () => import('../../views/business/quantitation/requirement/index.vue'),
      name: 'business-quantitation-requirement',
      meta: {
        title: '',
        defaultTitle: '量式需求',
      },
    },
    {
      path: 'business/quantitation/assess',
      component: () => import('/@/views/business/quantitation/assess/index.vue'),
      name: 'business-quantitation-assess',
      meta: {
        title: '',
        defaultTitle: '量式评审',
      },
    },
    {
      path: 'business/basicInformation/project',
      name: 'project',
      component: () => import('/@/views/business/basicInformation/project/index.vue'),
      meta: {
        defaultTitle: '项目信息',
        title: '项目信息',
      },
    },
  ],
};
// Basic routing without permission
// 未经许可的基本路由
export const SystemRoute: AppRouteRecordRaw = {
  path: '/basicData',
  name: 'basicDataRoute',
  component: LAYOUT,
  redirect: '/home',
  meta: {
    title: 'basicDataRoute',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    // {
    //   path: 'basicData/encodingSettings',
    //   component: () => import('/@/views/basicData/encodingSettings/index.vue'),
    //   name: 'encodingSettings',
    //   meta: {
    //     title: '编码配置',
    //     defaultTitle: '编码配置',
    //   },
    // },
    // {
    //   path: 'basicData/productCodeApply',
    //   component: () => import('/@/views/basicData/productCodeApply/index.vue'),
    //   name: 'product-code-apply',
    //   meta: {
    //     title: '成品编码申请表',
    //     defaultTitle: '成品编码申请表',
    //   },
    // },
    // {
    //   path: '/basicData/BatchApplication',
    //   name: 'batchApplication',
    //   component: () => import('/@/views/basicData/productCodeApply/BatchApplication/index.vue'),
    //   meta: {
    //     defaultTitle: '成品编码批量上传',
    //     title: '成品编码批量上传',
    //   },
    // },
    //
    // {
    //   path: '/basicData/productionInformation/unit',
    //   name: 'unit',
    //   component: () => import('/@/views/basicData/productionInformation/unit/index.vue'),
    //   meta: {
    //     defaultTitle: '计量单位',
    //     title: '计量单位',
    //   },
    // },
    //
    // {
    //   path: '/basicData/productionInformation/currency',
    //   name: 'currency',
    //   component: () => import('/@/views/basicData/productionInformation/currency/index.vue'),
    //   meta: {
    //     defaultTitle: '币别',
    //     title: '币别',
    //   },
    // },
    // {
    //   path: '/basicData/productionInformation/exchangeRate',
    //   name: 'exchangeRate',
    //   component: () => import('/@/views/basicData/productionInformation/exchangeRate/index.vue'),
    //   meta: {
    //     defaultTitle: '汇率',
    //     title: '汇率',
    //   },
    // },
    // {
    //   path: '/basicData/productionInformation/harhor',
    //   name: 'harhor',
    //   component: () => import('/@/views/basicData/productionInformation/harhor/index.vue'),
    //   meta: {
    //     defaultTitle: '口岸',
    //     title: '口岸',
    //   },
    // },
    // {
    //   path: '/basicData/productionInformation/productLine',
    //   name: 'productLine',
    //   component: () => import('/@/views/basicData/productionInformation/productLine/index.vue'),
    //   meta: {
    //     defaultTitle: '产品线',
    //     title: '产品线',
    //   },
    // },
  ],
};

//设备联机
export const EquipmentRoute: AppRouteRecordRaw = {
  path: '/equipment',
  name: 'equipmentRoute',
  component: LAYOUT,
  redirect: '/home',
  meta: {
    title: '设备联机',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'equipment/cloudMeasure',
      name: 'cloudMeasure',
      component: () => import('/@/views/equipment/cloudMeasure/index.vue'),
      meta: {
        defaultTitle: '云测量',
        title: '云测量',
      },
    },
  ],
};

export const extendRoute: AppRouteRecordRaw = {
  path: '/extend',
  name: 'extend',
  component: LAYOUT,
  redirect: '/extend/tableDemo/vxeTable',
  meta: {
    title: '示例',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '/extend/tableDemo/vxeTable',
      name: 'vxeTable',
      component: () => import('/@/views/extend/tableDemo/vxeTable/index.vue'),
      meta: {
        defaultTitle: 'vxeTable',
        title: 'vxeTable',
      },
    },
    {
      path: '/extend/tableDemo/vxeGrid',
      name: 'vxeGrid',
      component: () => import('/@/views/extend/tableDemo/vxeTable/vxeGrid.vue'),
      meta: {
        defaultTitle: 'vxeGrid',
        title: 'vxeGrid',
      },
    },
  ],
};

export const ScreenDevicesActivationRoute: AppRouteRecordRaw = {
  path: '/screen/devices/activation',
  name: 'screenDevicesActivation',
  component: () => import('/@/views/screen/devices/activation/index.vue'),
  meta: {
    title: '设备稼动率-大屏',
  },
};

/**
 * Basic routing without permission
 * 未经许可的基本路由
 * 配置后可不配置系统应用菜单就可访问页面
 * 存在问题：当路由写到本地时，页面中权限按钮配合v-auth时，因本地路由不存在modelId，会导致无法显示，慎用
 */
export const basicRoutes = [
  LoginRoute,
  FormShortLinkRoute,
  PCCDetailPreviewRoute,
  ...ipqcDashboardRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  COMMON_ROUTE,
  FCMetricRoute,
  DashboardRoute,
  DashboardLargeRoute,
  DashboardLargeRateRoute,
  SystemRoute,
  BusinessRoute,
  EquipmentRoute,
  extendRoute,
  ScreenDevicesActivationRoute,
  ...WriteSignatureRoute,
  HRRoute,
  SalesRoute,
  FinancialRoute,
  OperationRoute,
  ScreenRoute,
  PMTDataRoute,
  humanMachineRoute,
];
