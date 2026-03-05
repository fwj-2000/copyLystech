<!-- 开机率 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead v-bind="{
        title: t('views.dashboard.operate.uptime'),
        mainPage: '/dashboard/operate/uptime',
        clickMth: goPage,
      }">
        <template #left>
          <div>
            <span class="text-hover" @click="goPage('/dashboard/operate/uptime')">
              <span> {{ t('views.dashboard.operate.uptime') }}</span>
              <span v-if="!isEmptyData" class="ml-8px"> {{ info.WorkingRate }}</span>
            </span>
            <span class="text-hover ml-8px" @click="
              goPage('/dashboard/operate/uptime/machineDetails', {
                status: PowerOnStatus.ON,
              })
              ">
              {{ t('views.dashboard.operate.uptimeDetail.numberOfBoots') }}：{{ info.RotaryWoringNum +
                info.PlatWorkingNum || 0 }}
            </span>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px"
            @click="goPage('/dashboard/operate/ranking', { name: EModules.UPTIME })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/uptime/detail')" />
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
import { ref } from 'vue';
import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
import { isEmpty } from 'lodash-es';
import { getMachworkingMaindata } from '/@/api/dashbord/operate';

import chartSvg from '/@/assets/svg/report/chart.svg';
import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
import rankSvg from '/@/assets/svg/report/rank.svg';
import Chart from './Chart/index.vue';
import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Uptime/config';

import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

import { PowerOnStatus, SearchFormValueType } from '/@/views/dashboard/operate/types';
import { EModules } from '/@/views/dashboard/operate/ranking/type';

const emits = defineEmits(['updateValues']);

const props = defineProps<{
  element: any;
  queryInfo: SearchFormValueType;
}>();

const info = ref({
  WorkingRate: '',
  RotaryWoringNum: 0,
  PlatWorkingNum: 0,
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
  info.value = data.model;
};
const { loading, isEmptyData, t, goPage } = useMainCompo({
  props,
  reqMth: getMachworkingMaindata,
  initData: initData,
});
</script>
