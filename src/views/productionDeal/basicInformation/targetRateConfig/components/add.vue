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
  import { useBaseStore } from '/@/store/modules/base';
  import { addTargetRateConfig, updateTargetRateConfig, getTargetRateConfigById } from '/@/api/productionDeal/targetRateConfig';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
  }

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'factoryAreaCode',
      label: '使用厂区',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('useFactoryArea');
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'configType',
      label: '配置类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('configType');
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'targetRateType',
      label: '目标率类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('targetRateType');
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bindingType',
      label: '绑定类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('targetRateBindingType');
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      ifShow: ({ model }) => model.configType === '2',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bindingValue',
      label: '绑定值',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      ifShow: ({ model }) => model.configType === '2',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'targetRate',
      label: '目标率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 24,
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    schemas: schemas,
    labelWidth: 260,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    setFieldsValue({ configType: '1', targetRateType: '1' });

    state.dataForm.id = data.id;
    if (state.dataForm.id) {
      changeLoading(true);
      getTargetRateConfigById(state.dataForm.id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  function transformSchemas(cols: FormSchema[], businessCode: string, reWrite: object) {
    cols.forEach(col => {
      // 翻译label
      let key = `dict.${businessCode}.${reWrite[col.field] ? reWrite[col.field] : col.field}`;
      let tranTitle = t(key);
      col.label = isEmpty(tranTitle) ? col.label : tranTitle;
      // 翻译componentProps
      if (col.componentProps) {
        if (col.componentProps.disabled) {
          col.componentProps.placeholder = t('common.nonEditable');
          return;
        }
        let key = `common.${['TreeSelect', 'Select'].includes(col.component) ? t('selectPlaceholder') : t('inputPlaceholder')}`;
        let tranPlaceholder = t(key);
        col.componentProps.placeholder = isEmpty(tranPlaceholder) ? col.componentProps.placeholder : tranPlaceholder;
      }
      // 翻译rules
      if (col.rules) {
        col.rules.forEach(rule => {
          //必填
          if (rule.required) {
            let key = `common.required`;
            let tranRule = t(key);
            rule.message = isEmpty(tranRule) ? rule.message : tranRule;
          }
        });
      }
    });
  }

  transformSchemas(schemas, 'TargetRateConfigColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };
    const formMethod = state.dataForm.id ? updateTargetRateConfig : addTargetRateConfig;
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
