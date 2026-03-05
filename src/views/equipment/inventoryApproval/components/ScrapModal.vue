<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" title="废弃" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        废弃原因
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
    ids: string[];
  }>({
    rejectRemark: '',
    ids: [],
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.ids = data.ids;
    state.rejectRemark = '';
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    if (!state.rejectRemark) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    // let params = {
    //   ids: state.ids,
    //   rejectRemark: state.rejectRemark,
    // };
    try {
      // const r = await state.api(params);
      // if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      // createMessage.success(t('sys.api.operationSuccess'));
      // changeOkLoading(false);
      // closeModal();
      // emit('reload');
    } catch (error) {
      changeOkLoading(false);
      throw error;
    }
  }
</script>
