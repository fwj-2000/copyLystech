<!-- 制程良率详情页 -->
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
        }"></SearchForm>
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
  import { getQcauditTrenddata } from '/@/api/dashbord/operate';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  defineOptions({ name: 'dashboard-operate-qualityAudit-detail' });

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'FQCYield',
      subTitle: 'FQC直通率',
      pathInfo: {
        infoPath: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal', // 详情页路由
      },
    },
    {
      quotaKey: 'FAIYield',
      subTitle: 'FAI直通率',
      pathInfo: {
        infoPath: '/dashboard/operate/utilizationRate/infoDetail', // 详情页路由
      },
    },
  ];

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    pathInfo: {
      path: '/dashboard/operate/qualityAudit/detail', // 趋势页路由
    },
    chartQuotaInfoList,
    requestMth: getQcauditTrenddata,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>
