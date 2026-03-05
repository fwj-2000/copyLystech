<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.batchImport')"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    class="lydc-import-modal">
    <div class="import-main">
      <div class="upload">
        <div class="up_left">
          <img src="/@/assets/images/upload.png" />
        </div>
        <div class="up_right !pt-16px">
          <p class="title">{{ t('sys.lang.uploadtDesc1') }}</p>
          <p class="tip !my-10px">{{ t('sys.lang.uploadtDesc2') }}</p>
          <p class="tip !my-10px">{{ t('sys.lang.uploadtDesc3') }}</p>
          <a-upload
            v-feature
            v-model:file-list="fileList"
            class="upload-area"
            accept=".xls,.xlsx"
            :max-count="1"
            :action="getAction"
            :headers="getHeaders"
            :before-upload="beforeUpload"
            @remove="handleFileRemove"
            @change="handleFileChange">
            <a-button type="link">{{ t('component.upload.uploadFile') }}</a-button>
          </a-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="/@/assets/images/import.png" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('sys.lang.importDesc1') }}</p>
          <p class="tip">{{ t('sys.lang.importDesc2') }}</p>
          <a-button type="link" @click="handleTemplateDownload()">{{ t('common.exportTemplate') }}</a-button>
        </div>
      </div>
    </div>
    <template #insertFooter>
      <a-button @click="closeModal()">{{ t('common.cancelText') }}</a-button>
      <a-button type="primary" @click="handleImport" :loading="btnLoading" :disabled="!fileName">{{ t('component.upload.upload') }}</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { templateDownload, importData } from '/@/api/system/baseLang';

  interface State {
    fileName: string;
    fileList: UploadFile[];
    btnLoading: boolean;
  }

  const state = reactive<State>({
    fileName: '',
    fileList: [],
    btnLoading: false,
  });
  const { fileName, fileList, btnLoading } = toRefs(state);
  const emit = defineEmits(['register', 'reload']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const globSetting = useGlobSetting();

  const getAction = computed(() => globSetting.apiUrl + '/api/system/BaseLang/Uploader');
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  function init() {
    state.fileName = '';
    state.fileList = [];
    state.btnLoading = false;
  }
  function handleImport() {
    if (!state.fileList.length || !state.fileName) return createMessage.warning(t('component.upload.needFile'));
    state.btnLoading = true;
    importData({ fileName: state.fileName })
      .then(res => {
        state.btnLoading = false;
        createMessage.success(res.msg);
        emit('reload');
        closeModal();
      })
      .catch(() => {
        state.btnLoading = false;
      });
    return;
  }
  function handleFileChange({ file }: UploadChangeParam) {
    if (file.status === 'error') {
      createMessage.error(t('component.upload.uploadError'));
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 200) {
        state.fileName = file.response.data.name;
      } else {
        createMessage.error(file.response.msg);
      }
    }
  }
  function beforeUpload(file) {
    const fileType = file.name.replace(/.+\./, '');
    const isAccept = ['xls', 'xlsx'].indexOf(fileType.toLowerCase()) !== -1;
    if (!isAccept) {
      createMessage.error(t('sys.lang.importWarn1'));
      return AUpload.LIST_IGNORE;
    }
    const isRightSize = file.size / 1024 < 500;
    if (!isRightSize) {
      createMessage.error(t('sys.lang.importWarn2'));
      return AUpload.LIST_IGNORE;
    }
    return true;
  }
  function handleFileRemove(file) {
    return new Promise<void>((resolve, reject) => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: `${t('common.remove')}${file.name}?`,
        onOk: () => {
          state.fileName = '';
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }
  function handleTemplateDownload() {
    templateDownload().then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }
</script>
