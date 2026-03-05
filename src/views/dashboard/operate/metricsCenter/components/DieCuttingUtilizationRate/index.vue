<!-- 时间稼动率首页组件 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <div class="text-hover" @click="goPage('/dashboard/operate/dieCuttingUtilizationRate')">
              <span>模切稼动率</span>
            </div>
            <div class="flex m-l-12px">
              <a-select ref="select" v-model:value="extraParams.tag" size="small" :dropdownMatchSelectWidth="false">
                <a-select-option v-for="item in isContainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', { name: EModules.TIME_UTILIZATION_RATE })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/timeUtilizationRate/detail')" />
          <a-popover placement="right">
            <template #content>
              <InfoPopover :info-list="POPOVER_TOOLTIP_LIST"></InfoPopover>
            </template>
            <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
          </a-popover>
        </template>
      </CompoHead>
    </div>
    <div class="compo-body">
      <!-- 内容封装组件 -->
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData: isEmptyData,
          showList: false,
        }">
        <Chart :info="info" :searchFormValue="props.queryInfo" :extraParams="extraParams"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { isEmpty, pick } from 'lodash-es';
  import { getDiecututilization } from '/@/api/dashbord/report';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import {
    POPOVER_TOOLTIP_LIST,
    DEFAULT_IS_CONTAIN,
    isContainOptions,
  } from '/@/views/dashboard/operate/metricsCenter/components/DieCuttingUtilizationRate/chart/config';

  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import Chart from './chart/index.vue';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

  import { EModules } from '/@/views/dashboard/operate/ranking/type';
  import { SearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
  import { ref } from 'vue';

  const emits = defineEmits(['updateValues']);
  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();
  const info = ref({});

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    info.value = {
      rateInfo: pick(data[0] || {}, ['NoNudRate', 'IsNudRate', 'AchievementRate']),
      lineInfo: data,
    };
  };

  const { loading, isEmptyData, extraParams, goPage } = useMainCompo({
    props,
    defaultExtraParams: {
      tag: DEFAULT_IS_CONTAIN,
    },
    reqMth: getDiecututilization,
    initData: initData,
    getParams: searchFormValue => {
      const { date } = searchFormValue;
      const weekStartDate = date.subtract(3, 'week').endOf('week');
      const weekEndDate = date.endOf('week');
      return {
        orgCode: searchFormValue.orgCode,
        tag: extraParams.value.tag,
        dimension: TimeDimension.WEEK,
        period: '2', // 固定传2
        day: searchFormValue.date.format('YYYY-MM-DD'),
        startDim: `${weekStartDate.year()}WK${weekStartDate.week().toString().padStart(2, '0')}`,
        endDim: `${weekEndDate.year()}WK${weekEndDate.week().toString().padStart(2, '0')}`,
      };
    },
  });
</script>
