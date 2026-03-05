<template>
  <BasicModal v-bind="$attrs" :width="700" :title="t('common.updateText')" destroyOnClose class="batch-modal" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateResponsiblePerson } from '/@/api/dataAnalysis/personnel';

  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const editRow = ref<Record<string, any>>({});
  const responsiblePerson = ref<string>('');
  const schemas: FormSchema[] = [
    {
      field: 'ResponsiblePerson',
      label: '负责人',
      component: 'CustomUserSelect',
      componentProps: {
        onChange: (_, data) => {
          responsiblePerson.value = data.id ?? '';
        },
      },
      required: false,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    resetFields();
    editRow.value = data.row;
    setFieldsValue({ ResponsiblePerson: editRow.value.ResponsiblePersonId });
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeLoading(true);
    updateResponsiblePerson({
      ResponsiblePerson: responsiblePerson.value,
      Id: editRow.value.Id,
    })
      .then(res => {
        createMessage.success(res.msg);
        changeLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeLoading(false);
      });
  }
</script>
