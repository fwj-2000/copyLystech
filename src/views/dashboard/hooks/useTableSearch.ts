// 搜索驱动表格
import { Ref, reactive, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';

import { SearchFormValueType, DefaultSearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { BasicColumn, FetchSetting, PaginationProps, useTable } from '/@/components/Table';
import { IColumnOptions } from '../types';
import { useBaseTable } from './useBaseTable';

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
  tableRef?: Ref<Nullable<HTMLElement>>;
  columnsOptions: IColumnOptions[];
  defaultDate?: Dayjs;
  showPeriodDimension?: boolean;
  isTrendData?: boolean;
  isRangePicker?: boolean;
  isPagination?: boolean;
  requestHasPagination?: boolean;
  isAutoSearch?: boolean; // 开启自动查询，默认开启
  defaultSearchFormValue?: DefaultSearchFormValueType;
  fetchSetting?: Partial<FetchSetting>;
  colorGroupProps?: string; // 按照字段颜色间隔分组
  isGapColor?: boolean; // 开启颜色间隔分组
  getParams?: () => Record<string, any>;
  searchApi?: (...arg: any) => Promise<any>;
  afterSearch?: (resData: Record<string, any>) => void; // 搜索结果处理
}
export function useTableSearch(params: IParams) {
  const loading = ref<boolean>(false);
  const isEmptyData = ref<boolean>(false);
  const isRequestError = ref<boolean>(false);
  const dataSource = ref<any[]>([]);
  const columns = ref<BasicColumn[]>([]);
  const route = useRoute();
  const { query: routeQuery = {} } = route;
  const { startDate: defaultStartDate = dayjs().tz().subtract(4, 'week'), endDate: defaultEndDate = dayjs().tz().add(4, 'week') } = routeQuery as Record<
    string,
    any
  >;
  const defaultDateRange: [Dayjs, Dayjs] = [dayjs(defaultStartDate).tz(), dayjs(defaultEndDate).tz()];
  const routeSearchFormValue = {
    ...routeQuery,
    dateRange: defaultDateRange,
  };

  // 默认搜索结果处理
  const defaultAfterSearch = resData => {
    let { list = [] } = resData;
    if (isPagination && requestHasPagination) {
      list = resData.list.list;
      const { pagination } = resData.list;
      paginationInfo.value.total = pagination.total;
    } else {
      paginationInfo.value.total = list.length;
    }
    setPagination(paginationInfo.value);
    isEmptyData.value = isEmpty(list);
    if (isEmptyData.value) {
      dataSource.value = [];
      return;
    }
    const dataList = list.map(item => {
      return {
        ...item,
        ...((item.vlist &&
          item.vlist.reduce(
            (pre, cur) => ({
              ...pre,
              [cur.dateS]: cur.valueS,
            }),
            {},
          )) ||
          {}),
      };
    });
    columns.value = getColumns(dataList);
    dataSource.value = dataList;
  };

  const {
    tableRef,
    columnsOptions = [],
    isAutoSearch = true,
    isRangePicker = false,
    isPagination = true,
    requestHasPagination = true,
    colorGroupProps = 'orgcode',
    defaultDate = dayjs().tz().subtract(1, 'day'),
    defaultSearchFormValue = {},
    getParams = () => ({}),
    afterSearch = defaultAfterSearch,
  } = params;

  const searchFormValue = reactive<SearchFormValueType>({
    date: dayjs(params.defaultDate).tz(),
    period: PeriodEnum.ALL,
    orgCode: '',
    timeDimension: TimeDimension.DAY,
    ...routeSearchFormValue,
    ...defaultSearchFormValue,
  });
  const paginationInfo: Ref<PaginationProps> = ref({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ['100', '500', '1000'],
  });

  const { getColumns, getConditionParam, getDateDimParams, getDateDimParamsByDate } = useBaseTable({
    tableRef,
    columnsOptions,
    isRangePicker,
    searchFormValue,
    defaultDate,
    defaultSearchFormValue,
    colorGroupProps,
  });

  // 查询数据
  const handleSearch = async () => {
    // 获取组织架构列表
    loading.value = true;
    isRequestError.value = false;
    isEmptyData.value = false;
    let requestParams = getParams();
    if (isPagination) {
      requestParams = {
        ...requestParams,
        currentPage: paginationInfo.value.current,
        pageSize: paginationInfo.value.pageSize,
      };
    }
    params?.searchApi &&
      params
        .searchApi(requestParams)
        .then(res => {
          const { data } = res;
          isEmptyData.value = isEmpty(data);
          afterSearch(data);
        })
        .catch(() => {
          isRequestError.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
  };

  // 注册表格hook
  const [registerTable, { setPagination }] = useTable({
    dataSource,
    columns,
    pagination: isPagination ? paginationInfo.value : isPagination,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: true,
    bordered: true,
    striped: true,
    resizeHeightOffset: 24,
    onChange: (pagination, __, ___, { currentDataSource }) => {
      if (isPagination && requestHasPagination) {
        paginationInfo.value.current = pagination.current;
        paginationInfo.value.pageSize = pagination.pageSize;
        handleSearch();
        return;
      }
      const { current, pageSize } = pagination;
      // 计算起始索引，根据当前页码和每页数量来确定
      const startIndex = (current - 1) * pageSize;
      // 计算结束索引
      const endIndex = startIndex + pageSize;
      columns.value = getColumns(currentDataSource.slice(startIndex, endIndex));
    },
  });

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
    dataSource,
    columns,
    registerTable,
    handleSearch,
    getConditionParam,
    getDateDimParams,
    getDateDimParamsByDate,
    handleSearchDebounce,
  };
}
