<template>
  <subGrid>
    <template #historyDetail="{ row }">
      <span class="table-a" @click="emit('handleHistory', row)"> {{ t('common.viewDetails') }} </span>
    </template>
    <template #reportDetail="{ row }">
      <span class="table-a" @click="emit('handleReport', row)"> {{ t('common.viewDetails') }} </span>
    </template>
  </subGrid>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { subColumns } from '../config';
  import { watch, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['handleHistory', 'handleReport']);

  const props = withDefaults(
    defineProps<{
      data: any;
    }>(),
    {
      data: [],
    },
  );

  const [subGrid, { reloadData }] = useVbenVxeGrid({
    gridOptions: {
      // id: 'qualityAssurance-newMateria-check-subGrid',
      // data: filteredDocs.value,
      // height: 200,
      height: '',
      border: true,
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
      reloadData(list);
    },
    { deep: true, immediate: true },
  );
</script>

<style scoped>
  .grid-container {
    border: 15px solid #fafafa;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
  }

  :deep(.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }

  :deep(.vxe-table--row-expanded-wrapper) {
    height: auto !important;
  }

  .empty-container {
    border: 15px solid #fafafa;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    margin-left: -15px;
    overflow: hidden;
  }

  .empty-tip {
    padding: 40px 20px;
    text-align: center;
    color: #999;
    background-color: #fafafa;
  }
</style>
