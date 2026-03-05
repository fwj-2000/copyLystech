// 财经数据
import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// FC数据指标
export const FinancialRoute: AppRouteRecordRaw = {
  path: '/dashboard/financial',
  name: 'dashboard-financial',
  component: LAYOUT,
  redirect: '/dashboard/financial/inventory',
  meta: {
    title: '财经数据',
  },
  children: [
    {
      path: '/dashboard/financial/inventory',
      component: () => import('/@/views/dashboard/financial/inventory/index.vue'),
      name: 'dashboard-financial-inventory',
      meta: {
        title: '库存在制报表',
        defaultTitle: '库存在制报表',
      },
    },
    {
      path: '/dashboard/financial/inventory/binLocation',
      component: () => import('/@/views/dashboard/financial/inventory/binLocation/index.vue'),
      name: 'dashboard-financial-inventory-binLocation',
      meta: {
        title: '库位报表',
        defaultTitle: '库位报表',
      },
    },
    {
      path: '/dataAnalysis/financial/inventory/report/lineChart',
      component: () => import('/@/views/dataAnalysis/financial/inventory/report/lineChart/index.vue'),
      name: 'dataAnalysis-financial-inventory-report-lineChart',
      meta: {
        title: '库存在制报表折线图',
      },
    },
    {
      path: '/dataAnalysis/financial/biangong/causeAnalysis',
      component: () => import('/@/views/dataAnalysis/financial/biangong/causeAnalysis/index.vue'),
      name: 'dataAnalysis-financial-biangong-causeAnalysis',
      meta: {
        title: '原因分析',
        defaultTitle: '原因分析',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/detail',
      component: () => import('/@/views/dataAnalysis/financial/profit/detail/index.vue'),
      name: 'dataAnalysis-financial-profit-detail',
      meta: {
        title: '损益指标明细',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/manualData',
      component: () => import('/@/views/dataAnalysis/financial/profit/manualData/index.vue'),
      name: 'dataAnalysis-financial-profit-manualData',
      meta: {
        title: '损益-手工数据',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zfi019nl',
      component: () => import('/@/views/dataAnalysis/financial/profit/zfi019nl/index.vue'),
      name: 'dataAnalysis-financial-profit-zfi019nl',
      meta: {
        title: '损益-zfi019nl',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zfi008',
      component: () => import('/@/views/dataAnalysis/financial/profit/zfi008/index.vue'),
      name: 'dataAnalysis-financial-profit-zfi008',
      meta: {
        title: '损益-zfi008',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zfi080c',
      component: () => import('/@/views/dataAnalysis/financial/profit/zfi080c/index.vue'),
      name: 'dataAnalysis-financial-profit-zfi080c',
      meta: {
        title: '损益-zfi080c',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zmm010i',
      component: () => import('/@/views/dataAnalysis/financial/profit/zmm010i/index.vue'),
      name: 'dataAnalysis-financial-profit-zmm010i',
      meta: {
        title: '损益-zmm010i',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zmm023',
      component: () => import('/@/views/dataAnalysis/financial/profit/zmm023/index.vue'),
      name: 'dataAnalysis-financial-profit-zmm023',
      meta: {
        title: '损益-zmm023',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/zif168',
      component: () => import('/@/views/dataAnalysis/financial/profit/zif168/index.vue'),
      name: 'dataAnalysis-financial-profit-zif168',
      meta: {
        title: '损益-zif168',
      },
    },
    {
      path: '/dataAnalysis/financial/mqkpi/detail',
      component: () => import('/@/views/dataAnalysis/financial/mqkpi/detail/index.vue'),
      name: 'dataAnalysis-financial-mqkpi-detail',
      meta: {
        title: '模切KPI明细',
      },
    },
    {
      path: '/dataAnalysis/financial/expense/rank',
      component: () => import('/@/views/dataAnalysis/financial/expense/rank/index.vue'),
      name: 'dataAnalysis-financial-expense-rank',
      meta: {
        title: '费用排名',
      },
    },
    {
      path: '/dataAnalysis/financial/profit/weeklyDetail/detail',
      component: () => import('/@/views/dataAnalysis/financial/profit/weeklyDetail/components/detail/index.vue'),
      name: 'dataAnalysis-financial-profit-weeklyDetail-detail',
      meta: {
        title: '明细',
      },
    },
    {
      path: '/dataAnalysis/financial/expense/fareTargetPage/detail',
      component: () => import('/@/views/dataAnalysis/financial/expense/fareTargetPage/detail/index.vue'),
      name: 'dataAnalysis-financial-expense-fareTargetPage-detail',
      meta: {
        title: '对策导入',
      },
    },
    {
      path: '/dataAnalysis/financial/inventory/manage/process/detail',
      component: () => import('/@/views/dataAnalysis/financial/inventory/manage/process/detail/index.vue'),
      name: 'dataAnalysis-financial-inventory-manage-process-detail',
      meta: {
        title: '制程不良明细',
      },
    },
    {
      path: '/dataAnalysis/personnel/budget',
      component: () => import('/@/views/dataAnalysis/personnel/budget/index.vue'),
      name: 'dataAnalysis-personnel-budget',
      meta: {
        title: '开发页面',
      },
    },
  ],
};
