<!-- 模切良率popover -->
<template>
  <div class="main-title" :class="{ error: !props.baseInfo.OeeState }">OEE： {{ props.baseInfo.Oee }}</div>
  <div class="content-container flex" style="margin-bottom: 12px">
    <div class="content-item">
      <div class="title flex ct-start"
        @click="goDetail('timeUtilizationRateAbnormal', props.baseInfo.MoqiejiadonglvState, props.baseInfo.Moqiejiadonglv)">
        <p style="margin-right: 8px">时间稼动率：</p>
        <template v-if="!props.baseInfo.MoqiejiadonglvState">
          <p class="value error"> {{ props.baseInfo.Moqiejiadonglv || '0%' }}</p>
          <StateSvg style="margin-left: 2px;" />
        </template>
        <p v-else class="value"> {{ props.baseInfo.Moqiejiadonglv || '0%' }}</p>
      </div>
      <div class="content flex column ct-around item-start">
        <div class="item flex ct-between">
          <p>低于30%</p>
          <p style="color: #f81316">{{ props.info.utilizationInfo.Lower30 || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>30-60%</p>
          <p>{{ props.info.utilizationInfo.From30To60 || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>60-80%</p>
          <p>{{ props.info.utilizationInfo.From60To80 || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>80%以上</p>
          <p>{{ props.info.utilizationInfo.Upper80 || 0 }}</p>
        </div>
      </div>
    </div>
    <div class="content-item">
      <div class="title flex ct-start"
        @click="goDetail('performanceUtilizationAbnormal', props.baseInfo.XingnengliyonglvState, props.baseInfo.Xingnengliyonglv)">
        <p style="margin-right: 8px">性能利用率</p>
        <template v-if="!props.baseInfo.XingnengliyonglvState">
          <p class="value error"> {{ props.baseInfo.Xingnengliyonglv || '0%' }}</p>
          <StateSvg :value="props.baseInfo.Xingnengliyonglv" style="margin-left: 2px;" />
        </template>
        <p v-else class="value"> {{ props.baseInfo.Xingnengliyonglv || '0%' }}</p>
      </div>
      <div class="content flex column ct-around item-start">
        <div class="item flex ct-between">
          <p>在线产品款式</p>
          <p style="font-weight: 500">{{ props.info.mquserateInfo.ProductNum || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>PCC维护异常</p>
          <p style="font-weight: 500">{{ props.info.mquserateInfo.PCCAbnormalNum || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>机台采集异常</p>
          <p style="font-weight: 500">{{ props.info.mquserateInfo.CollectionAbnormalNum || 0 }}</p>
        </div>
      </div>
    </div>
    <div class="content-item">
      <div class="title flex ct-start"
        @click="goDetail('dieCuttingYieldAbnormal', props.baseInfo.MoqielianglvState, props.baseInfo.Moqielianglv)">
        <p style="margin-right: 8px">模切良率</p>
        <template v-if="!props.baseInfo.MoqielianglvState">
          <p class="value error"> {{ props.baseInfo.Moqielianglv || '0%' }}</p>
          <StateSvg :value="props.baseInfo.Moqielianglv" style="margin-left: 2px;" />
        </template>
        <p v-else class="value"> {{ props.baseInfo.Moqielianglv || '0%' }}</p>
      </div>
      <div class="content flex column ct-around item-start">
        <div class="item flex ct-between">
          <p>总模切计划数</p>
          <p style="font-weight: 500">{{ props.info.mqyieldInfo.PlanNum || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>未维护米数</p>
          <p style="font-weight: 500">{{ props.info.mqyieldInfo.MeterAbnormalNum || 0 }}</p>
        </div>
        <div class="item flex ct-between">
          <p>未模切报数</p>
          <p style="font-weight: 500">{{ props.info.mqyieldInfo.QtyAbnormalNum || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StateSvg from './StateSvg.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['goDetail']);
const props = defineProps({
  baseInfo: {},
  info: {},
})

const goDetail = (name, state, value) => {
  emit('goDetail', name, state, value);
}
</script>

<style lang="less" scoped>
.main-title {
  font-size: 14px;
  font-weight: 700;

  &.error {
    color: #ff1417;
  }
}

.content-item {
  width: 188px;
  height: 129px;
  background-color: #f6f6f6;
  padding: 12px 24px 12px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }

  .content {
    height: calc(100% - 24px);
  }

  .title {
    color: #1A1A1A;
    position: relative;
    font-size: 14px;
    margin-bottom: 6px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }


    .value {
      font-weight: 700;

      &.error {
        color: #E12929;
      }
    }
  }

  .item {
    width: 114px;
    margin-right: 12px;
  }
}
</style>