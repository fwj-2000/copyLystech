<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" :okText="t('common.copy')">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { addPrintTemplate } from '/@/api/system/printTemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const state = ref<any>({});
  const baseStore = useBaseStore();
  const schemas: FormSchema[] = [
    {
      field: 'name',
      label: '模板名称',
      component: 'Input',
      componentProps: { placeholder: '请输入', maxlength: 50 },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
  ];
  const { t } = useI18n();
  const getTitle = t('common.copy');
  const emit = defineEmits(['register', 'reload', 'submit']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({ labelWidth: 80, schemas: schemas });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.value = data.record;
    resetFields();
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    delete state.value.en_code;
    delete state.value.id;
    addPrintTemplate({
      ...state.value,
      name: values.name,
    }).then(res => {
      changeOkLoading(false);
      closeModal();
      createMessage.success('复制成功');
      emit('submit', values, state);
      emit('reload');
    });
  }
</script>
