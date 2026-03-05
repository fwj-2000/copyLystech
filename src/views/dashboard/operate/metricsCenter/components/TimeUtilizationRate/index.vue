<!-- 时间稼动率首页组件 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <div class="text-hover" @click="goPage('/dashboard/operate/timeUtilizationRate')">
              <span> {{ t('views.dashboard.operate.oee.timeUtilizationRate') }}</span>
              <span v-if="!isEmptyData" class="ml-8px"> {{ info.Moqiejiadonglv }}</span>
            </div>
            <div class="flex m-l-12px">
              <div class="flex px-6px" style="height: 24px; color: #1a1a1a; background-color: #e6e6e6">含NPI</div>
              <a-select ref="select" v-model:value="extraParams.isContain" size="small">
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
            <img :src="vectorSvg" style="margin: 0 0 1px 4px" /> </a-popover
        ></template>
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
  import { isEmpty } from 'lodash-es';
  import { getUtilizationrateMainData } from '/@/api/dashbord/report';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import {
    POPOVER_TOOLTIP_LIST,
    DEFAULT_IS_CONTAIN,
    isContainOptions,
  } from '/@/views/dashboard/operate/metricsCenter/components/TimeUtilizationRate/chart/config';

  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import Chart from './chart/index.vue';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

  import { EModules } from '/@/views/dashboard/operate/ranking/type';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { ref } from 'vue';

  const emits = defineEmits(['updateValues']);
  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();
  const info = ref({
    Moqiejiadonglv: '0%',
  });

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data.model);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    info.value = {
      ...data.model,
    };
  };

  const { loading, isEmptyData, extraParams, t, goPage } = useMainCompo({
    props,
    defaultExtraParams: {
      isContain: DEFAULT_IS_CONTAIN,
    },
    reqMth: getUtilizationrateMainData,
    initData: initData,
  });
</script>
