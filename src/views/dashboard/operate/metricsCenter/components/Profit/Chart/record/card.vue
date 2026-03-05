<template>
  <div class="card" :style="{ background: `linear-gradient(180deg, ${EColor[props.colorType]} 2.17%, #FFF 100%)` }">
    <div class="flex">
      <img :src="svgUrl" style="width: 20px; height: 20px" class="inline-block" />
      <span class="text-ellipsis sub-title" :title="`${currentMonth === '1' ? '1-1' : '1-' + currentMonth}月预计${props.keyWord}达成`">
        {{ currentMonth === '1' ? '1-1' : `1-${currentMonth}` }}月预计{{ props.keyWord }}达成
      </span>
    </div>
    <div class="total-value">{{ props.totalValue || 0 }}%</div>
    <img
      :src="pngUrl"
      :style="{
        width: `${pngSize}px`,
        height: `${pngSize}px`,
        position: 'absolute',
        bottom: `${50 - pngSize}px`,
        right: `${50 - pngSize}px`,
      }" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { EColor, EColorSvg, EColorPng } from '../config';
  import { propOptions } from './config';

  const props = defineProps(propOptions);

  const svgUrl = computed(() => EColorSvg[props.colorType] as unknown as string);

  const pngUrl = computed(() => EColorPng[props.colorType] as unknown as string);

  const pngSize = computed(() => (props.colorType === 'blue' ? 37 : 50));
</script>

<style scoped lang="less">
  .card {
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);
    border-radius: 4px;
    border: 1px solid #fdfdfd;
    height: 100%;
    padding: 14px 11px;
    font-size: 12px;
    position: relative;
  }

  .sub-title {
    font-size: 12px;
    margin-left: 6px;
    display: inline-block;
  }

  .total-value {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    color: #1a1a1a;
    padding-left: 26px;
    position: relative;
    z-index: 1;
  }
</style>
