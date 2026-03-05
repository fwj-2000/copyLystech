<!-- 产值图表 -->
<template>
  <div class="compo-container">
    <div class="pie-wrapper flex">
      <Chart ref="chartRef" :options="state.options" height="100%" style="height: 100%;width: 50%" />
      <Chart ref="chartRef2" :options="state.rightOption" height="100%" style="height: 100%;width: 50%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import { cloneDeep, merge } from 'lodash-es';
import { chartOptions, baseOptions, colorStyle, colorStyle2, highlightColor } from './config';

import { useGo } from '/@/hooks/web/usePage';
import { Chart } from '/@/components/Chart';
import { SearchFormValueType } from '../../../../types';
import { objectToQueryParams } from '../../../utils';

interface ChartInstance extends InstanceType<typeof Chart> { }

const go = useGo()

const props = defineProps<{
  info: any;
}>()

const state = reactive({
  options: {},
  rightOption: {},
});

const getSearchFormValue = inject('getSearchFormValue', () => ({
  orgCode: '',
} as SearchFormValueType));

// 给图表组件绑定点击事件
const chartRef = ref<ChartInstance | null>(null);
const chartRef2 = ref<ChartInstance | null>(null);
onMounted(() => {
  bindChartClick(chartRef)
  bindChartClick(chartRef2)
})

// 给图表绑定事件
const bindChartClick = (chartRef) => {
  if (chartRef.value) {
    const instance = chartRef.value.getInstance();
    instance?.on('click', function () {
      const { orgCode, date } = getSearchFormValue();
      const query = {
        orgCode,
        date,
      };
      go(`/dashboard/operate/output/infoDetail?${objectToQueryParams(query)}`);
    });
  }
}

watch(
  () => props.info,
  (newValue) => {
    const {
      FValueWan = 0,
      AvgValue = 0,
      DLAvgValue = 0,
      FSalesWan = 0,
    } = newValue;
    const data = [{
      value: FValueWan || 0,
      colorStyle: colorStyle,
    }, {
      value: FSalesWan || 0,
      colorStyle: colorStyle2,
    }];
    const handleOptions = {
      xAxis: {
        data: ['总产值', '总出货'],
      },
      series: [
        {
          data: data.map(item => ({
            value: item.value === 0 ? null : 0,
            itemStyle: {
              color: item.colorStyle.foot,
            },
          }))
        },
        {
          data: data.map(item => ({
            value: item.value === 0 ? null : item.value,
            itemStyle: {
              color: item.colorStyle.head,
            },
          }))
        },
        {
          label: {
            formatter: '{c}(万元)',
          },
          data: data.map(item => ({
            value: item.value,
            itemStyle: {
              color: highlightColor,
            }
          }))
        },
        {
          data: data.map(item => ({
            value: item.value,
            itemStyle: {
              color: item.colorStyle.bar,
            }
          }))
        },
      ]
    };
    state.options = merge(cloneDeep(chartOptions), handleOptions);
    state.rightOption = merge(cloneDeep(baseOptions), {
      series: [{
        label: {
          formatter: '{c}(元)',
        },
        data: [AvgValue, DLAvgValue]
      }]
    });
  },
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.compo-container {
  width: 100%;
  height: 100%;

  .pie-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
</style>