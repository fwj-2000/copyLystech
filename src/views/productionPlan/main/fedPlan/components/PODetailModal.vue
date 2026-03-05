<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('routes.productionPlan-main-POList')" :showOkBtn="false" width="1000px">
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getPODetail } from '/@/api/mps/productionPlan/MPS';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { POListColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload', 'selectPOForChild', 'refreshMainTableExpand']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedPlan-PODetailList',
      columns: POListColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
      },
      position: 'modal',
      height: 300,
    },
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  async function init({ row }) {
    reloadData([]);
    changeLoading(true);
    const { code, data } = await getPODetail(row.id).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      reloadData(data);
    }
  }
</script>
