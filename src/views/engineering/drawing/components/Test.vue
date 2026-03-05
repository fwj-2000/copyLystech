<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    title="CPK报告上传"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    class="h-full">
    123123
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { computed, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();

  const state = reactive({
    loading: false,
  });

  // 状态跟踪
  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as any[],
  });

  const { loading } = toRefs(state);
  const uploadProgress = computed(() => {
    return `${uploadState.activeUploads} / ${uploadState.allFiles.length}`;
  });

  function init() {}

  function handleSubmit() {}
</script>
