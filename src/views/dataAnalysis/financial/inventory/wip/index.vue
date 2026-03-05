<!-- WIP统计 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction :formParams="formParams" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, computed } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  import type { VxeGridProps } from 'vxe-table';
  import { getInventoryMakingindex } from '/@/api/dataAnalysis/financial';
  import { sortByFieldOrder } from '/@/views/dataAnalysis/utils';
  // import dayjs from 'dayjs';
  import ToolBarAction from './ToolBarAction.vue';

  defineOptions({ name: 'dataAnalysis-financial-inventory-wip' });

  const getRowClassName = getRowClassNameFuncByGroupKey('FactoryName');
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-wip-list',
    rowClassName: getRowClassName,
  });
  let columns = ref(getAllColumns(''));
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `结单率车间明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getInventoryMakingindex,
      formatFrontData: data => {
        const sortOrder = [
          'Total',
          '平湖一厂',
          '平湖二厂',
          '平湖三厂',
          '平湖五厂',
          '平湖六厂',
          '平湖七厂',
          '平湖九厂',
          '东台模切制二厂',
          '东台模切制三厂',
          '成都模切',
          '东台模切',
          '苏州模切',
          '郑州模切',
          '越南模切',
        ];
        let dataList = sortByFieldOrder(data, 'FactoryName', sortOrder).reduce((pre, cur) => {
          return pre.concat(cur.List);
        }, []);
        dataList = dataList.map(item => {
          const { OutValKey, ...res } = item;
          return {
            ...res,
            OutKey: OutValKey.keys ?? '',
            OutValue: OutValKey.values ?? '',
          };
        });
        let timeArr = dataList.map(item => item.OutKey).filter(item => item);
        const time = timeArr[0];
        columns.value = getAllColumns(time);
        return dataList;
      },
    },
  });

  const formParams = () => {
    const { getFormParams } = api.searchFormApi;
    let res = getFormParams();
    // 添加安全检查，防止运行时错误
    if (res && typeof res.orgCode === 'string' && res.orgCode.length >= 2) {
      res.orgCode = res.orgCode.substring(0, 2);
    } else if (res) {
      // 如果 orgCode 不存在或长度不足，设置为空字符串或其他默认值
      res.orgCode = res.orgCode || '';
    }

    return res;
  };
  // onMounted(() => {
  //   const { state } = api.searchFormApi;

  //   watch(
  //     () => state.searchFormValue.week,
  //     value => {
  //       const formattedWeek = value ? 'WK' + dayjs(value).isoWeek().toString().padStart(2, '0') : '';
  //       api.forceUpdate();
  //       columns.value = getAllColumns(formattedWeek ?? '');
  //     },
  //     { deep: true },
  //   );
  // });
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');

  .no-border {
    border: none !important;
  }
</style>
