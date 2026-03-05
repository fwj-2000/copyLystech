<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.innerReScan')"
    destroy-on-close
    :showOkBtn="false"
    width="400px"
    :minHeight="50">
    <div class="mb-12px">
      <LydcInput
        class="w-[100%] translate-input"
        :suffixIcon="'icon-ym icon-ym-scanCode'"
        v-model:value="translateInput"
        :placeholder="t('dict.CommonCol.scanQRCode')"
        @Keydown="handlerInputKeydown" />
    </div>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { getSnsByInCode } from '/@/api/productionDeal/packagePrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const translateInput = ref('');
  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const designindexPrint = ref<DesignindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload', 'openPrintSN']);
  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  async function init() {
    document.getElementsByClassName('translate-input')[0]?.querySelector('input')?.focus();
    translateInput.value = '';
    const packageReScanLocalStorageData = localStorage.getItem('halfCodePackageReScanCache');
    if (!packageReScanLocalStorageData) {
      // 本地没有补扫缓存数据则不需要提示用户
      return;
    }
    handleRescanCache();
  }

  function handleRescanCache() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.isRescanTip'),
      onOk: async () => {
        // 补扫上一次的操作
        emit('openPrintSN', {});
        closeModal();
      },
      onCancel: () => {
        // 清空之前的补扫缓存
        localStorage.removeItem('halfCodePackageReScanCache');
      },
    });
  }

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    handleSubmit();
  };

  //提交

  async function handleSubmit() {
    if (!translateInput.value) return message.error(t('dict.CommonCol.scanInnerLabelTip'));
    changeOkLoading(true);
    const { data, code } = await getSnsByInCode({ inCode: translateInput.value }).finally(() => {
      changeOkLoading(false);
    });
    if (code === 200) {
      emit('openPrintSN', { ...data, inCode: translateInput.value });
      closeModal();
    }
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
