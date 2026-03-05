<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- <a-button type="primary"
                        @click="handleAdd()">{{ t('common.add') }}</a-button>

              <SingleUpload v-for="(item, idx) in uploadButtonList"
                            :key="idx"
                            v-bind="item"
                            :afterUpload="reload"></SingleUpload>
              <a-button @click="handleExport">下载模版</a-button>

              <ModelConfirmButton v-bind="{ modelConfirm: {onOk: handleAction.bind(null, 4), },}">
                <span>{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton> -->
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <!-- <ApplyPop @register="registerApplyPop"
              @reload="reload" /> -->
    <UpdateModal @register="registerUpdatePop" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  defineOptions({ name: 'dashboard-vc-statPage' });
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';

  import ApplyPop from './components/ApplyPopupVxe.vue';
  import UpdateModal from './components/UpdateModal.vue';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';

  import { columnsVxe, formSchema, uploadButtonList } from './config';

  import { useModal } from '/@/components/Modal';
  import { ModelConfirmButton } from '/@/components/Button';
  import { getStatPage } from '/@/api/dashbord/vc';

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerUpdatePop, { openModal: openUpdateModdal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: false,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
    },
    gridOptions: {
      id: 'dashboard-vc-basePage',
      showIndexColumn: false,
      columns: columnsVxe,
      api: getStatPage,
      beforeFetch: params => {
        return {
          ...params,
        };
      },
    },
  });
  const { getSelectRowKeys, getSelectRows, reload, clearSelectedRowKeys, getFetchParams } = gridApi;
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goDetail.bind(null, record),
      },
    ];
  }

  function goDetail(record) {
    openUpdateModdal(true, record);
  }
</script>
