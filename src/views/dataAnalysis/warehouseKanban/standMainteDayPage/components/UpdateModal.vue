<template>
  <BasicModal v-bind="$attrs" :width="700" :title="t('common.updateText')" destroyOnClose class="batch-modal" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { addorupdatestandMainteDay } from '/@/api/dataAnalysis/warehouseKanban';
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const editRow = ref<Record<string, any>>({});

  const schemas: FormSchema[] = [
    {
      field: 'days',
      label: '标准天数',
      component: 'InputNumber',
      componentProps: {
        min: 0,
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    resetFields();
    editRow.value = data;
    setFieldsValue({ days: data.days });
  }

  async function handleSubmit() {
    const values = await validate();
    const { factory, orgCode } = editRow.value;
    if (!values) return;
    changeLoading(true);
    addorupdatestandMainteDay([
      {
        days: values.days,
        orgCode,
        factory,
      },
    ])
      .then(res => {
        createMessage.success(res.msg);
        changeLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeLoading(false);
      });
  }
</script>
