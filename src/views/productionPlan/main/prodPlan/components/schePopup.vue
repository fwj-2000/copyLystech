<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :title="t('下推排程交期')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup top-0">
    <div class="mb-14px p-12px h-full">
      <Grid></Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getEditScheColumns } from '../config';
  import { getMasterProductionPlanDetail, pushScheduleDelivery } from '/@/api/mps/productionPlan/prodPlan';
  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  const [Grid, { reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'targetTable',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
      columns: getEditScheColumns(),
    },
  });
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init({ ids }) {
    changeLoading(true);
    const { data, code } = await getMasterProductionPlanDetail({ ids }).finally(() => changeLoading(false));
    if (code === 200) {
      reloadData(data);
    }
  }
  async function handleSave() {
    changeLoading(true);
    const tableData = getDataSource();
    const { code, msg } = await pushScheduleDelivery(tableData).finally(() => changeLoading(false));
    if (code === 200) {
      createMessage.success(msg);
      closePopup();
      emits('reload');
      return;
    }
    createMessage.error(msg);
  }
</script>
