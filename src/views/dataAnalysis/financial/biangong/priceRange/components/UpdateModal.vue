<template>
  <BasicModal
    v-bind="$attrs"
    :width="700"
    :title="t(id ? 'common.updateText' : 'common.addText')"
    destroyOnClose
    class="batch-modal"
    @register="registerModal"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updatePriceRange } from '/@/api/dataAnalysis/financial';
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const id = ref('');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    changeLoading(true);
    resetFields();
    id.value = data.Id;
    setFieldsValue(data);
    // console.log(data, 'f');
    changeLoading(false);
  }

  const schemas: FormSchema[] = [
    {
      label: '开始',
      field: 'PriceStart',
      component: 'Input',
      componentProps: { placeholder: '开始' },
      required: true,
    },
    {
      label: '结束',
      field: 'PriceEnd',
      component: 'Input',
      componentProps: { placeholder: '结束' },
      required: true,
    },
    {
      label: '区间',
      field: 'PriceRange',
      component: 'Input',
      componentProps: { placeholder: '区间' },
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

    changeLoading(true);
    const query = {
      ...values,
    };
    updatePriceRange([query])
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
