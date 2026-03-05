<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="true" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addWorkshopType, updateWorkshopType, getWorkshopTypeById } from '/@/api/mps/productionPlan/workShopType';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema } from '../config';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    i18nConfig: {
      moduleCode: 'WorkOrderShopColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  async function init({ id }) {
    resetFields();
    state.dataForm = {};
    if (id) {
      // updateSchema({ field: 'factory', componentProps: { disabled: true } });
      // updateSchema({ field: 'workshop', componentProps: { disabled: true } });
      changeLoading(true);
      const { data, code } = await getWorkshopTypeById(id).finally(() => {
        changeLoading(false);
      });
      if (code == 200) {
        setFieldsValue(data);
        state.dataForm = data;
      }
    } else {
      // updateSchema({ field: 'factory', componentProps: { disabled: false } });
      // updateSchema({ field: 'workshop', componentProps: { disabled: false } });
      setFieldsValue({ status: 1 });
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

    const api = query.id ? updateWorkshopType : addWorkshopType;

    api(query)
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
