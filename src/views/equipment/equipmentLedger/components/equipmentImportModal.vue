<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.selectFactoryWeekTip')" showOkBtn @ok="handleSubmit" :width="500">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { importSchemas } from '../config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { iscanupdata } from '/@/api/equipment/equipmentLedger';
  import dayjs from 'dayjs';

  const emit = defineEmits(['register', 'added', 'handleImport']);
  const { t } = useI18n();

  const [registerForm, { validate, setFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: importSchemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    await setFieldsValue({ weeks: dayjs(new Date()) });
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const weeksDayjs = dayjs(values.weeks);
    const { code } = await iscanupdata({
      ...values,
      weeks: `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
    }).finally(() => {
      changeOkLoading(false);
    });
    if (code === 200) {
      closeModal(); //关闭弹窗
      emit('handleImport', values);
    }
  }

  onMounted(() => {});
</script>
