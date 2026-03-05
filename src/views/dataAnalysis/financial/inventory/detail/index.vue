<!-- 库存明细 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <a-button v-if="!isIncludeBad" type="primary" :loading="tempLoading" @click="exportDataOther">月库存导出</a-button>
    </template>
  </TableLayout>
  <!-- 导出 -->
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { has } from 'lodash-es';
  import { reactive, ref } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useModal } from '/@/components/Modal';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { getinventorylistdetail, inventoryListexportdata, inventoryListExportDataOther } from '/@/api/dataAnalysis/financial';
  import { useDownload } from '/@/views/dataAnalysis/hooks/useDownload';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

  defineOptions({ name: 'dataAnalysis-financial-inventory-detail' });
  const { getParams } = useRouteParams();
  const isIncludeBad = ref<Boolean>(has(getParams(), 'isBad')); //是否有isBad属性 只有不良汇总页面跳本页面过来 才加上isBad参数

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-detail-list',
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
      api: params => {
        const { isBad } = getParams();
        return getinventorylistdetail({ ...params, isBad });
      },
      getQueryExtraParams: () => {
        const { sobkz } = getParams();
        console.log('🚀 ~ params:', sobkz);
        return { sobkz };
      },
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { isBad } = getParams();
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: inventoryListexportdata,
          listQuery: { ...getFormParams(), isBad },
          exportOptions: columns.value.slice(1),
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });

  const { downloadFile: downloadTableDataFile, loading: tempLoading } = useDownload({
    requestApi: inventoryListExportDataOther,
  });
  const exportDataOther = async () => {
    const { getFormParams } = api.searchFormApi;
    const query = getFormParams();
    await downloadTableDataFile(query);
  };
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
