<!-- By产品线页面 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction @openModal="openModal" :dataSource="dataSource" :formParams="formParams" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { ref, reactive, watch, onMounted, computed, unref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimByProjectline, searchparameterCpx } from '/@/api/dataAnalysis/financial';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import type { VxeGridProps } from 'vxe-table';
  import ToolBarAction from './ToolBarAction.vue';

  defineOptions({ name: 'dataAnalysis-financial-biangong-byprojectline' });

  const dataSource = ref(); //数组·对象
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameFuncByGroupKey('dimStr'),
    id: 'dataAnalysis-financial-biangong-byprojectline-list',
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
        const filename = `By产品线${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getDimByProjectline,
    },
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
    searchparameterCpx({
      dimension,
      orgCode,
      startDim,
      endDim,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'productLine');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }
  const formParams = computed(() => {
    const { startDim, endDim, showType } = api.searchFormApi.getFormParams();
    return { startDim, endDim, showType: showType === '0' ? '同比' : '环比' };
  });
  const openModal = () => {
    const res = api.getGridInstance().getTableData();
    dataSource.value = unref(res.fullData);
  };
</script>
