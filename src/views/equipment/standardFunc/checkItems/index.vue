<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.addText') }}</a-button>
            <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'category'">
              {{ state.equipmentClassList.find(c => c.id == text)?.fullName }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getPage, deleteItem, blukDeleteItems } from '/@/api/equipment/checkItems';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';

  import add from './components/add.vue';

  const baseStore = useBaseStore();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const { t } = useI18n();
  interface State {
    equipmentClassList: any[];
  }
  const state = reactive<State>({
    equipmentClassList: [],
  });

  const columns: BasicColumn[] = [
    { title: '点检项编码', dataIndex: 'code' },
    { title: '点检项名称', dataIndex: 'name' },
    { title: '点检项标准', dataIndex: 'standard' },
    { title: '点检方法', dataIndex: 'method' },
    { title: '设备分类', dataIndex: 'category' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'lastModifyUserName' },
    { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入点检项编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入点检项名称',
      },
      colProps: { span: 4 },
    },
    {
      field: 'category',
      label: '',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入设备分类',
        showSearch: true,
      },
      colProps: { span: 4 },
    },
  ];

  const [registerTable, { getRowSelection, reload, getForm }] = useTable({
    api: getPage,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      i18nConfig: {
        moduleCode: 'CheckItemsColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
      // autoAdvancedLine: 1, //自动展开行
    },
    // striped: true,//斑马纹
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
      width: 80,
      title: '操作',
      dataIndex: 'action', //字段
      // fixed: 'right', //显示在右边
    },
    i18nConfig: {
      moduleCode: 'CheckItemsColumn',
    },
  });

  const { createMessage, createConfirm } = useMessage();

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, {
      id,
      equipmentClassList: state.equipmentClassList,
    });
  }

  //删除
  function handleDelete(record) {
    deleteItem(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return createMessage.warning('请选中需要删除的行');
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: '此操作将永久删除该数据, 是否继续？',
        onOk: async () => {
          try {
            const { code } = await blukDeleteItems(list);
            if (code == 200) {
              getRowSelection().selectedRowKeys = [];
              createMessage.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
            reload();
            throw e;
          }
        },
      });
    }
  }

  onMounted(async () => {
    const equipmentClassList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.equipmentClassList = equipmentClassList;
    getForm().updateSchema({ field: 'category', componentProps: { options: equipmentClassList } });
  });
</script>
