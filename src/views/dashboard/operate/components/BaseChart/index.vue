<!-- 基础图表信息 -->
<template>
  <div class="compo-content-container" id="uptimeChart">
    <div class="compo-content-wrapper">
      <div class="title-wrapper mb-16px">{{ props.info.itemTitle }}</div>
      <Chart ref="chartRef" :options="state.chartOptions" height="100%" width="100%" class="chart-wrapper" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { inject, onMounted, reactive, ref, watch } from 'vue';
  import { Chart } from '/@/components/Chart';

  import { barOptions } from './config';
  import { cloneDeep, merge } from 'lodash-es';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import { SearchFormValueType, TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';

  interface ChartInstance extends InstanceType<typeof Chart> {}

  const go = useGo();
  const route = useRoute();
  const { query: routeQuery } = route;
  const orgCode = ref(routeQuery.orgCode || '');
  const routeData = dayjs((routeQuery?.date as string) || new Date());
  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
  });
  const state = reactive({
    chartOptions: {},
  });

  const getSearchFormValue = inject(
    'getSearchFormValue',
    () =>
      ({
        date: routeData,
        period: PeriodEnum.ALL,
        timeDimension: (routeQuery.dimension as TimeDimension) || TimeDimension.DAY,
        orgCode: orgCode.value,
      } as SearchFormValueType),
  );

  // 给图表组件绑定点击事件
  const chartRef = ref<ChartInstance | null>(null);
  onMounted(() => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', function (params: any) {
        const { orgCode: currentOrgCode = '', routeParams = {} } = params.data || {};
        const { timeDimension, dateRange = [dayjs(routeData).tz().subtract(6, 'day'), dayjs(routeData).tz()], orgCode } = getSearchFormValue();
        const [startDate, endDate] = dateRange;
        // 隐藏 tooltips
        instance?.dispatchAction({
          type: 'hideTip',
        });
        // 处理 模切绩效板块问题-------
        if (!currentOrgCode) {
          return;
        }
        // -------
        // 没有子层级了
        if (orgCode === currentOrgCode) {
          if (props.info.infoPath) {
            go(
              `${props.info.infoPath}?${objectToQueryParams({
                orgCode,
                ...(timeDimension === TimeDimension.DAY
                  ? {
                      date: params.name,
                    }
                  : {
                      date: endDate.format('YYYY-MM-DD'),
                      startDate: startDate.format('YYYY-MM-DD'),
                    }),
                ...routeParams,
              })}`,
            );
          }
          return;
        }
        // 去下一层级页面
        go(
          `${props.info?.path || ''}?${objectToQueryParams({
            orgCode: currentOrgCode,
            dimension: timeDimension,
            date: endDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            startDate: startDate.format('YYYY-MM-DD'),
            ...routeParams,
          })}`,
        );
      });
    }
  });

  watch(
    () => props.info,
    () => {
      // 处理过后填充的数据
      state.chartOptions = merge(cloneDeep(barOptions), props.info.options);
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  .compo-content-container {
    height: 300px;
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
        line-height: 14px;
        letter-spacing: 0.64px;
      }

      .chart-wrapper {
        height: 100%;
        overflow-x: auto;
      }
    }
  }
</style>

<style lang="less">
  .uptime-tooltips {
    .head-container {
      color: #1a1a1a;
    }

    .content-container {
      width: 312px;
      height: 100%;
      flex-wrap: wrap;
      gap: 6px;

      .item-container {
        width: 152px;
        padding: 10px 12px;
        background: #f2f2f2;

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }
      }
    }
  }
</style>
