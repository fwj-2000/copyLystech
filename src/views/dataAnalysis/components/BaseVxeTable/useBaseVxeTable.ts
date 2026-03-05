/*
数据报表通用的vxe表格hook，搭配/@/views/dashboard/commonComponents/BaseVxeTable/index组件使用
*/
import { nextTick, ref, unref, watch } from 'vue';
import { debounce } from '/@/utils/debounce';
import { cloneDeep, get, isEmpty, merge, omit, set } from 'lodash-es';

import { IAction, IProps, IHookAction, BaseVxeTableTypes, EColumnType } from './types';
import type { VxeGridProps } from 'vxe-table';
import { isFunction } from '/@/utils/is';
import {
  flattenColumns,
  formatDataList,
  getFormatMonthKeysValuesColumns,
  getFormatWeekKeysValuesColumns,
  getFormatDimKeysValuesColumns,
  getMergeRow,
} from './utils';
import { isArray } from 'xe-utils';

export function useBaseVxeTable(props: IProps): [(action: IAction) => void, IHookAction] {
  const {
    footerFiled,
    immediateQuery = false,
    isAutoQuery = true,
    searchLoading = ref(false),
    searchFormValue,
    columns,
    baseColumns = ref([]),
    attrs,
    debounceMs = 500,
    events = {},
    customFieldOptions = {},
    api,
    getParams = () => searchFormValue.value,
    beforeQuery,
    afterQuery,
  } = props;

  const total = ref(0);
  const mergeConfig = ref({
    size: 10,
    lastMergeSize: 0,
  });
  const instance = ref<Nullable<IAction>>(null);
  const requestController = ref<Nullable<AbortController>>(null);

  // 获取表头配置
  const getColumns = ({ data, columns }: { data: any; columns: BaseVxeTableTypes.Columns }) => {
    const allColumns: BaseVxeTableTypes.Columns = columns.reduce((pre, cur) => {
      const { field, columnType, formatTitle } = cur ?? {};
      const { getColumns } = customFieldOptions[field ?? ''] ?? {};
      if (columnType === EColumnType.DATA_LIST) {
        const firstList = data[0][field as string];
        const columns = firstList.map(item => {
          const title = (isFunction(formatTitle) && formatTitle(item.dateS)) || item.dateS;
          return {
            ...cur,
            field: item.dateS,
            title,
            columnType: EColumnType.VALUE,
          };
        });
        return pre.concat(columns);
      } else if (columnType === EColumnType.KEYS_VALUES) {
        const fieldStr = field as string;
        const firstList = data[0][fieldStr];
        const columns = firstList.map(item => {
          return {
            ...cur,
            field: `${fieldStr}_${item.keys}`,
            title: item.keys,
            columnType: EColumnType.VALUE,
          };
        });
        return pre.concat(columns);
      } else if (columnType === EColumnType.Dim_KEYS_VALUES) {
        const fieldStr = field as string;
        const firstList = data[0][fieldStr];
        const columns = getFormatDimKeysValuesColumns(firstList, cur);
        return pre.concat(columns);
      } else if (columnType === EColumnType.WEEK_KEYS_VALUES) {
        const fieldStr = field as string;
        const firstList = data[0][fieldStr];
        const columns = getFormatWeekKeysValuesColumns(firstList, cur);
        return pre.concat(columns);
      } else if (columnType === EColumnType.MONTH_KEY_KEYS_VALUES) {
        const fieldStr = field as string;
        const firstList = data[0][fieldStr];
        const columns = getFormatMonthKeysValuesColumns(firstList, cur);
        return pre.concat(columns);
      } else if (isFunction(getColumns)) {
        const fieldStr = field as string;
        const firstList = data[0][fieldStr];
        return pre.concat(getColumns({ data: firstList }));
      }
      return pre.concat([cur]);
    }, [] as BaseVxeTableTypes.Columns);
    return allColumns;
  };

  // 获取vxe配置
  const getAttrs = (attrs: VxeGridProps<any>) => {
    // 基础的
    const baseAttrs: VxeGridProps<any> = {
      proxyConfig: {
        autoLoad: true,
        response: {
          result: 'data.list',
          list: 'data',
          total: 'data.pagination.Total',
        },
        ajax: {
          queryAll: ({ filters }) => {
            return new Promise(async resolve => {
              const filterParams = filters.reduce((pre, cur) => {
                const column = columns.value.find(item => item.field === cur.field);
                const { filterField } = column?.params ?? {};
                return {
                  ...pre,
                  [filterField ?? cur.field]: (unref(cur.datas[0]) ?? []).join(';'),
                };
              }, {});
              // 合并基础参数和过滤参数
              const res = await findPageList(
                {
                  ...filterParams,
                  pageSize: total.value,
                  currentPage: 1,
                },
                true,
              );
              const { grid = null } = instance?.value ?? {};
              const result = {};
              const { response } = grid?.proxyConfig ?? {};
              const listField = response?.list;
              const data = getProxyTableData(res);
              set(result, listField as string, data);
              resolve(result);
            });
          },
          query: ({ page, filters }) => {
            const tableParams = {
              ...page,
              ...filters.reduce((pre, cur) => {
                const column = columns.value.find(item => item.field === cur.field);
                const { filterField } = column?.params ?? {};
                return {
                  ...pre,
                  [filterField ?? cur.field]: (unref(cur.datas[0]) ?? []).join(';'),
                };
              }, {}),
            };
            return findPageList(tableParams);
          },
        },
      }, // 接口请求代理
    };
    const res = merge(baseAttrs, attrs);
    return res;
  };

  const register = (action: IAction) => {
    instance.value = action;
    const { state, reloadData } = action;
    state.baseColumns = cloneDeep(columns.value);
    state.columns = columns.value;
    state.attrs = getAttrs(attrs);
    state.searchFormValue = searchFormValue;
    state.events = events;
    state.mergeRow = mergeRow;
    mergeConfig.value = action.mergeConfig;
    const reloadDataDebounce = debounce(reloadData, debounceMs);
    nextTick(() => {
      if (isAutoQuery) {
        watch(
          [() => searchFormValue.value, () => searchLoading.value],
          () => {
            if (searchLoading.value) return; // 搜索条件还在加载中，不调用api
            reloadDataDebounce();
          },
          {
            deep: true,
            immediate: immediateQuery,
          },
        );
      } else if (immediateQuery) {
        watch(
          () => searchLoading,
          () => {
            if (searchLoading.value) return; // 搜索条件还在加载中，不调用api
            reloadData();
          },
          {
            deep: true,
            immediate: immediateQuery,
          },
        );
      }
    });
  };

  watch(
    () => columns.value,
    () => {
      if (instance.value) {
        const { state } = instance.value;
        state.columns = columns.value;
        state.baseColumns = cloneDeep(columns.value);
      }
    },
    { deep: true },
  );

  watch(
    () => baseColumns.value,
    () => {
      if (instance.value) {
        const { state } = instance.value;
        state.baseColumns = baseColumns.value;
      }
    },
    { deep: true },
  );

  watch(
    () => attrs,
    () => {
      if (instance.value) {
        const { state } = instance.value;
        state.attrs = getAttrs(attrs);
      }
    },
    { deep: true },
  );

  // 合并单元格
  function mergeRow(data) {
    const { grid = null } = instance?.value ?? {};
    if (grid) {
      const allMergeRows = getMergeRow({
        data: data,
        columns: columns.value,
      });
      if (isEmpty(allMergeRows)) {
        return;
      }
      mergeConfig.value.lastMergeSize = 0;
      const { row = 0, rowspan = 0 } = allMergeRows[0];
      // 设置单次合并的数据行
      const MAX_ROWS = 80;
      const SINGLE_MERGE_ROWS = rowspan - row;
      mergeConfig.value.size = Math.ceil(MAX_ROWS / SINGLE_MERGE_ROWS) * SINGLE_MERGE_ROWS;
      const mergeData = data.slice(0, mergeConfig.value.size);
      const { state } = instance?.value ?? {};
      const mergeRows = getMergeRow({
        data: mergeData,
        columns: state?.columns ?? [],
      });
      if (state?.attrs) {
        state.attrs.mergeCells = mergeRows;
        mergeConfig.value.lastMergeSize = mergeRows.length;
      }
      grid.setMergeCells(mergeRows);
    }
  }

  function setTotal(res) {
    const { grid = null } = instance?.value ?? {};
    if (grid) {
      const { response } = grid.proxyConfig ?? {};
      total.value = get(res, response?.total as string);
    }
  }

  function getProxyTableData(res) {
    const { grid = null } = instance?.value ?? {};
    if (grid) {
      const { response } = grid.proxyConfig ?? {};
      const listField = grid.pagerConfig?.enabled ? response?.result : response?.list;
      if (listField) {
        return get(res, listField as string);
      }
      return [];
    }
    return [];
  }

  // 查询数据
  function findPageList(tableParams: Record<string, any> = {}, isQueryAll = false) {
    const { grid = null, state } = instance?.value ?? {};
    const params = getParams();
    const filters = grid?.getCheckedFilters() || [];
    // 只有在 非全量(query)导出时才调用beforeQuery，避免全量(queryAll)导出时触发表格列更新
    if (isFunction(beforeQuery) && !isQueryAll) {
      beforeQuery(params);
    }
    return new Promise(resolve => {
      nextTick(() => {
        queryMth(tableParams)
          .then(async res => {
            setTotal(res);
            //  这这里处理 column 和 Data
            const formatRes = formatProxyRes(res);
            if (!isQueryAll) {
              const data = getProxyTableData(res);
              // 动态设置表头需要用源数据
              const allColumns = getColumns({
                data,
                columns: instance.value?.state.baseColumns ?? [],
              });
              if (state) {
                state.columns = allColumns;
                state.attrs.mergeCells = [];
              }
              setFooterData(formatRes);
              const formatData = getProxyTableData(formatRes);
              await nextTick(() => {
                grid?.clearMergeCells(); // 清除合并痕迹
                grid?.clearAll().then(() => {
                  setTimeout(() => {
                    Array.isArray(filters) &&
                      filters.length > 0 &&
                      filters.forEach(el => {
                        grid.setFilter(el.column.field, [{ data: el.datas?.[0], checked: true }]);
                      });
                  });
                });
              });
              mergeRow(formatData); // 合并需要用格式化后的列表
            }
            if (isFunction(afterQuery)) {
              resolve(afterQuery(formatRes));
            } else {
              resolve(formatRes);
            }
          })
          .catch(err => {
            console.log(err);
            resolve({});
          });
      });
    });
  }

  function queryMth(tableParams: Record<string, any> = {}) {
    const params = getParams();
    if (requestController.value) {
      requestController.value.abort();
      requestController.value = null;
    }
    requestController.value = new AbortController();
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api(
          {
            ...params,
            ...omit(tableParams, ['total']),
          },
          {
            signal: requestController.value?.signal,
          },
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 设置表尾数据
  function setFooterData(res) {
    if (!footerFiled) {
      return;
    }
    const footerData = get(res, footerFiled);
    const { state } = instance?.value ?? {};
    const formatData = formatDataList({
      columns: state?.baseColumns ?? [],
      data: isArray(footerData) ? footerData : [footerData],
    });
    const flatColumns = flattenColumns((state?.columns ?? {}) as any);
    attrs.footerData = formatData.map(item => {
      return Object.entries(item).reduce((pre, [key, value]) => {
        const column = flatColumns[key];
        const { formatter } = column ?? {};
        return {
          ...pre,
          [key]: formatter ? (formatter as any)({ cellValue: value, column }) : value,
        };
      }, {});
    });
  }

  // 处理返回数据
  function formatProxyRes(res) {
    const formatRes = cloneDeep(res);
    const { grid = null } = instance?.value ?? {};
    if (grid) {
      const { response } = grid.proxyConfig ?? {};
      const listField = grid.pagerConfig?.enabled ? response?.result : response?.list;
      if (listField) {
        const list = get(res, listField as string);
        const { state } = instance?.value ?? {};
        set(
          formatRes,
          listField as string,
          formatDataList({
            columns: state?.baseColumns ?? [],
            data: list,
            customFieldOptions,
          }),
        );
      }
      return formatRes;
    }
    return formatRes;
  }

  return [
    register,
    {
      reloadData: params => instance?.value?.reloadData(params) ?? new Promise(() => {}),
      getGridInstance: () => instance?.value?.grid ?? null,
    },
  ];
}
