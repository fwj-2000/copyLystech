<template>
  <div class="lydc-content-wrapper bg-white">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <div class="p-10px pb-12px">
          <div class=".text-16px font-semibold">OEE</div>
          <div class="oee-chart-title pt-10px">
            <div class="rate">96%</div>
            <div>时间稼动率*性能利用率*模切良率</div>
          </div>
          <div ref="chartRef" :style="{ height, width }"></div>
        </div>
        <div class="flex">
          <RateLineChart name="时间稼动率"></RateLineChart>
          <RateLineChart name="性能利用率"></RateLineChart>
          <RateLineChart name="模切良率"></RateLineChart>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { basicProps } from './props';
</script>
<script lang="ts" setup>
import { reactive, ref, Ref, nextTick, onMounted } from 'vue';
import { BasicForm, useForm } from '/@/components/Form';
import { useECharts } from '/@/hooks/web/useECharts';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import RateLineChart from './components/RateLineChart.vue'

defineOptions({ name: 'production-manualYield' });
defineProps({ ...basicProps })

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

interface State {
  activeKey: string;
  keyword: string;
  startTime: number;
  endTime: number;
  industryTypeList: any[];
  visible: Boolean
  detailData: any
}

const state = reactive<State>({
  activeKey: '1',
  keyword: '',
  startTime: 0,
  endTime: 0,
  industryTypeList: [],
  visible: false,
  detailData: {}
});

const { t } = useI18n();
const baseStore = useBaseStore();

const [registerForm] = useForm({
  baseColProps: { span: 6 },
  showActionButtonGroup: true,
  showAdvancedButton: true,
  compact: true,
  labelAlign: 'left',
  labelWidth: 60,
  schemas: [
    {
      field: 'factoryArea',
      label: t('views.dashboard.production.manaulYield.factory'),
      labelWidth: 50,
      component: 'Select',
      componentProps: {
        placeholder: t('common.chooseText'),
        submitOnPressEnter: true,
      },
    },
    {
      field: 'timeRange',
      label: t('views.dashboard.production.manaulYield.timeDimension'),
      labelWidth: 100,
      component: 'Select',
      componentProps: {
        placeholder: t('common.chooseText'),
        submitOnPressEnter: true,
      },
    },
    {
      field: '985',
      label: '985',
      labelWidth: 30,
      component: 'Select',
      componentProps: {
        placeholder: t('common.chooseText'),
        submitOnPressEnter: true,
      },
    },
    {
      field: 'pickerVal',
      label: t('views.dashboard.production.manaulYield.selectTime'),
      labelWidth: 70,
      component: 'DateRange',
    },
  ],
  fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
});

onMounted(() => {
  init()
  setOptions({
    dataZoom: [
      {
        type: 'slider'
      },
      {
        type: 'inside'
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          width: 1,
          color: '#019680',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [...new Array(6)].map((_item, index) => `2024WK${index + 14}`),
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: 'rgba(226,226,226,0.5)',
        },
      },
      axisTick: {
        show: false,
      },
      min: 0, // x轴起始位置
      axisLine: {
        lineStyle: {
          color: '#666',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value} %',
        },
        splitNumber: 5,
        axisTick: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', '#fff'],
          },
        },
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
      },
    ],
    grid: { left: 50, right: '1%', top: '5%', bottom: 70, containLabel: false },
    series: [
      {
        smooth: true,
        data: [33, 45, 58, 75, 88, 76, 66, 59],
        type: 'line',
        areaStyle: {},
        itemStyle: {
          color: '#ff7b00',
        },
      },
    ],
  });
});

function handleSubmit(values) {
  state.keyword = values?.keyword || '';
  state.startTime = values?.startTime || 0;
  state.endTime = values?.endTime || 0;
  handleSearch();
}
function handleReset() {
  state.keyword = '';
  state.startTime = 0;
  state.endTime = 0;
  handleSearch();
}
function handleSearch() {
  nextTick(() => {
    console.log('handleSearch');
  });
}
async function init() {
  state.industryTypeList = (await baseStore.getDictionaryData('IndustryType')) as any[];
}
</script>

<style lang="less" scoped>
.oee-chart-title {
  display: flex;
  justify-content: flex-start;

  .rate {
    color: @primary-color;
    font-size: 36px;
    line-height: 28px;
  }

  .tips {
    color: #000;
    font-size: 14px;
  }
}
</style>
