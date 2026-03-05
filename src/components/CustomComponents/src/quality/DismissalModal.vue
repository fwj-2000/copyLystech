<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="t('common.rejectText')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div>
      <div class="mb-8px">{{ t('component.dismissalModal.rejectPreviousNode') }}</div>
      <div> {{ state.name }} </div>
    </div>
    <div class="mt-16px">
      <div class="mb-8px">{{ t('common.rejectReson') }}</div>
      <a-textarea :showCount="true" v-model:value.trim="state.remark" :placeholder="t('common.inputText')" :maxlength="200" />
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
    remark: string;
    name: string;
    id: string;
  }>({
    remark: '',
    name: '',
    id: '',
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.name = data.name;
    state.id = data.id;
  }

  // 提交数据
  async function handleSubmit(e) {
    // changeOkLoading(true);
  }
</script>
