<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <slot name="prenext"></slot>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { syncEquipmentFromSAP } from '/@/api/equipment/information';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { func } from 'vue-types';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'sapFactoryAreaCode',
      label: 'SAP工厂代码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'equipmentCode',
      label: '设备编码',
      i18nField: 'Code',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => t('common.syncSap'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentInformationColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init() {
    resetFields();
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;

    changeOkLoading(true);
    const query = {
      ...values,
    };

    const formMethod = syncEquipmentFromSAP;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
