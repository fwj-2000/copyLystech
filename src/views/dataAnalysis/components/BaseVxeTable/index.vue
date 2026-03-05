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

        <!-- 操作栏 -->
        <template v-slot:[ESlotDefault.ACTION]="{ row, column }">
          <span class="text-hover">
            <TableAction outside :actions="column?.params?.getTableActions(row)" />
          </span>
        </template>
        <!-- 单元格-路由跳转插槽 -->
        <template v-slot:[ESlotDefault.LINK_DEFAULT]="{ row, column, columnIndex }">
          <span v-if="isLink({ row, column })" class="text-hover" @click="handleGo({ row, column, columnIndex })">
            {{ formatCellValue(row, column) }}
          </span>
          <span v-else>
            {{ formatCellValue(row, column) }}
          </span>
        </template>
        <!-- 单元格-弹窗 -->
        <template v-slot:[ESlotDefault.DIALOGUE]="{ row, column }">
          <span :class="column.type === 'html' ? '' : 'text-hover'" @click="handleOpenDialog({ row, column })">
            <template v-if="column.type === 'html'">
              <div v-html="row[column.field]"></div>
            </template>
            <template v-else>
              {{ row[column.field] }}
            </template>
          </span>
        </template>
        <!-- 单元格-运营日报 -->
        <template v-slot:[ESlotDefault.DAILY_REPORT]="{ row, column }">
          <span class="flex justify-end">
            <span v-if="isLink({ row, column })" class="text-hover" @click="handleGoNormal({ row, column })">
              {{ row[column.field] ?? '' }}
            </span>
            <span v-else>
              {{ row[column.field] ?? '' }}
            </span>
            <template v-if="hasAnalysis({ row, column })">
              <a-popover placement="right">
                <template #content>
                  <component
                    v-if="column?.params?.popoverComponent"
                    :is="column?.params?.popoverComponent"
                    v-bind="{
                      row,
                      column,
                      searchFormValue: state.searchFormValue,
                    }"></component>
                </template>
                <img class="text-hover" :src="vectorSvg" style="margin: 0 0 1px 4px" @click="handleOpenDialog({ row, column })" />
              </a-popover>
            </template>
          </span>
        </template>
        <template #customCell="{ row, column }">
          <slot name="customCell" :row="row" :column="column"></slot>
        </template>
        <!-- 筛选插槽 -->
        <template v-slot:[EFilterSlot.MULTI_SEARCH_SELECT]="{ ...args }">
          <MultiSearchSelect :args="args" />
        </template>
        <template v-slot:[EFilterSlot.MULTI_SEARCH_SELECT_DATE]="{ ...args }">
          <MultiSearchSelectDate :args="args" />
        </template>
        <template v-slot:[EFilterSlot.MULTI_SEARCH_SELECT_REMOTE]="{ ...args }">
          <MultiSearchSelectRemote :args="args" :searchFormValue="state.searchFormValue" />
        </template>

        <!-- 左侧按钮插槽 -->
        <template #toolbar-actions>
          <slot name="toolbarActions"></slot>
        </template>
        <!-- 右侧按钮插槽 -->
        <template #toolbar-tools>
          <slot name="toolbarTools"></slot>
        </template>
      </Grid>
    </div>
    <!-- 彈窗组件 -->
    <a-modal
      v-model:open="dialogueVisible"
      v-bind="{
        footer: null,
      }"
      :title="dialogueInfo.title ?? ''"
      style="width: calc(60vw + 32px)">
      <component v-if="dialogueCompo" :is="dialogueCompo" :info="dialogueInfo" @submit="handleSubmit" @cancel="handleCancel"></component>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, computed, reactive, shallowRef, nextTick } from 'vue';
  import { cloneDeep, isFunction, merge } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useGo } from '/@/hooks/web/usePage';
  import { getMergeRow } from './utils';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { TableAction } from '/@/components/Table';

  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import type { ComputedRef } from 'vue';
  import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from 'vxe-table';
  import EmptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import { IAction, IState } from './types';
  import { EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
  import MultiSearchSelect from './filters/MultiSearchSelect.vue';
  import MultiSearchSelectDate from './filters/MultiSearchSelectDate.vue';
  import MultiSearchSelectRemote from './filters/MultiSearchSelectRemote.vue';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  const emits = defineEmits(['register', 'refresh']);
  const dialogueVisible = ref<boolean>(false);
  const dialogueCompo = shallowRef<any>(null); // 弹窗渲染组件
  const dialogueInfo = ref<Record<string, string>>({}); // 弹窗查询条件
  const state = reactive<IState>({
    columns: [],
    baseColumns: [],
    attrs: {},
    searchFormValue: ref<Record<string, any>>({}),
    actions: {},
    events: {},
  });
  const mergeConfig = reactive({
    currentIdx: 0,
    size: 0,
    lastMergeSize: 0,
  });
  const go = useGo();
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
        showHeaderOverflow: 'title',
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
          maxFixedSize: 100,
          isCurrent: false,
        },
        rowConfig: {
          // height: 32,
          isCurrent: false,
        },
        cellConfig: {
          height: 32,
        },
        // 关闭单元格选取
        mouseConfig: {
          selected: true,
          area: true,
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
        scrollY: {
          gt: 200,
          oSize: 10,
          enabled: true,
          immediate: true,
          scrollToTopOnChange: true,
        },
        virtualYConfig: {
          gt: 200,
          oSize: 10,
          enabled: true,
          immediate: true,
        },
        clipConfig: {
          isCopy: true,
          copyToLabel: true,
          copyMethod: ({ cellValue }) => {
            return cellValue;
          },
        },
        // 动态日期列会随查询变化，禁用列顺序缓存，避免旧 sortData 造成乱序
        customConfig: {
          // allowSort: false,
          storage: {
            resizable: true,
            sort: false,
          },
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

  const hasAnalysis = ({ column, row }) => {
    const { getHasAnalysis } = column.params;
    const value = row[column.field] ?? '';
    if (isFunction(getHasAnalysis)) {
      return getHasAnalysis(row) && value;
    }
    return false;
  };

  // 防抖重新加载表格
  const reloadData = (params?: any) => {
    return reload(params);
  };

  // 滚动监听
  function scroll({ scrollTop }) {
    const hasSpanMethod = typeof state.attrs.spanMethod === 'function'; // spanMethod和 setMergeCells会冲突
    console.log('spanMethod???===>', hasSpanMethod);
    if (hasSpanMethod) return;

    if (scrollTop > (mergeConfig.currentIdx - 1) * mergeConfig.size * 32) {
      const { currentIdx, size, lastMergeSize } = mergeConfig;
      const { visibleData: fullData } = gridApi.grid.getTableData();
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
    } else {
      /**
       * 修复前端筛选后合并单元格失效及错位的 Bug：
       * 1. 为什么用 visibleData：筛选后数据索引已变，必须用当前可见数据集计算合并，否则会导致单元格跨列错位。
       * 2. 为什么用 nextTick：VXE-Table 的筛选是异步渲染的，需等待 DOM 更新后获取最新的 visibleData。
       * 3. 为什么重置 mergeConfig：筛选会导致总高度变化，需将滚动状态机重置回第一页。
       */
      nextTick(() => {
        const grid = gridApi.grid;
        if (!grid) return;

        // 1. 重置滚动优化相关的配置
        mergeConfig.currentIdx = 1;
        mergeConfig.lastMergeSize = 0;

        // 2. 获取筛选后的可见数据
        const { visibleData } = grid.getTableData();

        // 3. 重新计算并设置合并单元格
        const allMergeRows = getMergeRow({
          data: visibleData,
          columns: state.columns, // 确保使用当前 state 中的列配置
        });

        grid.clearMergeCells();
        if (allMergeRows.length > 0) {
          grid.setMergeCells(allMergeRows);
        }
      });
    }
  };

  // 排序变更
  const sortChange = () => {
    gridApi.grid.clearMergeCells();
  };

  // 编辑关闭
  const editClosed = ({ row, column }) => {
    const { modifyMth } = column.params || {};
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
  // 打开弹窗
  const handleOpenDialog = ({ row, column }) => {
    const { params } = column;
    dialogueCompo.value = params.dialogueCompo;
    dialogueInfo.value =
      params?.getDialogueInfo?.({
        row,
        searchFormValue: state.searchFormValue,
        column,
      }) ?? {};
    dialogueVisible.value = true;
  };
  const handleSubmit = (falg: boolean) => {
    dialogueVisible.value = falg;
    emits('refresh');
  };
  const handleCancel = (falg: boolean) => {
    dialogueVisible.value = falg;
  };

  // 打开新标签页（参数放路由上
  const handleGoNormal = ({ row, column }) => {
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
      const query = getPathParams({
        row,
        searchFormValue: state.searchFormValue,
        column,
      });
      url = `${url}?${objectToQueryParams({
        orgCode: state.searchFormValue.orgCode,
        ...query,
      })}`;
      go(url);
    }
  };

  // 跳转（参数存内存里
  const handleGo = ({ row, column, columnIndex }) => {
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
        columnIndex,
      });
      goPath(url, params);
    }
  };

  /**
   * 格式化表格取值
   * @param row
   * @param column
   */
  function formatCellValue(row: any, column: any) {
    const value = row[column.field] ?? '';
    if (typeof column.formatter !== 'function') {
      return value;
    }
    return column.formatter({ row, column, cellValue: value });
  }

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

    .text-mini {
      font-size: 11px;
    }

    .font-weight-bold {
      font-weight: bold;
    }

    .vxe-grid--layout-body-content-wrapper {
      overflow: hidden;
    }

    .vxe-pager .vxe-pager--sizes {
      margin-right: 0;
    }

    .vxe-grid--pager-wrapper {
      padding-top: 5px;
      padding-bottom: 8px;
    }
  }
</style>
