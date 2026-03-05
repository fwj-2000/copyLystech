<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { adDownstream, updateDownstream } from '/@/api/business/dataVerify';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'category',
      label: 'Category',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'downstream',
      label: 'Downstream',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'downstreamSiteName',
      label: 'Downstream Site Name',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
  ];

  const getTitle = computed(() => (!state.dataForm.id ? t(['common.addText']) : t(['common.editText'])));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm = data;
    setFieldsValue(data); //设置表单值
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {};
    schemas.forEach(item => {
      query[item.field] = values[item.field] || '';
    });
    const formMethod = state.dataForm.id ? updateDownstream : adDownstream;
    formMethod(query, state.dataForm.id)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
