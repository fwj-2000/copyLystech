<template>
  <BasicModal
    v-bind="$attrs"
    :width="700"
    :title="t('dict.hrBisColumn.summaryConditions')"
    destroyOnClose
    class="batch-modal"
    @register="registerModal"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { submitSupReg } from '/@/api/hr/netHouseSubsidy';
  import dayjs from 'dayjs';
  import { ref } from 'vue';
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const idList = ref([]);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    idList.value = data;
    console.log('🚀 ~ init ~ data:', data);
    changeLoading(true);
    resetFields();

    changeLoading(false);
  }

  const schemas: FormSchema[] = [
    {
      label: '月份', //2025-09
      field: 'month',
      component: 'DatePicker',
      componentProps: { format: 'YYYY-MM' },
      required: true,
    },
    {
      label: '期间',
      field: 'durIng',
      component: 'Select',
      componentProps: {
        options: [
          { title: t('hrBis.monthMid'), value: '0' },
          { title: t('hrBis.monthEnd'), value: '1' },
        ],
        fieldNames: { label: 'title', value: 'value' },
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'hrBisColumn',
      transferRange: ['label'],
    },
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    let { month, ...res } = values;
    month = dayjs(month).format('YYYY-MM');
    changeLoading(true);
    submitSupReg({ month, ...res, idList: idList.value })
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
