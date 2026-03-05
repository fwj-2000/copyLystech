<!-- 手工数据列表 -->
<template>
  <TableLayout>
    <template #toolbarRight>
      <a-popconfirm v-if="showUpdateSap" title="确认同步数据？" @confirm="handleSync019nl">
        <a-button>同步数据</a-button>
      </a-popconfirm>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getProfitZfi019nl, postSync019nl } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-profit-zfi019nl' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-zfi019nl-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `zfi019nl_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getProfitZfi019nl,
    },
  });
  const showUpdateSap = computed(() => {
    const { getFormParams } = api.searchFormApi;
    const { orgCode = '' } = getFormParams();
    return orgCode.length >= 9;
  });
  const handleSync019nl = async () => {
    const { getFormParams } = api.searchFormApi;
    const { orgCode } = getFormParams();
    await postSync019nl(orgCode);
  };
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .amount-header {
      background-color: #fcf5ed;
    }

    .quantity-header {
      background-color: #d4e0fb;
    }
  }
</style>
