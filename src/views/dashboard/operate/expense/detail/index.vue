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
          getOrganizationApi: getFyOrganization,
          showPeriodDimension: false,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
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
  import { getFaremanageAllocationtrend } from '/@/api/dashbord/report';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { commonYAxis } from '../../components/BaseChart/config';
  import { isArray } from '/@/utils/is';
  import { TimeDimension } from '../../types';
  import { getFyOrganization } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-expense-detail' });

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'amount',
      subTitle: '模切BG',
      suffix: '(元)',
    },
    {
      quotaKey: 'proportion',
      subTitle: '费用占比',
      suffix: '%',
    },
    {
      quotaKey: '变动制费',
      subTitle: '变动制费',
      suffix: '%',
    },
    {
      quotaKey: '固定成本',
      subTitle: '固定成本',
      suffix: '%',
    },
    {
      quotaKey: '研发费用',
      subTitle: '研发费用',
      suffix: '%',
    },
    {
      quotaKey: '管理费用',
      subTitle: '管理费用',
      suffix: '%',
    },
  ];

  // 单厂单图表指标配置
  const singleChartQuotaInfoList = [
    {
      lineKeys: [
        {
          key: 'amount',
          title: '费用',
          color: '#FCBE3B',
          position: 'top',
          suffix: '(元)',
        },
      ],
      keys: [
        {
          key: '变动制费',
          title: '变动制费',
          yAxisIndex: 1,
        },
        {
          key: '固定成本',
          title: '固定成本',
          yAxisIndex: 1,
        },
        {
          key: '研发费用',
          title: '研发费用',
          yAxisIndex: 1,
        },
        {
          key: '管理费用',
          title: '管理费用',
          yAxisIndex: 1,
        },
        {
          key: '销售费用',
          title: '销售费用',
          yAxisIndex: 1,
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
          min: 0,
          max: 100,
          position: 'right',
        },
      ],
      showKeysLengend: true,
      subTitle: '费用',
    },
    {
      lineKeys: [
        {
          key: 'proportion',
          title: '费用占比',
          color: '#FCBE3B',
          position: 'top',
        },
      ],
      showKeysLengend: true,
      subTitle: '费用占比',
    },
  ];

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData, getTrendQueryParams } = useTrendPage({
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    getRouteParams: searchFormValue => ({
      preMadeDim: searchFormValue.preMadeDim,
    }),
    pathInfo: {
      path: '/dashboard/operate/expense/detail', // 趋势页路由
    },
    chartQuotaInfoList,
    singleChartQuotaInfoList,
    getFullParams: searchFormValue => {
      const { startDim, endDim } = getTrendQueryParams();
      const { orgCode } = searchFormValue;
      return {
        ...(orgCode.length > 6 ? { orgLevel: 4 } : {}),
        dimension: searchFormValue.timeDimension,
        startDim,
        endDim,
        orgCode: orgCode === 'MQ' ? '' : orgCode,
      };
    },
    requestMth: getFaremanageAllocationtrend,
    formatData: data => {
      return data.map(item => {
        return Object.keys(item).reduce((pre, key) => {
          if (isArray(item[key])) {
            return {
              ...pre,
              ...item[key].reduce(
                (p, c) => ({
                  ...p,
                  [c.keys]: c.values.toFixed(1),
                }),
                {},
              ),
            };
          }
          if (key === 'proportion') {
            return {
              ...pre,
              [key]: item[key].toFixed(1),
            };
          }
          return {
            ...pre,
            [key]: item[key],
          };
        }, {});
      });
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
