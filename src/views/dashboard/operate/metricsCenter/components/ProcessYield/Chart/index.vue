<!-- 开机率圆环图 -->
<template>
  <div class="compo-container">
    <div class="pie-wrapper flex">
      <Chart ref="chartRef" :options="state.options" height="100%" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch, onMounted, ref, inject } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { useGo } from '/@/hooks/web/usePage';
  import { chartOptions, colorStyle, highlightColor } from './config';

  import { Chart } from '/@/components/Chart';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  interface ChartInstance extends InstanceType<typeof Chart> {}

  const go = useGo();

  const props = defineProps<{
    info: any;
  }>();

  const state = reactive({
    options: {},
  });

  // 给图表组件绑定点击事件
  const chartRef = ref<ChartInstance | null>(null);
  onMounted(() => {
    bindChartClick(chartRef);
  });

  const getSearchFormValue = inject(
    'getSearchFormValue',
    () =>
      ({
        orgCode: '',
      } as SearchFormValueType),
  );
  // 给图表绑定事件
  const bindChartClick = chartRef => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', params => {
        const { routePath, routeParams } = params.data;
        if (routePath) {
          const { orgCode } = getSearchFormValue();
          const query = {
            orgCode,
          };
          go(
            `${routePath}?${objectToQueryParams({
              ...query,
              ...routeParams,
            })}`,
          );
        }
      });
    }
  };

  watch(
    () => props.info,
    newInfo => {
      const { AOIYield, HandYield, MQYield, OrderYield, OrgCode } = newInfo;
      const { date } = getSearchFormValue();
      const target = 98;
      const AOIYieldRate = Number.parseFloat(AOIYield) || 0;
      const HandYieldRate = Number.parseFloat(HandYield) || 0;
      const MQYieldRate = Number.parseFloat(MQYield) || 0;
      const OrderYieldRate = Number.parseFloat(OrderYield) || 0;
      const data = [
        {
          value: MQYieldRate,
          routePath: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
          routeParams: {
            startTime: date.valueOf(),
            endTime: date.valueOf(),
            rate: `${MQYieldRate}%`,
            orgCode: OrgCode,
          },
        },
        {
          value: AOIYieldRate,
          routePath: '/dashboard/operate/utilizationRate/infoDetail',
          routeParams: {
            date: date.format('YYYY-MM-DD'),
            orgCode: OrgCode,
          },
        },
        {
          value: HandYieldRate,
          routePath: '/dashboard/operate/processYield/handInfoDetail',
          routeParams: {
            date: date.format('YYYY-MM-DD'),
            orgCode: OrgCode,
          },
        },
        {
          value: OrderYieldRate,
          routePath: '/dashboard/operate/processYield/stateInfoDetail',
          routeParams: {
            date: date.format('YYYY-MM-DD'),
            orgCode: OrgCode,
          },
        },
      ];
      const { high, normal } = colorStyle;
      const handleOptions = {
        xAxis: {
          data: ['模切', '通用AOI', '手工', '结单良率'],
        },
        series: [
          {
            data: data.map(item => ({
              value: item.value === 0 ? null : 0,
              itemStyle: {
                color: (item.value >= target ? high : normal).foot,
              },
            })),
          },
          {
            data: data.map(item => ({
              value: item.value === 0 ? null : item.value,
              itemStyle: {
                color: (item.value >= target ? high : normal).head,
              },
            })),
          },
          {
            // 目标线设置
            markLine: {
              symbol: ['none', 'none'],
              symbolSize: 0,
              data: [
                {
                  type: 'value',
                  yAxis: 98,
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '目标\n98%',
                  },
                  lineStyle: {
                    color: '#72DDCA',
                    width: 1,
                    type: 'solid',
                  },
                },
              ],
            },
            data: data.map(item => ({
              ...item,
              itemStyle: {
                color: highlightColor,
              },
            })),
          },
          {
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                color: (item.value >= target ? high : normal).bar,
              },
            })),
          },
        ],
      };
      state.options = merge(cloneDeep(chartOptions), handleOptions);
    },
    { deep: true, immediate: true },
  );
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
