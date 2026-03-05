<template>
  <BasicModal v-bind="$attrs" @register="registerModal" showOkBtn @ok="handleSubmit">
    <template #title>
      <Subtitle :title="t('dict.FactoryCalendarColumn.IsRestDay')" style="padding-bottom: 0" />
    </template>
    <div class="flex align-center h-[200px]">
      <a-radio-group v-model:value="active" :options="state.dutyTypeMap" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useBaseStore } from '/@/store/modules/base';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  const baseStore = useBaseStore();

  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload', 'onSelect']);
  interface IState {
    dutyTypeMap: any;
    index: number;
    currentField: string;
  }
  const state = reactive<IState>({
    dutyTypeMap: [],
    index: 0,
    currentField: '',
  });
  const active = ref('1');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  async function init({ currentField, row, index }) {
    changeLoading(true);
    const dutyTypeList: any = await baseStore.getDictionaryData('YesOrNo');
    state.dutyTypeMap = dutyTypeList.map(item => {
      return { label: item.fullName, value: item.enCode };
    });
    active.value = row[currentField] === '1' ? '1' : '0';
    state.index = index;
    state.currentField = currentField;
    changeLoading(false);
  }

  //提交
  function handleSubmit() {
    emit('onSelect', { index: state.index, currentField: state.currentField, rest: active.value });
    closeModal();
  }
</script>
