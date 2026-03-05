<!-- 损益图表 -->
<template>
  <div class="compo-container flex flex-col justify-start">
    <!-- 产值达成 -->
    <Record
      class="flex-1"
      colorType="purple"
      keyWord="产值"
      :currentMonth="currentMonth"
      :currentMonthValue="info.gapOutputValue"
      :totalValue="info.totalGapOutputValue"
      :reduceValue="info.reduceGapOutputValue"
      :isShowRedRate="info.outputValueFlag"
      :info="info" />
    <!-- 分割线 -->
    <div class="split my-8px"></div>
    <!-- 净利达成 -->
    <Record
      class="flex-1"
      colorType="blue"
      keyWord="净利"
      :currentMonth="currentMonth"
      :currentMonthValue="info.gapNetProfit"
      :totalValue="info.totalGapNetProfit"
      :reduceValue="info.reduceGapNetProfit"
      :isShowRedRate="info.netProfitFlag"
      :info="info" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import Record from './record/index.vue';

  const props = defineProps<{
    info: any;
    extraInfo: Record<string, any>;
  }>();

  // 保留一位小数
  const formatRateValue = value => {
    if (!value) return 0;
    return Number.parseFloat(value.toFixed(1));
  };

  const info = computed(() => {
    const source = props.info || {};
    return Object.keys(source).reduce((obj, key) => {
      const value = source[key];
      return {
        ...obj,
        [key]: typeof value === 'number' ? formatRateValue(value) : value,
      };
    }, {});
  });

  const currentMonth = computed(() => {
    return props.extraInfo.currentMonth || '1';
  });
</script>

<style lang="less" scoped>
  @legendHeight: 53px;

  .compo-container {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    overflow: hidden;

    .split {
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    }
  }
</style>
