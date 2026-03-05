<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <PageWrapper
          title="VxeTable表格"
          content="只展示部分操作，详细功能请查看VxeTable官网事例"
          contentFullHeight
          fixedHeight
          :contentStyle="{ width: '100%', margin: '16px 0' }">
          <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }">
            <template #action="{ row }">
              <TableAction outside :actions="createActions(row)" />
            </template>
          </VxeBasicTable>
        </PageWrapper>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { vxeTableColumns, vxeTableFormSchema } from './tableData';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance, VxeGridPropTypes } from '/@/components/VxeTable';
  import { demoListApi } from '/@/api/extend/table';
  import { tableList } from './tableData';

  defineOptions({ name: 'extend-tableDemo-vxeGrid' });

  const { createMessage } = useMessage();

  const tableRef = ref<VxeGridInstance>();

  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
    mouseConfig: {
      area: true, // 是否开启区域选取
      extension: false,
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    columns: vxeTableColumns,
    columnConfig: {
      resizable: true,
    },
    data: tableList,
    toolbarConfig: {
      buttons: [
        {
          content: '在第一行新增',
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'primary',
              preIcon: 'mdi:page-next-outline',
            },
            events: {
              click: () => {
                tableRef.value?.insert({ name: '新增的', role: 'Develop' });
                createMessage.success('新增成功');
              },
            },
          },
        },
        {
          content: '在最后一行新增',
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'warning',
            },
            events: {
              click: () => {
                tableRef.value?.insertAt({ name: '新增的', role: 'Develop' }, -1);
              },
            },
          },
        },
      ],
    },
    formConfig: {
      enabled: true,
      items: vxeTableFormSchema,
    },
    keyboardConfig: {
      isClip: true,
      isEdit: true,
      isDel: true,
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    height: 'auto',
    proxyConfig: {
      enabled: false,
    },
  });

  // 操作按钮（权限控制）
  const createActions = record => {
    const actions: ActionItem[] = [
      {
        label: t('common.detailText'),
        onClick: () => {
          console.log(record);
        },
      },
      {
        label: '编辑',
        onClick: () => {},
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除',
          confirm: () => {
            tableRef.value?.remove(record);
          },
        },
      },
    ];

    return actions;
  };
</script>
