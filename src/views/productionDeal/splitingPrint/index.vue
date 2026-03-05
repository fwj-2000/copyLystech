<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #InnerMaterialCode>
            <a-input placeholder="请输入" />
          </template>
          <template #tableTitle>
            <a-button type="primary" @click="scanDataHandle()" v-auth="'btn_scanMaterials'">扫描物料</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? '有效' : '失效' }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <detail @register="registerDetail" @refresh="reload" />
    <scanData @register="registerScanData" @refresh="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getSplitingRecordList } from '../../../api/productionDeal/splitingPrint';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import scanData from './components/scanData.vue';
  import detail from './components/detail.vue';

  const { t } = useI18n();
  const [registerDetail, { openPopup: openMenuPopup }] = usePopup();
  const [registerScanData, { openModal: openFormModal, setModalProps }] = useModal();

  const columns: BasicColumn[] = [
    { title: '工厂代码', dataIndex: 'FactoryCode', align: 'center' },
    { title: '类型', dataIndex: 'Type' },
    { title: '工单号', dataIndex: 'WorkOrderNo' },
    { title: '内部料号', dataIndex: 'InnerMaterialCode' },
    { title: '支数', dataIndex: 'BranchQuantity' },
    { title: '打印总数', dataIndex: 'TotalQuantity' },
    { title: '剩余打印数量', dataIndex: 'LeavePrintQuantity' },
    { title: '需求数量', dataIndex: 'DemandedQuantity' },
    { title: '标签', dataIndex: 'LabelQuantity' },
    { title: '规格', dataIndex: 'Specifications' },
    { title: '卷数', dataIndex: 'VolumeQuantity' },
    { title: '余料', dataIndex: 'LeaveMaterial' },
    { title: '转单', dataIndex: 'TransformOrder' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'WorkOrderNo',
      label: '工单号',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工单号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'pickerVal',
      label: t('views.dashboard.production.completionYield.selectTime'),
      labelWidth: 70,
      component: 'DateRange',
      colProps: { span: 4 },
    },
    {
      field: 'InnerMaterialCode',
      label: '内部料号',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '内部料号',
      },
      colProps: { span: 6 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { reload }] = useTable({
    api: getSplitingRecordList,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
      autoAdvancedLine: 1, //自动展开行
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
      width: 70,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: detailHandle.bind(null, record),
        auth: 'btn_preview',
      },
    ];
  }

  //详情
  function detailHandle(record) {
    const { Id } = record;
    openMenuPopup(true, {
      id: Id,
      list: [record],
    });
  }

  //扫描物料
  function scanDataHandle() {
    setModalProps({ width: 1600, useWrapper: false });
    openFormModal(true, {});
  }
</script>
<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
