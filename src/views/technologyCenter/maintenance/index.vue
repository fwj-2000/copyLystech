<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="handleApprove(-1)"> {{ t('dict.WorkOrder.DataSources.1') }} </a-button>
            <!--            <a-button> {{ t('common.batchExport') }}</a-button>-->
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ApplyPop @register="registerApplyPop" @refresh="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { getColumns, getFormConfig } from '/@/views/technologyCenter/maintenance/CONFIG';
  import { getCostcenter } from '/@/api/engineering/costCenter';
  import { formatTableDefaultText } from '/@/utils';
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ApplyPop from './components/ApplyPop.vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import add from './components/add.vue';

  defineOptions({ name: `technologyCenter-maintenance` });

  const { t } = useI18n();
  const state = reactive({
    cacheList: [],
    index: 0,
  });

  const [registerApplyPop, { openPopup }] = usePopup();
  const [registerForm, { openModal: openFormModal }] = useModal();

  // const [registerTable, { reload, getForm, getSelectRowKeys, setSelectedRowKeys, getFetchParams }] = useTable({
  //   api: getCostcenter,
  //   columns: getColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   transformCellText: ({ text }) => {
  //     return formatTableDefaultText(text);
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: t('views.business.quota.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'MaintenanceColumn',
  //   },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'technologyCenter-maintenance-list',
      columns: getColumns(),
      useSearchForm: true,
      // toolbarConfig: {
      //   superQuery: true, //高级查询
      // },
      api: getCostcenter,
      bordered: true,
      showIndexColumn: true,
      transformCellText: ({ text }) => {
        return formatTableDefaultText(text);
      },
      tableSetting: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, getFetchParams } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }

  function handleEdit(record) {
    openFormModal(true, { ...record, businessType: record.businessType?.toString() });
  }
  function handleApprove() {
    openPopup(true, { ids: getSelectRowKeys() });
  }
</script>
