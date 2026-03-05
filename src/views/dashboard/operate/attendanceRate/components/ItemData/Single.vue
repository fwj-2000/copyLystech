<!-- 单个工厂开机率数据 -->
<template>
  <div class="compo-container">
    <div class="compo-header-container flex ct-between">
      <div class="flex">
        <div class="title flex ct-start mr-16px">
          <p class="factory-name">{{ props.info.OrgName }}</p>
        </div>
        <p class="value-wrapper" :class="{ error: false }">
          {{ t('views.dashboard.operate.attendanceRate.title') }}：
          <span class="value">{{ props.info.AllCQRate }}</span>
        </p>
      </div>
      <div class="flex row">
        <img :src="chartSvg" class="chart-icon mr-8px" @click="goDetail">
        <a-popover placement="right">
          <template #content>
            <RatePopover />
          </template>
          <img :src="illustrateSvg">
        </a-popover>
      </div>
    </div>
    <ChartItem :info="props.info" :searchFormValue="props.searchFormValue"></ChartItem>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '/@/hooks/web/useI18n';
import { useGo } from '/@/hooks/web/usePage';

import illustrateSvg from '/@/assets/svg/report/illustrate.svg';
import chartSvg from '/@/assets/svg/report/chart.svg';
import RatePopover from '../RatePopover.vue';
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
// 去详情页
const goDetail = () => {
  const orgCode = props.info.OrgCode;
  const { timeDimension, date } = props.searchFormValue;
  go(`/dashboard/operate/attendanceRate/detail?orgCode=${orgCode}&dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}`);
}
</script>

<style lang="less" scoped>
@titleHeight: 38px;

.compo-container {
  width: 100%;
  border-radius: 8px;
  background: #FFF;
  overflow: hidden;
  box-shadow:
    0px 10px 18.2px 0px rgba(63, 63, 63, 0.10),
    0px -1px 20px 0px rgba(63, 63, 63, 0.05);

  .compo-content-container {
    width: 100%;
    height: 192px;
    padding: 12px;
    background-color: #fff;

    .chart-right-wrapper {
      position: relative;
      width: 60%;
      height: 100%;

      .chart-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;

      }

      .info {
        position: relative;
        z-index: 1;
        width: 80%;
        color: #1A1A1A;
        font-size: 11px;

        .legend {
          display: inline-block;
          width: 8px;
          height: 8px;

          &.legend1 {
            background: linear-gradient(37deg, #00D6D0 23.36%, #00AAE2 90.54%);
          }

          &.legend2 {
            background: #4676E6;
          }

          &.legend3 {
            background: #EEC56B;
          }
        }
      }
    }

    .chart-wrapper {
      width: 40%;
      height: 100%;

      .rate-info {
        p {
          width: 30%;
        }
      }

      .info {
        color: #1A1A1A;
        font-size: 11px;

        .label {
          color: #999;
        }
      }
    }
  }

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