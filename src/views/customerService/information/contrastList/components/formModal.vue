<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="true" @ok="handleSubmit" @register="registerModal" width="500px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addFcProjectComparison, updateFcProjectComparison, getFcProjectComparisonDetail } from '/@/api/customerSerivce/contrastList';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema } from '../config';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    i18nConfig: {
      moduleCode: 'ContrastListColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  async function init({ id }) {
    resetFields();
    state.dataForm = {};
    if (id) {
      changeLoading(true);
      updateSchema({ field: 'factory', componentProps: { disabled: true } });
      updateSchema({ field: 'project', componentProps: { disabled: true } });
      updateSchema({ field: 'sapFactory', componentProps: { disabled: true } });
      const { data, code } = await getFcProjectComparisonDetail(id).finally(() => {
        changeLoading(false);
      });
      if (code == 200) {
        setFieldsValue(data);
        state.dataForm = data;
      }
    } else {
      updateSchema({ field: 'factory', componentProps: { disabled: false } });
      updateSchema({ field: 'project', componentProps: { disabled: false } });
      updateSchema({ field: 'sapFactory', componentProps: { disabled: false } });
      setFieldsValue({ status: 1 });
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };

    const api = query.id ? updateFcProjectComparison : addFcProjectComparison;

    api(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
