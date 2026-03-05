<!-- 停机图表 -->
<template>
  <div v-show="showPercentage" class="compo-wrapper flex justify-between">
    <div class="chart-container">
      <Percentage :chartInfo="chartInfo"></Percentage>
    </div>
    <div class="chart-container">
      <Duration :chartInfo="chartInfo"></Duration>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getUtilizationrateDowntime } from '/@/api/dashbord/operate';

  import Duration from './Duration.vue';
  import Percentage from './Percentage.vue';
  import { computed, ref, watch } from 'vue';
  import { isEmpty } from 'lodash-es';

  const showPercentage = ref(false);
  const chartInfo = ref([]);
  const props = defineProps({
    searchFormValue: {
      type: Object,
      required: true,
    },
  });
  // 获取停机异常原因
  const stoppageParams = computed(() => {
    return {
      orgCode: props.searchFormValue.orgCode,
      startTime: props.searchFormValue.date.valueOf(),
      endTime: props.searchFormValue.date.valueOf(),
    };
  });
  watch(
    () => stoppageParams,
    () => {
      getUtilizationrateDowntime(stoppageParams.value).then(res => {
        showPercentage.value = !isEmpty(res.data?.list);
        chartInfo.value = res.data?.list;
      });
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .compo-wrapper {
    width: 100%;
    height: 300px;
    margin-bottom: 12px;

    .chart-container {
      width: calc(50% - 6px);
      height: 100%;
      box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
    }
  }
</style>
