<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="type == 'add' ? t('common.add2Text') : t('common.editText')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <Grid>
      <template #toolbar-actions>
        <Subtitle :title="t('dict.Module.PrOrder')" placement="vxe" :extra="{ show: type == 'add' }" @addColumn="handleAddColumn" />
      </template>
      <template #action="{ row, $rowIndex }">
        <TableAction outside :actions="getTableActions(row, $rowIndex)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getEditColumn, editRules, PR_TABLE_ROW_DATA } from '../config';
  import { TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { Subtitle } from '/@/components/Subtitle';
  import { buildUUID } from '/@/utils/uuid';
  import { addPRprorder, updatePRprorder } from '/@/api/mps/productionPlan/MPS';
  import { getWeekDays } from '../weekTime';
  import dayjs from 'dayjs';
  const { t } = useI18n();

  const emits = defineEmits(['reload']);

  const btnLoading = ref(false);
  const searchDate = ref('');
  const type = ref('add');
  const rows = ref([]);
  const orderType = ref(2);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-PRList-edit',
      columns: [],
      showIndexColumn: true,
      // i18nConfig: {
      //   moduleCode: 'NpiShipmentOnlineColumn',
      // },
      toolbarConfig: {
        refresh: false,
      },
      customConfig: {
        allowVisible: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      // mouseConfig: {
      //   area: true, // 是否开启区域选取
      // },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      pagerConfig: {
        autoHidden: true,
      },
      editRules,
    },
  });

  // 操作
  function getTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.add2Text'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row, index),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy text-orange-400 cursor-pointer mx-1',
        // auth: 'btn_detail',
        tooltip: t('common.copy'),
        onClick: handleChangeTable.bind(null, 'copy', row, index),
      },
      {
        icon: 'icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1',
        // auth: 'btn_detail',
        tooltip: t('common.delText'),
        onClick: handleChangeTable.bind(null, 'delete', row, index),
      },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', row, index) {
    const tableData = gridApi.getDataSource();
    switch (type) {
      case 'addBaseIndex':
        tableData.splice(index + 1, 0, cloneDeep({ ...PR_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID() }));
        gridApi.grid.reloadData(tableData);
        break;
      case 'copy':
        tableData.splice(index + 1, 0, cloneDeep({ ...row, _X_ROW_KEY: buildUUID(), id: '' }));
        gridApi.grid.reloadData(tableData);
        break;
      case 'delete':
        gridApi.grid.remove(row);
        break;
      case 'update':
        break;
    }
  }

  // 添加行
  const handleAddColumn = n => {
    for (let i = 0; i < n; i++) {
      gridApi.grid.insertAt(cloneDeep({ ...PR_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID() }), -1);
    }
  };

  const updateColumnsForOrderType = (columns, orderType) => {
    if (orderType == 1) {
      // 创建深拷贝
      const updatedColumns = cloneDeep(columns);

      // 更新 nWeekDemand 字段
      const nWeekDemandCol = updatedColumns.find(col => col.field === 'nWeekDemand');
      if (nWeekDemandCol && nWeekDemandCol.editRender) {
        nWeekDemandCol.editRender.enabled = false;
      }

      // 更新 purchaseQuantity 字段
      const purchaseQuantityCol = updatedColumns.find(col => col.field === 'purchaseQuantity');
      if (purchaseQuantityCol && purchaseQuantityCol.editRender) {
        purchaseQuantityCol.editRender.enabled = false;
      }
      return updatedColumns;
    }

    return columns;
  };

  async function init(data) {
    searchDate.value = data.searchDate;
    type.value = data.type;
    rows.value = data.rows;
    orderType.value = data.orderType;
    const weeks = getWeekDays(searchDate.value);
    weeks.unshift({
      title: '备库存',
      field: 'reserveStock',
      width: 80,
      editRender: {
        name: 'InputNumber',
        min: 0,
        thousands: true,
      },
    });
    const dataList = getEditColumn(type.value).map(item => {
      if (item.field === 'time') {
        return {
          ...item,
          children: weeks,
        };
      } else {
        return { ...item };
      }
    });
    if (type.value == 'add') {
      gridApi.reloadColumn(dataList);
      setTimeout(() => {
        console.log('默认新增一行');
        gridApi.grid.insertAt(cloneDeep({ ...PR_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID() }), -1);
      }, 300);
    } else {
      const finalColumns = updateColumnsForOrderType(dataList, orderType.value);
      gridApi.reloadColumn(finalColumns);
      gridApi.grid.reloadData(rows.value);
    }
  }

  const handleResponse = async apiPromise => {
    changeLoading(true);
    const { code, msg } = await apiPromise.finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
    } else {
      createMessage.error(msg);
    }
  };
  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const weeksDayjs = dayjs(searchDate.value);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    if (type.value == 'add') {
      await handleResponse(addPRprorder({ createDate: yearWeekFormat, Items: gridApi.getDataSource() }));
    } else {
      await handleResponse(updatePRprorder({ items: gridApi.getDataSource() }));
    }
  }
</script>
<style lang="scss" scoped>
  .title-box {
    padding: 20px 20px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-stick {
      display: flex;
      align-items: center;

      .gun {
        border-radius: 2px;
        background: #ff7b00;
        width: 2px;
        height: 14px;
        margin-right: 10px;
      }

      .title {
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
      }
    }
  }
</style>
