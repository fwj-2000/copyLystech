import { Ref, computed, reactive, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { isEmpty } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';

import { SearchFormValueType, DefaultSearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { BasicColumn, PaginationProps, useTable } from '/@/components/Table';

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
  columns: BasicColumn[];
  defaultDate: Dayjs;
  showPeriodDimension?: boolean;
  isTrendData?: boolean;
  isRangePicker?: boolean;
  isPagination?: boolean;
  isAotoSearch?: boolean; // 开启自动查询，默认开启
  defaultSearchFormValue?: DefaultSearchFormValueType;
  getParams?: () => Record<string, any>;
  searchApi: (...arg: any) => Promise<any>;
}
export function useSearchFormTable(params: IParams) {
  const { columns = [], isAotoSearch = true, isPagination = true, getParams = () => ({}) } = params;
  const loading = ref(false);
  const isEmptyData = ref(false);
  const isRequestError = ref(false);

  const SUBTRACT_NUM = 6;
  const searchFormValue = reactive<SearchFormValueType>({
    date: dayjs(params.defaultDate),
    dateRange: [dayjs(params.defaultDate).subtract(SUBTRACT_NUM, 'day'), dayjs(params.defaultDate)],
    timeDimension: TimeDimension.DAY,
    period: PeriodEnum.ALL,
    orgCode: '',
    ...params?.defaultSearchFormValue,
  });
  const paginationInfo: Ref<PaginationProps> = ref({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ['100', '500', '1000'],
  });

  // 查询数据
  const handleSearch = async () => {
    // 获取组织架构列表
    loading.value = true;
    isRequestError.value = false;
    isEmptyData.value = false;
    const requestParams = getParams();
    params
      .searchApi(requestParams)
      .then(res => {
        const {
          data: { list },
        } = res;
        isEmptyData.value = isEmpty(list);
      })
      .catch(() => {
        isRequestError.value = true;
      })
      .finally(() => {
        loading.value = false;
      });
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
    const { timeDimension, date, dateRange } = searchFormValue;
    let query = {};
    let [startDate = dayjs(params.defaultDate).subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(params.defaultDate)] = dateRange || [];
    if (!params.isRangePicker) {
      startDate = date.subtract(SUBTRACT_NUM, 'day');
      endDate = date;
    }
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

  const searchInfo = computed(() => {
    const searchInfo = getParams();
    return searchInfo;
  });
  // 注册表格hook
  const [registerTable, { reload }] = useTable({
    api: params.searchApi,
    searchInfo,
    columns,
    pagination: isPagination && paginationInfo,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: true,
    bordered: true,
    striped: true,
    resizeHeightOffset: 24,
    fetchSetting: isPagination
      ? {
          listField: 'list.list',
          totalField: 'list.pagination.total',
        }
      : {},
    immediate: false,
  });

  // 条件修改自动查询
  const handleSearchDebounce = useDebounceFn(reload, 500);
  if (isAotoSearch) {
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
    registerTable,
    handleSearch,
    getConditionParam,
    getDateDimParams,
  };
}
