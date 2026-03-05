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
  import { isEmpty } from 'lodash-es';
  import { onMounted, ref, watch } from 'vue';

  import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';

  // 定义 props
  const props = defineProps({
    args: {
      type: Object,
      default: () => ({}),
    },
    searchFormValue: {},
  });

  // 定义响应式数据
  const loading = ref(false);
  const filterOptions = ref([]); // 过滤器选项
  const { getParams } = useRouteParams();

  // 处理筛选变化
  const handleChange = () => {
    const { args } = props;
    if (args?.$grid) {
      // 修复查询状态
      const isChecked = !isEmpty(args.column.filters[0].data);
      args.$grid.updateFilterOptionStatus(args.column.filters[0], isChecked);
    }
  };

  onMounted(() => {
    const { args } = props;
    const { getDefaultFilterValues } = args.column.params;
    const params = getParams();
    args.column.filters[0].data = getDefaultFilterValues(params);
    handleChange();
  });

  watch(
    () => props.searchFormValue,
    async () => {
      const { args } = props;
      const { getFilters } = args.column.params;
      filterOptions.value = await getFilters(props.searchFormValue);
    },
    { immediate: true, deep: true },
  );
</script>

<style>
  .antd-multi-select-filter {
    padding: 8px;
    min-width: 200px;
  }
</style>
