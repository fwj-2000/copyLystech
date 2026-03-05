<!-- 损益KPI -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: true,
          isHideBU: true,
          disabledDate: (current: Dayjs) => {
            return current && current < dayjs('2024-01-01').tz();
          },
        }">
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <BasicTable class="table-wrapper" @register="registerTable"> </BasicTable>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs, { Dayjs } from 'dayjs';
  import { ref } from 'vue';
  import { BasicColumn, useTable, BasicTable } from '/@/components/Table';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useRoute } from 'vue-router';
  import { getProfitandlosMetricdetail } from '/@/api/dashbord/report';

  import { allColumnsOptions, ALLCustomHeaderCellColor, columnsOptions, EColumnsType } from './config';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../../types';
  import { cloneDeep, isEmpty, merge } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-profitkpi' });

  const route = useRoute();
  const { query: routeQuery = {} } = route;
  const {
    metric = '',
    orgCode: defaultOrgCode = '',
    startDate: defaultStartDate = dayjs().tz().subtract(4, 'week'),
    endDate: defaultEndDate = dayjs().tz().subtract(1, 'week'),
    dimension: defaultDimension = '',
    timeDimension: defaultTimeDimension = TimeDimension.WEEK,
  } = routeQuery as Record<string, any>;
  const defaultDateRange: [Dayjs, Dayjs] = [dayjs(defaultStartDate).tz(), dayjs(defaultEndDate).tz()];

  const columns = ref<BasicColumn[]>([]); // 表头配置
  const dataSource = ref<any[]>([]);

  // 将多级表头数据平铺
  function transformData(data: any[]) {
    const result: any[] = [];
    data.forEach(item => {
      const newItem = {
        ...item,
      };
      item.monthList.forEach((monthData, monthIndex) => {
        monthData.vlist.forEach((vlistItem, vlistIndex) => {
          vlistItem.values.map((item, idx) => {
            const key = `month${monthIndex}Vlist${vlistIndex}Item${idx}`;
            newItem[key] = item.values;
          });
        });
      });
      result.push(newItem);
    });
    return result;
  }

  const getTableData = (queryParams, searchFormValue) => {
    return new Promise((resolve, reject) => {
      getProfitandlosMetricdetail({
        orgCode: searchFormValue.orgCode === 'MQ' ? '' : searchFormValue.orgCode,
        dimension: searchFormValue.dimension,
        startDim: queryParams.startDim.replace('WK', 'W'),
        endDim: queryParams.endDim.replace('WK', 'W'),
        metric,
      })
        .then(res => {
          const { data: list = [] } = res;
          resolve({ data: { list } });
          if (isEmpty(list)) return;
          const dataList = transformData(list);
          columns.value = getColumns(dataList);
          dataSource.value = dataList;
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };
  // 使用维度搜索hooks
  const defaultDate = dayjs().tz().subtract(1, 'month');
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    defaultSearchFormValue: {
      orgCode: defaultOrgCode || 'MQ',
      dateRange: defaultDateRange,
      timeDimension: defaultTimeDimension,
      dimension: defaultDimension,
    },
    searchReqMth: getTableData,
  });

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
    return columnsOptions
      .map(item => {
        return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item);
      })
      .reduce((pre, cur) => {
        const { type = EColumnsType.NORAML, isRowSpan = false, sortable = false, baseInfo, dataIndex } = cur;
        if (type === EColumnsType.MONTH_LIST) {
          // 特殊字段处理，每天的数据项
          const dataList = data[0][dataIndex as string] || [];
          return [
            ...pre,
            ...dataList.map((month, monthIndex) => ({
              align: 'center',
              title: month.monthKey,
              customHeaderCell: () => ({
                style: {
                  backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                },
              }),
              children: month.vlist.map((vlist, vlistIndex) => ({
                title: vlist.key,
                customHeaderCell: () => ({
                  style: {
                    backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                  },
                }),
                children: vlist.values.map((item, idx) => ({
                  title: item.keys,
                  dataIndex: `month${monthIndex}Vlist${vlistIndex}Item${idx}`,
                  ...baseInfo,
                  customHeaderCell: () => ({
                    style: {
                      backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                    },
                  }),
                  sorter: (a, b) => {
                    const aValue = Number.parseFloat(a[`month${monthIndex}Vlist${vlistIndex}Item${idx}`]) || 0;
                    const bValue = Number.parseFloat(b[`month${monthIndex}Vlist${vlistIndex}Item${idx}`]) || 0;
                    return aValue - bValue;
                  },
                  sortDirections: ['descend', 'ascend'],
                })),
              })),
            })),
          ];
        } else if (type === EColumnsType.BLOCK) {
          return [
            ...pre,
            {
              dataIndex,
              ...baseInfo,
              customCell: (_, index) => {
                const list = getComputeRowSpans(data, dataIndex);
                return { rowSpan: list[index || 0] };
              },
            },
          ];
        } else {
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
        }
      }, []) as BasicColumn[];
  };

  // 注册表格hook
  const [registerTable] = useTable({
    columns,
    dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    bordered: true,
    striped: true,
    immediate: false,
    onChange: (_, __, ___, { currentDataSource }) => {
      columns.value = getColumns(currentDataSource);
    },
  });
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-container) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      border-color: @borderColor !important;
      padding: 4px 8px !important;
    }
  }
</style>
