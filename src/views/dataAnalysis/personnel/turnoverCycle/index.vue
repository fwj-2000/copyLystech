<!-- 离职周期分析 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns } from './config';
  import { commonOptions } from '/@/views/dataAnalysis/personnel/config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getresignationcycle, exportResignationCycle } from '/@/api/dataAnalysis/personnel';

  import type { VxeGridProps } from 'vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dataAnalysis-personnel-turnoverCycle' });

  const attrs = reactive<VxeGridProps<any>>({
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
        const filename = `离职周期分析_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getresignationcycle,
    },
    toolbarConfig: {
      baseExportMethod: handleExport,
    },
  });

  function handleExport() {
    const { getFormParams } = api.searchFormApi;
    exportResignationCycle(getFormParams()).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  }
</script>

<style lang="less">
  @import url('/@/views/dataAnalysis/style.less');
</style>
