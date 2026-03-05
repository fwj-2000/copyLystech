<!-- 3.8工单损耗分析_页面 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-biangong-workorderloss38' });
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, dimensionTypeKeyMap } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorkOrderLossAnalysis38 } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-workorderloss38-list',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
      },
    },
  });
  const filterOptions = ref<TFormItemOption[]>([]);
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      footerFiled: 'data.total',
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `3.8工单损耗_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: params => {
        const processedParams = { ...params };
        Object.keys(processedParams).forEach(key => {
          if (key.startsWith('dimesionType_')) {
            const newKey = key.replace('dimesionType_', '');
            processedParams[dimensionTypeKeyMap[newKey]] = processedParams[key];
            delete processedParams[key];
          }
        });
        return getWorkOrderLossAnalysis38(processedParams);
      },
    },
  });
  onMounted(() => {
    const { state } = api.searchFormApi;
    watch(
      [() => state.formOptions],
      () => {
        const { formOptions = [] } = api.searchFormApi.state;
        // const params = getParams();
        const dimensionOptions = (formOptions.find(item => item.key === 'dimensionType') as any)?.options || [];
        filterOptions.value = dimensionOptions
          .filter(item => item.value !== 'auaZh')
          .map(({ text: label, value: dimensionType }) => {
            return {
              label,
              type: EFormItemType.INPUT,
              default: '',
              key: dimensionType,
            };
          });
      },
      {
        deep: true,
        immediate: true,
      },
    );
  });
</script>
<style lang="less" scoped>
  //  公共表头padding
  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
