<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="保存模版" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { saveAsTemplate } from '/@/api/engineering/pcc';

  const { hasBtnP } = usePermission();

  interface State {
    id: '';
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'templateName',
      label: '模板名称',
      component: 'Input',
      componentProps: { placeholder: '请输入模板名称' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'templateRemark',
      label: '模板备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入模版备注' },
    },
  ];

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({ labelWidth: 120, schemas: schemas });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log(data);
    resetFields();
    state.id = data.id;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    saveAsTemplate({
      ...values,
      id: state.id,
    }).then(res => {
      createMessage.success(res.msg);
      changeOkLoading(false); //用于修改确认按钮的loading状态
      closeModal(); //关闭弹窗
    });
  }
</script>
