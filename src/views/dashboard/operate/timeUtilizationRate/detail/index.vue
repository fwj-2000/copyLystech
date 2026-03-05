<!-- 时间稼动率趋势页 -->
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
          <a-form-item name="range">
            <div class="flex">
              <!-- <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">含NPI</div> -->
              <a-select ref="select" v-model:value="searchFormValue.tag">
                <a-select-option v-for="item in isContainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </div>
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { getUtilizationrateTrend } from '/@/api/dashbord/operate';

  import { DEFAULT_IS_CONTAIN, isContainOptions } from '/@/views/dashboard/operate/metricsCenter/components/TimeUtilizationRate/chart/config';
  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  defineOptions({ name: 'dashboard-operate-timeUtilizationRate-detail' });

  const { t } = useI18n();

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'Moqiejiadonglv',
      subTitle: t('views.dashboard.operate.oee.timeUtilizationRate'),
    },
    {
      quotaKey: 'NudJDL',
      subTitle: 'NUD稼动率',
    },
    {
      quotaKey: 'NoNudJDL',
      subTitle: '非NUD稼动率',
    },
    {
      quotaKey: 'pbJDL',
      subTitle: '平板稼动率',
    },
    {
      quotaKey: 'ydJDL',
      subTitle: '圆刀稼动率',
    },
  ];

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    pathInfo: {
      path: '/dashboard/operate/oee/detail', // 趋势页路由
      infoPath: '', // 详情页路由
    },
    defaultSearchFormValue: {
      tag: DEFAULT_IS_CONTAIN,
    },
    getParams: searchFormValue => {
      return {
        tag: searchFormValue.tag,
      };
    },
    chartQuotaInfoList,
    requestMth: getUtilizationrateTrend,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>

<style lang="less">
  .uptime-tooltips {
    .content-container {
      width: 100%;
      height: 100%;

      .head-container {
        width: 100%;
        color: #1a1a1a;
      }

      .item-container {
        width: 182px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin-bottom: 12px;

        &:last-child {
          margin: 0;
        }

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }
      }
    }
  }
</style>
