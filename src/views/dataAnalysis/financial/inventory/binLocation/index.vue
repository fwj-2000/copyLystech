<!-- 库位报表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { getwarehouselocationpage, getverifwarehouselocation } from '/@/api/dataAnalysis/financial';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-inventory-binLocation' });

  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-binLocation-list',
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
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
        const filename = `库位维护_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getwarehouselocationpage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });

  onMounted(async () => {
    const { code, data } = await getverifwarehouselocation();
    if (code === 200 && data)
      createConfirm({
        iconType: 'warning',
        closable: true,
        footer: null,
        title: t('common.tipTitle'),
        content: '存在未维护的库位，请及时维护。',
      });
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
