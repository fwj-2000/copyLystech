<!--  -->
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="124" viewBox="0 0 80 100" fill="none">
    <text x="40" :y="height - 2" font-size="12" fill="#666" text-anchor="middle">{{ props.options.rate }}%</text>
    <path id="myPath" d="M40 60V100L0 80L40 60Z" fill="url(#paint0_linear_4005_107037)">
      <animate attributeName="d" :to="`M40 ${height}V100L0 80L40 ${height}Z`" dur="500ms" calcMode="linear" fill="freeze"></animate>
    </path>
    <path id="myPath2" d="M40 60V100L80 80L40 60Z" fill="url(#paint1_linear_4005_107037)" stroke="url(#paint2_linear_4005_107037)">
      <animate attributeName="d" :to="`M40 ${height}V100L80 80L40 ${height}Z`" dur="500ms" calcMode="linear" fill="freeze"></animate>
    </path>

    <defs>
      <linearGradient id="paint0_linear_4005_107037" x1="22" y1="5.75932" x2="22" y2="81" gradientUnits="userSpaceOnUse">
        <stop stop-color="#77C8FF" />
        <stop offset="1" stop-color="#ECF7FF" stop-opacity="0.86" />
      </linearGradient>
      <linearGradient id="paint1_linear_4005_107037" x1="66" y1="5.75932" x2="66" y2="81" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3D9CDD" />
        <stop offset="1" stop-color="#DCF1FF" />
      </linearGradient>
      <linearGradient id="paint2_linear_4005_107037" x1="56.5713" y1="-26.7243" x2="57.2979" y2="-31.6318" gradientUnits="userSpaceOnUse">
        <stop stop-color="#7B9AE4" stop-opacity="0" />
        <stop offset="1" stop-color="#B4C6F0" stop-opacity="0.64" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    options: {
      type: Object,
      default: () => ({ rate: 100 }),
    },
  });

  const height = computed(() => {
    return 75 - (props.options.rate * 75) / 100;
  });
</script>
