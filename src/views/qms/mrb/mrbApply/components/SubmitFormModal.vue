<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="state.title" :draggable="true" showOkBtn @ok="handleSubmit" :destroyOnClose="true">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, defineExpose } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface IState {
    formSchema: FormSchema[];
    submitApi: Fn;
    title: string;
    defaultValues?: Object;
    apiParams?: Object;
    isAllOk: boolean;
  }

  const state = reactive<IState>({
    formSchema: [],
    submitApi: () => {},
    title: '',
    defaultValues: {},
    apiParams: {},
    isAllOk: false,
  });

  const props = defineProps({
    moduleCode: {
      type: String,
      default: '',
    },
  });

  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const [registerForm, { validate, resetSchema, setFieldsValue }] = useForm({
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: { span: 24 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
    i18nConfig: {
      moduleCode: props.moduleCode,
      transferRange: ['placeholder', 'label'],
    },
  });

  // 暴露给父组件使用的方法
  function init(params: IState) {
    const { title, apiParams, submitApi } = params;
    state.title = title;
    state.apiParams = apiParams;
    state.submitApi = submitApi;
    // resetFields();
    resetSchema(params.formSchema);
    if (params.defaultValues) {
      setFieldsValue(params.defaultValues);
    }
    if (params.isAllOk) setFieldsValue({ auditType: '1' });
  }

  async function handleSubmit() {
    try {
      const values = await validate();
      if (!values) return;
      changeOkLoading(true);
      const { code, msg } = await state.submitApi({
        ...values,
        ...state.apiParams,
      });
      if (code === 200) {
        createMessage.success(msg);
        closeModal();
        emits('reload', { form: values });
      }
    } catch (error) {
      console.error(error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
