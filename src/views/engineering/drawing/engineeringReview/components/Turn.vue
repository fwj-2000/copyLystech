<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.rejectText')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { rejectDrawingsReview, withdrawDrawingsReview } from '/@/api/engineering/reviewInquiry';
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
        label: t('common.rejectReson'),
        component: 'Textarea',
        componentProps: { placeholder: t('common.rejectReson'), maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: t('common.rejectReson') }],
      },
    ];
  }
  async function handleSubmit() {
    const params = await validate();
    if (!params) return;
    changeOkLoading(true);
    params.id = state.data.id;
    rejectDrawingsReview(params)
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
