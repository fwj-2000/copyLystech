<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm, FormSchema } from '/@/components/Form';
import { useMessage } from '/@/hooks/web/useMessage';
import { addEquipmentProtocolParm, updateEquipmentProtocolParm, getEquipmentProtocolParmById } from '/@/api/equipment/commParm';
import { useI18n } from '/@/hooks/web/useI18n';

interface State {
  dataForm: any;
  equipmentTypeList: any[];
  commMethodList: any[];
}

const state = reactive<State>({
  dataForm: {},
  equipmentTypeList: [],
  commMethodList: [],
});

const schemasTCP: FormSchema[] = [
  {
    field: 'commMethod',
    label: '协议类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
    },
  },
  {
    field: 'equipmentType',
    label: '设备分类',
    component: 'Select',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择',
      options: [
        { fullName: '是', id: 1 },
        { fullName: '否', id: 2 },
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

const schemasUDP: FormSchema[] = [
  {
    field: 'commMethod',
    label: '协议类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
    },

  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
  },
  {
    field: 'equipmentType',
    label: '设备类型',
    component: 'Select',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'header',
    label: '报头',
    component: 'Input',
    defaultValue: '99',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'systemNumber',
    label: '系统',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'parameterType',
    label: '参数类型',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    //rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'axisNumber',
    label: '轴号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
  },
  {
    field: 'parameterCode',
    label: '参数代码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
  },
  {
    field: 'parameterName',
    label: '参数名称',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
  },
  {
    field: 'parameterValue',
    label: '参数值',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    //rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'tail',
    label: '报尾',
    component: 'Input',
    defaultValue: 'EE',
    componentProps: { placeholder: '请输入' },
    //rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择',
      options: [
        { fullName: '是', id: 1 },
        { fullName: '否', id: 2 },
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

const schemasModbusTCP: FormSchema[] = [
  {
    field: 'commMethod',
    label: '协议类型',
    component: 'Select',
    componentProps: { placeholder: '请选择' },
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
  },
  {
    field: 'equipmentType',
    label: '设备类型',
    component: 'Select',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'slaveId',
    label: '从站地址',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, message: '必填' }],
  },
  {
    field: 'funCode',
    label: '功能码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'startAddress',
    label: '起始地址',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'addressNum',
    label: '地址数量',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择',
      options: [
        { fullName: '是', id: 1 },
        { fullName: '否', id: 2 },
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


const getTitle = computed(() => (!state.dataForm.Id ? t('common.addText') : t('common.editText')));
const emit = defineEmits(['register', 'reload']);
const { createMessage } = useMessage();
const { t } = useI18n();
const [registerForm, { setFieldsValue, validate, resetFields, updateSchema, resetSchema }] = useForm({
  labelWidth: 130,
  layout: 'vertical',
  baseColProps: { span: 12 }
});
const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

function init(data) {
  resetFields();
  state.dataForm.id = data.id;
  state.commMethodList = data.commMethodList;
  state.equipmentTypeList = data.equipmentTypeList;

  if (state.dataForm.id) {
    changeLoading(true);
    getEquipmentProtocolParmById(state.dataForm.id).then(res => {
      const data = res.data;
      state.dataForm = data;
      resSchema(data.commMethod);
      updateSchema({
        field: 'commMethod',
        componentProps: { readonly: true }
      })
      setFieldsValue(data); //设置表单值
      changeLoading(false); //用于修改Modal的loading状态
    });
  }
  else {
    resSchema(data.commMethod);
  }
  if (data.equipmentTypeList) updateSchema({ field: 'equipmentType', componentProps: { options: data.equipmentTypeList } });
  if (data.commMethodList) updateSchema({ field: 'commMethod', componentProps: { options: data.commMethodList } });
}

//更新协议类型去改变表单项目
function resSchema(commMethod) {
  if (commMethod == 'TCP') {
    resetSchema(schemasTCP);
  }
  if (commMethod == 'UDP') {
    resetSchema(schemasUDP);
  }
  if (commMethod == 'ModbusTcp') {
    resetSchema(schemasModbusTCP)
  }
  setFieldsValue({ commMethod: commMethod })
  updateSchema([
    {
      field: 'commMethod',
      componentProps: {
        options: state.commMethodList,
        onChange: (e) => {
          resSchema(e);
        }
      },
    },
    {
      field: 'equipmentType',
      componentProps: { options: state.equipmentTypeList }
    }
  ]);
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
  const formMethod = state.dataForm.id ? updateEquipmentProtocolParm : addEquipmentProtocolParm;
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
