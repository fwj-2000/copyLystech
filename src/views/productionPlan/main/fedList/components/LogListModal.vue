<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="供应商交期变更记录" width="800px" :showOkBtn="false">
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSupplierDeliveryList } from '/@/api/mps/productionPlan/MPS';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { logListColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload', 'selectPOForChild', 'refreshMainTableExpand']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reload, getSelectRows, reloadColumn, getSelectRowKeys, reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-PODetailList',
      columns: logListColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'FeedListColumn',
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init({ row }) {
    changeLoading(true);
    const { code, data } = await getSupplierDeliveryList(row.inMaterialNo).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      reloadData(data);
    }
  }
</script>
