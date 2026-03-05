<!-- 无单价物料表格 -->
<template>
  <BasicTable class="table-wrapper h-[100%]" @register="registerTable"> </BasicTable>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import dayjs from 'dayjs';
  import { getNofpricedetails, exportnofpricedetails } from '/@/api/dashbord/report';

  import { BasicTable, useTable } from '/@/components/Table';
  import { useDownload } from '../../hooks/useDownload';

  const props = defineProps({
    searchFormValue: {
      type: Object,
      default: () => ({}),
    },
  });
  const date = dayjs().tz();
  const dimension = `${date.year()}WK${date.week().toString().padStart(2, '0')}`;
  // @ts-ignore 注册表格hook
  const [registerTable, { reload }] = useTable({
    api: getNofpricedetails,
    searchInfo: {
      dimension,
      orgCode: props.searchFormValue.orgCode,
    },
    columns: [{ dataIndex: 'FProduct', title: '料号', minWidth: 300 }],
    pagination: {
      size: 'small',
      showQuickJumper: false,
      pageSizeOptions: ['100', '500'],
    },
    showTableSetting: false,
    showIndexColumn: true,
    bordered: true,
    striped: true,
    immediate: true,
    isCanResizeParent: true,
    canResize: true,
    resizeHeightOffset: 0,
    fetchSetting: {
      listField: 'list',
      totalField: 'pagination.total',
    },
  });

  const { downloadFile } = useDownload({
    requestApi: exportnofpricedetails,
  });

  const exportNo = () => {
    downloadFile({ dimension, selectKey: 'FProduct', orgCode: props.searchFormValue.orgCode }, `${dimension}无单价物料.xls`);
  };

  watch(
    () => props.searchFormValue.orgCode,
    () => {
      // 重新拉取表格
      reload({
        searchInfo: {
          dimension,
          orgCode: props.searchFormValue.orgCode,
        },
      });
    },
    { deep: true, immediate: false },
  );

  defineExpose({
    exportNo,
  });
</script>
