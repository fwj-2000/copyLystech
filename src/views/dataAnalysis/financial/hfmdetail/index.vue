<!-- 补录数据分页   -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <a-popconfirm placement="right" title="确认后将重新生成海波龙明细数据" @confirm="syncHFMData">
        <a-button :loading="syncLoading" type="primary">同步数据</a-button>
      </a-popconfirm>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getHfmdetail, syncHFMmanualData } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-hfmdetail' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data',
      },
    },
    pagerConfig: {
      enabled: false,
    },
    id: 'dataAnalysis-financial-hfmdetail-list',
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      // isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `补录明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getHfmdetail,
    },
  });

  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const syncLoading = ref(false);

  const syncHFMData = () => {
    syncLoading.value = true;
    syncHFMmanualData()
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  .biangong-table-layout {
    :deep(.vxe-header--column) {
      padding: 0 !important;

      // 合并 一级表头padding
      :deep(tr .col--group) {
        padding: 0 !important;
      }
    }
  }
</style>
