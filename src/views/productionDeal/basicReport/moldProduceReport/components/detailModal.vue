<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.partDetail')" :showOkBtn="false" width="1200px" destroy-on-close>
    <Grid>
      <template #toolbar-actions>
        <a-space>
          <!-- 批量导出 -->
          <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
        </a-space>
      </template>
      <!-- 工艺节点记录 -->
      <template #routeMap="{ row }">
        <div class="process-panel">
          <a-steps :current="processIndex(row.routeDataList, row.currentNodeId)" size="small">
            <a-step v-for="(item, index) in row.routeDataList" :key="index" :title="item.processDesc" />
          </a-steps>
        </div>
      </template>
    </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getDetailPage, exportDetail } from '/@/api/productionDeal/moldProduceReport';
  import { downloadByUrl } from '/@/utils/file/download';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  interface State {
    moldDetailId: string;
  }

  const state = reactive<State>({
    moldDetailId: '',
  });

  const columns = [
    {
      title: '工单号',
      field: 'workOrderNo',
      width: 120,
    },
    {
      title: '零件编号',
      field: 'partNo',
      width: 80,
    },
    {
      title: '零件名称',
      field: 'partName',
      width: 100,
    },
    {
      title: '零件数量',
      field: 'partQuantity',
      width: 80,
    },
    {
      title: '工艺节点记录',
      field: 'routeMap',
      slots: {
        default: 'routeMap',
      },
      visible: true,
      showOverflow: false,
      resizable: true,
      width: 646,
    },
    {
      title: '零件耗时（H）',
      field: 'partWorkHours',
      width: 100,
    },
    {
      title: '当前处理人',
      field: 'handleUser',
      width: 120,
    },
    {
      title: '预估总工时（H）',
      field: 'sumPresetHours',
      width: 120,
    },
  ];

  const [registerModal] = useModalInner(init);

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-moldProduceReport-detailList',
      columns,
      api: getDetailPage,
      height: 550,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MoldProduceReportColumn',
      },
      beforeFetch: params => {
        const _params = {
          ...params,
          moldDetailId: state.moldDetailId,
        };
        return _params;
      },
    },
  });

  //导出
  const handleExport = async () => {
    const res = await exportDetail({ moldDetailId: state.moldDetailId });
    const { code, data, msg } = res;
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
      message.success(msg);
    }
  };

  const processIndex = (routeMapList, currentNodeId) => {
    return routeMapList?.findIndex(item => item.nodeId === currentNodeId);
  };

  async function init({ moldDetailId }) {
    state.moldDetailId = moldDetailId;
    reload();
  }
</script>

<style lang="less" scoped>
  .process-panel {
    padding: 12px 0 6px;
    overflow: auto;
    scrollbar-width: thin; /* Firefox 初始细滚动条 */
    scrollbar-color: transparent transparent;

    ::v-deep(.ant-steps-item) {
      flex: none;
      min-width: 140px;
    }

    ::v-deep(.ant-steps-item-process),
    ::v-deep(.ant-steps-item-finish) {
      .ant-steps-item-icon {
        background-color: rgb(82 196 26 / 10%);
        border-color: rgb(82 196 26 / 10%);
      }

      .ant-steps-item-title {
        max-width: 110px;
        font-size: 13px;
        white-space: normal;

        &::after {
          background-color: #52c41a !important;
        }
      }

      .ant-steps-icon {
        color: #52c41a;
      }
    }
  }

  .process-panel::-webkit-scrollbar {
    width: 8px; /* WebKit 初始宽度 */
  }

  .process-panel::-webkit-scrollbar-thumb {
    background: transparent; /* 默认透明 */
    border-radius: 4px;
  }

  /* 鼠标悬停时显示 */
  .process-panel:hover {
    scrollbar-color: rgb(0 0 0 / 30%) transparent; /* Firefox */
  }

  .process-panel:hover::-webkit-scrollbar-thumb {
    background: rgb(0 0 0 / 30%); /* WebKit 出现颜色 */
  }
</style>
