// 人机比数据
import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// 人机比数据
export const humanMachineRoute: AppRouteRecordRaw = {
  path: '/dashboard/operate/humanMachine/detail',
  name: 'dashboard-operate-humanMachine-detail',
  component: LAYOUT,
  meta: {
    title: '人机比',
  },
  children: [
    {
      path: '/dashboard/operate/humanMachine/detail/chanzhi',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/chanzhi/index.vue'),
      name: 'dashboard-operate-humanMachine-chanzhi',
      meta: {
        title: '产值明细',
        defaultTitle: '产值明细',
      },
    },
    {
      path: '/dashboard/operate/humanMachine/detail/kaijilv',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/kaijilv/index.vue'),
      name: 'dashboard-operate-humanMachine-kaijilv',
      meta: {
        title: '开机率明细',
        defaultTitle: '开机率明细',
      },
    },
    {
      path: '/dashboard/operate/humanMachine/detail/chuqing',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/chuqing/index.vue'),
      name: 'dashboard-operate-humanMachine-chuqing',
      meta: {
        title: '人力出勤明细',
        defaultTitle: '人力出勤明细',
      },
    },
    {
      path: '/dashboard/operate/humanMachine/detail/moqie',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/moqie/index.vue'),
      name: 'dashboard-operate-humanMachine-moqie',
      meta: {
        title: '操作类明细',
        defaultTitle: '操作类明细',
      },
    },
    {
      path: '/dashboard/operate/humanMachine/detail/jianjie',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/jianjie/index.vue'),
      name: 'dashboard-operate-humanMachine-jianjie',
      meta: {
        title: '辅助类明细',
        defaultTitle: '辅助类明细',
      },
    },
    {
      path: '/dashboard/operate/humanMachine/detail/guochengzhibiao',
      component: () => import('/@/views/dashboard/operate/humanMachine/detail/guochengzhibiao/index.vue'),
      name: 'dashboard-operate-humanMachine-guochengzhibiao',
      meta: {
        title: '过程指标明细',
        defaultTitle: '过程指标明细',
      },
    },
  ],
};
