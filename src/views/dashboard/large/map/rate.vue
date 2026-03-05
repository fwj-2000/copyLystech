<!-- 大屏地图 -->
<template>
  <div class="w-[100%] h-[100%] map-container">
    <img :src="bg" class="absolute top-0 left-0 z-[-1] opacity-[0.3] w-[100%] h-[100%] map-container" />
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
    <div class="absolute top-44px left-36px w-[calc(100%-80px)] h-[calc(100%-80px)] flex">
      <!-- 返回 -->
      <div class="absolute top-[30px] left-[300px] h-[44px] flex justify-center items-center" @click="go('/dashboardv1/large/map', true)">
        <img :src="back" class="w-[24px] h-[24px]" />
        <span class="text-[#fff] text-20px ml-[8px] btn-text">返回</span>
      </div>
      <!-- 按钮组 -->
      <div class="h-[100%] flex flex-col justify-evenly">
        <div v-for="(btn, bidx) in btns" :key="idx" class="relative w-[217px] h-[50px]" @click="idx = bidx">
          <img :src="`${bidx}` === `${idx}` ? btnH : btnN" class="h-[100%]" />
          <div class="absolute top-0 left-0 flex center w-[100%] h-[100%]">
            <div :class="['btn-text mb-4px', `${bidx}` === `${idx}` ? '' : 'opacity-50']">{{ btn.label }}</div>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="relative h-[90%] mt-[5%] w-[100%] flex-1">
        <div class="w-[100%] h-[100%] px-[5%]">
          <content :dataInfo="dataInfo" :id="idx" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { btns } from './data';
  import { useGo } from '/@/hooks/web/usePage';

  import btnH from './static/btn.svg';
  import btnN from './static/btnN.svg';
  import bg from './static/bg.png';
  import back from './static/back.png';
  import head from './static/head.svg';
  import border from './static/border.png';
  import content from './rateContent/index.vue';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  const { routeQuery } = useRouteQuery();
  const { id = '0' } = routeQuery;
  const idx = ref<string | number>(id);

  const go = useGo();
  const dataInfo = computed(() => {
    const res = btns[idx.value].data.data.map(item => ({
      ...item,
      analysList: item.analysList.filter(data => data.keys !== '未知原因'),
    }));
    return res;
  });
</script>

<style lang="less" scoped>
  .map-container {
    // background: url('./static/bg.png') no-repeat;
    // background-size: cover;
    // /* 设置带有透明度的背景颜色 */
    background-color: rgb(5 11 35);
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
