<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="FC需求数" :showOkBtn="false" width="1000px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getFcMiddleDataList } from '/@/api/mps/productionPlan/fcMiddleData';
  import { getYearWeekFormat } from '/@/views/productionPlan/main/utils/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register']);
  const { t } = useI18n();

  const [registerModal, { changeLoading }] = useModalInner(init);

  const apiparams = ref({});

  const [Grid, { reload, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-FcDetailModal',
      columns: [],
      api: getFcMiddleDataList,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      height: 200,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...apiparams.value,
        };
      },
      position: 'modal',
    },
  });

  async function init(data) {
    changeLoading(true);
    const { years, week, fcMiddleId } = data.row;
    apiparams.value = {
      fcMiddleId: fcMiddleId,
      searchDate: `${years}WK${week}`,
    };
    // 重新加载表格数据和表头
    if (years && week) {
      reloadColumn(getYearWeekFormat({ year: years, week: week }));
    }
    await reload();
    changeLoading(false);
  }
</script>
