<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.rejectReson')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { rejectPurchaseQuotation } from '/@/api/finance/materialPrice';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const emit = defineEmits(['rejectSuccess']);
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const [registerForm, { validate, resetFields }] = useForm({
    schemas: getSchemas(),
  });

  const { createMessage } = useMessage();

  const ids = ref(0);

  function init(data) {
    ids.value = data.ids;
    resetFields();
  }

  function getSchemas() {
    return [
      {
        field: 'rejectRemark',
        label: t('common.rejectReson'),
        component: 'Textarea',
        componentProps: { placeholder: t('common.enterRejectReson'), maxlength: 50 },
      },
    ];
  }
  async function handleSubmit() {
    const params = await validate();
    if (!params) return;
    changeOkLoading(true);
    params.ids = ids.value;
    rejectPurchaseQuotation(params)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closeModal();
          emit('rejectSuccess');
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
