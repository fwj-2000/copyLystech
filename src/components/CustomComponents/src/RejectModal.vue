<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="t('common.rejectText')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        {{ t('common.rejectReson') }}
        <span class="text-red-800">*</span>
      </div>
      <a-textarea :showCount="true" v-model:value.trim="state.rejectRemark" :placeholder="t('common.inputText')" :maxlength="200" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const state = reactive<{
    rejectRemark: string;
    api: null | CallableFunction;
    beforeFetch: null | CallableFunction;
    ids: string[];
  }>({
    rejectRemark: '',
    api: null,
    beforeFetch: null,
    ids: [],
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.ids = data.ids;
    state.rejectRemark = '';
    state.api = data.api;
    state.beforeFetch = data.beforeFetch;
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    if (!state.api) {
      changeOkLoading(false);
      return createMessage.warning('缺失api参数');
    }
    if (!state.rejectRemark) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    let params = {
      ids: state.ids,
      rejectRemark: state.rejectRemark,
      nodeId: '',
    };
    if (state.beforeFetch) {
      params = state.beforeFetch(params);
    }
    try {
      const r = await state.api(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      createMessage.success(t('sys.api.operationSuccess'));
      changeOkLoading(false);
      closeModal();
      emit('reload');
    } finally {
      changeOkLoading(false);
    }
  }
</script>
