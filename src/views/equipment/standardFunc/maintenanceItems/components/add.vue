<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :height="700"
    width="720px"
    :centered="true"
    :canFullscreen="true"
    :draggable="true"
    :title="getTitle"
    showOkBtn
    @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { addMItem, updateMItem, getMItemById } from '/@/api/equipment/maintenanceItems';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));

  const schemas: FormSchema[] = [
    {
      field: 'code',
      label: '保养项编码',
      component: 'Input',
      componentProps: {
        placeholder: '自动生成',
        readonly: true,
      },
      // rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'name',
      label: '保养项名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'standard',
      label: '保养项标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'method',
      label: '保养方法',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'category',
      label: '设备分类',
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        showSearch: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
  ];

  const [registerForm, { validate, resetFields, updateSchema, setFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    resetFields();
    state.dataForm.id = data.id;
    if (data.equipmentClassList) updateSchema({ field: 'category', componentProps: { options: data.equipmentClassList } });
    if (state.dataForm.id) {
      changeLoading(true);
      getMItemById(state.dataForm.id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };
    const formMethod = state.dataForm.id ? updateMItem : addMItem;
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
