<!-- oee 组件给指标中心用  -->
<template>
  <div class="compo-container">
    <div class="compo-content-container">
      <div class="compo-content-wrapper flex column item-start ct-around">
        <div class="compo-head-content flex ct-between wrap">
          <a-popover placement="right" @mouseenter="getUtilizationInfo">
            <template #content>
              <TimeUtilizationRatePopover :info="state.utilizationInfo" :rate="props.info.Moqiejiadonglv"
                :state="props.info.MoqiejiadonglvState">
              </TimeUtilizationRatePopover>
            </template>
            <div class="head-info flex column ct-between"
              @click="goDetail('timeUtilizationRateAbnormal', props.info.MoqiejiadonglvState, props.info.Moqiejiadonglv)">
              <p class="title">时间稼动率</p>
              <div class="flex ct-start">
                <p :class="['value', !props.info.MoqiejiadonglvState ? 'error' : '']">
                  {{ props.info.Moqiejiadonglv || '0%' }}
                </p>
                <StateSvg v-if="!props.info.MoqiejiadonglvState" style="margin-left: 4px;" />
              </div>
            </div>
          </a-popover>
          <a-popover placement="right" @mouseenter="getMquserateInfo">
            <template #content>
              <PerformanceUtilizationPopover :info="state.mquserateInfo" :rate="props.info.Xingnengliyonglv"
                :state="props.info.XingnengliyonglvState">
              </PerformanceUtilizationPopover>
            </template>
            <div class="head-info flex column ct-between"
              @click="goDetail('performanceUtilizationAbnormal', props.info.XingnengliyonglvState, props.info.Xingnengliyonglv)">
              <p class="title">
                性能利用率
              </p>
              <div class="flex ct-start">
                <p :class="['value', !props.info.XingnengliyonglvState ? 'error' : '']">{{ props.info.Xingnengliyonglv
                  ||
                  '0%' }}</p>
                <StateSvg v-if="!props.info.XingnengliyonglvState" :value="props.info.Xingnengliyonglv"
                  style="margin-left: 4px;" />
              </div>
            </div>
          </a-popover>
          <a-popover placement="right" @mouseenter="getMqyieldInfo">
            <template #content>
              <DieCuttingYieldPopover :info="state.mqyieldInfo" :rate="props.info.Moqielianglv"
                :state="props.info.MoqielianglvState">
              </DieCuttingYieldPopover>
            </template>
            <div class="head-info flex column ct-between"
              @click="goDetail('dieCuttingYieldAbnormal', props.info.MoqielianglvState, props.info.Moqielianglv)">
              <p class="title">
                模切良率
              </p>
              <div class="flex ct-start">
                <template v-if="!props.info.MoqielianglvState">
                  <p :class="['value', !props.info.MoqielianglvState ? 'error' : '']">
                    {{ props.info.Moqielianglv || '0%' }}
                  </p>
                  <StateSvg :value="props.info.Moqielianglv" style="margin-left: 4px;" />
                </template>
                <p v-else :class="['value', !props.info.MoqielianglvState ? 'error' : '']">
                  {{ props.info.Moqielianglv || '0%' }}
                </p>
              </div>
            </div>
          </a-popover>
        </div>
        <div class="compo-foot-wrapper flex column item-start">
          <div class="info flex ct-between" style="margin-bottom: 12px;">
            <div class="info-title">NUD</div>
            <div style="width: calc(100% - 48px)" class="flex">
              <div class="progress-wrapper flex column">
                <p class="title flex">NPI {{ props.info.NudNpi || '0%' }}</p>
                <div class="progress-bar reverse">
                  <div class="progress" :style="{ width: `${props.info.NudNpi || '0%'}` }"></div>
                </div>
              </div>
              <div class="progress-wrapper flex column">
                <p class="title flex">MP {{ props.info.NudMp || '0%' }}</p>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${props.info.NudMp || '0%'}` }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="info flex ct-between">
            <div class="info-title">非NUD</div>
            <div style="width: calc(100% - 48px)" class="flex">
              <div class="progress-wrapper flex column">
                <p class="title flex">NPI {{ props.info.NoNudNpi || '0%' }}</p>
                <div class="progress-bar reverse">
                  <div class="progress" :style="{ width: `${props.info.NoNudNpi || '0%'}` }"></div>
                </div>
              </div>
              <div class="progress-wrapper flex column">
                <p class="title flex">MP {{ props.info.NoNudMp }}</p>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${props.info.NoNudMp || '0%'}` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DieCuttingYieldPopover from './DieCuttingYieldPopover.vue';
import PerformanceUtilizationPopover from './PerformanceUtilizationPopover.vue';
import TimeUtilizationRatePopover from './TimeUtilizationRatePopover.vue';
import StateSvg from './StateSvg.vue';
import { reactive } from 'vue';
import { getOeedataIssueMquserate, getOeedataIssueMqyield, getUtilizationrateIssues } from '/@/api/dashbord/operate';
import { TimeDimension, SearchFormValueType } from '../../types';
import { isEmpty } from 'lodash-es'
import { useGo } from '/@/hooks/web/usePage';
import { PageEnum } from '/@/enums/pageEnum';

const go = useGo();

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({
      Factory: '',
      Xingnengliyonglv: '',
      Moqiejiadonglv: '',
      Oee: '',
      NudNpi: '',
      NudMp: '',
      NoNudNpi: '',
      NoNudMp: '',
    }),
  },
  searchFormValue: {},
});

const state = reactive({
  mquserateInfo: {},
  mqyieldInfo: {},
  utilizationInfo: {},
})
const goDetail = (name: string, state, rate) => {
  const { timeDimension, date, week } = props.searchFormValue as SearchFormValueType;
  const query = timeDimension === TimeDimension.DAY ? {
    startTime: date.unix() * 1000,
    endTime: date.unix() * 1000,
  } : {
    startTime: week.unix() * 1000,
    endTime: week.add(6, 'day').unix() * 1000,
  };
  go({
    path: `/dashboard/operate/oee/detail/${name}` as PageEnum,
    query: {
      ...query,
      state,
      rate,
      orgCode: props.info.OrgCode,
    },
  });
}

// 查询模切稼动率范围分布
const getUtilizationInfo = () => {
  if (!isEmpty(state.utilizationInfo)) return;
  const { timeDimension, date, week } = props.searchFormValue as SearchFormValueType;
  const query = timeDimension === TimeDimension.DAY ? {
    startTime: date.unix() * 1000,
    endTime: date.unix() * 1000,
    orgCode: props.info.OrgCode,
  } : {
    startTime: week.unix() * 1000,
    endTime: week.add(6, 'day').unix() * 1000,
    orgCode: props.info.OrgCode,
  };
  getUtilizationrateIssues(query).then(res => {
    const {
      data: { model },
    } = res;
    state.utilizationInfo = model;
  });
}

// 获取模切良率
const getMqyieldInfo = () => {
  if (!isEmpty(state.mqyieldInfo)) return;
  const { timeDimension, date, week } = props.searchFormValue as SearchFormValueType;
  const query = timeDimension === TimeDimension.DAY ? {
    startTime: date.unix() * 1000,
    endTime: date.unix() * 1000,
    orgCode: props.info.OrgCode,
  } : {
    startTime: week.unix() * 1000,
    endTime: week.add(6, 'day').unix() * 1000,
    orgCode: props.info.OrgCode,
  };
  getOeedataIssueMqyield(query).then(res => {
    const {
      data: { model },
    } = res;
    state.mqyieldInfo = model;
  });
}

// 获取性能利用率
const getMquserateInfo = () => {
  if (!isEmpty(state.mquserateInfo)) return;
  const { timeDimension, date, week } = props.searchFormValue as SearchFormValueType;
  const query = timeDimension === TimeDimension.DAY ? {
    startTime: date.unix() * 1000,
    endTime: date.unix() * 1000,
    orgCode: props.info.OrgCode,
  } : {
    startTime: week.unix() * 1000,
    endTime: week.add(6, 'day').unix() * 1000,
    orgCode: props.info.OrgCode,
  };
  getOeedataIssueMquserate(query).then(res => {
    const {
      data: { model },
    } = res;
    state.mquserateInfo = model;
  });
}

const getAllInfo = () => {
  getUtilizationInfo();
  getMqyieldInfo();
  getMquserateInfo();
}

defineExpose({
  getAllInfo,
})
</script>

<style lang="less" scoped>
.compo-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #FFF;
  // box-shadow: 0px 10px 18.2px 0px rgba(63, 63, 63, 0.10);
  overflow: hidden;

  .compo-content-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 12px;

    .compo-content-wrapper {
      height: 100%;

      .compo-foot-wrapper {
        position: relative;
        width: 100%;
        height: 100px;
        font-size: 12px;
        background-color: #f2f2f2;
        padding: 12px 16px 14px 12px;
        border-radius: 4px;
        margin-top: 6px;

        &::after {
          content: '';
          position: absolute;
          top: -12px;
          left: 12px;
          width: 0;
          height: 0;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-bottom: 16px solid #f2f2f2;
        }

        .info {
          width: 100%;
          margin-top: 8px;

          &:last-child {
            margin-top: 0;
          }
        }

        .info-title {
          width: 48px;
        }

        .progress-wrapper {
          position: relative;
          width: 50%;

          .title {
            position: absolute;
            top: -18px;
            width: 100%;
            z-index: 2;
          }
        }

        .progress-bar {
          position: relative;
          width: 100%;
          height: 4px;
          background-color: #CCC;
          overflow: hidden;
          text-align: end;

          .title {
            position: absolute;
            top: 0;
            z-index: 2;
          }

          .progress {
            height: 6px;
            background-color: #76C6FF;
            transition: width 0.5s;
            border-radius: 0 2px 2px 0;
          }

          &.reverse {
            .progress {
              /* 反向进度条样式 */
              height: 6px;
              background-color: #4B7BEC;
              transition: width 0.5s;
              right: 0;
              /* 从右侧开始 */
              position: absolute;
              /* 使用绝对定位 */
              border-radius: 2px 0 0 2px;
            }
          }
        }
      }

      .compo-head-content {
        width: 100%;

        .head-info {
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }

          &:last-child {
            margin: 0;
          }

          .value {
            color: #1a1a1a;
            font-size: 15px;

            &.error {
              color: #ff1417;
            }
          }

          .title {
            color: #666;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
