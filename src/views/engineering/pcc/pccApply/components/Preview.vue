<template>
  <a-modal
    v-model:visible="visible"
    :footer="null"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { encryptByBase64 } from '/@/utils/cipher';
  import { processUrl } from '/@/adapter/utils';

  interface State {
    visible: boolean;
    loading: boolean;
    title: string;
    url: string;
  }

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
    state.title = `${t('component.filePreview.filPreview')} - ` + data.name;
    state.visible = true;
    state.loading = true;
    // state.url = data.url;
    state.url = `${globSetting.filePreviewServer}/onlinePreview?url=` + encodeURI(encryptByBase64(processUrl(data.url))) + '&token=' + getToken();
    console.log(state.url);
    state.loading = false;
  }

  function handleCancel() {
    state.visible = false;
  }
</script>
<style lang="less">
  .file-preview-modal {
    .ant-modal-body {
      padding: 10px !important;
    }

    .header-txt {
      max-width: 80vw !important;
    }
  }
</style>
