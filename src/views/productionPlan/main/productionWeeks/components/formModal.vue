<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" @ok="handleSubmit" @register="registerModal" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProductionWeeksById, addProductionWeeks, updateProductionWeeks } from '/@/api/mps/productionPlan/productionWeeks';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema } from '../config';
  import { notMatchNum } from '../../utils/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

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

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: '100%',
    schemas: formSchema,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'ProductionWeeksColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data: any) {
    resetFields();
    state.dataForm.id = data.id;
    state.dataForm.factoryArea = data.factoryArea;

    if (data.id) {
      changeLoading(true);
      updateSchema({
        field: 'innerMaterialCode',
        componentProps: {
          disabled: true,
        },
      });
      getProductionWeeksById(state.dataForm.id).then(res => {
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
    // 校验生产排程数量
    const isNotErr = notMatchNum(values);
    if (isNotErr) return createMessage.error(isNotErr);
    changeOkLoading(true);

    const query = {
      ...values,
      id: state.dataForm.id,
      factoryArea: state.dataForm.factoryArea,
    };
    const formMethod = state.dataForm.id ? updateProductionWeeks : addProductionWeeks;

    return formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
