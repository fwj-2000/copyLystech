<template>
  <div class="statistics">
    <!-- yellw -->
    <div class="statistics-item statistics-yellow">
      <div class="total">
        <div class="name">{{ t('dict.CommonCol.totalDuration') }}</div>
        <div class="value">{{ summaryInfo.totalTime }}</div>
      </div>

      <img src="/@/assets/svg/machineDebug/yellowLine.svg" class="line" alt="" />

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.debugDuration') }}</div>
        <div class="value">{{ summaryInfo.testTime }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" class="arrow" alt="" />
        </div> -->
      </div>

      <div class="dash"></div>

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.runTime') }}</div>
        <div class="value">{{ summaryInfo.runTime }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" alt="" />
        </div> -->
      </div>
    </div>

    <!-- blue -->
    <div class="statistics-item statistics-blue">
      <div class="total">
        <div class="name">{{ t('dict.CommonCol.totalFrequency') }}</div>
        <div class="value">{{ summaryInfo.totalNumber }}</div>
      </div>

      <img src="/@/assets/svg/machineDebug/blueLine.svg" class="line" alt="" />

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.debugFrequency') }}</div>
        <div class="value">{{ summaryInfo.testNumber }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" class="arrow" alt="" />
        </div> -->
      </div>

      <div class="dash"></div>

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.runNumber') }}</div>
        <div class="value">{{ summaryInfo.runNumber }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" alt="" />
        </div> -->
      </div>
    </div>

    <!-- purple -->
    <div class="statistics-item statistics-purple">
      <div class="total">
        <div class="name">{{ t('dict.CommonCol.totalProportion') }}</div>
        <div class="value">{{ summaryInfo.totalRatio }}</div>
      </div>

      <img src="/@/assets/svg/machineDebug/blueLine.svg" class="line" alt="" />

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.debugProportion') }}</div>
        <div class="value">{{ summaryInfo.testRatio }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" class="arrow" alt="" />
        </div> -->
      </div>

      <div class="dash"></div>

      <div class="debug">
        <div class="name">{{ t('dict.CommonCol.operationProportion') }}</div>
        <div class="value">{{ summaryInfo.runRatio }}</div>
        <!-- <div class="comparison">
          <span class="yesterday">昨日全天</span>
          <span class="number">+96</span>
          <img src="/@/assets/svg/report/increase.svg" alt="" />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const props = defineProps({
    summaryInfo: {
      type: Object,
      default: () => ({
        runNumber: '',
        runRatio: '',
        runTime: '',
        testNumber: '',
        testRatio: '',
        testTime: '',
        totalNumber: 0,
        totalRatio: '',
        totalTime: '',
      }),
    },
  });
</script>
<style lang="less" scoped>
  .statistics {
    display: flex;
    margin: 16px;

    .statistics-item {
      padding: 18px 10px 5px;
      flex: 1;
      margin-right: 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
      background-size: 70px auto;
      // background-size: 90px auto;
      background-position: right 0 bottom 0;
      height: 90px; // 去掉

      &:last-child {
        margin-right: 0;
      }

      .total {
        flex: 1;
        height: 100%;
        margin-left: 8px;

        .name {
          color: #1d2129;
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 7px;
        }

        .value {
          font-size: 20px;
          font-weight: 500;
        }
      }

      .line {
        height: 100%;
      }

      .debug {
        flex: 1;
        margin-left: 18px;
        height: 100%;

        .name {
          color: #1d2129;
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 7px;
        }

        .value {
          font-size: 20px;
          font-weight: 500;
          color: #1d2129;
        }

        .comparison {
          display: flex;
          align-items: center;
          margin-top: 30px;
          font-size: 14px;
          line-height: 20px;

          .yesterday {
            color: #aeaeae;
          }

          .number {
            color: #1a1a1a;
            margin: 0 4px;
          }

          .arrow {
            width: 10px;
            height: 10px;
          }
        }
      }

      .dash {
        height: 50px; // 90
        width: 10px;
      }
    }

    .statistics-yellow {
      border-left: 4px solid #ff7b00;
      background-image: url('/@/assets/images/machineDebug/yellow_clock_bg.png');
      background-color: #fff1e4;

      .total {
        .value {
          color: #ff7b00;
        }
      }

      .dash {
        border-right: 1px dashed #ccac8f;
      }
    }

    .statistics-blue {
      border-left: 4px solid #48b9ff;
      background-image: url('/@/assets/images/machineDebug/blue_clock_bg.png');
      background-color: #e4f8ff;

      .total {
        .value {
          color: #48b9ff;
        }
      }

      .dash {
        border-right: 1px dashed #bfdbe5;
      }
    }

    .statistics-purple {
      border-left: 4px solid #4b7bec;
      background-image: url('/@/assets/images/machineDebug/purple_clock_bg.png');
      background-color: #eaf0ff;

      .total {
        .value {
          color: #4b7bec;
        }
      }

      .dash {
        border-right: 1px dashed #b2c2ea;
      }
    }
  }
</style>
