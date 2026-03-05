<template>
  <BasicModal
    :width="800"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.moldUseName')"
    :draggable="true"
    showOkBtn
    @ok="handleAddMold"
    destroyOnClose>
    <BasicForm @register="registerForm" @submit="handleSubmit" />
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleStatus(record)" v-if="record.status == '1'">{{ t('common.disableText') }} </a-button>
          <a-button type="link" @click="handleStatus(record)" v-if="record.status == '2'">{{ t('dict.Supplier.Status.1') }} </a-button>
          <a-button type="link" @click="handleStatus(record)" v-if="record.status == '0' || record.status == ''">{{ t('component.upload.del') }} </a-button>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import { reactive } from 'vue';
  import { addMoldpurpose, disableMoldPurpose, enableMoldPurpose, getMoldpurposelist } from '/@/api/engineering/costCenter';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { buildUUID } from '/@/utils/uuid';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const STATUS_OPTIONS = [
    { id: 0, fullName: t('common.toBeActivated'), theme: 'gray', rowKey: 'statusDesc' },
    { id: 1, fullName: t('dict.enableStatus.1'), theme: 'blue', rowKey: 'statusDesc' },
    { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  ];

  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const columns: BasicColumn[] = [
    {
      title: t('dict.CommonCol.moldUseName'),
      dataIndex: 'moldPurpose',
      width: 220,
    },
    {
      title: t('dict.ProductLineColumn.Status'),
      dataIndex: 'status',
      width: 100,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
  ];

  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    showActionButtonGroup: true,
    showSubmitButton: true,
    showResetButton: false,
    submitButtonOptions: {
      text: t('common.add2Text'),
    },
    schemas: [
      {
        field: 'moldPurpose',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.MaintenanceColumn.newMoldUsage'),
        },
        colProps: {
          span: 12,
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'MaintenanceColumn',
      transferRange: ['placeholder'],
    },
  });

  const [registerTable, { reload, insertTableDataRecord, deleteTableDataRecord, getDataSource }] = useTable({
    api: getMoldpurposelist,
    columns,
    rowKey: 'id',
    useSearchForm: false,
    pagination: false,
    // formConfig: getFormConfig(),
    showTableSetting: false,
    showIndexColumn: false,
    isCanResizeParent: false,
    canResize: true,
    resizeHeightOffset: -70,
    scroll: {
      y: 430,
    },
    clickToRowSelect: true,
    actionColumn: {
      width: 70,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    i18nConfig: {
      moduleCode: 'MaintenanceColumn',
    },
  });

  const state = reactive({
    data: {},
  });

  function init(data) {
    console.log('init');
  }

  function handleStatus(record) {
    const { status, id } = record;
    console.log(record);
    if (status == 0) {
      // 删除
      deleteTableDataRecord(id);
    } else if (status == 2) {
      // 启用 --> 禁用
      enableMoldPurpose({
        id,
      }).then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          reload();
        } else {
          createMessage.error(msg);
        }
      });
    } else {
      // 禁用 --> 启用
      disableMoldPurpose({
        id,
      }).then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          reload();
        } else {
          createMessage.error(msg);
        }
      });
    }
  }

  function handleAddMold() {
    const data = getDataSource();
    const addlist = data.filter(item => item.status == 0).map(item => ({ moldPurpose: item.moldPurpose }));
    console.log(addlist);
    addMoldpurpose(addlist).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        closeModal();
      } else {
        createMessage.error(msg);
      }
    });
  }

  async function handleSubmit() {
    const { moldPurpose } = getFieldsValue();
    console.log(moldPurpose);
    insertTableDataRecord({
      moldPurpose,
      status: 0,
      id: buildUUID(),
    });
    resetFields();
  }
</script>
