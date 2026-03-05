<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm>
        <template #right>
          <a-button type="primary" @click="getData" :loading="loading">查询</a-button>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          showList: false,
        }">
        <!-- 数据展示 -->
        <Chart ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, watch } from 'vue';
  import { useSearchForm } from '/@/views/dataAnalysis/components/BaseSearchForm/useSearchForm';
  import { formOptions } from './config';
  import { getInventorySummary } from '/@/api/dataAnalysis/financial';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { Chart } from '/@/components/Chart';

  defineOptions({ name: 'dataAnalysis-financial-inventory-report-lineChart' });

  const { getParams } = useRouteParams();
  const routeParams = getParams();
  const loading = ref(true);

  const [SearchForm, searchFormApi] = useSearchForm({ formOptions });

  const currentType = computed(() => {
    return routeParams.type || '原材料';
  });

  const searchLoading = computed(() => {
    const { state } = searchFormApi;
    return state.searchLoading;
  });

  const chartData = ref<Array<any>>([]);
  async function getData() {
    const params = searchFormApi.getFormParams();
    loading.value = true;
    return getInventorySummary(params)
      .then(res => {
        const type = currentType.value;
        const orgCode = routeParams.orgCode || 'MQ';
        res.data = (Array.isArray(res.data) ? res.data : [])
          .filter((item: any) => item.OrgCode === orgCode && item.Title1 === type)
          .map((item: any) => {
            const valuesArray = item.List?.[0]?.Values || [];
            valuesArray.forEach((el: { keys: string; values: number }) => {
              item[el.keys] = Math.round(el.values * 1);
            });
            return {
              ...item,
              OrgName: item.FactoryName,
            };
          });
        chartData.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const chartOptions = computed(() => {
    const dataList = chartData.value;
    const xAsisData = dataList?.[0]?.List?.[0]?.Values?.map((item: { keys: string }) => item.keys) || [];
    return {
      title: {
        text: currentType.value,
        subtext: '单位: (万元)',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: dataList.map(item => item.Title2),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAsisData,
      },
      yAxis: {
        type: 'value',
      },
      series: dataList.map(item => {
        return {
          name: item.Title2,
          type: 'line',
          data: xAsisData.map((key: string) => item[key]),
        };
      }),
    };
  });

  onMounted(() => {
    watch(
      () => searchLoading.value,
      () => {
        // 搜索条件还在加载完成，调用获取数据方法
        searchLoading.value || getData();
      },
    );
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  .chart-wrapper {
    height: 100%;
    overflow-x: auto;
  }

  .dashboard-content-container {
    height: calc(100% - 64px);
    max-height: 500px;
  }
</style>
