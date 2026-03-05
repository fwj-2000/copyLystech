<!-- 模切良率popover -->
<template>
  <div class="title flex ct-start">模切良率： {{ props.rate || '0%' }}
    <StateSvg v-if="!props.state" :value="props.rate" style="margin-left: 4px;" />
  </div>
  <div class="content">
    <div class="item flex ct-between">
      <p>总模切计划数</p>
      <p class="value" style="font-weight: 500">{{ props.info.PlanNum || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>未维护米数</p>
      <p class="value" style="font-weight: 500">{{ props.info.MeterAbnormalNum || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>未模切报数</p>
      <p class="value" style="font-weight: 500">{{ props.info.QtyAbnormalNum || 0 }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StateSvg from './StateSvg.vue';

const props: any = defineProps({
  rate: {
    type: String,
    required: true
  },
  state: false,
  info: {},
})
</script>

<style lang="less" scoped>
.title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.content {
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;

  .item {
    color: #666;
    width: 100%;
    margin-right: 12px;

    .value {
      color: #000;
    }
  }
}
</style>