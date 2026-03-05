<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.nodeRecord')" :showOkBtn="false" width="800px" destroy-on-close>
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getlabelrecordbyid } from '/@/api/productionDeal/dieCutPerPrint';
  import { STARTWORKSTATUS_OPTIONS } from './config';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const columns = [
    {
      title: '处理时间',
      field: 'handleTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '当前工序',
      field: 'currentProcess',
    },
    // 节点状态
    {
      title: t('dict.Flow.NodeStatus'),
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: STARTWORKSTATUS_OPTIONS,
      },
    },
    {
      title: '处理人',
      field: 'handleUser',
    },
    {
      title: '下道工序',
      field: 'nextProcess',
    },
    {
      title: '耗时(H)',
      field: 'workHours',
    },
  ];

  const [registerModal, { changeLoading }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-receiveMaterials-nodeList',
      columns,
      height: 300,
      showIndexColumn: true,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'ProduceBusinessColumn',
      },
    },
  });

  async function init({ id }) {
    changeLoading(true);
    const { data } = await getlabelrecordbyid({ id }).finally(() => changeLoading(false));
    gridApi.grid.loadData(data);
  }
</script>
