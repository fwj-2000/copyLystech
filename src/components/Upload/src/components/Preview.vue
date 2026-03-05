<template>
  <a-modal
    ref="modalRef"
    v-model:open="state.visible"
    :footer="null"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :mask="!isCanResize"
    class="common-container-modal lydc-full-modal full-modal file-preview-modal"
    :class="{ 'resize-preview-modal': isCanResize }"
    :wrap-class-name="`fullscreen-modal preview-modal ${isCanResize ? 'resize-preview-modal' : ''}`">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <template #title>
      <div ref="modalTitleRef" class="lydc-full-modal-header" :class="{ 'cursor-move': isCanResize }">
        <div class="header-title">
          <p class="header-txt">{{ state.title }}</p>
        </div>
        <a-space class="options" :size="10">
          <a-button v-auth="'btn_downloadPreview'" @click="handleDownload">{{ t('common.downloadDrawingText') }}</a-button>
          <BasicPopPage :config="pageInfo" @change="handleChangePage"></BasicPopPage>
          <slot name="cancel-before" :row="pageInfo['list'][pageInfo['currentIndex']]" :pageInfo="pageInfo"> </slot>
          <a-divider></a-divider>
          <a-button @click="handleCancel()">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div class="basic-content bg-white" v-loading="state.loading">
      <iframe ref="fileContainer" :src="state.url" width="100%" height="100%" class="no-frame-border"></iframe>
    </div>

    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { Modal as AModal } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getToken } from '/@/utils/auth';
  import { downloadFile, isNewFile } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { encryptByBase64 } from '/@/utils/cipher';
  import { previewDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { processUrl } from '/@/adapter/utils';
  import { BasicPopPage } from '/@/components/Basic';
  import ModalClose from '/@/components/Modal/src/components/ModalClose.vue';
  import { cloneDeep } from 'lodash-es';
  import { usePreviewDrag } from '../hooks/usePreviewDrag';

  interface State {
    visible: boolean;
    loading: boolean;
    title: string;
    url: string;
    previewType: string;
    version: '2' | '1' | 1 | 2;
    currentfileUrl: string; // 当前文件url
    currentFileName: string; // 当前文件名称
  }
  interface FileInfo {
    filePath: string;
    fileName: string;
  }

  // const { loadingProgress, isLoading, loadFile, setProgress } = useFileLoading();

  const emits = defineEmits(['close']);

  const fileContainer = ref();
  const modalTitleRef = ref();

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const isCanResize = ref<boolean>(false);

  const state = reactive<State>({
    visible: false,
    loading: false,
    title: '',
    url: '',
    previewType: '',
    version: '1',
    currentfileUrl: '', // 当前文件url
    currentFileName: '', // 当前文件名称
  });
  const pageInfo = reactive({
    total: 0,
    currentIndex: 1,
    pageSize: 10,
    list: [],
  });

  // 拖曳及缩放功能
  const { transformStyle } = usePreviewDrag({ modalTitleRef, enabled: isCanResize });

  // 获取文件预览的名称
  function getFileName(data) {
    return (data.name || data.fileName || '').trim();
  }
  // 获取文件url的值
  function getFileUrl(data: any): string {
    const url = data?.url ?? data?.filePath ?? '';
    return url.replaceAll('\\', '/'); // 替换反斜杠为斜杠
  }

  // 获取文件url--新版
  function getFileUrlV2(data): string {
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
  // 设置预览文件地址
  function setInnerFileUrl(fileUrl) {
    console.log(fileUrl, 'fileUrl');
    state.currentfileUrl = fileUrl;
    state.url = `${globSetting.filePreviewServer}/onlinePreview?url=${encodeURI(encryptByBase64(processUrl(fileUrl)))}` + '&token=' + getToken();
    try {
      fileContainer.value.onload = () => {
        state.loading = false;
      };
    } catch (error) {
      console.error('fileContainer onload set failed:', error);
      nextTick(() => {
        state.loading = false;
      });
    }
  }
  // 设置预览文件名称
  function setInnerFileName(data) {
    const fileName = getFileName(data);
    state.currentFileName = fileName;
    state.title = t('component.filePreview.filPreview') + (fileName ? ' - ' + fileName : '');
  }
  // 通过id获取文件url
  function handleFileUrlById(data) {
    state.visible = true;
    state.loading = true;
    const previewMthod = data.previewApi || previewDrawingshistory;
    previewMthod(data)
      .then(res => {
        state.loading = false;
        if (res.data) {
          handlePreview({
            filePath: res.data,
          });
        } else {
          createMessage.warning(t('component.filePreview.FileNotExist'));
          handleCancel();
        }
      })
      .catch(() => {
        handleCancel();
      });
  }

  // 处理单个文件预览
  function handleSingleFile(data) {
    setInnerFileName(data);
    state.url = '';
    if (data.Id || data.id) {
      return handleFileUrlById(cloneDeep(data));
    }
    handlePreview(data);
  }
  // 处理文件预览
  function handlePreview(data) {
    state.loading = true;
    if (state.fileList && state.fileList.length > 0) {
      setInnerFileName(data);
    }
    // 识别是否为新版： version为2或2，或者filePath不包含'http'
    const isV2 = state.version == 2 || data.version == 2 || isNewFile(getFileUrl(data));
    if (isV2) {
      state.visible = true;
      const currentfileUrl = getFileUrlV2(data);
      state.currentfileUrl = currentfileUrl;
      setInnerFileUrl(currentfileUrl);
      return;
    }
    // 旧版处理方式
    const isLocalPreview = state.previewType === 'localPreview' || data.previewType === 'localPreview';
    // 线上外网文件预览
    if (data.url && !isLocalPreview) {
      state.visible = true;
      setInnerFileUrl(data.url + '?fullfilename=' + getFileName(data));
      return;
    }
    const fileUrl = getFileUrl(data);
    if (!fileUrl) return handleCancel();
    state.visible = true;
    state.currentfileUrl = fileUrl;
    setInnerFileUrl(fileUrl);
  }

  // 处理多个文件预览
  function handleFilePreviewList(fileList) {
    pageInfo.list = fileList;
    pageInfo.total = fileList.length;
    const curentFile = fileList[pageInfo.currentIndex];
    handleSingleFile(curentFile);
  }
  // 处理多文件的切换预览
  function handleChangePage(type: 'prev' | 'next') {
    if (type == 'prev') {
      pageInfo.currentIndex--;
    } else {
      pageInfo.currentIndex++;
    }
    const curentFile = pageInfo.list[pageInfo.currentIndex];
    handleSingleFile(curentFile);
  }

  function init(data: {
    version?: '2' | '1' | 2 | 1; // 2为新版接口 1为旧版接口
    filePath: string; // 文件路径
    previewApi?: any; // 预览接口
    previewType: 'localPreview'; // 预览方式localPreview为内部文件预览
    url: string; // 文件url，无需token即可访问的外部文件，优先级较高
    Id: string; // 文件id，通过id获取文件url
    fileList: FileInfo[]; // 文件列表
    currentIndex?: number; // 当前文件索引,默认为0; 当fileList存在时生效
    resize?: boolean; // 是否可以手动拖曳缩放
  }) {
    state.url = '';
    state.previewType = data.previewType;
    state.version = data.version || 1;
    isCanResize.value = data.resize || false;
    if (data.fileList && data.fileList.length > 0) {
      pageInfo.currentIndex = data.currentIndex || 0;
      return handleFilePreviewList(data.fileList);
    }
    handleSingleFile(data);
  }

  // 下载图纸
  function handleDownload() {
    downloadFile({
      filePath: state.currentfileUrl,
      fileName: state.currentFileName,
    });
  }

  function handleCancel() {
    state.loading = false;
    state.visible = false;
    state.url = '';
    state.currentFileName = '';
    state.currentfileUrl = '';
    emits('close');
  }
  defineExpose({ init });
</script>
<style lang="less">
  .file-preview-modal {
    > div {
      height: 100%;
    }

    .ant-modal-body {
      padding: 10px !important;
    }

    .header-title {
      position: relative;
    }

    .header-txt {
      max-width: 80vw !important;
    }

    .load-percent {
      color: #594e4e;
      margin-left: 10px;
      font-size: 14px;
      position: absolute;
      left: 0;
      bottom: -6px;
    }

    .basic-content {
      position: relative;

      .loadfile-progress {
        width: 98%;
        position: absolute;
        top: 0;
        left: 1%;
        right: 0;
        opacity: 0.3;
      }
    }
  }

  .preview-modal {
    div.ant-modal-body {
      height: calc(100% - 80px) !important;
    }
  }

  .resize-preview-modal {
    .ant-modal-content {
      resize: both;
    }
  }

  .ant-modal-wrap.fullscreen-modal.resize-preview-modal {
    overflow: hidden;
    pointer-events: none;
  }

  .no-frame-border {
    border: none;
  }
</style>
