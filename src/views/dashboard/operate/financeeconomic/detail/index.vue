<!-- 边贡趋势详情页 -->
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
  import dayjs from 'dayjs';

  defineOptions({ name: 'dashboard-operate-financeeconomic-detail' });

  const orderTypeOptions = ref([]);
  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'sjbgl',
      subTitle: '实际边贡率',
    },
    {
      quotaKey: 'bzbgl',
      subTitle: '标准边贡率',
    },
    {
      quotaKey: 'bgdcl',
      subTitle: '边贡达成率',
    },
    {
      quotaKey: 'bgsse',
      subTitle: '边贡损失额',
      suffix: '(万元)',
    },
  ];

  // 单厂单图表指标配置
  const singleChartQuotaInfoList = [
    {
      keys: [
        {
          key: 'bzbgl',
          title: '标准边贡率',
          color: '#4b7bec',
          position: 'bottom',
        },
        {
          key: 'sjbgl',
          title: '实际边贡率',
          color: '#FF7B00',
          position: 'top',
        },
      ],
      lineKeys: [
        {
          key: 'bgdcl',
          title: '边贡达成率',
          color: '#FCBE3B',
          position: 'top',
        },
      ],
      showKeysLengend: true,
      subTitle: '边贡率',
    },
    {
      keys: [
        {
          key: 'bgsse',
          color: '#FF7B00',
          title: '边贡损失额',
          suffix: '(万元)',
        },
      ],
      lineKeys: [
        {
          key: 'bglcy',
          title: '边贡率差异',
          color: '#FCBE3B',
          position: 'top',
        },
      ],
      showKeysLengend: true,
      subTitle: '边贡损失额',
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

  const getFirstDayOfWeek = yearWeek => {
    // 提取年份和周数
    const year = Number.parseInt(yearWeek.slice(0, 4));
    const week = Number.parseInt(yearWeek.slice(6));
    // 获取指定年份的第一天
    let firstDayOfYear = dayjs().tz().year(year).startOf('year');
    // 获取这一天是星期几（0代表周日，6代表周六）
    let dayOfWeek = firstDayOfYear.day();
    // 计算需要向前偏移多少天才能到当周的第一天（周日）
    let daysToSubtract = dayOfWeek - 1;
    // 根据周数计算需要向后偏移多少周
    let weeksToAdd = week - 1;
    // 计算总的偏移天数
    let daysToAdd = weeksToAdd * 7;
    // 计算当周第一天的日期
    let firstDayOfWeekDate = firstDayOfYear.subtract(daysToSubtract, 'day').add(daysToAdd, 'day');
    return firstDayOfWeekDate;
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      isBian: DEFAULT_IS_INCLUDE,
      orderType: 'ALL',
      // timeDimension: TimeDimension.WEEK,
    },
    // getRouteParams: (searchFormValue, dimension) => {
    //   console.log('🚀 ~getRouteParams searchFormValue, dimension:', searchFormValue, dimension);
    //   const startDate = getFirstDayOfWeek(dimension);
    //   return {
    //     dimension: searchFormValue.preMadeDim,
    //     timeDimension: searchFormValue.timeDimension,
    //     startDate: startDate.format('YYYY-MM-DD'),
    //     endDate: dayjs(startDate).tz().add(6, 'day').format('YYYY-MM-DD'),
    //   };
    // },
    // getPathUrl: searchFormValue => {
    //   if (searchFormValue.orgCode === 'MQ') {
    //     return '/dashboard/operate/financeeconomic/detail';
    //   }
    //   return '';
    // },
    pathInfo: {
      path: '/dashboard/operate/financeeconomic/detail', // 趋势页路由
      // infoPath: '/dashboard/operate/biangongDimension/ranking', // 详情页路由
    },
    chartQuotaInfoList,
    singleChartQuotaInfoList,
    requestMth: getFinanceeconomicTrenddata,
    getParams,
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
