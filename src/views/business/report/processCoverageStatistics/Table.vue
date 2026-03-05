<template>
  <Grid>
    <template #toolbar-actions>
      <a-button v-auth="'btn_batchExport'" @click="handleExport">
        {{ t('common.batchExport') }}
      </a-button>
    </template>
  </Grid>
  <ExportModal @register="registerExportModal" />
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useBaseStore } from '/@/store/modules/base';
  import { ProcCoverReportExportData } from '/@/api/business/processCoverageStatistics';

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
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const dictMap = computed<Record<string, string>>(() => {
    const list = baseStore.getDictionaryData('ProcessCoverageRequireType') || [];
    const m: Record<string, string> = {};
    list.forEach((d: any) => (m[d.enCode] = d.fullName));
    return m;
  });

  const columnsVxe = [
    { type: 'checkbox', width: 48, align: 'center' },
    {
      title: '工厂',
      field: 'factoryName',
      minWidth: 140,
      showOverflow: true,
      formatter: ({ row }: any) => {
        // const code = row.factoryCode || row.factory || '';
        const name = row.factoryName || '';
        return [name].filter(Boolean).join('/') || '--';
      },
    },
    {
      title: '需求类型',
      field: 'requireTypeName',
      minWidth: 160,
      showOverflow: true,
      formatter: ({ row }: any) => row.requireTypeName || dictMap.value[row.requirementType] || '--',
    },
    {
      title: '发起数量',
      field: 'initiatedQty',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '在办数量',
      field: 'inProgressQty',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '终止数量',
      field: 'overQty',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '结案数量',
      field: 'closeQty',
      minWidth: 110,
      formatter: ({ cellValue }: any) => (cellValue ?? 0).toString(),
    },
    {
      title: '结案率',
      field: 'closeRate',
      minWidth: 110,
      formatter: ({ cellValue }: any) => {
        if (cellValue == null || cellValue === '') return '--';
        const v = Number(cellValue);
        return (v <= 1 ? v * 100 : v).toFixed(2).replace(/\.00$/, '') + '%';
      },
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
    spanMethod,
    data: tableData.value,
    i18nConfig: {
      moduleCode: 'ProcessCoverageStatisticsColumn',
    },
  };

  const [Grid, { getFetchParams, setGridOptions }] = useVbenVxeGrid({
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
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      api: ProcCoverReportExportData,
      exportOptions: columnsVxe,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: { moduleCode: 'ProcessCoverageStatisticsColumn' },
    });
  }
</script>
