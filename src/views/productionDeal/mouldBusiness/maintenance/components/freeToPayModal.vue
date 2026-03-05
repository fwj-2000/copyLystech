<template>
  <BasicModal
    v-bind="$attrs"
    :minHeight="300"
    :title="t('dict.mouldBusiness.freeToPayChange')"
    showOkBtn
    destroy-on-close
    @register="registerModal"
    @ok="handleSubmit">
    <div class="mb-20px">
      <div class="mb-8px">
        <span class="required-sign">*</span>
        {{ t('common.reasonText') }}
      </div>
      <a-textarea :showCount="true" v-model:value.trim="state.changeReason" :placeholder="t('common.inputText')" :maxlength="200" />
    </div>
    <UploadArea v-model:file-list="state.fileList" style="height: 440px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { payrepair } from '/@/api/productionDeal/mouldBusinessMaintenance';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import UploadArea from './uploadArea.vue';

  const { t } = useI18n();
  const state = reactive<{
    changeReason: string;
    repairId: string;
    fileList: any[];
  }>({
    changeReason: '',
    repairId: '',
    fileList: [],
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data: any) {
    state.changeReason = '';
    state.repairId = data.ids;
    state.fileList = [];
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    if (!state.changeReason) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    try {
      const params = new FormData();
      Object.keys(state).forEach(key => {
        if (key === 'fileList') {
          state.fileList.forEach(item => {
            params.append('fileList', item.file);
          });
        } else {
          params.append(key, state[key]);
        }
      });

      const r = await payrepair(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      createMessage.success(t('sys.api.operationSuccess'));
      changeOkLoading(false);
      closeModal();
      emit('reload');
    } catch (error) {
      console.warn('error:', error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
