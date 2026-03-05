<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.syncSap')" showOkBtn @ok="handleSubmit" :width="400" :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getLedgerbusinessscopelist, syncsapequipmentledger, getallbusinessscopelist } from '/@/api/equipment/equipmentLedger';

  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 180,
    schemas: [
      {
        field: 'code',
        label: '业务范围',
        component: 'ApiSelect',
        required: true,
        componentProps: {
          api: getallbusinessscopelist,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          placeholder: '业务范围(小厂)',
        },
        i18nField: 'businessScopeCode',
        colProps: { span: 24 },
      },
    ],
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init() {
    resetFields();
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const res = await syncsapequipmentledger(values).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }

  onMounted(() => {});
</script>
