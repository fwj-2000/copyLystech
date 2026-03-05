<!-- 工单状况 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead v-bind="{
        title: t('views.dashboard.operate.statusOfTicket'),
      }">
        <template #right>
          <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
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
import vectorSvg from '/@/assets/svg/report/vector.svg';
import { isEmpty } from 'lodash-es';
import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
import { getOrderstatusdata } from '/@/api/dashbord/operate';

import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
import Chart from './Chart/index.vue';

import { SearchFormValueType } from '/@/views/dashboard/operate/types';
import { ref } from 'vue';

const emits = defineEmits(['updateValues']);

const props = defineProps<{
  element: any;
  queryInfo: SearchFormValueType;
}>();
const info: any = ref({});


// 初始化图表数据
const initData = async (data, {
  isEmptyData,
}) => {
  isEmptyData.value = isEmpty(data.model);
  // todo: 本地调试用
  isEmptyData.value = false;
  // 数据为空
  if (isEmptyData.value) {
    return;
  }
  // 缓存结果数据
  emits('updateValues', props.element.id, data);
  // const { model = {} } = data;
  info.value = data;
}

// 组件hooks
const { loading, isEmptyData, t } = useMainCompo({
  props,
  reqMth: getOrderstatusdata,
  initData,
})
</script>
