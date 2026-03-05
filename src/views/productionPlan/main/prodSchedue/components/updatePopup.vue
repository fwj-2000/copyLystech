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
    <div>
      <Grid></Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumns } from '../config';
  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  // 可编辑列
  const editColumns: any = [
    {
      field: 'target',
      title: '排程交期',
      width: 100,
      editRender: {
        name: 'DatePicker',
      },
    },
    {
      field: 'source',
      title: '预估排程交期',
      width: 100,
      editRender: {
        name: 'DatePicker',
      },
    },
    {
      field: 'remark',
      title: '排程备注',
      width: 100,
      editRender: {
        name: 'Input',
      },
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
      columns: editColumns.concat(getColumns()),
    },
  });
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    // console.log(data);
  }
  function handleSave() {
    closePopup();
  }
</script>
