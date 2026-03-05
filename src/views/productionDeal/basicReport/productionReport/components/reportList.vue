<template>
  <Grid>
    <template #Time="{ row, column }"> {{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD HH:mm:ss') : '' }} </template>
    <template #Date="{ row, column }">{{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD') : '' }} </template>
  </Grid>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getReportworkpage } from '/@/api/productionDeal/productionReport';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { useTallyModel } from '/@/views/productionDeal/dieCut/dieCuttingTally/hooks/useTallyModel';
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
    const { getTableColumns } = useTallyModel({ workType: '', operationType: 'ApplyWork', orgId: '' });
    const columns = (await getTableColumns()).map(item => {
      return {
        ...item,
        field: item.dataIndex,
      };
    });
    columns.forEach(item => {
      if (['DictType', 'ApiType', 'Personnel', 'Organize'].includes(procRuleTempEnum[item.dataType])) {
        item.field = item.field + 'Name';
      }
      if (item.field === 'labelStatus') {
        item.cellRender = {
          name: 'Tag',
          options: [
            { id: 0, theme: 'gray', color: '#999999', fullName: '/', rowKey: 'labelStatusName' },
            // 待转出
            { id: 1, theme: 'gray', color: '#999999', fullName: t('dict.CommonCol.toBeTransferredOut'), rowKey: 'labelStatusName' },
            // 生产开工
            { id: 2, theme: 'green', color: '#52C41A', fullName: t('dict.startWorkStatus.2'), rowKey: 'labelStatusName' },
            // 已接收
            { id: 3, theme: 'blue', color: '#1890ff', fullName: t('dict.CommonCol.received'), rowKey: 'labelStatusName' },
          ],
        };
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
      id: 'productionDeal-basicReport-productionReport-reportList',
      columns: [],
      api: getReportworkpage,
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
