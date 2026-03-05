<template>
  <div class="antd-multi-select-filter">
    <a-select
      v-model:value="args.column.filters[0].data"
      mode="multiple"
      show-search
      allowClear
      :maxTagCount="3"
      placeholder="请选择"
      style="width: 100%"
      @change="handleChange"
      :options="filterOptions"
      :loading="loading">
    </a-select>
  </div>
</template>

<script setup lang="ts">
  import { isEmpty, uniq } from 'lodash-es';
  import { watch, ref, unref, computed } from 'vue';

  // 定义 props
  const props = defineProps({
    args: {
      type: Object,
      default: () => ({}),
    },
  });

  // 定义响应式数据
  const loading = ref(false);

  // 过滤后的选项
  const filterOptions = computed(() => {
    const { args } = props;
    if (args?.$grid) {
      const tableData = args?.$grid?.getTableData();
      const visibleDataCellValue = tableData?.visibleData?.map(row => row[args.column.field]) ?? [];
      return uniq(visibleDataCellValue).map(value => {
        return {
          label: value,
          value,
        };
      });
    }
  });

  // 处理筛选变化
  const handleChange = () => {
    const { args } = props;
    if (args?.$grid) {
      // 修复查询状态
      const isChecked = !isEmpty(args.column.filters[0].data);
      args.$grid.updateFilterOptionStatus(args.column.filters[0], isChecked);
    }
  };

  watch(
    () => props.args.column.field,
    () => {
      // 挂载过滤方法
      props.args.column.filterMethod = ({ ...args }) => {
        const { cellValue, option } = args;
        const { data } = unref(option);
        return data.includes(cellValue);
      };
    },
    { deep: true, immediate: true },
  );
</script>

<style>
  .antd-multi-select-filter {
    padding: 8px;
    min-width: 200px;
  }
</style>
