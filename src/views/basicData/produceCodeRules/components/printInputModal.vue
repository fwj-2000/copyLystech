<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.printQuantity')" showOkBtn @ok="handleSubmit" width="300px" :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { geTemplabel } from '/@/api/basicData/moduleRules';

  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'printNum',
      label: t('dict.CommonCol.printQuantity'),
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入数量',
        autoComplete: 'off',
      },
      required: true,
      colProps: { span: 24 },
    },
  ];

  const emit = defineEmits(['register', 'reload', 'openPrintPop']);
  const [registerForm, { validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const IDField = ref(''); // 内部料号

  async function init(data) {
    // resetFields();
    IDField.value = data.IDField;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const { data } = await geTemplabel({ productCode: IDField.value, quantity: values.printNum }).finally(() => {
      changeOkLoading(false);
    });
    emit('openPrintPop', data);
    closeModal(); //关闭弹窗
  }
</script>
