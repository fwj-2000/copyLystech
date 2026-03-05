<!-- 费用详情页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
          showPeriodDimension: false,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="year">年</a-select-option>
            </a-select>
          </a-form-item>
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
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { getProductsalesumTrend } from '/@/api/dashbord/operate';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../../types';
  import { commonYAxis } from '../../components/BaseChart/config';

  defineOptions({ name: 'dashboard-operate-production-detail' });

  // 图表指标配置
  const getChartQuotaInfoList = (orgCode): ChartQuotaInfo[] => {
    const unit = orgCode === 'MQ' ? 'Mn/RMB' : 'W/RMB';
    return [
      {
        quotaKey: 'SjCzfValue',
        subTitle: `实际产值(${unit})`,
        suffix: ' ',
      },
      {
        quotaKey: 'SjChfValue',
        subTitle: `实际出货(${unit})`,
        suffix: ' ',
      },
      {
        quotaKey: 'SjCxl',
        subTitle: '实际产销率',
        suffix: '%',
      },
    ];
  };

  // 单厂单图表指标配置
  const getSingleChartQuotaInfoList = orgCode => {
    const unit = orgCode === 'MQ' ? 'Mn/RMB' : 'W/RMB';
    return [
      {
        keys: [
          {
            key: 'SjCxl',
            title: '实际产销率',
            color: '#FF7B00',
            position: 'top',
            suffix: '%',
            yAxisIndex: 1,
          },
        ],
        lineKeys: [
          {
            key: 'SjCzfValue',
            title: `实际产值(${unit})`,
            color: '#4b7bec',
            position: 'bottom',
            suffix: ' ',
          },
          {
            key: 'SjChfValue',
            title: `实际出货(${unit})`,
            color: '#FF7B00',
            position: 'bottom',
            suffix: ' ',
          },
        ],
        yAxis: [
          {
            ...commonYAxis,
            name: '',
            position: 'left',
          },
          {
            ...commonYAxis,
            name: '',
            position: 'right',
          },
        ],
        showKeysLengend: true,
        subTitle: '产销率',
      },
      {
        lineKeys: [
          {
            key: 'YcCzfValue',
            title: `预测产值`,
            color: 'rgba(255, 123, 0, 0.4)',
            position: 'bottom',
            suffix: ' ',
          },
          {
            key: 'SjCzfValue',
            title: `实际产值`,
            color: '#FF7B00',
            position: 'top',
            suffix: ' ',
          },
        ],
        showKeysLengend: true,
        subTitle: `产值(${unit})`,
      },
      {
        lineKeys: [
          {
            key: 'YcChfValue',
            title: `预测出货`,
            color: 'rgba(255, 123, 0, 0.4)',
            position: 'bottom',
            suffix: ' ',
          },
          {
            key: 'SjChfValue',
            title: `实际出货`,
            color: '#FF7B00',
            position: 'top',
            suffix: ' ',
          },
        ],
        showKeysLengend: true,
        subTitle: `出货(${unit})`,
      },
      {
        lineKeys: [
          {
            key: 'YcCxl',
            title: '预测产销率',
            color: 'rgba(255, 123, 0, 0.4)',
            position: 'bottom',
            suffix: '%',
          },
          {
            key: 'SjCxl',
            title: '实际产销率',
            color: '#FF7B00',
            position: 'top',
            suffix: '%',
          },
        ],
        showKeysLengend: true,
        subTitle: '产销率',
      },
    ];
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    getRouteParams: searchFormValue => ({
      preMadeDim: searchFormValue.preMadeDim,
    }),
    pathInfo: {
      path: '/dashboard/operate/production/detail', // 趋势页路由
    },
    chartQuotaInfoList: [],
    formatValue: ({ value, orgCode }) => {
      if (orgCode === 'MQ') {
        return Math.floor(value / 100);
      }
      return Math.floor(value);
    },
    getChartQuotaInfoList,
    getSingleChartQuotaInfoList,
    requestMth: getProductsalesumTrend,
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
