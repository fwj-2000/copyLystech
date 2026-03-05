<!-- 出勤概况 -->
<template>
  <div class="attendance-compo">
    <div class="compo-body">
      <div class="title flex row ct-between">
        <span> {{ t('views.dashboard.operate.todayProductAchievement') }}</span>
        <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
      </div>
      <div class="content flex ct-between">
        <div class="progress-container flex column">
          <div>在制<span style="font-weight: 700">38</span></div>
          <VerticalProgressBar class="progress" :progress="38" />
          <div>任务款数</div>
        </div>
        <div class="legend">
          <div v-for="(item, idx) in valueList" :key="idx" class="item">
            <p class="label">{{ item.label }}</p>
            <p class="value">{{ item.value }}%</p>
          </div>
        </div>
        <div class="progress-container right-progress flex column">
          <div>出货<span style="font-weight: 700">38</span></div>
          <VerticalProgressBar class="progress" :progress="38" />
          <div>出货款数</div>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <Chart key="normal" :options="state.options" width="100%" height="100%" class="chart" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Chart } from '/@/components/Chart';
  import { cloneDeep, merge } from 'lodash-es';
  import vectorSvg from '/@/assets/svg/report/vector.svg';
  import { baseOptions } from './config';
  import VerticalProgressBar from '../VerticalProgressBar.vue';

  defineOptions({ name: 'extend-graphDemo-echartsBar' });
  const { t } = useI18n();
  const state = reactive({
    options: {},
  });

  // todo: 将后台返回数据处理成以下格式
  // const data = []; // 主图表数据
  const handleOptions = {}; // 处理过后填充的数据

  const valueList = [
    { label: '任务达成率', value: '69' },
    { label: '出货达成率', value: '49' },
  ]; // 副文字数据
  state.options = merge(cloneDeep(baseOptions), handleOptions);
</script>

<style lang="less" scoped>
  @legendWidth: 0.6vw;

  .attendance-compo {
    position: relative;
    width: 100%;
    height: @report-operate-compo-height;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);

    .chart-container {
      width: 100%;
      height: 100%;
      padding: 0 20%;
    }

    .chart {
      width: 100%;
      height: 100%;
    }

    .compo-body {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0 16px;

      .progress-container {
        width: 20%;
        height: 100%;
        text-align: center;
        font-size: 12px;

        &.right-progress {
          :deep(.progress-bar) {
            background-color: #76c6ff;
          }
        }

        .progress {
          width: 8px;
          height: 70%;
          margin: 4px 0;
          border-radius: 50px 50px 0 0;

          :deep(.progress-bar) {
            border-radius: 50px 50px 0 0;
          }
        }
      }

      .content {
        width: 100%;
        height: calc(100% - 44px);

        .legend {
          margin-top: 12px;
          font-size: 12px;

          .item {
            &:last-child {
              .label::before {
                background-color: #76c6ff;
              }
            }
          }

          .label {
            position: relative;

            &::before {
              content: '';
              position: absolute;
              top: 6px;
              left: -12px;
              width: @legendWidth;
              height: @legendWidth;
              background-color: #3c78f5;
            }
          }

          .value {
            font-weight: 700;
          }
        }
      }

      .title {
        width: 100%;
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        height: 44px;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
</style>
