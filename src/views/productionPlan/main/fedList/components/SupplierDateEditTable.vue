<template>
  <div>
    <Grid>
      <template #action="{ row, rowIndex }">
        <TableAction outside :actions="getTableActions(row, rowIndex)" />
      </template>
    </Grid>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted, ref, watch, reactive } from 'vue';
  import { supplierDeliveryDateEditColumn, supplierDeliveryDateColumnEditRules } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { TableAction } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';

  //   defineOptions({ name: 'productionPlan-main-fedList-childList' });

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  const props = defineProps({
    tableData: { default: [] },
  });
  const emit = defineEmits(['refreshMainTableExpand']);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-supplierDeliveryDateList',
      columns: supplierDeliveryDateEditColumn,
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
      // rowConfig: {
      //   keyField: '_X_ROW_KEY',
      // },
      editRules: supplierDeliveryDateColumnEditRules,
      height: '',
    },
  });

  function getTableActions(row, rowIndex) {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.add2Text'),
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copy'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  onMounted(() => {
    if (props.tableData.length == 0) {
      addColumn(1);
    } else {
      gridApi.reloadData(props.tableData);
    }
  });

  /**
   * @description 删除整行
   * */
  function handleDelete(row) {
    const list = gridApi.getDataSource();
    if (list.length == 1) {
      createMessage.warning('不能删除');
      return;
    }
    gridApi.grid.remove(row);
    emit('refreshMainTableExpand');
  }
  /**
   * @description 新增
   * @param line 新增的行数
   * @param rowIndex 指定起增行
   * */
  function addColumn(line, rowIndex?: number) {
    const list = gridApi.getDataSource();
    if (typeof rowIndex == 'number') {
      list.splice(rowIndex + 1, 0, {
        _X_ROW_KEY: buildUUID(),
        supplierDeliveryDate: '',
        expectedDeliveryQty: '',
        deliverySpec: '',
        supplierRemark: '',
        inRemark: '',
      });
    } else {
      for (let i = 0; i < line; i++) {
        list.push({
          _X_ROW_KEY: buildUUID(),
          supplierDeliveryDate: '',
          expectedDeliveryQty: '',
          deliverySpec: '',
          supplierRemark: '',
          inRemark: '',
        });
      }
    }
    gridApi.grid.reloadData(list);
    emit('refreshMainTableExpand');
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = gridApi.getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    console.log('index', index);
    list.splice(index + 1, 0, item);
    gridApi.grid.reloadData(list);
    emit('refreshMainTableExpand');
    // 如果需要在指定位置插入，可以使用以下代码
    // gridApi.grid.insertAt(list, index + 1);
  }

  const childTableValidate = async () => {
    return await gridApi.validate(true);
  };

  const reloadChildTable = async data => {
    await gridApi.reloadData(data);
  };

  const getChildData = () => {
    return gridApi.getDataSource();
  };

  // watch(
  //   () => props.tableData,
  //   (val, old) => {
  //     gridApi.reloadData(val);
  //   },
  // );

  defineExpose({
    childTableValidate,
    reloadChildTable,
    getChildData,
  });
</script>
