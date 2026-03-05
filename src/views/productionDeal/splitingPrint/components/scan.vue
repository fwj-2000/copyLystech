<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn destroyOnClose @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #InnerMaterialCode="{ model, field }">
        <a-input v-model:value="model[field]" placeholder="请输入" @keydown="splitScanData" />
      </template>
    </BasicForm>
    <template #appendFooter>
      <a-button type="primary" @click="handleSubmit()">打印</a-button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addSplitingRecordData } from '/@/api/productionDeal/splitingPrint';

  interface State {
    dataForm: any;
    equipmentProtocol: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    equipmentProtocol: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'InnerMaterialCode',
      label: '内部料号',
      component: 'Input',
      slot: 'InnerMaterialCode',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'TotalQuantity',
      label: '打印总数量',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LeavePrintQuantity',
      label: '剩余打印数量',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FactoryCode',
      label: '工厂代码',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Type',
      label: '类型',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'WorkOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'MaterialCode',
      label: '物料',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'BranchQuantity',
      label: '支数',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DemandedQuantity',
      label: '需求数量',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Specifications',
      label: '规格',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'VolumeQuantity',
      label: '卷数',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LeaveMaterial',
      label: '余料',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'TransformOrder',
      label: '转单',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LabelQuantity',
      label: '标签数量',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'PrintedVolumeQuantity',
      label: '已打印卷数',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => '扫码打印');
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    layout: 'vertical',
    autoFocusFirstItem: true,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init() {
    resetFields();
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = addSplitingRecordData;
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

  //扫码之后，分割字符串中内容
  const splitScanData = e => {
    if (e.keyCode === 13) {
      const data = e.target.value.split('!');
      const result = {
        InnerMaterialCode: data[0],
        MaterialCode: data[0],
        Specifications: data[1],
        DemandedQuantity: data[6],
      };

      state.dataForm = result;
      setFieldsValue(result);
    }
  };
</script>
