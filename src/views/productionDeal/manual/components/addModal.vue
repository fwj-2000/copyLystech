<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcessList } from '/@/api/basicData/process';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { useBaseStore } from '/@/store/modules/base';
  import { getGrouplist } from '/@/api/basicData/processrulestemplate';
  import { addManualstart, getManualstart, getManualstartById, updateManualstartById } from '/@/api/productionDeal/dieCuttingTally';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
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
    },
    {
      field: 'factory',
      label: '厂别',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        placeholder: '请选择',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'process',
      label: '工序',
      component: 'ApiSelect',
      componentProps: {
        api: getProcessList,
        placeholder: '请选择',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'name',
        valueField: 'code',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'group',
      label: '组别',
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
    },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? t('common.view') : t('common.editText')));

  const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validateFields }] = useForm({
    labelWidth: 1120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
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
        const { code, data, msg } = await addManualstart(getFieldsValue());
        if (code === 200) {
          console.log(data);
          createMessage.success(msg);
          emit('reload');
          closeModal();
        }
      } else {
      }
    });
  }
</script>
