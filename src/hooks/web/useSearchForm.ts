import { reactive, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
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
export type SearchReqMth = (queryParams: QueryParams, searchFormValue: SearchFormValueType) => Promise<any>;

interface SearchFormHookParams {
  defaultDate?: Dayjs;
  showPeriodDimension?: boolean;
  isTrendData?: boolean;
  isRangePicker?: boolean;
  isAotoSearch?: boolean; // 开启自动查询，默认开启
  defaultSearchFormValue?: DefaultSearchFormValueType;
  searchReqMth?: SearchReqMth;
}
export function useSearchForm(params: SearchFormHookParams) {
  const { isAotoSearch = true, defaultDate = dayjs() } = params;
  const loading = ref(false);
  const isEmptyData = ref(false);
  const isRequestError = ref(false);

  const SUBTRACT_NUM = 6;
  const searchFormValue = reactive<SearchFormValueType>({
    date: dayjs(defaultDate),
    dateRange: [dayjs(defaultDate).subtract(SUBTRACT_NUM, 'day'), dayjs(defaultDate)],
    timeDimension: TimeDimension.DAY,
    period: PeriodEnum.ALL,
    orgCode: '',
    ...params?.defaultSearchFormValue,
  });
  console.log('searchFormValue: ', searchFormValue);

  // 查询数据
  const handleSearch = async () => {
    const { timeDimension } = searchFormValue;
    // 获取组织架构列表
    loading.value = true;
    isRequestError.value = false;
    isEmptyData.value = false;
    const query = params.isTrendData ? getTrendQueryParams() : getIndexQueryParams();
    if (params?.searchReqMth) {
      params
        .searchReqMth(
          {
            ...searchFormValue, // 加入form表单查询的参数
            dimension: timeDimension,
            ...query,
          },
          searchFormValue,
        )
        .then(res => {
          const { data } = res;
          isEmptyData.value = isEmpty(data);
          if (data.list) {
            isEmptyData.value = isEmpty(data.list);
          }
        })
        .catch(() => {
          isRequestError.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };
  // 获取季度
  const getQuarter = date => {
    const month = dayjs(date).month();
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
  // 获取首页的查询条件
  const getIndexQueryParams = () => {
    const { timeDimension, date = dayjs() } = searchFormValue;
    switch (timeDimension) {
      case TimeDimension.DAY:
        return {
          condition: date.unix() * 1000,
        };
      case TimeDimension.WEEK:
        return {
          condition: `${date.endOf('week').year()}WK${date.endOf('week').week().toString().padStart(2, '0')}`,
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

  // 获取趋势页的查询条件
  const getTrendQueryParams = () => {
    const { timeDimension, date, dateRange } = searchFormValue;
    let [startDate = dayjs(defaultDate).subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate)] = dateRange || [];
    if (!params.isRangePicker) {
      startDate = date.subtract(SUBTRACT_NUM, 'day');
      endDate = date;
    }
    let query = {
      startDim: `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`,
      endDim: `${endDate.year()}WK${endDate.week().toString().padStart(2, '0')}`,
      startTime: startDate.unix() * 1000,
      endTime: endDate.unix() * 1000,
    };
    switch (timeDimension) {
      case TimeDimension.WEEK:
        query.startDim = `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`;
        query.endDim = `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`;
        break;
      case TimeDimension.MONTH:
        query.startDim = startDate.format('YYYY-MM');
        query.endDim = endDate.format('YYYY-MM');
        break;
      case TimeDimension.QUARTER:
        query.startDim = `${startDate.format('YYYY')}Q${getQuarter(startDate)}`;
        query.endDim = `${endDate.format('YYYY')}Q${getQuarter(endDate)}`;
        break;
      case TimeDimension.YEAR:
        query.startDim = startDate.format('YYYY');
        query.endDim = endDate.format('YYYY');
        break;
      default:
        query.startTime = startDate.unix() * 1000;
        query.endTime = endDate.unix() * 1000;
        break;
    }
    return query;
  };

  const handleSearchDebounce = useDebounceFn(handleSearch, 500);
  if (isAotoSearch) {
    // 条件修改自动查询
    watch(
      () => searchFormValue,
      () => {
        if (isEmpty(searchFormValue.orgCode)) return;
        handleSearchDebounce();
      },
      { deep: true, immediate: true },
    );
  }

  return { loading, isRequestError, isEmptyData, searchFormValue, handleSearch, getIndexQueryParams, getTrendQueryParams };
}
