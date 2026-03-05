<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="新增" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addManualAssignmentCodeMQ } from '/@/api/productionDeal/manualAssignmentCode';
  const schemas: FormSchema[] = [
    {
      field: 'guid',
      label: '分切标签',
      component: 'Input',
      componentProps: {
        placeholder: '分切标签',
      },
      required: true,
    },
    {
      field: 'layers',
      label: '层数标签',
      component: 'Input',
      componentProps: {
        placeholder: '层数标签',
      },
      required: true,
    },
    {
      field: 'quantity',
      label: '数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入数量',
        min: 1,
        step: 1,
        precision: 0,
      },
      required: true,
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'CommonCol',
    //   transferRange: ['label', 'placeholder'],
    // },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  function init(data) {
    // console.log(data, 'data');
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    addManualAssignmentCodeMQ(values)
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
