<template>
  <BasicModal
    v-bind="$attrs"
    :minHeight="300"
    :title="t('dict.mouldBusiness.terminateMaintenance')"
    showOkBtn
    destroy-on-close
    @register="registerModal"
    @ok="handleSubmit">
    <div class="mb-20px">
      <div class="mb-8px">
        <span class="required-sign">*</span>
        {{ t('common.reasonText') }}
      </div>
      <a-textarea :showCount="true" v-model:value.trim="state.changeReason" :placeholder="t('common.inputText')" :maxlength="200" />
      <div class="mb-8px mt-8px">
        <span class="required-sign">*</span>
        {{ t('common.moldProcessingMethod') }}
      </div>
      <DynamicSelect
        v-model:value="state.dealType"
        v-model:options="options"
        v-model:otherContent="state.otherTypeDescribe"
        :other-value="MOLD_PROCESSING_METHOD_ENUM.其他" />
      <template v-if="state.dealType === MOLD_PROCESSING_METHOD_ENUM.封存">
        <div class="mb-8px mt-8px"> 封存时长(月) </div>
        <a-input-number v-model:value="state.sealingDuration" :precision="0" />
      </template>
    </div>
    <UploadArea v-model:file-list="state.fileList" style="height: 350px" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { moldProcessingMethodOptions, MOLD_PROCESSING_METHOD_ENUM } from '../config';
  import { endrepair } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { cloneDeep } from 'lodash-es';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import UploadArea from './uploadArea.vue';
  import DynamicSelect from './dynamicSelect.vue';

  const { t } = useI18n();
  const state = reactive<{
    changeReason: string;
    repairId: string;
    fileList: any[];
    dealType: string;
    sealingDuration: number;
    otherTypeDescribe: string;
  }>({
    changeReason: '',
    repairId: '',
    fileList: [],
    dealType: '',
    sealingDuration: 0,
    otherTypeDescribe: '',
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const options = ref(cloneDeep(moldProcessingMethodOptions));

  function init(data) {
    options.value = cloneDeep(moldProcessingMethodOptions);
    state.changeReason = '';
    state.dealType = '';
    state.repairId = data.ids;
    state.fileList = [];
    state.sealingDuration = 0;
    state.otherTypeDescribe = '';
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    if (!state.changeReason) {
      changeOkLoading(false);
      return createMessage.warning(t('common.reasonInput'));
    }
    try {
      const params = new FormData();
      Object.keys(state).forEach(key => {
        if (key === 'fileList') {
          state.fileList.forEach(item => {
            params.append('fileList', item.file);
          });
        } else {
          params.append(key, state[key]);
        }
      });

      const r = await endrepair(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      createMessage.success(t('sys.api.operationSuccess'));
      changeOkLoading(false);
      closeModal();
      emit('reload');
    } catch (error) {
      console.warn(error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
