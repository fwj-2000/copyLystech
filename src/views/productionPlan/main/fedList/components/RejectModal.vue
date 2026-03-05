<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.rejectText')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="mt-16px">
      <div class="mb-8px">
        {{ t('common.rejectReson') }}
        <span class="text-red-800">*</span>
      </div>
      <a-textarea :showCount="true" v-model:value.trim="rejectRemark" :placeholder="t('common.inputText')" :maxlength="200" />
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { poRejectbatch } from '/@/api/mps/productionPlan/MPS';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload', 'selectPOForChild', 'refreshMainTableExpand']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const rejectRemark = ref('');
  const rejectIds = ref([]);

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init({ ids }) {
    rejectIds.value = ids;
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    const { code, msg } = await poRejectbatch('0', rejectRemark.value, rejectIds.value).finally(() => {
      changeOkLoading(false);
    });
    if (code == 200) {
      createMessage.success(msg);
      closeModal(); //关闭弹窗
      emit('reload');
    } else {
      createMessage.error(msg);
    }
  }
</script>
