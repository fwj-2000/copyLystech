import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// 产销率
export const SalesRoute: AppRouteRecordRaw = {
  path: '/dashboard/operation',
  name: 'dashboard-operation',
  component: LAYOUT,
  redirect: '/dashboard/operation/productionAndSalesRate/weekly',
  children: [
    {
      path: '/dashboard/operation/productionAndSalesRate/weekly',
      component: () => import('/@/views/dashboard/operation/productionAndSalesRate/weekly/index.vue'),
      name: 'dashboard-operation-productionAndSalesRate-weekly',
      meta: {
        title: '产销率周报',
        defaultTitle: '产销率周报',
      },
    },
    {
      path: '/dashboard/operation/productionAndSalesRate/group',
      component: () => import('/@/views/dashboard/operation/productionAndSalesRate/group/index.vue'),
      name: 'dashboard-operation-productionAndSalesRate-group',
      meta: {
        title: '产销率报表新旧分组',
        defaultTitle: '产销率报表新旧分组',
      },
    },
    {
      path: '/dashboard/operation/productionAndSalesRate/group/detail',
      component: () => import('/@/views/dashboard/operation/productionAndSalesRate/group/detail/index.vue'),
      name: 'dashboard-operation-productionAndSalesRate-group-detail',
      meta: {
        title: '产销率项目明细',
        defaultTitle: '产销率项目明细',
      },
    },
    {
      path: '/dashboard/operation/productionAndSalesRate/detail',
      component: () => import('/@/views/dashboard/operation/productionAndSalesRate/detail/index.vue'),
      name: 'dashboard-operation-productionAndSalesRate-detail',
      meta: {
        title: '产销率明细',
        defaultTitle: '产销率明细',
      },
    },
  ],
};
