<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn destroyOnClose @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMaterialNumInfo, updateMaterialNumInfo, getMaterialNumInfoById } from '/@/api/productionDeal/materialNumInfo';
  import { getEnablePartNumberApply } from '/@/api/basicData/productCodeApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  interface State {
    dataForm: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'innerMaterialNumber',
      label: '内部料号',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getEnablePartNumberApply,
        placeholder: '请选择内部料号',
        showSearch: true,
        memoInputVal: true,
        memoInputVagueVal: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data.list',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'sNQuantity',
      label: '数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 1 },
      required: true,
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));

  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 160,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    state.dataForm = {};
    resetFields();
    if (data.id) {
      state.dataForm.id = data.id;
      changeLoading(true);
      getMaterialNumInfoById(state.dataForm.id).then(({ data }) => {
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
      id: state.dataForm.id,
    };
    const formMethod = state.dataForm.id ? updateMaterialNumInfo : addMaterialNumInfo;
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
