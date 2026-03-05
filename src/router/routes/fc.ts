import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// FC数据指标
export const FCMetricRoute: AppRouteRecordRaw = {
  path: '/dashboard/customerService',
  name: 'dashboard-customerService',
  component: LAYOUT,
  redirect: '/dashboard/customerService/metricsCenter',
  children: [
    {
      path: '/dashboard/customerService/forecastTable',
      component: () => import('/@/views/dashboard/customerService/metricsCenter/forecastTable.vue'),
      name: 'dashboard-customerService-forecastTable',
      meta: {
        title: 'FC预报表',
        defaultTitle: 'FC预报表',
      },
    },
    {
      path: '/dashboard/customerService/metricsCenter',
      component: () => import('/@/views/dashboard/customerService/metricsCenter/index.vue'),
      name: 'dashboard-customerService-metricsCenter',
      meta: {
        title: 'FC数据指标',
        defaultTitle: 'FC数据指标',
      },
    },
    {
      path: '/dashboard/customerService/weeklyAnalysis',
      component: () => import('/@/views/dashboard/customerService/weeklyAnalysis/index.vue'),
      name: 'dashboard-customerService-weeklyAnalysis',
      meta: {
        title: 'FC当周分析',
        defaultTitle: 'FC当周分析',
      },
    },
    {
      path: '/dashboard/customerService/scrollComparison',
      component: () => import('/@/views/dashboard/customerService/scrollComparison/index.vue'),
      name: 'dashboard-customerService-scrollComparison',
      meta: {
        title: 'FC滚动对比明细',
        defaultTitle: 'FC滚动对比明细',
      },
    },
    {
      path: '/dashboard/customerService/scrollComparison/trend',
      component: () => import('/@/views/dashboard/customerService/scrollComparison/trend/index.vue'),
      name: 'dashboard-customerService-scrollComparison-trend',
      meta: {
        title: 'FC滚动对比趋势',
        defaultTitle: 'FC滚动对比趋势',
      },
    },
    {
      path: '/dashboard/customerService/tradingMode',
      component: () => import('/@/views/dashboard/customerService/tradingMode/index.vue'),
      name: 'dashboard-customerService-tradingMode',
      meta: {
        title: 'FC交易模式明细',
        defaultTitle: 'FC交易模式明细',
      },
    },
    {
      path: '/dashboard/customerService/forecastDemand',
      component: () => import('/@/views/dashboard/customerService/forecastDemand/index.vue'),
      name: 'dashboard-customerService-forecastDemand',
      meta: {
        title: '预测需求明细',
        defaultTitle: '预测需求明细',
      },
    },
    {
      path: '/dashboard/customerService/productCategory',
      component: () => import('/@/views/dashboard/customerService/productCategory/index.vue'),
      name: 'dashboard-customerService-productCategory',
      meta: {
        title: '产品类别明细',
        defaultTitle: '产品类别明细',
      },
    },
    {
      path: '/dashboard/customerService/project',
      component: () => import('/@/views/dashboard/customerService/project/index.vue'),
      name: 'dashboard-customerService-project',
      meta: {
        title: '项目明细',
        defaultTitle: '项目明细',
      },
    },
    {
      path: '/dashboard/customerService/accuracy/trend',
      component: () => import('/@/views/dashboard/customerService/accuracy/trend/index.vue'),
      name: 'dashboard-customerService-accuracy-trend',
      meta: {
        title: 'FC准确率整体分布',
        defaultTitle: 'FC准确率整体分布',
      },
    },
    {
      path: '/dashboard/customerService/accuracy/customer',
      component: () => import('/@/views/dashboard/customerService/accuracy/customer/index.vue'),
      name: 'dashboard-customerService-accuracy-customer',
      meta: {
        title: 'FC准确率客服',
        defaultTitle: 'FC准确率客服',
      },
    },
    {
      path: '/dashboard/customerService/accuracy/client',
      component: () => import('/@/views/dashboard/customerService/accuracy/client/index.vue'),
      name: 'dashboard-customerService-accuracy-client',
      meta: {
        title: 'FC准确率客户',
        defaultTitle: 'FC准确率客户',
      },
    },
    {
      path: '/dashboard/customerService/marginDistribution/amount',
      component: () => import('/@/views/dashboard/customerService/marginDistribution/amount/index.vue'),
      name: 'dashboard-customerService-marginDistribution-amount',
      meta: {
        title: '厂区金额分布',
        defaultTitle: '厂区金额分布',
      },
    },
    {
      path: '/dashboard/customerService/marginDistribution/quantity',
      component: () => import('/@/views/dashboard/customerService/marginDistribution/quantity/index.vue'),
      name: 'dashboard-customerService-marginDistribution-quantity',
      meta: {
        title: '厂区数量分布',
        defaultTitle: '厂区数量分布',
      },
    },
    {
      path: '/dashboard/customerService/projectPhase',
      component: () => import('/@/views/dashboard/customerService/projectPhase/index.vue'),
      name: 'dashboard-customerService-projectPhase',
      meta: {
        title: 'FC项目阶段&客户明细',
        defaultTitle: 'FC项目阶段客户明细',
      },
    },
    {
      path: '/dashboard/customerService/partNumber',
      component: () => import('/@/views/dashboard/customerService/partNumber/index.vue'),
      name: 'dashboard-customerService-partNumber',
      meta: {
        title: '终端客户料号',
        defaultTitle: '终端客户料号',
      },
    },
  ],
};
