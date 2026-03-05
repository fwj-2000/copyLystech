<!-- 費用 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="flex">
            <img :src="rmbSvg" class="mr-3px mt-2px" />
            <div class="text-hover" @click="goPageMth('/dashboard/operate/expense')">
              <span>{{ searchWeekStr }}费用</span>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goRank" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/expense/detail')" />
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
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { getFaremanageAllocation } from '/@/api/dashbord/report';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';

  import rmbSvg from '/@/assets/svg/report/rmb.svg';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import { isArray } from '/@/utils/is';

  dayjs.extend(weekOfYear);
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();

  const info = ref({});
  const { goPath } = useRouteParams();

  const searchData = computed(() => {
    const { date = dayjs() } = props.queryInfo;
    return date.subtract(7, 'day');
  });

  const searchWeekStr = computed(() => {
    return `WK${searchData.value.week().toString().padStart(2, '0')}`;
  });

  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    const formatData = Object.keys(data).reduce((pre, key) => {
      if (isArray(data[key])) {
        return {
          ...pre,
          ...data[key].reduce(
            (p, c) => ({
              ...p,
              [c.keys]: c.values,
            }),
            {},
          ),
        };
      }
      return {
        ...pre,
        [key]: data[key],
      };
    }, {});
    // 缓存结果数据
    emits('updateValues', props.element.id, formatData);
    info.value = formatData;
  };

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, goPageCustom } = useMainCompo({
    props,
    reqMth: getFaremanageAllocation,
    initData: initData,
    getParams: searchFormValue => {
      const date = searchFormValue.date.subtract(7, 'day').endOf('week');
      return {
        week: `${date.year()}WK${date.week().toString().padStart(2, '0')}`,
        orgCode: searchFormValue.orgCode,
      };
    },
  });

  // 跳转页面
  const goPageMth = path => {
    const { orgCode } = queryInfo;
    const params = {
      orgCode,
      dimension: '',
      timeDimension: TimeDimension.WEEK,
      startDate: searchData.value.subtract(7, 'day').format('YYYY-MM-DD'),
      date: searchData.value.format('YYYY-MM-DD'),
      endDate: searchData.value.format('YYYY-MM-DD'),
    };
    goPageCustom(path, params);
  };

  const goRank = () => {
    const { orgCode } = queryInfo;
    const path = '/dataAnalysis/financial/expense/rank';
    const params = {
      orgCode,
      date: searchData.value,
      timeDimension: TimeDimension.WEEK,
    };
    goPath(path, params);
  };
</script>
