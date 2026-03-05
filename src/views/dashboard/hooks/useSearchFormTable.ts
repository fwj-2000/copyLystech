import { Ref, computed, reactive, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useRoute } from 'vue-router';
import { isEmpty, uniq } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';

import { SearchFormValueType, DefaultSearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { BasicColumn, FetchSetting, PaginationProps, useTable } from '/@/components/Table';
import { EColumnsType, IColumnOptions } from '../types';

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
  defaultDate: Dayjs;
  showPeriodDimension?: boolean;
  isTrendData?: boolean;
  isRangePicker?: boolean;
  isPagination?: boolean;
  isAutoSearch?: boolean; // 开启自动查询，默认开启
  defaultSearchFormValue?: DefaultSearchFormValueType;
  fetchSetting?: Partial<FetchSetting>;
  colorGroupProps?: string; // 按照字段颜色间隔分组
  isGapColor?: boolean; // 开启颜色间隔分组
  getParams?: () => Record<string, any>;
  searchApi: (...arg: any) => Promise<any>;
}
export function useSearchFormTable(params: IParams) {
  const {
    tableRef,
    columnsOptions = [],
    isAutoSearch = true,
    isPagination = true,
    colorGroupProps = 'orgcode',
    defaultSearchFormValue = {},
    getParams = () => ({}),
  } = params;

  const route = useRoute();
  const { query: routeQuery = {} } = route;
  const { startDate: defaultStartDate = dayjs().tz().subtract(4, 'week'), endDate: defaultEndDate = dayjs().tz().subtract(1, 'week') } = routeQuery as Record<
    string,
    any
  >;
  const defaultDateRange: [Dayjs, Dayjs] = [dayjs(defaultStartDate).tz(), dayjs(defaultEndDate).tz()];
  const routeSearchFormValue = {
    ...routeQuery,
    dateRange: defaultDateRange,
  };

  const loading = ref(false);
  const isEmptyData = ref(false);
  const isRequestError = ref(false);
  const columns = ref<BasicColumn[]>([]);

  const SUBTRACT_NUM = 6;
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

  // 计算的宽度
  const getColumnWidth = columns => {
    const columnWidth = columns.reduce((pre, cur) => {
      const borderWidth = 2.5;
      return pre + Number.parseInt(cur.width || 60, 10) + borderWidth;
    }, 0);
    return columnWidth;
  };
  // 获取筛选选项信息
  const getFilterOptions = (data: any, dataIndex: string) => {
    return uniq(data.map(item => item[dataIndex])).map(item => ({
      text: item,
      value: item,
    }));
  };

  // 计算合并信息
  const getComputeRowSpans = (data, dataIndex) => {
    const spans = data.map(() => 1); // 初始化每行的 rowSpan 为 1
    let currentIdx = 0;
    let startIdx = 0;
    while (currentIdx < data.length - 1) {
      if (data[currentIdx][dataIndex] === data[currentIdx + 1][dataIndex]) {
        spans[startIdx] += 1;
        spans[currentIdx + 1] = 0; // 被合并的行不需要显示
      } else {
        startIdx = currentIdx + 1;
      }
      currentIdx++;
    }
    console.log('spans: ', spans);
    return spans;
  };

  // 计算背景颜色
  const getBgColorMth = () => {
    let idx = 0;
    const colors = ['#fff', 'rgba(250, 173, 20, 0.2)'];
    let lastcategory = '';
    return category => {
      if (lastcategory !== category) {
        idx += 1;
      }
      lastcategory = category;
      return colors[idx % 2];
    };
  };

  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    const getBgColor = getBgColorMth(); // 定义背景色
    const columns = columnsOptions.reduce((pre, cur) => {
      const { type = EColumnsType.NORAML, filterable = false, isRowSpan = false, sortable = false, hideBG = false, rowSpanProps = '' } = cur;
      const dataIndex = cur.dataIndex as string;
      const getStyle = record =>
        hideBG
          ? {
              background: '#fff',
            }
          : {
              background: getBgColor(record[colorGroupProps]),
            };
      if (type === EColumnsType.NORAML) {
        return [
          ...pre,
          {
            ...cur,
            ...(sortable
              ? {
                  sorter: (a, b) => {
                    const aValue = Number.parseFloat(a[dataIndex]) || 0;
                    const bValue = Number.parseFloat(b[dataIndex]) || 0;
                    return aValue - bValue;
                  },
                }
              : {}),
            ...(filterable
              ? {
                  filters: getFilterOptions(data, dataIndex),
                  onFilter: (value: string, record: any) => record[dataIndex] === value,
                }
              : {}),
            ...(isRowSpan
              ? {
                  customCell: (record, index) => {
                    const list = getComputeRowSpans(data, rowSpanProps || dataIndex);
                    return {
                      rowSpan: list[index || 0],
                      style: getStyle(record),
                    };
                  },
                }
              : {
                  customCell: record => {
                    return {
                      style: getStyle(record),
                    };
                  },
                }),
          },
        ];
      } else if (type === EColumnsType.DATE_VALUE_LIST) {
        // 特殊字段处理，每天的数据项
        const dataList = data[0][dataIndex] || [];
        if (searchFormValue.timeDimension === TimeDimension.DAY) {
          return [
            ...pre,
            ...dataList.map(item => ({
              title: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayjs(item.dateS).tz().day()],
              width: '74px',
              children: [
                {
                  title: dayjs(item.dateS).tz().format('MM-DD'),
                  dataIndex: item.dateS,
                  align: 'right',
                  width: '74px',
                  ...cur,
                  sorter: (a, b) => {
                    const aValue = Number.parseFloat(a[item.dateS]) || 0;
                    const bValue = Number.parseFloat(b[item.dateS]) || 0;
                    return aValue - bValue;
                  },
                  sortDirections: ['descend', 'ascend'],
                  customCell: record => {
                    return {
                      style: getStyle(record),
                    };
                  },
                },
              ],
            })),
          ];
        }
        return [
          ...pre,
          ...dataList.map(item => ({
            ...cur,
            title: searchFormValue.timeDimension === TimeDimension.WEEK ? item.dateS.slice(4) : item.dateS, // 周数据表头去掉年份
            dataIndex: item.dateS,
            align: 'right',
            sorter: (a, b) => {
              const aValue = Number.parseFloat(a[item.dateS]) || 0;
              const bValue = Number.parseFloat(b[item.dateS]) || 0;
              return aValue - bValue;
            },
            sortDirections: ['descend', 'ascend'],
            customCell: record => {
              return {
                style: getStyle(record),
              };
            },
          })),
        ];
      }
      return pre;
    }, []) as BasicColumn[];
    if (tableRef?.value) {
      const columnWidth = getColumnWidth(columns);
      const scrollWidth = 17;
      const tableWidth = tableRef?.value?.offsetWidth || 0;
      return columns.concat(columnWidth < tableWidth ? [{ dataIndex: 'block', width: tableWidth - columnWidth - scrollWidth }] : []);
    }
    return columns;
  };

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
    const { timeDimension, date, dateRange } = searchFormValue;
    let query = {};
    let [startDate = dayjs(params.defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(params.defaultDate).tz()] = dateRange || [];
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

  // 获取表格fetchSetting
  const getFetchSetting = (): Partial<FetchSetting> => {
    const setting =
      params?.fetchSetting ||
      (isPagination
        ? {
            listField: 'list.list',
            totalField: 'list.pagination.total',
          }
        : {});
    return setting;
  };

  // 查询条件
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
    fetchSetting: getFetchSetting(),
    onChange: (_, __, ___, { currentDataSource }) => {
      columns.value = getColumns(currentDataSource);
    },
    afterFetch: data => {
      const dataList = data.map(item => {
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
      paginationInfo.value.total = dataList.length;
      return dataList;
    },
    immediate: !isAutoSearch,
  });

  // 条件修改自动查询
  const handleSearchDebounce = useDebounceFn(reload, 500);
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
    registerTable,
    handleSearch,
    getConditionParam,
    getDateDimParams,
    handleSearchDebounce,
  };
}
