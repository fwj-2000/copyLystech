<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.confirmProcess')" showOkBtn @ok="handleSubmit" width="300px" :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { confirmprocess } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'isNeedProcess',
      i18nField: 'CommonCol.confirmProcess',
      label: '是否加工',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择是否加工',
        api: () => {
          return baseStore.getDictionaryData('YesOrNo');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        allowClear: false,
      },
      colProps: { span: 24 },
    },
  ];

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MoldApplyColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const ids = ref([]);
  async function init(data) {
    changeLoading(true);
    resetFields();
    ids.value = data.ids;
    setFieldsValue({ isNeedProcess: '1' }); //确认加工默认设置为是
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    const params = {
      ...getFieldsValue(),
      ids: ids.value,
    };
    const res = await confirmprocess(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
