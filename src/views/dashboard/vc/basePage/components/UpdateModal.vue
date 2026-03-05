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
  // import { getFactoryList } from '/@/api/business/quantitation';
  // import { getList } from '/@/api/business/shippingspace';
  // import { getWarehouseBaseDetail, updateWarehouseBase } from '/@/api/warehouse/main';
  // getBaseDetail
  import { getBaseDetail, updateBaseAddOrUpdatee } from '/@/api/dashbord/vc';
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
    getBaseDetail(data.id)
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
    // {
    //   field: 'factory',
    //   label: '工厂',
    //   component: 'ApiSelect',
    //   required: true,
    //   componentProps: {
    //     api: getFactoryList,
    //     showSearch: true,
    //     apiSearch: {
    //       show: true,
    //       searchName: 'factoryCode',
    //     },
    //     resultField: 'data',
    //     labelField: 'Name',
    //     valueField: 'Code',
    //     nameFormat: ['Code', '/', 'Name'],
    //   },
    // },
    // {

    {
      label: '项目',
      field: 'Project',
      component: 'Input',
      componentProps: { placeholder: '项目', disabled: true },
    },
    {
      label: '阶段',
      field: 'Stage',
      component: 'Input',
      componentProps: { placeholder: '阶段' },
    },
    {
      label: '工序',
      field: 'Processe',
      component: 'Input',
      componentProps: { placeholder: '工序' },
    },
    {
      label: '次序',
      field: 'Sequence',
      component: 'Input',
      componentProps: { placeholder: '次序' },
    },
    {
      label: '料号',
      field: 'ItemNumber',
      component: 'Input',
      componentProps: { placeholder: '料号' },
    },
    {
      label: '标准产能',
      field: 'StandardCapacity',
      component: 'Input',
      componentProps: { placeholder: '标准产能' },
    },
    {
      label: '目标良率',
      field: 'TargetYieldRate',
      component: 'Input',
      componentProps: { placeholder: '目标良率' },
    },
    {
      label: '是否关键工序',
      field: 'IsCriticalProcess',
      component: 'Select',
      componentProps: {
        placeholder: '是否关键工序',
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
    // i18nConfig: {
    //   moduleCode: 'WarehouseBaseColumn',
    //   transferRange: ['label'],
    // },
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    values.IsCriticalProcess = values.IsCriticalProcess === 1 ? true : false;

    changeLoading(true);
    const query = {
      ...values,
    };
    updateBaseAddOrUpdatee([query])
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
