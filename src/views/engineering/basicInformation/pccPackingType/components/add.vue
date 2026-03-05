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
  import { addPCCPackingType, updatePCCPackingType, getunitList } from '/@/api/engineering/pccPackingType';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getMaterialAreaChildren } from '/@/api/engineering/pcc';

  const { hasBtnP } = usePermission();

  const baseStore = useBaseStore();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'typeCode',
      i18nField: 'typeName',
      label: '类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请输入',
        api: getMaterialAreaChildren,
        params: {
          enCode: 'PackagingMaterials',
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'unit',
      label: '单位',
      component: 'ApiSelect',
      componentProps: {
        api: getunitList,
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
      field: 'shipPattern',
      i18nField: 'shipPatternName',
      label: '成品出货类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择成品出货类型',
        api: () => {
          return baseStore.getDictionaryData('DieCutShipPattern');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'useQtyMultiple',
      label: '用量倍数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() =>
    state.dataForm.id ? t(['common.editText', 'dict.PCCPackingTypeColumn']) : t(['common.addText', 'dict.PCCPackingTypeColumn']),
  );
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'PCCPackingTypeColumn',
      transferRange: ['label', 'placeholder'],
      en_US: {
        labelWidth: 150,
      },
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (!hasBtnP('btn_edit')) {
      setProps({
        disabled: true,
      });
    }
    console.log(data);
    resetFields();
    state.dataForm = data;
    setFieldsValue(data); //设置表单值
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
    const formMethod = state.dataForm.id ? updatePCCPackingType : addPCCPackingType;
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
