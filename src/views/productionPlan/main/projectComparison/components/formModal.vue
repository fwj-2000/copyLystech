<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProjectComparisonById, addProjectComparison, updateProjectComparison } from '/@/api/mps/productionPlan/projectComparison';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { formSchema } from '../config';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: {
      id?: string;
      factoryArea: string;
    };
  }

  const state = reactive<State>({
    dataForm: {
      id: '',
      factoryArea: '',
    },
  });

  const getTitle = computed(() => (!state.dataForm.id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: '100%',
    schemas: formSchema,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'ProjectComparisonColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data: any) {
    resetFields();
    state.dataForm.id = data.id;
    state.dataForm.factoryArea = data.factoryArea;

    if (data.id) {
      // setProps({
      //   disabled: !hasBtnP('btn_edit'),
      // });
      changeLoading(true);
      getProjectComparisonById(state.dataForm.id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    } else {
      // setProps({
      //   disabled: !hasBtnP('btn_add'),
      // });
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    const query = {
      ...values,
      id: state.dataForm.id,
      factoryArea: state.dataForm.factoryArea,
    };

    const formMethod = state.dataForm.id ? updateProjectComparison : addProjectComparison;

    changeOkLoading(true);
    return formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {})
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
