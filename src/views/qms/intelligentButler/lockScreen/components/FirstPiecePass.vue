<template>
  <div class="first-piece-pass h-[100%]">
    <div class="piece-cards">
      <div class="piece-item piece-OK">
        <div class="piece-item-name">{{ t('dict.CommonCol.firstPieceOKQuantity') }}</div>
        <div class="piece-item-number">{{ props.chartData.firstOkCount }}</div>
      </div>
      <div class="piece-item piece-NG">
        <div class="piece-item-name">{{ t('dict.CommonCol.firstPieceNGQuantity') }}</div>
        <div class="piece-item-number">{{ props.chartData.firstNgCount }}</div>
      </div>
    </div>
    <div class="grid-box">
      <Grid>
        <!-- <template #firstResult="{ row }">
          <a-tag :color="row.firstResult == 'OK' ? 'success' : 'error'">● {{ row.firstResult }}</a-tag>
        </template> -->
      </Grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { getProductionTableData } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';

  const { t } = useI18n();

  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        tableList: [],
        firstOkCount: 0,
        firstNgCount: 0,
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const columns = [
    {
      title: '机台编号', // 要进行合并
      field: 'machineNo',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    // 产品名称
    {
      title: '产品名称',
      field: 'productName',
    },
    // 送检时间
    {
      title: '送检时间',
      field: 'sendTime',
      // cellRender: {
      //   name: 'Date',
      //   format: 'mm:ss',
      // },
    },
    // 回复时间
    {
      title: '回复时间',
      field: 'replyTime',
      // cellRender: {
      //   name: 'Date',
      //   format: 'mm:ss',
      // },
    },
    // 首件结果
    {
      title: '首件结果',
      field: 'firstResult',
      // slots: {
      //   default: 'firstResult',
      // },
      cellRender: {
        name: 'Tag',
        options: [
          { id: 'OK', fullName: 'OK', theme: 'green' },
          { id: 'NG', fullName: 'NG', theme: 'red' },
        ],
      },
    },
    // 检验人
    {
      title: '检验人',
      field: 'checkName',
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-lockScreen-firstPiecePass-list',
      columns,
      // api: getProductionTableData,
      i18nConfig: {
        moduleCode: 'LockScreenColumn',
        otherConfig: {
          // minWidth: 0,
          resizeable: true,
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      showOverflow: false,
      pagerConfig: {
        autoHidden: true,
      },
      // proxyConfig: {
      //   autoLoad: false,
      // },
    },
  });

  watch(
    () => props.chartData.tableList,
    () => {
      gridApi.reloadData(props.chartData.tableList);
    },
  );

  onMounted(() => {});
</script>
<style lang="less" scoped>
  .first-piece-pass {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px 0;

    .piece-cards {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      padding: 0 12px;
      margin-bottom: 6px;

      .piece-item {
        flex: 1;
        padding: 20px 0 30px 22px;
        line-height: 20px;
        color: #1d2129;
        background-position: right 0 bottom 0;
        background-size: auto 80px;
        background-repeat: no-repeat;
        border-radius: 4px;

        .piece-item-name {
          font-size: 14px;
          margin-bottom: 6px;
        }

        .piece-item-number {
          font-size: 24px;
          font-weight: 500;
        }
      }

      .piece-OK {
        background-image: url('/@/assets/images/productProgress/OK_bg.png');
        border-top: 4px solid #3fbaa4;
        background-color: #e0f2ee;
        margin-right: 16px;
      }

      .piece-NG {
        background-image: url('/@/assets/images/productProgress/NG_bg.png');
        border-top: 4px solid #ff4d4f;
        background-color: #ffe6e4;
      }
    }

    .grid-box {
      flex: 1;
    }
  }
</style>
