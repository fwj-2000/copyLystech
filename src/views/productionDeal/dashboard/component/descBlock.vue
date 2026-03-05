<template>
  <div class="desc-block">
    <div class="desc-block-left">
      <RealTimeClock></RealTimeClock>
    </div>
    <div class="desc-block-right">
      <div class="classes num ml-12px">
        <div class="zn" :style="{ color: shiftColor }">{{ shift }}</div>
        <div class="en">Day'shift</div>
      </div>
      <div class="status-block ml-12px">
        <div class="zn">ok数量</div>
        <div class="zn">OK Quantty</div>
        <div class="num">9999</div>
      </div>
      <div class="status-block ml-12px">
        <div class="zn">NG数量</div>
        <div class="zn">NG Quantty</div>
        <div class="num">99</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import RealTimeClock from './RealTimeClock.vue';
  import dayjs from 'dayjs';
  const shift = ref('');
  const shiftColor = ref('');
  function getShift(): void {
    const hour = dayjs().tz().hour();
    if (hour >= 8 && hour < 13) {
      shift.value = '白班';
      shiftColor.value = '#52c41a'; // 绿色
    } else {
      shift.value = '晚班';
      shiftColor.value = '#fa8c16'; // 橙色
    }
  }
  let timer: any;
  onMounted(() => {
    timer = setInterval(() => {
      getShift();
    }, 1000 * 60);
  });

  onBeforeUnmount(() => {
    clearInterval(timer);
  });
</script>

<style lang="less" scoped>
  .num {
    font-family: Roboto, sans-serif;
    font-style: normal;
    color: #4eecff;
    font-weight: bold;
  }

  .desc-block {
    padding: 0 14px;
    flex-wrap: wrap;
    border: 1px solid #47d7ee;
    background: #08447a;
    height: 102px;
    align-items: center;
    font-size: 20px;
    min-width: 290px;
    display: flex;
    flex: 1;
    text-align: center;

    &-right {
      display: flex;
    }
  }

  .time {
    font-size: 1.2em;
  }

  .zn {
    font-size: 1em;
  }

  .en {
    font-size: 1em;
  }

  .classes {
    font-size: 1em;
    line-height: 24px;
  }

  .status-block {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }
</style>
