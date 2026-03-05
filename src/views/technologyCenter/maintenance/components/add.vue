<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addExchangeRate, getExchangeRateById, updateExchangeRate } from '/@/api/basicData/exchangeRate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getISOCodeList } from '/@/api/basicData/currency';
  import { debounce } from '/@/utils/debounce';
  import { usePermission } from '/@/hooks/web/usePermission';
  import dayjs from 'dayjs';
  import { isEmpty } from '/@/utils/is';
  import { saveCostcenter } from '/@/api/engineering/costCenter';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  interface State {
    data: any;
  }

  const state = reactive<State>({
    data: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'mainProcess',
      label: '主要制程',
      component: 'Input',
      componentProps: {
        // placeholder: '请选择',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'factoryName',
      label: '工厂',
      component: 'Input',
      componentProps: {
        // placeholder: '请选择',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'moldCode',
      label: '工厂模具代码',
      component: 'Input',
      componentProps: {
        // placeholder: '请输入',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'moldPurpose',
      label: '模具用途',
      component: 'Input',
      componentProps: {
        // placeholder: '请选择',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'businessType',
      label: '业务类型',
      i18nField: 'CommonCol.businessType',
      component: 'ApiSelect',
      componentProps: {
        disabled: true,
        api: () => {
          return baseStore.getDictionaryData('SapFactoryMaterial');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },

    {
      field: 'department',
      label: '费用归属',
      component: 'ApiSelect',
      componentProps: {
        disabled: true,
        api: () => {
          return baseStore.getDictionaryData('CostAttribution');
        },
        labelField: 'fullName',
        valueField: 'fullName',
        immediate: true,
      },
    },
    {
      field: 'costCenter',
      label: '成本中心',
      component: 'Input',
      componentProps: { placeholder: '请选择', disabled: true },
    },
    {
      field: 'costCenterCode',
      label: '成本中心代码',
      component: 'Input',
      componentProps: { placeholder: '请选择', disabled: true },
    },
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        disabled: true,
        placeholder: '请选择',
        options: [
          { fullName: t('dict.ConfigStatus.Enable'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
    },
  ];

  const getTitle = computed(() => (state.data.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MaintenanceColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.data = data;
    // 权限控制
    // if (data.id) {
    //   setProps({
    //     disabled: !hasBtnP('btn_edit'),
    //   });
    // } else {
    //   setProps({
    //     disabled: !hasBtnP('btn_add'),
    //   });
    // }
    if (isEmpty(data)) {
      resetFields();
    } else {
      setFieldsValue(data);
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.data.id,
    };
    saveCostcenter([query])
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

<style lang="less" scoped>
  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 4px !important;
  }

  :deep(.ant-row) {
    padding-bottom: 20px;
  }

  :deep(.ant-row .ant-form-item) {
    padding-bottom: 0;
  }
</style>
