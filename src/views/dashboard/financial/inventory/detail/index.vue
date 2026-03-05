<!-- 库位报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="reloadData">查询</a-button>
            <a-button type="primary" ghost @click="handleExport">导出</a-button>
          </template>
        </SearchForm>
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden vxe-table">
          <BaseVxeTable @register="registerTable" />
        </div>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import {} from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { useModal } from '/@/components/Modal';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { getinventorylistdetail, inventoryListexportdata } from '/@/api/dataAnalysis/financial';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-financial-inventory-detail' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [register, { searchFormValue, searchLoading, api }] = useSearchForm({
    formOptions: formOptions,
    filterOptions: filterOptions,
  });
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    api: getinventorylistdetail,
    getParams: api.getFormParams,
  });

  const handleExport = () => {
    openExportModal(true, {
      listQuery: api.getFormParams(),
      exportOptions: columns.value.slice(1),
      nameProps: 'title',
      idProps: 'field',
    });
  };
  function exportAction(query) {
    inventoryListexportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
/@/api/dataAnalysis/financial
