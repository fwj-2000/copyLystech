<!-- AOI稼动 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <CompoHead>
        <template #left>
          <div class="flex">
            <span class="text-hover" @click="goPage('/dashboard/operate/utilizationRate')"> {{ t('views.dashboard.operate.aoiIsInActionToday.title') }}</span>
            <div class="flex m-l-12px">
              <a-select ref="select" v-model:value="extraParams.mark" size="small">
                <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', { name: EModules.AOIDATA, title: 'AOI稼动率排名' })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/utilizationRate/detail')" />
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
        <!-- 图表 -->
        <Chart :info="info" width="100%" height="100%" style="width: 100%; height: 100%" />
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import Chart from './Chart/index.vue';
  import { getAoidatanew } from '/@/api/dashbord/report';
  import { POPOVER_TOOLTIP_LIST, AOI_MARK_OPTIONS, DEFAULT_AOI_MARK } from './config';

  import { SpinContent, CompoHead } from '/@/views/dashboard/operate/components/styleItem/index';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  import { EModules } from '/@/views/dashboard/operate/ranking/type';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';

  const emits = defineEmits(['updateValues']);
  provide('getExtraParams', () => {
    return extraParams.value;
  });

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();
  const info = ref<any>({});

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    info.value = data[0];
  };

  const { loading, isEmptyData, extraParams, t, goPage } = useMainCompo({
    props,
    defaultExtraParams: {
      mark: DEFAULT_AOI_MARK,
    },
    reqMth: getAoidatanew,
    initData: initData,
  });
</script>
