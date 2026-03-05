<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: true,
          isRangePicker: false,
          isFetchAllOrgCode: true,
          disabledDate: (current: Dayjs) => {
            return current && current < dayjs('2024-01-01').tz();
          },
        }">
        <template #left>
          <a-form-item v-if="searchFormValue.orgCode === 'MQ'" name="orgLevel">
            <a-select v-model:value="searchFormValue.orgLevel">
              <a-select-option v-for="(key, idx) in Object.keys(EOrgLevel)" :key="idx" :value="EOrgLevel[key]">
                {{ key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right> </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <RankItem
          v-for="(item, idx) in rankList"
          :key="idx"
          :name="(item.name as string)"
          :columns="item.columns"
          :dataSource="item.dataSource"
          :showTableIndexColumn="true" />
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { ref, provide } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { PAGE_CONFIG_INFO } from './config';
  import { BasicColumn } from '/@/components/Table';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  import { EOrgLevel } from '/@/views/dashboard/operate/ranking/type';

  import RankItem from '/@/views/dashboard/operate/ranking/RankItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty, omit } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-manpower-percapita-ranking' });

  const { getColumnsOptions, api, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO;

  const { routeQuery } = useRouteQuery();
  const rankList = ref<
    {
      name: string;
      columns: BasicColumn[];
      dataSource: Recordable<any>[];
    }[]
  >([]);

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  // 获取表头配置信息
  const getColumns = (dataSource, isKaixian: boolean = false): BasicColumn[] => {
    const options = getColumnsOptions({
      dataSource,
      searchFormValue,
      isKaixian,
    }).reduce((pre, cur) => {
      const { sortable = false, baseInfo, dataIndex } = cur;
      return [
        ...pre,
        {
          dataIndex,
          ...baseInfo,
          ...(sortable
            ? {
                sorter: (a, b) => {
                  if (!dataIndex) {
                    return 0;
                  }
                  const aValue = Number.parseFloat(a[dataIndex]) || 0;
                  const bValue = Number.parseFloat(b[dataIndex]) || 0;
                  return aValue - bValue;
                },
              }
            : {}),
        },
      ];
    }, []);
    return options;
  };

  // 处理接口数据，设置表格数据
  const setTableData = (queryParams, searchFormValue) => {
    return new Promise((resolve, reject) => {
      api(queryParams, searchFormValue)
        .then(res => {
          const { data: list } = res as any;
          resolve({ data: { list } });
          if (isEmpty(list)) return;
          rankList.value = list.map(item => ({
            columns: getColumns(item.Rlist, item.RankItem === '人均开线数'),
            name: item.RankItem,
            dataSource: item.Rlist,
          }));
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };
  let date: Dayjs = (routeQuery?.date && dayjs(routeQuery?.date).tz()) || dayjs().tz().subtract(1, 'month');
  // 如果timeDimension 为week 则使用routeQuery?.date 使用当前周的前一个周
  if (routeQuery?.timeDimension === TimeDimension.WEEK) {
    date = date.subtract(1, 'week');
  }
  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: date,
    isRangePicker: false,
    showPeriodDimension: true,
    isTrendData: false,
    defaultSearchFormValue: {
      ...defaultSearchFormValue,
      orgCode: 'MQ',
      orgLevel: EOrgLevel.SBU,
      timeDimension: routeQuery?.timeDimension || TimeDimension.MONTH,
      ...omit(routeQuery, ['date', 'orgCode']),
    },
    searchReqMth: setTableData,
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

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 20vh !important;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-thead > tr) {
    font-size: 12px;

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
    font-size: 13px;

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
      padding: 4px 8px !important;
    }
  }
</style>
