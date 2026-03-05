<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAddFirst">{{ t('common.add') }}</a-button>
          </template>
          <template #displayArea="{ row }">
            <span>{{ row.displayArea.split(',').reduce((total, value) => total + ' ' + (Display[value] || value), '') }}</span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerAdd" @reload="reload" />
    <update @register="registerUpdate" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
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

  const columns = [
    { title: '名称', field: 'fullName', treeNode: true },
    { title: '编码', field: 'enCode', width: 150 },
    {
      title: '是否启用',
      field: 'status',
      width: 70,
      cellRender: {
        name: 'Tag',
        options: [
          { id: 1, fullName: t('common.enableText'), theme: 'green' },
          { id: 2, fullName: t('common.disableText'), theme: 'red' },
        ],
      },
    },
    { title: '排序', field: 'sortCode', width: 70 },
    { title: '类型', field: 'typeName', width: 100 },
    { title: '材料中类编码', field: 'middleCategoriesCode', width: 100 },
    { title: '材料小类英文', field: 'subclassNameEn', width: 100 },
    { title: '材料小类编码', field: 'subclassCode', width: 100 },
    {
      title: '显示区域',
      field: 'displayArea',
      width: 150,
      slots: { default: 'displayArea' },
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 110,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      fixed: 'right',
      width: 80,
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'keyword',
      component: 'Input',
      componentProps: {
        placeholder: t('common.enterKeyword'),
        submitOnPressEnter: true,
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'purchase-materialBase-list',
      columns: columns,
      showIndexColumn: true,
      api: getMaterialList,
      toolbarConfig: {
        delStatus: true,
        expandAll: true,
      },
      i18nConfig: {
        moduleCode: 'MateriaLibraryColumn',
      },
      treeConfig: {
        childrenField: 'children',
        expandAll: false, // 对应原代码的 defaultExpandAllRows: false
      },
      mouseConfig: {
        area: false, // 是否开启区域选取
      },
      pagerConfig: {
        autoHidden: true,
      },
    },
  });

  const { reload } = gridApi;

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
