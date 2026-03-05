<template>
  <div>
    <Upload
      v-bind="$attrs"
      v-model:file-list="fileList"
      v-paste="customRequest"
      :list-type="listType"
      :accept="getStringAccept"
      :multiple="multiple"
      :maxCount="maxNumber"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :disabled="props.disabled"
      @preview="handlePreview"
      @remove="handleRemove">
      <div v-if="showUploadButton">
        <plus-outlined />
        <div style="margin-top: 8px">{{ t('component.upload.upload') }}</div>
      </div>
    </Upload>
    <Modal v-if="!props.draggablePreview" style="width: fit-content" v-model:open="previewOpen" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
  <Teleport to="body">
    <Vue3DraggableResizable
      v-if="previewOpen && props.draggablePreview"
      :draggable="true"
      :w="110"
      :h="120"
      :x="previewPosition.x"
      :y="previewPosition.y"
      :resizable="false"
      :scale="[0.5, 0.4]">
      <div ref="dragInnerRef" class="drag-inner">
        <div class="drag-header">
          <div class="drag-header-text">{{ previewTitle }}</div>
          <!-- <BasicPopPage :config="previewPageInfo" @change="handleChangePage"></BasicPopPage> -->
          <div class="drag-close" @click="handleCancel">
            <CloseOutlined />
          </div>
        </div>
        <img style="width: 100%" alt="" :src="previewImage" />
      </div>
    </Vue3DraggableResizable>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, toRefs, watch, nextTick, reactive, computed, onBeforeUnmount } from 'vue';
  import { UploadFile, UploadProps, Upload, Modal } from 'ant-design-vue';
  import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isArray, isFunction, isObject, isString } from '/@/utils/is';
  import { error } from '/@/utils/log';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUploadType } from '../hooks/useUpload';
  import { uploadContainerProps } from '../props';
  import { checkFileType } from '../helper';
  import { UploadResultStatus } from '/@/components/Upload/src/types/typing';
  import { get, omit } from 'lodash-es';
  import { uploadImg } from '/@/api/sys/upload';
  import { getAppEnvConfig } from '/@/utils/env';
  import Vue3DraggableResizable from 'vue3-draggable-resizable';
  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';

  defineOptions({ name: 'ImageUpload' });

  const emit = defineEmits(['change', 'update:value', 'delete']);
  const props = defineProps({
    ...omit(uploadContainerProps, ['previewColumns', 'beforePreviewData']),
  });
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const { accept, helpText, maxNumber, maxSize } = toRefs(props);
  const width = props.width || '102px';
  const height = props.height || '102px';
  const isInnerOperate = ref<boolean>(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const showUploadButton = computed(() => {
    if (maxNumber.value === null) return true;
    return fileList.value && fileList.value.length < maxNumber.value;
  });
  const { getStringAccept } = useUploadType({
    acceptRef: accept,
    helpTextRef: helpText,
    maxNumberRef: maxNumber,
    maxSizeRef: maxSize,
  });
  const previewOpen = ref<boolean>(false);
  const previewImage = ref<string>('');
  const previewTitle = ref<string>('');
  const previewIndex = ref<number>(-1);
  const previewPageInfo = reactive({
    total: 0,
    currentIndex: 1,
  });
  const dragInnerRef = ref<HTMLElement | null>(null);
  const previewPosition = reactive({
    x: 0,
    y: 0,
  });

  const isLtMsg = ref<boolean>(true);
  const isActMsg = ref<boolean>(true);
  const isFirstRender = ref<boolean>(true);

  watch(
    () => props.value,
    v => {
      if (isInnerOperate.value) {
        isInnerOperate.value = false;
        return;
      }
      let value: string[] = [];
      if (v) {
        // 识别传参类型
        if (isArray(v)) {
          value = v;
        } else {
          value.push(v);
        }
        // 回显图片
        const { version } = props;
        fileList.value = value.map((item, i) => {
          if (item && isString(item)) {
            return {
              uid: -i + '',
              name: item.substring(item.lastIndexOf('/') + 1),
              status: 'done',
              url: (version == '2' ? IMG_URL_PREFIX : '') + item,
            };
          } else if (item && isObject(item)) {
            return {
              url: (version == '2' ? IMG_URL_PREFIX : '') + (item.url || item.filePath),
              name: item.name || item.fileName,
            };
          } else {
            return;
          }
        }) as UploadProps['fileList'];
      }
      emit('update:value', value);
      if (!isFirstRender.value) {
        emit('change', value);
        isFirstRender.value = false;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  function getBase64<T extends string | ArrayBuffer | null>(file: File) {
    return new Promise<T>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as T);
      };
      reader.onerror = error => reject(error);
    });
  }

  const updatePreviewPosition = () => {
    if (!props.draggablePreview) return;
    nextTick(() => {
      const el = dragInnerRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = rect.width || 110;
      const height = rect.height || 120;
      previewPosition.x = Math.max(0, (window.innerWidth - width) / 2);
      previewPosition.y = Math.max(0, (window.innerHeight - height) / 2);
    });
  };

  const resolvePreviewImage = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64<string>(file.originFileObj!);
    }
    return file.url || file.preview || '';
  };

  const setPreviewByIndex = async (index: number) => {
    const list = fileList.value || [];
    if (list.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, list.length - 1));
    const file = list[safeIndex] as UploadFile;
    previewImage.value = await resolvePreviewImage(file);
    previewTitle.value = file.name || previewImage.value.substring(previewImage.value.lastIndexOf('/') + 1);
    previewIndex.value = safeIndex;
    previewPageInfo.total = list.length;
    previewPageInfo.currentIndex = safeIndex + 1;
    updatePreviewPosition();
  };

  const handlePreview = async (file: UploadFile) => {
    const list = fileList.value || [];
    const index = list.findIndex(item => item.uid === file.uid);
    previewOpen.value = true;
    await setPreviewByIndex(index === -1 ? 0 : index);
  };

  const handleRemove = async (file: UploadFile) => {
    let flag = false;
    if (fileList.value) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          const index = fileList.value.findIndex(item => item.uid === file.uid);
          index !== -1 && fileList.value.splice(index, 1);
          const value = getValue();
          isInnerOperate.value = true;
          emit('update:value', value);
          emit('change', value);
          emit('delete', file);
          flag = true;
        },
        onCancel: () => {
          flag = false;
        },
      });
    }
    return flag;
  };

  const handleCancel = () => {
    previewOpen.value = false;
    previewTitle.value = '';
    previewIndex.value = -1;
  };

  const handlePreviewKeydown = (event: KeyboardEvent) => {
    if (!previewOpen.value) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      handleCancel();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const list = fileList.value || [];
    if (list.length === 0) return;
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = previewIndex.value + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    event.preventDefault();
    void setPreviewByIndex(nextIndex);
  };

  watch(
    () => previewOpen.value,
    open => {
      if (open) {
        window.addEventListener('keydown', handlePreviewKeydown);
      } else {
        window.removeEventListener('keydown', handlePreviewKeydown);
      }
    },
  );

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handlePreviewKeydown);
  });

  const beforeUpload = (file: File) => {
    const { maxSize, accept } = props;
    const isAct = checkFileType(file, accept);
    if (!isAct) {
      // createMessage.error(t('component.upload.acceptUpload'));
      createMessage.warn(t('common.onlyOneFileCanBeUploadIMG'));
      isActMsg.value = false;
      // 防止弹出多个错误提示
      setTimeout(() => (isActMsg.value = true), 1000);
    }
    const isLt = file.size / 1024 / 1024 > maxSize;
    if (isLt) {
      createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
      isLtMsg.value = false;
      // 防止弹出多个错误提示
      setTimeout(() => (isLtMsg.value = true), 1000);
    }
    return (isAct && !isLt) || Upload.LIST_IGNORE;
  };

  function checkShouldUpload(info: UploadRequestOption<any>) {
    if (props.disabled) {
      return false;
    }
    if (maxNumber.value === null) return true;

    if (info.type === 'paste' && fileList.value.length >= maxNumber.value) return false;

    return true;
  }

  async function customRequest(info: UploadRequestOption<any>) {
    if (props.disabled) {
      return;
    }

    await nextTick();

    // 如果是粘贴上传，那么fileList的长度会优先响应 + 1
    // if (info.type === 'paste' && fileList.value.length >= maxNumber.value) return;
    if (!checkShouldUpload(info)) return;

    const { uploadApi, uploadParams } = resolveUploadConfig(info);

    try {
      const res = await uploadApi(uploadParams);

      if (res.data.code !== 200) {
        error(res.data.msg);
        return;
      }

      handleSuccess(info, res);

      const value = getValue();
      isInnerOperate.value = true;
      emit('update:value', value);
      emit('change', value);
    } catch (e: unknown) {
      if (info.onError) {
        info.onError(e as any);
      }
    }
  }

  function resolveUploadConfig(info: UploadRequestOption<any>): {
    uploadApi: (params: any) => Promise<any>;
    uploadParams: any;
  } {
    const { api, uploadParams = {}, name, filename } = props;

    const params: any = {
      file: info.file,
      name,
      data: { ...uploadParams },
      filename,
    };

    if (api && isFunction(api)) {
      return { uploadApi: api, uploadParams: params };
    }

    params.data.name = 'file';
    params.name = 'fileList';
    return { uploadApi: uploadImg, uploadParams: params };
  }

  function handleSuccess(info: UploadRequestOption<any>, res: any): void {
    const { resultField, version } = props;

    if (resultField) {
      const result = get(res, resultField);
      if (info.onSuccess) {
        info.onSuccess(result);
      }
      return;
    }

    if (info.onSuccess) {
      info.onSuccess(res.data);
      return;
    }

    const resList = buildFileListFromResponse(res, version);
    if (resList.length === 0) {
      return;
    }

    fileList.value = fileList.value.length <= 0 ? resList : [...fileList.value, ...resList];
  }

  function buildFileListFromResponse(res: any, version?: string): UploadProps['fileList'] {
    console.log(res.data.data);
    console.log('success ');

    const mapList = isArray(res.data.data) ? res.data.data : [res.data.data];
    const prefix = version === '2' ? IMG_URL_PREFIX : '';

    return mapList.filter(Boolean).map((item: unknown, i: number) => {
      console.log('🚀 ~  ~ item: ', item);

      if (isString(item)) {
        return {
          uid: (-i).toString(),
          name: item.substring(item.lastIndexOf('/') + 1),
          status: 'done',
          url: `${prefix}${item}`,
        };
      }

      if (isObject(item)) {
        const obj = item as Record<string, any>;
        return {
          url: `${prefix}${obj.url || obj.filePath || obj.fullPath}`,
          name: obj.name || obj.fileName,
        };
      }

      return undefined;
    });
  }

  // 获取当前的图片列表
  function getValue() {
    const list: any[] = [];
    const { updateType } = props;

    // 是否过滤出全部数据
    let files = updateType == 'all' ? fileList.value : (fileList.value || []).filter(item => item?.status === UploadResultStatus.DONE);
    (files || []).map((item: any) => {
      if (item?.response) {
        if (props?.resultField) return list.push(item?.response);
        const { data } = item.response;
        // 处理上传图片的返回数据
        if (isArray(data)) {
          return (data || []).map(el => {
            return list.push({
              url: el.fullPath || el.url || el.filePath,
              name: el.originFileName || el.fileName,
            });
          });
        }
        if (typeof data == 'string') {
          return list.push(data);
        }
      }
      const { version } = props;
      const _currentUrl = item?.data || item?.url;
      // 新版本不加前缀
      if (version == '2') {
        list.push({
          url: _currentUrl.replace(IMG_URL_PREFIX, ''),
          name: item?.name,
        });
      } else {
        list.push(_currentUrl);
      }
    });
    return list;
  }
  defineExpose({
    fileList,
  });
</script>

<style lang="less" scoped>
  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  :deep(.ant-upload-list-picture-card-container) {
    width: v-bind(width) !important;
    height: v-bind(height) !important;
  }

  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: v-bind(width) !important;
    height: v-bind(height) !important;
  }

  :deep(.ant-upload-list-item-container) {
    width: v-bind(width) !important;
    height: v-bind(height) !important;
  }

  //  更改图片展示为等比例铺满
  :deep(
      :where(.css-1bxwrbh).ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-thumbnail img
    ) {
    object-fit: cover;
  }

  :deep(
      :where(.css-dev-only-do-not-override-1bxwrbh).ant-upload-wrapper.ant-upload-picture-card-wrapper
        .ant-upload-list.ant-upload-list-picture-card
        .ant-upload-list-item-thumbnail
        img
    ) {
    object-fit: cover;
  }

  :deep(.ant-modal) {
    width: fit-content !important;
  }

  .upload-wrapper-item {
    display: flex;
    flex-direction: column;
    width: 100%;

    & > span:last-of-type {
      height: max-content;
      // min-height: 200px;
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

  //ant-upload-list ant-upload-list-picture-card
  :deep(.ant-upload-list) {
    display: flex;
  }

  :deep(.upload-pic) {
    width: 100%;
  }

  :deep(.ant-upload-list-item-actions) {
    display: flex;
    align-items: center;
    justify-content: center;

    & > a > span {
      display: flex;
      height: 24px;
      align-items: center;
      justify-content: center;
      margin-right: 20px !important;
      margin-top: 2px !important;
    }
  }

  // 拖拽弹框样式
  .drag-inner {
    background: #f8f8f8;
    border-radius: 10px;
    padding: 20px;
    position: fixed;
    z-index: 1000;
    user-select: none;

    .drag-header {
      display: flex;
      margin-bottom: 5px;
      justify-content: space-between;
    }

    .drag-close {
      color: #999;
      cursor: pointer;
    }
  }
</style>
