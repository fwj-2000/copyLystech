<template>
  <div class="upload-wrapper-item">
    <a-upload v-feature v-if="!disabled" class="mb-10px block" :multiple="true" v-bind="customerUploadOption">
      <a-button type="primary" ghost>
        {{ t('component.upload.uploadFile') }}
      </a-button>
      <span class="upload-tip">{{ t('component.upload.supportTip') }}</span>
    </a-upload>
    <a-upload-dragger
      v-feature
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
              <a style="width: 120px" @click.stop="handlePreview(record)">{{ record.name }}</a>
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
  import { downloadByUrl } from '/@/utils/file/download';
  import { http2s } from '/@/adapter/utils';

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

  // function uploadInstallFile(data: any) {
  //   return defHttp.post({
  //     url: `/api/Information/fileinfo/Upload/File`,
  //     data,
  //     headers: {
  //       'Content-Type': ContentTypeEnum.FORM_DATA,
  //     },
  //   });
  // }

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

  const state = reactive<{ customerFileList: Array<{ status: number; uid: string | number; name: string; filePath: string; file?: File }> }>({
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

  function beforeUpload(_file: any, fileList: Array<any>) {
    if (state.customerFileList.find(item => item.status == 1)) return false;
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    const { customerFileList } = state;
    let flag = false;
    fileList.map(file => {
      if (!customerFileList.find(item => item.uid == file.uid || item.name == file.name)) {
        customerFileList.unshift(file);
        flag = true;
      }
    });
    return flag;
  }

  async function customerUpload(info: any) {
    customerState.procedure = 1;
    const interval = setInterval(() => {
      if (customerState.procedure >= 99) return clearInterval(interval);
      customerState.procedure += 1;
    }, 100);
    try {
      customerState.uploadFileInfo = info.file;
      // const params = {
      //   file: info.file,
      //   filePath: props.filePath,
      // };
      // const {
      //   data: { filePath },
      // } = await uploadInstallFile(params);
      state.customerFileList.forEach(item => {
        if (item.name === info.file.name) {
          // item.filePath = filePath || '';
          item.file = info.file;
        }
      });
      emits('update:fileList', [...state.customerFileList]);
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item: any) {
    const params = {
      name: item.name || item.fileName,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      // url: item.path || item.filePath,
    };
    filePreviewRef.value?.init(params);
  }

  function handleDownload(record: any) {
    downloadByUrl({
      url: http2s(record.filePath),
      fileName: record.name,
      target: '_blank',
    });
  }

  function handleDelete(index: number) {
    state.customerFileList.splice(index, 1);
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
