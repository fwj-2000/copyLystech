<!-- 维度分组页面 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <ToolBarAction :dataSource="dataSource" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions, dimensionTypeKeyMap } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getMaterialTransfer, getDimensionWordNoSearchparameter, postDingDingRobotNotific } from '/@/api/dataAnalysis/financial';

  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-biangong-materialTransfer' });

  const { t } = useI18n();
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-materialTransfer-list',
    filterConfig: {
      remote: true,
    },
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
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
      customFieldOptions,
      isFrontPagination: true,
      footerFiled: 'data.total',
      formatFrontData: data => {
        return data.sort((a, b) => a.sort - b.sort);
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `${t('routes.dataAnalysis-financial-biangong-materialTransfer')}_${startDim}-${endDim}`;
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
        return getMaterialTransfer(processedParams);
      },
    },
  });

  const dataSource = computed(() => {
    const { result } = api.getCacheInfo();
    const { list } = result.data ?? { list: [] };
    return list;
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange, () => state.searchFormValue.dimension],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { immediate: true, deep: true },
    );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim, dimension } = getFormParams();
    getDimensionWordNoSearchparameter({
      orgCode,
      startDim,
      endDim,
      dimension,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'workNoType');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }
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
