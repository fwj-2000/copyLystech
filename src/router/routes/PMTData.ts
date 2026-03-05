import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

/**
 * @description PMT信息管理报表
 */
export const PMTDataRoute: AppRouteRecordRaw = {
  path: '/business/PMTData/share',
  name: 'business-PMTData-share',
  component: LAYOUT,
  meta: { title: 'PMT信息管理报表明细' },
  children: [
    /** PMT信息管理报表 - 分享页面 */
    {
      path: '',
      component: () => import('/@/views/business/PMTData/share/index.vue'),
      name: 'business-PMTData-share',
      meta: {
        title: 'routes.business-PMTData',
        defaultTitle: `PMT信息管理报表`,
      },
    },

    /** 详情页面 */
    {
      path: '/business/PMTData/detail/:rowType',
      component: () => import('/@/views/business/PMTData/detail/index.vue'),
      name: 'business-PMTData-detail',
      meta: {
        title: 'dict.PMTData.detailPage',
        defaultTitle: `PMT信息管理报表明细`,
      },
    },
  ],
};
