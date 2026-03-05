<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="SAP库存清单" :width="900" :minHeight="500" destroy-on-close>
    <a-tabs @change="reloadTable">
      <a-tab-pane key="1" tab="库存清单">
        <BasicTable style="min-height: 500px" @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handle">处理</a-button>
          </template>
        </BasicTable>
      </a-tab-pane>
      <a-tab-pane key="2" tab="处理记录">
        <BasicTable style="min-height: 500px" @register="registerRecordTable"></BasicTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { getStockList, handleStock } from '/@/api/business/sap';
  import { getSapFactoryById } from '/@/api/basicData/sap';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const emit = defineEmits(['register', 'reload']);
  const state = reactive<{
    id: string;
    activeKey: string;
    applyNo: string;
    applyTypeName: string;
  }>({
    id: '',
    activeKey: '',
    applyNo: '',
    applyTypeName: 'quantitativeApplyId',
  });

  const commonConfig = {
    rowKey: 'id',
    useSearchForm: true,
    striped: true,
    ellipsis: true,
    canColDrag: true,
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 50,
    },
    showIndexColumn: true,
    showTableSetting: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  };
  const [registerTable, { getSelectRows, clearSelectedRowKeys, reload }] = useTable({
    api: getStockList,
    columns: [
      { title: '物料编号', dataIndex: 'materialCode' },
      { title: '物料描述', dataIndex: 'materialDesc' },
      { title: '库存数量', dataIndex: 'restrictedValuation' },
      { title: '工厂', dataIndex: 'factory' },
      { title: '库存地点', dataIndex: 'inventoryLocation' },
      { title: '仓储地点的描述', dataIndex: 'inventoryLocationDesc' },
      { title: '基本计量单位', dataIndex: 'measurementUnit' },
    ],
    formConfig: {
      schemas: [
        {
          field: 'materialCode',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '物料编号',
          },
        },
        {
          field: 'inventoryLocation',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '库存地点',
          },
        },
        {
          field: 'factoryId',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '工厂',
            api: getSapFactoryById,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'FullName',
            },
            resultField: 'data',
            labelField: 'FullName',
            valueField: 'Id',
            filterOption: false,
            immediate: true,
          },
        },
      ],
    },
    rowSelection: { type: 'checkbox' },
    ...commonConfig,
  });
  const [registerRecordTable] = useTable({
    api: getStockList,
    columns: [
      { title: '物料编号', dataIndex: 'materialCode' },
      { title: '物料描述', dataIndex: 'materialDesc' },
      { title: '库存数量', dataIndex: 'restrictedValuation' },
      { title: '处理方式', dataIndex: 'stockHandle' },
      { title: '处理人', dataIndex: 'processorName' },
      { title: '处理时间', dataIndex: 'processorTime' },
      { title: '工厂', dataIndex: 'factory' },
      { title: '库存地点', dataIndex: 'inventoryLocation' },
      { title: '仓储地点的描述', dataIndex: 'inventoryLocationDesc' },
      { title: '基本计量单位', dataIndex: 'measurementUnit' },
    ],
    formConfig: {
      schemas: [
        {
          field: 'inventoryLocation',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '库存地点',
          },
        },
        {
          field: 'factoryId',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '工厂',
          },
        },
      ],
    },
    actionColumn: {
      title: t('common.action'),
      dataIndex: 'action',
    },
    ...commonConfig,
  });

  //   处理
  function handle() {
    const idList = getSelectRows();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    // 打开处理弹框;
    idList.forEach(item => {
      item[state.applyTypeName] = state.applyNo;
    });
    handleStock(idList).then(res => {
      reload();
      clearSelectedRowKeys();
      createMessage.success(res.msg);
    });
  }

  const [registerModal] = useModalInner(init);
  function init(data) {
    state.applyNo = data.applyNo;
    state.applyTypeName = data.applyTypeName || 'quantitativeApplyId';
  }

  function reloadTable(e) {
    state.activeKey = e;
  }
</script>
