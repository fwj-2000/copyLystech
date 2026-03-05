<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { addCheckt, updateCheck, getCheckProject } from '/@/api/productionDeal/checkProject';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();
  const baseStore = useBaseStore();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'checkConfigName',
      label: t(['dict.CommonCol.check', 'dict.CommonCol.dutyPersonName']), //'点检名称',
      component: 'Input',
      componentProps: { placeholder: t('ui.placeholder.input') },
      required: true,
    },
    {
      field: 'parameterValue',
      label: t('dict.CommParmColumn.parameterValue'), //'参数值',
      component: 'Input',
      componentProps: { placeholder: t('ui.placeholder.input') },
      required: true,
    },

    {
      field: 'ItemIds',
      label: t('dict.CommonCol.checkProject'), //'点检项目',
      component: 'ApiSelect',
      componentProps: {
        api: getCheckProject,
        placeholder: t('dict.CommonCol.checkProject'), //'点检项目',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        mode: 'multiple',
        memoInputVal: true,
        resultField: 'data.list',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'checkConfigItemName',
        valueField: 'id',
      },
      required: true,
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.add2Text')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm = data;
    if (state.dataForm.id) {
      state.dataForm.ItemIds = data.itemIds.split(',');
      setFieldsValue({ ...state.dataForm }); //设置表单值
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);

    const query = {
      ...values,
    };
    query.ItemIds = query.ItemIds.join(',');
    const formMethod = state.dataForm.id ? updateCheck : addCheckt;
    query.id = state.dataForm.id;
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
