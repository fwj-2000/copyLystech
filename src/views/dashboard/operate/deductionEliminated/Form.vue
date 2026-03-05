<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="true" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateData } from '/@/api/business/immediateCustomer';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { formSchema } from './config';
  import { pick } from 'lodash-es';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { updateShipmentdebitPage } from '/@/api/dashbord/report';

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (!state.dataForm.Id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({ labelWidth: 160, schemas: formSchema });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data: any) {
    resetFields();
    state.dataForm = data;
    setFieldsValue(pick(data, ...formSchema.map(item => item.field)));
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      Id: state.dataForm.Id,
    };

    updateShipmentdebitPage([query])
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
