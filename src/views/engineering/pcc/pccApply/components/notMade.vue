<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="t('dict.PCCColumn.notMade')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        {{ t('common.notMakeReason') }}
        <span class="text-red-800" v-show="state.require">*</span>
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
    list: any[];
    require: boolean;
  }>({
    rejectRemark: '',
    api: null,
    beforeFetch: null,
    list: [],
    require: false,
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.list.every(item => item.demandType == 'Quantitative')) {
      state.require = false;
    } else {
      state.require = true;
    }
    console.log(state.require);
    state.list = data.list;
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
    if (state.require && !state.rejectRemark) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    let params = {
      list: state.list,
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
