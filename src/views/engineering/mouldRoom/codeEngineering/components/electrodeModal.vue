<template>
  <BasicModal
    class="electrode-form"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.electrode')"
    showOkBtn
    @ok="handleSubmit"
    width="300px"
    :minHeight="100">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateiselectrode } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'isElectrode',
      label: '是否电极',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('YesOrNo');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 24 },
    },
  ];

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MoldProgramColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const ids = ref([]);
  async function init(data) {
    changeLoading(true);
    setFieldsValue({ isElectrode: '1' }); //是否电极默认设置为是
    ids.value = data.ids;
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    const params = {
      isElectrode: Number(getFieldsValue().isElectrode),
      ids: ids.value,
    };
    const res = await updateiselectrode(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
