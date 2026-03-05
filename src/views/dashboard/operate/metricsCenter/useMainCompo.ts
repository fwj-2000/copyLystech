import { Ref, onMounted, ref, unref, watch } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGo } from '/@/hooks/web/usePage';
import { isEmpty } from 'lodash-es';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

import { SearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { isFunction } from '/@/utils/is';

dayjs.extend(weekOfYear);

export interface QueryParams extends Record<string, any> {
  dimension?: TimeDimension;
  condition?: number | string; // 11位时间戳
  startTime: number | string; // 11位时间戳
  endTime: number | string; // 11位时间戳
  startDim?: string;
  endDim?: string;
  period?: PeriodEnum;
  orgCode: string;
}
type ReqMth = (queryParams: QueryParams) => Promise<any>;
type InitDataMth = (
  queryParams: QueryParams,
  extra: {
    t: any;
    isEmptyData: Ref<Boolean>;
  },
) => Promise<any>;

interface PropsInfo {
  element?: any;
  queryInfo: SearchFormValueType;
}

interface MainCompoParams {
  props: PropsInfo;
  showCondition?: Boolean; // todo: 增加类型
  defaultExtraParams?: Record<string, any>; // 额外的参数
  reqMth: ReqMth; // 接口api
  initData: InitDataMth; // 初始化图表数据
  getParams?: (searchFormValue: SearchFormValueType) => {}; // 初始化图表数据
}
export function useMainCompo(params: MainCompoParams) {
  const { props, reqMth, initData, getParams } = params;
  const { element, queryInfo } = props;

  const go = useGo();
  const { t } = useI18n();

  const isEmptyData = ref(true);
  const loading = ref(false);
  const extraParams = ref(params?.defaultExtraParams || {});

  // 获取请求参数
  const getRequestParams = () => {
    loading.value = true;
    if (getParams && isFunction(getParams)) {
      return getParams(queryInfo);
    }
    const { orgCode = '', date = dayjs().tz().subtract(1, 'day') } = queryInfo;
    if (!orgCode) {
      return;
    }
    const query = {
      startTime: date.unix() * 1000,
      endTime: date.unix() * 1000,
      orgCode,
    };
    const queryParams = params.showCondition
      ? {
          orgCode,
          condition: `${date.year()}WK${date.week().toString().padStart(2, '0')}`,
        }
      : query;
    return {
      ...unref(extraParams),
      ...queryParams,
    };
  };

  // 请求接口拉取图表数据
  const requestData = async () => {
    reqMth({
      ...getRequestParams(),
    } as QueryParams)
      .then(res => {
        const { data = {} } = res;
        isEmptyData.value = isEmpty(data);
        if (!isEmptyData.value) {
          initData(data, {
            t,
            isEmptyData,
          });
        }
      })
      .catch(() => {
        isEmptyData.value = true;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  // 初始拉取数据
  onMounted(() => {
    if (!element) {
      requestData();
      return;
    }
    if (!isEmpty(element.values)) {
      // 从缓存提取数据
      initData(element.values, {
        t,
        isEmptyData,
      });
    } else if (!isEmpty(element)) {
      requestData();
    }
  });

  // 监听查询条件变化
  watch(
    () => [props.queryInfo, extraParams],
    () => {
      // 拉取数据
      requestData();
    },
    { deep: true, immediate: false },
  );

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const { orgCode = '', date = dayjs().tz().subtract(1, 'day'), timeDimension = 'day' } = props.queryInfo;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };

  // 打开新标签页(路由参数完全控制)
  const goPageCustom = (path, params = {}) => {
    if (!path) return;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams(params)}`;
    go(url);
  };

  return {
    isEmptyData,
    loading,
    queryInfo,
    extraParams,
    goPage,
    goPageCustom,
    t,
  };
}
