<template>
  <BasicModal :showOkBtn="hasBtnP('btn_edit')" v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addFactory, updateFactory, getFactoryById } from '/@/api/basicData/factory';
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
      field: 'Code',
      label: '工厂编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Name',
      label: '工厂名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'SAPFactoryCode',
      label: 'SAP工厂编码',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
    },
    {
      field: 'SAPFactoryName',
      label: 'SAP工厂名称',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
    },
    {
      field: 'MainProcess',
      label: '主要制程',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请输入',
      },
    },
    {
      field: 'FactoryArea',
      label: '厂区',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: '有效', id: 1 },
          { fullName: '失效', id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? t('新增工厂信息') : t('修改工厂信息')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }

    resetFields();
    state.dataForm.Id = data.id;

    if (data.SAPFactoryCodes)
      updateSchema([
        {
          field: 'SAPFactoryCode',
          componentProps: {
            options: data.SAPFactoryCodes,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);

    if (data.SAPFactoryNames)
      updateSchema([
        {
          field: 'SAPFactoryName',
          componentProps: {
            options: data.SAPFactoryNames,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);

    if (data.MainProcess)
      updateSchema([
        {
          field: 'MainProcess',
          componentProps: {
            options: data.MainProcess,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);

    if (state.dataForm.Id) {
      changeLoading(true);
      getFactoryById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
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
    const formMethod = state.dataForm.Id ? updateFactory : addFactory;
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
