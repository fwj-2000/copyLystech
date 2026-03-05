<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addDataFormat, updateDataFormat, getDataFormatById } from '/@/api/equipment/connSettings';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
    equipmentProtocol: any[];
    commMethodList: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    equipmentProtocol: [],
    commMethodList: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'code',
      label: '编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'equipmentType',
      label: '设备分类',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'commMethod',
      label: '通讯协议',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'ip',
      label: 'IP地址',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'port',
      label: '端口号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'version',
      label: '版本号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'status',
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
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.id = data.id;

    //更新下拉列表
    if (data.equipmentTypeList) updateSchema({ field: 'equipmentType', componentProps: { options: data.equipmentTypeList } });
    if (data.equipmentTypeList) updateSchema({ field: 'commMethod', componentProps: { options: data.commMethodList } });
    if (state.dataForm.id) {
      changeLoading(true);
      getDataFormatById(state.dataForm.id).then(res => {
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
      id: state.dataForm.id,
    };
    const formMethod = state.dataForm.id ? updateDataFormat : addDataFormat;
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
