<!-- 指标中心 >>> 数值图例展示 -->
<template>
  <div class="compo-wrapper flex row all-start">
    <div v-for="(item, idx) in props.list" :key="idx" class="item">
      <p class="label">{{ item.label }}</p>
      <p v-if="!valueClickable" class="value">{{ item.value || 0 }}</p>
      <p v-else class="value text-hover" @click="props.valueClickMth(item?.params || {})">{{ item.value || 0 }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { valueListProps } from './props';
const props = defineProps(valueListProps)
</script>

<style lang="less" scoped>
.compo-wrapper {
  width: 100%;
  height: 100%;

  .item {
    margin-right: 24px;

    &:last-child {
      margin: 0;
    }

    .label {
      color: #666;
      font-size: 14px;
    }

    .value {
      text-align: left;
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      color: #1a1a1a;
    }
  }
}
</style>