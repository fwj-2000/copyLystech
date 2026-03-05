<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" okText="保存" destroyOnClose cancelText="取消" title="新增">
    <template #insertToolbar>
      <a-space :size="10">
        <a-button @click="handleSaveAction('commit')" type="primary">提交 </a-button>
        <a-button ghost @click="handleSaveAction('save')" type="primary">暂存 </a-button>
      </a-space>
    </template>
    <div class="form-pd">
      <BasicForm @register="registerForm" />
    </div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button @click="handleBeforeBatch" type="primary">批量新增 </a-button>
      </template>
      <template #toolbar>
        <!--        <a-button @click="handleBeforeBatch" type="primary">批量新增 </a-button>-->
        <AddCustomRows :defaultValue="2" @submit="handleChangeTable('add', { rows: $event })" />
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction :actions="getTableActions(index, record)" />
        </template>
      </template>
    </BasicTable>
    <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { computed, nextTick, toRaw } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  import { useBaseStore } from '/@/store/modules/base';
  import duration from 'dayjs/plugin/duration';
  import { QUOTA_TABLE_ROW_DATA, searchFormSchema } from '/@/views/business/quota/config';
  import { isEmpty } from '/@/utils/is';
  import { getEnablePartNumberApply, getFactoryList } from '/@/api/basicData/productCodeApply';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { buildUUID } from '/@/utils/uuid';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import batchAdd from '/@/views/business/quantitation/requirement/components/BatchAddModal.vue';

  import { postQuotationRequirement } from '/@/api/business/quota';
  import { useModal } from '/@/components/Modal';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';

  dayjs.extend(duration);
  const userStore = useUserStore();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const emit = defineEmits(['reload', 'register']);

  const [registerAddModal, { openModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerForm, { setFieldsValue, validate, updateSchema, getFieldsValue }] = useForm({
    schemas: searchFormSchema,
    labelWidth: 180,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
  });

  const columns = [
    {
      title: '产品内部料号',
      dataIndex: 'InsidePartNumber',
      width: 240,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getEnablePartNumberApply,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data.list',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        immediate: false,
        onChange: (InsidePartNumber, data, record) => {
          const { Factory, Members, TerminalCustomerPartNumber, ImmediateCustomerPartNumber, ProductDesc } = data;
          const { editValueRefs } = record;
          const project = Members?.find(item => item.configType == 'PDTLeader');
          editValueRefs.ProjectLeader = project?.memberId;
          editValueRefs.Factory = Factory;
          editValueRefs.TerminalCustomerPartNumber = TerminalCustomerPartNumber;
          editValueRefs.ImmediateCustomerPartNumber = ImmediateCustomerPartNumber;
          editValueRefs.ProductDesc = ProductDesc;
        },
      },
      editRow: true,
    },
    {
      title: '工厂',
      dataIndex: 'Factory',
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
      title: '单位用量',
      dataIndex: 'UnitQty',
      width: 100,
      editComponent: 'InputNumber',
      editRow: true,
    },
    { title: '备注', dataIndex: 'LineRemark', width: 140, editRow: true },
    {
      title: 'PDT Leader',
      dataIndex: 'ProjectLeader',
      width: 180,
      editComponent: 'CustomUserSelect',
      editComponentProps: ({ record }) => {
        return {
          immediate: false,
          allowClear: true,
          showSearch: true,
          label: record.ProjectLeaderName,
        };
      },
      editRow: true,
    },
    {
      title: '是否保税',
      dataIndex: 'IsBonded',
      width: 80,
      editComponent: 'Select',
      defaultValue: 'false',
      editComponentProps: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          {
            fullName: '是',
            enCode: 'true',
          },
          {
            fullName: '否',
            enCode: 'false',
          },
        ],
      },
      editRow: true,
    },
    {
      title: '成本单位',
      dataIndex: 'CostUnit',
      width: 120,
      editRow: true,
      defaultValue: 'PCS',
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getUnitListByKeyword,
        placeholder: '请选择成本单位',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: false,
        useChangeCopy: true,
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Name', '(', 'Code', ')'],
      },
    },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 180, editRow: true },
    { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 180, align: 'left', editRow: true },
    { title: '产品描述', dataIndex: 'ProductDesc', width: 120, editRow: true },

    // { title: '报价用途', dataIndex: 'Purpose', width: 180 },
    // { title: 'PD', dataIndex: 'DrawingsReviewUserId', width: 220, placeholder: '请选择PD' },
    // { title: '脱敏图纸', dataIndex: 'DesensitizedDrawingsName', width: 110 },
  ];

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTable.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  const [registerTable, { setTableData, getForm, getDataSource, insertTableDataRecord, deleteTableDataRecord, updateTableDataRecord, reload }] = useTable({
    columns,
    rowKey: 'uuid',
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
    resizeHeightOffset: 10,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add': {
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...QUOTA_TABLE_ROW_DATA,
            uuid: buildUUID(),
          });
        }
        insertTableDataRecord(dataList);
        break;
      }

      case 'addBaseIndex': {
        const rowData = {
          ...QUOTA_TABLE_ROW_DATA,
          uuid: buildUUID(),
        };
        insertTableDataRecord(rowData, data.index + 1);
        break;
      }

      case 'copy': {
        const copyData = getDataSource()[data.index];
        insertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      }

      case 'delete': {
        deleteTableDataRecord(data.uuid);
        break;
      }

      case 'update': {
        break;
      }
    }
  }

  async function init(data) {
    // getForm().setFieldsValue({
    //
    // })
    if (isEmpty(data)) {
      setTableData([
        {
          ...QUOTA_TABLE_ROW_DATA,
          uuid: buildUUID(),
        },
      ]);
    }
  }

  function handleBatchAdd(data) {
    console.log(data);
    const list = data.map(item => {
      const { Members } = item;
      const target = {
        ...item,
        UnitQty: '1',
        IsBonded: 'false',
        CostUnit: 'PCS',
        uuid: buildUUID(),
        onEdit: true,
        editable: true,
        disabled: {
          TerminalCustomerPartNumber: true,
          ImmediateCustomerPartNumber: true,
          ProductDesc: true,
        },
      };
      const project = Members?.find(item => item.configType == 'PDTLeader');
      if (project) {
        target.ProjectLeader = project.memberId;
        target.ProjectLeaderName = project.memberName;
      }

      target.uuid = buildUUID();
      return target;
    });
    nextTick(() => {
      const datalist = getDataSource();
      console.log(datalist, 'datalist-----------');
      console.log(datalist[0], 'datalist[0]-----------');
      console.log(datalist[0].InsidePartNumber, 'datalist[0].InsideProjectCode-----------');
      if (datalist.length == 1 && !datalist[0].InsidePartNumber) {
        return setTableData(list);
      }
      insertTableDataRecord(list);
    });
  }

  function handleBeforeBatch() {
    openModal(true, {
      // insideProjectCode: getFieldsValue().insideProjectCode,
      insideProjectCode: '',
    });
  }

  // 保存按钮
  function handleSaveAction(type) {
    validate().then(async val => {
      if (!val) return;
      const list = getDataSource();
      const { Purpose, DeliveryDate } = val;
      console.log(val, 'val');
      if (!Purpose) return createMessage.error('请输入报价用途');
      if (!DeliveryDate) return createMessage.error('请输入交货日期');
      const datalist = list.map(item => ({
        ...item,
        ...val,
        SaveAndCommit: type === 'commit',
      }));
      postQuotationRequirement(datalist).then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
          closePopup();
          emit('reload');
        }
      });
    });
    // validate().then(async val => {
    //   if (!val) return;
    //   let data;
    //   const meta = router.currentRoute.value.meta;
    //   try {
    //     data = state.backDataSource.map((item, index) => {
    //       if (!item.InsidePartNumber) {
    //         throw new Error(`请输入第${index + 1}条内部料号`);
    //       }
    //       if (!item.Purpose) {
    //         throw new Error(`请输入第${index + 1}条报价用途`);
    //       }
    //       return {
    //         ...item,
    //         ...val,
    //         MenuId: meta.modelId ? meta.modelId : ""
    //       };
    //     });
    //   } catch (e: any) {
    //     return message.error(e.message);
    //   }
    //   const { code, msg } = await postQuotationRequirement(data);
    //   if (code === 200) {
    //     message.success(msg);
    //     closePopup();
    //     emit("reload");
    //   }
    // });
  }
</script>
<style lang="less" scoped>
  .add-summary {
    display: inline-flex;
    height: 42px;
    padding: 0 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px dashed #dbdbdb;
    margin-top: 8px;
    cursor: pointer;
    width: max-content;
    margin-bottom: 15px;
    color: #1a1a1a;

    /* 中文/正文14 */

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    /* 157.143% */

    .img-box {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;

      & > img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .form-pd {
    padding: 0 15px 15px;
  }
</style>
