<!-- 工厂明细 - 分页列表 -->
<template>
  <TableLayout />
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';
  import { ref, reactive } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';

  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorthlesspage, ExportWorthlessexportdata } from '/@/api/dataAnalysis/financial';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'dataAnalysis-financial-inventory-factoryDetail' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-factoryDetail-list',
    proxyConfig: {
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: getWorthlesspage,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        console.log(getFormParams(), columns.value, 'ggg');

        openExportModal(true, {
          api: ExportWorthlessexportdata,
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
    ExportWorthlessexportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
