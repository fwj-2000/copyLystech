<!-- 三阶明细页 -->
<template>
  <div class="p-8px">
    <div ref="tableRef" style="width: calc(60vw - 16px)">
      <BasicTable :loading="loading" @register="registerTable" class="width: 100%"></BasicTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getDimension } from '/@/api/dashbord/report';
  import { useBaseTable } from '/@/views/dashboard/hooks/useBaseTable';

  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { columnsOptions } from './config';

  const tableRef = ref<Nullable<HTMLElement>>(null);
  const dataSource = ref<any[]>([]);
  const loading = ref<boolean>(false);

  const props = withDefaults(
    defineProps<{
      queryInfo: any;
    }>(),
    {
      queryInfo: {},
    },
  );

  const columns = ref<BasicColumn[]>([]);

  const getSearchInfo = () => {
    return props.queryInfo;
  };

  // 计算合并信息
  const { getColumns } = useBaseTable({
    tableRef,
    columnsOptions,
    colorGroupProps: 'category',
  });

  // 注册表格hook
  const [registerTable] = useTable({
    dataSource,
    columns,
    pagination: false,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: true,
    bordered: true,
    striped: true,
    resizeHeightOffset: 24,
  });

  watch(
    () => props.queryInfo,
    () => {
      loading.value = true;
      dataSource.value = [];
      columns.value = [];
      getDimension(getSearchInfo()).then(res => {
        const { data: list } = res;
        const dataList = list.map(item => {
          return {
            ...item,
            ...((item.dimesionType &&
              item.dimesionType.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              )) ||
              {}),
            ...((item.vList &&
              item.vList.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              )) ||
              {}),
          };
        });
        columns.value = getColumns(dataList);
        dataSource.value = dataList;
        loading.value = false;
      });
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .content {
    padding: 6px;
  }
</style>
