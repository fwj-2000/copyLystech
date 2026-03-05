<!-- 客诉数图表 -->
<template>
  <svg viewBox="0 0 150 149" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_5552_29248" maskUnits="userSpaceOnUse" x="18" y="24" width="114" height="114">
      <circle cx="75" cy="81" r="50" fill="white" />
      <rect x="72" y="24" width="6" height="36" fill="black"></rect>
      <rect x="72" y="24" width="6" height="36" fill="black" :transform="`rotate(${normal.maskRate}, 75, 81)`"></rect>
    </mask>
    <g mask="url(#mask0_5552_29248)">
      <g filter="url(#filter0_i_5552_29248)">
        <circle cx="75" cy="81" r="50" fill="white" />
      </g>
    </g>
    <mask id="mask1_5552_29248" maskUnits="userSpaceOnUse" x="14" y="0" width="124" height="148">
      <!-- 一般客诉进度条控制 -->
      <circle cx="75" cy="81" r="50" fill="transparent" stroke="white" stroke-width="14" :transform="`rotate(${normal.rotate}, 75, 81)`">
        <animate
          attributeName="stroke-dasharray"
          :from="`0 ${circleCircumference}`"
          :to="`${normal.dashLen} ${circleCircumference}`"
          dur="500ms"
          fill="freeze" />
      </circle>
      <rect x="72" y="24" width="6" height="36" fill="black"></rect>
      <rect x="72" y="24" width="6" height="36" fill="black" :transform="`rotate(${normal.maskRate}, 75, 81)`"></rect>
    </mask>
    <g mask="url(#mask1_5552_29248)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M75 131C102.614 131 125 108.614 125 81C125 53.3858 102.614 31 75 31C47.3858 31 25 53.3858 25 81C25 108.614 47.3858 131 75 131ZM75 126C99.8528 126 120 105.853 120 81C120 56.1472 99.8528 36 75 36C50.1472 36 30 56.1472 30 81C30 105.853 50.1472 126 75 126Z"
        fill="#0037B9"
        fill-opacity="0.15" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M75 138C106.48 138 132 112.48 132 81C132 49.5198 106.48 24 75 24C43.5198 24 18 49.5198 18 81C18 112.48 43.5198 138 75 138ZM75 131C102.614 131 125 108.614 125 81C125 53.3858 102.614 31 75 31C47.3858 31 25 53.3858 25 81C25 108.614 47.3858 131 75 131Z"
        fill="url(#paint0_linear_5552_29248)" />
    </g>
    <mask id="mask2_5552_29248" maskUnits="userSpaceOnUse" x="14" y="0" width="124" height="148">
      <!-- 严重客诉进度条控制 -->
      <circle cx="75" cy="81" r="50" fill="transparent" stroke="white" stroke-width="14" transform="rotate(-90, 75, 81)">
        <animate
          attributeName="stroke-dasharray"
          :from="`0 ${circleCircumference}`"
          :to="`${serious.dashLen} ${circleCircumference}`"
          dur="500ms"
          fill="freeze" />
      </circle>
      <rect x="72" y="24" width="6" height="36" fill="black"></rect>
      <rect x="72" y="24" width="6" height="36" fill="black" :transform="`rotate(${normal.maskRate}, 75, 81)`"></rect>
    </mask>
    <g mask="url(#mask2_5552_29248)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M75 131C102.614 131 125 108.614 125 81C125 53.3858 102.614 31 75 31C47.3858 31 25 53.3858 25 81C25 108.614 47.3858 131 75 131ZM75 126C99.8528 126 120 105.853 120 81C120 56.1472 99.8528 36 75 36C50.1472 36 30 56.1472 30 81C30 105.853 50.1472 126 75 126Z"
        fill="#9A6900"
        fill-opacity="0.17" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M75 138C106.48 138 132 112.48 132 81C132 49.5198 106.48 24 75 24C43.5198 24 18 49.5198 18 81C18 112.48 43.5198 138 75 138ZM75 131C102.614 131 125 108.614 125 81C125 53.3858 102.614 31 75 31C47.3858 31 25 53.3858 25 81C25 108.614 47.3858 131 75 131Z"
        fill="url(#paint1_linear_5552_29248)" />
    </g>
    <circle cx="75" cy="81" r="35.5" fill="url(#paint2_linear_5552_29248)" stroke="url(#paint3_linear_5552_29248)">
      <animateTransform attributeName="transform" type="rotate" values="0 75 81;-360 75 81" calcMode="linear" dur="2s" repeatCount="indefinite" />
    </circle>
    <g>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.0402 27.8938C8.42484 41.4719 0 60.2521 0 80.9999C0 101.859 8.51503 120.728 22.2587 134.323L24.3255 126.917C13.3215 114.78 6.61723 98.673 6.61723 81C6.61723 63.4414 13.235 47.4285 24.1124 35.3193L22.0402 27.8938ZM124.907 127.749C136.365 115.521 143.382 99.0799 143.382 81C143.382 63.0333 136.453 46.685 125.121 34.4814L127.175 27.1226C141.251 40.7562 150 59.8563 150 80.9999C150 102.253 141.16 121.442 126.955 135.089L124.907 127.749Z"
        fill="url(#paint4_linear_5552_29248)" />
      <rect x="20.6104" y="26.4463" width="2" height="11" rx="1" transform="rotate(-15 20.6104 26.4463)" fill="#D9DFED" />
      <rect width="2" height="11" rx="1" transform="matrix(-0.965926 -0.258819 -0.258819 0.965926 128.39 25.4463)" fill="#D9DFED" />
      <rect x="123.61" y="125.446" width="2" height="11" rx="1" transform="rotate(-15 123.61 125.446)" fill="#CCD6EB" fill-opacity="0.42" />
      <rect width="2" height="11" rx="1" transform="matrix(-0.965926 -0.258819 -0.258819 0.965926 25.3896 125.446)" fill="#CCD6EB" fill-opacity="0.42" />
    </g>
    <!-- 文本 -->
    <text x="75" y="75" font-size="14" fill="#1A1A1A" text-anchor="middle">{{ props.name }}</text>
    <text x="75" y="95" font-size="14" fill="#1A1A1A" text-anchor="middle" class="text-hover" @click="props.goDetail({})">{{ props.complaintsNum }}</text>
    <defs>
      <filter id="filter0_i_5552_29248" x="25" y="31" width="100" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="1.75" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="darken" in2="shape" result="effect1_innerShadow_5552_29248" />
      </filter>
      <linearGradient id="paint0_linear_5552_29248" x1="63" y1="24" x2="132" y2="81" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6D94F0" />
        <stop offset="1" stop-color="#6DA1F0" />
      </linearGradient>
      <linearGradient id="paint1_linear_5552_29248" x1="75" y1="24" x2="132" y2="81" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F0C873" />
        <stop offset="1" stop-color="#F1B672" />
      </linearGradient>
      <linearGradient id="paint2_linear_5552_29248" x1="75" y1="45" x2="75" y2="117" gradientUnits="userSpaceOnUse">
        <stop stop-color="#CCDBFF" stop-opacity="0.51" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="paint3_linear_5552_29248" x1="75" y1="45" x2="75" y2="117" gradientUnits="userSpaceOnUse">
        <stop stop-color="#C4D1FE" stop-opacity="0.895" />
        <stop offset="0.185" stop-color="#BDD1FE" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="paint4_linear_5552_29248" x1="75" y1="27.1226" x2="75" y2="150" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E1E8FB" stop-opacity="0.66" />
        <stop offset="1" stop-color="#F7F8FC" stop-opacity="0.49" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  const props = defineProps({
    rate: {
      type: Number,
      default: 30,
    },
    complaintsNum: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    orgCode: {
      type: String,
      default: '',
    },
    goDetail: {
      type: Function,
      default: () => {},
    },
  });

  const circleCircumference = 314;
  // 严重客诉进度条控制
  const serious = computed(() => {
    const res = {
      dashLen: circleCircumference - (circleCircumference * (100 - props.rate)) / 100,
    };
    return res;
  });
  // 一般客诉进度条控制
  const normal = computed(() => {
    const res = {
      rotate: Math.min((props.rate * 360) / 100, 360) - 90,
      maskRate: Math.min((props.rate * 360) / 100, 360),
      dashLen: circleCircumference - (circleCircumference * props.rate) / 100,
    };
    return res;
  });
</script>
