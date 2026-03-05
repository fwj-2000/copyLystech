<template>
  <div class="pagination-right">
    <a-pagination
      @change="handlePagination"
      show-size-changer
      :show-total="total => `总共 ${total} 条`"
      show-less-items
      :total="total"
      :pageSize="pageSize"
      :current="current" />
  </div>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps, toRefs } from 'vue';

  const emits = defineEmits(['getTable']);
  const { pageState } = defineProps(['pageState']);

  const handlePagination = (currentPage, pageSize) => {
    const params = {
      currentPage,
      pageSize,
    };
    emits('getTable', params);
  };

  const { total, pageSize, current } = toRefs(pageState);
</script>

<style lang="less" scoped>
  .pagination-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 74px;
    align-items: center;
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    padding-right: 30px;
    background: #fff;
    box-shadow: 0px -5px 15px -3px rgba(0, 0, 0, 0.12), 0px -5px 12px -3px rgba(0, 0, 0, 0.15), 0px -2px 4px -3px rgba(0, 0, 0, 0.25);
  }
</style>
