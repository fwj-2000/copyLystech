<template>
  <div class="flex relative items-center justify-center">
    <svg viewBox="0 0 83 82.2578" xmlns="http://www.w3.org/2000/svg" width="83" height="82.25" fill="none" class="svg-container">
      <defs>
        <linearGradient id="paint_linear_0" x1="6.24645996" x2="-6.02956581" y1="7.62939453e-06" y2="90.9540024" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgb(77,125,236)" offset="0" stop-opacity="1" />
          <stop stop-color="rgb(255,255,255)" offset="1" stop-opacity="1" />
        </linearGradient>

        <clipPath id="circleClip">
          <ellipse cx="41.724" cy="44.681" rx="30.49" ry="30.49" />
        </clipPath>
      </defs>

      <circle id="circle 4802" cx="41.87" cy="44.87" r="36.82" stroke="rgb(207,213,233)" stroke-width="1.11" />

      <path
        id="Ellipse 4803"
        d="M4.81693 4.68638C8.07485 2.38827 11.5942 0.62958 15.3751 -0.589701C19.2828 -1.8499 23.3079 -2.48 27.4504 -2.48C32.7808 -2.48 37.8812 -1.44999 42.7516 0.610037C47.4547 2.59925 51.6193 5.40692 55.2454 9.03305C58.8715 12.6592 61.6792 16.8237 63.6684 21.5268C65.7284 26.3972 66.7584 31.4976 66.7584 36.828C66.7584 42.1584 65.7284 47.2588 63.6684 52.1292C61.6792 56.8322 58.8715 60.9968 55.2454 64.623C51.6193 68.2491 47.4547 71.0568 42.7516 73.046C37.8812 75.106 32.7808 76.136 27.4504 76.136C21.7336 76.136 16.2945 74.9571 11.1333 72.5992C6.14817 70.3217 1.8211 67.1333 -1.84794 63.034L1.84793 59.7261C5.0559 63.3103 8.83804 66.0975 13.1943 68.0876C17.7011 70.1466 22.4531 71.176 27.4504 71.176C32.1102 71.176 36.5666 70.2766 40.8195 68.4778C44.9285 66.7398 48.5681 64.2858 51.7381 61.1157C54.9082 57.9456 57.3623 54.3061 59.1002 50.197C60.899 45.9442 61.7984 41.4878 61.7984 36.828C61.7984 32.1682 60.899 27.7118 59.1002 23.459C57.3622 19.3499 54.9082 15.7104 51.7381 12.5403C48.5681 9.37022 44.9285 6.91619 40.8195 5.17822C36.5666 3.37941 32.1103 2.48 27.4504 2.48C23.8279 2.48 20.3102 3.0303 16.8974 4.1309C13.596 5.19556 10.5222 6.73175 7.67595 8.73948L4.81693 4.68638ZM-1.83459 63.0489L-3.50188 61.186L0.193985 57.8781L1.86127 59.741L-1.83459 63.0489ZM7.6923 8.72795L5.6494 10.169L2.79038 6.11589L4.83328 4.67485L7.6923 8.72795Z"
        fill="url(#paint_linear_0)"
        fill-rule="nonzero"
        transform="matrix(-0.5,-0.866025,0.866025,-0.5,23.2949,86.1582)" />
      <!-- 装饰性白色矩形 -->
      <g filter="url(#filter_0)">
        <rect
          id="Rectangle 34625281"
          width="8.696000"
          height="2.232000"
          x="0.000000"
          y="0.000000"
          rx="1.116000"
          fill="rgb(255,255,255)"
          transform="matrix(0.5,0.866026,-0.866025,0.5,18.2695,11.9961)" />
      </g>
      <g clip-path="url(#circleClip)">
        <ellipse id="Ellipse 186" rx="30.493587" ry="30.493584" cx="41.7240562" cy="44.6810837" fill="rgb(93,111,212)" fill-opacity="0.1" />
        <g
          :style="{
            transform: `translateY(${translateYValue}px)`,
            transition: 'transform 1s ease-out',
          }">
          <path class="wave wave-primary" :d="wavePathPrimary" :style="{ animationDuration: `${duration}s` }" fill="rgb(78,136,245)" />
          <path class="wave wave-secondary" :d="wavePathSecondary" :style="{ animationDuration: `${duration * 1.6}s` }" fill="rgb(78,136,245)" opacity="0.3" />
        </g>
      </g>
    </svg>
    <span class="absolute font-bold bottom-4">{{ props.percentage }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    percentage: string;
    amplitude?: number;
    duration?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    percentage: '0%',
    amplitude: 10, //波浪振幅
    duration: 3, //波浪持续时间
  });

  const safePercentage = computed(() => {
    const numericValue = Number.parseInt(props.percentage) || 0;
    return Math.min(Math.max(numericValue, 0), 100);
  });

  // --- 关键优化：水位偏移逻辑 ---
  const translateYValue = computed(() => {
    const startY = 40; // 0% 时的基础高度
    const endY = -25; // 100% 时的基础高度

    let y = startY - (safePercentage.value / 100) * (startY - endY);
    if (safePercentage.value === 0) return y; // 百分比为 0 时，禁止波浪
    if (safePercentage.value < 15) {
      // 优化：当百分比低于 15% 时，水位稍微向上提一点点（约 2-4px）
      // 这样波浪的“浪尖”就能露出来
      const adjustment = (15 - safePercentage.value) * 0.3;
      y -= adjustment;
    }

    // 同理：如果 100% 时溢出太厉害，也可以做微调
    if (safePercentage.value > 95) {
      y += (safePercentage.value - 95) * 0.2;
    }
    return y;
  });

  // --- 关键优化：动态振幅 ---
  // 当百分比在 0% 或 100% 边缘时，自动收敛波浪高度，防止视觉生硬
  const dynamicAmplitude = computed(() => {
    if (safePercentage.value < 5) return props.amplitude * 0.6; // 0% 附近浪小一点
    if (safePercentage.value > 95) return props.amplitude * 0.4; // 100% 附近浪小一点
    return props.amplitude;
  });

  const wavePathPrimary = computed(() => {
    const amp = dynamicAmplitude.value;
    const base = 40;
    return `M 0 ${base} Q 20 ${base - amp} 40 ${base} T 80 ${base} Q 100 ${base - amp} 120 ${base} T 160 ${base} L 160 100 L 0 100 Z`;
  });

  const wavePathSecondary = computed(() => {
    const amp = dynamicAmplitude.value;
    const base = 42;
    return `M 0 ${base} Q 20 ${base + amp} 40 ${base} T 80 ${base} Q 100 ${base + amp} 120 ${base} T 160 ${base} L 160 100 L 0 100 Z`;
  });
</script>

<style scoped>
  .wave {
    animation: waveMove linear infinite;
    will-change: transform;
  }

  .wave-secondary {
    animation-delay: -2s;
  }

  @keyframes waveMove {
    from {
      transform: translateX(0);
    }

    to {
      /* 位移 80px 对应路径中的一个完整波浪周期 */
      transform: translateX(-80px);
    }
  }

  .svg-container {
    overflow: visible;
  }
</style>
