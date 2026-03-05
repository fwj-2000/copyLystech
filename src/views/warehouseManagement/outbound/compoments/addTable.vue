<template>
  <BasicTable @register="registerTable" :data-source="state.tableData" :bodyCell="'#bodyCell'">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'transformTag'">
        <LydcInput
          suffixIcon="icon-ym icon-ym-scanCode"
          v-model:value="record[column.dataIndex]"
          :placeholder="t('common.inputText')"
          @change="handlerInputChangeFn(index, $event)"
          @Keydown="handlerInputKeydown(index, $event)" />
      </template>
      <template v-else-if="column.cpmType === 'CustomUserSelect'">
        <lydc-custom-user-select v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting"> </lydc-custom-user-select>
      </template>
      <template v-else-if="column.dataIndex === 'warehouseCode'">
        <a-select
          v-model:value="record[column.dataIndex]"
          style="width: 100%"
          placeholder=""
          :fieldNames="{
            value: 'shippingSpaceCode',
            label: 'shippingSpaceCode',
          }"
          :options="state.warehouseCodelist"
          @click="handleWarehouseCode(record)"
          @change="handleWarehouseCodeChange(index, $event)">
        </a-select>
      </template>

      <template v-else-if="column.cpmType === 'DatePicker'">
        <lydc-date-picker v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting" />
      </template>
      <template v-else-if="column.cpmType === 'ApiSelect'">
        <ApiSelect v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting" />
      </template>

      <template v-else-if="column.dataIndex === 'action'">
        <TableAction :actions="getTableActions(record, index)" />
      </template>

      <template v-else>
        <FilteredInput v-model:value="record[column.dataIndex]" :input-type="column.inputType" allowClear v-bind="column.cpmSetting" v-if="column.isEdit" />
      </template>
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import { reactive, onMounted, watch, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { PRINT_COLUMNS } from '../config';
  import { buildBitUUID } from '/@/utils/uuid';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getKeywordlist, getProcesslist } from '/@/api/purchase/outsourcemanage';
  import { getSupplierlist } from '/@/api/engineering/mould';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { getDetailbydocumentnumber } from '/@/api/productionDeal/dieCutPerPrint';
  import { getListbyfactory } from '/@/api/warehouse/warehouse';

  const props = defineProps({
    dataSource: {
      type: Array,
    },
  });

  const { t } = useI18n();

  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any;
    fileList: any[];
    processList: [];
    supplierList: [];
    productTypelist: [];
    innermaterialnumberList: [];
    warehouseCodelist: [];
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
    warehouseCodelist: [],
  });

  const { createMessage, createConfirm } = useMessage();

  const [
    registerTable,
    {
      insertTableDataRecord,
      getDataSource,
      setTableData,
      updateTableData,
      getSelectRowKeys,
      deleteTableDataRecord,
      clearSelectedRowKeys,
      setLoading,
      setColumns,
    },
  ] = useTable({
    title: '',
    columns: PRINT_COLUMNS,
    rowKey: 'id',
    // isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      labelWidth: 100,
      // schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
      baseColProps: { span: 5 },
      actionColOptions: {
        span: 5,
      },
    },
    striped: true,
    useSearchForm: false, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    showIndexColumn: true, //显示序号
    pagination: false,
    actionColumn: {
      width: 90,
      title: t('common.action'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
  });

  watch(
    () => props.dataSource,
    newVal => {
      state.tableData = newVal;
    },
  );

  function getTableActions(record, index): ActionItem[] {
    return [
      // {
      //   icon: 'ym-diecut ym-diecut-file-copy',
      //   onClick: handleCopyItem.bind(null, record, index),
      // },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, record, index),
        disabled: state.tableData.length <= 1,
      },
    ];
  }
  const handlerInputKeydown = (i, e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    console.log(arr, '扫描的数据');
    updateTableData(i, 'transformTag', arr[0]);
  };

  async function handlerInputChangeFn(i, val: any) {
    try {
      const { data } = await getDetailbydocumentnumber({ documentNumber: val });
      updateTableData(i, 'workOrderNo', data.workOrderNo);
      updateTableData(i, 'documentNumber', data.documentNumber);
      updateTableData(i, 'factory', data.factory);
      // updateTableData(i, 'factory', 'MQ06');
      updateTableData(i, 'moldNo', data.mouldNo);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleWarehouseCode(record) {
    if (!record.documentNumber) {
      return createMessage.warning('请先填入流转标签');
    }
    if (!record.factory) {
      return createMessage.warning('当前流转标签无工厂信息');
    }
    const { data, code } = await getListbyfactory({ factoryCode: record.factory });
    if (code === 200) {
      console.log(data);
      state.warehouseCodelist = data;
    }
  }

  function handleWarehouseCodeChange(i, val) {
    state.warehouseCodelist.forEach((o: any) => {
      console.log(o);
      if (o.shippingSpaceCode === val) {
        updateTableData(i, 'warehouseName', o.shippingSpaceName);
        return;
      }
    });
  }
  // const handleAddItem = (record, index) => {
  //   insertTableDataRecord({ ...MODULE_TEMPLATE, id: buildBitUUID() }, index + 1);
  // };

  // const handleCopyItem = (record, index) => {
  //   insertTableDataRecord({ ...record, id: buildBitUUID() }, index + 1);
  // };

  const handleDeleteItem = (record, index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        deleteTableDataRecord(record.id);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };

  function init() {
    selectListInitFn();
  }
  function selectListInitFn() {
    Promise.all([getProcesslist({}), getSupplierlist({})])
      .then(res => {
        state.processList = res[0].data;
        state.supplierList = res[1].data;
        console.log(state.processList);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onMounted(() => {
    init();
  });

  defineExpose({
    insertTableDataRecord,
    getDataSource,
    setTableData,
    updateTableData,
    getSelectRowKeys,
    deleteTableDataRecord,
    clearSelectedRowKeys,
    setLoading,
  });
</script>
