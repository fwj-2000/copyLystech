<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button class="mr-12px" v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <!-- 执行工序 -->
          <template #routeMap="{ row }">
            <div class="process-panel">
              <a-steps :current="processIndex(row.routeMapList, row.realProcessName)" size="small">
                <a-step v-for="(item, index) in row.routeMapList" :key="index" :title="item" />
              </a-steps>
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getProcessTask, processTaskExport } from '/@/api/engineering/processTask';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { column, formSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-processTask' });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [Grid, { getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: formSchema,
      i18nConfig: {
        moduleCode: 'MoldPartPlanColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldRoom-processTask-list',
      columns: column,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      api: getProcessTask,
      showIndexColumn: true,
      beforeFetch: params => handleParams(params),
      i18nConfig: {
        moduleCode: 'MoldPartPlanColumn',
      },
    },
  });

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.planStartTime = params.pickerVal[0];
      params.planEndTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    return params;
  }

  const processIndex = (routeMapList, realProcessName) => {
    return routeMapList.findIndex(item => item === realProcessName);
  };

  // 批量导出
  const handleExport = () => {
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    processTaskExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  ::-webkit-scrollbar {
    height: 6px !important; /* 纵向滚动条的宽度 */
  }

  .process-panel {
    padding: 12px 0 6px;
    overflow: auto;
    scrollbar-width: thin; /* Firefox 初始细滚动条 */
    scrollbar-color: transparent transparent;

    ::v-deep(.ant-steps-item) {
      flex: none;
      min-width: 160px;

      .ant-steps-item-title {
        max-width: 120px;
        font-size: 13px;
        white-space: normal;
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
