<!-- svg图 -->
<template
  ><svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="37.9998" cy="37.9998" r="29.7" stroke="#E6E6E6" stroke-width="0.9" />
    <!-- 进度条 -->
    <circle
      cx="37.9998"
      cy="37.9998"
      r="29.7"
      :stroke="`url(#paint0_linear_15266_36631_${props.type})`"
      stroke-width="4"
      stroke-dashoffset="2"
      transform="rotate(-123 37.9998 37.9998)">
      <animate attributeName="stroke-dasharray" :from="`0 ${circumference}`" :to="`${process} ${circumference}`" dur="500ms" fill="freeze" />
    </circle>

    <circle cx="38.0002" cy="38.0002" r="37.3275" stroke="#4B7BEC" stroke-opacity="0.3" stroke-width="0.945" stroke-dasharray="1.89 1.89" />
    <!-- 白色标点 -->
    <g filter="url(#filter0_d_15266_36631)">
      <rect x="18.9663" y="11.4888" width="5.4" height="1.8" rx="0.9" transform="rotate(60 18.9663 11.4888)" fill="white" />
      <animateTransform attributeName="transform" type="rotate" from="0 37.8 37.8" :to="`${processAngle} 37.8 37.8`" dur="500ms" fill="freeze" />
    </g>
    <circle
      cx="37.9998"
      cy="37.9998"
      r="22.25"
      :fill="`url(#paint1_linear_15266_36631_${props.type})`"
      :stroke="`url(#paint2_linear_15266_36631_${props.type})`"
      stroke-width="0.9" />
    <!-- 数值 -->
    <text
      x="38"
      y="36.5"
      font-size="13"
      font-weight="bold"
      fill="#1A1A1A"
      text-anchor="middle"
      :class="{ 'text-hover': props.tapMth }"
      @click="props.tapMth && props.tapMth()">
      {{ value }}
    </text>
    <text x="38" y="51" font-size="10" font-weight="bold" fill="#1A1A1A" text-anchor="middle">%</text>
    <defs>
      <filter
        id="filter0_d_15266_36631"
        x="13.8668"
        y="7.94787"
        width="11.3401"
        height="12.658"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="1.935" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.193333 0 0 0 0 0.352833 0 0 0 0 0.725 0 0 0 0.26 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15266_36631" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15266_36631" result="shape" />
      </filter>
      <linearGradient :id="`paint0_linear_15266_36631_${props.type}`" x1="30%" y1="100%" x2="0%" y2="-20%">
        <stop :stop-color="mainColor" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient :id="`paint1_linear_15266_36631_${props.type}`" x1="37.9998" y1="17.2998" x2="37.9998" y2="58.6998" gradientUnits="userSpaceOnUse">
        <stop :stop-color="mainColor" stop-opacity="0.28" />
        <stop offset="0.475" stop-color="white" stop-opacity="0" />
        <stop offset="1" :stop-color="mainColor" stop-opacity="0.28" />
      </linearGradient>
      <linearGradient :id="`paint2_linear_15266_36631_${props.type}`" x1="37.9998" y1="17.2998" x2="37.9998" y2="58.6998" gradientUnits="userSpaceOnUse">
        <stop :stop-color="mainColor" stop-opacity="0.28" />
        <stop offset="0.565" stop-color="white" stop-opacity="0" />
        <stop offset="1" :stop-color="mainColor" stop-opacity="0.28" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { ERateSvgType } from './types';

  interface IProps {
    type: ERateSvgType;
    value: string | number;
    tapMth?: Function;
  }
  const props = withDefaults(defineProps<IProps>(), {
    type: ERateSvgType.NUD,
    value: '80%',
  });
  const radius = 29.7;
  const circumference = 2 * Math.PI * radius;

  const value = computed(() => {
    return Number.parseFloat(props.value).toFixed(1);
  });

  // 进度条白点进度角度
  const processAngle = computed(() => {
    const rateAngle = (Number.parseFloat(props.value) / 100) * 360;
    return Math.min(rateAngle, 360);
  });

  // 进度条进度
  const process = computed(() => {
    const dashLen = (Number.parseFloat(props.value) / 100) * circumference;
    return Math.min(dashLen, circumference);
  });

  // 主题颜色
  const mainColor = computed(() => {
    switch (props.type) {
      case ERateSvgType.NUD:
        return '#4D7DEC';
      case ERateSvgType.NON_NUD:
        return '#5ABCFE';
      case ERateSvgType.DAILY_ACHIEVEMENT_RATE:
        return '#FF7B00';
      default:
        return '#4D7DEC';
    }
  });
</script>
