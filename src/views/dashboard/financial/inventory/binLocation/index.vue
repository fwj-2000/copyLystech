<!-- 库位报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="reloadData">查询</a-button>
            <SingleUpload v-bind="uploadConfig">
              <a-popover placement="bottom">
                <template #content>
                  <a-button type="primary" :loading="downLoading" @click="downloadTemplateFile">模版下载</a-button>
                  <a-button class="ml-2" type="primary" :loading="exportLoading" @click="downloadFile">未维护数据导出</a-button>
                </template>
                <template v-slot="loading">
                  <a-button type="primary" :loading="loading">导入</a-button>
                </template>
              </a-popover>
            </SingleUpload>
          </template>
        </SearchForm>
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden vxe-table">
          <BaseVxeTable @register="registerTable" />
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import {} from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';
  import { getAllColumns, allFormOptions } from './config';
  import { exportnomaintenance, getwarehouselocationpage, exportwarehouselocationtemplate } from '/@/api/dataAnalysis/financial';

  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dashboard-inventory-binLocation' });

  const uploadConfig = {
    api: '/api/report/inventory/importwarehouselocation',
    buttonText: '导入',
  };
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const { loading: exportLoading, downloadFile } = useDownload({
    requestApi: exportnomaintenance,
  });
  const { loading: downLoading, downloadFile: downloadTemplateFile } = useDownload({
    requestApi: exportwarehouselocationtemplate,
  });
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: allFormOptions,
  });
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    api: getwarehouselocationpage,
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
/@/api/dataAnalysis/financial
