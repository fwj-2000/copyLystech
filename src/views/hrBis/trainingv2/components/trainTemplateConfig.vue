<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" :showOkBtn="false" :showCancelBtn="false" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <template #insertFooter>
      <a-button @click="handleClose(true)">{{ t('component.modal.close') }}</a-button>
      <a-button @click="handleSubmit(1)" type="primary" :loading="submitLoading" v-if="state.dataForm.version > 0">{{
        t('dict.EmployeeTrain.OriginalUpdateBtnText')
      }}</a-button>
      <a-button @click="handleSubmit(2)" type="primary" :loading="submitLoading" v-if="state.dataForm.version > 0">{{
        t('dict.EmployeeTrain.UpgradeSaveBtnText')
      }}</a-button>
      <a-button @click="handleSubmit(1)" type="primary" :loading="submitLoading" v-if="state.dataForm.version === 0">{{ t('common.saveText') }}</a-button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { saveTemplateConfig, getNewTemplateConfig } from '/@/api/hr/training/employee';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  interface DataForm {
    version: number;
    officeTrainContent: string;
    workshopTrainContent: string;
    teamLevelTrainContent: string;
  }

  interface State {
    dataForm: DataForm;
  }

  const state = reactive<State>({
    dataForm: {
      version: 0,
      officeTrainContent: '',
      workshopTrainContent: '',
      teamLevelTrainContent: '',
    },
  });

  const schemas: FormSchema[] = [
    {
      field: 'officeTrainContent',
      label: t('dict.EmployeeTrain.officeTrainText'),
      component: 'Textarea',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'workshopTrainContent',
      label: t('dict.EmployeeTrain.workshopTrainText'),
      component: 'Textarea',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'teamLevelTrainContent',
      label: t('dict.EmployeeTrain.teamLevelTrainText'),
      component: 'Textarea',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
  ];

  const getTitle = computed(() => t('dict.EmployeeTrain.ContentTemplateConfigText'));
  const emit = defineEmits(['register', 'reload']);
  const submitLoading = ref(false);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init() {
    resetFields();

    const r = await getNewTemplateConfig({});

    if (r.code == 200 && r.data) {
      state.dataForm = r.data;
      setFieldsValue(state.dataForm);
    }
  }
  /**
   * 提交操作
   * @param type 1:原版保存 2:保存并升版
   */
  async function handleSubmit(type) {
    const values = await validate();
    if (!values) return;
    submitLoading.value = true;
    const query = {
      ...values,
      version: state.dataForm.version,
      saveType: type,
    };
    const formMethod = saveTemplateConfig;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        submitLoading.value = false; //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        submitLoading.value = false;
      });
  }

  function handleClose(reload = false) {
    closeModal();
    if (reload) emit('reload');
  }
</script>
