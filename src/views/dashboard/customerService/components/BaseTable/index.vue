<!-- 表格组件二次封装（供FC交付中心用 -->
<template>
  <div class="w-[100%] h-[100%]" style="overflow: hidden">
    <!-- 报表表格 -->
    <Grid>
      <template #loading>
        <a-spin />
      </template>
      <template #empty>
        <emptyData></emptyData>
      </template>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
  import { watch, computed } from 'vue';
  import { debounce } from '/@/utils/debounce';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  import type { ComputedRef } from 'vue';
  import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';

  const props = defineProps({
    columns: {
      type: Array as PropType<VxeGridPropTypes.Columns>,
      default: () => [],
    },
    attrs: {
      type: Object as PropType<VxeGridProps<any>>,
      default: () => ({}),
    },
  });

  interface IGridOptions extends VxeGridProps {
    pagerConfig?: VxeGridPropTypes.PagerConfig;
  }

  const gridOptions: ComputedRef<IGridOptions> = computed(() => {
    return {
      border: true,
      autoResize: true,
      loading: false,
      height: '100%',
      size: 'mini',
      pagerConfig: {
        currentPage: 1,
        pageSize: 50,
      },
      rowConfig: {
        height: 32,
      },
      resizeConfig: {
        refreshDelay: 0,
      },
      toolbarConfig: {
        custom: false,
        refresh: false,
      },
      scrollY: {
        gt: 200,
        enabled: true,
      },
      columns: props.columns,
      ...props.attrs,
    } as IGridOptions;
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: gridOptions.value,
  });
  const { reload } = gridApi;

  // 防抖重新加载表格
  const reloadData = () => {
    reload();
  };
  const reloadDataDebounce = debounce(reloadData, 500);

  watch(
    () => gridOptions.value,
    () => {
      gridApi.setState({
        gridOptions: gridOptions.value,
      });
    },
    { deep: true },
  );

  defineExpose<{
    reloadData: () => void;
    reloadDataDebounce: () => void;
  }>({
    reloadData,
    reloadDataDebounce,
  });
</script>
