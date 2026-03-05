<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.MPS.syncProdData')"
    showOkBtn
    @ok="handleSubmit"
    width="320px"
    :minHeight="100"
    destroyOnClose>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import { getlinelist, syncschedule } from '/@/api/mps/productionPlan/prodSchedue';

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();

  const state = reactive({ years: '', week: '' });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    resetFields();
    state.years = data.years;
    state.week = data.week;
  }

  const schemas: FormSchema[] = [
    {
      field: 'factoryArea',
      label: '工厂',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        immediate: true,
        placeholder: t('dict.CommonCol.factoryName'),
        onChange: (value, data) => {
          getLineListFn(value);
          setFieldsValue({ lineName: '' });
          clearValidate('lineName');
        },
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'lineName',
      label: '线体',
      component: 'Select',
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
  ];

  const [registerForm, { validate, setFieldsValue, clearValidate, updateSchema, resetFields }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
  });

  //根据工厂查询线体列表
  async function getLineListFn(value) {
    const { code, data } = await getlinelist(value);
    if (code === 200) {
      updateSchema({
        field: 'lineName',
        componentProps: {
          options: data.map(item => ({
            fullName: item.lineName,
            id: item.lineName,
          })),
        },
      });
    }
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    try {
      const values = await validate();
      if (!values) {
        createMessage.error(t('dict.CommonCol.enterRequiredFields'));
        changeOkLoading(false);
        return;
      }
      const res = await syncschedule({
        years: state.years,
        week: state.week,
        ...values,
      });
      createMessage.success(res.msg);
      emit('reload');
      closeModal();
    } finally {
      changeOkLoading(false);
    }
  }
</script>
