<!-- 表格组件二次封装（供FC交付中心用 -->
<template>
  <div class="w-[100%] h-[100%] flex flex-col overflow-hidden">
    <div class="vxe-table w-[100%] h-[100%] flex-shrink">
      <!-- 报表表格 -->
      <Grid>
        <template #loading>
          <a-spin />
        </template>
        <template #empty>
          <EmptyData />
        </template>
        <!-- 单元格插槽 -->
        <template v-slot:[ESlotDefault.LINK_DEFAULT]="{ row, column }">
          <span v-if="isLink({ row, column })" class="text-hover" @click="handleGo({ row, column })">
            {{ row[column.field] ?? '' }}
          </span>
          <span v-else>
            {{ row[column.field] ?? '' }}
          </span>
        </template>
        <!-- 筛选插槽 -->
        <template v-slot:[EFilterSlot.MULTI_SEARCH_SELECT]="{ ...args }">
          <MultiSearchSelect :args="args" />
        </template>
        <template v-slot:[EFilterSlot.MULTI_SEARCH_SELECT_REMOTE]="{ ...args }">
          <MultiSearchSelectRemote :args="args" :searchFormValue="state.searchFormValue" />
        </template>
        <!-- 右侧按钮插槽 -->
        <template #toolbarTools> </template>
        <!-- 左侧按钮插槽 -->
        <template #toolbar-actions>
          <a-space>
            <a-button v-if="state.tools.includes(EToolType.EXPORT)" v-bind="baseToolAttrs" @click="handleExport"> 导出表格数据 </a-button>
            <slot name="toolbarActions"></slot>
          </a-space>
        </template>
      </Grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { inject, ref, onMounted, watch, computed, reactive } from 'vue';
  import { cloneDeep, isFunction, merge } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getMergeRow } from './utils';
  import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';

  import type { ComputedRef } from 'vue';
  import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from 'vxe-table';
  import EmptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import { IAction, IState, EToolType } from './types';
  import { EFilterSlot, ESlotDefault } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import MultiSearchSelect from './filters/MultiSearchSelect.vue';
  import MultiSearchSelectRemote from './filters/MultiSearchSelectRemote.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const baseToolAttrs = {
    type: 'primary',
  };
  const emits = defineEmits(['register']);
  const getExportFilename = inject('getExportFilename', () => '');
  const state = reactive<IState>({
    columns: [],
    baseColumns: [],
    attrs: {},
    tools: [],
    searchFormValue: ref<Record<string, any>>({}),
    actions: {},
    events: {},
    getExportParams: () => ({}),
  });
  const mergeConfig = reactive({
    currentIdx: 0,
    size: 0,
    lastMergeSize: 0,
  });
  const { t } = useI18n();
  const route = useRoute();
  const { goPath } = useRouteParams();

  interface IGridOptions extends VxeGridProps {
    pagerConfig?: VxeGridPropTypes.PagerConfig;
  }

  const gridEvents: ComputedRef<DeepPartial<VxeGridListeners<any>>> = computed(() => {
    return {
      ...state.events,
      filterChange: filterChange,
      sortChange: sortChange,
      editClosed: editClosed,
      scroll,
    };
  });

  const gridOptions: ComputedRef<IGridOptions> = computed(() => {
    const options = merge(
      cloneDeep({
        footerCellClassName: 'vxe-foot-data-cell',
        border: true,
        autoResize: true,
        loading: false,
        height: '100%',
        size: 'mini',
        pagerConfig: {
          currentPage: 1,
          pageSize: 50,
        },
        editConfig: {
          mode: 'cell',
          trigger: 'click',
        },
        filterConfig: {
          remote: false,
        },
        sortConfig: {
          remote: false,
        },
        exportConfig: {
          isMerge: true,
          isFooter: true,
          type: 'xlsx',
          types: ['xlsx'],
          mode: 'all',
          modes: ['current', 'all'],
        },
        columnConfig: {
          isCurrent: false,
        },
        rowConfig: {
          height: 32,
          isCurrent: false,
        },
        // 关闭单元格选取
        mouseConfig: {
          selected: false,
          area: false,
        },
        resizeConfig: {
          refreshDelay: 10,
        },
        toolbarConfig: {
          zoom: true,
          custom: true,
          refresh: false,
          slots: {
            tools: 'toolbarTools',
          },
        },
        // scrollY: {
        //   gt: 200,
        //   oSize: 10,
        //   enabled: true,
        //   immediate: true,
        // },
        virtualYConfig: {
          gt: 200,
          oSize: 10,
          enabled: true,
          immediate: true,
          scrollToTopOnChange: true,
        },
        columns: state.columns,
      }),
      state.attrs,
    ) as IGridOptions;
    return options;
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: gridOptions.value,
    // gridEvents: gridEvents.value,
  });

  const { reload } = gridApi;
  onMounted(() => {
    const action: IAction = {
      state: state as IState,
      grid: gridApi.grid,
      mergeConfig,
      reloadData,
    };

    emits('register', action);
  });

  // 防抖重新加载表格
  const reloadData = (params?: any) => {
    return reload(params);
  };

  // 滚动监听
  function scroll({ scrollTop }) {
    if (scrollTop > (mergeConfig.currentIdx - 1) * mergeConfig.size * 32) {
      const { currentIdx, size, lastMergeSize } = mergeConfig;
      const { fullData } = gridApi.grid.getTableData();
      const endIdx = (currentIdx + 1) * size;
      const mergeData = fullData.slice(0, endIdx);
      mergeConfig.currentIdx += 1;
      const allMergeRows = getMergeRow({
        data: mergeData,
        columns: state.columns,
      });
      const mergeRows = allMergeRows.slice(lastMergeSize);
      mergeConfig.lastMergeSize = allMergeRows.length;
      gridApi.grid.setMergeCells(mergeRows);
    }
  }

  // 筛选变更
  const filterChange = () => {
    gridApi.grid.clearMergeCells();
    const { filterConfig } = gridOptions.value;
    const { remote } = filterConfig ?? { remote: false };
    if (remote) {
      gridApi.grid.updateData();
    }
  };

  // 排序变更
  const sortChange = () => {
    gridApi.grid.clearMergeCells();
  };

  // 编辑关闭
  const editClosed = ({ row, column }) => {
    const { modifyMth } = column.params;
    if (!isFunction(modifyMth) || !row.Id) {
      return;
    }
    modifyMth({
      fcDataId: row.Id,
      reason: row.CauseAnalysis,
    });
  };

  // 判断能否跳转
  const isLink = ({ row, column }) => {
    const { getPathUrl, pathUrl = '' } = column.params;
    let url = pathUrl;
    if (isFunction(getPathUrl)) {
      url = getPathUrl({
        row,
        searchFormValue: state.searchFormValue,
        column,
      });
    }
    return url && row[column.field];
  };
  // 跳转
  const handleGo = ({ row, column }) => {
    const { getPathUrl, pathUrl = '', getPathParams } = column.params;
    let url = pathUrl;
    if (isFunction(getPathUrl)) {
      url = getPathUrl({
        row,
        searchFormValue: state.searchFormValue,
        column,
      });
    }
    if (url && isFunction(getPathParams)) {
      const params = getPathParams({
        row,
        searchFormValue: state.searchFormValue,
        column,
      });
      console.log('🚀 ~ handleGo ~ params:', params);
      goPath(url, params);
    }
  };

  // 导出
  const handleExport = () => {
    const filename = getExportFilename() || t(route.meta.title);
    const params = {
      filename,
      ...(state?.getExportParams?.() ?? {}),
    };
    try {
      gridApi?.grid?.openExport(params);
    } catch (error) {
      console.error('Export Error:', error);
    }
  };

  watch(
    () => gridOptions.value,
    () => {
      gridApi.setState({
        gridOptions: gridOptions.value,
      });
    },
    { deep: true },
  );

  watch(
    () => gridEvents.value,
    () => {
      gridApi.setState({
        gridEvents: gridEvents.value,
      });
    },
    { deep: true },
  );
</script>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .text-right {
      text-align: right;
    }

    .bg-purple {
      background-color: #d4e0fb;
    }

    .bg-grey {
      background-color: #e0dad3;
    }

    .bg-yellow {
      background-color: rgb(254 239 208);
    }

    .bg-white {
      background-color: rgb(255 255 255);
    }

    .vxe-foot-data-cell {
      font-weight: bold;
      color: #000;
      text-align: right;
      background-color: rgb(255 123 0 / 20%);

      .vxe-cell {
        justify-content: flex-end;
      }
    }

    .text-red {
      color: red;
    }

    .text-indent-1 {
      text-indent: 0.5rem;
    }

    .text-indent-2 {
      text-indent: 1rem;
    }

    .vxe-grid--layout-body-content-wrapper {
      overflow: hidden;
    }
  }
</style>
