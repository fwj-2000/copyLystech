<!-- 费用明细 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { keys, values, zipObject } from 'lodash-es';
  import { useRouter } from 'vue-router';
  import { onActivated, onMounted, reactive, ref, watch } from 'vue';
  import { getAllColumns, formOptions, dimensionTypeKeyMap } from './config';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { getfeeattrdetailv2 } from '/@/api/dataAnalysis/fare';

  import type { VxeGridProps } from 'vxe-table';
  import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import ToolBarAction from './ToolBarAction.vue';

  defineOptions({ name: 'dataAnalysis-financial-expense-detail' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        list: 'data.List',
      },
    },
    filterConfig: {
      remote: true,
    },
  });
  const columns = ref(getAllColumns());
  const filterOptions = ref<TFormItemOption[]>([]);
  const router = useRouter();
  const { setTitle } = useTabs(router);
  const { getParams } = useRouteParams();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      footerFiled: 'data.Total',
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `费用明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: async params => {
        const reversedDimTypeKeyMap = zipObject(values(dimensionTypeKeyMap), keys(dimensionTypeKeyMap));
        const processedParams = { ...params };

        Object.keys(processedParams).forEach(key => {
          if (key.startsWith('DimesionType_')) {
            const newKey = key.replace('DimesionType_', '');
            processedParams[reversedDimTypeKeyMap[newKey]] = processedParams[key];
            delete processedParams[key];
          }
        });
        return await getfeeattrdetailv2(processedParams);
      },
    },
  });

  // 重新激活页面
  onActivated(() => {
    const params = getParams();
    if (params.title) {
      setTitle(params.title);
    }
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    watch(
      [() => state.formOptions],
      () => {
        const { formOptions = [] } = api.searchFormApi.state;
        const params = getParams();
        const dimensionOptions = (formOptions.find(item => item.key === 'dimensionType') as any)?.options || [];
        filterOptions.value = dimensionOptions.map(({ text: label, value: dimensionType }) => {
          return {
            label,
            type: EFormItemType.INPUT,
            default: params[dimensionType] ?? '',
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
  @import url('/@/views/dataAnalysis/style.less');
</style>
