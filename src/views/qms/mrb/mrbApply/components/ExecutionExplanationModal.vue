<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit" :destroyOnClose="true">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { executionResultOptions } from '../config';
  import { submitExecutionNote } from '/@/api/qms/mrb';
  console.log(executionResultOptions, 'executionResultOptions');
  interface IState {
    ids: string[];
  }
  const state = reactive<IState>({
    ids: [],
  });
  const emits = defineEmits(['reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  // 其他基础信息
  const SAPFormSchemas: FormSchema[] = [
    {
      field: 'closeUserId',
      component: 'CustomUserSelect',
      label: '关闭人',
      componentProps: {
        onChange: e => {
          console.log(666, e);
        },
      },
      rules: [{ required: true, message: '', trigger: 'blur' }],
    },
    {
      field: 'executionResult',
      component: 'Radio',
      label: '执行情况结果',
      componentProps: {
        options: executionResultOptions,
      },
      rules: [{ required: true, message: '', trigger: 'change' }],
    },
    {
      field: 'executionNote',
      component: 'Textarea',
      label: '执行情况说明',
      rules: [{ required: true, message: '', trigger: 'blur' }],
    },
  ];
  const [registerForm, { validate, getFieldsValue }] = useForm({
    schemas: SAPFormSchemas,
    labelWidth: 120,
    baseColProps: { span: 20 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });

  const getTitle = computed(() => t('common.add1Text'));

  function init(ids) {
    state.ids = ids;
  }
  async function handleSubmit() {
    const value = validate();
    if (!value) return;
    submitExecutionNoteFn({ ids: state.ids, ...getFieldsValue() });
  }
  async function submitExecutionNoteFn(params) {
    try {
      const { data, code, msg } = await submitExecutionNote(params);
      if (code === 200) {
        console.log(data);
        createMessage.success(msg);
        closeModal();
        emits('reload');
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>
