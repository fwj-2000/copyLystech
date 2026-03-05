<!-- 异常表格 -->
<template>
  <div class="w-[100%] h-[100%]">
    <vxe-grid v-bind="gridOptions" class="w-[100%] h-[100%] bg-red table"></vxe-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';

  import { dataList } from './config';
  import type { VxeGridProps } from 'vxe-table';

  interface RowVO {
    id: number;
    name: string;
    role: string;
    sex: string;
    age: number;
    address: string;
  }

  interface IProps {
    params: Record<string, any>;
  }
  const reqData = ref<any[]>([]);
  const props = withDefaults(defineProps<IProps>(), {
    params: () => ({
      range: '30~60',
      type: '平板',
      id: 0,
    }),
  });

  const getTableData = (data: any) => {
    const { range = '60~80', type = '平板' } = props.params;
    const res = data.filter(item => {
      if (type === '综合') return item['范围'] === range;
      return item['范围'] === range && item['类型'] === type;
    });
    return res;
  };

  const gridOptions = reactive<VxeGridProps<RowVO>>({
    border: 'inner',
    columnConfig: {
      resizable: true,
    },
    rowConfig: {
      height: 32,
    },
    height: '100%',
    headerCellStyle: () => {
      return {
        backgroundColor: '#050b23',
        color: '#ffffff',
      };
    },
    rowStyle: () => {
      return {
        backgroundColor: '#050b23',
        color: '#ffffff',
      };
    },
    cellStyle: () => {
      return {
        backgroundColor: '#050b23',
        color: '#ffffff',
      };
    },
    columns: [
      { field: 'seq', type: 'seq', width: 70 },
      { field: '线体', title: '线体' },
      { field: '类型', title: '类型' },
      { field: '稼动率', title: '稼动率' },
    ],
    data: getTableData(reqData.value),
  });

  watch(
    () => props.params.id,
    () => {
      const url = dataList[props.params.id];
      fetch(url)
        .then(response => response.json())
        .then(data => {
          gridOptions.data = getTableData(data);
        })
        .catch(error => console.error('Error:', error));
    },
    { immediate: true, deep: true }, // 立即执行
  );
</script>

<style>
  /* 修改“暂无数据”背景色 */
  .vxe-table--body-wrapper {
    background-color: rgb(5 11 35) !important;
  }

  .vxe-table--border-line {
    display: none !important;
  }

  .vxe-header--gutter {
    position: relative;
    background-color: rgb(5 11 35) !important;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 48px;
      width: 25px;
      background-color: rgb(5 11 35);
      border-bottom: 1px solid #fff;
    }
  }
</style>
