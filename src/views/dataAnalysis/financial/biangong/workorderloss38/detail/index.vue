<!-- 3.8工单损耗分析_页面 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-biangong-loss38Detail' });
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { workorderlossanaly38Detail, workorderlossanaly38export } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  // import { downloadByUrl } from '/@/utils/file/download';
  import { pick } from 'lodash-es';

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-workorderloss38-detail-list',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
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
      api: async params => {
        const res = await workorderlossanaly38Detail({ ...params });
        columns.value = res.data.flag ? getAllColumns().filter(item => item.field !== 'price') : getAllColumns();
        return res;
      },
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          listQuery: { ...pick(getFormParams(), ['dimension', 'orgCode', 'startDim', 'endDim']) },
          exportOptions: columns.value,
          api: workorderlossanaly38export,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });
  // function exportAction(query) {
  //   workorderlossanaly38export(query).then(res => {
  //     if (!res.data.url) return;
  //     downloadByUrl({ url: res.data.url });
  //     closeModal();
  //   });
  // }
</script>
<style lang="less" scoped>
  //  公共表头padding
  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
