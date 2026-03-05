<!-- 大屏地图 -->
<template>
  <div class="w-[100%] h-[100%] map-container">
    <!-- 标题 -->
    <div class="absolute top-0 left-0">
      <img :src="head" class="w-[100vw]" />
      <div class="absolute top-0 left-0 w-[100%] h-[45%] flex justify-center items-center">
        <span class="text-[#fff] text-32px">模切大数据平台</span>
      </div>
    </div>
    <!-- 边框 -->
    <div class="absolute top-0 left-0 h-[100%] w-[100%]">
      <img :src="border" class="h-[100%] w-[100%]" />
    </div>

    <!-- 地图 -->
    <div class="w-[100%] h-[100%] flex flex-center">
      <div class="w-[calc(100%-44px)] h-[calc(100%-84px)] overflow-hidden relative">
        <Chart ref="chartRef" :options="options" height="100%" style="height: 100%; width: 100%" />
        <!-- 弹窗组件 -->
        <InfoContent class="w-[100%] h-[100%]"></InfoContent>
      </div>
    </div>
    <div class="absolute top-44px left-36px flex h-[calc(100%-80px)]">
      <!-- 按钮组 -->
      <div class="w-[218px] h-[100%] flex flex-col justify-evenly">
        <div v-for="(btn, idx) in btns" :key="idx" class="relative" @click="openWindow(idx)">
          <img :src="btn.src" class="h-[100%]" />
          <div class="absolute top-0 left-0 flex center w-[100%] h-[100%]">
            <!-- <img :src="btn.text" class="h-[55%]" /> -->
            <div :class="['btn-text mb-[4px]']">{{ btn.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { mapOptions } from './config';
  import { btns } from './data';
  import { useGo } from '/@/hooks/web/usePage';
  // import chinaJson from './mapJson/china.json'; // 引入 USA 地图数据
  import wordJson from './mapJson/EuropeAsiaAfrica.json';
  // import wordJson from './mapJson/word.json';
  // import indiaJson from './mapJson/india.json'; // 引入 USA 地图数据

  import head from './static/head.svg';
  import border from './static/border.png';
  import InfoContent from './InfoContent.vue';
  import * as echarts from 'echarts';
  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';
  interface ChartInstance extends InstanceType<typeof Chart> {}

  // echarts.registerMap('china', chinaJson);
  // echarts.registerMap('india', indiaJson);
  echarts.registerMap('word', wordJson as any);
  const go = useGo();
  const chartRef = ref<ChartInstance | null>(null);
  const options = ref<EChartsOption>(mapOptions);

  const openWindow = idx => {
    go(`/dashboardv1/large/rate?id=${idx}`, true);
  };

  onMounted(() => {
    const myChart = chartRef?.value?.getInstance();
    console.log('chartRef?.value: ', chartRef?.value);
    // for (var i = 0; i < 5; i++) {
    //   myChart?.dispatchAction({
    //     type: 'showTip',
    //     seriesIndex: 0, // 系列索引
    //     dataIndex: i, // 数据索引
    //   });
    // }

    myChart?.dispatchAction({
      type: 'highlight',
      name: '深圳', // 系列索引
    });

    // 获取数据点的像素位置
    // var pointPosition = myChart.convertToPixel({ geoIndex: 0 }, [114.117, 22.708]);
    // console.log('pointPosition: ', pointPosition);
  });
</script>

<style lang="less" scoped>
  .map-container {
    background: url('./static/bg.png') no-repeat;
    background-size: cover;
  }

  .btn-text {
    color: #fff;
    text-align: center;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: linear-gradient(0deg, #006dd2 0%, #fff 67.24%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
