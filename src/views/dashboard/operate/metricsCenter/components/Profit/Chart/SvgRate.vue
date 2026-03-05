<!-- 损益图表累计达成 -->
<template>
  <svg viewBox="0 0 133 133" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="66.3999" cy="66.4009" r="48" stroke="#E6E6E6" stroke-width="7.2" />
    <path
      :id="`profit_rate_${rate}`"
      d="M18.5929 62.0669C20.7836 37.588 41.351 18.4009 66.3999 18.4009C92.9095 18.4009 114.4 39.8912
  114.4 66.4009C114.4 92.9105 92.9095 114.401 66.3999 114.401C41.351 114.401 20.7836 95.2137 18.5929
  70.7349C18.5434 70.1815 18.5032 69.6255 18.4727 69.0669"
      :stroke="`url(#${props.colorId})`"
      stroke-width="7.2"
      stroke-linecap="round"
      :stroke-dasharray="`${dashLen} 1000`">
      <animate attributeName="stroke-dasharray" :from="`0 1000`" :to="`${dashLen} 1000`" dur="1000ms" fill="freeze" />
    </path>
    <circle cx="66.3996" cy="66.4011" r="40.8" stroke="#C2E1F6" stroke-opacity="0.58" stroke-width="2.4" />
    <text x="68" y="56" font-size="17" font-weight="bolder" fill="#000" text-anchor="middle">{{ props.rate }}%</text>
    <text x="68" y="75" font-size="12" fill="#666" text-anchor="middle">
      {{ currentMonth === 1 ? '1月累计' : `1-${currentMonth}月累计` }}
    </text>
    <text x="68" y="92" font-size="12" fill="#666" text-anchor="middle">
      {{ dcText }}
    </text>
    <defs>
      <linearGradient id="paint0_linear_12845_45297" x1="8.6946" y1="76.6973" x2="66.7928" y2="125.862" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D3EDFE" stop-opacity="0.62" />
        <stop offset="1" stop-color="#5EBEFF" />
      </linearGradient>
      <linearGradient id="paint0_linear_12797_33991" x1="8.6946" y1="76.6973" x2="66.7928" y2="125.862" gradientUnits="userSpaceOnUse">
        <stop stop-color="#C6D7FD" stop-opacity="0.62" />
        <stop offset="1" stop-color="#4D7DEC" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { ERateColorId } from './config';

  interface IProps {
    rate: number; // 达成百分比
    currentMonth: number; // 当前月份
    colorId?: ERateColorId; // 颜色样式
    dcText?: string; // 文字
  }
  const props = withDefaults(defineProps<IProps>(), {
    rate: 0,
    currentMonth: 1,
    colorId: ERateColorId.blue,
    dcText: '产值达成',
  });
  const dashLen = computed(() => {
    const { rate } = props;
    return (rate / 100) * 295;
  });
</script>
