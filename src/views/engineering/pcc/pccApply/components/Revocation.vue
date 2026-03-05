<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.revoke')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { withdrawPcc } from '/@/api/engineering/pcc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

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
        label: t('common.revokeRemark'),
        component: 'Textarea',
        componentProps: { placeholder: t('common.enterRevokeRemark'), maxlength: 50 },
        // rules: [{ required: true, trigger: 'blur', message: '撤回原因必填' }],
      },
    ];
  }
  async function handleSubmit() {
    const params = await validate();
    if (!params) return;
    changeOkLoading(true);
    params.id = state.data.id;
    withdrawPcc(params)
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
