<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    @ok="handleSubmit"
    :showCancelBtn="true"
    :title="t('dict.ProductTypeColumn.Maintenance')"
    destroyOnClose
    class="full-popup p-10px">
    <Grid> </Grid>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { getFactorymoldcode, saveFactorymoldcode } from '/@/api/engineering/costCenter';
  import { getColumns } from '/@/views/technologyCenter/expanse/CONFIG';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const emit = defineEmits(['refresh']);

  const { createMessage } = useMessage();
  const [registerPopup, { closePopup }] = usePopupInner(init);

  // const [registerTable, { getDataSource, setTableData }] = useTable({
  //   //api: getFactorymoldcode,
  //   columns: getColumns(),
  //   showTableSetting: false,
  //   bordered: true,
  //   i18nConfig: {
  //     moduleCode: 'MaintenanceColumn',
  //   },
  //   // afterFetch: data => {
  //   //   const list = data.map(item => ({
  //   //     ...item,
  //   //     onEdit: !item.bindCostCenter,
  //   //     editable: !item.bindCostCenter,
  //   //   }));
  //   //   return list;
  //   // },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'technologyCenter-expanse-Maintenance-list',
      columns: getColumns(),
      showIndexColumn: true,
      pagerConfig: { autoHidden: false },
      // 表格边框
      border: true,
      // 是否显示表格设置按钮
      toolbarConfig: { custom: false },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
      },
    },
  });
  const { getDataSource, reloadData } = gridApi;

  function init(data) {
    console.log(data);
    console.log('init');
    getFactorymoldcode({ factoryCodes: data.factoryCodes.join(',') }).then(res => {
      console.log(res.data.list);
      reloadData(
        res.data.list.map(item => ({
          ...item,
          onEdit: !item.bindCostCenter,
          editable: !item.bindCostCenter,
        })),
      );
    });
  }

  function handleSubmit() {
    console.log('handleSubmit');
    const list = getDataSource();
    saveFactorymoldcode(list).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        emit('refresh');
        closePopup();
      } else {
        createMessage.error(msg);
      }
    });
  }
</script>
