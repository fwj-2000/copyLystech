<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" title="备注" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        <span class="text-red-800">*</span>
        备注
      </div>
      <a-textarea
        :showCount="true"
        :autoSize="{ minRows: 6, maxRows: 10 }"
        v-model:value.trim="state.rejectRemark"
        :placeholder="t('common.inputText')"
        :maxlength="500" />
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
    ids: string;
  }>({
    rejectRemark: '',
    api: null,
    beforeFetch: null,
    ids: '',
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.ids = data.ids;
    state.rejectRemark = data.remark || '';
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
      return createMessage.warning('请输入备注');
    }
    let params = {
      id: state.ids,
      remark: state.rejectRemark,
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
