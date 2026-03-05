<template>
  <Grid>
    <template #status="{ row }">
      <LydcTag v-if="row.status" :theme="STARTWORKSTATUS_OPTIONS[row.status]?.theme" :text="row.statusName"></LydcTag>
    </template>
  </Grid>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getReceivepage } from '/@/api/productionDeal/productionReport';
  import { STARTWORKSTATUS_OPTIONS } from '/@/views/productionDeal/dieCut/prePrint/const';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const props = defineProps({
    state: {
      type: Object,
      default: () => ({ workOrderNo: '', nodeId: '' }),
    },
  });

  const columns = [
    {
      title: '工单号',
      field: 'workOrderNo',
      minWidth: 120,
    },
    {
      title: '内部料号',
      field: 'productCode',
      width: 120,
    },
    {
      title: '工单数量',
      field: 'workOrderQuantity',
      width: 120,
    },
    {
      title: '线体',
      field: 'lineCodeName',
      width: 120,
    },
    {
      title: '厂别号',
      field: 'factoryName',
      width: 120,
    },
    {
      title: '数量',
      field: 'quantity',
      width: 120,
    },
    {
      title: '机台',
      field: 'machineNo',
      width: 120,
    },
    {
      title: '状态',
      field: 'status',
      width: 120,
      // cellRender: {
      //   name: 'Tag',
      //   options: [
      //     { id: 0, theme: 'gray', rowKey: 'statusName' },
      //     { id: 1, theme: 'gray', rowKey: 'statusName' },
      //     { id: 2, theme: 'blue', rowKey: 'statusName' },
      //     { id: 3, theme: 'yellow', rowKey: 'statusName' },
      //     { id: 4, theme: 'green', rowKey: 'statusName' },
      //   ],
      // },
      slots: { default: 'status' },
    },
    {
      title: '操作员',
      field: 'operatorName',
      width: 160,
    },
    {
      title: '班次',
      field: 'classesName',
      width: 90,
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      width: 160,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 140,
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-productionReport-receiveMaterialList',
      columns,
      api: getReceivepage,
      showIndexColumn: true,
      height: 350,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      // },
      toolbarConfig: {
        enabled: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...props.state,
        };
      },
    },
  });

  defineExpose({ reload });
</script>
