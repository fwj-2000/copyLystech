<!-- 基础图表信息 -->
<template>
  <div class="compo-content-container">
    <div class="compo-content-wrapper">
      <div class="title-wrapper flex justify-start">
        {{ props.groupName || '' }}
      </div>
      <div class="chart-container">
        <Chart
          v-show="chartWidth"
          ref="chartRef"
          :options="state.barOptions"
          height="100%"
          :style="`min-width: 100%;width: ${chartWidth}px`"
          class="chart-wrapper" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, nextTick, onMounted } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { option } from './config';
  import { cloneDeep, merge } from 'lodash-es';
  interface ChartInstance extends InstanceType<typeof Chart> {}
  const chartRef = ref<ChartInstance | null>(null);

  const emits = defineEmits(['update:value']);

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
    groupName: {
      type: String,
      default: 'By岗位人数分布',
    },
    value: {
      type: String,
      default: '',
    },
  });
  const state = reactive({
    barOptions: {},
  });

  const chartWidth = ref(0);
  const itemWidth = 80;

  onMounted(() => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', function (params: any) {
        emits(`update:value`, params.name); // 向父组件传递点击的数据
      });
    }
  });

  watch(
    () => props.info,
    () => {
      chartWidth.value = 0;
      const sortedList = props.info.sort((a, b) => b.ZZNum - a.ZZNum);
      const legendData = sortedList.map(item => item.Department);
      const handleOptions = {
        xAxis: {
          data: legendData,
          axisLabel: {
            customValues: legendData,
          },
        },
        series: [
          {
            data: sortedList.map(item => {
              return {
                value: item.ZZNum,
                itemStyle: {
                  color: item.Department === props.value ? '#ff7b00' : '#1890FF',
                },
              };
            }),
          },
        ],
      };
      // 处理过后填充的数据
      state.barOptions = merge(cloneDeep(option), handleOptions);
      chartWidth.value = props.info.length * itemWidth;

      nextTick(() => {
        const instance = chartRef?.value && chartRef?.value.getInstance();
        // 重置并重新绘制图表
        if (instance) {
          instance?.resize({
            animation: {
              duration: 300,
              easing: 'quadraticIn',
            },
          });
        }
      });
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  @titleHeight: 44px;

  .compo-content-container {
    height: calc(100% - 24px);
    width: 100%;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);

    .compo-content-wrapper {
      width: 100%;
      height: 100%;
      padding: 16px;

      .title-wrapper {
        color: #1a1a1a;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        height: @titleHeight;
      }

      .chart-container {
        width: 100%;
        height: calc(100% - @titleHeight);
        overflow: auto hidden;
      }

      .chart-wrapper {
        height: 100%;
      }
    }
  }
</style>
