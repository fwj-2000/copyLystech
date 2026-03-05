<template>
  <div>
    <div class="table-title">停机原因明细</div>
    <a-table
      :pagination="false"
      class="ant-table-striped details-table"
      :columns="columns"
      :dataSource="data"
      rowKey="key"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'detail-height table-striped' : 'detail-height')" />
  </div>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue';

  const { columns, data } = defineProps(['columns', 'data']);
</script>

<style lang="less" scoped>
  .table-title {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px; /* 100% */
    letter-spacing: 0.56px;
    opacity: 0.85;
    margin-bottom: 14px;
    margin-top: 10px;
  }

  [data-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }

  [data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background: #f3f3f3;
  }

  :deep(.detail-height > td) {
    height: 42px;
    box-sizing: border-box;
    padding: 5px 16px;
  }

  .detail-height {
    height: 42px;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
  }

  .details-table {
    margin-bottom: 20px;
  }

  :deep(.ant-table-cell) {
    border-color: #e6e6e6;
  }

  :deep(.ant-table-thead > tr > th) {
    padding-top: 8px; /* 减少顶部内边距 */
    padding-bottom: 8px; /* 减少底部内边距 */
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }

  :deep(.ant-table-column-sorter) {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
</style>
