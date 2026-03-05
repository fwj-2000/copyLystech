<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getShipmentindex } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'warehouseKanban-shipmentindex' });
  // const orgCodeList = {}; //key 厂区名 value 厂区码
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-warehouseKanban-shipmentindex-list',
    // filterConfig: {
    //   remote: true,
    // },
  });

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
        const filename = `分仓发货-${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getShipmentindex,
      // api: async params => {
      //   const { factory, ...res } = params; //factory: "平湖一厂"  或者 factory: "平湖一厂;平湖二厂"

      //   const getFactoryList = (factoryInput: string | undefined) => {
      //     if (!factoryInput) return [];
      //     return factoryInput.split(';').map(item => orgCodeList[item.trim()] ?? '');
      //   };
      //   const factoryList = getFactoryList(factory);

      //   return await getShipmentindex({ orgCode: factoryList.join(';'), ...res });
      // },
      // formatFrontData(data) {
      //   data.forEach(item => {
      //     const { factory, orgCode } = item;
      //     orgCodeList[factory] = orgCode;
      //   });
      //   return data;
      // },
    },
  });
</script>

<style lang="less" scoped></style>
