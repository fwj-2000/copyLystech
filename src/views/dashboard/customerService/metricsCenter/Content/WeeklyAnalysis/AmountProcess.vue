<!-- 金额进度组件 -->
<template>
  <svg viewBox="0 0 248 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image x="0" y="0" :href="amountBgImg" with="248" height="16"></image>
    <g :mask="`url(#mask01_${maskWidth})`">
      <image x="0" y="0" :href="infoImg" with="248" height="16"></image>
    </g>
    <mask :id="`mask01_${maskWidth}`">
      <rect x="0" y="0" height="16" fill="#fff">
        <animate attributeName="width" :values="`0;${maskWidth}`" dur="1s" fill="freeze" />
      </rect>
    </mask>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { EAmountColor } from './types';
  import amountBgImg from '/@/assets/images/fc/amount_bg.png';
  import amountGreyImg from '/@/assets/images/fc/amount_grey.png';
  import amountYellowImg from '/@/assets/images/fc/amount_yellow.png';

  const props = defineProps({
    color: {
      type: String as PropType<EAmountColor>,
      default: EAmountColor.GREY,
    },
    rate: {
      type: Number,
      default: 50,
    },
  });

  const infoImg = computed(() => {
    return props.color === EAmountColor.GREY ? amountGreyImg : amountYellowImg;
  });
  const maskWidth = computed(() => {
    return Math.floor((props.rate / 100) * 50) * 5.5;
  });
</script>
