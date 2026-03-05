import { defHttp } from '/@/utils/http/axios';
/**
 * 获取列表
 * @param data { factoryCode?: string; shippingSpace?: string }
 * shippingSpace： 支持code和name的模糊查询
 * */
export function getShipList(data: { factoryCode?: string; shippingSpace?: string }) {
  return defHttp.get({
    url: '/api/basedata/ShippingSpace/List',
    data,
  });
}
