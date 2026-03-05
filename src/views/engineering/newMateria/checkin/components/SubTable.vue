<template>
  <SubGrid>
    <template #reportDetail="{ row }">
      <span class="table-a" @click="emit('handleReport', row)">{{ t('common.viewDetails') }}</span>
    </template>
    <template #iqcTestReportId="{ row }">
      <span class="table-a" @click="emit('handleHistory', row)"> {{ t('common.viewDetails') }} </span>
    </template>
  </SubGrid>
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

  const emit = defineEmits(['handleReport', 'handleHistory']);

  const [SubGrid, { reloadData }] = useVbenVxeGrid({
    gridOptions: {
      // id: 'engineering-newMateria-checkin-subGrid',
      border: true,
      height: '',
      autoResize: false,
      scrollX: { enabled: false },
      columns: subColumns(),
      showIndexColumn: false,
      toolbarConfig: { enabled: false },
      pagerConfig: { enabled: false },
      i18nConfig: { moduleCode: 'MaterialDevelopApplyColumn' },
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
