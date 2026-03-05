<!-- 产销 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <img :src="rmbSvg" class="mr-3px mt-2px" />
            <div>
              <span>产销</span>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', rankQuery)" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/production/detail')" />
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
        <Chart :info="info" :queryInfo="queryInfo"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import dayjs from 'dayjs';
  import { isEmpty } from 'lodash-es';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getProductsalesum, getProductsalesumYearsummary } from '/@/api/dashbord/operate';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { EModules } from '/@/views/dashboard/operate/ranking/type';

  import rmbSvg from '/@/assets/svg/report/rmb.svg';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';

  dayjs.extend(weekOfYear);
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();
  const info = reactive({
    week: [],
    month: [],
    year: {},
  });

  const rankQuery = {
    name: EModules.PRODUCTION,
    date: props.queryInfo.date.subtract(7, 'day').format('YYYY-MM-DD'),
  };

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    info.week = data;
    info.month = await getMonthProductsalesum();
    info.year = await getYearsummary();
    // 缓存结果数据
    emits('updateValues', props.element.id, {
      week: info.week,
      month: info.month,
      year: info.year,
    });
  };

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, goPage } = useMainCompo({
    props,
    reqMth: getProductsalesum,
    initData: initData,
    getParams: queryInfo => {
      const date = dayjs(queryInfo.date).tz().endOf('week').add(14, 'day');
      const startDate = dayjs(queryInfo.date).tz().startOf('week').subtract(21, 'day').endOf('week');
      const startDim = `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`;
      const endDim = `${date.year()}WK${date.week().toString().padStart(2, '0')}`;
      return {
        orgCode: queryInfo.orgCode,
        dimension: TimeDimension.WEEK,
        startDim,
        endDim,
      };
    },
  });

  // 获取月维度的数据
  const getMonthProductsalesum = async () => {
    const { orgCode } = queryInfo;
    const date = dayjs(queryInfo.date).tz().add(2, 'month');
    const startDate = dayjs(queryInfo.date).tz().subtract(3, 'month');
    const startDim = startDate.format('YYYY-MM');
    const endDim = date.format('YYYY-MM');
    const params = {
      orgCode,
      dimension: TimeDimension.MONTH,
      startDim,
      endDim,
    };
    const { data = [] } = await getProductsalesum(params).catch(() => ({
      data: [],
    }));
    return data;
  };

  // 获取年度汇总的数据
  const getYearsummary = async () => {
    const { orgCode, date } = queryInfo;
    const params = {
      orgCode,
      year: date.format('YYYY'),
    };
    const { data } = await getProductsalesumYearsummary(params).catch(() => ({
      data: {},
    }));
    return data;
  };

  // 跳转页面
  const goPageMth = path => {
    const { date = dayjs().tz().subtract(1, 'day'), orgCode } = queryInfo;
    const params = {
      orgCode,
      dimension: '',
      timeDimension: TimeDimension.WEEK,
      startDate: dayjs(date).tz().subtract(3, 'week').format('YYYY-MM-DD'),
      date: dayjs(date).tz().add(4, 'week').format('YYYY-MM-DD'),
      endDate: dayjs(date).tz().add(4, 'week').format('YYYY-MM-DD'),
    };
    goPage(path, params);
  };
</script>
