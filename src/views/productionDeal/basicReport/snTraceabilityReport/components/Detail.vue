<template>
  <GridChild>
    <template #status="{ row }">
      <LydcTag v-if="row.status == '1'" theme="green" text="PASS"></LydcTag>
      <LydcTag v-if="row.status == '2'" theme="red" text="FAIL"></LydcTag>
    </template>
  </GridChild>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { detailColumn } from '../config';
  const props = defineProps({
    data: {
      type: Object,
      default: {},
    },
  });
  const [GridChild] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-snTraceabilityReport-list-child',
      columns: detailColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      height: 300,
      pagerConfig: {
        enabled: false,
      },
      data: props.data as any,
    },
  });
</script>
