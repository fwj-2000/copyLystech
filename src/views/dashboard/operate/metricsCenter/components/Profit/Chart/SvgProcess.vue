<template>
  <svg viewBox="0 0 257 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 0.5H256.5V13.5H0.5V0.5Z" stroke="url(#paint0_linear_12797_33963)" />
    <path :id="`profit_rate_${rate}`" :d="`M1,7 L${dashLen},7`" :stroke="`url(#${props.colorId})`" stroke-width="9" stroke-dasharray="23.5,2.2">
      <animate attributeName="d" from="M1,7 L0, 7" :to="`M1,7 L${dashLen}, 7`" dur="1000ms" fill="freeze" />
    </path>
    <defs>
      <linearGradient id="paint0_linear_12797_33963" x1="0" y1="7" x2="280.321" y2="7" gradientUnits="userSpaceOnUse">
        <stop stop-color="#57B3F1" stop-opacity="0.28" />
        <stop offset="1" stop-color="#C9E0EF" stop-opacity="0.74" />
      </linearGradient>
      <linearGradient id="paint1_linear_12797_33963" x1="118" y1="6.83396" x2="-40" y2="6.83396" gradientUnits="userSpaceOnUse">
        <stop stop-color="#5EBEFF" />
        <stop offset="1" stop-color="white" stop-opacity="0.51" />
      </linearGradient>
      <linearGradient id="paint1_linear_12797_33977" x1="118" y1="6.83396" x2="-40" y2="6.83396" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4B7BEC" />
        <stop offset="1" stop-color="white" stop-opacity="0.51" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { EProcessColorId } from './config';

  interface IProps {
    rate: number; // 达成百分比
    colorId?: EProcessColorId; // 颜色样式
  }
  const props = withDefaults(defineProps<IProps>(), { rate: 0, colorId: EProcessColorId.blue });
  const dashLen = computed(() => {
    const { rate } = props;
    return Math.min((rate / 100) * 257, 257);
  });
</script>
