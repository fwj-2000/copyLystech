<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'innerMaterialNumber',
      label: '内部料号',
      component: 'Input',
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'workOrderQuantity',
      label: '工单数量',
      component: 'InputNumber',
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'plansQuantity',
      label: '当班计划数（K）',
      component: 'InputNumber',
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'machineNoName',
      label: '机台号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'operatorName',
      label: '操作员',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'classesName',
      label: '班次',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'printNumber',
      label: '打印张数',
      component: 'InputNumber',
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'sheetQuantity',
      label: '每张数量',
      component: 'InputNumber',
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'produceDate',
      label: '生产日期',
      component: 'DatePicker',
      componentProps: { disabled: true, placeholder: '请选择日期' },
      colProps: { span: 12 },
    },
    {
      field: 'lineCodeName',
      label: '线体',
      component: 'Input',
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'factoryName',
      label: '厂别',
      component: 'Select',
      componentProps: { disabled: true, placeholder: '请选择类型' },
      colProps: { span: 12 },
    },
    {
      field: 'printUserName',
      label: '打印人',
      component: 'Input',
      componentProps: { disabled: true, placeholder: '请选择类型' },
      colProps: { span: 12 },
    },
    {
      field: 'printDate',
      label: '打印时间',
      component: 'DatePicker',
      componentProps: { disabled: true, placeholder: '请选择类型' },
      colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? t('component.upload.view') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const [registerForm, { setFieldsValue, resetFields }] = useForm({
    labelWidth: 1120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log(data, 'data');
    resetFields();
    state.dataForm = data;
    changeLoading(true);
    setFieldsValue(data); //设置表单值
    changeLoading(false); //用于修改Modal的loading状态
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
  }
</script>
