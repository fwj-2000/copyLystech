<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="t('common.addText')"
    destroyOnClose
    :okText="t('common.submit')"
    @ok="handleSubmit"
    class="full-popup p-10px">
    <div class="table-title">
      <Subtitle :title="t('dict.SerialPortScreenParmColumn')" />
      <div class="flex-title">
        <a-form-item name="Version" :label="t('dict.SerialPortScreenParmColumn.innerMaterialCode')">
          <a-input :placeholder="t('common.inputText')" v-model:value="state.innerMaterialCode" />
        </a-form-item>
        <AddCustomRows :defaultValue="1" @submit="handleAddSubmit" />
      </div>
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
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { addSerialPortScreenParm } from '/@/api/productionDeal/serialPortScreenParm';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { reactive, toRaw } from 'vue';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const state = reactive({
    innerMaterialCode: '',
  });
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const ROW_DATA = {
    materialAxisNo: '',
    material: '',
    tension: '',
    releaseOrReceiveMaterial: '',
    remark: '',
    editable: true,
    onEdit: true,
    uuid: '',
  };

  const [registerTable, { insertTableDataRecord, deleteTableDataRecord, getDataSource, setTableData }] = useTable({
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
      moduleCode: 'SerialPortScreenParmColumn',
    },
  });

  function init() {
    setTableData([
      {
        ...ROW_DATA,
      },
    ]);
  }

  function getColumns(): BasicColumn[] {
    return [
      {
        title: '料轴号',
        dataIndex: 'materialAxisNo',
        editRow: true,
      },
      {
        title: '材料',
        dataIndex: 'material',
        editRow: true,
      },
      {
        title: '张力',
        dataIndex: 'tension',
        editRow: true,
      },
      {
        title: '放/收料',
        dataIndex: 'releaseOrReceiveMaterial',
        width: 180,
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: () => {
            return baseStore.getDictionaryData('releaseOrReceiveType');
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
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
    if (!state.innerMaterialCode) {
      return createMessage.error('请输入内部料号');
    }

    const datalist = getDataSource().map(item => ({
      materialAxisNo: item.materialAxisNo,
      innerMaterialCode: state.innerMaterialCode,
      material: item.material,
      tension: item.tension,
      releaseOrReceiveMaterial: item.releaseOrReceiveMaterial,
      remark: item.remark,
    }));
    changeLoading(true);

    addSerialPortScreenParm(datalist)
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
    padding: 10px;
    width: 100%;

    .flex-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ant-form-item {
        margin-bottom: 0;
      }
    }
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
</style>
