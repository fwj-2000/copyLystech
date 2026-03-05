<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :title="t('匹配确认单')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <ScrollContainer>
      <Grid>
        <template #customHeader>
          <i :class="collapsable1 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable1Event"></i>
          <span>Name</span>
        </template>
      </Grid>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const emits = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const columns = [
    {
      field: 'checkbox',
      type: 'checkbox',
    },
    {
      title: '主生产表',
      field: 'tableName',
      headerClassName: 'bg-purple',
      children: [
        {
          title: '表名',
          field: 'tableName',
          headerClassName: 'bg-purple',
          slots: {
            header: 'customHeader',
          },
        },
        {
          title: '描述',
          field: 'tableDesc',
          headerClassName: 'bg-purple',
        },
        {
          title: '选择',
          field: 'selected',
          headerClassName: 'bg-purple',
        },
        {
          title: 'rate',
          field: 'rate',
          headerClassName: 'bg-purple',
        },
        {
          title: 'address',
          field: 'address',
          headerClassName: 'bg-purple',
        },
      ],
    },
    {
      title: '主需求表',
      field: 'tableDesc',
      children: [
        {
          title: '表名',
          field: 'tableName1',
        },
        {
          title: '描述',
          field: 'tableDesc1',
        },
        {
          title: '选择',
          field: 'selected1',
        },
        {
          title: 'roe',
          field: 'role',
        },
        {
          title: '性别',
          field: 'sex',
        },
      ],
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'targetTable',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
      columns: columns,
      data: [
        {
          tableName: '生产计划表',
          tableDesc: '生产计划表描述',
          selected: '是',
          rate: '10%',
          address: '地址A',
          tableName1: '需求计划表',
          tableDesc1: '需求计划表描述',
          selected1: '否',
          role: '管理员',
        },
      ],
    },
  });
  const { getDataSource } = gridApi;
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  async function init(data) {
    console.log(data);
  }

  const collapsable1 = ref(false);
  const collapsable2 = ref(false);
  const collapsable1Event = () => {
    const fields = ['role', 'sex'];
    collapsable1.value = !collapsable1.value;
    fields.forEach(field => {
      if (collapsable1.value) {
        gridApi.grid.showColumn(field);
      } else {
        gridApi.grid.hideColumn(field);
      }
    });
  };

  const collapsable2Event = () => {
    const fields = ['rate', 'address'];
    collapsable2.value = !collapsable2.value;
    fields.forEach(field => {
      if (collapsable1.value) {
        gridApi.grid.showColumn(field);
      } else {
        gridApi.grid.hideColumn(field);
      }
    });
  };
</script>
<style lang="less" scoped>
  :deep(.scrollbar__view) {
    padding: 10px;
    height: 100%;
  }
</style>
