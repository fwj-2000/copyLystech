<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="分配" showOkBtn @ok="handleSubmit" width="300px" :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateoutsource } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'allocateNum',
      label: '分配',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
    },
  ];

  const emit = defineEmits(['closeModal']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'MoldApplyColumn',
    //   transferRange: ['label', 'placeholder'],
    // },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const partRelationIds = ref([]);
  async function init(data) {
    changeLoading(true);
    resetFields();
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    closeModal(); //关闭弹窗
    emit('closeModal', values.allocateNum);
  }
</script>
