// 提取通用的表格组件方法hooks
import { uniq } from 'lodash-es';
import { BasicColumn } from '/@/components/Table';
import { DefaultSearchFormValueType, TimeDimension } from '../operate/types';
import dayjs, { Dayjs } from 'dayjs';
import { Ref } from 'vue';
import { EColumnsType, IColumnOptions } from '../types';

interface IParams {
  tableRef?: Ref<Nullable<HTMLElement>>;
  columnsOptions: IColumnOptions[];
  defaultDate?: Dayjs;
  isRangePicker?: boolean;
  searchFormValue?: Record<string, any>; // 开启自动查询，默认开启
  defaultSearchFormValue?: DefaultSearchFormValueType;
  colorGroupProps?: string; // 按照字段颜色间隔分组
}
export function useBaseTable(params: IParams) {
  const SUBTRACT_NUM = 6; // 默认当前时间减值
  const { tableRef, columnsOptions = [], colorGroupProps = 'orgcode', searchFormValue = {} } = params;

  // 计算的宽度
  const getColumnWidth = columns => {
    const columnWidth = columns.reduce((pre, cur) => {
      const borderWidth = 2.5;
      if (cur.children) {
        return (
          pre +
          cur.children.reduce((a, b) => {
            return a + Number.parseInt(b.width || 0, 10);
          }, 0)
        );
      }
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
    return spans;
  };

  // 计算背景颜色
  const getBgColorMth = () => {
    let idx = 0;
    const colors = ['#fff', '#feefd0'];
    let lastcategory = '';
    return category => {
      if (lastcategory !== category) {
        idx += 1;
      }
      lastcategory = category;
      return colors[idx % 2];
    };
  };

  const getColumnsItem = (cur: any, getBgColor: any, data: any) => {
    const {
      type = EColumnsType.NORAML,
      filterable = false,
      isRowSpan = false,
      sortable = false,
      hideBG = false,
      rowSpanProps = '',
      showWarning = false,
      getCustomCellStyle = () => ({}),
    } = cur;
    const dataIndex = cur.dataIndex as string;
    const getStyle = (record, index, column) => ({
      ...getCustomCellStyle(record, index, column),
      background: hideBG ? '#fff' : getBgColor(record[colorGroupProps]),
      ...(showWarning && Number.parseFloat(record[dataIndex]) < 0 ? { color: 'red' } : {}),
    });
    const customTitleInfo = {};
    if (cur.getTitleBySearch) {
      customTitleInfo['title'] = cur.getTitleBySearch({
        searchFormValue,
        dateDim: getDateDimParams(),
      });
    }
    if (type === EColumnsType.NORAML) {
      return [
        {
          ...cur,
          ...customTitleInfo,
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
                customCell: (record, index, column) => {
                  const list = getComputeRowSpans(data, rowSpanProps || dataIndex);
                  return {
                    rowSpan: list[index || 0],
                    style: getStyle(record, index, column),
                  };
                },
              }
            : {
                customCell: (record, index, column) => {
                  return {
                    style: getStyle(record, index, column),
                  };
                },
              }),
        },
      ];
    } else if (type === EColumnsType.DATE_VALUE_LIST) {
      // 特殊字段处理，每天的数据项
      const dataList = data[0][dataIndex] || [];
      if (searchFormValue.timeDimension === TimeDimension.DAY) {
        return dataList.map(item => ({
          title: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayjs(item.dateS).tz().day()],
          width: '74px',
          children: [
            {
              title: dayjs(item.dateS).tz().format('MM-DD'),
              dataIndex: item.dateS,
              align: 'right',
              width: '74px',
              ...cur,
              ...customTitleInfo,
              sorter: (a, b) => {
                const aValue = Number.parseFloat(a[item.dateS]) || 0;
                const bValue = Number.parseFloat(b[item.dateS]) || 0;
                return aValue - bValue;
              },
              sortDirections: ['descend', 'ascend'],
              customCell: (record, index, column) => {
                return {
                  style: getStyle(record, index, column),
                };
              },
            },
          ],
        }));
      }
      return dataList.map(item => ({
        ...cur,
        title: searchFormValue.timeDimension === TimeDimension.WEEK ? item.dateS.slice(4) : item.dateS, // 周数据表头去掉年份
        dataIndex: item.dateS,
        align: 'right',
        ...customTitleInfo,
        sorter: (a, b) => {
          const aValue = Number.parseFloat(a[item.dateS]) || 0;
          const bValue = Number.parseFloat(b[item.dateS]) || 0;
          return aValue - bValue;
        },
        sortDirections: ['descend', 'ascend'],
        customCell: (record, index, column) => {
          return {
            style: getStyle(record, index, column),
          };
        },
      }));
    } else if (type === EColumnsType.WEEK_VALUE_LIST) {
      // 特殊字段处理，周结的数据项
      const dataList = data[0][dataIndex] || [];
      return [
        {
          title: '周结',
          children: dataList.map(item => ({
            ...cur,
            title: item.keys,
            dataIndex: item.keys,
            customCell: (record, index, column) => {
              return {
                style: getStyle(record, index, column),
              };
            },
          })),
        },
      ];
    } else if (type === EColumnsType.DIMENTION_LIST) {
      // 特殊字段处理，每天的数据项
      const dataList = data[0][dataIndex] || [];
      return dataList.map(item => ({
        ...cur,
        title: item.keys,
        dataIndex: item.keys,
        ...(isRowSpan
          ? {
              customCell: (record, index, column) => {
                const list = getComputeRowSpans(data, rowSpanProps || item.keys);
                return {
                  rowSpan: list[index || 0],
                  style: getStyle(record, index, column),
                };
              },
            }
          : {
              customCell: (record, index, column) => {
                return {
                  style: getStyle(record, index, column),
                };
              },
            }),
      }));
    }
  };

  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    const getBgColor = getBgColorMth(); // 定义背景色
    const columns = columnsOptions.reduce((pre, cur) => {
      if (cur.children) {
        return [
          ...pre,
          {
            title: cur.title,
            width: cur.width,
            customHeaderCell: cur?.customHeaderCell,
            children: cur.children.reduce((preItem, curItem) => {
              return [...preItem, ...getColumnsItem(curItem, getBgColor, data)];
            }, []),
          },
        ];
      }
      return [...pre, ...getColumnsItem(cur, getBgColor, data)];
    }, []) as BasicColumn[];
    if (tableRef?.value) {
      const columnWidth = getColumnWidth(columns);
      const scrollWidth = 17;
      const tableWidth = tableRef?.value?.offsetWidth || 0;
      return columns.concat(columnWidth < tableWidth ? [{ dataIndex: 'block', width: tableWidth - columnWidth - scrollWidth }] : []);
    }
    return columns;
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
          startDim: `${startDate.endOf('week').year()}WK${startDate.week().toString().padStart(2, '0')}`,
          endDim: `${endDate.endOf('week').year()}WK${endDate.week().toString().padStart(2, '0')}`,
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

  // 获取日期 dateDim 的查询条件
  const getDateDimParamsByDate = () => {
    const { timeDimension, date } = searchFormValue;
    let query = {};
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
        query = {
          startTime: date.unix() * 1000,
          endTime: date.unix() * 1000,
        };
        break;
    }
    return query;
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
  return {
    getColumns,
    getConditionParam,
    getDateDimParams,
    getDateDimParamsByDate,
    getQuarter,
  };
}
