<template>
  <Subtitle :title="t('common.batchImport')" class="mt-8px" />
  <div style="height: calc(100% - 50px)">
    <VxeBasicTable ref="tableRef" v-bind="gridOptions" :loading="props.loading" :tableStyle="{ width: '100%' }" class="!p-0 pb-4">
      <template #action="{ rowIndex }">
        <span class="cursor-pointer" style="color: #344481" @click="() => confirmToDelete(rowIndex)">
          {{ t('common.delText') }}
        </span>
      </template>
    </VxeBasicTable>
  </div>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';
  import type { PropType } from 'vue';

  import { reactive, ref, watch, nextTick } from 'vue';
  import { importColumns } from './config';
  import { getDynamicsTableColumn } from '/@/views/business/salesForecast/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';

  const props = defineProps({
    list: {
      type: Array as PropType<Array<{ importDatas: { [name: string]: string | number } }>>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['update:list']);
  const tableRef = ref<VxeGridInstance>();
  const { createConfirm } = useMessage();
  const { t } = useI18n();

  const gridOptions = reactive<BasicTableProps>({
    mouseConfig: {
      area: false, // 是否开启区域选取
      extension: false,
    },
    columns: [],
    columnConfig: {
      resizable: true,
    },
    height: 'auto',
    toolbarConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: false,
    },
    scrollY: {
      enabled: true,
      mode: 'wheel',
      gt: 0,
    },
    scrollX: {
      enabled: true,
      gt: 0,
    },
  });

  /**
   * @description 删除上传数据
   * @param index 数据索引
   */
  function confirmToDelete(index: number) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () =>
        emits(
          'update:list',
          props.list.filter((_, i) => i !== index),
        ),
    });
  }

  watch(
    () => props.list,
    () => {
      const columnList = [...importColumns];
      if (Array.isArray(props.list) && props.list.length) {
        columnList.push(...getDynamicsTableColumn(props.list, false));
      }
      nextTick(() => {
        tableRef.value?.reloadColumn(columnList);
        tableRef.value?.reloadData(props.list);
      });
    },
    { immediate: true, deep: true },
  );
</script>
