<!-- 模切KPI页面 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" class="mr-8px" @click="handleJump(item)">
        {{ item.title }}
      </a-button>
    </template>
    <template #toolbarRight>
      <span> 取数时间：{{ searchFormValue.dimension === 'week' ? '每周三' : '每月12号' }}</span>
      <a-popover placement="right">
        <template #content>
          <p>数据来源：海波龙系统</p>
        </template>
        <img :src="vectorSvg" width="18px" class="mx-8px" />
      </a-popover>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { getAllColumns, formOptions, jumpButtonOptions } from './config';
  import { getDiecutkpiList } from '/@/api/dataAnalysis/financial';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import type { VxeGridProps } from 'vxe-table';
  import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';

  defineOptions({ name: 'dataAnalysis-financial-mqkpi' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({});
  const { goPath } = useRouteParams();
  const currentTimeDimension = ref(ETimeDimension.WEEK);

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
        const filename = `模切KPI_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      beforeQuery: formParams => {
        if (currentTimeDimension.value !== formParams.dimension) {
          currentTimeDimension.value = formParams.dimension;
          columns.value = getAllColumns(formParams);
        }
      },
      api: getDiecutkpiList,
    },
  });

  const searchFormValue = computed(() => {
    const { state } = api.searchFormApi;
    return state.searchFormValue;
  });
  const formParams = computed(() => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams();
  });

  // 跳转
  const handleJump = (item: IJumpButtonOption) => {
    const { getPathUrl, getPathParams } = item;
    const path = getPathUrl(formParams.value, searchFormValue.value);
    const params = getPathParams?.(formParams.value, searchFormValue.value) ?? {};
    goPath(path, params);
  };
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
