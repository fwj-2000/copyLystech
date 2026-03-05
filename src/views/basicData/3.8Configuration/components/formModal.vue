<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="true" @ok="handleSubmit" @register="registerModal" width="500px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addConfig3_8, updateConfig3_8, getConfig3_8Detail } from '/@/api/basicData/3.8Configuration';
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

  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    i18nConfig: {
      moduleCode: '3.8ConfigurationColumn',
      transferRange: ['placeholder', 'label'],
      en_US: { labelWidth: 147 },
      vi_VN: { labelWidth: 120 },
      zh_CN: { labelWidth: 90 },
    },
  });

  async function init({ id }) {
    resetFields();
    state.dataForm = {};
    if (id) {
      changeLoading(true);
      updateSchema({ field: 'factoryArea', componentProps: { disabled: true } });
      const { data, code } = await getConfig3_8Detail(id).finally(() => {
        changeLoading(false);
      });
      if (code == 200) {
        setFieldsValue(data);
        state.dataForm = data;
      }
    } else {
      updateSchema({ field: 'factoryArea', componentProps: { disabled: false } });
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

    const api = query.id ? updateConfig3_8 : addConfig3_8;

    api(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
