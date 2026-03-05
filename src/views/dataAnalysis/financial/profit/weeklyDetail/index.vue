<!-- 周损益 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction />
      <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" class="mr-8px" @click="handleJump(item)">
        {{ item.title }}
      </a-button>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions, jumpButtonOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { getProfitWeekListV2detail } from '/@/api/dataAnalysis/financial';
  import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';
  import ToolBarAction from './ToolBarAction.vue';
  import dayjs, { Dayjs } from 'dayjs';

  defineOptions({ name: 'dataAnalysis-financial-profit-weeklyDetail' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-weeklyDetail-grid',
    rowClassName: ({ row }) => {
      const { sort } = row;
      return `${sort}`.includes('.') ? 'bg-white' : 'bg-yellow';
    },
  });

  const { goPath } = useRouteParams();
  const columns = ref(getAllColumns());

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      customFieldOptions,
      isFrontPagination: true,
      beforeQuery: () => {
        const { state } = api.searchFormApi;
        columns.value = getAllColumns(state.searchFormValue.week);
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { week } = getFormParams();
        const filename = `周损益${week}`;
        return {
          filename,
        };
      },
      api: getProfitWeekListV2detail,
    },
  });
  const searchFormValue = computed(() => {
    const { searchFormValue } = api.searchFormApi.state;
    return searchFormValue;
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
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .text-red {
      color: red;
    }
  }
</style>
