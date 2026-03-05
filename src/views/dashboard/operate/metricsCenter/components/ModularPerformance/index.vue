<!-- 模切绩效 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <!-- <img :src="rmbSvg" class="mr-3px mt-2px" /> -->
            <div class="text-hover" @click="goPageMth('/dashboard/operate/mpf')"> <span>模切绩效</span> {{ currentMonth }} </div>
          </div>
        </template>
        <template #right>
          <img
            :src="rankSvg"
            class="zoom-icon mr-8px"
            @click="goPage('/dashboard/operate/ranking', { name: EModules.MPF, date: currentMonth, title: '模切绩效排名' })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/mpf/detail')" />
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
        <Chart :info="info"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';
  import { isEmpty } from 'lodash-es';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getPerformanceratio } from '/@/api/dashbord/operate';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/ModularPerformance/config';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { EModules } from '/@/views/dashboard/operate/ranking/type';

  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import { MPFInfo } from './types';
  dayjs.extend(weekOfYear);
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();

  const info = ref<MPFInfo>({
    orgCode: '',
    months: '',
    groupName: '',
    currentScore: 0,
    score: 0,
    achievedTimes: 0,
    oaTime: 0,
    scoreZb: '',
    oaZb: '',
  });

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    console.log('🚀 ~ initData ~ data:', data);
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    info.value = data;
  };

  const currentMonth = computed(() => {
    const { date } = props.queryInfo;
    return dayjs(date).tz().subtract(1, 'month').format('YYYY-MM');
  });

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, goPage } = useMainCompo({
    props,
    showCondition: true,
    reqMth: getPerformanceratio,
    initData: initData,
    getParams: queryInfo => {
      return {
        month: currentMonth.value,
        orgCode: queryInfo.orgCode,
      };
    },
  });

  // 没有日维度，此处特殊处理下
  const goPageMth = path => {
    let { date, orgCode } = queryInfo;
    date = dayjs(date).tz().subtract(1, 'month');
    const params = {
      orgCode,
      timeDimension: TimeDimension.MONTH,
      dimension: TimeDimension.MONTH,
      date: date.format('YYYY-MM-DD'),
      startDate: dayjs(date).format('YYYY-MM'),
      endDate: dayjs(date).format('YYYY-MM'),
    };
    goPage(path, params);
  };
</script>
