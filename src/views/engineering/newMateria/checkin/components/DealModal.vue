<template>
  <BasicModal v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('common.operationResultJudge')" @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref } from 'vue';
  import { dealMaterial } from '/@/api/engineering/newMateriaCheckin';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(init);
  const [registerForm, { getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'engineeringVerifyStatus',
        label: '验证结果',
        component: 'Radio',
        componentProps: {
          options: [
            { id: '11', fullName: '导入' },
            { id: '10', fullName: '重新送样' },
            { id: '12', fullName: '需求取消' },
          ],
        },
      },
      {
        field: 'engineeringVerifyRemarks',
        label: '备注',
        component: 'Textarea',
        componentProps: {
          rows: '5',
        },
        dynamicRules: ({ values }) => {
          if (values.engineeringVerifyStatus === '10' || values.engineeringVerifyStatus === '12') {
            return [
              {
                required: true,
                message: t('common.reasonInput'),
              },
            ];
          }
          return [];
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
      await dealMaterial({
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
