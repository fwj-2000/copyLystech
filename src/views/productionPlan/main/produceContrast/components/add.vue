<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addData, updateData, getFactoryAreaList } from '/@/api/productionPlan/planProduceContrast';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'factory',
      label: '归属厂区',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryAreaList,
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
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'pmName',
      label: 'PM',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'pmcName',
      label: 'PMC',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'maxItem',
      label: '大项目',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'minItem',
      label: '小项目',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'apn',
      label: 'A/PN',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'type',
      label: '片/卷',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'innerMaterialNumber',
      label: 'LS PN',
      component: 'Input',
      componentProps: { placeholder: t('common.inputText') },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: { span: 12 },
    },
    {
      field: 'isOperationStr',
      label: t('commonCol.isOperationStr'),
      component: 'Select',
      componentProps: {
        options: [
          { id: t('common.yes'), fullName: t('common.yes') },
          { id: t('common.no'), fullName: t('common.no') },
        ],
        placeholder: t('common.chooseText'),
      },
      colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => {
    return state.dataForm.Id ? t('common.updateText') : t('dict.WorkOrder.DataSources.1');
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 240,
    schemas: schemas,
    layout: 'vertical',
    autoFocusFirstItem: true,
    i18nConfig: {
      moduleCode: 'PlanProduceContrastColumn',
      transferRange: ['label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (!hasBtnP('btn_edit')) {
      setProps({
        disabled: true,
      });
    }
    resetFields();
    state.dataForm.Id = data.record.Id;

    if (state.dataForm.Id) {
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
      id: state.dataForm.Id,
    };

    const formMethod = state.dataForm.Id ? updateData : addData;
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
