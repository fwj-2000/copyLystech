<!-- 产值趋势详情页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
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

  defineOptions({ name: 'dashboard-operate-artificial-detail' });

  const orderTypeOptions = ref([]);
  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'bzmqxlkh',
      subTitle: '模切标准效率',
      suffix: 'K/H',
    },
    {
      quotaKey: 'sjmqxlkh',
      subTitle: '模切实际效率',
      suffix: 'K/H',
    },
    {
      quotaKey: 'mqxldc',
      subTitle: '模切效率达成',
    },
    {
      quotaKey: 'bzsgxlkh',
      subTitle: '手工标准效率',
      suffix: 'K/H',
    },
    {
      quotaKey: 'sjsgxlkh',
      subTitle: '手工实际效率',
      suffix: 'K/H',
    },
    {
      quotaKey: 'sgxldc',
      subTitle: '手工效率达成',
    },
    {
      quotaKey: 'sjrgzb',
      subTitle: '实际人工占比',
    },
    {
      quotaKey: 'bzrgzb',
      subTitle: '标准人工占比',
    },
    {
      quotaKey: 'rgsse',
      subTitle: '人工损失额',
      suffix: '(万元)',
    },
  ];
  // 单厂单图表指标配置
  const singleChartQuotaInfoList = [
    {
      lineKeys: [
        {
          key: 'rgsse',
          title: '人工损失额',
          color: '#FCBE3B',
          position: 'top',
          suffix: '(万元)',
          yAxisIndex: 1,
        },
      ],
      keys: [
        {
          key: 'bzrgzb',
          title: '标准人工占比',
          color: '#4b7bec',
          position: 'bottom',
        },
        {
          key: 'sjrgzb',
          title: '实际人工占比',
          color: '#FF7B00',
          position: 'top',
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
      subTitle: '人工占比',
    },
    {
      keys: [
        {
          key: 'sjmqxlkh',
          title: '模切实际效率',
          color: '#FF7B00',
          position: 'top',
          suffix: 'K/H',
          yAxisIndex: 1,
        },
        {
          key: 'bzmqxlkh',
          title: '模切标准效率',
          color: '#4b7bec',
          position: 'bottom',
          suffix: 'K/H',
          yAxisIndex: 1,
        },
      ],
      lineKeys: [
        {
          key: 'mqxldc',
          title: '模切效率达成',
          color: '#FCBE3B',
          position: 'top',
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
      subTitle: '模切效率达成',
    },
    {
      keys: [
        {
          key: 'sjsgxlkh',
          title: '手工实际效率',
          color: '#FF7B00',
          position: 'top',
          suffix: 'K/H',
          yAxisIndex: 1,
        },
        {
          key: 'bzsgxlkh',
          title: '手工标准效率',
          color: '#4b7bec',
          position: 'bottom',
          suffix: 'K/H',
          yAxisIndex: 1,
        },
      ],
      lineKeys: [
        {
          key: 'sgxldc',
          title: '手工效率达成',
          color: '#FCBE3B',
          position: 'top',
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
      subTitle: '手工效率达成',
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
      path: '/dashboard/operate/artificial/detail', // 趋势页路由
      // infoPath: '/dashboard/operate/artificial/infoDetail', // 详情页路由
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
