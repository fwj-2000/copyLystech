<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.confirmreceipt')" showOkBtn @ok="handleSubmit" :destroyOnClose="true" width="1000px">
    <a-tabs class="bg-white" v-model:activeKey="activeKey">
      <!-- 单品 -->
      <a-tab-pane key="single" :tab="t('dict.CommonCol.item')" :forceRender="true">
        <SingleItem ref="singleRef" @reload="reloadFn" @changeLoading="changeLoadingFn" @closeModal="closeModalFn" />
      </a-tab-pane>
      <!-- 批次 -->
      <a-tab-pane key="individual" :tab="t('dict.CommonCol.batchNo')" :forceRender="true">
        <IndividualItem ref="individualRef" @reload="reloadFn" @changeLoading="changeLoadingFn" @closeModal="closeModalFn" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import IndividualItem from './IndividualItem.vue';
  import SingleItem from './SingleItem.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const activeKey = ref('single');
  const singleRef = ref();
  const individualRef = ref();

  const emit = defineEmits(['register', 'reload']);

  // 关闭弹窗
  const closeModalFn = () => {
    closeModal();
  };

  const reloadFn = () => {
    emit('reload');
  };

  // loading
  const changeLoadingFn = status => {
    changeLoading(status);
  };

  function init({ receiveTable }) {
    singleRef.value.init();
    individualRef.value.init({ receiveTable });
  }

  //提交
  async function handleSubmit() {
    if (activeKey.value === 'single') {
      singleRef.value.handleSubmit();
    } else {
      individualRef.value.handleSubmit();
    }
  }
</script>
