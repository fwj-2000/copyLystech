<template>
  <BasicModal
    title="附件上传"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    @register="registerModal"
    destroy-on-close
    :showOkBtn="false"
    @ok="handleConfirm">
    <div class="modal-content">
      <div class="upload-wrapper">
        <a-upload-dragger
          v-feature
          :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
          v-bind="customerUploadOption"
          accept="image/png, image/jpeg"
          :disabled="customerState.uploadStatus !== UploadStatus.BeforeUploading">
          <!--    上传前      -->
          <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
            <div class="before-box">
              <div class="logo-tip">附件</div>
              <div>
                <a-button type="link">选择文件</a-button>
                <span style="margin-right: 15px">/</span>
                将文件拖拽到此区域
              </div>
            </div>
          </template>
          <!--    上传中      -->
          <template v-if="customerState.uploadStatus === UploadStatus.Uploading">
            <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
            <div class="uploading">
              <div class="uploading-title">
                <div class="upload-name">{{ customerState.uploadFileInfo.name }}</div>
                <LoadingOutlined style="color: #1890ff" />
                {{ customerState.procedure }}%
              </div>
              <div class="item-gray"
                >文件大小：
                {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}
              </div>
              <div class="item-gray">上传日期： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</div>
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
              <p class="info" style="margin-bottom: 0">上传日期： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
              <div class="btn-container">
                <a-upload v-feature v-bind="customerUploadOption">
                  <a-button>重新选择</a-button>
                </a-upload>
                <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">删除 </a-button>
              </div>
            </div>
          </template>
          <!--    上传成功      -->
          <template v-if="customerState.uploadStatus === UploadStatus.Success">
            <div class="error-info">
              <p class="filename flex ct-start">
                {{ customerState.uploadFileInfo.name || '系统默认文件.xls' }}
                <img :src="successSvg" style="margin-left: 12px" />
              </p>
              <p class="info">文件大小： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
              <p class="info" style="margin-bottom: 0">上传日期： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
              <div class="btn-container">
                <a-upload v-feature v-bind="customerUploadOption">
                  <a-button>重新选择</a-button>
                </a-upload>
                <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">删除 </a-button>
              </div>
            </div>
          </template>
        </a-upload-dragger>
      </div>
    </div>
  </BasicModal>
  <a-modal :closable="false" :forceRender="true" v-model:visible="visible" ok-text="确认" cancel-text="取消" class="modal-wrapper"></a-modal>
</template>
<script setup lang="ts">
  import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import dayjs from 'dayjs';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { message, UploadFile } from 'ant-design-vue';
  import { postDrawingsReviewUploadAttach } from '/@/api/engineering/drawingReview';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';

  const emits = defineEmits(['reload', 'register']);

  const props = defineProps(['Id']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const { hasBtnP } = usePermission();

  onMounted(() => {
    console.log(props.Id);
  });
  const visible = ref<boolean>(false);

  // 客户图纸状态
  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
    data: {} as any,
  });

  function init(data) {
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    customerState.data = data;
  }

  // 客户自定义上传
  const customerUpload = async info => {
    console.log(props.Id);
    customerState.procedure = 1;
    const interval = setInterval(() => {
      if (customerState.procedure >= 99) return clearInterval(interval);
      customerState.procedure += 1;
    }, 100);
    try {
      customerState.uploadFileInfo = info.file;
      customerState.uploadStatus = UploadStatus.Uploading;
      const { msg } = await postDrawingsReviewUploadAttach({
        file: info.file,
        ...customerState.data,
      });
      message.success(msg);
      // 上传成功
      customerState.procedure = 100;
      customerState.uploadStatus = UploadStatus.Success;
      emits('reload', {
        ...customerState.data,
        name: customerState.uploadFileInfo.name,
      });
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  };
  // 客户删除
  const handleRemoveCustomerFile = () => {
    customerState.uploadStatus = UploadStatus.BeforeUploading;
  };

  const customerUploadOption = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest: customerUpload,
  };

  const setVisible = (e: boolean, data) => {
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    customerState.data = data;
    visible.value = e;
  };

  const handleConfirm = () => {
    closeModal();
  };

  defineExpose({
    setVisible,
  });
</script>

<style lang="less" scoped>
  .upload-wrapper {
    height: 520px;
    box-sizing: border-box;
    padding: 32px;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  :deep(.upload-wrapper > span) {
    width: 100%;
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
    }

    .info {
      color: #999;
      margin-bottom: 8px;
    }
  }

  :deep(.scrollbar) {
    padding: 0 !important;
  }
</style>
