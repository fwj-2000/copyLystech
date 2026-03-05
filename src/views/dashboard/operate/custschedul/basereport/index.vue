<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, onMounted, computed, toRaw } from 'vue';

  import { formOptions, getAllColumns, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getBaseReport, getBaseReportParam } from '/@/api/dashbord/operate';
  import { isEmpty } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-custschedul-basereport' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-operate-custschedul-basereport-list',
  });
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
        const filename = `客户排产_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getBaseReport,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange],
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
    const { orgCode, startDim, endDim } = getFormParams();
    getBaseReportParam({
      orgCode,
      startDim,
      endDim,
    }).then(({ data }) => {
      const fieldsToUpdate = Object.keys(data);

      // 定义一个通用函数来更新 formOptions 的 options
      const updateFormOptions = (key: string, dataKey: string) => {
        const keyIdx = formOptions.findIndex(item => item.key === key);
        if (keyIdx !== -1 && state.formOptions[keyIdx]) {
          const options = (data[dataKey] || []).map(item => ({
            text: item,
            value: item,
          }));
          setState(`formOptions.${keyIdx}.options`, options);
        }
      };

      fieldsToUpdate.forEach(field => {
        updateFormOptions(field, field);
      });
    });
  }
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
