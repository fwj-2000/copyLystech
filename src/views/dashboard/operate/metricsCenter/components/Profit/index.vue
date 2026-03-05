<!-- 损益 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <img :src="rmbSvg" class="mr-3px mt-2px" />
            <div class="text-hover" @click="goPageMth('/dashboard/operate/profit')">
              <span>损益</span>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPathMth('/dataAnalysis/financial/profit/rank')" />
          <!-- <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPageMth('/dashboard/operate/profitkpi/ranking')" /> -->
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/profit/detail')" />
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
        <Chart :info="info" :extraInfo="{ currentMonth }"></Chart>
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
  import { getProfitandlosMetricscenter } from '/@/api/dashbord/operate';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Profit/config';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';

  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import rmbSvg from '/@/assets/svg/report/rmb.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  const { goPath } = useRouteParams();
  dayjs.extend(weekOfYear);
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
    info.value = data;
  };

  const currentMonth = computed(() => {
    const { date } = props.queryInfo;
    return date.format('M');
  });

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, goPage } = useMainCompo({
    props,
    showCondition: true,
    reqMth: getProfitandlosMetricscenter,
    initData: initData,
    getParams: queryInfo => {
      const month = dayjs(queryInfo.date).tz().format('YYYY-MM');
      return {
        month,
        orgCode: queryInfo.orgCode,
      };
    },
  });

  // 没有日维度，此处特殊处理下
  const goPageMth = path => {
    const { date = dayjs().tz().subtract(1, 'day'), orgCode } = queryInfo;
    const params = {
      orgCode,
      dimension: '',
      timeDimension: TimeDimension.MONTH,
      date: dayjs(date).format('YYYY-MM-DD'),
      // 供排名页使用
      startDate: dayjs().startOf('year').startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs(date).format('YYYY-MM-DD'),
    };
    goPage(path, params);
  };
  const goPathMth = path => {
    const { date = dayjs().tz().subtract(1, 'day'), orgCode } = queryInfo;
    console.log('🚀 ~ goPathMth ~ queryInfo:', [dayjs().startOf('year').startOf('month'), dayjs(date)]);
    // return;
    const params = {
      orgCode,
      dimension: TimeDimension.MONTH,
      saleOutputDim: 'cz',
      dateRange: [dayjs(dayjs().startOf('year').startOf('month')), dayjs(date).subtract(0, 'month')],
    };
    goPath(path, params);
  };
</script>
