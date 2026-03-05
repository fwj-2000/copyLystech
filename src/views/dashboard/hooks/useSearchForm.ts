import { reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { SearchFormValueType, DefaultSearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { isEmpty } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';

dayjs.extend(weekOfYear);

export interface QueryParams {
  dimension: TimeDimension;
  condition?: number | string; // 11位时间戳
  startTime?: number | string; // 11位时间戳
  endTime?: number | string; // 11位时间戳
  startDim?: string;
  endDim?: string;
  period?: PeriodEnum;
  orgCode?: string;
}

interface IParams {
  isAutoSearch?: boolean; // 开启自动查询，默认关闭
  defaultSearchFormValue?: DefaultSearchFormValueType;
  getParams?: () => Record<string, any>;
  searchApi?: (...arg: any) => Promise<any>;
}
export function useSearchForm(params: IParams = {}) {
  const { isAutoSearch = false, defaultSearchFormValue = {}, getParams = () => ({}) } = params;
  const { date: defaultDate = dayjs().subtract(1, 'day') } = defaultSearchFormValue;
  const SUBTRACT_NUM = 6;
  const loading = ref(false);
  const isEmptyData = ref(false);
  const isRequestError = ref(false);
  const searchFormValue = reactive<SearchFormValueType>({
    date: dayjs(defaultDate).tz(),
    dateRange: [dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), dayjs(defaultDate).tz()],
    timeDimension: TimeDimension.DAY,
    period: PeriodEnum.ALL,
    orgCode: '',
    ...params?.defaultSearchFormValue,
  });

  // 获取季度
  const getQuarter = date => {
    const month = dayjs(date).tz().month();
    if (month >= 0 && month <= 2) {
      return 1;
    } else if (month >= 3 && month <= 5) {
      return 2;
    } else if (month >= 6 && month <= 8) {
      return 3;
    } else {
      return 4;
    }
  };
  // 获取单个时间 condition 查询条件
  const getConditionParam = () => {
    const { timeDimension, date } = searchFormValue;
    switch (timeDimension) {
      case TimeDimension.DAY:
        return {
          condition: date.unix() * 1000,
        };
      case TimeDimension.WEEK:
        return {
          condition: `${date.year()}WK${date.week().toString().padStart(2, '0')}`,
        };
      case TimeDimension.MONTH:
        return {
          condition: date.format('YYYY-MM'),
        };
      case TimeDimension.QUARTER:
        return {
          condition: `${date.format('YYYY')}Q${getQuarter(date)}`,
        };
      case TimeDimension.YEAR:
        return {
          condition: date.format('YYYY'),
        };
      default:
        return {};
    }
  };

  // 获取日期 dateDim 的查询条件
  const getDateDimParams = () => {
    const { timeDimension, dateRange } = searchFormValue;
    let query = {};
    let [startDate = dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate).tz()] = dateRange || [];
    switch (timeDimension) {
      case TimeDimension.WEEK:
        query = {
          startDim: `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`,
          endDim: `${endDate.year()}WK${endDate.week().toString().padStart(2, '0')}`,
        };
        break;
      case TimeDimension.MONTH:
        query = {
          startDim: startDate.format('YYYY-MM'),
          endDim: endDate.format('YYYY-MM'),
        };
        break;
      case TimeDimension.QUARTER:
        query = {
          startDim: `${startDate.format('YYYY')}Q${getQuarter(startDate)}`,
          endDim: `${endDate.format('YYYY')}Q${getQuarter(endDate)}`,
        };
        break;
      case TimeDimension.YEAR:
        query = {
          startDim: startDate.format('YYYY'),
          endDim: endDate.format('YYYY'),
        };
        break;
      default:
        query = {
          startTime: startDate.unix() * 1000,
          endTime: endDate.unix() * 1000,
        };
        break;
    }
    return query;
  };

  // 查询数据
  const handleSearch = async () => {
    if (!params?.searchApi) return;
    // 获取组织架构列表
    loading.value = true;
    isRequestError.value = false;
    isEmptyData.value = false;
    const requestParams = getParams();
    params
      ?.searchApi(requestParams)
      .then(res => {
        const { data } = res;
        isEmptyData.value = isEmpty(data);
      })
      .catch(() => {
        isRequestError.value = true;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 条件修改自动查询
  const handleSearchDebounce = useDebounceFn(handleSearch, 500);
  if (isAutoSearch) {
    watch(
      () => searchFormValue,
      () => {
        handleSearchDebounce();
      },
      { deep: true, immediate: true },
    );
  }

  return {
    loading,
    isRequestError,
    isEmptyData,
    searchFormValue,
    getConditionParam,
    getDateDimParams,
  };
}
