<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm class="search-form" @register="registerForm" @submit="handleSubmit" @reset="handleReset"></BasicForm>
      </div>
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" v-bind="getTableBindValue">
          <template #toolbar>
            <a-tooltip placement="top" title="结构图">
              <i class="icon-ym icon-ym icon-ym-tree-department1 cursor-pointer text-18px" @click="openOrgTreePopup(true, {})"></i>
            </a-tooltip>
          </template>
          <template #tableTitle>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleAdd">
                  <a-menu-item key="company">新建公司</a-menu-item>
                  <a-menu-item key="department">新建部门</a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary" preIcon="icon-ym icon-ym-btn-add">{{ t('common.addText') }}<DownOutlined /></a-button>
            </a-dropdown>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fullName'"><i :class="'mr-6px ' + record.icon"></i>{{ record.fullName }}</template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" :dropDownActions="getDropDownActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <Form @register="registerFormPopup" @reload="resetFields" />
    <DepForm @register="registerDepForm" @reload="reload" />
    <Member @register="registerMember" />
    <PermissionPopup @register="registerPermission" />
    <OrgTree @register="registerOrgTree" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, computed, unref, nextTick } from 'vue';
  import { getOrganizeSyncList, delOrganize } from '/@/api/permission/organize';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import Form from './Form.vue';
  import DepForm from './DepForm.vue';
  import Member from './Member.vue';
  import OrgTree from './OrgTree.vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import PermissionPopup from '../organize/Permission.vue';

  interface State {
    loading: boolean;
    key: number;
    list: any[];
    listQuery: any;
  }

  defineOptions({ name: 'permission-organize' });

  const state = reactive<State>({
    loading: false,
    key: 0,
    list: [],
    listQuery: { parentId: '0', keyword: '' },
  });
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const organizeStore = useOrganizeStore();
  const [registerDepForm, { openModal: openDepFormModal }] = useModal();
  const [registerMember, { openModal: openMemberModal }] = useModal();
  const [registerFormPopup, { openPopup: openFormPopup }] = usePopup();
  const [registerPermission, { openPopup: openPermissionPopup }] = usePopup();
  const [registerOrgTree, { openPopup: openOrgTreePopup }] = usePopup();

  const getColumns = computed<any[]>(() => {
    const columns = [
      { title: '名称', dataIndex: 'fullName' },
      { title: '编码', dataIndex: 'enCode' },
      { title: '组织路径', dataIndex: 'organize' },
      { title: '类型', dataIndex: 'type', width: 100, align: 'center', customRender: ({ record }) => (record.type === 'company' ? '公司' : '部门') },
      // { title: '创建时间', dataIndex: 'creatorTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
      { title: '排序', dataIndex: 'sortCode', width: 70, align: 'center' },
    ];
    return columns;
  });
  const getTableBindValue = computed(() => {
    const data: any = {
      searchInfo: state.listQuery,
      columns: unref(getColumns),
      isTreeTable: !state.listQuery.keyword,
      loading: state.loading,
      key: state.key,
      defaultExpandAllRows: false,
      onChange: onChange,
    };
    if (data.isTreeTable) data.pagination = false;
    return data;
  });
  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    baseColProps: { span: 8 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
    schemas: [
      {
        field: 'keyword',
        label: t('common.keyword'),
        component: 'Input',
        componentProps: {
          placeholder: t('common.enterKeyword'),
          submitOnPressEnter: true,
        },
      },
    ],
  });
  const [registerTable, { reload }] = useTable({
    api: getOrganizeSyncList,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
    },
    tableSetting: {
      expand: false,
      redo: false,
    },
    afterFetch: data => {
      const list = data.map(o => {
        const obj = o;
        if (obj.hasChildren) obj.children = [];
        return obj;
      });
      return list;
    },
    onExpand: async (expanded, record) => {
      if (expanded) {
        if (record.children?.length) return;
        state.loading = true;
        state.listQuery.parentId = record.id;
        const res = await getOrganizeSyncList(state.listQuery);
        const list = res.data.list.map(o => {
          const obj = o;
          if (obj.hasChildren) obj.children = [];
          return obj;
        });
        state.loading = false;
        record.children = list;
      }
    },
  });
  function handleSubmit(values) {
    state.listQuery.keyword = values?.keyword || '';
    if (!state.listQuery.keyword) state.listQuery.parentId = '0';
    state.key = +new Date();
    reloadTable();
  }
  function handleReset() {
    state.listQuery.parentId = '0';
    state.listQuery.keyword = '';
    reloadTable();
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('common.editText'),
        onClick: addOrUpdateHandle.bind(null, record.id, record.type, record.parentId),
      },
      {
        label: t('common.delText'),
        color: 'error',
        modelConfirm: {
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }
  function getDropDownActions(record): ActionItem[] {
    return [
      {
        label: '查看成员',
        onClick: viewMember.bind(null, record.id, record.fullName),
      },
      {
        label: '查看权限',
        onClick: handlePermission.bind(null, record.id, record.fullName, record.type),
      },
    ];
  }
  function handlePermission(id, fullName, objectType) {
    openPermissionPopup(true, { id, fullName, objectType });
  }
  function handleAdd({ key }) {
    addOrUpdateHandle('', key);
  }
  function addOrUpdateHandle(id = '', type, parentId = '') {
    const openMethod = type === 'company' ? openFormPopup : openDepFormModal;
    openMethod(true, { id, parentId });
  }
  function handleDelete(id) {
    delOrganize(id).then(res => {
      createMessage.success(res.msg);
      organizeStore.resetState();
      reload();
    });
  }
  function reloadTable() {
    state.key = +new Date();
  }
  function onChange() {
    const values = getFieldsValue();
    const oldKeyword = state.listQuery.keyword;
    state.listQuery.keyword = values.keyword || '';
    if (!state.listQuery.keyword) state.listQuery.parentId = '0';
    if (oldKeyword !== values.keyword) {
      nextTick(() => {
        reloadTable();
      });
    }
  }
  function viewMember(id, fullName) {
    openMemberModal(true, { id, fullName });
  }
</script>
