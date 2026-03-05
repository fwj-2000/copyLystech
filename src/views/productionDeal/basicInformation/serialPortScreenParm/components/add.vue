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
  import { updateSerialPortScreenParm, getSerialPortScreenParmById } from '/@/api/productionDeal/serialPortScreenParm';
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
      field: 'innerMaterialCode',
      label: '内部料号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'materialAxisNo',
      label: '料轴号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'material',
      label: '材料',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'tension',
      label: '张力',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'releaseOrReceiveMaterial',
      label: '放/收料',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('releaseOrReceiveType');
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
        span: 24,
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

  const getTitle = computed(() => t('common.editText'));
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
      getSerialPortScreenParmById(state.dataForm.id).then(res => {
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

  transformSchemas(schemas, 'SerialPortScreenParmColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };
    updateSerialPortScreenParm(query)
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
