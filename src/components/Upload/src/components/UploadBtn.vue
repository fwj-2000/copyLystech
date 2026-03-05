<template>
  <a-upload v-feature ref="uploadRef" :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeUpload" :accept="accept">
    <a-button v-bind="props.buttonProps" :loading="btnLoading" :type="props.type">
      {{ props.buttonText || t('dict.PurchaseQuotationColumn.UploadAttachment') }}
    </a-button>
  </a-upload>
</template>
<script setup lang="ts">
  import { ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadfiles } from '/@/api/basic/common';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({
    name: 'upload-btn',
  });

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'reload']);
  const { t } = useI18n();
  const btnLoading = ref(false);

  const props = defineProps({
    beforeUpload: {
      type: Object,
      default: () => {
        return null;
      },
    },
    /**
     * 文件大小限制（单位：MB）
     */
    maxFileSize: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'link',
    },
    uploadPath: {
      type: String,
      default: '',
    },
    /** 上传按钮文字 */
    buttonText: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '*/*',
    },
    customUpload: {
      type: Function,
      default: null,
    },
    buttonProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  const uploadFileList = ref<{ fileName: string; filePath: string }[]>([]);
  function beforeUpload(file) {
    if (checkFileSizeExceeded([file], props.maxFileSize)) {
      createMessage.warn(t('component.upload.fileMaxSize', { size: props.maxFileSize, unit: 'MB' }));
      return false;
    }
    // 如果有自定义上传方法，则使用自定义上传方法
    if (props.customUpload) {
      return props.customUpload(file);
    }
    if (!uploadFileList.value.find(value => value.fileName === file.name)) {
      btnLoading.value = true;
      const params = {
        fileList: file,
      };
      // 如果有指定filePath，就用指定的filePath
      if (props.uploadPath) {
        params['uploadPath'] = props.uploadPath;
      }
      uploadfiles(params)
        .then(res => {
          uploadFileList.value.push({
            filePath: res.data[0].fullPath,
            fileName: res.data[0].originFileName,
          });
          emit('success', unref(uploadFileList));
        })
        .finally(() => {
          btnLoading.value = false;
        });
    }
    return false;
  }

  function clearUploadFileList() {
    uploadFileList.value.length = 0;
  }

  /**
   * 检查文件列表中是否存在超过指定大小的文件
   * @param fileList 文件列表
   * @param maxSizeMB 最大允许大小（单位：MB）
   * @returns 是否存在超标文件
   */
  function checkFileSizeExceeded(fileList: File[], maxSizeMB: number): boolean {
    if (!maxSizeMB || maxSizeMB <= 0) return false;

    const maxBytes = maxSizeMB * 1024 * 1024; // 转换为字节
    return fileList.some(file => file.size > maxBytes);
  }

  const uploadRef = ref();

  function handleClick() {
    // 触发点击事件
    // uploadRef.value?.click();
    // 触发 a-upload 内部文件输入框的点击事件
    const input = uploadRef.value?.$el.querySelector('input[type="file"]');
    if (input) {
      input.click();
    }
  }

  function handleClear() {
    uploadFileList.value = [];
  }

  defineExpose({
    click: handleClick,
    clearUploadFileList,
    handleClear,
  });
</script>
