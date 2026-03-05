<!-- 项目阶段 -->
<template>
  <MetricItem>
    <template #title>
      <span class="font-bold">项目阶段</span>
    </template>
    <MetricContent @register="register">
      <!-- 图表 -->
      <div class="w-[100%] h-[100%] relative overflow-hidden">
        <div class="absolute top-[-20%] left-0 w-[100%] h-[100%]" style="z-index: 0">
          <highcharts ref="highChart" :options="pieOptions" style="height: 174px; width: 100%" />
        </div>
        <div class="absolute bottom-0 z-2 w-[100%] flex flex-wrap justify-start gap-[3%] text-[12px]">
          <div v-for="(item, idx) in data" :key="idx" class="min-w-[31%] flex justify-between mb-[4px]">
            <div class="flex text-hover" @click="showDetailModal(item.text)">
              <div class="w-[8px] h-[8px] mr-4px flex-shrink-0" :style="`background-color: ${item.color}`"></div>
              <text> {{ item.text }}：</text>
              <text>{{ item.value }}</text>
            </div>
          </div>
        </div>
      </div>
    </MetricContent>
  </MetricItem>
  <a-modal v-model:open="isModalOpen" v-bind="modalAttrs">
    <template #title></template>
    <DetailTable :search-params="searchParams" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { basePieOptions, colors } from './config';

  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcprojectphaselist } from '/@/api/dashbord/fc';

  import DetailTable from './DetailTable.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';

  const modalAttrs = {
    width: '80vw',
    bodyStyle: {
      margin: '12px -12px -12px -12px',
    },
    footer: null,
  };
  let pieOptions = {};
  const isModalOpen = ref(false);
  const searchParams = ref<Record<string, any>>({});
  const data = ref<any[]>([]);

  const props = defineProps({
    searchFormValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
  });

  const [register, { fetchData, getCommonParams }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcprojectphaselist,
    afterFetch: resData => {
      data.value = Object.keys(resData).map((key, idx) => {
        return {
          value: resData[key],
          text: key,
          color: colors[idx] ?? colors[0],
        };
      });
      pieOptions = merge(cloneDeep(basePieOptions), {
        series: [
          {
            type: 'pie',
            startAngle: 30,
            name: '',
            data: data.value.map(item => {
              return {
                y: item.value,
                name: item.text,
                color: item.color,
              };
            }),
          },
        ],
      });
    },
  });

  const showDetailModal = (projectPhase: string) => {
    searchParams.value = {
      ...getCommonParams(),
      projectPhase,
    };
    isModalOpen.value = true;
  };

  defineExpose({
    fetchData,
  });
</script>
