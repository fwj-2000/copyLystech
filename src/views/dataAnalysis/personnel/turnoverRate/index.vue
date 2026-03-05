<!-- 离职率分析 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns } from './config';
  import { commonOptions } from '/@/views/dataAnalysis/personnel/config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getresignationrate, exportResignationRate } from '/@/api/dataAnalysis/personnel';

  import type { VxeGridProps } from 'vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dataAnalysis-personnel-turnoverRate' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-personnel-turnoverRate-list',
    proxyConfig: {
      response: {
        list: 'data',
      },
    },
    rowStyle: ({ row }) => {
      if (row.SourecType === '1') {
        return { background: '#ff7b001A' };
      }
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions: commonOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `离职率分析_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getresignationrate,
    },
    toolbarConfig: {
      baseExportMethod: handleExport,
    },
  });

  async function handleExport() {
    const { getFormParams } = api.searchFormApi;
    await exportResignationRate(getFormParams()).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  }
</script>

<style lang="less">
  @import url('/@/views/dataAnalysis/style.less');
</style>
