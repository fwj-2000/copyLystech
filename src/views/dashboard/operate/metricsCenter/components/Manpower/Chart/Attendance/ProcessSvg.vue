<!-- 进度图表 -->
<template>
  <div class="flex flex-col">
    <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g v-for="(item, idx) in props.processInfo" :key="idx">
        <circle
          :cx="item.cx"
          :cy="item.cy"
          :r="item.r"
          :stroke="`url(#${item.linearId})`"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="`${getCircumference(item.r)},1000`"
          :stroke-dashoffset="getOffset(item.r, item.rate)" />
        <circle
          :cx="item.cx"
          :cy="item.cy"
          :r="item.r"
          :stroke="`url(#${item.linearId})`"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="`${getCircumference(item.r)},1000`"
          :stroke-dashoffset="getOffset(item.r, item.rate)"
          transform-origin="28.9996 29.3341"
          transform="scale(1, -1)" />
      </g>
      <defs>
        <linearGradient id="paint0_linear_14183_36074" x1="-5.87308" y1="28.1622" x2="31.9601" y2="60.8984" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D3EDFE" stop-opacity="0.62" />
          <stop offset="1" stop-color="#5EBEFF" />
        </linearGradient>
        <linearGradient id="paint1_linear_14183_36074" x1="13.1887" y1="16.2263" x2="26.4149" y2="38.2018" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ECCFFF" stop-opacity="0.48" />
          <stop offset="1" stop-color="#B082EA" />
        </linearGradient>
        <linearGradient id="paint2_linear_14183_36074" x1="-24.1802" y1="-4.69719" x2="-29.3719" y2="43.1556" gradientUnits="userSpaceOnUse">
          <stop stop-color="#C6D7FD" stop-opacity="0.48" />
          <stop offset="1" stop-color="#4D7DEC" />
        </linearGradient>
        <linearGradient id="paint3_linear_14183_36074" x1="-7.25458" y1="7.71017" x2="12.3044" y2="48.1416" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E4FFE6" stop-opacity="0.48" />
          <stop offset="1" stop-color="#71D375" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  interface IProps {
    processInfo: Record<string, any>[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    processInfo: () => [],
  });

  // 定义计算圆周长的函数
  const getCircumference = radius => {
    return Number.parseFloat((Math.PI * radius).toFixed(2));
  };

  const getOffset = (r, rate) => {
    const round = getCircumference(r) * 1;
    const res = round - round * rate;
    return 2 + res; // 偏移两个像素
  };
</script>
