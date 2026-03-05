<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
            <!-- <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item key="export" v-auth="'btn_download'">批量导出</a-menu-item>
                </a-menu>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown> -->
          </template>

          <!-- column.dataIndex.includes('Time') || column.dataIndex.includes('Date') -->
          <template #bodyCell="{ column, record }">
            <template v-if="['creatorTime', 'produceDate', 'lastModifyTime'].includes(column.dataIndex)">
              {{ dayjs(record[column.dataIndex]).tz().format('YYYY-MM-DD hh:mm:ss') }}
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <addPopup @register="registerAddPopup" @refresh="reload"></addPopup>
    <ExportModal @register="registerExportModal" />
    <!-- <add @register="registerForm" @reload="reload" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
    <Detail @register="registerDetailPop" @reload="reload" /> -->
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getFqcdailywork, exportFqcdailywork, importFqcdailywork } from '/@/api/productionDeal/fqcdailywork';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';
  import addPopup from './compoments/addPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  //   import BatchUpload from './components/importPop.vue';
  //   import Detail from './components/detail.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    workOrderTypeList: any[];
    bomTypeList: any[];
    processRouteTypeList: any[];
    bOrderTypeList: any[];
  }

  const state = reactive<State>({
    workOrderTypeList: [],
    bomTypeList: [],
    processRouteTypeList: [],
    bOrderTypeList: [],
  });
  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();

  //   const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  //   const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();

  const searchFormSchema: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入工单号',
      },
      colProps: { span: 5 },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入内部料号',
      },
      colProps: { span: 5 },
    },
    {
      field: 'pickerVal',
      label: '  ',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] },
        placeholder: ['开始时间', '结束时间'],
      },
    },
  ];
  const columns: BasicColumn[] = [
    { title: '单据编码', dataIndex: 'documentNumber' },
    { title: '工单号', dataIndex: 'workOrderNo' },
    { title: '生产类型', dataIndex: 'produceTypeName', align: 'center' },
    { title: '被检工序', dataIndex: 'checkProjectName', align: 'center' },
    { title: 'NG员工工号', dataIndex: 'ngWorkNo', format: 'date|YYYY-MM-DD' },
    { title: '建立日期', dataIndex: 'creatorTime' },
    { title: '内部料号', dataIndex: 'productCode' },
    { title: '产品批次号', dataIndex: 'productBatchNo', align: 'center' },
    { title: '生产时间', dataIndex: 'produceDate' },
    { title: '生产车间编码', dataIndex: 'produceWorkshopCode' },
    { title: '生产组', dataIndex: 'produceTeam' },
    { title: 'AQL', dataIndex: 'aql' },
    { title: '抽样数', dataIndex: 'checkType' },
    { title: '检验项目', dataIndex: 'checkProjectsName' },
    { title: '批处置结论', dataIndex: 'handleResult' },
    { title: '复检结论', dataIndex: 'recheckResult' },
    { title: '生产车间', dataIndex: 'produceWorkshopName' },
    { title: '班次', dataIndex: 'classesName' },
    { title: 'QA确认', dataIndex: 'qaConfirm' },
    { title: '产品状态', dataIndex: 'produceType' },
    { title: '被检单据号', dataIndex: 'checkDocumentNumber' },
    { title: '检验类别', dataIndex: 'checkProjectName' },
    { title: '良品数量', dataIndex: 'goodQuantity' },
    { title: '不良品数量', dataIndex: 'badQuantity' },
    { title: '良率', dataIndex: 'goodProductsRate' },
    { title: '不良率', dataIndex: 'badProductsRate' },
    { title: '检验小类', dataIndex: 'badCode' },
    { title: '检验类型', dataIndex: 'checkTypeName' },
    { title: '被检验人', dataIndex: 'checkedPersonName' },
    { title: '检验人工号', dataIndex: 'checkerWorkNo' },
    { title: '客户', dataIndex: 'customerName' },
    { title: '主表备注', dataIndex: 'remark' },
    { title: '录入人', dataIndex: 'lastModifyUserName' },
    { title: '录入时间', dataIndex: 'lastModifyTime' },
  ];
  const [registerTable, { reload }] = useTable({
    api: getFqcdailywork,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 1, //自动展开行。
      fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  function addOrUpdateHandle(record) {
    openAddPopup(true, {
      title: t('common.add'),
      record,
      id: record.id,
    });
  }

  //   const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  //   function addOrUpdateHandle(record = '') {
  // openFormModal(true, {
  //   record,
  //   workOrderTypeList: state.workOrderTypeList,
  //   bomTypeList: state.bomTypeList,
  //   processRouteTypeList: state.processRouteTypeList,
  //   bOrderTypeList: state.bOrderTypeList,
  // });
  //   }

  //查看详情
  function goDetail(record) {
    openAddPopup(true, {
      title: t('common.add'),
      record,
      id: record.id,
      type: 'view',
    });
  }

  function batchImportOrExport({ key }) {
    handleExport();
  }
  //导入
  function handleImport() {
    // openImportPopup(true, {
    //   title: t('common.add'),
    //   isDevPlatform: false,
    // });
  }
  //导出
  function handleExport() {
    // openExportModal(true, {
    //   api: exportWorkOrderExcel,
    //   listQuery: {
    //     ...getFetchParams(),
    //   },
    //   exportOptions: columns,
    //   nameProps: 'title',
    //   idProps: 'dataIndex',
    // });
  }

  onMounted(async () => {});
</script>
