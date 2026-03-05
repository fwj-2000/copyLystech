<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn okText="打印" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getWorkOrderDesc } from '/@/api/productionDeal/workOrder';
  import { debounce } from '/@/utils/debounce';
  import { addManuallabelprint } from '/@/api/productionDeal/dieCutPerPrint';

  const { createMessage } = useMessage();

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
        // useScan:true,
        suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入或扫码',
        onChange: e => {
          workOrderNoChange(e);
        },
        onKeyDown: e => {
          splitScanData(e);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'innerMaterialNumber',
      label: '内部料号',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'workOrderQuantity',
      label: '工单数量',
      component: 'InputNumber',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'plansQuantity',
      label: '当班计划数（K）',
      component: 'InputNumber',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { placeholder: '', disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'operatorName',
      label: '操作员',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'classesName',
      label: '班次',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'produceDate',
      label: '生产日期',
      component: 'DatePicker',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '请选择日期' },
      colProps: { span: 12 },
    },
    {
      field: 'machineNoName',
      label: '机台号',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'lineCodeName',
      label: '线体',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'factoryName',
      label: '厂别',
      component: 'Select',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '请选择类型' },
      colProps: { span: 12 },
    },
    {
      field: 'printNumber',
      label: '打印张数',
      component: 'InputNumber',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'sheetQuantity',
      label: '每张数量',
      component: 'InputNumber',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '' },
      colProps: { span: 12 },
    },
    {
      field: 'remark',
      label: '备注:',
      component: 'Textarea',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        placeholder: '请输入内容',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        maxlength: 200,
        showCount: true,
        // rows:6
      },
      colProps: {
        style: {
          paddingRight: '50%',
        },
      },
    },
    // {
    //   field: 'printUserName',
    //   label: '打印人',
    //   component: 'Input',
    //  rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // componentProps: { disabled: true, placeholder: '请选择类型' },
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'printDate',
    //   label: '打印时间',
    //   component: 'DatePicker',
    //  rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // componentProps: { disabled: true, placeholder: '请选择类型' },
    //   colProps: { span: 12 },
    // },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? '查看' : 'edit'));
  const emit = defineEmits(['register', 'reload']);
  const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validateFields }] = useForm({
    labelWidth: 1120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const workOrderNoChange = debounce((e, type) => {
    if (e) {
      getWorkOrderDesc({ workOrderNo: e })
        .then(res => {
          if (res.code == 200) {
            const data = { innerMaterialNumber: '', workOrderQuantity: '' };
            data.innerMaterialNumber = res.data.productCode;
            data.workOrderQuantity = res.data.quantity;
            // state.workOrderType = res.data.workOrderType;
            setFieldsValue(data); //设置表单值
          } else {
            createMessage.error(res.msg);
          }
        })
        .catch(() => {});
    }
  }, 600);

  //扫码输入工单
  const splitScanData = e => {
    if (e.keyCode === 13) {
      const str = e.target.value || '';
      setFieldsValue({ workOrderNo: str });
    }
  };

  function init(data) {
    console.log(data, 'data');
    resetFields();
    state.dataForm = data;
    changeLoading(true);
    setFieldsValue(data); //设置表单值
    changeLoading(false); //用于修改Modal的loading状态
  }

  //提交
   function handleSubmit() {
    validateFields().then(async validate => {
      if (validate) {
        const { code, data } = await addManuallabelprint(getFieldsValue());
        if (code === 200) {
          console.log(data);
        }
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
      } else {
      }
    });
  }
</script>
