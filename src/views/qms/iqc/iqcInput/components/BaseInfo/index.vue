<template>
  <Card class="mb-12px">
    <Subtitle :title="t('common.baseinfo')" />
    <BasicForm @register="registerForm" />
  </Card>
</template>
<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { ref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BASICINFO_SCHEMAS } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerForm, formApi] = useForm({
    schemas: BASICINFO_SCHEMAS,
    labelWidth: 320,
    layout: 'vertical',
    baseColProps: { span: 8 },
    rowProps: {
      align: 'top',
      justify: 'start',
      gutter: 8,
    },
    autoSubmitOnEnter: true,
    i18nConfig: {
      moduleCode: 'IQCApplyColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  function initFn({ tableData, mode }) {
    if (mode === 'view') {
      formApi.setProps({
        disabled: true,
      });
    }
    if (tableData.classes) {
      tableData.classes = String(tableData.classes);
    }
    if (tableData.inBatchesTest) {
      tableData.inBatchesTest = String(tableData.inBatchesTest);
    }
    formApi.setFieldsValue(tableData);
  }

  async function getParamsFn(type) {
    const validateFlag = await formApi.validate();
    if (!validateFlag && type) return false;
    return formApi.getFieldsValue();
  }

  defineExpose({
    getParamsFn,
    initFn,
    formApi,
  });
</script>
