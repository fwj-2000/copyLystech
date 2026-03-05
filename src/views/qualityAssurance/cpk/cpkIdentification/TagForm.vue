<template>
  <BasicModal
    :width="520"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('common.notification')"
    showOkBtn
    @ok="handleSubmit"
    destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { postCpkTag } from '/@/api/qualityAssurance/cpk';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    labelWidth: 80,
  });

  const { createMessage } = useMessage();

  const state = reactive({
    data: {},
    ids: [],
  });

  function init(data) {
    state.data = data;
    state.ids = data.ids;
    resetFields();
  }

  function getSchemas() {
    return [
      {
        field: 'dingMsgUesrIdList',
        label: '知会人',
        component: 'CustomUserSelect',
        componentProps: {
          multiple: true,
        },
      },
    ];
  }
  async function handleSubmit() {
    const val = await validate();
    console.log(val);
    postCpkTag({
      ...val,
      idList: state.ids,
    }).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
        emit('reload');
        closeModal();
      }
    });
  }
</script>
