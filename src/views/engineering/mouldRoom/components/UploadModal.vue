<template>
  <BasicModal
    :title="t('dict.PurchaseQuotationColumn.UploadAttachment')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="1020"
    @register="registerModal"
    destroy-on-close
    showOkBtn
    @ok="handleConfirm">
    <div class="modal-content">
      <div class="upload-wrapper">
        <div class="upload-wrapper-item">
          <Subtitle :title="title" />
          <a-upload v-feature class="btn-upload" :multiple="true" v-bind="uploadOption">
            <div class="upload-btn-wrapper">
              <a-button type="primary" ghost :disabled="state.uploadStatus === UploadStatus.Uploading">{{ t('component.upload.choose') }} </a-button>
              <div class="tip">{{ t('component.upload.supportTip') }}</div>
            </div>
          </a-upload>
          <a-row>
            <a-col style="display: flex; justify-content: start" :span="12">{{ t('component.upload.fileName') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('component.upload.fileSize') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('component.upload.operating') }} </a-col>
          </a-row>
          <a-upload-dragger
            v-feature
            :multiple="true"
            :class="state.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
            v-bind="uploadOption"
            :disabled="state.uploadStatus !== UploadStatus.BeforeUploading">
            <!--    上传前      -->
            <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">
              <div v-if="uploadFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
              <div v-else>
                <div class="file-item" v-for="(item, index) in uploadFileList">
                  <a-row style="align-items: center; padding-bottom: 6px; border-bottom: 1px solid #ddd">
                    <a-col :span="12">
                      <div class="break">{{ item.name || '系统默认文件.xls' }}</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="item-gray ellipsis">{{ formatFileSize(item.size || 0) }}</div>
                    </a-col>
                    <a-col :span="6">
                      <a-button type="link" @click.stop="handleDeleteFile(index)"> {{ t('common.delText') }} </a-button>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </template>
            <!--    上传中      -->
            <template v-if="state.uploadStatus === UploadStatus.Uploading">
              <div class="uploading">
                <a-progress style="width: 80%" :percent="state.procedure" size="small" />
              </div>
            </template>
            <!--    上传失败      -->
            <template v-if="state.uploadStatus === UploadStatus.Error">
              <div class="error-info">
                <p class="filename flex ct-start">
                  {{ state.uploadFileInfo.name }}
                  <img :src="errorSvg" style="margin-left: 12px" />
                </p>
                <p class="info">{{ t('component.upload.fileSize') }}: {{ formatFileSize(state.uploadFileInfo.size || 0) }}</p>
                <p class="info" style="margin-bottom: 0">{{ t('component.upload.time') }}: {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-upload v-feature v-bind="uploadOption"> </a-upload>
                  <a-button danger style="margin-left: 20px" @click="handleRemoveFile">{{ t('common.delText') }} </a-button>
                </div>
              </div>
            </template>
            <!--    上传成功      -->
            <template v-if="state.uploadStatus === UploadStatus.Success">
              <div class="error-info">
                <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                  <img :src="successSvg" style="height: 22px; margin-right: 12px" />
                  <div class="info" style="margin-bottom: 0">{{ t('component.cropper.uploadSuccess') }} </div>
                </div>
                <p class="info" style="margin-bottom: 0">{{ t('component.upload.time') }}: {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveFile">{{ t('component.upload.continueUpload') }} </a-button>
                </div>
              </div>
            </template>
          </a-upload-dragger>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { defineEmits, reactive, ref } from 'vue';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import dayjs from 'dayjs';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { message, UploadFile } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const uploadFileList = ref<any[]>([]);
  const { title, single } = defineProps({ title: String, api: Promise<any>, single: Boolean });

  let api: Promise<any>;
  const emits = defineEmits(['getTable', 'register']);

  const [registerModal, { closeModal }] = useModalInner(init);

  const visible = ref<boolean>(false);

  // 图纸状态
  const state = reactive({
    procedure: 1, // 上传进度
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  function init(data) {
    api = data.api;
    //打开时 初始页面状态
    state.uploadStatus = UploadStatus.BeforeUploading;
    uploadFileList.value = [];
    fileList.value = [];
  }

  /**
   * Check if a file is a valid image.
   * @param {File} file - The file to be uploaded.
   * @returns {boolean} - Returns true if the file is a valid image, otherwise false.
   */
  function beforeUpload(file, fileList) {
    state.uploadStatus = UploadStatus.BeforeUploading;
    fileList.map(file => {
      if (!uploadFileList.value.find(item => item.uid == file.uid || item.name == file.name)) {
        uploadFileList.value.push(file);
      }
    });
    return false;
  }

  // 客户删除
  const handleRemoveFile = () => {
    uploadFileList.value = [];
    state.uploadStatus = UploadStatus.BeforeUploading;
  };

  const uploadOption = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    // customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };

  const setVisible = (e: boolean) => {
    state.uploadStatus = UploadStatus.BeforeUploading;
    visible.value = e;
  };

  const fileList = ref<any[]>([]);
  const handleConfirm = () => {
    if (uploadFileList.value.length == 0) {
      closeModal();
      emits('getTable', fileList.value);
    }
    if (uploadFileList.value.length > 0) {
      // 上传客户图纸
      state.procedure = 1;
      const interval = setInterval(() => {
        if (state.procedure >= 99) return clearInterval(interval);
        state.procedure += 1;
      }, 100);
      state.uploadStatus = UploadStatus.Uploading;
      const formData = new FormData();
      uploadFileList.value.forEach(item => {
        formData.append('fileList', item);
      });
      api(formData)
        .then(({ code, msg, data }) => {
          if (code == 200) {
            fileList.value.push(...data);
            // 上传成功
            uploadFileList.value = [];
            state.procedure = 100;
            state.uploadStatus = UploadStatus.Success;
            message.success(msg);
            if (single) {
              emits('getTable', fileList.value);
              closeModal();
            }
          }
        })
        .catch(() => {
          state.uploadStatus = UploadStatus.Error;
        })
        .finally(() => {
          clearInterval(interval);
        });
    }
  };

  function handleDeleteFile(index) {
    uploadFileList.value.splice(index, 1);
  }

  defineExpose({
    setVisible,
  });
</script>

<style lang="less" scoped>
  .upload-wrapper {
    height: 520px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  :deep(.upload-wrapper > span) {
    width: 48%;
    margin-left: 10px;
    margin-right: 10px;
  }

  :deep(.upload-pic) {
    width: 100%;
  }

  .logo-tip {
    color: #ccc;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    /* 91.667% */
    margin-bottom: 24px;
  }

  // 上传前
  .before-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
  }

  // 上传中
  .uploading {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .uploading-title {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    .upload-name {
      margin-right: 20px;
      width: 200px;
    }
  }

  .item-gray {
    color: #999;
  }

  // 上传失败
  .error-info {
    display: flex;
    flex-direction: column;
    text-align: start;
    align-items: center;
    height: 100%;
    justify-content: center;

    .btn-container {
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .filename {
      color: #1a1a1a;
      margin-bottom: 16px;
      flex-wrap: wrap;

      & > div {
        width: max-content;
      }
    }

    .info {
      color: #999;
      margin-bottom: 8px;
    }
  }

  .upload-wrapper-item {
    display: flex;
    flex-direction: column;
    width: 99%;

    span {
      height: 100%;
    }

    .upload-btn-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .tip {
        margin-left: 8px;
      }
    }
  }

  .break {
    word-break: break-all;
    text-align: start;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .file-item {
    padding: 3px 10px;
    box-sizing: border-box;
  }

  :deep(.btn-upload) {
    height: 45px !important;
  }
</style>
