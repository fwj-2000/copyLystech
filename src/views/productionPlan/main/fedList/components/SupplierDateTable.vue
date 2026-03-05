<template>
  <div>
    <Grid> </Grid>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted, ref, watch, reactive } from 'vue';
  import { supplierDeliveryDateColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';

  //   defineOptions({ name: 'productionPlan-main-fedList-childList' });

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  const props = defineProps({
    tableData: { default: [] },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-supplierDeliveryDateList',
      columns: supplierDeliveryDateColumn,
      // api: poOrderList,
      i18nConfig: {
        moduleCode: 'FeedListColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      height: '',
    },
  });

  onMounted(() => {
    gridApi.reloadData(props.tableData);
  });

  const reloadChildTable = async data => {
    await gridApi.reloadData(data);
  };

  const getChildData = () => {
    return gridApi.getDataSource();
  };

  defineExpose({
    reloadChildTable,
    getChildData,
  });
</script>
