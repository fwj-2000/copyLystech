<template>
  <Statistic :value="currentTime" :value-style="{ fontSize: '28px', color: '#4eecff' }" v-bind="$attrs" />
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Statistic } from 'ant-design-vue';
  import dayjs from 'dayjs';
  const currentTime = ref(dayjs().tz().format('YYYY-MM-DD HH:mm:ss'));

  let timer: any;
  onMounted(() => {
    timer = setInterval(() => {
      currentTime.value = dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timer);
  });
</script>

<style scoped>
  /* 自定义样式 */
</style>
