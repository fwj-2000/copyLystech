<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.batchExport')"
    showOkBtn
    @ok="handleSubmit"
    :okText="t('common.exportText')"
    width="800px">
    <a-textarea type="textarea" v-model:value="snCodes" :rows="20" :placeholder="t('dict.CommonCol.exportPlaceholder')" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { sntraceExport } from '/@/api/productionDeal/snTraceabilityReport';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';

  const snCodes = ref('');

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init() {
    snCodes.value = '';
  }

  //提交
  async function handleSubmit() {
    if (!snCodes.value) return;
    changeOkLoading(true);
    const snCodeList = snCodes.value && snCodes.value.trim().split(/\s+/);
    sntraceExport({ snCodes: snCodeList }).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      createMessage.success(res.msg);
      changeOkLoading(false); //用于修改确认按钮的loading状态
      closeModal(); //关闭弹窗
    });
  }
</script>
