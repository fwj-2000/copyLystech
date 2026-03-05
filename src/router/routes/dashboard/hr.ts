import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// 人力报表
export const HRRoute: AppRouteRecordRaw = {
  path: '/dashboard/humanResources',
  name: 'dashboard-humanResources',
  component: LAYOUT,
  redirect: '/dashboard/humanResources/turnoverRate',
  children: [
    {
      path: '/dashboard/humanResources/turnoverRate',
      component: () => import('/@/views/dashboard/humanResources/turnoverRate/index.vue'),
      name: 'dashboard-humanResources-turnoverRate',
      meta: {
        title: '离职率分析',
        defaultTitle: '离职率分析',
      },
    },
    {
      path: '/dashboard/humanResources/turnoverCycle',
      component: () => import('/@/views/dashboard/humanResources/turnoverCycle/index.vue'),
      name: 'dashboard-humanResources-turnoverCycle',
      meta: {
        title: '离职周期分析',
        defaultTitle: '离职周期分析',
      },
    },
  ],
};
