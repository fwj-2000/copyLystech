<!-- 产值趋势详情页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          isRangePicker: true,
          showPeriodDimension: true,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="day">天</a-select-option>
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="quarter">季度</a-select-option>
              <a-select-option value="year">年</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">是否纳入边贡</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.isBian" :dropdownMatchSelectWidth="false">
                <a-select-option v-for="item in IS_INCLUDE_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">工单类型</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.orderType">
                <a-select-option v-for="item in orderTypeOptions" :key="item" :value="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
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
  import { getFinanceeconomicOrdertype, getFinanceeconomicTrenddata } from '/@/api/dashbord/operate';
  import { IS_INCLUDE_OPTIONS, DEFAULT_IS_INCLUDE } from '/@/views/dashboard/operate/metricsCenter/components/Financeeconomic/config';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty } from 'lodash-es';
  import { ref, unref } from 'vue';
  import { commonYAxis } from '../../components/BaseChart/config';

  defineOptions({ name: 'dashboard-operate-loss-detail' });

  const orderTypeOptions = ref([]);
  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'sjshl',
      subTitle: '实际损耗率',
    },
    {
      quotaKey: 'bzshl',
      subTitle: '标准损耗率',
    },
    {
      quotaKey: 'shsse',
      subTitle: '损耗超损额',
      suffix: '(万元)',
    },
    {
      quotaKey: 'sjclzb',
      subTitle: '实际材料占比',
    },
    {
      quotaKey: 'bzclzb',
      subTitle: '标准材料占比',
    },
  ];
  // 单厂单图表指标配置
  const singleChartQuotaInfoList = [
    {
      lineKeys: [
        {
          key: 'bzshl',
          title: '标准损耗率',
          color: '#4b7bec',
          position: 'bottom',
        },
        {
          key: 'sjshl',
          title: '实际损耗率',
          color: '#FF7B00',
          position: 'top',
        },
      ],
      keys: [
        {
          key: 'shsse',
          title: '损耗超损额',
          color: '#FCBE3B',
          position: 'top',
          suffix: '(万元)',
          yAxisIndex: 1,
        },
      ],
      yAxis: [
        {
          ...commonYAxis,
          name: '',
          position: 'left',
          axisLabel: { show: true },
        },
        {
          ...commonYAxis,
          name: '',
          position: 'right',
          axisLabel: { show: true },
        },
      ],
      showKeysLengend: true,
      subTitle: '损耗率',
    },
    {
      keys: [
        {
          key: 'bzclzb',
          title: '标准材料占比',
          color: '#4b7bec',
          position: 'bottom',
        },
        {
          key: 'sjclzb',
          title: '实际材料占比',
          color: '#FF7B00',
          position: 'top',
        },
      ],
      showKeysLengend: true,
      subTitle: '材料占比',
    },
  ];
  const getParams = searchFormValue => {
    if (isEmpty(unref(orderTypeOptions))) {
      getFinanceeconomicOrdertype(searchFormValue).then(res => {
        orderTypeOptions.value = res?.data?.list;
      });
    }
    return {
      // 其他参数
      isBian: searchFormValue.isBian,
      orderType: searchFormValue.orderType,
    };
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      isBian: DEFAULT_IS_INCLUDE,
      orderType: 'ALL',
    },
    pathInfo: {
      path: '/dashboard/operate/loss/detail', // 趋势页路由
      // infoPath: '/dashboard/operate/loss/infoDetail', // 详情页路由
    },
    chartQuotaInfoList,
    singleChartQuotaInfoList,
    requestMth: getFinanceeconomicTrenddata,
    getParams,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>
