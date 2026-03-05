<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, onActivated } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getManualdetailbyfactort } from '/@/api/dataAnalysis/financial';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'dataAnalysis-financial-profit-weeklyDetail-detail' });

  const columns = ref(getAllColumns());
  const router = useRouter();
  const { setTitle } = useTabs(router);
  const { getParams } = useRouteParams();
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-weeklyDetail-detail-list',
  });
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startTime, endTime } = getFormParams();
        const filename = `${getParams().metric}明細${startTime}-${endTime}`;
        return {
          filename,
        };
      },
      api: getManualdetailbyfactort,
    },
  });
  onActivated(() => {
    const params = getParams();
    if (params.metric) {
      setTitle(params.metric);
    }
  });
</script>

<style lang="less" scoped></style>
