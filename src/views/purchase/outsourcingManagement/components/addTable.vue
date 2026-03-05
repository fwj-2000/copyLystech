<template>
  <!-- <BasicTable @register="registerTable" :data-source="state.tableData" :bodyCell="'#bodyCell'">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'workOrderNo'">
        <ApiSelect v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting" @change="onOrderNoChange(index, $event)" />
      </template>

      <template v-else-if="column.dataIndex === 'process'">
        <ApiSelect
          v-model:value="record[column.dataIndex]"
          v-bind="column.cpmSetting"
          :fieldNames="{
            value: 'code',
            label: 'name',
          }"
          :options="state.processList" />
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
  </BasicTable> -->
</template>
<script setup lang="ts">
  import { reactive, onMounted, watch, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { MODULE_TEMPLATE, ADD_COLUMNS } from './config';
  import { buildBitUUID } from '/@/utils/uuid';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getKeywordlist, getProcesslist } from '/@/api/purchase/outsourcemanage';
  import { getSupplierlist } from '/@/api/engineering/mould';
  import { FilteredInput } from '/@/components/FilteredInput';

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

  const { createMessage, createConfirm } = useMessage();

  // const [
  //   registerTable,
  //   {
  //     insertTableDataRecord,
  //     getDataSource,
  //     setTableData,
  //     updateTableData,
  //     getSelectRowKeys,
  //     deleteTableDataRecord,
  //     clearSelectedRowKeys,
  //     setLoading,
  //     setColumns,
  //   },
  // ] = useTable({
  //   title: '',
  //   columns: ADD_COLUMNS,
  //   rowKey: 'id',
  //   // isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     labelWidth: 100,
  //     // schemas: searchFormSchema,
  //     autoAdvancedLine: 0, //自动展开行
  //     showAdvancedButton: false,
  //     showResetButton: false,
  //     baseColProps: { span: 5 },
  //     actionColOptions: {
  //       span: 5,
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: false, //使用搜索表单
  //   showTableSetting: false, //刷新按钮,默认打开
  //   showIndexColumn: true, //显示序号
  //   pagination: false,
  //   actionColumn: {
  //     width: 90,
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   i18nConfig: {
  //     moduleCode: 'OutsourceManageColumn',
  //   },
  // });

  // watch(
  //   () => props.dataSource,
  //   newVal => {
  //     state.tableData = newVal;
  //   },
  // );

  // async function onOrderNoChange(i, val) {
  //   try {
  //     const { data, code } = await getKeywordlist({ keyword: val });
  //     const obj = data[0];
  //     const mouldNo = obj.mouldNo || obj.productCode;
  //     updateTableData(i, 'mouldNo', mouldNo);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const handleAddItem = (record, index) => {
  //   insertTableDataRecord({ ...MODULE_TEMPLATE, id: buildBitUUID() }, index + 1);
  // };

  // const handleCopyItem = (record, index) => {
  //   insertTableDataRecord({ ...record, id: buildBitUUID() }, index + 1);
  // };

  // const handleDeleteItem = (record, index) => {
  //   createConfirm({
  //     iconType: 'warning',
  //     title: t('common.tipTitle'),
  //     content: t('common.delTip'),
  //     onOk: () => {
  //       deleteTableDataRecord(record.id);
  //       createMessage.success(t('common.delSuccess'));
  //     },
  //   });
  // };

  function init() {
    selectListInitFn();
  }
  // function selectListInitFn() {
  //   Promise.all([getProcesslist({}), getSupplierlist({})])
  //     .then(res => {
  //       state.processList = res[0].data;
  //       state.supplierList = res[1].data;
  //       console.log(state.processList);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }

  // onMounted(() => {
  //   init();
  // });

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
