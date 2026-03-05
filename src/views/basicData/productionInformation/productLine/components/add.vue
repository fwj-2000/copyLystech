<template>
  <BasicModal :showOkBtn="hasBtnP('btn_edit')" v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProductLine, updateProductLine, getProductLineById, getProductLineCodeByMainProcess } from '/@/api/basicData/productLine';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  interface State {
    dataForm: any;
  }

  const baseStore = useBaseStore();

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, resetFields, getFieldsValue }] = useForm({
    labelWidth: 80,
    schemas: getSchema(),
    i18nConfig: {
      moduleCode: 'ProductLineColumn',
      en_US: { labelWidth: 140 },
      vi_VN: { labelWidth: 140 },
      zh_CN: { labelWidth: 80 },
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields();
    setFieldsValue({
      MainProcess: 1,
    });
    state.dataForm.Id = data.id;
    if (state.dataForm.Id) {
      changeLoading(true);
      getProductLineById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }
  //提交
  function handleSubmit() {
    // const values = await validate();
    const values = getFieldsValue();
    if (!values) return;
    if (!values.MainProcess) return createMessage.error('请选择主要制程');
    if (!values.Name) return createMessage.error('请选择名称');
    if (!values.Code) return createMessage.error('请选择编码');
    if (!values.Status) return createMessage.error('请选择状态');
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };

    const formMethod = state.dataForm.Id ? updateProductLine : addProductLine;
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

  function getSchema() {
    return [
      {
        field: 'MainProcess',
        label: '主要制程',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess', true),
          showSearch: true,
          placeholder: '请选择主要制程',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          immediate: true,
        },
        rules: [{ required: true, trigger: 'blur', type: 'number', message: t('common.required') }],
      },
      {
        field: 'Name',
        label: '名称',
        component: 'Input',
        rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      },
      {
        field: 'Code',
        label: '编码',
        component: 'ApiSelect',
        componentProps: {
          api: getProductLineCodeByMainProcess,
          showSearch: true,
          apiSearch: { show: true, searchName: 'code' },
          placeholder: '请选择编码',
          labelField: 'code',
          valueField: 'code',
          resultField: 'data',
          beforeFetch: params => {
            params.mainProcess = getFieldsValue().MainProcess || 1;
          },
          filterOption: false,
          immediate: false,
        },
        rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      },
      {
        field: 'Status',
        label: '是否启用',
        component: 'Select',
        i18nField: 'CommonCol.isEnable',
        defaultValue: 1,
        componentProps: {
          options: [
            { fullName: t('common.enableText'), id: 1 },
            { fullName: t('common.disableText'), id: 2 },
          ],
        },
        rules: [{ required: true, trigger: 'change', message: t('common.required'), type: 'number' }],
      },
    ];
  }
</script>
