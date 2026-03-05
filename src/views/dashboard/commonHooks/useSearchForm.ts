/*
数据报表通用的搜索表单，搭配/@/views/dashboard/operate/components/SearchForm/index组件使用
*/

import { reactive, ref, watch } from 'vue';
import { SearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
import dayjs from 'dayjs';
import { useDebounceFn } from '@vueuse/core';
import { isEmpty } from 'lodash-es';

interface IParams {
  isAutoSearch?: boolean; // 开启自动查询，默认关闭
  defaultSearchFormValue?: Partial<SearchFormValueType>;
  getParams?: () => Record<string, any>;
  searchApi?: (...arg: any) => Promise<any>;
  beforeSearch?: () => void; // 请求前方法
  afterSearch?: (resData: any) => void; // 搜索结果处理
}

const SUBTRACT_NUM = 7; // 默认日期范围选择的间隔
export function useSearchForm(params: IParams = {}) {
  const { defaultSearchFormValue = {}, isAutoSearch = false, getParams = () => ({}), afterSearch = () => {}, beforeSearch = () => {} } = params;
  const { date: defaultDate = dayjs().tz().subtract(1, 'day') } = defaultSearchFormValue;

  const loading = ref<boolean>(false); // 请求加载
  const isEmptyData = ref<boolean>(false); // 数据为空
  const isRequestError = ref<boolean>(false); // 接口异常
  const searchFormValue = reactive<SearchFormValueType>({
    orgCode: 'MQ',
    date: defaultDate,
    timeDimension: TimeDimension.DAY,
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
          startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
          endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
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

  // 获取日期 dateDim 的查询条件（统一返回startDim && endDim
  const getDateDimParamsAllDim = () => {
    const { timeDimension, dateRange } = searchFormValue;
    let [startDate = dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate).tz()] = dateRange || [];
    let query = {
      startDim: startDate.format('YYYY-MM-DD'),
      endDim: endDate.format('YYYY-MM-DD'),
    };
    switch (timeDimension) {
      case TimeDimension.WEEK:
        query = {
          startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
          endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
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
        break;
    }
    return query;
  };

  // 获取日期 dateDim 的查询条件
  const getDateDimParamsByDate = () => {
    const { timeDimension, date } = searchFormValue;
    let query = {
      startDim: date.format('YYYY-MM-DD'),
      endDim: date.format('YYYY-MM-DD'),
    };
    switch (timeDimension) {
      case TimeDimension.WEEK:
        query = {
          startDim: `${date.endOf('week').year()}WK${date.week().toString().padStart(2, '0')}`,
          endDim: `${date.endOf('week').year()}WK${date.week().toString().padStart(2, '0')}`,
        };
        break;
      case TimeDimension.MONTH:
        query = {
          startDim: date.format('YYYY-MM'),
          endDim: date.format('YYYY-MM'),
        };
        break;
      case TimeDimension.QUARTER:
        query = {
          startDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
          endDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
        };
        break;
      case TimeDimension.YEAR:
        query = {
          startDim: date.format('YYYY'),
          endDim: date.format('YYYY'),
        };
        break;
      default:
        break;
    }
    return query;
  };

  // 自动查询封装
  const handleSearch = async () => {
    // 获取组织架构列表
    beforeSearch();
    loading.value = true;
    isRequestError.value = false;
    isEmptyData.value = false;
    let requestParams = getParams();
    params?.searchApi &&
      params
        .searchApi(requestParams)
        .then(res => {
          const { data } = res;
          isEmptyData.value = isEmpty(data);
          loading.value = false;
          afterSearch(data);
        })
        .catch(() => {
          isRequestError.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
  };

  // 开启自动查询
  const handleSearchDebounce = useDebounceFn(handleSearch, 500);
  if (isAutoSearch) {
    watch(
      () => searchFormValue,
      () => {
        if (!searchFormValue.orgCode) return;
        handleSearchDebounce();
      },
      { deep: true, immediate: true },
    );
  }

  return {
    loading,
    isEmptyData,
    isRequestError,
    searchFormValue,
    getConditionParam,
    getDateDimParams,
    getDateDimParamsAllDim,
    getDateDimParamsByDate,
    handleSearchDebounce,
  };
}
