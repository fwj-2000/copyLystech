<!-- 绩效排名单个指标项组件 -->
<template>
  <div class="rank-item-compo-container">
    <!-- 指标项名称 -->
    <div class="rank-header mb-8px">
      <p>{{ props.name }}</p>
    </div>
    <!-- 报表表格 -->
    <BasicTable class="table-wrapper" @register="registerTable"> </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';

  const props = defineProps({
    name: { type: String, required: true },
    columns: {
      type: Array as PropType<BasicColumn[]>,
      required: true,
    },
    // 表格数据
    dataSource: {
      type: Array as PropType<Recordable<any>[]>,
      required: true,
    },
  });

  // 注册表格hook
  const [registerTable] = useTable({
    columns: props.columns,
    dataSource: props.dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    canResize: false,
    bordered: true,
    striped: true,
    inset: true,
  });
</script>

<style lang="less" scoped>
  .rank-item-compo-container {
    padding: 0 24px;
    margin: 8px 0;
    width: 100%;
    height: 100%;

    :deep(.ant-table-thead > tr) {
      & > th {
        font-weight: 700;
        white-space: pre-wrap;

        /* 允许换行 */
        word-break: break-word;

        /* 自动断词 */
        text-align: left;
        // border-color: @borderColor !important;
      }
    }

    .rank-header {
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 700;
    }

    .process-wrapper {
      width: 30vw;
      background-color: #ddd;
      border-radius: 10px;

      .process {
        max-width: 100%;
        height: 8px;
        border-radius: 10px;
        background: linear-gradient(90deg, #d2e0ff -20%, #4b7bec 80%);
        background-size: 200% 100%;
      }
    }
  }
</style>
