<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :showOkBtn="modalId ? false : true" @ok="handleSubmit" destroyOnClose width="1350px" :minHeight="660">
    <template #title>
      <div class="ml-16px">
        <Subtitle :title="modalTitle" />
      </div>
    </template>

    <a-tabs class="bg-white" v-model:activeKey="activeKey">
      <a-tab-pane key="onetomany" :tab="t('dict.CommonCol.oneToMany')" :forceRender="true">
        <Onetomany ref="onetomanyRef" @refresh="refreshFn" @changeLoading="changeLoadingFn" @closeModal="closeModalFn" />
      </a-tab-pane>
      <a-tab-pane key="manytoone" :tab="t('dict.CommonCol.manyToOne')" :forceRender="true">
        <Manytoone ref="manytooneRef" @refresh="refreshFn" @changeLoading="changeLoadingFn" @closeModal="closeModalFn" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import Onetomany from './onetomany.vue';
  import Manytoone from './manytoone.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';

  const { t } = useI18n();
  const emit = defineEmits(['refresh']);
  const modalTitle = ref('');
  const modalId = ref('');
  const activeKey = ref('onetomany');
  const onetomanyRef = ref();
  const manytooneRef = ref();

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const refreshFn = () => {
    emit('refresh');
  };

  // loading
  const changeLoadingFn = status => {
    changeLoading(status);
  };

  // 关闭弹窗
  const closeModalFn = () => {
    closeModal();
  };

  // 提交
  async function handleSubmit() {
    if (activeKey.value === 'onetomany') {
      onetomanyRef.value.handleSubmit();
    } else {
      manytooneRef.value.handleSubmit();
    }
  }

  async function init({ title, data, templistParams, pageType }) {
    modalTitle.value = title;
    modalId.value = data.id;

    onetomanyRef.value.init({ templistParams });
    manytooneRef.value.init({ templistParams, pageType });
  }
</script>
<style lang="less" scoped>
  .form-block {
    max-height: 540px;

    &-headerBox {
      border-bottom: 2px solid #ff7b00;
      display: flex;
      align-items: center;
    }

    &-header {
      padding: 10px;
      background: #ff7b00;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      border-radius: 4px 6px 0 0;
    }

    &-title {
      font-size: 12px;
    }

    .triangle-right {
      display: inline-block;
      width: 0;
      height: 0;
      border-bottom: 42px solid #ff7b00;
      border-right: 38px solid transparent;
      position: relative;
      top: 0;
      left: -4px;
    }

    &-content {
      background: #f5f5f5;
    }
  }

  ::v-deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .form-search-block {
    margin-bottom: 12px;
  }

  ::v-deep(.scroll-container) {
    padding: 0 20px !important;
  }

  ::v-deep(.lydc-subtitle-container) {
    padding: 0;

    .title {
      font-size: 16px;
    }
  }

  ::v-deep .c-title {
    margin-top: 10px;

    .title {
      font-size: 14px;
    }
  }

  ::v-deep .ant-table-title {
    // display: none;
    padding: 4px !important;
  }
</style>
