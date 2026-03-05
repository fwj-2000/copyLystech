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

  import { updateStataddorupdate } from '/@/api/dashbord/vc';
  import { re } from 'mathjs';
  import { disable } from '/@/api/finance/materialPrice';

  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    changeLoading(true);
    resetFields();
    const { project, targetYieldRate } = data;
    let isStat = data.isStat ? 1 : 0;
    setFieldsValue({ project, targetYieldRate, isStat });
    changeLoading(false);
  }

  const schemas: FormSchema[] = [
    {
      label: '项目',
      field: 'project',
      component: 'Input',
      componentProps: { placeholder: '项目', disabled: true },
    },
    {
      label: '目标良率',
      field: 'targetYieldRate',
      component: 'Input',
      componentProps: { placeholder: '目标良率' },
    },
    {
      label: '是否纳入统计',
      field: 'isStat',
      component: 'Select',
      componentProps: {
        placeholder: '是否纳入统计',
        options: [
          { title: '是', value: 1 },
          { title: '否', value: 0 },
        ],
        fieldNames: { label: 'title', value: 'value' },
      },
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    values.isStat = values.isStat === 1 ? true : false;
    changeLoading(true);
    updateStataddorupdate([values])
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
