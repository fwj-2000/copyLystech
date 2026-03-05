<template>
  <div class="yield h-[100%]">
    <div class="yield-cards">
      <Card
        :title="t('dict.CommonCol.actualDieCutYieldRate')"
        :content="`${props.chartData.currentYieldRate}%`"
        class="yield-cards-item mr-12px mb-12px actual-rate-bg">
        <img src="/@/assets/images/productProgress/achievement.png" class="img-icon" alt="" />
      </Card>
      <Card
        :title="t('dict.CommonCol.standardDieCutYieldRate')"
        :content="`${props.chartData.targetYieldRate}%`"
        class="yield-cards-item standard-rate-bg mb-12px">
        <img src="/@/assets/images/productProgress/plan.png" class="img-icon" alt="" />
      </Card>
      <Card :title="t('dict.CommonCol.highestYieldRate')" :content="`${props.chartData.topYieldRate}%`" class="yield-cards-item mr-12px work-time-bg">
        <img src="/@/assets/images/productProgress/workTime.png" class="img-icon" alt="" />
      </Card>
      <Card :title="t('dict.CommonCol.lastYieldRecord')" :content="`${props.chartData.lastYieldRate}%`" class="yield-cards-item machine-bg">
        <img src="/@/assets/images/productProgress/machine.png" class="img-icon" alt="" />
      </Card>
    </div>
    <div class="grid-box">
      <Grid> </Grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Card from './Card.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        currentYieldRate: 0,
        targetYieldRate: 0,
        topYieldRate: 0,
        lastYieldRate: 0,
        yieldRateDetail: [],
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const columns = [
    {
      title: '不良明细',
      field: 'badDetail',
      sortable: true,
    },
    {
      title: '不良类型',
      field: 'badType',
      sortable: true,
    },
    {
      title: '不良数量',
      field: 'badNum',
      sortable: true,
    },
    {
      title: '不良占比',
      field: 'badRate',
      sortable: true,
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-lockScreen-yield-list',
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
    () => props.chartData.yieldRateDetail,
    () => {
      gridApi.reloadData(props.chartData.yieldRateDetail);
    },
  );

  onMounted(() => {});
</script>
<style lang="less" scoped>
  .yield {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px 0;

    .yield-cards {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      padding: 0 12px;
      margin-bottom: 6px;

      .yield-cards-item {
        width: calc((100% - 12px) / 2);

        .img-icon {
          height: 100%;
        }
      }

      .actual-rate-bg {
        background: linear-gradient(94deg, #ff993a 8.55%, #ff8310 75.48%);
      }

      .standard-rate-bg {
        background: linear-gradient(94deg, rgb(127 142 178) 8.55%, rgb(87 103 142) 75.48%);
      }

      .work-time-bg {
        background: linear-gradient(94deg, rgb(75 123 236) 8.55%, rgb(48 104 236) 75.48%);
      }

      .machine-bg {
        background: linear-gradient(94deg, rgb(17 145 232) 8.55%, rgb(94 190 255) 75.48%);
      }
    }

    .grid-box {
      flex: 1;
    }
  }
</style>
