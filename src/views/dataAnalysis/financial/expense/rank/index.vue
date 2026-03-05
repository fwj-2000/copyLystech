<!-- 手工数据列表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import type { VxeGridProps } from 'vxe-table';
  import { getFaremanageAllocationrank } from '/@/api/dataAnalysis/fare';

  defineOptions({ name: 'dataAnalysis-financial-expense-rank' });

  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());
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
        const filename = `费用排名_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getFaremanageAllocationrank,
    },
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 动态显示隐藏bu/sbu维度
    watch(
      () => state.searchFormValue.orgCode,
      () => {
        const { state, setState } = api.searchFormApi;
        const isHide = state.searchFormValue.orgCode !== 'MQ';
        const keyIdx = state.formOptions.findIndex(item => item.key === 'orgLevel');
        setState(`formOptions.${keyIdx}.isHide`, isHide);
      },
      { immediate: true, deep: true },
    );
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
