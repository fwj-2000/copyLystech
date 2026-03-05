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

  import { getBadDetail, updateBadAddOrUpdate } from '/@/api/dashbord/vc';
  import { disable } from '/@/api/finance/materialPrice';

  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const id = ref('');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    changeLoading(true);
    resetFields();
    id.value = data.id;
    getBadDetail(data.id)
      .then(res => {
        res.data.TargetYieldRate = res.data.TargetYieldRate * 100;
        res.data.IsCriticalProcess = res.data.IsCriticalProcess ? 1 : 0;
        setFieldsValue(res.data);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const schemas: FormSchema[] = [
    {
      label: '项目',
      field: 'Project',
      component: 'Input',
      componentProps: { placeholder: '项目', disabled: true },
    },
    {
      label: '不良项',
      field: 'BadItem',
      component: 'Input',
      componentProps: { placeholder: '不良项' },
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
    // i18nConfig: {
    //   moduleCode: 'WarehouseBaseColumn',
    //   transferRange: ['label'],
    // },
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeLoading(true);

    // const { BadItem, Project, Id } = values;
    updateBadAddOrUpdate([values])
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
