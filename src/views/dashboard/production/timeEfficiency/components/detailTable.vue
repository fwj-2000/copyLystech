<template>
  <a-table
    :pagination="false"
    :scroll="{ x: 1500, y: 300 }"
    class="ant-table-striped details-table"
    :columns="columns"
    :dataSource="data"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'detail-height table-striped' : 'detail-height')">
  </a-table>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const { columns, data } = defineProps(['columns', 'data']);

</script>

<style lang="less" scoped>

[data-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background: var(---, #f3f3f3);
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
  margin-bottom: 0px;
}


.details-table {
  //margin-bottom: 20px;
  width: 100%;
}
:deep(.ant-table-thead > tr > th) {
  padding-top: 8px; /* 减少顶部内边距 */
  padding-bottom: 8px; /* 减少底部内边距 */
}
:deep(.ant-table-cell) {
  //border-color: red;
  //border-bottom: 1px solid var(---90, #E6E6E6);
  border-color: var(---90, #e6e6e6);
}

:deep(.ant-table-thead > tr > th) {
  background-color: var(---, #fff);
  border-bottom: 1px solid var(---80, #ccc);
}

:deep(.ant-table-column-sorter) {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

</style>
