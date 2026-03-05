<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="800"
    :title="t('common.viewText')"
    :showCancelBtn="false"
    showOkBtn
    @ok="handleSubmit"
    :okText="t('common.okText')">
    <div class="w-full h-[450px] border border-[#ccc] p-[20px] rounded-[10px] overflow-auto">
      <a-image-preview-group>
        <div class="w-full grid grid-cols-4 gap-4">
          <div class="w-[150px] flex border border-[#ccc] rounded-[10px] p-[5px]" v-for="value in fileList">
            <a-image :height="140" :src="value.url" :style="{ objectFit: 'contain' }" class="rounded-[10px] img-fit" />
          </div>
        </div>
      </a-image-preview-group>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref } from 'vue';
  import { getAppEnvConfig } from '/@/utils/env';
  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';
  //状态//
  const { t } = useI18n();
  const emit = defineEmits(['register', 'reload', 'submit']);
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const fileList = ref<any>([]);
  function init(data) {
    fileList.value = [];
    fileList.value = data.imageList.map((item, i) => {
      return {
        url: IMG_URL_PREFIX + item.url,
        name: item.name,
      };
    });
  }

  async function handleSubmit() {
    changeOkLoading(false);
    closeModal();
  }
</script>
<style scoped lang="less">
  :deep(.ant-upload-list) {
    flex-wrap: wrap;
  }
</style>
