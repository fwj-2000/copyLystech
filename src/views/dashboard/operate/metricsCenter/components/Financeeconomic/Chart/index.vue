<!-- 客诉图表 -->
<template>
  <div class="compo-container">
    <div class="chart-wrapper flex ct-evenly">
      <!-- 损耗额图表 -->
      <div class="left-wrapper warm-border flex column items-center">
        <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
      </div>
      <!-- 边贡率图表 -->
      <div class="center-wrapper flex column items-start justify-between pl-8px">
        <div class="w-[100%]">
          <div class="mb-8px">边贡达成率：{{ props.info.bgdcl }}</div>
          <div class="flex center w-[100%]">
            <SvgChart
              style="width: 100%; max-width: 192px"
              v-bind="{
                rate: props.info.bgdcl,
                orgCode: props.info.OrgCode,
                goDetail,
              }"></SvgChart>
          </div>
        </div>
        <!-- 边贡损失额 -->
        <div :class="['warm-border extra-info flex justify-start px-12px text-[14px]', { loss: props.info.bgsse < 0 }]">
          <span>边贡损失额：</span>
          <span class="text-[14px] font-bold value">{{ props.info.bgsse }}万元</span>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { inject, ref, watch } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions, getPictorialBarSeriesOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import { Chart } from '/@/components/Chart';
  import SvgChart from './SvgChart.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import type { IMetricKeyListConfig } from './config';
  import type { EChartsOption } from 'echarts';

  const DETAIL_URL = '/dashboard/operate/customerComplaints/infoDetail';

  const go = useGo();

  const props = defineProps<{
    info: any;
    listData?: any;
  }>();

  const metricKeyListConfig = ref<IMetricKeyListConfig[]>([
    {
      key: 'bzbgl',
      value: 7.5,
      name: '标准 边贡率',
      symbolKey: 'grey',
    },
    {
      key: 'sjbgl',
      value: 7.5,
      name: '实际 边贡率',
      symbolKey: 'yellow',
    },
  ]);

  const options = ref<EChartsOption>({});
  // 初始化左边的图表
  const initLeftChart = () => {
    const xAxisData = metricKeyListConfig.value.map(item => {
      return item.name;
    });
    metricKeyListConfig.value = metricKeyListConfig.value.map(item => ({
      ...item,
      value: Number.parseFloat(props.info?.[item.key] || 10),
    }));
    const maxValue = Math.max(...metricKeyListConfig.value.map(item => item.value));
    options.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: xAxisData,
      },
      yAxis:
        maxValue < 50
          ? {
              max: 50,
            }
          : {},
      series: [getPictorialBarSeriesOptions(metricKeyListConfig.value)],
    });
  };

  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      initLeftChart();
    },
    { deep: true, immediate: true },
  );

  // 去详情页
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goDetail = (params = {}) => {
    const orgCode = props.info.OrgCode;
    const { date } = getSearchFormValue() as any;
    // 构造路由参数
    const url = `${DETAIL_URL}?${objectToQueryParams({
      orgCode,
      dimension: TimeDimension.WEEK,
      startDate: dayjs(date).tz().startOf('week').format('YYYY-MM-DD'),
      date: dayjs(date).tz().endOf('week').format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };
</script>

<style lang="less" scoped>
  @legendHeight: 53px;

  .compo-container {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    overflow: hidden;

    .chart-wrapper {
      width: 100%;
      height: 100%;

      .left-wrapper {
        width: 40%;
        height: 100%;
      }

      .center-wrapper {
        position: relative;
        width: 60%;
        height: 100%;

        .extra-info {
          height: 27%;
          width: 100%;
          background: url('/@/assets/images/report/get.png');
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: bottom right;

          &.loss {
            background-image: url('/@/assets/images/report/loss.png');

            .value {
              color: rgb(255 77 79 / 100%);
            }
          }
        }
      }
    }
  }
</style>
