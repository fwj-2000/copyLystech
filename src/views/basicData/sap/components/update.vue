<template>
  <BasicModal :showOkBtn="hasBtnP('btn_edit')" v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSapFactoryById, updateSapFactory } from '/@/api/basicData/sap';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/customerSerivce';
  const { hasBtnP } = usePermission();

  const baseStore = useBaseStore();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'FactoryCode',
      i18nField: 'factoryCode',
      label: '工厂代码',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        disabled: false,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        allowClear: true,
        nameFormat: ['Code', '/', 'Name'],
        immediate: true,
      },
      rules: [
        {
          required: true,
          trigger: 'blur',
          // message: '必填',
        },
      ],
    },
    {
      field: 'Type',
      i18nField: 'type',
      label: '工厂类型',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('SapFactoryType', true),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
      required: true,
    },

    {
      field: 'MaterialType',
      i18nField: 'materialType',
      label: '业务类型',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('SapFactoryMaterial', true),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
      required: true,
    },
    {
      field: 'Code',
      i18nField: 'code',
      label: 'SAP代码',
      component: 'Input',
      // componentProps: { placeholder: '请选择' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },
    {
      field: 'Name',
      i18nField: 'Name',
      label: 'SAP工厂名称',
      component: 'Input',
      // componentProps: { placeholder: '请选择' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },
    {
      field: 'SapCompanyCode',
      i18nField: 'sapCompanyCode',
      label: 'SAP公司代码',
      component: 'Input',
      // componentProps: { placeholder: '请选择' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },
    {
      field: 'SapCompanyName',
      i18nField: 'sapCompanyName',
      label: 'SAP公司名称',
      component: 'Input',
      // componentProps: { placeholder: '请选择' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },
    {
      field: 'PccPrefix',
      i18nField: 'pccPrefix',
      label: 'PCC文件编码前缀',
      component: 'Input',
      // componentProps: { placeholder: '请选择' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },
    {
      field: 'Remark',
      i18nField: 'remark',
      label: '备注',
      component: 'Textarea',
      // componentProps: {
      //   placeholder: '请输入',
      // },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'FactorySapColumn',
      transferRange: ['label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
        //disabled: false,
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields();
    state.dataForm.Id = data.id;
    //更新下拉列表
    if (state.dataForm.Id) {
      changeLoading(true);
      getSapFactoryById(state.dataForm.Id).then(res => {
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

    updateSapFactory(query)
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
