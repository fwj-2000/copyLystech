<!-- 出勤概况 -->
<template>
  <div class="compo-container flex column all-start">
    <div class="compo-body">
      <div class="title flex row ct-between" @click="goDetail">
        <span> {{ t('views.dashboard.operate.todaySDieCuttingCrops') }}</span>
        <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
      </div>
    </div>
    <div class="charts-container flex row">
      <Chart :options="state.pieOptions" height="100%" class="left-chart" />
      <Chart :options="state.options" height="100%" class="right-chart" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, merge } from 'lodash-es';
  import vectorSvg from '/@/assets/svg/report/vector.svg';
  import { baseOptions, basePieOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const { t } = useI18n();
  const state = reactive({
    options: {},
    pieOptions: {},
  });
  const handleOptions = {}; // 处理过后填充的数据

  state.options = merge(cloneDeep(baseOptions), handleOptions);
  state.pieOptions = merge(cloneDeep(basePieOptions), handleOptions);
  const goDetail = () => {
    go('/dashboard/operate/metricsCenter/detail/dieCutCropDetails');
  };
</script>

<style lang="less" scoped>
  .compo-container {
    position: relative;
    width: 100%;
    height: @report-operate-compo-height;
    border-radius: 3px;
    background: #fff;
    padding: 6px 0;
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);

    .charts-container {
      width: 100%;
      height: calc(100% - @report-operate-compo-title-height);
      padding: 0 6px;

      .left-chart {
        width: 75%;
        height: 100%;
      }

      .right-chart {
        width: 25%;
        height: 100%;
      }
    }

    .compo-body {
      width: 100%;

      .title {
        width: 100%;
        cursor: pointer;
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        height: @report-operate-compo-title-height;
        padding: 0 16px;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
</style>
