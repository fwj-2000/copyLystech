<!-- 内容组件 -->
<template>
  <div class="h-[100%] flex flex-col justify-start" style="gap: 12px 0">
    <div v-for="item in props.dataInfo" class="relative w-[100%] h-[33%] min-h-[230px] bx-shadow">
      <div class="w-[100%] h-[100%] flex">
        <div class="w-[300px] h-[100%]">
          <!-- 柱形图 -->
          <BarChart :info="getBarChartInfo(item)" :metricKey="item.machineType" />
        </div>
        <div class="h-[100%] flex-1 relative">
          <!-- 停机原因分析 -->
          <PieChart :dataInfo="getPieInfo(item)" :metricKey="item.machineType" />
        </div>
        <!-- 达成率图形 -->
        <div class="w-[200px] h-[100%] flex flex-col items-start achievement-rate">
          <div class="p-8px text-[15px] font-bold">达成率</div>
          <div class="w-[100%] h-[100%] flex-1">
            <div class="w-[100%] h-[100%] flex center">
              <RateSvg :type="achievementRateTypeMap[item.machineType]" :value="item.achievementRate" class="w-80% h-[60%]" />
            </div>
          </div>
        </div>
      </div>
      <!-- 达成率印章 -->
      <div class="absolute right-[-10px] top-[-10px] z-3 w-[108px] h-[108px] achievement-rate2">
        <RateSvg2 :rate="`${item.achievementRate.toFixed(2)}%`"></RateSvg2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { achievementRateTypeMap, mainColorMap } from './config';
  import { pick } from 'lodash-es';

  import BarChart from './BarChart.vue';
  import PieChart from './PieChart.vue';
  import RateSvg from '/@/views/dashboard/operate/metricsCenter/components/DieCuttingUtilizationRate/chart/RateSvg.vue';
  import RateSvg2 from '../detail/RateSvg.vue';

  interface IProps {
    dataInfo: Record<string, any>[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    dataInfo: () => [],
  });

  // 获取停机原因分析数据信息
  const getPieInfo = info => {
    return info.analysList;
  };

  // 获取柱状图数据信息
  const getBarChartInfo = info => {
    const { machineType } = info;
    const infoKeys = ['machineType', 'above80', 'below30', 'sixtyToEighty', 'thirtyToSixty'];
    const mainColor = mainColorMap[machineType];
    return {
      mainColor,
      ...pick(info, infoKeys),
    };
  };
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  .dashboard-search-compo-header {
    min-height: auto !important;
    height: auto !important;
  }
  @media screen and (min-width: 1488px) {
    .achievement-rate2 {
      display: none;
    }
  }
  @media screen and (max-width: 1487px) {
    .achievement-rate {
      display: none;
    }
  }
</style>
