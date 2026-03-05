<template>
  <SubGrid></SubGrid>
</template>

<script lang="ts" setup>
  import { watch, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { subColumns } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const props = withDefaults(
    defineProps<{
      data: any[];
    }>(),
    {
      data: () => [],
    },
  );

  const emit = defineEmits(['handleReport']);

  const [SubGrid, { reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-newMaterial-check-subGrid',
      border: true,
      height: '',
      autoResize: false,
      scrollX: { enabled: false },
      columns: subColumns,
      showIndexColumn: false,
      toolbarConfig: { enabled: false },
      pagerConfig: { enabled: false },
      i18nConfig: { moduleCode: '' },
    },
  });

  watch(
    () => props.data,
    async list => {
      await nextTick();
      reloadData(list || []);
    },
    { immediate: true, deep: true },
  );
</script>

<style scoped>
  :deep(.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }
</style>
