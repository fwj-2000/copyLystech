<!-- 损益报表 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarRight>
      <div class="flex">
        <ToolBarAction :searchFormValue="searchFormValue" />
        <a-space>取数时间：{{ searchFormValue.timeDimension === 'week' ? '每周三' : '每月12号' }}</a-space>
        <a-popover placement="top">
          <template #content>
            <p v-if="searchFormValue.timeDimension === 'week'">周损益取自周KPI的实际数，以及经管导入的目标数</p>
            <p v-else>数据来源：海波龙系统</p>
          </template>
          <img :src="vectorSvg" width="18px" class="ml-8px" />
        </a-popover>
      </div>
    </template>
    <template #toolbarTools>
      {{ tipsText }}
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions, batchMenuItems, getMonthDimensionDefaultDateRange, defaultDataRange } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useDownload } from '/@/views/dataAnalysis/hooks/useDownload';
  import { getProfitKpiList, getProfitandlosReportexport } from '/@/api/dataAnalysis/financial';

  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import { getText, isNull } from './utils';
  import { spanMethodMerge } from '/@/views/dataAnalysis/utils';
  import { isEmpty, omit } from 'lodash-es';

  defineOptions({ name: 'dataAnalysis-financial-profit-report' });
  const tipsText = ref('');
  const spanFields = ['analysis'];
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-report-list',
    cellClassName: ({ row }) => {
      const { sort } = row;
      return `${sort}`.includes('.') ? 'bg-white' : 'bg-yellow font-bold';
    },
    filterConfig: {
      isEvery: true,
    },
    treeConfig: {
      transform: true,
      rowField: 'sort',
      expandAll: true,
      parentField: 'parentId',
    },
    columnConfig: { useKey: true },
    rowConfig: { useKey: true },
    // spanMethod: (res: { row; rowIndex; column; visibleData }) => spanMethodMerge({ ...res, spanFields }),
  });
  const columns = ref(getAllColumns());
  const { downloadFile: downloadTableDataFile } = useDownload({
    requestApi: getProfitandlosReportexport,
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
      beforeQuery: () => {
        const { state } = api.searchFormApi;
        columns.value = getAllColumns({
          dimension: state.searchFormValue.timeDimension,
          dateRange: state.searchFormValue.dateRange,
        });
      },
      api: async params => {
        const { timeDimension, ...res } = params;
        const timeDimensions = {
          [timeDimension === 'week' ? 'dimension' : 'timeDimension']: timeDimension, // MONTH timeDimension;WEEK dimension
        };
        let result = await getProfitKpiList({ ...res, ...timeDimensions });
        return result;
      },
      formatFrontData: data => {
        // console.log('🚀 ~ data:', data);
        const { state } = api.searchFormApi;
        const dimension = state.searchFormValue.timeDimension;
        const dataList = dimension === 'week' ? data : data?.list;
        tipsText.value = dimension === 'week' ? '' : data?.tips;
        return dataList.map(item => {
          const { id, analysis, ...rest } = item;
          return {
            ...rest,
            actualChainThisPropor2: rest.actualChainThisPropor,
            actualChainThis2: rest.actualChainThis,
            analysis: isNull(getText(analysis ?? '')) ? '暂无分析' : analysis,
            [`analysis${dimension}`]: isNull(getText(analysis ?? '')) ? '暂无分析' : analysis,
            code: id ?? '',
          };
        });
      },
    },
    toolbarConfig: {
      baseExportMethod: async () => {
        const { getFormParams } = api.searchFormApi;
        // console.log('🚀 ~ getFormParams:', getFormParams(), api.searchFormApi.state.searchFormValue);
        // const { timeDimension, dimension } = api.searchFormApi.state.searchFormValue;
        const { timeDimension, dimension, ...res } = getFormParams();
        const params = {
          dimension: timeDimension === 'week' ? 'week' : dimension,
          ...res,
        };
        await downloadTableDataFile(params);
      },
      // batchMenuItems,
    },
  });
  const searchFormValue = computed(() => {
    const { searchFormValue } = api.searchFormApi.state;
    return searchFormValue;
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // const { setState } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      () => state.searchFormValue.timeDimension,
      value => {
        const { setState } = api.searchFormApi;
        const keyIdx = formOptions.findIndex(item => item.key === 'dimension');
        // const predictTypekeyIdx = formOptions.findIndex(item => item.key === 'predictType');
        const isHide = value === ETimeDimension.WEEK;
        if (keyIdx > -1) {
          setState(`formOptions.${keyIdx}.isHide`, isHide);
        }
        // if (predictTypekeyIdx > -1) {
        //   setState(`formOptions.${predictTypekeyIdx}.isHide`, isHide);
        // }
      },
      { deep: true },
    );
    watch(
      () => state.searchFormValue.orgCode,
      value => {
        const { setState } = api.searchFormApi;
        const isExpandSBUIdx = state.formOptions.findIndex(item => item.key === 'isExpandSBU');
        const isHide = value === 'MQ';
        setState(`formOptions.${isExpandSBUIdx}.isHide`, !isHide);
      },
      { deep: true },
    );
    watch(
      () => [state.searchFormValue.timeDimension, state.searchFormValue.dimension],
      () => {
        if (state.searchLoading && isEmpty(state.searchFormValue)) return;
        const { setState } = api.searchFormApi;
        const { timeDimension, dimension } = state.searchFormValue;
        setState(`searchFormValue.dateRange`, timeDimension === 'month' && dimension === 'xz' ? getMonthDimensionDefaultDateRange() : defaultDataRange);
      },
      { immediate: true },
    );
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');

  .biangong-table-layout {
    // 表头样式调整
    :deep(.vxe-header--column) {
      padding: 0 !important;

      // 合并一级表头padding
      :deep(tr .col--group) {
        padding: 0 !important;
      }
    }
  }

  // 分析列样式
  .vxe-table--body {
    position: relative;
  }

  :deep(.vxe-body--column.col--html) {
    // align-content: flex-start;
    position: absolute;
    top: 0;
    padding: 1px 0;

    .vxe-cell {
      height: 100% !important;
    }
  }
</style>
