<template>
<!--  <a-tab-pane key="1" tab="时间稼动率">-->
    <a-table
      :pagination="false"
      class="ant-table-striped"
      size="middle"
      :columns="columns"
      :data-source="data"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'time-efficiency-height table-striped' : 'time-efficiency-height')">
      <template #bodyCell="{ column, text, record }">
        <div v-if="column.key === 'averageRate'">
          <span class="highlight-text">{{ text }}</span>
        </div>
        <div v-else-if="column.key !== 'project'">
          <span class="highlight-text">{{ text }}</span
          ><br />
          <span class="sub-text">{{ record.detail }}</span>
        </div>
        <div v-else>
          <span class="highlight-text">{{ text }}</span
          ><br />
          <span class="sub-text">{{ record.subText }}</span>
        </div>
      </template>
    </a-table>
<!--  </a-tab-pane>-->
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

  :deep(.time-efficiency-height) {
    height: 52px;
  }
  .highlight-text {
    font-weight: bold;
  }

  .sub-text {
    color: #000;
    font-size: 12px;
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
