<!-- 性能利用率popover -->
<template>
  <div class="title flex ct-start">性能利用率： {{ props.rate || '0%' }}
    <StateSvg v-if="!props.state" :value="props.rate" style="margin-left: 4px;" />
  </div>
  <div class="content">
    <div class="item flex ct-between">
      <p>在线产品款式</p>
      <p class="value" style="font-weight: 500">{{ props.info.ProductNum || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>PCC维护异常</p>
      <p class="value" style="font-weight: 500">{{ props.info.PCCAbnormalNum || 0 }}</p>
    </div>
    <div class="item flex ct-between">
      <p>机台采集异常</p>
      <p class="value" style="font-weight: 500">{{ props.info.CollectionAbnormalNum || 0 }}</p>
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