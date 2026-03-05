<template>
  <div class="cus-rows">
    <div v-for="(item, index) in (props.list as any)" :key="index" class="p-6px mr-20px" style="display: inline-block">
      <span class="label" v-if="item.label">{{ item.label }}: </span>
      <span class="value ml-4px" v-if="item.value">{{ item.value }}</span>
      <span class="value ml-4px" v-else>-</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style lang="less" scoped>
  .cus-rows {
    .label {
      color: #666;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .value {
      color: #1a1a1a;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
  }
</style>
