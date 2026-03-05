<!-- 单个工厂开机率数据 -->
<template>
  <div class="compo-container">
    <div class="compo-header-container flex ct-between">
      <div class="flex">
        <div class="title flex ct-start">
          <p class="factory-name">{{ props.info.OrgName }}</p>
        </div>
      </div>
      <div class="flex row">
        <p class="value-wrapper mr-12px" :class="{ error: false }">
          {{ t('views.dashboard.operate.attendanceRate.title') }}：
          <span class="value">{{ props.info.AllCQRate }}</span>
        </p>
        <img :src="chartSvg" class="chart-icon" @click="goDetail">
      </div>
    </div>
    <ChartItem :info="props.info" :searchFormValue="props.searchFormValue"></ChartItem>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGo } from '/@/hooks/web/usePage';

import chartSvg from '/@/assets/svg/report/chart.svg';
import ChartItem from './Item.vue';

const go = useGo();
const { t } = useI18n();
const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  searchFormValue: {
    type: Object,
    default: () => { }
  }
})
const getSearchFormValue = inject('getSearchFormValue', () => { });
// 去详情页
const goDetail = () => {
  const orgCode = props.info.OrgCode;
  const { timeDimension, date } = getSearchFormValue() as any;
  go(`/dashboard/operate/attendanceRate/detail?orgCode=${orgCode}&dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}`);
}
</script>

<style lang="less" scoped>
@titleHeight: 38px;

.compo-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #FFF;
  overflow: hidden;

  .compo-header-container {
    width: 100%;
    padding: 0 12px;
    height: @titleHeight;
    background-color: #f7f7f7;

    .chart-icon {
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }


    .value-wrapper {
      color: #1A1A1A;
      font-size: 14px;
      line-height: 22px;

      .value {
        font-size: 15px;
        line-height: 22px;
      }

      &.error {
        color: #E12929;
      }

    }

    .title {
      position: relative;
      color: #1A1A1A;

      .factory-name {
        font-size: 15px;
      }

      .illustrate {
        margin-left: 11px;
      }

    }
  }
}
</style>

<style lang="less">
.uptime-tooltips {
  .head-container {
    color: #1a1a1a;
  }

  .content-container {
    width: 100%;
    height: 100%;

    .item-container {
      width: 132px;
      padding: 10px 12px;
      background: #f2f2f2;
      margin-right: 12px;

      .item {
        &.style1 {
          color: '#1a1a1a'
        }

        &.style2 {
          color: '#666'
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>