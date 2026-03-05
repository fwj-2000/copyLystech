<!-- 金额进度组件 -->
<template>
  <svg viewBox="0 0 646 11" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image x="0" y="0" :href="bgImg" with="646" height="11"></image>
    <g :mask="`url(#mask01_${maskWidth})`">
      <image x="0" y="0" :href="infoImg" with="646" height="11"></image>
    </g>
    <mask :id="`mask01_${maskWidth}`">
      <rect x="0" y="0" height="11" fill="#fff">
        <animate attributeName="width" :values="`0;${maskWidth}`" dur="1s" fill="freeze" />
      </rect>
    </mask>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { EProcessColor } from './types';
  import bgImg from '/@/assets/images/fc/process_bg.png';
  import greyImg from '/@/assets/images/fc/process_grey.png';
  import blueImg from '/@/assets/images/fc/process_blue.png';

  const props = defineProps({
    color: {
      type: String as PropType<EProcessColor>,
      default: EProcessColor.GREY,
    },
    rate: {
      type: Number,
      default: 50,
    },
  });

  const infoImg = computed(() => {
    return props.color === EProcessColor.GREY ? greyImg : blueImg;
  });
  const maskWidth = computed(() => {
    const res = (props.rate / 100) * 646;
    return res;
  });
</script>
