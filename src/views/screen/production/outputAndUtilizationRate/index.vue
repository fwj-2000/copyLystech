<!-- 生产看板 -->
<template>
  <div class="page-container flex flex-col">
    <div class="w-full flex-shrink-0">
      <PageTitle :title="title" />
    </div>
    <div class="content-container flex-shrink-1">
      <div class="w-full flex justify-between flex-shrink-0 title-container">
        <div>{{ shift }}</div>
        <div>{{ currentTime }}</div>
      </div>
      <ChartItem :chartComponent="Output" :dataList="dataList" />
      <ChartItem :chartComponent="UtilizationRate" :dataList="dataList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { getlatest } from '/@/api/screen/production';

  import PageTitle from './components/PageTitle.vue';
  import Output from './components/Output.vue';
  import UtilizationRate from './components/UtilizationRate.vue';
  import ChartItem from './components/ChartItem.vue';

  const title = ref('');
  const shift = ref('');
  const dataList = ref<any[]>([]);
  const currentTime = ref('');
  let timer: any = null;
  let timer2: any = null;

  // 定义更新时间的函数
  const updateTime = () => {
    currentTime.value = dayjs().tz().format('YYYY-M-D dddd HH:mm:ss');
  };

  getlatest().then(res => {
    dataList.value = res.data;
    const firsrtInfo = res.data?.[0];
    title.value = (firsrtInfo ?? { FloorNum: '' }).FloorNum;
  });

  onMounted(() => {
    // 组件挂载时更新一次时间
    updateTime();
    // 每秒更新一次时间
    timer = setInterval(updateTime, 1000);
    timer2 = setInterval(getData, 5000);
  });

  onUnmounted(() => {
    // 组件卸载时清除定时器
    timer && clearInterval(timer);
    timer2 && clearInterval(timer2);
  });

  function getData() {
    getlatest().then(res => {
      dataList.value = res.data;
      const firsrtInfo = res.data?.[0];
      title.value = (firsrtInfo ?? { FloorNum: '' }).FloorNum;
      shift.value = (firsrtInfo ?? { Shift: '' }).Shift;
    });
  }
</script>

<style lang="less" scoped>
  @import url('./style.less');
</style>
