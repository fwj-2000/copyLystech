<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="state.title" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">{{ t('common.reasonText') }}</div>
      <a-textarea :showCount="true" v-model:value.trim="state.remark" :placeholder="t('common.inputText')" :maxlength="200" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const state = reactive<{
    remark: string;
    api: null | CallableFunction;
    beforeFetch: null | CallableFunction;
    afterFetch: null | CallableFunction;
    ids: string[];
    listParamName: string;
    listParamValue: string;
    title: string;
  }>({
    remark: '',
    api: null,
    beforeFetch: null,
    afterFetch: null,
    ids: [],
    listParamName: 'ids',
    listParamValue: 'ids',
    title: t('common.stopText'),
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    const { listParamName, listParamValue } = data;
    state.listParamName = listParamName;
    state.listParamValue = listParamValue;
    state[listParamValue] = data[listParamValue];
    state.remark = '';
    state.api = data.api;
    state.beforeFetch = data.beforeFetch;
    state.title = data.title || t('common.stopText');
    state.afterFetch = data.afterFetch;
  }

  // 提交数据
  async function handleSubmit() {
    const { listParamName, listParamValue } = state;
    changeOkLoading(true);
    if (!state.api) {
      return createMessage.warning('缺失api参数');
    }
    if (!state.remark) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    let params = {
      [listParamName]: toRaw(state[listParamValue]),
      remark: state.remark,
      nodeId: '',
    };
    if (state.beforeFetch) {
      params = state.beforeFetch(params);
    }
    try {
      const r = await state.api(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));

      if (state.afterFetch && typeof state.afterFetch === 'function') {
        state.afterFetch(r);
      }
      createMessage.success(t('sys.api.operationSuccess'));
      changeOkLoading(false);
      closeModal();
      emit('reload');
    } catch (error) {
      changeOkLoading(false);
    }
  }
</script>
