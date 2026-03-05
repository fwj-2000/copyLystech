<template>
  <Card style="border-radius: 8px; margin-bottom: 12px">
    <Subtitle :title="t('common.finalDeterminationResult')" style="padding-bottom: 0; margin-bottom: 16px" />
    <BasicForm @register="registerForm"> </BasicForm>
  </Card>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { FINALRESULT_FORMCONFIG } from './config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Card } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const [registerForm, { validate, setFieldsValue, getFieldsValue, setProps }] = useForm(FINALRESULT_FORMCONFIG);

  async function getParamsFn() {
    const validateFlag = await validate();
    if (!validateFlag) return false;
    return getFieldsValue();
  }

  function init({ tableData, openModel }) {
    if (openModel === 'view') {
      setProps({
        disabled: true,
      });
    }
    if (!tableData.remark) {
      tableData.remark =
        '注：1.刀具应放置在干燥整洁的环境中，长期保存应在刀具表面喷上防锈油并做好防护措施。 2.为保护刀刃不受磕碰或撞击，应将刀具放置在U型架上，运输中应包好气泡袋。';
    }
    setFieldsValue(tableData);
  }

  defineExpose({
    getParamsFn,
    init,
  });
</script>
