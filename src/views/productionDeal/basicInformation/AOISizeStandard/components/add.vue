<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="id ? t('common.edit') : t('common.add2Text')" showOkBtn destroyOnClose @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { addSchemas } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateAOIaizestandard, addAOIaizestandard } from '/@/api/productionDeal/AOISizeStandard';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 160,
    schemas: addSchemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'AoiAizeStandardColumn',
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const id = ref('');
  function init(data) {
    id.value = '';
    resetFields();
    if (data && data.id) {
      id.value = data.id;
      setFieldsValue({ ...data });
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: id.value,
    };
    const formMethod = id.value ? updateAOIaizestandard : addAOIaizestandard;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
