<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('comon.calNDemand')" showOkBtn @ok="handleSubmit" width="320px" :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { materialPartCalcnweekdemand } from '/@/api/mps/productionPlan/materialPlan';
  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();

  const state = reactive({ ids: '' });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  async function init(data) {
    state.ids = data.ids;
  }

  const schemas: FormSchema[] = [
    {
      field: 'week',
      label: 'N周数值',
      i18nField: 'nWeek',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 20,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
  ];

  const [registerForm, { validate }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MaterialDemandPlanColumn',
    },
  });

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    try {
      const values = await validate();
      if (!values) {
        createMessage.error(t('common.pleaseCompleteRequiredField'));
        changeOkLoading(false);
        return;
      }
      const res = await materialPartCalcnweekdemand({
        idList: state.ids,
        ...values,
      });
      createMessage.success(res.msg);
      emit('reload');
      closeModal(); //关闭弹窗
    } finally {
      changeOkLoading(false);
    }
  }
</script>

<style scoped lang="scss">
  .assign-tip {
    padding: 10px 16px;
    border: 1px solid #ff7b00;
    border-radius: 4px;
    color: #1a1a1a;
    font-size: 14px;
    line-height: 22px;
    background-color: rgba(255, 123, 0, 0.1);
  }
</style>
