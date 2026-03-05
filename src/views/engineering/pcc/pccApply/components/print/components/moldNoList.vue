<template>
  <div class="mold-no-list">
    <ValueItem v-for="item in props.list" :key="item" :value="item" class="mold-no-list-item" />
  </div>
</template>

<script lang="ts" setup>
  import ValueItem from './valueItem.vue';

  const props = defineProps({
    list: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });
</script>

<style scoped lang="less">
  .mold-no-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .mold-no-list-item {
      // width: 48%;
      margin-top: 8px;
    }
  }
</style>
