<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="t('common.add2Text')"
    destroyOnClose
    :okText="t('common.submit')"
    @ok="handleSubmit"
    class="full-popup pb-10px">
    <div class="table-title">
      <Subtitle :title="t('dict.ProductTypeColumn.productCategory')" />
      <a-row :gutter="10" class="row-data">
        <a-col :span="12">
          {{ t('dict.SalesShipPattern.recordTable.mainProcessDesc') }}
          <ApiSelect
            :api="() => baseStore.getDictionaryData('MainProcess', true)"
            style="width: 70%"
            v-model:value="state.mainProcess"
            label-field="fullName"
            value-field="enCode"
            :filter-option="false"
            :immediate="true" />
        </a-col>
        <a-col :span="12">
          <AddCustomRows :defaultValue="1" @submit="handleAddSubmit" />
        </a-col>
      </a-row>
    </div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction :actions="getTableActions(index, record)" />
        </template>
      </template>
    </BasicTable>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { reactive, toRaw } from 'vue';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { addProductType, getProjectClassPage } from '/@/api/basicData/exchangeRate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const state = reactive({
    mainProcess: 1,
  });
  const ROW_DATA = {
    factory: '',
    productCategory: null,
    remark: '',
    editable: true,
    onEdit: true,
    uuid: '',
    projectClass: [],
  };

  const [registerTable, { insertTableDataRecord, deleteTableDataRecord, getDataSource, setTableData }] = useTable({
    // api: getFactorymoldcode,
    columns: getColumns(),
    showTableSetting: false,
    bordered: true,
    rowKey: 'uuid',
    afterFetch: data => {
      const list = data.map(item => ({
        ...item,
        onEdit: true,
        editable: true,
      }));
      return list;
    },
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'ProductTypeColumn',
    },
  });

  function init() {
    console.log('init');
    setTableData([
      {
        ...ROW_DATA,
      },
    ]);
  }

  function getColumns(): BasicColumn[] {
    return [
      {
        title: '工厂',
        dataIndex: 'factory',
        width: 180,
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: false,
        },
      },
      {
        title: '业务类型',
        dataIndex: 'businessType',
        i18nField: 'CommonCol.businessType',
        width: 180,
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: () => {
            return baseStore.getDictionaryData('SapFactoryMaterial');
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: false,
        },
      },
      {
        title: '产品类型',
        dataIndex: 'productCategory',
        editRow: true,
      },
      {
        dataIndex: 'projectClass',
        title: '项目分类',
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getProjectClassPage,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'projectClass',
          },
          beforeFetch: params => {
            params.pageSize = 50;
            params.currentPage = 1;
          },
          resultField: 'data.list',
          labelField: 'projectClass',
          valueField: 'projectClass',
          mode: 'multiple',
          immediate: false,
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editRow: true,
      },
    ];
  }

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleTableAction.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleTableAction.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  function handleTableAction(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add': {
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...ROW_DATA,
            uuid: buildUUID(),
          });
        }
        insertTableDataRecord(dataList);
        break;
      }
      case 'addBaseIndex':
        insertTableDataRecord(
          {
            ...ROW_DATA,
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'copy': {
        const copyData = getDataSource()[data.index];
        insertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        console.log(copyData);
        break;
      }
      case 'delete':
        deleteTableDataRecord(data.uuid);
        break;
      case 'update':
        break;
    }
  }

  function handleAddSubmit(e) {
    handleTableAction('add', { rows: e });
  }

  function handleSubmit() {
    const datalist = getDataSource().map(item => ({
      factory: item.factory,
      businessType: item.businessType,
      productCategory: item.productCategory,
      projectClass: item.projectClass.join(','),
      remark: item.remark,
      mainProcess: state.mainProcess,
      isEnabled: 1,
    }));
    changeLoading(true);
    addProductType(datalist)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          emit('reload');
          closePopup();
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .table-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    //margin-bottom: 10px;
    align-items: center;
    width: 100%;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .row-data {
    width: 40%;
  }

  :deep(.subtitle-container) {
    padding-bottom: 0;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
