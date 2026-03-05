<template>
  <Grid>
    <template #Status="{ row }">
      <LydcTag v-if="row.status" :theme="STARTWORKSTATUS_OPTIONS[row.status]?.theme" :text="row.statusName"></LydcTag>
    </template>
    <template #Time="{ row, column }"> {{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD HH:mm:ss') : '' }} </template>
    <template #Date="{ row, column }">{{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD') : '' }} </template>
  </Grid>
</template>
<script lang="ts" setup>
  import { unref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getStartworkpage } from '/@/api/productionDeal/productionReport';
  import { usePrePrintModel } from '/@/views/productionDeal/dieCut/prePrint/hooks/usePrePrintModel';
  import { SharePageType, STARTWORKSTATUS_OPTIONS } from '/@/views/productionDeal/dieCut/prePrint/const';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const props = defineProps({
    state: {
      type: Object,
      default: () => ({ workOrderNo: '', nodeId: '' }),
    },
  });

  const getColumns = async () => {
    const { getTableColumns } = usePrePrintModel({
      pageType: unref(SharePageType.StartWork),
      operationType: unref('PrePrint'),
      orgId: unref(''),
    });
    let columns = (await getTableColumns()).map(item => {
      return {
        ...item,
        field: item.dataIndex,
      };
    });
    columns.forEach(item => {
      if (['DictType', 'ApiType', 'Personnel', 'Organize'].includes(procRuleTempEnum[item.dataType])) {
        item.field = item.field + 'Name';
      }
      if (item.field === 'status') {
        item.slots = { default: 'Status' };
      }
      if (item.field.includes('Time')) {
        item.slots = { default: 'Time' };
      }
      if (item.field.includes('Date')) {
        item.slots = { default: 'Date' };
      }
    });
    return columns || [];
  };

  const [Grid, { reload, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-productionReport-startList',
      columns: [],
      api: getStartworkpage,
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

  const reloadTable = async () => {
    const columns = await getColumns();

    reloadColumn(columns);
    reload();
  };

  defineExpose({ reloadTable });
</script>
