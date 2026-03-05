<template>
  <BasicModal v-bind="$attrs" @register="registerModal" showOkBtn @ok="handleSubmit">
    <template #title>
      <Subtitle :title="t('common.selectShift')" style="padding-bottom: 0" />
    </template>
    <div class="flex align-center h-[200px]">
      <a-radio-group v-model:value="active" :options="state.dutyTypeMap" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload', 'onSelect']);
  interface IState {
    settingObj: any;
    initData: any;
    dutyTypeMap: any;
  }
  const state = reactive<IState>({
    settingObj: {},
    initData: {},
    dutyTypeMap: [],
  });
  const active = ref('1');
  const [registerModal, { closeModal }] = useModalInner(init);

  async function init({ currentField, data, index }) {
    const dutyTypeList: any = await baseStore.getDictionaryData('dutyType');
    state.dutyTypeMap = dutyTypeList.map(item => {
      return { label: item.fullName, value: Number(item.enCode) };
    });
    active.value = data[currentField]?.dutyType;
    state.initData = { currentField, data, index };
    state.settingObj = data[currentField];
  }

  //提交
  function handleSubmit() {
    state.settingObj.dutyType = active.value;
    emit('onSelect', { rows: state.initData.data, target: state.settingObj, index: state.initData.index, currentField: state.initData.currentField });
    closeModal();
  }
</script>
