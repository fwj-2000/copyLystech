<!-- 客诉图表 -->
<template>
  <div class="compo-container">
    <div class="chart-wrapper flex ct-evenly">
      <!-- 客诉数图表 -->
      <div class="left-wrapper flex">
        <SvgChart
          style="width: 80%; height: 100%"
          v-bind="{
            rate: parseFloat(complaintsInfo.seriousRate),
            complaintsNum: complaintsInfo.complaintsNum || 0,
            name: t('views.dashboard.operate.customerComplaints.complaintsNum'),
            orgCode: props.info.orgCode,
            goDetail,
          }"></SvgChart>
      </div>
      <!-- 关闭率图表 -->
      <div class="right-wrapper flex column">
        <div class="flex ml-32px" style="width: 100%; height: 18px; font-size: 12px">{{ complaintsInfo.closeRate }}</div>
        <Chart :options="option" height="100%" style="height: 100%; width: 100%" />
      </div>
    </div>
    <!-- 图例 -->
    <div class="legend-wrapper flex all-start">
      <div v-for="(item, idx) in valueList" :key="idx" class="item flex ct-between">
        <div class="flex ct-between" :class="{ 'text-hover': item.clickable }" @click="item.clickable ? goDetail(item.params) : null">
          <span class="legend mr-4px" :style="{ backgroundColor: item.color }" />
          <span class="name">{{ item.label }}：</span>
          <span class="value">{{ item.value }}</span>
        </div>
        <span class="name ml-6px">{{ item.rate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import { Chart } from '/@/components/Chart';
  import SvgChart from './SvgChart.vue';
  import dayjs from 'dayjs';
  import { SEVERITY_TYPE } from '/@/views/dashboard/operate/metricsCenter/components/CustomerComplaints/types';

  const DETAIL_URL = '/dashboard/operate/customerComplaints/infoDetail';

  const { t } = useI18n();
  const go = useGo();

  const props = defineProps<{
    info: any;
  }>();

  // 保留两位小数
  const formatRateValue = value => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const complaintsInfo = computed(() => {
    const { Serious = 0, General = 0, CloseRate = '0.00%' } = props.info;
    return {
      seriousRate: formatRateValue(Serious / General),
      complaintsNum: General,
      closeRate: CloseRate,
    };
  });
  const valueList = computed(() => {
    const { Serious = 0, General = 0, MilNum = 0, CloseNum, CloseRate = 0.0 } = props.info;
    return [
      {
        label: '严重客诉',
        value: Serious,
        rate: formatRateValue(Serious / General),
        color: '#f0c172',
        clickable: true,
        params: { type: SEVERITY_TYPE.SEVERE },
      },
      {
        label: '关闭数',
        value: CloseNum,
        rate: CloseRate,
        color: '#5e88ec',
        clickable: false,
      },
      {
        label: '一般客诉',
        value: MilNum,
        rate: formatRateValue(MilNum / General),
        color: '#6da1f0',
        clickable: true,
        params: { type: SEVERITY_TYPE.NORMAL },
      },
    ];
  });

  // 设置图表数据
  const option = computed(() => {
    const { CloseRate = 0.0 } = props.info;
    const dataRate = Number.parseFloat(CloseRate);
    return merge(cloneDeep(chartOptions), {
      xAxis: {
        data: ['关闭率'],
      },
      series: [{}, { data: [dataRate] }, { data: [dataRate] }],
    });
  });

  // 去详情页
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goDetail = (params = {}) => {
    const orgCode = props.info.OrgCode;
    const { date, timeDimension } = getSearchFormValue() as any;

    // 获取当前日期所在周的周一和周日
    const currentDate = dayjs(date).tz();
    const startDate = currentDate.startOf('week').format('YYYY-MM-DD');
    const endDate = currentDate.endOf('week').format('YYYY-MM-DD');

    // 构造路由参数
    const url = `${DETAIL_URL}?${objectToQueryParams({
      orgCode,
      dimension: timeDimension,
      startDate,
      date: endDate,
      ...params,
    })}`;
    go(url);
  };
</script>

<style lang="less" scoped>
  @legendHeight: 53px;

  .compo-container {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    overflow: hidden;

    .legend-wrapper {
      width: 100%;
      height: @legendHeight;
      padding: 6px;
      background-color: #f2f2f2;
      border-radius: 4px;
      flex-wrap: wrap;

      .item {
        width: 45%;

        &:nth-child(odd) {
          margin-right: 5%;
        }

        .legend {
          display: inline-block;
          width: 8px;
          height: 8px;
        }
      }
    }

    .chart-wrapper {
      width: 100%;
      height: calc(100% - @legendHeight);

      .left-wrapper {
        position: relative;
        // width: 60%;
        height: 115%;
        margin-bottom: 5%;
      }

      .right-wrapper {
        position: relative;
        width: 30%;
        z-index: 1;
        height: 100%;
      }
    }
  }
</style>
