<!-- 稼动率柱形图 -->
<template>
  <div class="relative h-full w-full">
    <a-button type="primary" size="small" class="ml-6px absolute right-1 m-6px z-50" ghost @click="btnClick">
      <span class="text-11px">{{ t('dict.common.viewDetails') }}</span>
    </a-button>
    <Chart ref="chartRef" :options="options" height="100%" style="height: 100%; width: 100%"
  /></div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, inject, watch, onMounted } from 'vue';
  import { merge, cloneDeep, mapKeys } from 'lodash-es';
  import { barOptions, sectionValOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';

  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';
  import { objectToQueryParams } from '../../metricsCenter/utils';
  interface ChartInstance extends InstanceType<typeof Chart> {}
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface IProps {
    info: Record<string, any>;
    metricKey: string;
  }
  const go = useGo();
  const props = withDefaults(defineProps<IProps>(), {
    metricKey: '综合',
  });
  const options = ref<EChartsOption>({});
  const chartRef = ref<ChartInstance | null>(null);
  const getSearchFormValue = inject('getSearchFormValue', () => ({}));

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const searchFormValue = getSearchFormValue() as any;
    const { orgCode = '', dateRange = [dayjs().tz().subtract(4, 'day'), dayjs().tz()] } = searchFormValue;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };

  // 给按钮绑定事件
  const btnClick = () => {
    const searchFormValue = getSearchFormValue() as any;
    const lowerCaseKeyForm = mapKeys(searchFormValue, (value, key) => key.toLowerCase());
    const { isnpi, isnud, daterange: dateRange } = lowerCaseKeyForm;
    goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', {
      machineType: props.metricKey,
      isNPI: isnpi || '',
      isNUD: isnud || '',
      startTime: dayjs(dateRange[0]).valueOf(),
      endTime: dayjs(dateRange[1]).valueOf(),
    });
  };
  const bindChartClick = chartRef => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', params => {
        const { name } = params;
        const sectionVal = (sectionValOptions.find(item => item.label === name) || { value: '' }).value;
        goPage('/dashboard/operate/dieCuttingUtilizationRate/detail', { sectionVal, metricKey: props.metricKey });
      });
    }
  };

  onMounted(() => {
    bindChartClick(chartRef);
  });

  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      const { mainColor, machineType, above80, below30, sixtyToEighty, thirtyToSixty } = props.info;
      const handleOptions = {
        color: [mainColor],
        title: {
          text: machineType,
        },
        xAxis: {
          data: ['低于30%', '30%-60%', '60%-80%', '80%以上'],
        },
        series: [
          {
            data: [below30, thirtyToSixty, sixtyToEighty, above80],
          },
        ],
      };
      options.value = merge(cloneDeep(barOptions), handleOptions);
    },
    { deep: true, immediate: true },
  );
</script>
