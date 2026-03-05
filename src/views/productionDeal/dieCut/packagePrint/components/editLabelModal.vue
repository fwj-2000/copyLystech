<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.editPackageInfo')"
    destroy-on-close
    showOkBtn
    @ok="handleSubmit"
    width="400px"
    :minHeight="150">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editPackageFormSchema } from '../config';

  import { updatePackDetail, getUpdatePackDetail } from '/@/api/productionDeal/packagePrint';
  import { useI18n } from '/@/hooks/web/useI18n';

  const uniqueCode = ref('');

  const emit = defineEmits(['reload']);
  const { t } = useI18n();

  const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 100,
    layout: 'vertical',
    schemas: editPackageFormSchema,
    baseColProps: { span: 24 },
    i18nConfig: {
      moduleCode: 'PackLabelPrintColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init(row) {
    resetFields();
    uniqueCode.value = row.uniqueCode;
    changeLoading(true);
    const { data } = await getUpdatePackDetail({ inOrOutCode: row.uniqueCode }).finally(() => changeLoading(false));
    setFieldsValue(data);
  }

  //提交

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const { code } = await updatePackDetail(values).finally(() => changeOkLoading(false));
    if (code === 200) {
      emit('reload');
      closeModal();
    }
  }
</script>
