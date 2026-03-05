// 运营指标平铺页 hook 封装
import { ref, provide } from 'vue';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useRoute } from 'vue-router';
import { useI18n } from '/@/hooks/web/useI18n';
import { useSearchForm } from '/@/hooks/web/useSearchForm';
import { TimeDimension } from '/@/views/dashboard/operate/types';
import { isFunction } from '/@/utils/is';

dayjs.extend(weekOfYear);

export type RequestMth = (queryParams: any) => Promise<any>;

interface DetailPageHookParams {
  requestMth: RequestMth;
  defaultSearchFormValue?: Record<string, any>;
  getOrgCodeParams?: (searchFormValue) => {};
  getParams?: (searchFormValue) => {};
  getFullParams?: (searchFormValue) => {};
  formatData?: (data) => any;
}
export function useTilePage(params: DetailPageHookParams) {
  const defaultGetParams = _ => ({});
  const { requestMth, getParams = defaultGetParams, getOrgCodeParams = () => ({}), formatData = data => data, defaultSearchFormValue = {} } = params;

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  provide('getExtraParams', () => {
    return getParams(searchFormValue);
  });

  dayjs.extend(weekOfYear);
  const route = useRoute();
  const { t } = useI18n();

  const { query: routeQuery } = route;
  const orgCode = (routeQuery?.orgCode || '') as string;
  const timeDimension = (routeQuery?.dimension || '') as TimeDimension;
  const defaultDate = dayjs((routeQuery?.date as string) || dayjs().tz().subtract(1, 'day').format('YYYY-MM-DD'));
  const listData = ref([]);

  // 设置页面数据
  const setPageDataMth = (queryParams, searchFormValue) => {
    let apiParams = {
      ...queryParams,
      orgCode: searchFormValue.orgCode,
      ...(searchFormValue.timeDimension !== TimeDimension.DAY ? { period: searchFormValue.period } : {}),
      ...getOrgCodeParams(searchFormValue),
      ...getParams(searchFormValue),
    };
    if (isFunction(params?.getFullParams)) {
      apiParams = params?.getFullParams(searchFormValue);
    }
    return new Promise((resolve, reject) => {
      requestMth(apiParams)
        .then(res => {
          const { data } = res;
          let list = data;
          if (data.list) {
            list = data.list;
          }
          listData.value = formatData(list);
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  };

  // 使用维度搜索hooks
  const { searchFormValue, loading, isRequestError, isEmptyData, getIndexQueryParams } = useSearchForm({
    defaultDate,
    defaultSearchFormValue: {
      orgCode,
      ...defaultSearchFormValue,
      ...(timeDimension ? { timeDimension } : {}),
    },
    searchReqMth: setPageDataMth,
  });

  return { searchFormValue, listData, loading, isRequestError, isEmptyData, getIndexQueryParams, t };
}
