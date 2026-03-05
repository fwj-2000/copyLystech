<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactoryAreaList, addPlanProduceQuantity, updatePlanProduceQuantity } from '/@/api/productionPlan/planProduceQuantity';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'factoryArea',
      label: '归属厂区',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryAreaList,
        placeholder: '请选择厂区',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
        nameFormat: ['name'],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'controlPerson',
      label: '控制者',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'innerMaterialNumber',
      label: '产品料号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'mondayQuantity',
      label: '周一',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'tuesdayQuantity',
      label: '周二',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'wednesdayQuantity',
      label: '周三',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'thursdayQuantity',
      label: '周四',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'fridayQuantity',
      label: '周五',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'saturdayQuantity',
      label: '周六',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'sundayQuantity',
      label: '周日',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('修改计划产值') : t('新建计划产值')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
    autoFocusFirstItem: true,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log(data);
    if (!hasBtnP('btn_edit')) {
      setProps({
        disabled: true,
      });
    }
    resetFields();
    state.dataForm.id = data.record.id;
    state.dataForm.searchDate = data.searchDate;

    if (state.dataForm.id) {
      state.dataForm = data.record;
      setFieldsValue(data.record); //设置表单值
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
      searchDate: state.dataForm.searchDate,
    };

    const formMethod = state.dataForm.id ? updatePlanProduceQuantity : addPlanProduceQuantity;
    formMethod(query)
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
