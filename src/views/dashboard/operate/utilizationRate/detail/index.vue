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
        }">
        <template #right>
          <div class="flex">
            <a-form-item name="mark">
              <a-select ref="select" v-model:value="searchFormValue.mark">
                <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
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
  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import { getAoidatanewTrend } from '/@/api/dashbord/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { AOI_MARK_OPTIONS, DEFAULT_AOI_MARK } from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/config';

  defineOptions({ name: 'dashboard-operate-utilizationRate-detail' });

  const { t } = useI18n();

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'Lianjilv',
      subTitle: '联机率',
    },
    {
      quotaKey: 'Kaijilv',
      subTitle: t('views.dashboard.operate.aoiIsInActionToday.uptime'),
    },
    {
      quotaKey: 'Jitaijiadonglv',
      subTitle: '稼动率',
    },
    {
      quotaKey: 'Lianglv',
      subTitle: '良率',
    },
  ];

  // 额外查询参数
  const getParams = searchFormValue => {
    return {
      mark: searchFormValue.mark,
    };
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    pathInfo: {
      path: '/dashboard/operate/utilizationRate/detail', // 趋势页路由
      infoPath: '/dashboard/operate/utilizationRate/infoDetail', // 详情页路由
    },
    chartQuotaInfoList,
    defaultSearchFormValue: {
      mark: DEFAULT_AOI_MARK,
    },
    getParams,
    requestMth: getAoidatanewTrend,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>

<style lang="less">
  .die-cutting-tooltip {
    width: 162px;

    .head-container {
      width: 100%;
      color: #1a1a1a;
    }

    .content-container {
      width: 100%;
      height: 100%;

      .item-container {
        width: 182px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin-bottom: 12px;
      }
    }
  }
</style>
