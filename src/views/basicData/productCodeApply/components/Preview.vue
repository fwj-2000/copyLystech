<template>
  <a-modal
    v-model:open="visible"
    :footer="null"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :bodyStyle="{ height: '100%' }"
    class="common-container-modal lydc-full-modal full-modal file-preview-modal"
    wrap-class-name="fullscreen-modal preview-modal">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <template #title>
      <div class="lydc-full-modal-header">
        <div class="header-title">
          <p class="header-txt">{{ title }}</p>
        </div>
        <a-space class="options" :size="10">
          <a-button @click="handleCancel()">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div class="basic-content bg-white" v-loading="loading">
      <iframe width="100%" height="100%" :src="url"></iframe>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { Modal as AModal } from 'ant-design-vue';
  import ModalClose from '/@/components/Modal/src/components/ModalClose.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { encryptByBase64 } from '/@/utils/cipher';
  import { previewDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { processUrl } from '/@/adapter/utils';

  interface State {
    visible: boolean;
    loading: boolean;
    title: string;
    url: string;
  }

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const state = reactive<State>({
    visible: false,
    loading: false,
    title: '',
    url: '',
  });
  const { visible, loading, title, url } = toRefs(state);

  defineExpose({ init });

  function init(data) {
    console.log(data);
    state.title = t('component.filePreview.filPreview') + ' - ' + data.name;
    state.url = '';
    if (!data.Id) {
      state.visible = false;
      return;
    }
    state.visible = true;
    state.loading = true;
    previewDrawingshistory(data)
      .then(res => {
        console.log(res);
        state.loading = false;
        if (res.data) {
          if (data.previewType === 'localPreview') {
            state.url = `${globSetting.filePreviewServer}/onlinePreview?url=` + encodeURI(encryptByBase64(processUrl(res.data))) + '&token=' + getToken();
            return;
          }
          state.url = res.data;
        } else {
          createMessage.warning(t('component.filePreview.FileNotExist'));
          handleCancel();
        }
      })
      .catch(() => {
        state.loading = false;
        handleCancel();
      });
  }

  function handleCancel() {
    state.visible = false;
  }
</script>
<style lang="less" scoped>
  :deep(.ant-modal-wrap) {
    height: 100px !important;
  }

  .file-preview-modal {
    .ant-modal-body {
      padding: 10px !important;
    }

    .header-txt {
      max-width: 80vw !important;
    }
  }
</style>
