<template>
  <Grid>
    <template #toolbar-actions>
      <a-button v-auth="'btn_batchExport'" @click="handleExport">
        {{ t('common.batchExport') }}
      </a-button>
    </template>
  </Grid>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useBaseStore } from '/@/store/modules/base';
  import { ProcCoverReportExportData } from '/@/api/business/processCoverageStatistics';
  import { getStatisticsExportExcel } from '/@/api/engineering/report';

  const emit = defineEmits(['export']);

  const props = defineProps<{
    rows: Array<{
      factory: string;
      factoryCode: string;
      factoryName: string;
      requirementType: number | string;
      requireTypeName: string;
      initiatedQty?: number | null;
      inProgressQty?: number | null;
      overQty?: number | null;
      closeQty?: number | null;
      closeRate?: number | null;
    }>;
  }>();

  const baseStore = useBaseStore();
  const { t } = useI18n();

  const columnsVxe = [
    { type: 'checkbox', width: 48, align: 'center' },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      minWidth: 140,
      showOverflow: true,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      minWidth: 140,
      showOverflow: true,
    },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '回复面积(M2)',
      field: 'replyArea',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '达标率',
      field: 'complianceRate',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toFixed(2) + '%',
    },
  ];

  // 工厂列合并
  function spanMethod({ row, column, rowIndex, data }: any) {
    if (column.field !== 'factoryName') return;
    const curr = row.factoryName;
    let rowspan = 1;
    for (let i = rowIndex + 1; i < data.length; i++) {
      if (data[i].factoryName === curr) rowspan++;
      else break;
    }
    if (rowIndex > 0 && data[rowIndex - 1].factoryName === curr) {
      return { rowspan: 0, colspan: 0 };
    }
    return { rowspan, colspan: 1 };
  }

  const tableData = computed(() => props.rows ?? []);

  const gridOptions = {
    showIndexColumn: true,
    height: 'auto',
    columns: columnsVxe,
    // spanMethod,
    data: tableData.value,
    i18nConfig: {
      moduleCode: 'ProcessCoverageStatisticsColumn',
    },
  };

  const [Grid, { setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      ...gridOptions,
      id: 'business-report-processCoverageStatistics',
    },
  });

  // 保证 props 变化时更新表格数据
  watch(
    () => props.rows,
    val => {
      setGridOptions?.({ data: val ?? [] });
    },
    { deep: true },
  );

  async function handleExport() {
    // const values = await getFetchParams();
    // console.log(values, 'values');

    // openExportModal(true, {
    //   listQuery: {
    //     ...(await getFetchParams()),
    //   },
    //   api: getStatisticsExportExcel,
    //   exportOptions: columnsVxe,
    //   nameProps: 'title',
    //   idProps: 'field',
    //   i18nConfig: { moduleCode: 'ProcessCoverageStatisticsColumn' },
    // });
    emit('export', {
      api: getStatisticsExportExcel,
      exportOptions: columnsVxe,
      nameProps: 'title',
      idProps: 'field',
    });
  }
</script>

<style scoped lang="scss"></style>
