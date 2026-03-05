<!-- 世界地图 -->
<template>
  <div class="w-[100%] h-[100%]">
    <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';

  const options = ref<EChartsOption>({
    globe: {
      baseTexture: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      heightTexture: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      displacementScale: 0.1,
      light: {
        main: {
          intensity: 1.2,
          shadow: true,
          alpha: 50,
          beta: 10,
        },
        ambient: {
          intensity: 0.3,
        },
      },
      viewControl: {
        autoRotate: false,
      },
      postEffect: {
        enable: false,
      },
    },
    series: [
      {
        type: 'map3D',
        map: 'world',
        emphasis: {
          label: {
            show: true,
          },
        },
        data: [
          {
            name: 'China',
            value: 100,
          },
          {
            name: 'United States',
            value: 200,
          },
        ],
      },
    ],
  });
</script>
