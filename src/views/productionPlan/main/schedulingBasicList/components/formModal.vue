<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="true" @ok="handleSubmit" @register="registerModal" width="500px" destroyOnClose>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addSyncSchedule, updateSyncSchedule } from '/@/api/mps/productionPlan/schedulingBasicList';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema } from '../config';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 80,
    schemas: formSchema,
    i18nConfig: {
      moduleCode: 'MPSColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  async function init({ row }) {
    resetFields();
    state.dataForm = {};
    if (row) {
      setFieldsValue(row);
      state.dataForm = row;
    } else {
      setFieldsValue({ status: 1 });
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const params = {
      ...values,
      id: state.dataForm.id,
    };
    try {
      const { code, msg } = await (state.dataForm.id ? updateSyncSchedule(state.dataForm.id, params) : addSyncSchedule(params));
      if (code == 200) {
        createMessage.success(msg);
        closeModal();
        emit('reload');
        return;
      }
      createMessage.error(msg);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
