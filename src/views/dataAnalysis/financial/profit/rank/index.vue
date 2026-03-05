<!-- 损益排名页组件 -->
<template>
  <!-- 使用自定义的表格布局组件 -->
  <TableLayout class="biangong-table-layout">
    <!-- 左侧标题区域（仅月维度显示） -->
    <template #toolbarLeft v-if="dimensionRef === 'month'">
      <a-space>
        <div class="font-bold text-[14px]"> {{ tableTitle }} </div>
      </a-space>
    </template>

    <!-- 右侧工具栏区域 -->
    <template #toolbarRight>
      <span>取数时间</span>

      <!-- 统一的提示弹窗（根据维度动态切换内容） -->
      <a-popover placement="right">
        <template #content>
          <p>{{ tooltipContent }}</p>
        </template>
        <img :src="vectorSvg" width="18px" class="ml-8px" />
      </a-popover>

      <!-- 单位说明（仅月维度显示） -->
      <div v-if="dimensionRef === 'month'" style="margin-left: auto">（单位：万元、%）</div>
    </template>

    <template #toolbarTools v-if="dimensionRef === 'month'">
      {{ tipsText }}
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  // 组件命名
  defineOptions({ name: 'dataAnalysis-financial-profit-rank' });

  // 导入依赖
  import dayjs from 'dayjs';
  import { isEmpty, omit } from 'lodash-es';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions, DimensionType, defaultDataRange, getText, isNull } from './config';
  import { getMonthDimensionDefaultDateRange } from './utils';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useDownload } from '/@/views/dataAnalysis/hooks/useDownload';
  import { getProfitandlosRankData, getProfitandlosRankingexport } from '/@/api/dataAnalysis/financial';
  import { getRowClassNameFuncByGroupKey, formatFooterData } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import type { VxeGridProps } from 'vxe-table';
  import { spanMethodMerge } from '/@/views/dataAnalysis/utils';

  // 常量定义
  const ANALYSIS = 'analysis';
  const SPAN_FIELDS = [ANALYSIS]; // 需要合并的字段

  // 响应式数据
  const tipsText = ref('');
  const dimensionRef = ref<DimensionType>('month'); // 当前维度（月/周）
  const getRowClassName = getRowClassNameFuncByGroupKey('factory'); // 行样式函数

  // 表格属性配置
  const tableAttrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-rank-list',
    columnConfig: { useKey: true },
    rowConfig: { useKey: true },
    // spanMethod: (res: { row; rowIndex; column; visibleData }) => spanMethodMerge({ ...res, spanFields: SPAN_FIELDS }),
    showFooterOverflow: true,
    // mouseConfig: {
    //   selected: false,
    //   area: false,
    // },
  });

  // 表格列配置（响应式）
  const columns = ref(getAllColumns());

  // 下载文件功能
  const { downloadFile: downloadTableDataFile } = useDownload({
    requestApi: getProfitandlosRankingexport,
  });

  // 表格完整配置
  const tableConfig = reactive({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs: tableAttrs,
      customFieldOptions,
      isFrontPagination: true,

      // 查询前处理（确保使用最新的日期参数更新列配置）
      beforeQuery: () => {
        const { state } = api.searchFormApi;
        console.log('🚀 ~  api.searchFormApi.getFormParams():', api.searchFormApi.getFormParams());
        const { dateRange, dimension, predictType } = state.searchFormValue;
        tableAttrs.cellClassName = dimension === 'month' ? '' : getRowClassName;
        columns.value = getAllColumns({
          dimension,
          dateRange,
          predictType,
        });
      },

      // 导出参数配置
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `周损益排名_${startDim}-${endDim}`;
        return { filename };
      },

      // 数据请求API
      api: params => {
        const { dimension } = params;
        // 周维度下组装bg默认值0
        if (dimension !== 'week') {
          params.isAssembly = '0';
        }
        return getProfitandlosRankData(params);
      },

      // 数据格式化（根据维度分支处理）
      formatFrontData: data => {
        return dimensionRef.value === 'month' ? handleMonthData(data) : handleWeekData(data);
      },
    },
    toolbarConfig: {
      baseExportMethod: async () => {},
    },
  });

  // 初始化表格布局
  const [TableLayout, api] = useTableLayout(tableConfig);

  // 组件挂载后逻辑
  onMounted(() => {
    const { state } = api.searchFormApi;

    // 监听组织代码和维度变化，动态调整UI
    watch(
      [() => state.searchFormValue.orgCode, () => state.searchFormValue.dimension, () => state.searchLoading],
      () => {
        if (state.searchLoading && isEmpty(state.searchFormValue)) return;
        const { setState } = api.searchFormApi;
        const { dimension, orgCode } = state.searchFormValue;
        const grid = api.getGridInstance();
        const isMonthDimension = dimension === 'month';

        grid.refreshColumn();

        // 查找相关表单选项的索引
        const busbuDimIndex = state.formOptions.findIndex(item => item.key === 'busbuDim');
        const saleOutputDimIndex = state.formOptions.findIndex(item => item.key === 'saleOutputDim');
        const isAssemblyIndex = state.formOptions.findIndex(item => item.key === 'isAssembly');
        const predictTypeIndex = state.formOptions.findIndex(item => item.key === 'predictType');

        // 根据维度调整UI显示
        if (dimension === 'month') {
          // grid.hideColumn(ANALYSIS);
          const isHide = orgCode !== 'MQ';
          setState(`formOptions.${busbuDimIndex}.isHide`, isHide);
        } else {
          orgCode == 'MQ' ? grid.showColumn(ANALYSIS) : grid.hideColumn(ANALYSIS);
          setState(`formOptions.${busbuDimIndex}.isHide`, true);
        }

        // 更新维度引用和相关表单选项可见性
        dimensionRef.value = dimension;
        setState(`formOptions.${saleOutputDimIndex}.isHide`, !isMonthDimension);
        setState(`formOptions.${isAssemblyIndex}.isHide`, isMonthDimension); // 月维度不显示组装bg
        setState(`formOptions.${predictTypeIndex}.isHide`, isMonthDimension);

        // 更新导出配置
        updateExportConfig(isMonthDimension);
      },
      { immediate: true, deep: true },
    );
    // 时间默认值操作
    watch(
      () => [state.searchFormValue.dimension, state.searchFormValue.saleOutputDim],
      () => {
        if (state.searchLoading && isEmpty(state.searchFormValue)) return;
        const { setState } = api.searchFormApi;
        const { dimension, saleOutputDim } = state.searchFormValue;
        setState(`searchFormValue.dateRange`, dimension === 'month' && saleOutputDim === 'xz' ? getMonthDimensionDefaultDateRange() : defaultDataRange);
      },
      { immediate: true },
    );
  });

  // 更新导出配置（根据维度不同采用不同的导出方式）
  const updateExportConfig = (isMonth: boolean) => {
    if (isMonth) {
      // 月维度：后端导出（带特定参数）
      tableConfig.toolbarConfig.baseExportMethod = async () => {
        const { getFormParams } = api.searchFormApi;
        const params = omit(getFormParams(), ['isAssembly']);
        await downloadTableDataFile({ ...params, isAssembly: '0' });
      };
    } else {
      // 周维度：使用默认前端导出
      tableConfig.toolbarConfig = {} as any;
    }
  };

  // 月维度数据处理函数
  const handleMonthData = ({ list, tips }) => {
    tipsText.value = tips;
    const { state } = api.searchFormApi;
    const { dateRange } = state.searchFormValue;
    // 获取月维度的列配置
    const monthColumns = getAllColumns({ dimension: 'month', dateRange });

    // 配置footer数据
    tableAttrs.showFooter = true;
    tableAttrs.footerData = formatFooterData(
      monthColumns,
      list.filter(item => item.key === 'MQ'),
    );

    // 配置footer样式（未达标项标红）
    tableAttrs.footerCellClassName = ({ row, column }: any) => {
      const targetFields = ['budgetAchievementRate', 'forecastAchievementRate', 'samePeriodAchievementRate'];
      if (targetFields.includes(column.field) && Number(row[column.field]?.replace('%', '')) < 100) {
        return 'text-red vxe-foot-data-cell';
      }
      return 'vxe-foot-data-cell';
    };

    // 过滤并排序主数据
    return handleAnaslysisData(list.filter(item => item.key !== 'MQ').sort((a, b) => a.sort - b.sort));
  };

  const handleAnaslysisData = (data: any[]) => {
    const { state } = api.searchFormApi;
    const dimension = state.searchFormValue.dimension;
    return data.map(item => {
      const { analysis, ...rest } = item;
      return {
        ...rest,
        [`analysis${dimension}`]: isNull(getText(analysis ?? '')) ? '暂无分析' : analysis,
      };
    });
  };
  // 周维度数据处理函数
  const handleWeekData = (data: any[]) => {
    tableAttrs.showFooter = false;
    // console.log('🚀 ~ handleWeekData ~ handleAnaslysisData(data):', handleAnaslysisData(data));
    return handleAnaslysisData(data);
  };

  // 表格标题（计算属性，根据日期范围动态生成）
  const tableTitle = computed(() => {
    const { searchFormValue } = api.searchFormApi.state;
    const [startDate, endDate] = searchFormValue?.dateRange ?? [dayjs(), dayjs()];
    const startMonth = startDate.format('YYYYMM');
    const endMonth = endDate.format('YYYYMM');
    const valueType = searchFormValue.saleOutputDim === 'cz' ? '产值' : '销值';
    return `${startMonth}月-${endMonth}月模切BG损益统计（${valueType}版）`;
  });

  // 提示文本计算（根据维度动态切换）
  const tooltipContent = computed(() => {
    return dimensionRef.value === 'month'
      ? '12号之前：上月净利达成数据来源于上月周KPI；12号之后：上月净利达成数据来源于上月月损益'
      : '周三更新周损益，12号更新月损益';
  });
</script>

<style lang="less" scoped>
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
    position: absolute;
    top: 0;
    padding: 1px 0;

    .vxe-cell {
      height: 100% !important;
    }
  }
</style>
