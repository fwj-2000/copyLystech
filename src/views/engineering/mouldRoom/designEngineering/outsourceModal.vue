<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.outsource')" showOkBtn @ok="handleSubmit" width="300px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateoutsource } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'isOutsource',
      i18nField: 'CommonCol.isOutsource',
      label: '是否委外',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择难度',
        api: () => {
          return baseStore.getDictionaryData('YesOrNo');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 24 },
    },
    {
      field: 'isProvideMaterials',
      i18nField: 'CommonCol.isProvideMaterials',
      label: '是否提供原材料',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择难度',
        api: () => {
          return baseStore.getDictionaryData('YesOrNo');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
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
  const partRelationIds = ref([]);
  async function init(data) {
    changeLoading(true);
    resetFields();
    partRelationIds.value = data.partRelationIds;
    setFieldsValue({ isOutsource: '1' }); //是否委外默认设置为是
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    const params = {
      ...getFieldsValue(),
      partRelationIds: partRelationIds.value,
    };
    const res = await updateoutsource(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
