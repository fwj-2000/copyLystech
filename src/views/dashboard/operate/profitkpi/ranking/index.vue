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
          isRangePicker: true,
          organizeKeyword: '',
          getOrganizationApi: getSyOrganization,
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
        <template #right>
          <a-form-item>
            <a-select ref="select" v-model:value="searchFormValue.preMadeDim">
              <a-select-option v-for="item in preMadeDimOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select ref="select" v-model:value="searchFormValue.saleOutputDim">
              <a-select-option v-for="item in saleOutputDimOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-button type="primary" :loading="exportLoading" ghost @click="downloadFile">导出</a-button>
          <div class="flex ml-8px">
            <span> 取数时间</span>
            <a-popover placement="right">
              <template #content>
                <p>11号之前：上月净利达成数据来源于上月周KPI；11号之后：上月净利达成数据来源于上月月损益</p>
              </template>
              <img :src="vectorSvg" width="18px" class="ml-8px" />
            </a-popover>
          </div>
        </template>
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
          :summaryInfo="summaryInfo"></RankItem>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { PAGE_CONFIG_INFO, getCommonParams, preMadeDimOptions, saleOutputDimOptions, DEFAULT_PRE_MADE_DIM, DEFAULT_SALE_OUTPUT_DIM } from './config';
  import { BasicColumn } from '/@/components/Table';
  import { getProfitandlosRankingexport } from '/@/api/dashbord/report';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { getSyOrganization } from '/@/api/dashbord/operate';

  import { EOrgLevel } from './type';

  import RankItem from './RankItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty, omit } from 'lodash-es';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  defineOptions({ name: 'dashboard-operate-profitkpi-ranking' });

  const { getColumnsOptions, api, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO;

  const { routeQuery } = useRouteQuery();
  const rankList = ref<
    {
      name: string;
      columns: BasicColumn[];
      dataSource: Recordable<any>[];
    }[]
  >([]);

  const summaryInfo = ref<any>({}); // 总结栏信息

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  const exportLoading = ref(false);
  const downloadFile = () => {
    exportLoading.value = true;
    const params = getCommonParams({}, searchFormValue);
    getProfitandlosRankingexport(params)
      .then(res => {
        const { url, fileName = '损益排名.xlsx' } = res.data;
        downloadByUrl({ url, fileName });
      })
      .finally(() => {
        exportLoading.value = false;
      });
  };

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
          const [startDate, endDate] = searchFormValue.dateRange;
          const startMonth = startDate.format('YYYYMM');
          const endMonth = endDate.format('YYYYMM');
          const czstr = searchFormValue.saleOutputDim === 'cz' ? '产值' : '销值';
          const dataSource = list
            // bu及bg层的数据固定汇总
            .filter(item => item.key.length > 6)
            .sort((a, b) => {
              return Number.parseFloat(b.gapNetProfit) - Number.parseFloat(a.gapNetProfit);
            })
            .map((item, idx) => ({
              rank: idx + 1,
              ...item,
            }));
          summaryInfo.value = list.filter(item => item.key.length < 7)[0] || {};
          rankList.value = [
            {
              columns: getColumns(list),
              name: `模切BG${startMonth}月-${endMonth}月${czstr}版净利达成`,
              dataSource,
            },
          ];
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };
  const date: Dayjs = (routeQuery?.date && dayjs(routeQuery?.date).tz()) || dayjs().subtract(1, 'month');
  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: date,
    isTrendData: false,
    isRangePicker: true,
    showPeriodDimension: true,
    defaultSearchFormValue: {
      preMadeDim: DEFAULT_PRE_MADE_DIM,
      saleOutputDim: DEFAULT_SALE_OUTPUT_DIM,
      ...defaultSearchFormValue,
      ...omit(routeQuery, ['date']),
      orgLevel: EOrgLevel.SBU,
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
  @import url('../../../../../design/dashboard.less');

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
