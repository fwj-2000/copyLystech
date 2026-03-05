<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMachineNoList, getGrouplist, getjobinfolist } from '/@/api/basicData/processrulestemplate';
  import { useBaseStore } from '/@/store/modules/base';
  import { debounce } from 'lodash-es';
  import { getWorkOrderDesc } from '/@/api/productionDeal/workOrder';
  import { addManualpctransfer } from '/@/api/productionDeal/manualBrushOff';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });
  const schemas: FormSchema[] = [
    {
      field: 'workNo',
      label: '工号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'workOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: {
        // suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入工单号',
        onChange: e => {
          if (!e) return;
          handlerInputChangeFn(e);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'productCode',
      label: '品名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'transferPosition',
      label: '调离岗位',
      component: 'ApiSelect',
      componentProps: {
        api: getjobinfolist,
        placeholder: '请选择调离岗位',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'transferType',
      label: '调离类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择调离类型',
        api: () => {
          return baseStore.getDictionaryData('ManualPcTransfer.TransferType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'productionDate',
      label: '生产日期',
      component: 'DatePicker',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: false, placeholder: '请选择日期' },
      colProps: { span: 12 },
    },
    {
      field: 'classes',
      label: '班次',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'transferGroup',
      label: '调离组别',
      component: 'ApiSelect',
      componentProps: {
        api: getGrouplist,
        placeholder: '请选择',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'name',
        valueField: 'code',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'machineNo',
      label: '机台号',
      component: 'ApiSelect',
      componentProps: {
        api: getMachineNoList,
        placeholder: '请选择机台号',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
        // nameFormat: ['name', '(', 'code', ')'],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        placeholder: '请输入内容',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'creatorUserName',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: () => {
        return state.dataForm.id;
      },
    },
    {
      field: 'creatorTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: () => {
        return state.dataForm.id;
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.orgId ? t('common.detailText') : '新增'));

  const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validateFields, setProps }] = useForm({
    labelWidth: 1120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm = data;
    state.dataForm.transferType = state.dataForm.transferType ? String(state.dataForm.transferType) : '';
    state.dataForm.classes = state.dataForm.classes ? String(state.dataForm.classes) : '';
    setProps({ disabled: data.orgId ? true : false });
    changeLoading(true);
    setFieldsValue(data); //设置表单值
    changeLoading(false); //用于修改Modal的loading状态
  }

  //提交
  function handleSubmit() {
    if (state.dataForm.orgId) {
      closeModal();
    }
    validateFields().then(async validate => {
      if (validate) {
        const { code, data, msg } = await addManualpctransfer(getFieldsValue());
        if (code === 200) {
          createMessage.success(msg);
          emit('reload');
          closeModal();
        }
      } else {
      }
    });
  }

  // 自动带入信息
  const handlerInputChangeFn = debounce(async fieldValue => {
    try {
      const { code, data, msg } = await getWorkOrderDesc({ workOrderNo: fieldValue });
      if (code == 200) {
        setFieldsValue({ productCode: data.productCode });
      } else {
        // createMessage.error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, 300);
</script>
