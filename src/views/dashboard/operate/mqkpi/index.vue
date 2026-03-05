<!-- MC周报 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          isRangePicker: true,
          getOrganizationApi: getSyOrganization,
          defaultCatheData: {
            [TimeDimension.MONTH]: [dayjs().tz().subtract(4, 'month'), dayjs().tz().subtract(1, 'month')],
          },
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <a-button v-for="(item, idx) in jumpButtonOptions.slice(2)" :key="idx" type="primary" class="mr-8px" @click="go(item.getPathUrl(searchFormValue))">
            {{ item.title }}
          </a-button>
          <div class="flex">
            <span> 取数时间：{{ searchFormValue.timeDimension === 'week' ? '每周三' : '每月11号' }}</span>
            <a-popover placement="right">
              <template #content>
                <p>数据来源：海波龙系统</p>
              </template>
              <img :src="vectorSvg" width="18px" class="ml-8px" />
            </a-popover>
          </div>
        </template>
      </SearchForm>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">导出</a-button>
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
        <BasicTable class="table-wrapper" @register="registerTable">
          <template v-slot:bodyCell="{ column, record }">
            <!-- 可跳转 -->
            <template v-if="column.cellType === ETableCellSlotType.LINK">
              <span @click="handleGo({ column, record })">
                {{ record[column.dataIndex as string] }}
              </span>
            </template>
          </template>
        </BasicTable>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, unref } from 'vue';
  import { BasicColumn, useTable, BasicTable } from '/@/components/Table';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { getDiecutkpiList } from '/@/api/dashbord/report';
  import { saveTableDatasToExcel } from '/@/utils/file/download';
  import { jumpButtonOptions } from '/@/views/dashboard/operate/profitkpi/config';
  import { getSyOrganization } from '/@/api/dashbord/operate';

  import { allColumnsOptions, monthColumnsOptions, weekColumnsOptions, EColumnsType, ETableCellSlotType } from './config';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../types';
  import { cloneDeep, isEmpty, merge, uniq } from 'lodash-es';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  defineOptions({ name: 'dashboard-operate-mqkpi' });

  const go = useGo();
  const { routeQuery } = useRouteQuery();
  const exportLoading = ref(false);
  // 导出excel
  const exportToExcel = async () => {
    exportLoading.value = true;
    saveTableDatasToExcel({
      columns: columns.value,
      tableList: dataSource.value,
      fileName: '模切KPI',
      isCustomRender: false,
    });
    exportLoading.value = false;
  };

  const columns = ref<BasicColumn[]>([]); // 表头配置
  const dataSource = ref([]);

  const getTableData = (queryParams, searchFormValue) => {
    return new Promise((resolve, reject) => {
      getDiecutkpiList({
        orgCode: searchFormValue.orgCode,
        dimension: searchFormValue.timeDimension,
        startDim: queryParams.startDim.replace('-', ''),
        endDim: queryParams.endDim.replace('-', ''),
      })
        .then(res => {
          const { data: list = [] } = res;
          resolve({ data: { list } });
          if (isEmpty(list)) return;
          const dataList = list.map(item => {
            return {
              ...item,
              ...item.lastAmountList.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              ),
              ...item.thisAmountList.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              ),
            };
          });
          columns.value = getColumns(dataList);
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
  const defaultDate = dayjs().tz().subtract(9, 'day');
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    defaultSearchFormValue: {
      dateRange: [dayjs(defaultDate).tz().subtract(3, 'week'), dayjs(defaultDate).tz()],
      timeDimension: TimeDimension.WEEK,
      ...routeQuery,
    },
    searchReqMth: getTableData,
  });

  // 跳转
  const handleGo = ({ column, record }) => {
    const { getPathUrl } = column;
    const url =
      (getPathUrl &&
        getPathUrl({
          searchFormValue,
          record: record,
          column: column,
        })) ||
      '';
    if (url) {
      go(url);
    }
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

  // 获取筛选选项信息
  const getFilterOptions = (data: any, dataIndex: string) => {
    const res = uniq(data.map(item => item[dataIndex])).map(item => ({
      text: item,
      value: item,
    }));
    return res;
  };
  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    const columns = searchFormValue.timeDimension === TimeDimension.WEEK ? weekColumnsOptions : monthColumnsOptions;

    const [startDate, endDate] = searchFormValue?.dateRange || [
      dayjs().tz().subtract(1, 'week').startOf('week'),
      dayjs().tz().subtract(4, 'week').endOf('week'),
    ];

    const year = startDate.year();
    const startweek = startDate.week();
    const endweek = endDate.week();

    return columns
      .map(item => {
        if (item.dataIndex === 'lastYearTotalAmount') {
          return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item, {
            baseInfo: {
              title: `${year - 1}年${endweek - startweek + 1}周合计`,
            },
          });
        }
        if (item.dataIndex === 'thisYearTotalAmount') {
          return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item, {
            baseInfo: {
              title: `${year}年${endweek - startweek + 1}周合计`,
            },
          });
        }
        return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item);
      })
      .reduce((pre, cur) => {
        const { type = EColumnsType.NORAML, isRowSpan = false, sortable = false, baseInfo, dataIndex, filterable = false } = cur;
        if (type === EColumnsType.DATE_VALUE_LIST) {
          // 特殊字段处理，每天的数据项
          const dataList = data[0][dataIndex as string] || [];
          return [
            ...pre,
            ...dataList.map(item => ({
              title: item.keys, // 周数据表头去掉年份
              dataIndex: item.keys,
              ...baseInfo,
              sorter: (a, b) => {
                const aValue = Number.parseFloat(a[item.keys]) || 0;
                const bValue = Number.parseFloat(b[item.keys]) || 0;
                return aValue - bValue;
              },
              sortDirections: ['descend', 'ascend'],
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
              ...(filterable
                ? {
                    filters: getFilterOptions(data, dataIndex),
                    onFilter: (value: string, record: any) => record[dataIndex as string] === value,
                  }
                : {}),
            },
          ];
        }
        return pre;
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
    indexColumnProps: {
      align: 'left',
      width: 34,
    },
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
  @import url('../../../../design/dashboard.less');

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
      text-align: left;
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
