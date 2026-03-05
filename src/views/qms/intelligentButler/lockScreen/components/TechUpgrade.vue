<template>
  <div class="tech-upgrade h-[100%]">
    <Grid> </Grid>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const { t } = useI18n();

  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: [],
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const columns = [
    { title: t('dict.CommonCol.seq'), type: 'seq', field: 'index', width: 50 },
    {
      title: '技改名称',
      field: 'value',
    },
    {
      title: '未使用原因',
      field: 'unUseReason',
      // sortable: true,
    },
    {
      title: '状态',
      field: 'isUse',
      cellRender: {
        name: 'Tag',
        options: [
          { id: 1, fullName: '已使用', theme: 'green', rowKey: 'statusDesc' },
          { id: 0, fullName: '未使用', theme: 'gray', rowKey: 'statusDesc' },
        ],
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-lockScreen-techUpGrade-list',
      columns,
      i18nConfig: {
        moduleCode: 'LockScreenColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
    },
  });

  watch(
    () => props.chartData,
    () => {
      gridApi.reloadData(props.chartData);
    },
  );

  onMounted(() => {});
</script>
<style lang="less" scoped>
  .tech-upgrade {
    padding-top: 12px;
  }
</style>
