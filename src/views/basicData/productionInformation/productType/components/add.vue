<template>
  <BasicModal
    :showOkBtn="hasBtnP('btn_edit')"
    :canFullscreen="true"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.editText')"
    :draggable="true"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addExchangeRate, getProjectClassPage, updateExchangeRate, updateProductType } from '/@/api/basicData/exchangeRate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';

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
      field: 'mainProcess',
      label: '主要制程',
      i18nField: 'CommonCol.mainProcess',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: () => baseStore.getDictionaryData('MainProcess', true),
        showSearch: true,
        placeholder: '请选择主要制程',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        immediate: true,
      },
    },
    {
      field: 'factory',
      label: '工厂',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'businessType',
      label: '业务类型',
      i18nField: 'CommonCol.businessType',
      component: 'ApiSelect',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('SapFactoryMaterial');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        // showSearch: true,
        // apiSearch: {
        //   show: true,
        //   searchName: 'keyword',
        // },
        // resultField: 'data',
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'productCategory',
      label: '产品类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'projectClass',
      label: '项目分类',
      component: 'ApiSelect',
      componentProps: {
        api: getProjectClassPage,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'projectClass',
        },
        beforeFetch: params => {
          params.pageSize = 50;
          params.currentPage = 1;
        },
        resultField: 'data.list',
        labelField: 'projectClass',
        valueField: 'projectClass',
        mode: 'multiple',
        immediate: false,
      },
    },
    {
      field: 'status',
      label: '是否启用',
      i18nField: 'CommonCol.isEnable',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: [
          { fullName: t('common.enableText'), id: '1' },
          { fullName: t('common.disableText'), id: '2' },
        ],
      },
      //  transferRange: ['placeholder','label'],
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema, getFieldsValue }] = useForm({
    labelWidth: 80,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'ProductTypeColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.dataForm = data;
    console.log(data);
    resetFields();
    nextTick(() => {
      setFieldsValue({
        ...data,
        status: data.isEnabled ? '1' : '2',
        businessType: data.businessType ? String(data.businessType) : null,
        projectClass: data.projectClass.split(','),
      });
    });
  }
  //提交
  async function handleSubmit() {
    const { mainProcess } = getFieldsValue();
    if (!mainProcess) return createMessage.warning('请选择主要制程');
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    updateProductType({
      ...values,
      isEnabled: values.status == 1,
      id: state.dataForm.id,
      projectClass: values.projectClass.join(','),
    })
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
