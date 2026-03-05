<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.saveText')"
    :title="t('common.batchUpdate')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <div class="box">
      <Subtitle :title="t('common.baseinfo')" />
      <Grid>
        <template #action="{ row }">
          <TableAction :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { batchModifyBaseInfoColumns } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem } from '/@/components/Table';
  import { getDetails, updateInfo } from '/@/api/structure/materialCode';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { Subtitle } from '/@/components/Subtitle';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      formConfig: {
        enabled: false,
      },
      columns: batchModifyBaseInfoColumns,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        enabled: true,
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        const list = r.data.map(item => {
          return {
            ...item,
            dataInvalidTime: item.dataInvalidTime ? dayjs(item.dataInvalidTime).format('YYYY/MM/DD') : '',
          };
        });
        gridApi.grid.reloadData(list);
      }
    } catch (error) {
      closePopup();
    }
    changeLoading(false);
  }

  function getTableActions(record: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record.id),
      },
    ];
  }

  function handleDelete(id = '') {
    const tabledData = gridApi.grid.getTableData().tableData;
    gridApi.grid.reloadData(tabledData.filter(item => item.id != id));
  }

  async function handleSubmit() {
    const tableData = gridApi.grid.getTableData().tableData;
    if (tableData.length == 0) {
      return createMessage.warning(t('common.noDataToSave'));
    }
    changeOkLoading(true);
    updateInfo(tableData)
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg || t('common.saveSuccessText'));
          emits('reload');
          closePopup();
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .box {
    padding: 10px;
    height: calc(100% - 38px);
  }
</style>
