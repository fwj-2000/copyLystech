<template>
  <BasicModal
    :title="getTitle"
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
          <Subtitle :title="t('common.customerOriginalImage')" :extra="{ show: true, hideAdd: true }">
            <template #extra>
              <div class="flex" style="width: 300px">
                {{ t(['dict.CommonCol.prjDrawingsName', 'sys.lang.translate']) }}：
                <lydc-select
                  style="width: 200px"
                  v-model:value="translateState.targetLanguages"
                  :multiple="true"
                  :maxTagCount="1"
                  placeholder="请选择"
                  :options="translateState.options"></lydc-select>
              </div>
            </template>
          </Subtitle>
          <a-upload v-feature class="btn-upload" :multiple="true" v-bind="customerUploadOption">
            <div class="upload-btn-wrapper">
              <a-button type="primary" ghost :disabled="customerState.uploadStatus === UploadStatus.Uploading">{{ t('component.upload.choose') }} </a-button>
              <div class="tip">{{ t('component.upload.supportTip') }}</div>
            </div>
          </a-upload>
          <a-row>
            <a-col style="display: flex; justify-content: start" :span="12">{{ t('component.upload.fileName') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('dict.IdgeneratorRule.size') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('common.action') }} </a-col>
          </a-row>
          <a-upload-dragger
            v-feature
            :multiple="true"
            :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
            v-bind="customerUploadOption"
            :disabled="customerState.uploadStatus !== UploadStatus.BeforeUploading">
            <!--    上传前      -->
            <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
              <div v-if="state.customerFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
              <div v-else>
                <div class="file-item" v-for="(item, index) in state.customerFileList">
                  <a-row style="align-items: center; padding-bottom: 6px; border-bottom: 1px solid #ddd">
                    <a-col :span="12">
                      <!--                      <div class="break">{{ `${formatFileName(item.name)}` || `${t('common.systemDefaultFile')}.xls` }}</div>-->
                      <div class="break">{{ `${state.InsidePartNumber}+${item.name}` || `${t('common.systemDefaultFile')}.xls` }}</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="item-gray ellipsis">{{ formatFileSize(item.size || 0) }}</div>
                    </a-col>
                    <a-col :span="6">
                      <a-button type="link" @click.stop="handleDeleteCustomerFile(index)"> {{ t('common.delText') }} </a-button>
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
                <p class="info">文件大小： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
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

        <!--    脱敏图纸    -->
        <div class="upload-wrapper-item">
          <Subtitle :title="t('dict.CommonCol.drawingshistory')" />
          <a-upload v-feature class="btn-upload" :multiple="true" v-bind="desensitizationUploadOption">
            <div class="upload-btn-wrapper">
              <a-button type="primary" ghost :disabled="desensitizationState.uploadStatus === UploadStatus.Uploading"
                >{{ t('component.upload.choose') }}
              </a-button>
              <div class="tip">{{ t('component.upload.supportTip') }}</div>
            </div>
          </a-upload>
          <a-row>
            <a-col style="display: flex; justify-content: start" :span="12">{{ t('component.upload.fileName') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('dict.IdgeneratorRule.size') }} </a-col>
            <a-col style="display: flex; justify-content: center" :span="6">{{ t('component.nodeModal.table.action') }} </a-col>
          </a-row>
          <a-upload-dragger
            v-feature
            :multiple="true"
            :class="desensitizationState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
            v-bind="desensitizationUploadOption"
            :disabled="desensitizationState.uploadStatus !== UploadStatus.BeforeUploading">
            <!--    上传前      -->
            <template v-if="desensitizationState.uploadStatus === UploadStatus.BeforeUploading">
              <div v-if="state.desensitizationFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
              <div v-else>
                <div class="file-item" v-for="(item, index) in state.desensitizationFileList">
                  <a-row style="align-items: center; padding-bottom: 6px; border-bottom: 1px solid #ddd">
                    <a-col :span="12">
                      <div class="break">{{ formatFileName(item.name) || `${t('common.systemDefaultFile')}.xls` }}</div>
                    </a-col>
                    <a-col :span="6">
                      <div class="item-gray ellipsis">{{ formatFileSize(item.size || 0) }}</div>
                    </a-col>
                    <a-col :span="6">
                      <a-button type="link" @click.stop="handleDeleteDesensitizationFile(index)"> {{ t('component.upload.del') }} </a-button>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </template>
            <!--    上传中      -->
            <template v-if="desensitizationState.uploadStatus === UploadStatus.Uploading">
              <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
              <div class="uploading">
                <a-progress style="width: 80%" :percent="desensitizationState.procedure" size="small" />
              </div>
            </template>
            <!--    上传失败      -->
            <template v-if="desensitizationState.uploadStatus === UploadStatus.Error">
              <div class="error-info">
                <p class="filename flex ct-start">
                  <img :src="errorSvg" style="margin-left: 12px" />
                </p>
                <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(desensitizationState.uploadFileInfo.size || 0) }}</p>
                <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-upload v-feature v-bind="desensitizationUploadOption">
                    <a-button>{{ t('common.reselect') }}</a-button>
                  </a-upload>
                  <a-button danger style="margin-left: 20px" @click="handleRemoveDesensitizationFile"> {{ t('common.delText') }} </a-button>
                </div>
              </div>
            </template>
            <!--    上传成功      -->
            <template v-if="desensitizationState.uploadStatus === UploadStatus.Success">
              <div class="error-info">
                <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                  <img :src="successSvg" style="height: 22px; margin-right: 12px" />
                  <div class="info" style="margin-bottom: 0">{{ t('component.upload.uploadSuccess') }} </div>
                </div>
                <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                <div class="btn-container">
                  <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveDesensitizationFile">
                    {{ t('common.continueUpload') }}
                  </a-button>
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
  import { computed, defineEmits, reactive, ref } from 'vue';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import { uploadCustomerDrawings, uploadDesensitizedDrawings } from '/@/api/basicData/productCodeApply';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import dayjs from 'dayjs';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { message, UploadFile } from 'ant-design-vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { any } from 'vue-types';
  import { isNullOrUnDef } from '/@/utils/is';
  import { disable } from '/@/api/finance/materialPrice';
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const state = reactive({
    Id: '',
    InsidePartNumber: '',
    customerFileList: [],
    desensitizationFileList: [],
  });
  const emits = defineEmits(['getTable', 'register']);

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const visible = ref<boolean>(false);

  const getTitle = computed(() => {
    if (state.InsidePartNumber) {
      return `${t('common.uploadDrawings')}(${state.InsidePartNumber})`;
    }
    return t('common.uploadDrawings');
  });
  let translateState = reactive({
    targetLanguages: [],
    options: [],
  });
  // 客户图纸状态
  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });
  // 脱敏图纸状态
  const desensitizationState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  async function init(data) {
    state.Id = data.Id;
    state.InsidePartNumber = data.InsidePartNumber;
    state.Version = data.Version;
    state.customerFileList = [];
    state.desensitizationFileList = [];
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    customerState.procedure = 1;
    desensitizationState.uploadStatus = UploadStatus.BeforeUploading;
    desensitizationState.procedure = 1;
    //
    translateState.options = (await baseStore.getDictionaryData('Language')).map(item => {
      return { id: item.enCode, fullName: item.fullName };
    });
    console.log(translateState.options, data);
  }

  function formatFileName(originFileName) {
    console.log('🚀 ~ formatFileName ~ originFileName: ', originFileName);
    if (!state.InsidePartNumber) return originFileName;
    const fileName = originFileName.split('.');
    const fileType = fileName[fileName.length - 1];
    const newFileName = `${state.InsidePartNumber}.${fileType}`;
    return newFileName;
  }

  /**
   * Check if a file is a valid image.
   * @param {File} file - The file to be uploaded.
   * @returns {boolean} - Returns true if the file is a valid image, otherwise false.
   */
  function beforeUpload(file, fileList) {
    customerState.uploadStatus = UploadStatus.BeforeUploading;

    const { customerFileList } = state;

    fileList.forEach(file => {
      const exists = customerFileList.some(item => item.uid === file.uid || item.name === file.name);

      if (!exists) {
        customerFileList.push(file);
      }
    });

    return false;
  }
  function desensitizationBeforeUpload(file, fileList) {
    const { desensitizationFileList } = state;

    console.log(desensitizationFileList, 'desensitizationFileList');
    console.log(fileList, 'fileList');

    customerState.uploadStatus = UploadStatus.BeforeUploading;

    fileList.forEach(file => {
      const exists = desensitizationFileList.some(item => item.uid === file.uid || item.name === file.name);

      if (!exists) {
        desensitizationFileList.push(file);
      }
    });

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
      const { msg } = await uploadCustomerDrawings(state.Id, { file: info.file });
      message.success(msg);
      // 上传成功
      customerState.procedure = 100;
      customerState.uploadStatus = UploadStatus.Success;
    } catch (e) {
      console.log(e);
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
  // 脱敏删除
  const handleRemoveDesensitizationFile = () => {
    state.desensitizationFileList = [];
    desensitizationState.uploadStatus = UploadStatus.BeforeUploading;
  };
  // 脱敏上传
  const desensitizationUpload = async info => {
    desensitizationState.procedure = 1;
    const interval = setInterval(() => {
      if (desensitizationState.procedure >= 99) return clearInterval(interval);
      desensitizationState.procedure += 1;
    }, 100);

    try {
      desensitizationState.uploadFileInfo = info.file;
      desensitizationState.uploadStatus = UploadStatus.Uploading;
      const { msg } = await uploadDesensitizedDrawings(state.Id, { file: info.file });
      message.success(msg);
      // 上传成功
      desensitizationState.procedure = 100;
      desensitizationState.uploadStatus = UploadStatus.Success;
    } catch (e) {
      console.log(e);
      desensitizationState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  };

  const customerUploadOption = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };
  const desensitizationUploadOption = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest: desensitizationUpload,
    beforeUpload: desensitizationBeforeUpload,
  };

  const setVisible = (e: boolean) => {
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    desensitizationState.uploadStatus = UploadStatus.BeforeUploading;
    visible.value = e;
  };

  const handleConfirm = () => {
    console.log(translateState.targetLanguages.toString());
    const { customerFileList, desensitizationFileList } = state;
    if (customerFileList.length == 0 && desensitizationFileList.length == 0) {
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
      customerFileList.forEach(item => {
        formData.append('fileList', item);
      });
      if (!isNullOrUnDef(state.Version)) {
        formData.append('version', state.Version);
      }
      if (translateState.targetLanguages && translateState.targetLanguages.length > 0) {
        formData.append('targetLanguages', translateState.targetLanguages);
      }
      uploadCustomerDrawings(state.Id, formData)
        .then(({ code, msg }) => {
          if (code == 200) {
            // 上传成功
            state.customerFileList = [];
            customerState.procedure = 100;
            customerState.uploadStatus = UploadStatus.Success;
            message.success(msg);
          }
        })
        .catch(() => {
          customerState.uploadStatus = UploadStatus.Error;
        })
        .finally(() => {
          clearInterval(interval);
        });
    }
    if (desensitizationFileList.length > 0) {
      // 上传脱敏图纸
      desensitizationState.procedure = 1;
      const interval = setInterval(() => {
        if (desensitizationState.procedure >= 99) return clearInterval(interval);
        desensitizationState.procedure += 1;
      }, 100);

      desensitizationState.uploadStatus = UploadStatus.Uploading;
      const formData = new FormData();
      desensitizationFileList.forEach(item => {
        formData.append('fileList', item);
      });
      console.log('🚀 ~ handleConfirm ~ state.Version: ', state.Version);
      if (!isNullOrUnDef(state.Version)) {
        formData.append('version', state.Version);
      }
      uploadDesensitizedDrawings(state.Id, formData)
        .then(({ code, msg }) => {
          if (code == 200) {
            state.desensitizationFileList = [];
            // 上传成功
            desensitizationState.procedure = 100;
            desensitizationState.uploadStatus = UploadStatus.Success;
            message.success(msg);
            //还原上传框状态，下次进来要求新上传界面
            customerState.uploadStatus = UploadStatus.BeforeUploading;
            closeModal();
            emits('getTable');
          }
        })
        .catch(() => {
          desensitizationState.uploadStatus = UploadStatus.Error;
        })
        .finally(() => {
          clearInterval(interval);
        });
    }
  };

  function handleDeleteCustomerFile(index) {
    state.customerFileList.splice(index, 1);
  }
  function handleDeleteDesensitizationFile(index) {
    state.desensitizationFileList.splice(index, 1);
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
    width: 49%;

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

  :deep(.lydc-subtitle-container) {
    height: 48px;
    box-sizing: content-box;
    padding-bottom: 8px;
  }
</style>
