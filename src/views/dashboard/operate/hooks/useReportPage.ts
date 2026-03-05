import { Ref, ref, unref } from 'vue';
import { BasicColumn, useTable } from '/@/components/Table';
import { isEmpty, uniq } from 'lodash-es';
import { useSearchForm } from '/@/hooks/web/useSearchForm';
import dayjs from 'dayjs';
import { isFunction } from '/@/utils/is';
import { SearchFormValueType, DefaultSearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';

// 表头动态配置类型
export enum ColumnsType {
  NORAML = 'noraml',
  DATE_VALUE_LIST = 'dateValueList', // 动态生成的数据列表
}

// 表格项插槽类型
export enum ETableCellSlotType {
  LINK = 'link',
}

interface IRouteQueryParams {
  dataIndex: string;
  record: any;
  searchFormValue: SearchFormValueType;
}

interface IBaseInfo extends BasicColumn {
  type?: ETableCellSlotType; // 表格项插槽类型
  path?: string; // 路由跳转路径
  cssStyle?: string; // 额外的css样式
  getHasAnalysis?: (record: any) => boolean; // 是否有daily分析浮窗
  getIsLink?: (record: any, searchFormValue: SearchFormValueType) => boolean; // 根据管理模块管理是否可跳转
  getRouteInfo?: (query: IRouteQueryParams) => {}; // 获取点击跳转路由参数方法
}

// 表头动态配置项
export interface ColumnsOption {
  type?: ColumnsType; // 类型
  baseInfo?: IBaseInfo;
  dataIndex: string;
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
}

// hook 参数
interface HookParams {
  pathInfo?: {
    path: string; // 趋势页路由
    infoPath: string; // 详情页路由
  };
  defaultSearchFormValue?: DefaultSearchFormValueType;
  columnsOptions: ColumnsOption[];
  requestMth: (queryParams: any, searchFormValue: SearchFormValueType) => Promise<any>;
  afterMth?: (res: any) => void;
}

export function useReportPage(params: HookParams) {
  // 表头配置
  const columns: Ref<BasicColumn[]> = ref([]);

  const dataSource = ref([]);

  const { columnsOptions, defaultSearchFormValue, requestMth, afterMth } = params;

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
    return spans;
  };

  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    return columnsOptions.reduce((pre, cur) => {
      const { type = ColumnsType.NORAML, filterable = false, isRowSpan = false, sortable = false, baseInfo, dataIndex } = cur;
      if (type === ColumnsType.NORAML) {
        return [
          ...pre,
          {
            dataIndex,
            ...baseInfo,
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
                  customCell: (_, index) => {
                    const list = getComputeRowSpans(data, dataIndex);
                    return { rowSpan: list[index || 0] };
                  },
                }
              : {}),
          },
        ];
      } else if (type === ColumnsType.DATE_VALUE_LIST) {
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
                  ...baseInfo,
                  sorter: (a, b) => {
                    const aValue = Number.parseFloat(a[item.dateS]) || 0;
                    const bValue = Number.parseFloat(b[item.dateS]) || 0;
                    return aValue - bValue;
                  },
                  sortDirections: ['descend', 'ascend'],
                },
              ],
            })),
          ];
        }
        return [
          ...pre,
          ...dataList.map(item => ({
            title: searchFormValue.timeDimension === TimeDimension.WEEK ? item.dateS.slice(4) : item.dateS, // 周数据表头去掉年份
            dataIndex: item.dateS,
            align: 'right',
            width: '94px',
            ...baseInfo,
            sorter: (a, b) => {
              const aValue = Number.parseFloat(a[item.dateS]) || 0;
              const bValue = Number.parseFloat(b[item.dateS]) || 0;
              return aValue - bValue;
            },
            sortDirections: ['descend', 'ascend'],
          })),
        ];
      }
      return pre;
    }, []) as BasicColumn[];
  };

  // 处理接口数据，设置表格数据
  const setTableData = (queryParams, searchFormValue) => {
    return new Promise((resolve, reject) => {
      requestMth(queryParams, searchFormValue)
        .then(res => {
          const {
            data: { list },
          } = res;
          resolve(res);
          if (isEmpty(list)) return;
          const dataList = list.map(item => {
            return {
              ...item,
              ...item.vlist.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.dateS]: cur.valueS,
                }),
                {},
              ),
            };
          });
          columns.value = getColumns(dataList);
          if (afterMth && isFunction(afterMth)) {
            afterMth(res);
          }
          // 后台返回字段可能不全，额外处理下
          dataSource.value = dataList.map(item => {
            return {
              ...unref(columns).reduce((pre, cur) => {
                const key = cur?.children ? (cur?.children[0]?.dataIndex as string) : (cur.dataIndex as string);
                return {
                  ...pre,
                  [key]: item[key as string] || '',
                };
              }, {}),
              ...item,
            };
          });
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };

  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isTrendData: true,
    isRangePicker: true,
    showPeriodDimension: true,
    defaultSearchFormValue,
    searchReqMth: setTableData,
  });

  // 注册表格hook
  const [registerTable] = useTable({
    columns,
    dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    onChange: (_, __, ___, { currentDataSource }) => {
      columns.value = getColumns(currentDataSource);
    },
  });

  return {
    columns,
    dataSource,
    searchFormValue,
    loading,
    isRequestError,
    isEmptyData,
    registerTable,
  };
}
