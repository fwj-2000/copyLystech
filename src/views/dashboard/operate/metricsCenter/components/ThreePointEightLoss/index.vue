<!-- 边贡 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <img :src="rmbSvg" class="mr-3px mt-2px" />
            <div class="text-hover" @click="goPageMth('/dashboard/operate/threePointEightLoss')">
              <span> 3.8损耗</span>
              <!-- <span> {{ t('views.dashboard.operate.financeeconomic.title') }}</span> -->
              <span class="ml-4px">{{ weekStr }}</span>
            </div>
            <!-- <div class="flex m-l-12px">
              <div class="flex px-6px" style="height: 24px; color: #1a1a1a; background-color: #e6e6e6">是否纳入边贡</div>
              <a-select ref="select" v-model:value="extraParams.isBian" size="small" :dropdownMatchSelectWidth="false">
                <a-select-option v-for="item in IS_INCLUDE_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </div> -->
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', rankPageQuery)" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/threePointEightLoss/detail')" />
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
  import dayjs from 'dayjs';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getLoss38metricscenter } from '/@/api/dashbord/operate';
  import { POPOVER_TOOLTIP_LIST, IS_INCLUDE_OPTIONS, DEFAULT_IS_INCLUDE } from '/@/views/dashboard/operate/metricsCenter/components/ThreePointEightLoss/config';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

  import { EModules } from '/@/views/dashboard/operate/ranking/type';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { isEmpty } from 'lodash-es';
  import { computed, ref } from 'vue';
  import rmbSvg from '/@/assets/svg/report/rmb.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  dayjs.extend(weekOfYear);
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();

  const info = ref({});
  const weekStr = ref('');

  const rankPageQuery = computed(() => ({
    name: EModules.WORKLOSS38RANK,
    dimension: TimeDimension.WEEK,
    date: props.queryInfo.date.subtract(7, 'day').format('YYYY-MM-DD'),
  }));

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data.model);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    const { model = {} } = data;
    info.value = model;
  };

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, extraParams, t, goPage } = useMainCompo({
    props,
    showCondition: true,
    defaultExtraParams: {
      isBian: DEFAULT_IS_INCLUDE,
    },
    reqMth: getLoss38metricscenter,
    initData: initData,
    getParams: queryInfo => {
      const date = dayjs(queryInfo.date).tz().subtract(7, 'day');
      weekStr.value = `WK${date.week().toString().padStart(2, '0')}`;
      const condition = `${date.year()}${weekStr.value}`;
      return {
        // isBian: extraParams.value.isBian,
        condition,
        orgCode: queryInfo.orgCode,
      };
    },
  });

  // 边贡没有日维度，此处特殊处理下
  const goPageMth = path => {
    const { date, orgCode } = queryInfo;
    const params = {
      orgCode,
      dimension: TimeDimension.WEEK,
      startDate: dayjs(date).tz().subtract(49, 'day').startOf('week').format('YYYY-MM-DD'),
      date: dayjs(date).tz().subtract(7, 'day').endOf('week').format('YYYY-MM-DD'),
    };
    goPage(path, params);
  };
</script>
