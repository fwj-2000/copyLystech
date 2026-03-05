<!-- 损益趋势详情页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
        }">
        <template #right>
          <a-form-item name="dimension">
            <a-select v-model:value="searchFormValue.preMadeDim">
              <a-select-option value="cz">产值</a-select-option>
              <a-select-option value="xz">销值</a-select-option>
            </a-select>
          </a-form-item>
          <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" class="mr-8px" @click="go(item.getPathUrl(searchFormValue))">
            {{ item.title }}
          </a-button>
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
        <!-- 数据展示 -->
        <a-row :gutter="[12, 12]" class="group-container">
          <!-- 所有图表 -->
          <a-col v-for="(chart, idx) in chartInfoList" :key="idx" :xs="24" :xl="24">
            <BaseChart :info="chart.info"></BaseChart>
          </a-col>
        </a-row>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { useGo } from '/@/hooks/web/usePage';
  import { getProfitandlosThend } from '/@/api/dashbord/report';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../../types';
  import { jumpButtonOptions } from '/@/views/dashboard/operate/profitkpi/config';

  defineOptions({ name: 'dashboard-operate-profit-detail' });

  const go = useGo();
  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'gapOutputValue',
      subTitle: '产值达成',
      suffix: '%',
    },
    {
      quotaKey: 'gapNetProfit',
      subTitle: '净利达成',
      suffix: '%',
    },
  ];

  // 单厂单图表指标配置
  const singleChartQuotaInfoList = [
    {
      lineKeys: [
        {
          key: 'gapOutputValue',
          title: '产值达成',
          color: '#FCBE3B',
          position: 'top',
          suffix: '%',
        },
      ],
      showKeysLengend: true,
      subTitle: '产值达成',
    },
    {
      lineKeys: [
        {
          key: 'gapNetProfit',
          color: '#FF7B00',
          title: '净利达成',
          suffix: '%',
        },
      ],
      showKeysLengend: true,
      subTitle: '净利达成',
    },
  ];
  const getParams = searchFormValue => {
    const [startDate, endDate] = searchFormValue.dateRange;
    const buParams = {};
    if (searchFormValue.orgCode === 'MQ') {
      buParams['orgCode'] = '';
      buParams['busbuDim'] = 'bu';
    }
    return {
      startDim: startDate.format('YYYY-MM'),
      endDim: endDate.format('YYYY-MM'),
      // 其他参数
      saleOutputDim: searchFormValue.preMadeDim,
      ...buParams,
    };
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      preMadeDim: 'cz',
      timeDimension: TimeDimension.MONTH,
    },
    getRouteParams: (searchFormValue, dimension) => {
      const startDate = dayjs(dimension).tz().startOf('month');
      return {
        dimension: searchFormValue.preMadeDim,
        timeDimension: TimeDimension.MONTH,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: startDate.endOf('month').format('YYYY-MM-DD'),
      };
    },
    pathInfo: {
      path: '/dashboard/operate/profitkpi', // 趋势页路由
      infoPath: '/dashboard/operate/profitkpi', // 详情页路由
    },
    getPathUrl: searchFormValue => {
      if (searchFormValue.orgCode === 'MQ') {
        return '/dashboard/operate/profit/detail';
      }
      return '/dashboard/operate/profitkpi';
    },
    chartQuotaInfoList,
    singleChartQuotaInfoList,
    requestMth: getProfitandlosThend,
    getParams,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>
