<!-- 在制明细 -->
<template>
  <TableLayout> </TableLayout>
  <!-- 导出 -->
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { getmakinglistdetail, makinglistexportdata } from '/@/api/dataAnalysis/financial';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dataAnalysis-financial-inventory-inProgressDetails' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-inProgressDetails-list',
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: getmakinglistdetail,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: makinglistexportdata,
          listQuery: getFormParams(),
          exportOptions: columns.value,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });

  // 关闭导出
  function exportAction(query) {
    makinglistexportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
