<template>
  <div class="">
    <Grid>
      <!-- <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template> -->
    </Grid>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted, ref, watch } from 'vue';
  import { childColumn, childColumnEditRules } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { TableAction } from '/@/components/Table';

  //   defineOptions({ name: 'productionPlan-main-fedList-childList' });

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const props = defineProps({
    tableData: { default: [] },
  });
  const emit = defineEmits(['refreshMainTableExpand']);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-childList',
      columns: childColumn,
      // api: poOrderList,
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
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
      height: '',
      editRules: childColumnEditRules,
      // data: props.tableData,
    },
  });

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: deleteOP.bind(null, row),
      },
    ];
  }

  function deleteOP(row) {
    const index = props.tableData.findIndex(item => item.id === row.id);
    if (index !== -1) {
      props.tableData.splice(index, 1);
    }
    gridApi.reloadData(props.tableData);
    emit('refreshMainTableExpand');
  }

  onMounted(() => {
    gridApi.reloadData(props.tableData);
  });

  watch(
    () => props.tableData,
    (val, old) => {
      gridApi.reloadData(val);
    },
  );

  const childTableValidate = async () => {
    return await gridApi.validate(true);
  };

  const reloadChildTable = async data => {
    await gridApi.reloadData(data);
  };

  defineExpose({
    childTableValidate,
    reloadChildTable,
  });
</script>
