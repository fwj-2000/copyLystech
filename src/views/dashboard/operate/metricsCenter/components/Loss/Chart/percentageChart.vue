<!--  -->
<template>
  <svg viewBox="0 0 227 137" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.83008 68.5002C6.83008 34.2681 34.5807 6.51758 68.8127 6.51758H158.187C192.419 6.51758 220.17 34.2681 220.17 68.5002V68.5002C220.17 102.732 192.419 130.483 158.187 130.483H68.8127C34.5806 130.483 6.83008 102.732 6.83008 68.5002V68.5002Z"
      stroke="#E6E6E6"
      stroke-width="12" />

    <path
      d="M6.83029 68.4824V68.4824C6.83029 34.2504 34.5809 6.49981 68.8129 6.49981H158.187C192.419 6.49981 220.17 34.2504 220.17 68.4824V68.4824"
      stroke="url(#paint1_linear_9689_29816)"
      stroke-width="12"
      stroke-linecap="round">
      <animate attributeName="stroke-dasharray" :values="`0, 1000; ${(288 * sjclzbValue) / 50}, 1000`" keyTimes="0;1" dur="1s" begin="0s" fill="freeze" />
    </path>
    <path
      v-if="sjclzbValue > 50"
      d="M220.17 68.5V68.5C220.17 102.732 192.419 130.483 158.187 130.483H68.8138C34.5806 130.483 6.83008 102.732 6.83008 68.5V68.5"
      stroke="#5785EC"
      stroke-width="12"
      stroke-linecap="round"
      opacity="0">
      <animate
        attributeName="stroke-dasharray"
        :values="`0, 1000; ${(300 * (sjclzbValue - 50)) / 50}, 1000`"
        :dur="`${(0.5 * (sjclzbValue - 50)) / 50}s`"
        begin="1s"
        fill="freeze" />
      <animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="1s" fill="freeze" />
    </path>

    <path
      d="M22.9414 68.5C22.9414 43.1949 43.4552 22.6812 68.7603 22.6812H158.239C183.544 22.6812 204.058 43.1949 204.058 68.5V68.5C204.058 93.805 183.544 114.319 158.239 114.319H68.7603C43.4552 114.319 22.9414 93.805 22.9414 68.5V68.5Z"
      stroke="#E6E6E6"
      stroke-width="4"></path>

    <path
      d="M22.9414 68.3188V68.3188C22.9414 43.0138 43.4552 22.5 68.7603 22.5H158.239C183.544 22.5 204.058 43.0138 204.058 68.3188V68.3188"
      stroke="url(#paint2_linear_9689_29816)"
      stroke-width="4"
      stroke-linecap="round">
      <animate attributeName="stroke-dasharray" :values="`0, 1000; ${(230 * bzclzbValue) / 50}, 1000`" keyTimes="0;1" dur="1s" begin="0s" fill="freeze" />
    </path>
    <path
      v-if="bzclzbValue > 50"
      d="M204.058 68.5V68.5C204.058 93.805 183.544 114.319 158.239 114.319H68.7601C43.455 114.319 22.9413 93.805 22.9413 68.5V68.5"
      stroke="#FF470D"
      stroke-width="4"
      stroke-linecap="round"
      opacity="0">
      <animate
        attributeName="stroke-dasharray"
        :values="`0, 1000; ${(227 * (bzclzbValue - 50)) / 50 + 6}, 1000`"
        :dur="`${(0.5 * (bzclzbValue - 50)) / 50}s`"
        begin="1s"
        fill="freeze" />
      <animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="1s" fill="freeze" />
    </path>

    <rect x="55" y="52" width="8" height="8" fill="#5493ED" />
    <text x="65" y="60" font-size="12" fill="#000" text-anchor="start">{{ props.sjclzb }}</text>
    <text x="55" y="75" font-size="12" fill="#999" text-anchor="start">实际材料</text>
    <text x="67" y="89" font-size="12" fill="#999" text-anchor="start">占比</text>

    <rect x="133" y="52" width="8" height="8" fill="#FF5F2D" />
    <text x="143" y="60" font-size="12" fill="#000" text-anchor="start">{{ props.bzclzb }}</text>
    <text x="133" y="75" font-size="12" fill="#999" text-anchor="start">标准材料</text>
    <text x="145" y="89" font-size="12" fill="#999" text-anchor="start">占比</text>
    <defs>
      <linearGradient id="paint0_linear_9689_29816" x1="265.5" y1="39" x2="1.23944" y2="52.1143" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ECF2FF" stop-opacity="0.1" />
        <stop offset="1" stop-color="#5785EC" />
      </linearGradient>
      <linearGradient id="paint1_linear_9689_29816" x1="-38.5" y1="97.9824" x2="225.761" y2="84.8681" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ECF2FF" stop-opacity="0.1" />
        <stop offset="1" stop-color="#5785EC" />
      </linearGradient>
      <linearGradient id="paint2_linear_9689_29816" x1="176.68" y1="134.739" x2="17.9195" y2="67.7788" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF470D" />
        <stop offset="1" stop-color="#FF470D" stop-opacity="0.1" />
      </linearGradient>
      <linearGradient id="paint3_linear_9689_29816" x1="50.3195" y1="2.08" x2="209.08" y2="69.04" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF470D" />
        <stop offset="1" stop-color="#FF470D" stop-opacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  const props = defineProps({
    sjclzb: {
      type: String,
      default: '0%',
    },
    bzclzb: {
      type: String,
      default: '0%',
    },
  });

  const sjclzbValue = Number(props.sjclzb.replace('%', ''));
  const bzclzbValue = Number(props.bzclzb.replace('%', ''));
</script>
