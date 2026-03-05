<!-- 进度条图表 -->
<template>
  <svg viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="31.9996" cy="31.3336" r="29.568" stroke="#E6E6E6" stroke-width="3" />
    <circle cx="32" cy="31" r="22.5" :fill="`url(#${info.circleFill})`" :stroke="`url(#${info.circleStroke})`" />

    <!-- 进度 -->
    <circle
      cx="31.9996"
      cy="31.3336"
      r="29.568"
      stroke-linecap="round"
      stroke-width="3"
      stroke-dasharray="0 1000"
      :stroke="info.process"
      transform="rotate(90 31.9996 31.3336)">
      <animate attributeName="stroke-dasharray" :values="`0 1000; ${dashLen} 1000`" dur="1s" begin="0s" fill="freeze" />
    </circle>

    <text x="32" y="32" font-size="15" font-weight="bold" fill="#1A1A1A" text-anchor="middle">{{ rate }}</text>
    <text x="32.5" y="44" font-size="9" font-weight="bold" fill="#1A1A1A" text-anchor="middle">%</text>
    <defs>
      <linearGradient id="paint0_linear_14581_51727" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop stop-color="#5EBEFF" stop-opacity="0.19" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear_14581_51727" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="0.815" stop-color="#B5E1FF" stop-opacity="0.19" />
        <stop offset="1" stop-color="#5EBEFF" stop-opacity="0.26" />
      </linearGradient>
      <linearGradient id="paint0_linear_14581_51736" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4B7BEC" stop-opacity="0.19" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear_14581_51736" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="0.815" stop-color="#B6CCFF" stop-opacity="0.19" />
        <stop offset="1" stop-color="#4B7BEC" stop-opacity="0.26" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { EColorId, colorInfo } from './config';

  const maxLen = 186;

  interface IProps {
    rate: number; // 达成百分比
    colorId?: EColorId; // 颜色样式
  }
  const props = withDefaults(defineProps<IProps>(), { rate: 100, colorId: EColorId.chanzhi });

  const info = computed(() => {
    const { colorId } = props;
    return colorInfo[colorId];
  });

  const dashLen = computed(() => {
    const { rate } = props;
    return Math.min((rate / 100) * maxLen, maxLen);
  });
</script>
