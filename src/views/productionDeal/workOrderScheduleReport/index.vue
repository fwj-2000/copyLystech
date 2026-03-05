<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <!-- 搜索框 -->
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }} </a-button>
            <!-- <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle(1)">报修</a-button>
                <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button> -->
          </template>
          <template #bodyCell="{ column, record, text }">
            <!-- 为0设置不显示 -->
            <template v-if="isNullList.includes(column.dataIndex)">
              <span v-if="text == 0 || text == null"></span>
              <span v-else>{{ text }}</span>
            </template>
            <!-- 良率 -->
            <template v-if="column.dataIndex == 'Yield'">
              <span v-if="text >= 100" color="green">{{ text }}%</span>
              <span v-else-if="text <= 100 && text > 0" color="b">{{ text }}%</span>
              <span v-else></span>
            </template>
            <!-- 待完成数量 -->
            <template v-if="column.dataIndex == 'BacklogQuantity'">
              <span v-if="text >= 100" style="color: red">{{ text }}</span>
              <span v-else-if="text > 0 && text < 100">{{ text }}</span>
              <span v-else style="color: green">{{ text }}</span>
            </template>
            <!--达成率 -->
            <template v-if="column.dataIndex == 'AchievementRate'">
              <a-progress :percent="text" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { page, exportSamplingLevelExcel } from '/@/api/productionDeal/workOrderScheduleReport';
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const baseStore = useBaseStore();
  interface State {
    supplierList: any[];
    resultList: any[];
    equipmentClassList: any[];
    classesNameList: any[];
  }

  const state = reactive<State>({
    supplierList: [],
    resultList: [],
    equipmentClassList: [],
    classesNameList: [],
  });

  const columns: BasicColumn[] = [
    { title: '工单编号', dataIndex: 'WorkOrderNo', align: 'center' },
    { title: '工单类型', dataIndex: 'WorkOrderTypeStr', align: 'center' },
    { title: '产品编号', dataIndex: 'ProductCode', align: 'center', width: 180 },
    { title: '工单数量(K)', dataIndex: 'WorkOrderQuantitySum', align: 'center' },
    { title: '机台号', dataIndex: 'MachineNo', align: 'center' },
    { title: '工序', dataIndex: 'ProcessName', align: 'center' },
    { title: '班次', dataIndex: 'ClassesStr', align: 'center' },
    { title: '标准良率', dataIndex: 'StandardYieldRate', align: 'center' },
    { title: '良品数(K)', dataIndex: 'GoodProductsQuantitySum', align: 'center' },
    { title: '不良品数(K)', dataIndex: 'BadPproductsQuantitySum', align: 'center' },
    { title: '良率', dataIndex: 'Yield', align: 'center' },
    { title: '达成率', dataIndex: 'AchievementRate', align: 'center' },
    { title: '待完成数量', dataIndex: 'BacklogQuantity', align: 'center' },
    { title: '工单日期', dataIndex: 'WorkOrderDate', align: 'center', format: 'date|YYYY/MM/DD' },
    { title: '厂区', dataIndex: 'FactoryStr', align: 'center' },
    { title: '入库数', dataIndex: 'InWarehouseQuantity', align: 'center' },
  ];

  var isNullList = ['BadPproductsQuantitySum', 'GoodProductsQuantitySum', 'WorkOrderQuantitySum'];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
      colProps: { span: 5 },
    },
    {
      field: 'WorkOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'ProductCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: t('CommonCol.pleaseSelectFactory'),
        api: getFactoryList,
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        showSearch: true,
        useChangeCopy: true,
        resultField: 'data',
      },
      colProps: { span: 4 },
    },
  ];

  const [registerTable, { getFetchParams, getForm }] = useTable({
    api: page,
    title: '',
    columns,
    rowKey: 'RowKey',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
      autoAdvancedLine: 0, //自动展开行
      i18nConfig: {
        moduleCode: 'WorkOrderScheduleReportColumn',
        transferRange: ['placeholder'],
      },
    },
    striped: true, //斑马纹
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 50,
      size: 'small',
    },
    i18nConfig: {
      moduleCode: 'WorkOrderScheduleReportColumn',
    },
    // rowSelection: {
    //   type: 'checkbox',
    // }
  });

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportSamplingLevelExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'WorkOrderScheduleReportColumn', // 字典分类EnCode
      },
    });
  }

  onMounted(async () => {
    const result = ((await baseStore.getDictionaryData('spotCheckResult')) as any[]).map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.resultList = result;
    getForm().updateSchema({
      field: 'result',
      componentProps: {
        options: result,
      },
    });

    const equipmentClassList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.equipmentClassList = equipmentClassList;

    const classesNameList = ((await baseStore.getDictionaryData('ClassesName')) as any[]).map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.classesNameList = classesNameList;
  });
</script>
