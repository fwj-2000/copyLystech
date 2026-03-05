<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable title="撤回" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { withdrawPcc } from '/@/api/engineering/pcc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { withdrawPurchaseQuotation } from '/@/api/finance/materialPrice';

  const emit = defineEmits(['reload', 'register']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    // labelWidth: 320,
  });

  const { createMessage } = useMessage();

  const state = reactive({
    data: {},
  });

  function init(data) {
    state.data = data;
    resetFields();
  }

  function getSchemas() {
    return [
      {
        field: 'remark',
        label: '撤回原因',
        component: 'Textarea',
        componentProps: { placeholder: '请输入撤回原因', maxlength: 50 },
        // rules: [{ required: true, trigger: 'blur', message: '撤回原因必填' }],
      },
    ];
  }
  async function handleSubmit() {
    const params = await validate();
    if (!params) return;
    changeOkLoading(true);
    params.id = state.data.id;
    withdrawPurchaseQuotation(params)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closeModal();
          emit('reload');
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
