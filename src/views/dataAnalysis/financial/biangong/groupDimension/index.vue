<!-- 维度分组页面 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <ToolBarAction :dataSource="dataSource" :formParams="formParams" :SyOrganization="SyOrganization" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { ref, reactive, watch, onMounted, computed, toRaw } from 'vue';
  import { getAllColumns, formOptions, filterOptions, SyOrganization } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimension, getDimensionWordNoSearchparameter } from '/@/api/dataAnalysis/financial';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import type { VxeGridProps } from 'vxe-table';
  import ToolBarAction from './ToolBarAction.vue';

  defineOptions({ name: 'dataAnalysis-financial-biangong-groupDimension' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-groupDimension-list',
    rowClassName: getRowClassNameFuncByGroupKey('category'),
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: true,
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `维度分组_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getDimension,
    },
  });
  const dataSource = computed(() => {
    try {
      const cacheInfo = api.getCacheInfo();
      //简化数据
      const list = Array.isArray(cacheInfo?.result?.data) ? cacheInfo.result.data : [];
      const ITEMS_PER_GROUP = 6;
      const filteredItems = transformData(list.filter(item => item.metric === '实际%'));
      // 将数据分组
      let groups: any[][] = [];
      for (let i = 0; i < filteredItems.length; i += ITEMS_PER_GROUP) {
        groups.push(toRaw(filteredItems).slice(i, i + ITEMS_PER_GROUP));
      }
      // 重新排序
      groups = reorderCategories(groups);
      return groups;
    } catch (error) {
      console.error('获取缓存信息失败:', error);
      return [];
    }
  });
  const formParams = () => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams();
  };

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
    watch(
      [() => state.searchFormValue.dateRange, () => state.searchFormValue.dimension],
      () => {
        if (!isEmpty(state.searchFormValue)) {
          state.searchFormValue.date = state.searchFormValue.dateRange[0]; // 解决ui层没动态变化
        }
      },
      { immediate: true, deep: true },
    );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim } = getFormParams();
    getDimensionWordNoSearchparameter({
      orgCode,
      startDim,
      endDim,
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

  const transformData = data => {
    return data.map(item => {
      const newItem = { ...item };

      // 处理维度类型数据
      if (item.dimesionType && Array.isArray(item.dimesionType)) {
        item.dimesionType.forEach((dim, index) => {
          newItem[`dimesionType_keys_${dim.keys}`] = dim.values;
        });
      }

      // 处理值列表数据
      let cumulativeIndex = -1;

      if (item.vList && Array.isArray(item.vList)) {
        item.vList.forEach((v, index) => {
          if ('values' in v) {
            newItem[`vList_keys_${v.keys}`] = v.values;
            // newItem[`vList_keys_${index}_${v.keys}`] = v.values;
          }

          // 识别"累计"项的位置
          if (v.keys === '累计') {
            cumulativeIndex = index;
          }
        });

        // 根据累计位置提取前后时间值
        if (cumulativeIndex !== -1) {
          // 提取"累计"项前一项的时间
          if (cumulativeIndex > 0) {
            const prevItem = item.vList[cumulativeIndex - 1];
            newItem.preTime = prevItem.keys;
          }

          // 提取"累计"项后一项的时间
          if (cumulativeIndex < item.vList.length - 1) {
            const nextItem = item.vList[cumulativeIndex + 1];
            newItem.nextTime = nextItem.keys;
          }
        }
      }

      return newItem;
    });
  };

  function reorderCategories(data) {
    // 定义目标顺序的类别列表
    const targetOrder = ['边贡', '损耗', '材料', '人工', '模切', '手工'];

    // 遍历每个厂区数组
    return data.map(factoryData => {
      // 创建新数组，按目标顺序排序
      return targetOrder.map(category => {
        // 查找当前类别的数据对象
        return factoryData.find(item => item.category === category);
      });
    });
  }
</script>

<style lang="less" scoped>
  /* 下降箭头  */
  :deep(.text-after-icon) {
    .vxe-cell::after {
      content: ' ↓';
      color: red;
      font-weight: bold;
      font-size: 30px;
    }
  }

  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
