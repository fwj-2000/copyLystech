<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useTable } from '/@/components/Table';
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import BasicTable from '../../../../../components/Table/src/BasicTable.vue';
  import { getChangeHistoryColumns } from '/@/views/engineering/pcc/pccApply/CONFIG';

  const { t } = useI18n();

  const state = reactive({
    packageSpecQty: 0,
    shipPattern: 'R',
  });

  // 变更履历
  const [
    registerChangeHistoryTable,
    {
      setTableData: setChangeHistoryTableData,
      getDataSource: getChangeHistoryDataSource,
      setCacheColumnsByField: setChangeHistoryCacheColumnsByField,
      updateTableDataRecord: updateChangeHistoryTableDataRecord,
      updateTableData: updateChangeHistoryTableData,
      insertTableDataRecord: insertChangeHistoryTableDataRecord,
      deleteTableDataRecord: deleteChangeHistoryTableDataRecord,
    },
  ] = useTable({
    columns: getChangeHistoryColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: false,
    isCanResizeParent: true,
    canResize: false,
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });
  defineExpose({
    setChangeHistoryTableData,
    getChangeHistoryDataSource,
  });
</script>

<template>
  <a-card class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
    <Subtitle :title="t('dict.PCCApplyColumn.changeHistory')" id="changeResume" />
    <BasicTable @register="registerChangeHistoryTable"></BasicTable>
  </a-card>
</template>

<style lang="less" scoped>
  :deep(.lydc-basic-table) {
    & > div {
      margin: 0;
    }
  }
</style>
