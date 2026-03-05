// 数据大屏
import type { AppRouteRecordRaw } from '/@/router/types';

// FC数据指标
export const ScreenRoute: AppRouteRecordRaw = {
  path: '/screen/production',
  name: 'screen-production',
  redirect: '/screen/production/outputAndUtilizationRate',
  meta: {
    title: '财经数据',
  },
  children: [
    {
      path: '/screen/production/outputAndUtilizationRate',
      component: () => import('/@/views/screen/production/outputAndUtilizationRate/index.vue'),
      name: 'screen-production-outputAndUtilizationRate',
      meta: {
        title: '数据可视化大屏',
        defaultTitle: '数据可视化大屏',
      },
    },
  ],
};
