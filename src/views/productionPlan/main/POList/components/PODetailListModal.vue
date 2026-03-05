<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('routes.productionPlan-main-POList')" width="800px" :showOkBtn="false">
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getPoOrderDeteilByPROrderNo } from '/@/api/mps/productionPlan/MPS';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PODetailListColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload', 'selectPOForChild', 'refreshMainTableExpand']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reload, reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-POList-PODetailList',
      columns: PODetailListColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'PoOrderColumn',
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
    },
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  async function init({ prOrderNo }) {
    changeLoading(true);
    const { code, data } = await getPoOrderDeteilByPROrderNo(prOrderNo).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      reloadData(data);
    }
  }
</script>
