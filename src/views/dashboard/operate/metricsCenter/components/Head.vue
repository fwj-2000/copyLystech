<!--  -->
<template>
  <div class="head-content-compo flex row ct-around gap-middle">
    <TextReport class="item-content" :info="manPowerInfo"></TextReport>
    <TextReport class="item-content" :info="cuttingInfo" @click="goDetail('dieCutToAchieve')"></TextReport>
    <TextReport class="item-content" :info="productionInfo"></TextReport>
    <TextReport class="item-content" :info="ticketInfo"></TextReport>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import TextReport from './Text.vue';
import { TextReportInfo } from '../types';

import ticketImg from '/@/assets/images/report/ticket.png';
import manpowerImg from '/@/assets/images/report/manpower.png';
import productionYieldImg from '/@/assets/images/report/production_yield.png';
import cuttingRateImg from '/@/assets/images/report/cutting_rate.png';
import { useGo } from '/@/hooks/web/usePage';

const go = useGo();
// todo: 此处数据写死，需要对接接口
const manPowerInfo: TextReportInfo = reactive({
  image: manpowerImg,
  main: {
    label: '人力出勤率',
    value: '98%',
  },
  secondary: [
    {
      label: '白班',
      value: '20%',
    },
    {
      label: '晚班',
      value: '20%',
    },
  ],
});
const cuttingInfo: TextReportInfo = reactive({
  image: cuttingRateImg,
  main: {
    label: '今日模切达成率',
    value: '98%',
  },
  secondary: [
    {
      label: '批次率',
      value: '12.3%',
    },
    {
      label: '数量达成率',
      value: '20%',
    },
  ],
});
const ticketInfo: TextReportInfo = reactive({
  image: ticketImg,
  main: {
    label: '工单数量',
    value: '2341',
  },
  secondary: [
    {
      label: '结单',
      value: '202',
    },
    {
      label: '在制',
      value: '122',
    },
  ],
});
const productionInfo: TextReportInfo = reactive({
  image: productionYieldImg,
  main: {
    label: '制作良率',
    value: '66%',
  },
  secondary: [
    {
      label: '模切',
      value: '20%',
    },
    {
      label: '通用AOI',
      value: '30%',
    },
    {
      label: '手工',
      value: '30%',
    },
  ],
});

const goDetail = (pageName) => {
  go(`/dashboard/operate/metricsCenter/detail/${pageName}`);
}
</script>

<style lang="less" scoped>
.head-content-compo {
  overflow-x: scroll;
  padding-bottom: 6px;

  .item-content {
    min-width: 291px;
    width: 24%;
    cursor: pointer;
  }
}
</style>
