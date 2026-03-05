// 财经数据
import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

// 运营数据指标
export const OperationRoute: AppRouteRecordRaw = {
  path: '/dataAnalysis/operation',
  name: 'dataAnalysis-operation',
  component: LAYOUT,
  meta: {
    title: '运营数据',
  },
  children: [
    {
      path: '/dataAnalysis/operation/metricsCenter',
      name: 'dataAnalysis-operation-metricsCenter',
      meta: {
        title: '运营指标中心',
      },
      children: [
        {
          path: '/dataAnalysis/operation/metricsCenter/detail/outputPerCapita',
          name: 'dataAnalysis-operation-metricsCenter-detail-outputPerCapita',
          component: () => import('/@/views/dataAnalysis/operation/metricsCenter/detail/outputPerCapita/index.vue'),
          meta: {
            title: '人线比明细',
          },
        },
      ],
    },
    {
      path: '/dataAnalysis/operation/dailyReport',
      component: () => import('/@/views/dataAnalysis/operation/dailyReport/index.vue'),
      name: 'dataAnalysis-operation-dailyReport',
      meta: {
        title: '运营日报',
      },
    },
  ],
};
