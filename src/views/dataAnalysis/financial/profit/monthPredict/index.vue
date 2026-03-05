<template>
  <TableLayout>
    <template #toolbarRight>
      <PopConfirmBtnGroup :actions="actionConfig" :params="commonParams" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-profit-monthPredict' });
  import { ref, reactive, computed } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getMonthpredict, unlockPredictStatu } from '/@/api/dataAnalysis/financial';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import PopConfirmBtnGroup from '/@/views/dataAnalysis/bizComponents/PopConfirmBtnGroup/index.vue';
  import { type ActionItem } from '/@/views/dataAnalysis/bizComponents/PopConfirmBtnGroup/types';

  import { getAllColumns, formOptions, batchMenuItems } from './config';

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-monthPredict-list',
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
        const { startDim, endDim } = getFormParams();
        const filename = `月预测手工_${startDim}-${endDim}`;
        return {
          filename,
        };
      },

      api: getMonthpredict,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
  const commonParams = computed(() => {
    const searchFormValue = api.searchFormApi.getFormParams();
    return searchFormValue;
  });
  const actionConfig = computed<ActionItem[]>(() => {
    return [
      {
        key: 'unlock_import',
        label: '解锁导入',
        auth: 'btn_unlock',
        popconfirm: {
          title: `确定解锁导入？`,
        },
        api: unlockPredictStatu,
      },
    ];
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
