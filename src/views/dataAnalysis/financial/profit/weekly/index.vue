<!-- 周损益 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarRight>
      <a-popconfirm placement="right" :title="`确定后将同步${commonParams.endDim}周数据到运营版周损益`" @confirm="syncHFMData">
        <a-button :loading="syncLoading" type="primary" v-if="isSyncBtnShow">同步数据</a-button>
      </a-popconfirm>
      <ToolBarAction :formParams="commonParams" />
      <a-popconfirm placement="right" :title="`确定后将解锁${commonParams.endDim}周运营版周损益`" @confirm="unlockWeeklyProfit">
        <a-button v-auth="'btn_unlockWeekly'" :loading="unlockWeeklyLoading" type="primary" v-if="isSyncBtnShow">解锁周损益</a-button>
      </a-popconfirm>
      <JumpAction :searchFormValue="api.searchFormApi.state.searchFormValue" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  // 1. 导入Vue相关依赖
  import { reactive, ref, watch, computed, onMounted } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';

  // 2. 导入组件和类型
  import ToolBarAction from './ToolBarAction.vue';
  import JumpAction from './JumpAction.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  // 3. 导入hooks和工具函数
  import { useMessage } from '/@/hooks/web/useMessage';
  import { spanMethodMerge } from '/@/views/dataAnalysis/utils';

  // 4. 导入API和常量
  import { getProfitWeekListV2, syncHFMDataApi, unlockstatu as unlockstatuApi } from '/@/api/dataAnalysis/financial';

  // 5. 导入配置
  import { getAllColumns, commonOptions, customFieldOptions, batchMenuItems, getText, isNull } from './config';

  // 组件名称定义
  defineOptions({ name: 'dataAnalysis-financial-profit-weekly' });

  const { createMessage } = useMessage();

  const spanFields = ['analysis'];
  const syncLoading = ref(false);
  const unlockWeeklyLoading = ref(false);
  const isSyncBtnShow = ref(true);
  const commonParams = computed(() => {
    const searchFormValue = api.searchFormApi.getFormParams();
    return searchFormValue;
  });
  const columns = ref(getAllColumns());

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-weekly-grid',
    cellClassName: ({ row }) => {
      const { sort } = row;
      return `${sort}`.includes('.') ? 'bg-white' : 'bg-yellow';
    },
    treeConfig: {
      transform: true,
      rowField: 'sort',
      expandAll: true,
      parentField: 'parentId',
    },
    columnConfig: { useKey: true },
    rowConfig: { useKey: true },
    spanMethod: (res: { row; rowIndex; column; visibleData }) => spanMethodMerge({ ...res, spanFields }),
  });
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions: commonOptions,
    },
    tableConfig: {
      columns,
      attrs,
      customFieldOptions,
      isFrontPagination: true,
      beforeQuery: () => {
        const { state } = api.searchFormApi;
        columns.value = getAllColumns(state.searchFormValue.dateRange);
      },
      getExportParams: () => {
        const { startDim, endDim } = commonParams.value;
        const filename = `周损益底稿${startDim}${endDim}`;
        return {
          filename,
        };
      },
      getQueryExtraParams: () => ({ dimension: 'week' }),
      api: getProfitWeekListV2,
      formatFrontData: data => {
        return data.map(item => {
          const { id, analysis, sort, ...rest } = item;
          return {
            code: id ?? '',
            id: sort,
            sort,
            actualChainThisPropor2: rest.actualChainThisPropor,
            actualChainThis2: rest.actualChainThis,
            analysis: isNull(getText(analysis ?? '')) ? '暂无分析' : analysis,
            ...rest,
          };
        });
      },
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
  onMounted(() => {
    const { state } = api.searchFormApi;
    watch(
      [() => state.searchFormValue.orgCode],
      () => {
        isSyncBtnShow.value = state.searchFormValue.orgCode.length !== 6; //bu 不显示
      },
      { deep: true, immediate: false },
    );
  });

  const syncHFMData = () => {
    const { orgCode, endDim: week } = commonParams.value;
    syncLoading.value = true;
    syncHFMDataApi({ orgCode, week })
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
  const unlockWeeklyProfit = () => {
    const { orgCode, endDim: week } = commonParams.value;
    unlockWeeklyLoading.value = true;
    unlockstatuApi({ orgCode, week })
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        unlockWeeklyLoading.value = false;
      });
  };
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

  :deep(.vxe-table) {
    .text-red {
      color: red;
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
