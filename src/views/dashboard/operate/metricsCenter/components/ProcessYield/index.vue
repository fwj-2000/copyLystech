<!-- 制程良率首页组件 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead v-bind="{
        title: t('views.dashboard.operate.processYield.title'),
        mainPage: '/dashboard/operate/processYield',
        clickMth: goPage,
      }">
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px"
            @click="goPage('/dashboard/operate/ranking', { name: EModules.PROCESSYIELD })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/processYield/detail')">
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
      <SpinContent v-bind="{
        loading: loading,
        isEmptyData: isEmptyData,
        showList: false,
      }">
        <Chart :info="info"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
import { getProcessyielddata } from '/@/api/dashbord/operate';
import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/ProcessYield/Chart/config';

import rankSvg from '/@/assets/svg/report/rank.svg';
import chartSvg from '/@/assets/svg/report/chart.svg';
import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
import Chart from './Chart/index.vue';
import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

import { EModules } from '/@/views/dashboard/operate/ranking/type';
import { SearchFormValueType } from '/@/views/dashboard/operate/types';
import { isEmpty } from 'lodash-es';
import { ref } from 'vue';

const emits = defineEmits(['updateValues']);

const props = defineProps<{
  element: any;
  queryInfo: SearchFormValueType;
}>();
const info = ref({});

// 初始化图表数据
const initData = async (data, {
  isEmptyData,
}) => {
  isEmptyData.value = isEmpty(data.model);
  // 数据为空
  if (isEmptyData.value) {
    return;
  }
  // 缓存结果数据
  emits('updateValues', props.element.id, data);
  const { model = {} } = data;
  info.value = model;
}

const { loading, isEmptyData, t, goPage } = useMainCompo({
  props,
  reqMth: getProcessyielddata,
  initData,
})
</script>
