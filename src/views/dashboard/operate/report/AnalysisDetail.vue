<!-- 问题分析明细表格 -->
<template>
  <div class="content">
    <BasicTable class="table-wrapper" @register="registerTable"></BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { getProblemDetail } from '/@/api/dashbord/report';

  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { EAllProblemMetricTargetType } from './config';

  const props = withDefaults(
    defineProps<{
      searchInfo: any;
    }>(),
    {
      searchInfo: {},
    },
  );

  const ALL_COLUMNS = {
    DataSource: { title: '厂区' },
    EntDate: { title: '日期' },
    Shift: { title: '班次' },
    Machine: { title: '机台' },
    Fmanuorder: { title: '工单号' },
    Product: { title: '产品名' },
    Empno: { title: '状态' },
    Cause: { title: '问题分析' },
  };

  // 时间稼动率表
  const TIME_UTILIZATION_RATE_COLUMNS: BasicColumn[] = [
    { dataIndex: 'DataSource' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'Shift' },
    { dataIndex: 'Machine' },
    { dataIndex: 'Fmanuorder' },
    { dataIndex: 'Product' },
    { dataIndex: 'Empno' },
    { dataIndex: 'Cause' },
  ];
  // 时间稼动率表
  const ATTENDANCE_COLUMNS: BasicColumn[] = [
    { dataIndex: 'DataSource' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'Empno', title: '工号' },
    { dataIndex: 'Cause' },
  ];

  const getColumnsByDataIndex = list => {
    return list.map(item => ({
      ...(ALL_COLUMNS[item.dataIndex as string] || { title: item.dataIndex }),
      ...item,
    }));
  };

  const getSearchInfo = () => {
    const { startTime, endTime, target, orgCode } = props.searchInfo.value;
    return { startTime, endTime, target, orgCode };
  };

  const columns = computed(() => {
    const { metric } = props.searchInfo.value;
    switch (metric) {
      case EAllProblemMetricTargetType.TIME_UTILIZATION_RATE:
        return getColumnsByDataIndex(TIME_UTILIZATION_RATE_COLUMNS);
      default:
        return getColumnsByDataIndex(ATTENDANCE_COLUMNS);
    }
  });

  const [registerTable, { reload }] = useTable({
    api: getProblemDetail,
    columns,
    showIndexColumn: false,
    useSearchForm: false,
    pagination: false,
    showTableSetting: false,
    bordered: true,
    striped: true,
    canResize: true,
    resizeHeightOffset: 24,
    searchInfo: getSearchInfo(),
  });

  watch(
    () => props.searchInfo,
    () => {
      reload({
        searchInfo: getSearchInfo(),
      });
    },
    { deep: true },
  );
</script>

<style lang="less" scoped>
  .content {
    padding: 6px;
  }
</style>
