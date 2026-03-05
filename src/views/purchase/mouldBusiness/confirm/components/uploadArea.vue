<template>
  <div class="upload-wrapper-item">
    <a-upload v-if="!disabled" class="mb-10px block" :multiple="true" v-bind="customerUploadOption">
      <a-button type="primary" ghost>
        {{ t('component.upload.uploadFile') }}
      </a-button>
      <span class="upload-tip">{{ t('component.upload.supportTip') }}</span>
    </a-upload>
    <a-upload-dragger
      :multiple="true"
      :disabled="props.disabled || state.customerFileList.findIndex(item => item.status == 1) !== -1"
      :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
      v-bind="customerUploadOption">
      <div v-if="state.customerFileList.length <= 0" class="before-box">
        {{ t('component.upload.canDragToUpload') }}
      </div>
      <div v-else>
        <a-table :data-source="state.customerFileList" bordered :columns="props.columns" :pagination="false" class="pic-list" :scroll="{ y: 340 }">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'name'">
              <a style="width: 120px" @click.stop="handlePreview(record)">{{ record.originFileName || record.fileName }}</a>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" @click.stop="handleDownload(record)">
                {{ t('component.upload.download') }}
              </a-button>
              <a-button type="link" :disabled="disabled" @click.stop="handleDelete(index)">{{ t('common.delText') }} </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </a-upload-dragger>

    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import type { UploadFile } from 'ant-design-vue';
  import type { BasicColumn } from '/@/components/Table';

  import { reactive, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { downloadByUrl } from '/@/utils/file/download';
  // import { http2s } from '/@/adapter/utils';
  import { uploadInstallFile } from '/@/api/finance/materialPrice';
  import { downloadFile } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';

  import { PreviewModal } from '/@/components/Upload';

  const { t } = useI18n();

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array as PropType<Array<BasicColumn>>,
      default: () => {
        return [
          {
            title: useI18n().t('component.table.index'),
            dataIndex: 'seq',
            key: 'seq',
            width: 80,
            customRender: ({ index }) => index + 1,
          },
          {
            title: useI18n().t('common.attachment'),
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: useI18n().t('common.action'),
            dataIndex: 'action',
            width: 160,
          },
        ];
      },
    },
    filePath: {
      type: String,
      default: 'moldMaintenance',
    },
    fileList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });
  const emits = defineEmits(['update:fileList']);

  // 图标文字图例信息
  enum UploadStatus {
    // 未上传
    BeforeUploading = 'BeforeUploading',
    // 上传中
    Uploading = 'uploading',
    // 上传成功
    Success = 'success',
    // 上传失败
    Error = 'error',
  }

  const state = reactive<{ customerFileList: Array<{ status: number; uid: string | number; originFileName: string; filePath: string; file?: File }> }>({
    customerFileList: [],
  });

  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  const customerUploadOption = {
    name: 'file',
    showUploadList: false,
    customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };

  watch(
    () => props.fileList,
    val => {
      state.customerFileList = [...val];
    },
    { immediate: true },
  );

  function beforeUpload(_file: any, _fileList: Array<any>) {
    // if (state.customerFileList.find(item => item.status == 1)) return false;
    // customerState.uploadStatus = UploadStatus.BeforeUploading;
    // const { customerFileList } = state;
    // let flag = false;
    // fileList.forEach(file => {
    //   if (!customerFileList.find(item => item.uid == file.uid || item.originFileName == file.name)) {
    //     flag = true;
    //   }
    // });
    // return flag;
    return true;
  }

  async function customerUpload(info: any) {
    try {
      customerState.uploadFileInfo = info.file;
      await uploadInstallFile({ fileList: info.file }).then(res => {
        const uploadInfo = res?.data?.[0];
        if (!uploadInfo) {
          return;
        }
        state.customerFileList.push({ ...uploadInfo, filePath: uploadInfo.fullPath, fileName: uploadInfo.originFileName });
      });
      emits('update:fileList', [...state.customerFileList]);
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    }
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item: any) {
    const params = {
      name: item.fileName,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      filePath: item.fullPath || item.filePath,
    };
    filePreviewRef.value?.init(params);
  }

  // 获取文件预览的名称
  function getFileName(data) {
    return (data.name || data.fileName || '').trim();
  }

  // 获取文件url的值
  function getFileUrl(data) {
    return (data.url || data.filePath || '').replace(/\\/g, '/'); // 替换反斜杠为斜杠
  }

  const globSetting = useGlobSetting();
  // 获取文件url--新版
  function getFileUrlV2(data) {
    let filePath = getFileUrl(data).replace(globSetting.downloadUrl, '');
    // 当filePath匹配到域名时，先去掉域名
    const fileName = getFileName(data);
    // 如果filePath没有匹配到文件格式，则拼接fileName
    if (!filePath.includes('.')) {
      filePath = filePath + '/' + fileName;
    }
    const fileUrl = `${globSetting.downloadUrl}?filePath=${filePath}&fullfilename=${fileName}&fileName=${fileName}`;
    return fileUrl;
  }

  function handleDownload(record: any) {
    downloadFile({
      filePath: getFileUrlV2(record),
      fileName: record.fileName,
    });
  }

  function handleDelete(index: number) {
    state.customerFileList.splice(index, 1);
    emits('update:fileList', [...state.customerFileList]);
  }
</script>

<style scoped lang="less">
  .upload-wrapper-item {
    height: 100%;
  }

  .before-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100%);
    color: #999;
  }

  .upload-tip {
    color: #999;
    font-size: 14px;
    padding-left: 20px;
  }

  :deep(.ant-upload.ant-upload-drag.upload-pic) {
    height: calc(100% - 50px);
  }

  :deep(span.ant-upload.ant-upload-btn) {
    padding: 0;
    height: calc(100%);
  }
</style>
