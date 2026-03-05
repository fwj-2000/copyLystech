<template>
  <Grid>
    <template #toolbar-actions></template>
  </Grid>
</template>

<script lang="ts" setup>
  import { getMoidBillList } from '/@/api/warehouse/moIdBill';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const [Grid] = useVbenVxeGrid({
    gridOptions: {
      api: getMoidBillList,
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
      showIndexColumn: true,
    },
  });
</script>
