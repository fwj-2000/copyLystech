<template>
  <div class="right-table">
    <div class="left-title">生产时间统计(H)</div>
    <div @click="handleRouter" class="right-btn">停机原因分析</div>
  </div>
  <a-table
    :pagination="false"
    class="ant-table-striped"
    size="middle"
    :columns="columns"
    :data-source="data"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-height table-striped' : 'table-height')" />

</template>

<script lang="ts" setup>
import { defineProps } from "vue"
import { useRouter } from "vue-router"

const { columns, data } = defineProps(['columns', 'data']);

const router = useRouter();
const handleRouter = () => {
  router.push('/dashboard/production/downtimeAnalysis');
};
</script>

<style lang="less" scoped>

[data-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background: var(---, #f3f3f3);
}

:deep(.table-height) {
  height: 62px;
}

.right-table {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  .left-title {
    color: var(---, #000);
    font-family: 'Noto Sans SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.28px;
    flex-shrink: 0;
    opacity: 0.85;
  }

  .right-btn {
    display: inline-flex;
    height: 30.158px;
    padding: 9px 24px;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px solid var(---, #d9d9d9);

    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease-in-out;
    }
  }
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
