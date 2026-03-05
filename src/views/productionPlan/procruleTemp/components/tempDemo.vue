<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="state.title"
    @cancel="handleCloseFn"
    destroyOnClose
    :okText="t('common.edit')"
    @ok="handleSubmit">
    <!-- :="false" -->
    <TempForm
      :tempList="state.tempListData"
      ref="tempFormRef"
      :colSpan="12"
      :isNeedValidate="true"
      :processName="state.processName"
      :operationType="state.operationType" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';

  const { t } = useI18n();
  const emit = defineEmits(['refresh', 'onEdit']);
  interface State {
    dataForm: any;
    id: string;
    processName: string;
    operationType: string;
    title: any;
    tempListData: any[];
  }
  const state = reactive<State>({
    dataForm: {},
    id: '',
    title: '',
    tempListData: [],
    processName: '',
    operationType: '',
  });
  const tempFormRef = ref();
  const [registerModal, { closeModal }] = useModalInner(init);

  async function handleSubmit() {
    closeModal();
    emit('onEdit', { id: state.id, type: state.operationType });
  }

  async function handleCloseFn() {
    closeModal();
  }

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(preSetType, id = '') {
    const { code, data } = await getProcrulesTempDetail({ id });
    if (code == 200) {
      if (!data.detailList) return;
      state.tempListData = data.detailList.filter(item => {
        item.isDisabled = 1;
        return item.operationTypes.includes(preSetType);
      });
    }
  }

  async function init({ title, id, item }) {
    state.title = title;
    state.id = id;
    state.operationType = item.type;
    getProcrulesTempDetailFn(item.type, item.id);
  }
</script>
