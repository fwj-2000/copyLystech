<!-- 客诉 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="text-hover" @click="goPageMth('/dashboard/operate/customerComplaints')">
            <span> {{ t('views.dashboard.operate.customerComplaints.title') }}</span>
          </div>
        </template>
        <template #right>
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPageMth('/dashboard/operate/customerComplaints/detail')" />
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
        <template #empty>
          <EmptyComplain v-show="!loading && isEmptyData"></EmptyComplain>
        </template>
        <Chart :info="info"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getCustomcomplaintdata } from '/@/api/dashbord/operate';
  import EmptyComplain from '/@/views/dashboard/operate/components/EmptyComplain.vue';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/CustomerComplaints/config';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';

  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { isEmpty } from 'lodash-es';
  import { ref } from 'vue';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  defineOptions({ name: 'dashboard-operate-CustomerComplaints' });

  dayjs.extend(weekOfYear);
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
    emits('updateValues', props.element.id, data);
    const { model = {} } = data;
    info.value = model;
  };

  // 使用封装的组件hooks
  const { loading, isEmptyData, queryInfo, t, goPage } = useMainCompo({
    props,
    showCondition: true,
    reqMth: getCustomcomplaintdata,
    initData: initData,
  });

  // 客诉没有日维度，此处特殊处理下
  const goPageMth = path => {
    const { date = dayjs().subtract(1, 'day'), orgCode } = queryInfo;
    const params = {
      orgCode,
      dimension: TimeDimension.WEEK,
      startDate: dayjs(date).tz().startOf('week').format('YYYY-MM-DD'),
      date: dayjs(date).tz().endOf('week').format('YYYY-MM-DD'),
    };
    goPage(path, params);
  };
</script>
