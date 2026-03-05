<!-- 品质稽核 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <CompoHead>
        <template #left>
          <div class="text-hover" @click="goPage('/dashboard/operate/qualityAudit')">
            <span> {{ t('views.dashboard.operate.qualityAudit') }}</span>
          </div>
        </template>
        <template #right>
          <img
            :src="rankSvg"
            class="zoom-icon mr-8px"
            @click="goPage('/dashboard/operate/ranking', { name: EModules.QUALITY_AUDIT, dimension: TimeDimension.DAY })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/qualityAudit/detail')" />
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
          showList: false,
          isEmptyData: isEmptyData,
        }">
        <Chart :info="info"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getQcauditdata } from '/@/api/dashbord/operate';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/config';

  import { EModules } from '/@/views/dashboard/operate/ranking/type';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import Chart from './Chart/index.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();
  const info = ref({});

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data.model);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data.model);
    info.value = data.model;
  };

  const { loading, isEmptyData, t, goPage } = useMainCompo({
    props,
    reqMth: getQcauditdata,
    initData: initData,
  });
</script>
