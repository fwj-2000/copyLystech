<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.judgmentResult')" @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref } from 'vue';
  import { checkMaterial } from '/@/api/engineering/newMateriaCheckin';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['reload', 'register']);
  const { t } = useI18n();

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(init);
  const [registerForm, { getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'engineeringCheckStatus',
        label: t('common.judgmentResult'),
        component: 'Radio',
        componentProps: {
          options: [
            { id: '3', fullName: 'OK' },
            { id: '9', fullName: t('common.recheckStatus') },
            { id: '10', fullName: t('comon.reSendSample') },
            { id: '4', fullName: t('common.specialStatus') },
          ],
        },
      },
      {
        field: 'engineeringCheckRemarks',
        i18nField: 'CommonCol.remark',
        label: t('dict.CommonCol.remark'),
        component: 'Textarea',
        componentProps: {
          rows: '5',
        },
      },
    ],
    layout: 'vertical',
    labelWidth: 220,
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
  });

  const ids = ref([]);
  function init(data) {
    ids.value = data.ids;
    changeOkLoading(false);
  }
  async function handleSubmit() {
    changeOkLoading(true);
    try {
      await checkMaterial({
        ids: ids.value,
        ...getFieldsValue(),
      });
      emit('reload');
      closeModal();
    } catch (error) {
      changeOkLoading(false);
    }
  }
</script>
