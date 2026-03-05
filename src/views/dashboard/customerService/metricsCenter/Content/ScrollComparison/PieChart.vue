<!-- 3D饼图 -->
<template>
  <div class="relative w-[100%] h-[100%]">
    <!-- 标题 -->
    <div class="relative z-2 w-[100%] h-[32px] flex justify-start pl-[12px]">
      {{ props.title }}
    </div>
    <!-- 图表 -->
    <div class="w-[100%] h-[calc(100%-32px)]">
      <div v-if="!isNotEmpty" class="h-[calc(100%-32px)] mt-[6px]">
        <emptyData></emptyData>
      </div>
      <template v-else>
        <div class="absolute top-[-5%] left-0 w-[100%] h-[80%]" style="z-index: 0">
          <highcharts ref="highChart" :options="pieOptions" style="height: 140px; width: 100%" />
        </div>
        <div class="absolute bottom-0 z-2 w-[100%] flex flex-wrap gap-[5%] text-[12px]">
          <div v-for="(item, idx) in props.data" :key="idx" class="w-[45%] flex justify-between mb-[4px] text-hover" @click="showDetailModal(item.text)">
            <div class="flex">
              <div class="w-[8px] h-[8px] mr-4px" :style="`background-color: ${item.color}`"></div>
              <text> {{ item.text }}</text>
            </div>
            <text>{{ item.value }}</text>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, merge } from 'lodash-es';
  import { basePieOptions } from './config';
  import { computed } from 'vue';

  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  });
  const emits = defineEmits(['click-legend']);
  let pieOptions = merge(cloneDeep(basePieOptions), {
    series: [
      {
        type: 'pie',
        startAngle: 30,
        name: '',
        data: props.data.map(item => {
          return {
            y: item.value,
            name: item.text,
            color: item.color,
          };
        }),
      },
    ],
  });

  const isNotEmpty = computed(() => {
    return props.data.some(item => item.value !== 0);
  });

  const showDetailModal = text => {
    const [start, end] = text.split('~');
    const startValue = Number.parseInt(start, 10);
    if (end.includes('以上')) {
      return emits('click-legend', { min: startValue });
    }
    if (end.includes('以下')) {
      return emits('click-legend', { max: startValue });
    }
    const endValue = Number.parseInt(end, 10);
    const min = Math.min(startValue, endValue);
    const max = Math.max(startValue, endValue);
    emits('click-legend', { min, max });
  };
</script>
