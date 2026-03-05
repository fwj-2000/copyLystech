<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="state.isEdit" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addOrigincountry, updateOrigincountry } from '/@/api/basicData/originCountry';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema, STATUS_ENUM } from '../config';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const state = ref<{ [key: string]: any } & { isEdit: boolean }>({ isEdit: true });

  /** 获取弹窗标题 */
  const getTitle = computed(() => {
    if (!state.value.isEdit) {
      return t('common.detailText');
    }
    return state.value.id ? t('common.editText') : t('common.addText');
  });
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    i18nConfig: {
      moduleCode: 'OriginCountryColumn',
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  /** 初始化表单 */
  async function init(data: any) {
    resetFields();
    setProps({ disabled: !data.isEdit });
    setFieldsValue({ status: STATUS_ENUM.启用, ...data });
    state.value = { status: STATUS_ENUM.启用, ...data };
    clearValidate();
  }

  /** 提交表单 */
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;

    const query = { ...values, id: state.value.id };
    const api = query.id ? updateOrigincountry : addOrigincountry;

    changeOkLoading(true);
    api(query)
      .then(() => {
        createMessage.success(t('common.operatorSuccess'));
        closeModal();
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
