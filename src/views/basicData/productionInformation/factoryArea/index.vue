<template>
  <div class="lydc-content-wrapper" v-loading="loading">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_isOpenTree'" type="primary" :preIcon="isOpenTree ? 'icon-ym icon-ym-unfold' : 'icon-ym icon-ym-fold'" @click="toggleTable">{{
              isOpenTree ? t('component.form.fold') : t('component.form.unfold')
            }}</a-button>
            <a-button v-auth="'btn_asyncFactoryArea'" type="primary" preIcon="icon-ym icon-ym-Refresh" @click="asyncFactoryArea()">{{
              t('dict.FactoryArea.synchronizeFactoryArea')
            }}</a-button>
          </template>
          <template #fullName="{ row }">
            <i :class="'mr-6px ' + row.icon"></i>
            {{ row.fullName }}
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
          <!-- <template #bodyCell="{ column, record }"> -->
          <!-- <template v-if="column.key === 'fullName'"
              ><i :class="'mr-6px ' + record.icon"></i>
              {{ record.fullName }}
            </template> -->
          <!-- <template v-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.status === 1 ? t('dict.enableStatus.1') : t('dict.enableStatus.2') }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" :dropDownActions="getDropDownActions(record)" />
            </template> -->
          <!-- </template> -->
        </Grid>
      </div>
    </div>
    <add @register="registerAdd" @reload="reload" />
    <update @register="registerUpdate" @reload="reload" />
    <member @register="registerMember" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, TableAction, BasicColumn, FormProps, ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFactoryAreaList, syncFactoryArea, deleteFactoryArea } from '/@/api/basicData/factoryArea';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import update from './components/update.vue';
  import member from './components/Member.vue';
  import { nextTick, ref } from 'vue';
  defineOptions({ name: 'permission-organize' });

  const { createMessage } = useMessage();
  const { t } = useI18n();

  const STATUS = [
    { id: 1, fullName: t('dict.enableStatus.1'), theme: 'green' },
    { id: 2, fullName: t('dict.enableStatus.2'), theme: 'red' },
  ];

  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerUpdate, { openModal: openUpdateModal }] = useModal();
  const [registerMember, { openModal: openMemberModal }] = useModal();
  const isOpenTree = ref(false);
  const columns = [
    { title: '名称', field: 'fullName', treeNode: true },
    { title: '编码', field: 'enCode', width: 120 },
    { title: '层级', field: 'index', width: 70, align: 'center' },
    {
      title: '类型',
      field: 'type',
      align: 'center',
      formatter: ({ cellValue }) => {
        switch (cellValue) {
          case 'company':
            return t('common.company');
          case 'coo':
            return 'COO';
          case 'bg':
            return 'BG';
          case 'bu':
            return 'BU';
          case 'factory':
            return t('common.factory');
          default:
            return '';
        }
      },
    },
    { title: '主要制程', field: 'mainProcessTitle', width: 100, align: 'center' },
    { title: '3.8工厂编码', field: 'code', width: 100, align: 'center' },
    {
      title: '是否启用',
      field: 'status',
      width: 120,
      align: 'center',
      cellRender: {
        name: 'Tag',
        options: STATUS,
      },
    },
    { title: '排序', field: 'sortCode', width: 100, align: 'center' },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 170,
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 90, fixed: 'right' },
  ];

  // const [registerTable, { reload, setProps, expandAll, collapseAll }] = useTable({
  //   api: getFactoryAreaList,
  //   columns,
  //   isTreeTable: true,
  //   useSearchForm: true,
  //   pagination: false,
  //   formConfig: getFormConfig(),
  //   // defaultExpandAllRows: true,
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   afterFetch: data => setTableIndex(data),
  //   i18nConfig: {
  //     moduleCode: 'FactoryAreaColumn',
  //   },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      // collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
    },
    gridOptions: {
      id: 'permission-organize-list',
      api: getFactoryAreaList,
      columns,
      treeConfig: {
        childrenField: 'children',
        hasChildField: 'hasChildren',
        transform: false,
      },
      afterFetch: () => {
        console.log('afterFetchafterFetchafterFetch');
        setTimeout(() => {
          console.log('cccccccccccccccccc');
          toggleTable();
        }, 2000);
      },
      i18nConfig: {
        moduleCode: 'FactoryAreaColumn',
      },
    },
  });

  const { reload, expandAll, collapseAll, setLoading } = gridApi;

  async function toggleTable() {
    setLoading(true);
    isOpenTree.value = !isOpenTree.value;
    // ? expandAll() : collapseAll();
    let p = null;
    if (isOpenTree.value) {
      p = expandAll();
    } else {
      p = collapseAll();
    }
    await p;
    setLoading(false);
  }

  // 树形列表index层级
  function setTableIndex(arr, index = 0) {
    arr.forEach(item => {
      item.index = 1;
      if (index) item.index = index + 1;
      if (item.children) setTableIndex(item.children, item.index);
    });
  }

  function getFormConfig() {
    return [
      {
        fieldName: 'keyword',
        // label: t('common.keyword'),
        component: 'Input',
        componentProps: {
          placeholder: t('common.enterKeyword'),
          submitOnPressEnter: true,
        },
      },
    ];
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        auth: 'btn_add',
        onClick: handleAdd.bind(null, record.id, record.fullName, record.enCode, record.category, record.organizeIdTree),
      },
      {
        icon: 'icon-ym icon-ym-btn-edit',
        auth: 'btn_edit',
        onClick: handleUpdate.bind(null, record.id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          title: t('common.deleted'),
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }

  // function getDropDownActions(record): ActionItem[] {
  //   return [
  //     {
  //       label: t('common.viewMembers'),
  //       onClick: viewMember.bind(null, record.id, record.fullName),
  //     },
  //   ];
  // }

  function handleAdd(id, fullName, enCode, category, organizeIdTree) {
    if (category === 'factory') {
      return message.warning(t('dict.FactoryArea.addTip'));
    } else {
      openAddModal(true, { id, fullName, enCode, category, organizeIdTree });
    }
  }

  function handleUpdate(id = '') {
    openUpdateModal(true, { id });
  }

  function handleDelete(id) {
    deleteFactoryArea(id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  function viewMember(id, fullName) {
    openMemberModal(true, { id, fullName });
  }

  const loading = ref(false);

  async function asyncFactoryArea() {
    try {
      loading.value = true;
      const { code } = await syncFactoryArea();
      if (code == 200) {
        loading.value = false;
        message.success(t('common.synchronizationSuccessful'));
      }
      reload();
    } catch (e) {
      reload();
      throw e;
    }
  }
</script>
