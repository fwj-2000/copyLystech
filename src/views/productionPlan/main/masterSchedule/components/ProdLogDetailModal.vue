<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="modalTitle" :showOkBtn="false" width="700px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getupdateweekspps } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register']);
  const { t } = useI18n();

  const [registerModal, { changeLoading }] = useModalInner(init);

  const id = ref('');
  const modalTitle = ref('');
  const columns = [
    {
      title: '建议排产数',
      field: 'ppsCount',
      width: 100,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '排产触发周数',
      field: 'triggerWeeksPPS',
      width: 100,
    },
    {
      title: '排产上限周数',
      field: 'upperWeeksPPS',
      width: 100,
    },
    {
      title: '排产释放周数',
      field: 'releaseWeeksPPS',
      width: 100,
    },
    {
      title: '更新时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];

  const [Grid, { reload, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-list-ProdLogDetailModal',
      columns,
      showIndexColumn: true,
      api: getupdateweekspps,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      height: 400,
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
      beforeFetch: params => {
        return {
          ...params,
          id: id.value,
          updatePPSType: modalTitle.value == '建议排产数更新记录' ? 1 : 2,
        };
      },
      position: 'modal',
    },
  });

  async function init(data) {
    changeLoading(true);
    modalTitle.value = data.title;
    id.value = data.id;
    columns[1].title =
      modalTitle.value == '建议排产数更新记录' ? t('dict.MasterDemandPlanColumn.suggestPPSCount') : t('dict.MasterDemandPlanColumn.requirePPSCount');
    reloadColumn(columns);
    await reload();
    changeLoading(false);
  }
</script>
