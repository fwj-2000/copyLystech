// 仅提供给边贡维度报表页面使用（慎用
import { computed, nextTick, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useSearchForm } from '/@/hooks/web/useSearchForm';
import { DefaultSearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
import { BasicColumn, PaginationProps, useTable } from '/@/components/Table';
import { getDimensionSearchparameter } from '/@/api/dashbord/report';
import { allColumnsOptions, baseColumnsOption, searchConditionMap } from '/@/views/dashboard/operate/biangongDimension/config';
import { cloneDeep, isEmpty, merge } from 'lodash-es';
import { ISaveExcelParams, saveTableDatasToExcel } from '/@/utils/file/download';

// hook 参数
interface IParams {
  defaultDate: Dayjs; // 默认日期
  defaultSearchFormValue: DefaultSearchFormValueType; // 默认搜索条件
  columnsOptions?: BasicColumn[]; // 表格列
  withoutPagination?: boolean; // 接口是否分页
  getColumns?: (data: any) => BasicColumn[]; // 获取表头配置信息
  setTableData?: (data: any) => any; // 设置表格数据
  getExportParams?: (columns: BasicColumn[], res: any) => ISaveExcelParams; // 导出excel
  api: (...arg: any) => Promise<any>;
  exportApi?: (...arg: any) => Promise<any>;
}

export function useSearchTable(params: IParams) {
  const { defaultSearchFormValue, defaultDate = dayjs().tz().subtract(1, 'day'), columnsOptions = [], withoutPagination = false, api, exportApi } = params;

  const columns = ref<BasicColumn[]>([]); // 表头配置
  const searchParamOptionsList = ref<any[]>([]); // 搜索条件配置列表
  const paginationInfo = ref<PaginationProps>({
    current: 1,
    pageSize: 50,
    total: 0,
    pageSizeOptions: ['50', '100', '500', '1000'],
  });
  const exportLoading = ref(false);
  // 导出excel
  const getTableList = async () => {
    if (withoutPagination) {
      return getDataSource();
    }
    const requestApi = exportApi ? exportApi : api;
    const { data = [] } = await requestApi(getSearchInfo()).catch(() => ({ data: [] }));
    return data;
  };

  // 导出当页数据
  const exportToExcel = async () => {
    exportLoading.value = true;
    const data = await getTableList();
    if (isEmpty(data)) {
      exportLoading.value = false;
      return;
    }
    const exportParams = {
      columns: columns.value,
      tableList: data?.list || [],
      fileName: '维度报表',
      isCustomRender: false,
      isRowSpan: false,
      ...(params.getExportParams ? params.getExportParams(columns.value, data) : {}),
    };
    saveTableDatasToExcel(exportParams);
    exportLoading.value = false;
  };

  // 全选
  const handleSelectAll = option => {
    const { options, selectAll = false, props = '' } = option;
    if (selectAll) {
      searchFormValue[props] = [];
    } else {
      searchFormValue[props] = options.map(item => item.id);
    }
    option.selectAll = !selectAll;
  };

  // 获取排序及合并配置
  const getColumnsConfig = ({ sortable = false, isRowSpan = false, dataIndex, data }) => ({
    ...(sortable
      ? {
          sorter: (a, b) => {
            const aValue = Number.parseFloat(a[dataIndex]) || 0;
            const bValue = Number.parseFloat(b[dataIndex]) || 0;
            return aValue - bValue;
          },
        }
      : {}),
    ...(isRowSpan
      ? {
          customCell: (_, index) => {
            const list = getComputeRowSpans(data, dataIndex);
            return { rowSpan: list[index || 0], colSpan: getComputeColSpans(data, index, dataIndex) };
          },
        }
      : {}),
  });
  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    return columnsOptions
      .map(item => {
        return merge(cloneDeep({ baseInfo: baseColumnsOption }), allColumnsOptions[item.dataIndex as string] || {}, item);
      })
      .map(item => {
        const { isRowSpan = false, sortable = false, baseInfo, dataIndex } = item;
        return {
          dataIndex,
          ...baseInfo,
          ...item,
          ...getColumnsConfig({ data, dataIndex, isRowSpan, sortable }),
        };
      }) as BasicColumn[];
  };
  const setTableData = dataSource => {
    const getColumnsMth = params.getColumns || getColumns;
    columns.value = getColumnsMth(dataSource);

    if (params.setTableData) {
      return params.setTableData(dataSource);
    }
    return dataSource;
  };
  // 获取搜索条件
  const getSearchInfo = () => {
    const { timeDimension, orgCode = '' } = searchFormValue;
    const { startDim, endDim } = getTrendQueryParams();
    let orgCodeParams: {
      orgCode?: string;
      bu?: string;
    } = {
      orgCode: '',
      bu: '',
    };
    if (orgCode === 'MQ') {
      orgCodeParams['orgCode'] = '';
    } else if (orgCode.length < 9) {
      orgCodeParams['bu'] = searchFormValue.orgCode;
    } else {
      orgCodeParams['orgCode'] = searchFormValue.orgCode;
    }
    return {
      ...Object.values(searchConditionMap).reduce((pre, cur) => {
        const item = searchParamOptionsList.value.find(item => item.props === cur.props);
        if (!item) {
          return searchFormValue[cur.props]
            ? {
                ...pre,
                [cur.props]: searchFormValue[cur.props].join(';'),
              }
            : pre;
        }
        return {
          ...pre,
          [cur.props]: searchFormValue[cur.props].map(idx => item.options[idx]?.fullName || '').join(';'),
        };
      }, {}),
      ...orgCodeParams,
      isBian: searchFormValue.isBian,
      dimension: timeDimension,
      startDim,
      endDim,
    };
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
    return spans;
  };

  // 计算行合并信息
  const getComputeColSpans = (data, index, dataIndex) => {
    const colSpans = 1;
    if (dataIndex === 'category') {
      if (data[index].category === data[index].metric) {
        return 2;
      }
    }
    if (dataIndex === 'metric') {
      if (data[index].category === data[index].metric) {
        return 0;
      }
    }
    return colSpans;
  };

  // 注冊搜索条件
  const { searchFormValue, getTrendQueryParams } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    isAotoSearch: false,
    defaultSearchFormValue,
  });

  const searchInfo = computed(() => {
    return getSearchInfo();
  });

  // 获取查询参数信息
  const getDimensionSearchparameterInfo = params => {
    return getDimensionSearchparameter(params).then(({ data }) => {
      searchParamOptionsList.value = Object.keys(data).map(key => ({
        options: data[key].map((item, idx) => ({
          id: idx,
          fullName: item,
        })),
        ...searchConditionMap[key],
      }));
    });
  };

  // 注册表格hook
  const [registerTable, { reload, getDataSource, redoHeight }] = useTable({
    api,
    columns,
    pagination: paginationInfo,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    immediate: true,
    searchInfo,
    afterFetch: setTableData,
  });

  watch(
    [() => searchFormValue.orgCode, () => searchFormValue.dateRange, () => searchFormValue.isBian],
    () => {
      if (!searchFormValue.orgCode) return;
      let sbu = searchInfo.value.orgCode;
      if (sbu === '' || sbu === undefined) {
        sbu = searchInfo.value.bu;
      }
      getDimensionSearchparameterInfo({
        sbu: sbu,
        startDim: searchInfo.value.startDim,
        endDim: searchInfo.value.endDim,
        dimension: TimeDimension.WEEK,
        isBian: searchFormValue.isBian,
      });
    },
    { deep: true, immediate: true },
  );

  return {
    searchInfo,
    searchFormValue,
    searchParamOptionsList,
    exportLoading,
    redoHeight,
    registerTable,
    reload,
    exportToExcel,
    getDataSource,
    getComputeRowSpans,
    getComputeColSpans,
    handleSelectAll,
    getTrendQueryParams,
  };
}
