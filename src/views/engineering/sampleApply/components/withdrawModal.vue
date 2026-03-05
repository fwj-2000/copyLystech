<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.revoke')" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { recallPro } from '/@/api/engineering/sample';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['reload', 'register']);
  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const [registerForm, { validate, resetFields }] = useForm({
    schemas: [
      {
        field: 'remark',
        label: t('common.reasonText'),
        component: 'Textarea',
        componentProps: { maxlength: 50 },
        // rules: [{ required: true, trigger: 'blur', message: '撤回原因必填' }],
      },
    ],
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

  async function handleSubmit() {
    const params = await validate();
    if (!params) return;
    changeOkLoading(true);
    params.id = state.data.id;
    recallPro(params)
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
