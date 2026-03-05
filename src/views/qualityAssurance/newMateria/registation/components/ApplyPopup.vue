<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    :title="t('routes.qualityAssurance-newMateria-registation')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <a-button @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="p-10px h-full">
      <Subtitle :title="t('routes.qualityAssurance-newMateria-registation')"></Subtitle>
      <Grid style="height: calc(100% - 40px)">
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { addColumns } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { storageNewMaterial, updateNewMaterial, getDetails } from '/@/api/quanlity/newMetarial';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const { createMessage } = useMessage();

  const emits = defineEmits(['reload', 'register']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [Grid, { getDataSource, reloadData }] = useVbenVxeGrid({
    gridOptions: {
      columns: addColumns,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
      clipConfig: {
        isPaste: true,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });
  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        reloadData(
          r.data.map(item => {
            item = {
              ...item,
              onEdit: true,
              editable: true,
            };
            return item;
          }),
        );
      }
    } catch (error) {
      closePopup();
      throw error;
    }
    changeLoading(false);
  }
  function handleDelete(id = '') {
    // deleteTableDataRecord(id);
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record.id),
      },
    ];
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = getDataSource().map(item => {
      return {
        id: item.id,
        qty: item.qty,
        incomingSpecifications: item.incomingSpecifications,
        iqcUserId: item.iqcUserId,
      };
    });
    try {
      const r = type == 'storage' ? await storageNewMaterial(params) : await updateNewMaterial(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        if (type !== 'storage') {
          closePopup();
          emits('reload');
        }
      }
      changeOkLoading(false);
    } catch (error) {
      changeOkLoading(false);
      throw error;
    }
  }
</script>
