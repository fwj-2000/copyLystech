<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="state.title" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        {{ state.content }}
        <span v-if="state.required" class="text-red-800">*</span>
      </div>
      <a-textarea :showCount="true" v-model:value.trim="state.remarks" :maxlength="200" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const state = reactive<{
    remarks: string; // 备注
    api: null | CallableFunction; // 提交api
    beforeFetch: null | CallableFunction; // 提交前回调
    ids: string[]; // 选中的id
    title: string; // 标题
    content: string | null; // 内容label
    required: boolean; // 是否必填
  }>({
    remarks: '',
    api: null,
    beforeFetch: null,
    ids: [],
    title: '',
    content: null,
    required: false,
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.ids = data.ids;
    state.remarks = '';
    state.api = data.api;
    state.beforeFetch = data.beforeFetch;
    state.content = data.content || data.title + t('common.reasonText');
    state.title = data.title;
    state.required = data.required;
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    if (!state.api) {
      return createMessage.warning('缺失api参数');
    }
    if (state.required && !state.remarks) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    let params = {
      ids: state.ids,
      remarks: state.remarks,
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
    } catch (error) {
      changeOkLoading(false);
    }
  }
</script>
