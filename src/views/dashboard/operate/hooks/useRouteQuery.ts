// 将路由参数赋予默认值
import dayjs from 'dayjs';
import { omit } from 'lodash-es';
import { useRoute } from 'vue-router';

export function useRouteQuery() {
  const route = useRoute();
  const routeQuery = route.query as Record<string, string>;
  const defaultQuery: Record<string, any> = {
    ...omit(routeQuery, ['startDate', 'endDate']),
  };
  if (routeQuery?.startDate && routeQuery?.endDate) {
    defaultQuery['dateRange'] = [dayjs(routeQuery?.startDate).tz(), dayjs(routeQuery?.endDate).tz()];
    defaultQuery['date'] = dayjs(routeQuery?.endDate).tz();
  }
  if (routeQuery?.date) {
    defaultQuery['date'] = dayjs(routeQuery?.date).tz();
  }
  return {
    routeQuery: defaultQuery,
  };
}
