<template>
  <div class="h-full">
    <Grid>
      <template #action="{ row, rowIndex }">
        <TableAction :actions="getTableActions(row, rowIndex)" />
      </template>
    </Grid>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { ADD_COLUMNS } from './config';
  import { buildBitUUID } from '/@/utils/uuid';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import type { VxeGridPropTypes } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { getProcesslist } from '/@/api/purchase/outsourcemanage';
  import { getSupplierlist } from '/@/api/engineering/mould';
  import { getDetailbydocumentnumber } from '/@/api/productionDeal/dieCutPerPrint';
  import { getListbyfactory } from '/@/api/warehouse/warehouse';

  const props = defineProps({
    dataSource: {
      type: Array,
    },
  });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any[];
    fileList: any[];
    processList: [];
    supplierList: [];
    productTypelist: [];
    innermaterialnumberList: [];
  }

  const state = reactive<State>({
    mouldNo: '',
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    tableData: [],
    fileList: [],
    processList: [],
    supplierList: [],
    productTypelist: [],
    innermaterialnumberList: [],
  });

  const gridOptions: VxeGridProps = {
    id: 'warehouseManagement-warehousing-add-table',
    showIndexColumn: true,
    keepSource: true,
    data: [],
    columns: [],
    height: '100%',
    editConfig: {
      trigger: 'click',
      mode: 'row',
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      enabled: false,
    },
    pagerConfig: {
      enabled: false,
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  gridApi.setGridOptions({
    columns: buildColumns(),
  });

  watch(
    () => props.dataSource,
    newVal => {
      const list = Array.isArray(newVal) ? cloneDeep(newVal) : [];
      loadTableData(list);
    },
    { immediate: true },
  );

  onMounted(() => {
    selectListInitFn();
  });

  function buildColumns(): VxeGridPropTypes.Columns {
    const columns = ADD_COLUMNS.map(item => convertToVxeColumn(item));
    columns.push({
      title: t('common.checkOperationText'),
      field: 'action',
      width: 90,
      fixed: 'right',
      slots: { default: 'action' },
    });
    return columns as VxeGridPropTypes.Columns;
  }

  function convertToVxeColumn(column: any) {
    const config: Record<string, any> = {
      title: column.title,
      field: column.dataIndex,
    };
    if (column.width) config.width = column.width;
    if (column.minWidth) config.minWidth = column.minWidth;
    const editRender = createEditRender(column);
    if (editRender) {
      config.editRender = editRender;
    }
    if (column.dataIndex === 'warehouseCode') {
      config.formatter = 'ASelect';
    } else if (['ApiSelect', 'CustomUserSelect'].includes(column.cpmType)) {
      config.formatter = column.cpmType;
    }
    return config;
  }

  function createEditRender(column: any) {
    const { dataIndex, cpmType, cpmSetting = {}, inputType } = column;
    const baseProps = { placeholder: t('common.inputText'), ...cpmSetting };

    if (dataIndex === 'transformTag') {
      return {
        name: 'Input',
        props: {
          ...baseProps,
          onChange: (e: any, params: any) => handleTransformTagChange(e?.target?.value, params),
          onKeydown: (e: KeyboardEvent, params: any) => handleTransformTagKeydown(e, params),
        },
      };
    }

    if (dataIndex === 'warehouseCode') {
      return {
        name: 'ASelect',
        dynamicOptionsField: 'warehouseCodeOptions',
        props: {
          ...baseProps,
          fieldNames: {
            value: 'shippingSpaceCode',
            label: 'shippingSpaceCode',
          },
          onDropdownVisibleChange: (visible: boolean, params: any) => {
            if (visible) {
              handleWarehouseCode(params.row);
            }
          },
          onChange: (value: string, _option: any, params: any) => {
            handleWarehouseCodeChange(params.row, value);
          },
        },
      };
    }

    if (dataIndex === 'planStoreQuantity' || inputType === 'number') {
      return {
        name: 'InputNumber',
        props: baseProps,
      };
    }

    if (dataIndex === 'warehouseKeeperId') {
      return {
        name: 'CustomUserSelect',
        props: baseProps,
      };
    }

    if (dataIndex === 'productType') {
      return {
        name: 'ApiSelect',
        cacheField: 'productTypeName',
        props: baseProps,
      };
    }

    if (dataIndex === 'unit') {
      return {
        name: 'ApiSelect',
        cacheField: 'unitName',
        props: baseProps,
      };
    }

    switch (cpmType) {
      case 'ApiSelect':
        return {
          name: 'ApiSelect',
          props: baseProps,
        };
      case 'CustomUserSelect':
        return {
          name: 'CustomUserSelect',
          props: baseProps,
        };
      case 'DatePicker':
        return {
          name: 'DatePicker',
          props: baseProps,
        };
      default:
        return {
          name: 'Input',
          props: baseProps,
        };
    }
  }

  async function loadTableData(data: any[]) {
    const list = data || [];
    if (gridApi.grid && typeof gridApi.grid.loadData === 'function') {
      await gridApi.grid.loadData(list);
      syncTableData();
    } else {
      gridApi.setGridOptions({ data: list });
      syncTableData(list);
    }
  }

  function getCurrentData() {
    if (gridApi.grid && typeof gridApi.grid.getFullData === 'function') {
      return gridApi.grid.getFullData() || [];
    }
    return state.tableData;
  }

  function syncTableData(fallback: any[] = []) {
    const data = gridApi.grid && typeof gridApi.grid.getFullData === 'function' ? gridApi.grid.getFullData() || [] : fallback;
    state.tableData.length = 0;
    state.tableData.push(...data);
  }

  function getTableActions(record: any, index: number): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: () => handleCopyItem(record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: () => handleDeleteItem(record),
        disabled: state.tableData.length <= 1,
      },
    ];
  }

  async function handleCopyItem(record: any, index: number) {
    const newRow = {
      ...cloneDeep(record),
      id: buildBitUUID(),
    };
    if (gridApi.grid && typeof gridApi.grid.insertAt === 'function') {
      await gridApi.grid.insertAt(newRow, index + 1);
      syncTableData();
    } else {
      const data = cloneDeep(state.tableData);
      data.splice(index + 1, 0, newRow);
      gridApi.setGridOptions({ data });
      syncTableData(data);
    }
  }

  function handleDeleteItem(record: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        await removeRow(record);
        createMessage.success(t('common.delSuccess'));
      },
    });
  }

  async function handleTransformTagKeydown(event: KeyboardEvent, params: any) {
    if (!event) return;
    const isEnter = event.key === 'Enter' || (event as any).keyCode === 13;
    if (!isEnter) return;
    const value = (event.target as HTMLInputElement)?.value || '';
    const transformTag = value.split('!')[0] || '';
    if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
      await gridApi.grid.setRow(params.row, { transformTag });
    } else {
      params.row.transformTag = transformTag;
    }
    syncTableData();
  }

  async function handleTransformTagChange(value: string, params: any) {
    const documentNumber = value || '';
    if (!documentNumber) {
      const updates = {
        workOrderNo: '',
        documentNumber: '',
        factory: '',
        moldNo: '',
      };
      if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
        await gridApi.grid.setRow(params.row, updates);
      } else {
        Object.assign(params.row, updates);
      }
      syncTableData();
      return;
    }
    try {
      const { data } = await getDetailbydocumentnumber({ documentNumber });
      const updates = {
        workOrderNo: data?.workOrderNo || '',
        documentNumber: data?.documentNumber || '',
        factory: data?.factory || '',
        moldNo: data?.mouldNo || '',
      };
      if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
        await gridApi.grid.setRow(params.row, updates);
      } else {
        Object.assign(params.row, updates);
      }
      syncTableData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleWarehouseCode(row: any) {
    if (!row.documentNumber) {
      createMessage.warning('请先填入流转标签');
      return;
    }
    if (!row.factory) {
      createMessage.warning('当前流转标签无工厂信息');
      return;
    }
    try {
      const { data, code } = await getListbyfactory({ factoryCode: row.factory });
      if (code === 200) {
        if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
          await gridApi.grid.setRow(row, { warehouseCodeOptions: data || [] });
        } else {
          row.warehouseCodeOptions = data || [];
        }
        syncTableData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleWarehouseCodeChange(row: any, value: string) {
    const list = row.warehouseCodeOptions || [];
    const target = list.find((item: any) => item.shippingSpaceCode === value);
    const updates = {
      warehouseCode: value,
      warehouseName: target?.shippingSpaceName || '',
    };
    if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
      await gridApi.grid.setRow(row, updates);
    } else {
      Object.assign(row, updates);
    }
    syncTableData();
  }

  function selectListInitFn() {
    Promise.all([getProcesslist({}), getSupplierlist({})])
      .then(res => {
        state.processList = res[0].data;
        state.supplierList = res[1].data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function insertTableDataRecord(record: any, index = -1) {
    const row = {
      ...cloneDeep(record),
    };
    if (!row.id) {
      row.id = buildBitUUID();
    }
    if (gridApi.grid && typeof gridApi.grid.insertAt === 'function') {
      await gridApi.grid.insertAt(row, index);
      syncTableData();
      return;
    }
    const data = cloneDeep(state.tableData);
    const targetIndex = index < 0 ? data.length : index;
    data.splice(targetIndex, 0, row);
    gridApi.setGridOptions({ data });
    syncTableData(data);
  }

  async function setTableData(data: any[]) {
    const list = Array.isArray(data) ? cloneDeep(data) : [];
    await loadTableData(list);
  }

  async function removeRow(record: any) {
    if (gridApi.grid && typeof gridApi.grid.remove === 'function') {
      await gridApi.grid.remove(record);
      syncTableData();
      return;
    }
    const data = cloneDeep(state.tableData);
    const targetIndex = data.findIndex(item => item.id === record.id);
    if (targetIndex > -1) {
      data.splice(targetIndex, 1);
    }
    gridApi.setGridOptions({ data });
    syncTableData(data);
  }

  function getDataSource() {
    return cloneDeep(getCurrentData());
  }

  function getSelectRowKeys() {
    if (gridApi.grid?.getCheckboxReserveRecords) {
      return gridApi.grid.getCheckboxReserveRecords().map((item: any) => item.id);
    }
    if (gridApi.grid?.getCheckboxRecords) {
      return gridApi.grid.getCheckboxRecords().map((item: any) => item.id);
    }
    return [];
  }

  async function updateTableData(index: number, field: string, value: any) {
    const data = getCurrentData();
    const target = data[index];
    if (!target) return;
    if (gridApi.grid && typeof gridApi.grid.setRow === 'function') {
      await gridApi.grid.setRow(target, { [field]: value });
      syncTableData();
      return;
    }
    target[field] = value;
    const newData = cloneDeep(data);
    gridApi.setGridOptions({ data: newData });
    syncTableData(newData);
  }

  defineExpose({
    insertTableDataRecord,
    getDataSource,
    setTableData,
    updateTableData,
    getSelectRowKeys,
    deleteTableDataRecord: removeRow,
    clearSelectedRowKeys: () => {
      gridApi.grid?.clearCheckboxRow?.();
    },
    setLoading: (loading: boolean) => gridApi.setLoading(loading),
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
