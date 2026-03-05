<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAddFirst">{{ t('common.add') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerAdd" @reload="reload" />
    <update @register="registerUpdate" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction, BasicColumn, FormProps, ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getMaterialList, delMaterial } from '/@/api/purchase/materialBase';
  import { useModal } from '/@/components/Modal';
  import add from './components/add.vue';
  import update from './components/update.vue';

  defineOptions({
    name: 'purchase-basicInformation-materialBase',
  });
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerUpdate, { openModal: openUpdateModal }] = useModal();
  const Display = {
    MaterialWarehouse: t('dict.DisplayAreaEnum.MaterialWarehouse'),
    FinishedProduct: t('dict.DisplayAreaEnum.FinishedProduct'),
  };
  const columns: BasicColumn[] = [
    { title: '名称', dataIndex: 'fullName' },
    { title: '编码', dataIndex: 'enCode', width: 100 },
    { title: '层级', dataIndex: 'index', width: 70 },
    {
      title: '是否启用',
      dataIndex: 'status',
      width: 70,
      format:
        'tag|' +
        JSON.stringify([
          { fullName: t('common.enableText'), id: 1, theme: 'green' },
          { fullName: t('common.disableText'), id: 2, theme: 'red' },
        ]),
    },
    { title: '排序', dataIndex: 'sortCode', width: 70 },
    { title: '类型', dataIndex: 'typeName', width: 100 },
    { title: '材料中类编码', dataIndex: 'middleCategoriesCode', width: 100 },
    { title: '材料小类英文', dataIndex: 'subclassNameEn', width: 100 },
    { title: '材料小类编码', dataIndex: 'subclassCode', width: 100 },
    {
      title: '显示区域',
      dataIndex: 'displayArea',
      customRender: ({ text }) => {
        return text.split(',').reduce((total, value) => total + ' ' + (Display[value] || value), '');
      },
    },
    { title: '创建时间', dataIndex: 'creatorTime', i18nField: 'CommonCol.creatorUserName', width: 110, format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const [registerTable, { reload }] = useTable({
    api: getMaterialList,
    columns,
    isTreeTable: true,
    useSearchForm: true,
    pagination: false,
    formConfig: getFormConfig(),
    // defaultExpandAllRows: true,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    afterFetch: data => setTableIndex(data),
    i18nConfig: {
      moduleCode: 'MateriaLibraryColumn',
    },
  });

  // 树形列表index层级
  function setTableIndex(arr, index = 0) {
    arr.forEach(item => {
      item.index = 1;
      if (index) item.index = index + 1;
      if (item.children) setTableIndex(item.children, item.index);
    });
  }

  function getFormConfig(): Partial<FormProps> {
    return {
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
    };
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAdd.bind(null, record),
        auth: 'btn_add',
      },
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleUpdate.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }

  function handleAddFirst() {
    openAddModal(true, {});
  }

  function handleAdd(record) {
    const { id, fullName, enCode, category, organizeIdTree } = record;
    openAddModal(true, { id, fullName, enCode, category, organizeIdTree });
  }

  function handleUpdate(record) {
    const { id, parentId } = record;
    openUpdateModal(true, { id, parentId });
  }

  function handleDelete(id) {
    delMaterial(id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }
</script>
