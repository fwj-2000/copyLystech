<template>
  <bomGrid></bomGrid>
</template>
<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const props = defineProps({
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });
  const [bomGrid, $grid] = useVbenVxeGrid({
    gridOptions: {
      id: 'materialRequirement-deliveryDate-bomlist',
      data: props.list,
      height: '400',
      cellStyle: ({ row, column }) => {
        if (column.field == 'sfpNumber') {
          if (row.levelNumber) {
            const len = Math.max(row.levelNumber - 2, 0);
            return {
              paddingLeft: `${len * 10}px`,
            };
          }
        }
      },
      columns: [
        {
          title: '产品内部料号',
          field: 'innerMaterialNumber',
          width: 180,
        },
        {
          title: '半成品料号',
          field: 'sfpNumber',
          width: 180,
        },
        {
          title: '材料料号',
          field: 'originPartNumber',
          width: 180,
        },
        {
          title: '步距组号',
          field: 'stepDistanceNumber',
          width: 80,
        },
        {
          title: '材料八码',
          field: 'shortMaterialCode',
          width: 100,
        },
        {
          title: '宽度(MM)',
          field: 'width',
          width: 100,
        },
        {
          title: '出货材料',
          field: 'shippingMaterials',
          width: 120,
        },
        {
          title: '备料信息',
          field: 'preparationMaterials',
          width: 120,
        },
        {
          title: '描述',
          field: 'materialDesc',
          width: 200,
        },
        {
          title: '用量倍数',
          field: 'materialDosage',
          width: 80,
        },
        {
          title: '用量/KPCS',
          field: 'qty',
          width: 120,
        },
        {
          title: '工单用量(KPCS)',
          field: 'workOrderQty',
          width: 120,
        },
        {
          title: '单位',
          field: 'unit',
          width: 100,
        },
        {
          title: '备注',
          field: 'materialRemarks',
          i18nField: 'CommonCol.remark',
          editRow: true,
          width: 200,
        },
      ],
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
      position: 'modal',
    },
  });

  async function init({ detailApi }) {
    const r = await detailApi();
    $grid.reloadData(r.data);
  }

  defineExpose({
    init,
  });
</script>
