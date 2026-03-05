<!-- 单个图表模块组件 -->
<template>
  <div class="relative w-full">
    <img :src="contentBgSvg" class="w-full" />
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="w-full h-full py-[5%] px-[3%]">
        <component v-if="props.chartComponent" :is="props.chartComponent" :dataList="dataList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import contentBgSvg from '../contentBg.svg';

  interface IProps {
    chartComponent?: ComponentRef | null;
    dataList: any[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    chartComponent: null,
    dataList: () => [],
  });
</script>
