<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.executionResult.5')" showOkBtn @ok="handleSubmit" :minHeight="100" width="500px">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Rework } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface State {
    ids: '';
  }

  const state = reactive<State>({
    ids: '',
  });

  const schemas: FormSchema[] = [
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', rows: 3 },
      i18nField: 'remark',
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { validate }] = useForm({
    labelWidth: 80,
    layout: 'vertical',
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.ids = data.ids;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      ids: state.ids,
    };
    Rework(query)
      .then(res => {
        createMessage.success(res.msg);
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
