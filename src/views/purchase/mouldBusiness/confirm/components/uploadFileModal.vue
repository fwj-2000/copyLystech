<template>
  <BasicModal
    v-bind="$attrs"
    :minHeight="300"
    :title="t('component.upload.uploadFile')"
    showOkBtn
    destroy-on-close
    @register="registerModal"
    @ok="handleSubmit">
    <UploadArea v-model:file-list="state.fileList" style="height: 400px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { uploaddrawings } from '/@/api/productionDeal/mouldBusinessMaintenance';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import UploadArea from '/@/views/productionDeal/mouldBusiness/maintenance/components/uploadArea.vue';
  import UploadArea from './uploadArea.vue';

  const { t } = useI18n();
  const state = reactive<{
    beforeFetch: null | CallableFunction;
    ids: string[];
    fileList: any[];
  }>({
    beforeFetch: null,
    ids: [],
    fileList: [],
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.beforeFetch = data.beforeFetch;
    state.ids = data.ids;
    state.fileList = [];
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    // const formData = new FormData();

    // formData.append('billId', state.ids.join(','));
    // state.fileList.forEach(item => {
    //   formData.append('fileList', item.file);
    // });

    try {
      const r = await uploaddrawings({ id: state.ids.join(','), fileJson: state.fileList });
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      createMessage.success(t('sys.api.operationSuccess'));
      closeModal();
      emit('reload');
    } catch (error) {
      console.warn('error:', error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
