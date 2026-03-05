<!-- 时间稼动率popover -->
<template>
  <div class="title flex ct-start">
    时间稼动率： {{ props.rate || '0%' }}
    <StateSvg v-if="!props.state" :value="props.rate" style="margin-left: 4px;" />
  </div>
  <div class="content">
    <div class="item flex ct-between">
      <p>低于30%</p>
      <p style="color: #f81316">{{ props.info.Lower30 || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>30-60%</p>
      <p class="value">{{ props.info.From30To60 || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>60-80%</p>
      <p class="value">{{ props.info.From60To80 || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>80%以上</p>
      <p class="value">{{ props.info.Upper80 || 0 }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StateSvg from './StateSvg.vue';

const props = defineProps({
  rate: {
    type: String,
    required: true
  },
  info: {},
  state: false,
})
</script>

<style lang="less" scoped>
.title {
  font-size: 14px;
  font-weight: 700;
}

.content {
  width: 168px;
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;

  .item {
    color: #666;
    width: 80%;
    margin-right: 12px;

    .value {
      color: #000;
    }
  }
}
</style>