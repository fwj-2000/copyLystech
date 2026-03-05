<template>
  <BasicModal
    :title="t('dict.DrawingsReviewColumn.attachmentUpload')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="820"
    @register="registerModal"
    destroy-on-close
    showOkBtn
    @ok="handleConfirm">
    <div class="modal-content">
      <div class="upload-wrapper">
        <div class="upload-wrapper-item">
          <Subtitle :title="state.title" />
          <a-upload v-feature class="btn-upload" :multiple="mutiple" v-bind="customerUploadOption">
            <div class="upload-btn-wrapper">
              <a-button type="primary" ghost :disabled="customerState.uploadStatus === UploadStatus.Uploading">{{ t('component.upload.choose') }} </a-button>
              <div class="tip">{{ t('component.upload.supportTip') }}</div>
            </div>
          </a-upload>
          <a-row>
            <a-col style="display: flex; justify-content: start" :span="12">{{ t('component.excel.fileName') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('component.upload.fileSize') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('common.action') }} </a-col>
          </a-row>
          <a-upload-dragger
            v-feature
            :multiple="mutiple"
            :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
            v-bind="customerUploadOption"
            :disabled="customerState.uploadStatus !== UploadStatus.BeforeUploading">
            <!--    上传前      -->
            <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
              <div v-if="state.customerFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
              <div v-else>
                <div class="file-item" v-for="(item, index) in state.customerFileList" :key="index">
                  <a-row style="align-items: center; padding-bottom: 6px; border-bottom: 1px solid #ddd">
                    <a-col :span="12">
                      <div class="break">{{ item.name || `${t('common.systemDefaultFile')}.xls` }}</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="item-gray ellipsis">{{ formatFileSize(item.size || 0) }}</div>
                    </a-col>
                    <a-col :span="6">
                      <a-button type="link" @click.stop="handleDeleteCustomerFile(index)"> {{ t('component.upload.del') }} </a-button>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </template>
            <!--    上传中      -->
            <template v-if="customerState.uploadStatus === UploadStatus.Uploading">
              <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
              <div class="uploading">
                <a-progress style="width: 80%" :percent="customerState.procedure" size="small" />
              </div>
            </template>
            <!--    上传失败      -->
            <template v-if="customerState.uploadStatus === UploadStatus.Error">
              <div class="error-info">
                <p class="filename flex ct-start">
                  {{ customerState.uploadFileInfo.name }}
                  <img :src="errorSvg" style="margin-left: 12px" />
                </p>
                <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
                <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-upload v-feature v-bind="customerUploadOption">
                    <!--                    <a-button>重新选择</a-button>-->
                  </a-upload>
                  <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">{{ t('component.upload.del') }} </a-button>
                </div>
              </div>
            </template>
            <!--    上传成功      -->
            <template v-if="customerState.uploadStatus === UploadStatus.Success">
              <div class="error-info">
                <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                  <img :src="successSvg" style="height: 22px; margin-right: 12px" />
                  <div class="info" style="margin-bottom: 0">{{ t('component.upload.uploadSuccess') }} </div>
                </div>
                <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveCustomerFile">{{ t('common.continueUpload') }} </a-button>
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
  const { t } = useI18n();
  const state = reactive({
    id: '',
    customerFileList: [],
    fileList: [],
    title: '',
    version: '',
    uploadApi: null,
  });
  const emits = defineEmits(['getTable', 'register', 'success']);
  const props = defineProps({
    title: { type: String },
    api: { type: Object as PropType<((data: any) => Promise<any>) | ((id: any, data: any) => Promise<any>)> },
    param: {
      type: Object,
      default: () => {},
    },
    mutiple: { type: Boolean, default: true },
    /**
     * 上传前的校验函数
     * @param {File} file - 要上传的文件对象
     * @param {Array<File>} fileList - 当前已选择的文件列表
     * @returns {boolean} - 如果返回 false，则阻止上传
     */
    beforeUpload: {
      type: Function as PropType<(file: File, fileList: Array<File>) => boolean>,
      default: () => true,
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const visible = ref<boolean>(false);

  // 客户图纸状态
  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });
  function init(data) {
    state.id = data.id || props.param?.id;
    state.title = data.title || props.title;
    state.uploadApi = data.uploadApi || props.api;
    // state.version = data.version;
  }

  /**
   * Check if a file is a valid image.
   * @param {File} file - The file to be uploaded.
   * @returns {boolean} - Returns true if the file is a valid image, otherwise false.
   */
  function beforeUpload(file, fileList) {
    // 调用 props.beforeUpload 函数
    if (typeof props.beforeUpload === 'function' && !props.beforeUpload(file, fileList)) {
      return false;
    }

    customerState.uploadStatus = UploadStatus.BeforeUploading;
    const { customerFileList } = state;
    if (!props.mutiple && customerFileList.length == 1) {
      message.warning(t('common.onlyOneFileCanBeUploaded'));
      return false;
    }
    fileList.map(file => {
      if (!customerFileList.some(item => item.uid == file.uid || item.name == file.name)) {
        customerFileList.push(file);
      }
    });
    // state.customerFileList.push()
    return false;
  }

  // 客户自定义上传
  const customerUpload = async info => {
    console.log(info);
    customerState.procedure = 1;
    const interval = setInterval(() => {
      if (customerState.procedure >= 99) return clearInterval(interval);
      customerState.procedure += 1;
    }, 100);
    try {
      customerState.uploadFileInfo = info.file;
      customerState.uploadStatus = UploadStatus.Uploading;
      if (state.uploadApi.length == 2) {
        const { msg } = await state.uploadApi(state.id, { ...props.param, file: info.file });
        message.success(msg);
      } else {
        //统一参数
        const { msg } = await state.uploadApi({ ...props.param, id: state.id, file: info.file });
        message.success(msg);
      }
      // 上传成功
      customerState.procedure = 100;
      customerState.uploadStatus = UploadStatus.Success;
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  };
  // 客户删除
  const handleRemoveCustomerFile = () => {
    state.customerFileList = [];
    customerState.uploadStatus = UploadStatus.BeforeUploading;
  };

  const customerUploadOption = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };

  const setVisible = (e: boolean) => {
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    visible.value = e;
  };

  const handleConfirm = () => {
    const { customerFileList, fileList } = state;
    if (customerFileList.length == 0 && fileList.length == 0) {
      closeModal();
      emits('getTable');
    }
    if (customerFileList.length > 0) {
      // 上传客户图纸
      customerState.procedure = 1;
      const interval = setInterval(() => {
        if (customerState.procedure >= 99) return clearInterval(interval);
        customerState.procedure += 1;
      }, 100);
      customerState.uploadStatus = UploadStatus.Uploading;
      const formData = new FormData();
      if (state.version) {
        formData.append('version', state.version);
      }
      if (state.uploadApi.length == 2) {
        customerFileList.forEach(item => {
          formData.append('fileList', item);
        });
        state
          .uploadApi(state.id, formData)
          .then(({ code, msg }) => {
            if (code == 200) {
              // 上传成功
              state.customerFileList = [];
              customerState.procedure = 100;
              customerState.uploadStatus = UploadStatus.Success;
              message.success(msg);
              emits('success', state.id);
              endUploadModal();
            }
          })
          .catch(() => {
            customerState.uploadStatus = UploadStatus.Error;
          })
          .finally(() => {
            clearInterval(interval);
          });
      } else if (state.uploadApi.length == 1) {
        customerFileList.forEach(item => {
          formData.append('file', item); //历史遗留：参数名不一致
        });
        formData.append('id', state.id);
        Object.getOwnPropertyNames(props.param).forEach(key => {
          if (!formData.has(key)) {
            formData.append(key, props.param[key]);
          }
        });
        state
          .uploadApi(formData)
          .then(({ code, msg, data }) => {
            if (code == 200) {
              // 上传成功
              state.customerFileList = [];
              customerState.procedure = 100;
              customerState.uploadStatus = UploadStatus.Success;
              message.success(msg);
              emits('success', state.id, { fileList: customerFileList, data });
              endUploadModal();
            }
          })
          .catch(() => {
            customerState.uploadStatus = UploadStatus.Error;
          })
          .finally(() => {
            clearInterval(interval);
          });
      }
    }
  };

  function handleDeleteCustomerFile(index) {
    state.customerFileList.splice(index, 1);
  }
  function endUploadModal() {
    //还原上传框状态，下次进来要求新上传界面
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    closeModal();
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
    line-height: 22px; /* 91.667% */
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
