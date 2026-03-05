<!-- 绩效排名首页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: false,
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
        <template #right>
          <a-form-item>
            <a-select ref="select" v-model:value="searchFormValue.preMadeDim">
              <a-select-option v-for="item in preMadeDimOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
      <!-- <a-button type="primary" :loading="exportLoading" ghost @click="downloadFile">导出</a-button> -->
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
        <RankItem v-for="(item, idx) in rankList" :key="idx" :name="(item.name as string)" :columns="item.columns" :dataSource="item.dataSource"></RankItem>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { PAGE_CONFIG_INFO } from './config';
  import { BasicColumn } from '/@/components/Table';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  import { EOrgLevel } from '../type';
  import { preMadeDimOptions, DEFAULT_PRE_MADE_DIM } from './config';

  import RankItem from './RankItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-profit' });

  const { getColumnsOptions, api, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO;

  const { routeQuery } = useRouteQuery();
  const rankList = ref<
    {
      name: String;
      columns: BasicColumn[];
      dataSource: Recordable<any>[];
    }[]
  >([]);

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  const date: Dayjs = dayjs().tz().subtract(1, 'day');

  // 获取表头配置信息
  const getColumns = (dataSource): BasicColumn[] => {
    const options = getColumnsOptions({
      dataSource,
      searchFormValue,
    });
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
          const { date } = searchFormValue;
          rankList.value = [
            {
              columns: getColumns(list),
              name: `模切BG${date.format('YYYYMM')}月产值/利润达成`,
              dataSource: list,
            },
          ];
        })
        .catch(res => {
          reject(res);
        });
    });
  };
  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: date,
    isTrendData: false,
    isRangePicker: true,
    showPeriodDimension: true,
    defaultSearchFormValue: {
      bu: 'MQ',
      orgLevel: EOrgLevel.BU,
      preMadeDim: DEFAULT_PRE_MADE_DIM,
      ...defaultSearchFormValue,
      ...routeQuery,
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
    font-size: 15px;

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
    font-size: 15px;

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
