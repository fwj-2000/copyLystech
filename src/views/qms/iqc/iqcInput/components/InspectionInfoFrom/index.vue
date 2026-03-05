<template>
  <Card style="border-radius: 8px; margin-bottom: 12px">
    <Subtitle :title="t('common.inspectionInfo')" />
    <BasicForm @register="registerForm" />
  </Card>
</template>
<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { INSPECTIONINFOFROMS_SCHEMAS } from './config';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerForm, formApi] = useForm({
    schemas: INSPECTIONINFOFROMS_SCHEMAS,
    labelWidth: 220,
    labelAlign: 'left',
    layout: 'vertical',
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
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

  function onSAPSelect(e) {
    console.log(e);
  }
</script>
