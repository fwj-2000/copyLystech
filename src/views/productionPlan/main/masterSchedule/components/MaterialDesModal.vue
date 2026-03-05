<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.MasterDemandPlanColumn.mergeMaterialDes')" :showOkBtn="false" width="750px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getMergeMaterialRecord } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register']);
  const { t } = useI18n();
  const id = ref('');

  const [registerModal, { changeLoading }] = useModalInner(init);

  const columns = [
    {
      title: '替代料号',
      field: 'replaceMaterial',
      minwidth: 160,
    },
    {
      title: '原始料号',
      field: 'originalMateial',
      minwidth: 160,
    },
    {
      title: '库存',
      field: 'stock',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '在制',
      field: 'inProduction',
      i18nField: 'inProductionTrans',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '在途',
      field: 'inTransit',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    },
  ];

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-list-MaterialDesModal',
      columns,
      showIndexColumn: true,
      api: getMergeMaterialRecord,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      proxyConfig: {
        response: {
          result: 'data',
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      position: 'modal',
      beforeFetch: params => {
        return {
          ...params,
          id: id.value,
        };
      },
    },
  });

  async function init(data) {
    changeLoading(true);
    id.value = data.id;
    await reload();
    changeLoading(false);
  }
</script>
