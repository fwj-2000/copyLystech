<!--  -->
<template>
  <div class="content-wrapper">
    <!-- 数值展示 -->
    <div class="value-list-container">
      <ValueList
        v-bind="{
          list: valueList,
          valueClickable: true,
          valueClickMth: params => {
            goPage('/dashboard/operate/qualityAudit/problemDetail', params);
          },
        }" />
    </div>
    <!-- 图表 -->
    <div class="chart-container flex">
      <div class="bg-container flex">
        <bgSvg class="conte nt-wrapper"></bgSvg>
      </div>
      <div class="ct-container flex column">
        <chartSvg class="content-wrapper" :options="{ rate: FQCYield }"></chartSvg>
        <div class="legend-container left flex column" :style="`top: ${60 - (FQCYield * 60) / 100}%`">
          <span class="text-hover" @click="goPage('/dashboard/operate/qualityAudit/fqcDetail')">FQC直通率</span>
          <span class="line"></span>
        </div>
      </div>
      <div class="ct-container flex column">
        <chartSvg2 class="content-wrapper" :options="{ rate: FAIYield }"></chartSvg2>
        <div class="legend-container right flex column" :style="`bottom: ${40 + (FAIYield * 40) / 100}%`">
          <span class="text-hover" @click="goPage('/dashboard/operate/qualityAudit/faiDetail')">FAI直通率</span>
          <span class="line"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, watch } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { baseOptions } from '../config';
  import dayjs from 'dayjs';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import ValueList from '/@/views/dashboard/operate/components/styleItem/src/ValueList.vue';
  import chartSvg from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/Chart/chartSvg.vue';
  import chartSvg2 from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/Chart/chartSvg2.vue';
  import bgSvg from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/Chart/bgSvg.vue';
  import type { EChartsOption } from 'echarts';

  const props = defineProps<{
    info: any;
    listData?: any;
  }>();

  const options = ref<EChartsOption>({});
  const FAIYield = ref(0);
  const FQCYield = ref(0);
  const valueList = ref<any[]>([]);

  // 跳转页面
  const go = useGo();
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goPage = (path, params = {}) => {
    const { date } = getSearchFormValue() as any;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode: props.info?.OrgCode || 'MQ',
      date: dayjs(date).format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };

  // 设置图表数据
  const setChartData = data => {
    valueList.value = [
      {
        label: '低级问题',
        value: data.LowProblem,
        params: { type: '低级问题' },
      },
      {
        label: '常规问题',
        value: data.RegularProblem,
        params: { type: '常规问题' },
      },
    ];
    const FAIYieldValue = Number.parseFloat(data.FAIYield) || 0;
    const FQCYieldValue = Number.parseFloat(data.FQCYield) || 0;
    FAIYield.value = FAIYieldValue;
    FQCYield.value = FQCYieldValue;
    const handleOptions: EChartsOption = {
      series: [
        {
          data: [
            {
              value: FAIYieldValue,
            },
            {
              value: 100 - FAIYieldValue,
            },
          ],
        },
        {
          data: [
            {
              value: FQCYieldValue,
            },
            {
              value: 100 - FQCYieldValue,
            },
          ],
        },
      ],
    };

    options.value = merge(cloneDeep(baseOptions), handleOptions);
  };

  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      setChartData(props.info);
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  @valueHeight: 60px;

  .value-list-container {
    padding: 0 8px;
  }

  .chart-container {
    position: relative;
    width: 100%;
    height: calc(100% - @valueHeight);
    padding: 12px;
    overflow: hidden;

    .ct-container {
      position: relative;
      z-index: 2;
      height: 95%;
      margin-right: 6px;
      font-size: 12px;
      color: #666;
      margin-bottom: 5%;

      .content-wrapper {
        position: relative;
        z-index: 2;
        width: 88px;
        height: 100%;
      }

      .legend-container {
        position: absolute;
        z-index: 1;

        &.left {
          left: -60%;
          align-items: flex-start;
        }

        &.right {
          bottom: 40%;
          right: -70%;
          align-items: flex-end;
        }

        .line {
          width: 120%;
          height: 1px;
          border: 1px dashed #b4b4b4;
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .bg-container {
      position: absolute;
      z-index: 1;
      bottom: 0;
      width: 100%;

      .content-wrapper {
        // width: 100%;
        height: 94px;
      }
    }
  }
</style>
