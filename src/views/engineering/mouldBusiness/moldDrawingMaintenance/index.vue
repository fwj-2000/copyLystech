<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 上传 -->
              <a-button v-auth="'btn_upload'" :loading="uploading" type="primary" @click="handleToUpload">{{ t('common.uploadDrawingText') }}</a-button>
              <!-- 重新上传 -->
              <a-button v-auth="'btn_reUpload'" :loading="uploading" type="primary" ghost @click="openReUploadPop">{{ t('common.reUpload') }}</a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" type="primary" ghost @click="handleBatchDelete()">{{ t('common.batchDelText') }}</a-button>
              <!-- 撤回 -->
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('views.filings.sureRevokeData'),
                    onOk: handleRecall.bind(null),
                  },
                  type: 'primary',
                  ghost: true,
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.exportText') }}</a-button>
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
    <UploadFilePop @register="registerUploadFilePop" @reload="reload" />

    <UploadBtn
      v-auth="'btn_upload'"
      ref="uploadRef"
      type="primary"
      :buttonText="t('common.uploadDrawingText')"
      :maxFileSize="30"
      class="hidden"
      :customUpload="customUpload" />
  </div>
</template>

<script lang="ts" setup>
  import { debounce } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig, STATUS_ENUM, getExportColumns } from '/@/views/engineering/mouldBusiness/components/moldDrawingConfig';
  import { ref } from 'vue';
  import { uploadfiles } from '/@/api/basic/common';
  import {
    getMoldDrawingUploadPage,
    checkCreateMoldDrawing,
    getNodeList,
    bulkMoldDrawingDelete,
    bulkMoldDrawingWithdraw,
  } from '/@/api/engineering/moldDrawingLibrary';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { ModelConfirmButton } from '/@/components/Button';
  import FileListCell from '../components/fileListCell.vue';
  import { UploadBtn } from '/@/components/Upload';
  import MoldDrawingRecordModal from '/@/views/engineering/mouldBusiness/components/moldDrawingRecordModal.vue';
  import UploadFilePop from './components/uploadFilePop.vue';

  defineOptions({ name: 'engineering-mouldBusiness-moldDrawingMaintenance' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

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
      id: 'engineering-mouldBusiness-moldDrawingMaintenance',
      columns: getColumn(),
      api: getMoldDrawingUploadPage,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload } = gridApi;

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();

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

  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkMoldDrawingWithdraw(idList).finally(reload);
    }
    createMessage.warn(t('common.selectText'));
  }

  const [registerMoldDrawingRecordModal, { openModal: openMoldDrawingRecordModal }] = useModal();
  /** 打开操作记录弹窗 */
  function showRecordModal(record) {
    openMoldDrawingRecordModal(true, { id: record.id });
  }

  const uploadRef = ref<InstanceType<typeof UploadBtn>>();
  const rowsInfo = ref<Array<any>>([]);
  const uploading = ref<boolean>(false);
  /** 是否重新提交 */
  const isResubmit = ref<boolean>(false);
  /** 上传按钮事件处理 */
  async function handleToUpload() {
    rowsInfo.value = gridApi.getSelectRows();
    if (rowsInfo.value.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    if (rowsInfo.value.length > 1) {
      return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    }

    // 上传图纸时：模具料号的所有版本状态需为结案（但是结案的数据如果模具料号的图纸状态都是废弃不允许上传）
    if (
      !(await checkCreateMoldDrawing(rowsInfo.value[0].id)
        .then(() => true)
        .catch(() => false))
    ) {
      return false;
    }

    isResubmit.value = false;
    uploadRef.value?.click();
  }

  const uploadFileTasks = ref<Array<Promise<any>>>([]);
  /**
   * 自定义上传方法，主要是为页面加载状态的显示，和批量上传图片弹窗的显示提供合适的时机
   * 实际上传功能与`UploadBtn`组件的`beforeUpload`方法的默认上传方式相同
   */
  function customUpload(file: File) {
    uploadFileTasks.value.push(
      uploadfiles({
        fileList: file,
      }),
    );
    uploading.value = true;
    debounceCustomUpload();
    return false;
  }

  const debounceCustomUpload = debounce(() => {
    Promise.all(uploadFileTasks.value)
      .then(res => {
        uploadFileTasks.value.length = 0;
        showUploadModal(res.map(item => ({ ...item.data[0], filePath: item.data[0].fullPath, fileName: item.data[0].originFileName })));
      })
      .finally(() => {
        uploading.value = false;
      });
  }, 300);

  const [registerUploadFilePop, { openPopup: openUploadFilePop }] = usePopup();
  /**
   * 打开上传图纸界面
   */
  function showUploadModal(fileList: Array<{ fileName: string; filePath: string }>) {
    uploading.value = false;
    openUploadFilePop(true, { row: rowsInfo.value?.[0] || {}, fileList: [...fileList], isResubmit: isResubmit.value });
    uploadRef.value?.clearUploadFileList();
  }

  /** 批量删除 */
  function handleBatchDelete() {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('common.deleteObjectText'));
    const tips = t('common.delTip');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tips,
      onOk: async () => {
        return bulkMoldDrawingDelete(ids).then(() => {
          createMessage.success(t('common.operatorSuccess'));
          reload();
          gridApi.clearSelectedRowKeys();
        });
      },
    });
  }

  const allowStatus = [STATUS_ENUM.撤回, STATUS_ENUM.驳回];
  /** 重新上传 */
  function openReUploadPop() {
    rowsInfo.value = gridApi.getSelectRows();
    if (rowsInfo.value.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    if (rowsInfo.value.length > 1) {
      return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    }

    // 只允许【撤回(3)】、【驳回(4)】的数据重新提交
    if (!allowStatus.includes(`${rowsInfo.value[0].status}` as STATUS_ENUM)) {
      return createMessage.warning(t('common.allowStatusTodo', [`${t('dict.MoldApply.DrawingStatus.3')}、${t('dict.MoldApply.DrawingStatus.4')}`]));
    }

    isResubmit.value = true;
    uploadRef.value?.click();
  }
</script>
