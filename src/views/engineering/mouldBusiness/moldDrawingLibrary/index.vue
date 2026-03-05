<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 启用 -->
              <a-button v-auth="'btn_enable'" type="primary" ghost @click="() => showReasonModal(OPERATION_TYPE_ENUM.启用)">{{
                t('common.enableText')
              }}</a-button>
              <!-- 禁用 -->
              <a-button v-auth="'btn_disable'" danger @click="() => showReasonModal(OPERATION_TYPE_ENUM.禁用)">{{ t('common.disableText') }}</a-button>
              <!-- 废弃 -->
              <a-button v-auth="'btn_discard'" danger @click="() => showReasonModal(OPERATION_TYPE_ENUM.废弃)">{{ t('common.discard') }}</a-button>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.exportText') }}</a-button>
              <!-- 下载图纸 -->
              <a-button v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            </a-space>
          </template>
          <template #moldDrawings="{ row }">
            <FileListCell :row="row" :list="row.moldDrawings" />
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="() => handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
          <template #operation="{ row }">
            <div class="table-a" @click="() => showRecordModal(row)"> {{ t('common.detailText') }} </div>
          </template>
        </Grid>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal" />
    <MoldDrawingRecordModal @register="registerMoldDrawingRecordModal" />
    <ReasonModal @register="registerReasonModal" @reload="gridApi.reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig, getExportColumns } from '/@/views/engineering/mouldBusiness/components/moldDrawingConfig';
  import { OPERATION_TYPE_ENUM } from './config';
  import { getMoldDrawingPage, getNodeList } from '/@/api/engineering/moldDrawingLibrary';
  import { downloadMoldDrawings } from '../components/config';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import FileListCell from '../components/fileListCell.vue';
  import MoldDrawingRecordModal from '/@/views/engineering/mouldBusiness/components/moldDrawingRecordModal.vue';
  import ReasonModal from './components/reasonModal.vue';

  defineOptions({ name: 'engineering-mouldBusiness-moldDrawingLibrary' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-sampleApply-list',
      columns: getColumn(),
      api: getMoldDrawingPage,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    },
  });

  /** 节点记录 */
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  /** 导出 */
  const handleExport = async () => {
    const params = await gridApi.getFetchParams();

    openExportModal(true, {
      listQuery: { ...params },
      // TODO 联调
      api: () => Promise.resolve([]),
      exportOptions: getExportColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    });
  };

  /** 图纸下载 */
  function downloadFn() {
    let rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
    downloadMoldDrawings(rows);
  }

  const [registerMoldDrawingRecordModal, { openModal: openMoldDrawingRecordModal }] = useModal();
  /** 打开操作记录弹窗 */
  function showRecordModal(record) {
    openMoldDrawingRecordModal(true, { id: record.id });
  }

  const [registerReasonModal, { openModal: openReasonModal }] = useModal();
  /** 打开状态变更原因弹窗 */
  function showReasonModal(type: OPERATION_TYPE_ENUM) {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    openReasonModal(true, { type, ids: rows.map(item => item.id) });
  }
</script>
