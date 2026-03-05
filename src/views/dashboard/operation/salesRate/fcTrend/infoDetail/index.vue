<!-- 三阶明细页 -->
<template>
  <div ref="tableRef" class="p-8px">
    <BasicTable @register="registerTable"></BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getFcdetailbyitem } from '/@/api/dashbord/report';
  import { useBaseTable } from '/@/views/dashboard/hooks/useBaseTable';

  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { EColumnsType, IColumnOptions } from '/@/views/dashboard/types';

  const tableRef = ref<Nullable<HTMLElement>>(null);
  const dataSource = ref<any[]>([]);

  const props = withDefaults(
    defineProps<{
      queryInfo: any;
    }>(),
    {
      queryInfo: {},
    },
  );

  const columns = ref<BasicColumn[]>([]);

  // 所有字段
  const allColumns: IColumnOptions[] = [
    { dataIndex: 'prodline', title: '产品线', width: 80, isRowSpan: true, hideBG: true },
    { dataIndex: 'item', title: '项目', width: 80, isRowSpan: true, hideBG: true },
    // { dataIndex: 'fproduct', title: '料件', width: 150, isRowSpan: true, hideBG: true },
    { dataIndex: 'version', title: '版本号', width: 100 },
    { dataIndex: 'total', title: 'Total', width: 80 },
    { dataIndex: 'vlist', width: 80, type: EColumnsType.DATE_VALUE_LIST },
  ];

  const getSearchInfo = () => {
    return props.queryInfo;
  };
  const { getColumns } = useBaseTable({
    tableRef,
    colorGroupProps: 'version',
    columnsOptions: allColumns,
  });

  // 接口返回数据处理
  const afterFetchMth = data => {
    const dataList = data.map(item => {
      return {
        ...item,
        ...((item.vlist &&
          item.vlist.reduce(
            (pre, cur) => ({
              ...pre,
              [cur.dateS]: cur.valueS,
            }),
            {},
          )) ||
          {}),
      };
    });
    dataSource.value = dataList;
    columns.value = getColumns(data);
  };

  const [registerTable] = useTable({
    dataSource,
    columns,
    showIndexColumn: false,
    useSearchForm: false,
    pagination: false,
    showTableSetting: false,
    bordered: true,
    striped: true,
    canResize: false,
  });

  watch(
    () => props.queryInfo,
    () => {
      getFcdetailbyitem(getSearchInfo()).then(res => {
        const {
          data: { list = [] },
        } = res;
        afterFetchMth(list);
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
