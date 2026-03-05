<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    @ok="handleSave"
    :title="t('routes.technologyCenter-maintenance')"
    :okText="t('common.submit')"
    destroyOnClose
    class="full-popup pb-10px">
    <Subtitle class="mt-20px" :title="t('dict.CommonCol.costCenter')" />
    <Grid class="grid-h">
      <template #action="{ row, $rowIndex }">
        <TableAction outside :actions="getTableActions($rowIndex, row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ActionItem, useTable } from '/@/components/Table';
  import { getCostcenterset, saveCostcenter } from '/@/api/engineering/costCenter';
  import { editColumns, addSchema } from '/@/views/technologyCenter/maintenance/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { buildUUID } from '/@/utils/uuid';
  import { ref, toRaw } from 'vue';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const ids = ref('');
  const emits = defineEmits(['refresh']);

  const [Grid, { getDataSource, query, reloadData }] = useVbenVxeGrid({
    //此功能需要接口配置，暂不开放
    // formOptions: {
    //   collapsed: true,
    //   showCollapseButton: true,
    //   submitOnEnter: true,
    //   commonConfig: {
    //     componentProps: {},
    //     labelClass: 'w-0',
    //   },
    //   wrapperClass: 'grid grid-cols-6 gap-4',
    //   schema: addSchema,
    //   i18nConfig: {
    //     moduleCode: 'MaintenanceColumn',
    //     transferRange: ['placeholder'],
    //   },
    // },
    gridOptions: {
      id: 'technologyCenter-maintenance-maintainList',
      api: getCostcenterset,
      columns: editColumns,
      pagerConfig: {
        autoHidden: true,
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'uuid',
      },
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
      },
      beforeFetch: params => {
        params.ids = ids.value.toString();
        return params;
      },
      afterFetch: data => {
        const list = data.list.map(item => ({
          ...item,
          uuid: item.id,
          businessType: item.businessType?.toString(),
          onEdit: true,
          editable: true,
        }));
        return list;
      },
    },
  });

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', { index }),
      },
      //此功能需要接口配置，暂不开放
      // {
      //   label: '',
      //   color: 'error',
      //   icon: 'icon-ym icon-ym-delete',
      //   onClick: handleChangeTable.bind(null, 'delete', { index }),
      // },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'copy': {
        const copyData = getDataSource()[data.index];
        // insertAt(
        //   {
        //     ...toRaw(copyData),
        //     uuid: buildUUID(),
        //     id: undefined, //最终获取的时候还是有值!!
        //   },
        //   data.index + 1,
        // );
        const tableData = getDataSource();
        tableData.splice(data.index + 1, 0, {
          ...toRaw(copyData),
          uuid: buildUUID(),
          id: undefined, //最终获取的时候还是有值!!
        });
        reloadData(tableData);
        break;
      }

      case 'delete': {
        let tableDataList = getDataSource();
        tableDataList.splice(data.index, 1);
        reloadData(tableDataList);
        break;
      }
    }
  }

  function handleSave() {
    const list = getDataSource();
    list.forEach(item => {
      if (item.id?.length != 18) {
        delete item.id;
      }
    });
    saveCostcenter(list).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        closePopup();
        emits('refresh');
      } else {
        createMessage.error(msg);
      }
    });
  }

  function init(data) {
    ids.value = data.ids;
    query();
    console.log('init');
  }
</script>
<style lang="less" scoped>
  .grid-h {
    height: calc(100% - 74px);
  }
</style>
