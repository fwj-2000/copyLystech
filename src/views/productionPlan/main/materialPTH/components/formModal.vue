<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" @ok="handleSubmit" @register="registerModal" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMaterialPTH, updateMaterialPTH, getMaterialPTHById } from '/@/api/mps/productionPlan/materialPTH';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema } from '../config';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  const id = ref('');
  const factory = ref('');
  const dataForm = ref({});

  const getTitle = computed(() => (id.value == '' ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue, updateSchema }] = useForm({
    labelWidth: '50%',
    schemas: formSchema,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MaterialPTHColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init({ factoryArea, row }) {
    resetFields();
    factory.value = factoryArea;
    id.value = '';
    if (row.id) {
      changeLoading(true);
      updateSchema({
        field: 'innerMC',
        componentProps: {
          disabled: true,
        },
      });
      const { data } = await getMaterialPTHById(row.id).finally(() => {
        changeLoading(false);
      });
      dataForm.value = data;
      id.value = row.id;
      setFieldsValue(dataForm.value); //设置表单值
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    const formValue = await getFieldsValue();
    changeOkLoading(true);
    const query = {
      ...formValue,
      id: id.value,
      factoryArea: factory.value, // 工厂
    };
    const formMethod = id.value ? updateMaterialPTH : addMaterialPTH;

    return formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
