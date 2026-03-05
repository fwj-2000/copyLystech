<!-- 开机率平铺 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTrendPage, ChartQuotaInfo, IChartType } from '/@/views/dashboard/operate/hooks/useTrendPage';

  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { commonSeriesLineDataSyle } from '/@/views/dashboard/operate/components/BaseChart/config';

  import { getMachworkingTrenddata } from '/@/api/dashbord/operate';
  import { cloneDeep, flatten, merge } from 'lodash-es';
  import { commonSeriesDataSyle, getTooltipHtmlStr } from './config';

  import decimal from 'decimal.js';
  import { PowerOnStatus } from '/@/views/dashboard/operate/types';

  defineOptions({ name: 'dashboard-operate-uptime-detail' });

  const { t } = useI18n();

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'TotalNum',
      suffix: '',
      subTitle: t('views.dashboard.operate.uptimeDetail.numberOfMachines'),
    },
    {
      quotaKey: 'OnlineNum',
      suffix: '',
      subTitle: t('views.dashboard.operate.uptimeDetail.onlineConnections'),
    },
    {
      quotaKey: 'OnlineRate',
      subTitle: t('views.dashboard.operate.uptimeDetail.availability'),
    },
    {
      quotaKey: 'WorkingRate',
      subTitle: t('views.dashboard.operate.uptime'),
    },
    {
      type: IChartType.UPTIME,
      quotaKey: 'PlatWorkingRate',
      subTitle: `${t('views.dashboard.operate.uptimeDetail.flat')}${t('views.dashboard.operate.uptime')}`,
    },
    {
      type: IChartType.UPTIME,
      quotaKey: 'RotaryWorkingRate',
      subTitle: `${t('views.dashboard.operate.uptimeDetail.rotary')}${t('views.dashboard.operate.uptime')}`,
    },
  ];

  // 获取图表数据
  const getChartInfo = ({ BUInfo, quotaKey, suffix = '%', subTitle = '', type = 'normal' }) => {
    const legendData = BUInfo.children.map(item => item[0].OrgName);
    const xAxisData = BUInfo.parent.map(item => item.Dimension);
    const rateData = BUInfo.parent.map(item => Number.parseFloat(item[quotaKey]) || 0);
    const pathInfo = {
      path: '/dashboard/operate/uptime/detail', // 趋势页路由
      infoPath: '/dashboard/operate/uptime/machineDetails', // 详情页路由
    };
    if (type === 'normal') return pathInfo;
    const res = {
      ...pathInfo,
      options: {
        tooltip: {
          formatter: getTooltipHtmlStr,
        },
        series: [
          merge(cloneDeep(commonSeriesLineDataSyle), {
            name: `${subTitle}`,
            data: rateData,
            dimensions: legendData,
            label: {
              formatter: `{c}${suffix}`,
            },
          }),
          ...flatten(
            BUInfo.children.map(item => {
              return [
                {
                  name: item[0].OrgName,
                  stack: item[0].OrgCode,
                  data: xAxisData.map(dimension => {
                    const child = item.find(item => item.Dimension === dimension);
                    if (!child) return {};
                    return {
                      value: Number.parseFloat(child[quotaKey] || 0),
                      orgCode: child.OrgCode,
                      routeParams: {
                        status: PowerOnStatus.ON,
                      },
                    };
                  }),
                  ...commonSeriesDataSyle.normal,
                },
                {
                  stack: item[0].OrgCode,
                  data: xAxisData.map(dimension => {
                    const child = item.find(item => item.Dimension === dimension);
                    if (!child) return {};
                    return {
                      value: new decimal(100).minus(new decimal(Number.parseFloat(child[quotaKey]))).toString(),
                      orgCode: child.OrgCode,
                      routeParams: {
                        status: PowerOnStatus.OFF,
                      },
                    };
                  }),
                  ...commonSeriesDataSyle.empty,
                },
              ];
            }),
          ),
        ],
      },
    };
    return res;
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    chartQuotaInfoList,
    requestMth: getMachworkingTrenddata,
    getChartInfoMth: getChartInfo,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>

<style lang="less">
  .uptime-trend-tooltips {
    .head-container {
      color: #1a1a1a;
    }

    .content-container {
      width: 100%;
      height: 100%;
      max-width: 312px;
      flex-wrap: wrap;

      .item-container {
        width: 152px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin-right: 6px;

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
</style>
