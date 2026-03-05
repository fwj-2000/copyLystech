<!-- 基础图表信息 -->
<template>
  <div class="compo-content-container" id="uptimeChart">
    <div class="compo-content-wrapper">
      <div class="title-wrapper mb-16px">DL出勤率</div>
      <Chart :options="state.barOptions" height="100%" width="100%" class="chart-wrapper" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { Chart } from '/@/components/Chart';

  import { barOptions } from './config';
  import { cloneDeep, flatten, merge } from 'lodash-es';

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
  });
  const state = reactive({
    barOptions: {},
  });

  watch(
    () => props.info,
    () => {
      const handleOptions = {
        xAxis: { data: props.info.xAxisData },
        series: [
          {
            data: props.info.rateData,
            dimensions: props.info.legendData,
          },
          ...flatten(props.info.seriesData),
        ],
      };
      // 处理过后填充的数据
      state.barOptions = merge(cloneDeep(barOptions), handleOptions);
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  .compo-content-container {
    height: 300px;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.05);

    .compo-content-wrapper {
      width: 100%;
      height: 100%;
      padding: 16px;

      .title-wrapper {
        color: #1a1a1a;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 14px;
        letter-spacing: 0.64px;
      }

      .chart-wrapper {
        height: 100%;
        overflow-x: auto;
      }
    }
  }
</style>

<style lang="less">
  .dlchart-tooltips {
    width: 312px;

    .header-container {
      color: #1a1a1a;
      font-size: 18px;
    }

    .content-container {
      height: 100%;
      gap: 12px;

      .head-container {
        width: 200px;
        color: #1a1a1a;
      }

      .item-container {
        width: 100%;
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

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
