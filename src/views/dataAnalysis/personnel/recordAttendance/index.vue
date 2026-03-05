<!-- 手工数据列表 -->
<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAttenPushLog } from '/@/api/dataAnalysis/personnel';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-personnel-recordAttendance' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-personnel-recordAttendance-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { time } = getFormParams();
        const filename = `考勤推送记录_${time}`;
        return {
          filename,
        };
      },
      api: getAttenPushLog,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
