<!-- 模切工等级分布图表 -->
<template>
  <div class="compo-content-container">
    <div class="compo-content-wrapper">
      <div class="title-wrapper">模切工等级分布</div>
      <div class="sub-title-wrapper flex ct-between">
        <span>出勤/在职/总数</span>
        <span>在职占比</span>
      </div>
      <!-- 饼图 -->
      <div class="pie-wrapper flex">
        <highcharts :options="chartOptions" style="height: 30vh; width: 100%" />
      </div>
      <div class="pie-legend-wrapper flex all-start">
        <div v-for="(item, idx) in legendInfo" :key="idx" class="item flex ct-between text-hover" @click="onLegendClick(item.Department)">
          <div style="color: #666" class="flex ct-between">
            <span class="legend" :style="{ backgroundColor: item.color }"></span>
            {{ item.Department }}:
            <span>{{ item.CQNum }}/{{ item.ZZNum }}/{{ allZZNum }}</span>
          </div>
          <span class="mr-8px">{{ ((item.ZZNum / allZZNum) * 100).toFixed(2) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { basePieOptions } from './config';
  import { cloneDeep, merge } from 'lodash-es';

  const emits = defineEmits(['update:skillLevel']);

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
  });

  interface ILegendInfo {
    CQNum: number;
    ZZNum: number;
    Department: string;
    color: string;
  }
  let chartOptions = {};
  const allZZNum = ref(0);
  const legendInfo = ref<ILegendInfo[]>([]);

  // 点击图例
  const onLegendClick = department => {
    emits('update:skillLevel', department); // 向父组件传递点击的数据
  };

  watch(
    () => props.info,
    newValue => {
      const colors = ['#4B7BEC', '#58A7B9', '#46AAF2', '#EFC56C', '#E08D73', '#00A0AA', '#4BAF7F', '#884BEC'];
      legendInfo.value = newValue.map((item, idx) => ({
        CQNum: item.CQNum,
        ZZNum: item.ZZNum,
        Department: item.Department,
        color: colors[idx],
      }));
      allZZNum.value = unref(legendInfo).reduce((pre, cur) => (pre += cur.ZZNum), 0);
      const handlePieOptions = {
        series: [
          {
            data: unref(legendInfo).map((item, idx) => ({
              y: item.ZZNum,
              name: item.Department,
              color: colors[idx],
            })),
          },
        ],
      };
      chartOptions = merge(cloneDeep(basePieOptions), handlePieOptions);
    },
    { immediate: true, deep: true },
  );
</script>

<style lang="less" scoped>
  @titleHeight: 44px;

  .compo-content-container {
    width: 100%;
    height: 100%;
    background: #fff;
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }

  .compo-content-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;

    .sub-title-wrapper {
      width: calc(50% - 8px);
      margin: -12px 0 4px;
    }

    .title-wrapper {
      color: #1a1a1a;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      height: @titleHeight;
    }

    .pie-wrapper {
      position: absolute;
      z-index: 1;
      top: 30%;
      width: 90%;
      height: 69.5%;
      overflow: hidden;
    }

    .pie-legend-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      flex-wrap: wrap;

      .item {
        position: relative;
        z-index: 1;
        width: 50%;
        color: #666;
        font-size: 13px;

        .legend {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 2px;
        }
      }
    }
  }
</style>
<style lang="less">
  .uptime-center-tooltips {
    .content-container {
      color: #1a1a1a;
      font-size: 14px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
      font-style: normal;
      font-weight: 400;

      .item-container {
        width: 282px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin: 6px 12px 6px 0;

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
