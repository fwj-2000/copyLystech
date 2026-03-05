<!-- 封装好的vxe展示表格（注意：仅展示用吗，无其他功能 -->
<template>
  <vxe-grid ref="gridRef" v-bind="{ ...gridOptions, ...$attrs }" @filter-change="handleFilterChange" v-on="gridEvents">
    <!-- 多选搜索过滤 -->
    <template #multiSearchFilter="{ column }">
      <div v-for="(option, index) in column.filters" :key="index">
        <div class="p-6px">
          <a-select
            v-model:value="option.values"
            mode="multiple"
            style="width: 144px"
            dropdownMatchSelectWidth
            :options="getMultiSearchFilterOptions({ column })"
            @change="changeFilterOption(option, ['values'], column.field)">
          </a-select>
        </div>
      </div>
    </template>
    <!-- 值过滤 -->
    <template #filterValue="{ column }">
      <div v-for="(option, index) in column.filters" :key="index">
        <div class="p-6px">
          <a-radio-group
            v-model:value="option.condition"
            :options="[
              { label: '大于', value: EConditionValue.GREATER_THAN },
              { label: '小于', value: EConditionValue.LESS_THAN },
              { label: '等于', value: EConditionValue.AMOUNT },
            ]"
            @change="changeFilterOption(option, ['condition', 'value'])" />
        </div>
        <div class="p-6px">
          <a-input v-model:value="option.value" @input="changeFilterOption(option, ['condition', 'value'])"></a-input>
        </div>
      </div>
    </template>
    <!-- 格式化值展示 -->
    <template #formatValue="{ row, column, columnIndex }">
      <span :style="getCellStyle({ row, column, columnIndex })">
        {{ row[column.field] }}
      </span>
    </template>
    <!-- 点击跳转 -->
    <template #routeLink="{ row, column, columnIndex }">
      <span class="text-hover" @click="goPage({ row, columnIndex })">
        {{ row[column.field] }}
      </span>
    </template>
    <!-- 弹窗 -->
    <template #dialog="{ row, column, columnIndex }">
      <span class="text-hover" @click="handleDialog({ row, columnIndex })">
        {{ row[column.field] }}
      </span>
    </template>
  </vxe-grid>
  <!-- 彈窗组件 -->
  <a-modal
    v-model:open="dialogVisible"
    v-bind="{
      footer: null,
      ...dialogAttrs,
    }"
    style="width: calc(60vw + 32px)">
    <component v-if="dialogCompo" :is="dialogCompo" :queryInfo="queryInfo"></component>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  import { isEmpty, uniq } from 'lodash-es';
  import { computed, nextTick, reactive, ref, watch } from 'vue';
  import { objectToQueryParams } from '../../metricsCenter/utils';
  import { getColumnsOptions } from './config';

  import type { VxeGridInstance, VxeGridProps, VxeColumnPropTypes, VxeGridListeners } from 'vxe-table';
  import { ECellSlotType, EConditionValue } from './types';

  const go = useGo();
  const gridRef = ref<VxeGridInstance<any>>();
  const dialogVisible = ref<boolean>(false);
  const dialogCompo = ref<any>(); // 弹窗渲染组件
  const dialogAttrs = ref<any>({}); // 弹窗组件原始attrs
  const queryInfo = ref<Record<string, string>>({}); // 弹窗查询条件
  const allList = ref<any[]>([]);
  const props = defineProps({
    // 表格数据
    dataSource: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
    showColumns: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    }, // 展示的列表字段
    allColumnsOptions: {
      type: Object as PropType<Record<string, any>>,
      required: true,
      default: () => ({}),
    }, // 封装的表格配置
    searchFormValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    }, // 查询条件信息
    summaryInfo: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    }, // 汇总数据
    showPagination: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // 覆盖默认配置
    gridOptions: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  });

  // 表格配置
  const gridOptions = reactive<
    VxeGridProps & {
      pagerConfig?: {
        total: number;
        currentPage: number;
        pageSize: number;
        pageSizes: number[];
      };
    }
  >({
    size: 'mini',
    showOverflow: 'tooltip',
    autoResize: true,
    mouseConfig: {
      area: false, // 是否开启区域选取
      extension: false,
    },
    resizeConfig: {
      refreshDelay: 10,
    },
    scrollY: {
      enabled: true,
      gt: 200,
    },
    rowConfig: {
      height: 32,
    },
    columnConfig: {
      isCurrent: false,
      isHover: false,
    },
    height: '100%',
    mergeCells: [],
    columns: [],
    data: [],
    showFooter: true,
    footerData: [],
    ...(props.showPagination
      ? {
          pagerConfig: {
            total: 0,
            currentPage: 1,
            pageSize: 100,
            pageSizes: [50, 100, 1000, 2000],
          },
        }
      : {}),
    ...props.gridOptions,
  });
  // 模拟前端分页
  const handlePageData = () => {
    if (!gridOptions.pagerConfig || !props.showPagination) return;
    const { pageSize, currentPage } = gridOptions.pagerConfig;
    gridOptions.pagerConfig.total = allList.value.length;
    gridOptions.data = allList.value.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    gridOptions.loading = false;
    nextTick(() => {
      handleFilterChange();
    });
    // // 获取合并格配置
    // handleFilterChange();
  };

  const gridEvents: VxeGridListeners = {
    ...(props.showPagination
      ? {
          pageChange({ pageSize, currentPage }) {
            if (!gridOptions.pagerConfig || !props.showPagination) return;
            gridOptions.pagerConfig.currentPage = currentPage;
            gridOptions.pagerConfig.pageSize = pageSize;
            handlePageData();
          },
        }
      : {}),
    sortChange() {
      // 获取合并格配置
      handleFilterChange();
    },
  };

  const columns = computed(() => {
    const { allColumnsOptions, showColumns, dataSource } = props;
    const res = getColumnsOptions({
      dataSource,
      showColumns,
      allColumnsOptions,
    });
    return res;
  });

  // 获取多选搜索筛选的下拉配置项
  const getMultiSearchFilterOptions = ({ column }) => {
    const { field } = column;
    return uniq(props.dataSource.map(item => item[field])).map(item => ({ label: item, value: item }));
  };

  // 当筛选条件发生变化时会触发该事件
  const handleFilterChange = () => {
    // 更新合并单元格内容
    const $grid = gridRef.value;
    if ($grid) {
      const { visibleData = [] } = $grid.getTableData();
      gridOptions.mergeCells = getMergeCells(visibleData);
    }
  };

  // 过滤条件更改
  const changeFilterOption = (option: VxeColumnPropTypes.FilterItem, requireddKeyList: string[] = [], field: string = '') => {
    const $grid = gridRef.value;
    if ($grid) {
      const isAllChecked = !requireddKeyList.some(key => !option[key]);
      $grid.updateFilterOptionStatus(option, isAllChecked);
      field && $grid.openFilter(field);
    }
  };
  // 根据单元格配置获取样式信息
  const getCellStyle = ({ row, column, columnIndex }) => {
    const value = row[column.field];
    const { getCellStyle = () => ({}) } = columns.value[columnIndex] || {};
    const res = getCellStyle(value);
    return res;
  };

  // 打开新标签页
  const goPage = ({ row, columnIndex }) => {
    const { searchFormValue = {} } = props;
    const { getRoutePath = () => '', getRouteParams = () => ({}) } = columns.value[columnIndex] || {};
    const routePath = getRoutePath(searchFormValue, row);
    const query = getRouteParams(searchFormValue, row);
    // 构造路由参数
    const url = `${routePath}?${objectToQueryParams(query)}`;
    go(url);
  };

  // 弹窗
  const handleDialog = ({ row, columnIndex }) => {
    dialogVisible.value = true;
    const columnOption = columns.value[columnIndex] || {};
    const { getQuery = () => {} } = columnOption;
    dialogCompo.value = columnOption.dialogCompo;
    dialogAttrs.value = columnOption.dialogAttrs || {};
    queryInfo.value = getQuery({
      row,
      searchFormValue: props.searchFormValue,
    });
  };

  // 对数据源处理（优化渲染
  const getData = dataSource => {
    return dataSource.map(item => {
      return {
        ...item,
        ...columns.value.reduce((pre, cur) => {
          const { field, slots = {}, formatValue = val => val } = cur;
          const { default: defaultSlot = '' } = slots;
          if (!field) return pre;
          if (defaultSlot === ECellSlotType.FORMAT_VALUE) {
            const value = formatValue(item[field]);
            return {
              ...pre,
              [field]: value,
            };
          }
          return {
            ...pre,
            [field]: item[field],
          };
        }, {}),
      };
    });
  };

  // 合并行单元格
  const getMergeRows = dataSource => {
    const mergeCells: any = [];
    columns.value.forEach((col, colIdx) => {
      const { field, isMergeRows } = col;
      if (isMergeRows) {
        let currentIdx = 0;
        let startRow = 0;
        let endRow = 0;
        while (currentIdx < dataSource.length) {
          const nextRowValue = dataSource[currentIdx + 1] && dataSource[currentIdx + 1][field];
          if (dataSource[currentIdx][field] !== nextRowValue) {
            const rowspan = endRow - startRow + 1;
            mergeCells.push({ row: startRow, col: colIdx, rowspan, colspan: 1 });
            startRow = currentIdx + 1;
          }
          endRow += 1;
          currentIdx++;
        }
      }
    });
    return mergeCells;
  };

  // 合并列单元格
  const getMergeCols = dataSource => {
    const mergeCells: any = [];
    dataSource.forEach((item, rowIdx) => {
      for (let currentIdx = 0; currentIdx < columns.value.length; currentIdx++) {
        const { field, isMergeCols } = columns.value[currentIdx];
        if (isMergeCols && field && item[field]) {
          let colspan = 1;
          let startCol = currentIdx;
          while (startCol < columns.value.length) {
            if (columns.value[startCol + 1]?.field && item[columns.value[startCol + 1]?.field] === item[field]) {
              colspan += 1;
            }
            startCol++;
          }
          mergeCells.push({ row: rowIdx, col: currentIdx, rowspan: 1, colspan });
          currentIdx += colspan - 1;
        }
      }
    });
    return mergeCells;
  };

  // 合并单元格
  const getMergeCells = (dataSource: any[] = []) => {
    return [...getMergeRows(dataSource), ...getMergeCols(dataSource)];
  };

  // 配置动态筛选
  const setColumnFilters = column => {
    const { filterMultiple, field } = column;
    if (filterMultiple) {
      const filterValues: string[] = uniq(
        props.dataSource.map(item => {
          return (field && item[field]) || '';
        }),
      );
      const options = filterValues.map(item => ({
        label: item,
        value: item,
      }));
      column['filters'] = options;
    }
    return column;
  };

  // 获取表尾数据
  const getFootData = () => {
    if (isEmpty(props.summaryInfo)) {
      return [];
    }
    const footData = [
      columns.value.reduce((pre, cur) => {
        const { field, formatValue = val => val } = cur;
        if (props.summaryInfo[field]) {
          return {
            ...pre,
            [field]: formatValue(props.summaryInfo[field]),
          };
        }
        return pre;
      }, {}),
    ];
    return footData;
  };

  // 监听表格数据变化
  watch(
    () => props,
    () => {
      if (isEmpty(props.dataSource)) return;
      nextTick(() => {
        // 对数据源处理（优化渲染
        allList.value = getData(props.dataSource);
        if (props.showPagination) {
          handlePageData();
        } else {
          gridOptions.data = getData(props.dataSource);
          // 获取合并格配置
          gridOptions.mergeCells = getMergeCells(gridOptions.data);
        }
      });
      // 配置动态筛选
      gridOptions.columns = columns.value.map(column => setColumnFilters(column));
      // 填充汇总数据
      gridOptions.footerData = getFootData();
    },
    { deep: true, immediate: true },
  );

  defineExpose({
    gridRef,
    columns: gridOptions.columns,
    data: gridOptions.data,
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table--render-default .vxe-table--footer-wrapper) {
    background: transparent !important;
  }
</style>
