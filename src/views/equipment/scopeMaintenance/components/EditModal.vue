<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.editText')" showOkBtn @ok="handleSubmit" width="600px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { getEditSchemas } from '../config';
  import { getfactorylist, businessscopeSave } from '/@/api/equipment/equipmentLedger';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const formId = ref('');

  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: getEditSchemas(),
    baseColProps: {
      span: 12,
    },
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'BusinessScopeColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init({ row }) {
    resetFields();
    changeLoading(true);
    const { code, name, bu, factoryArea, pmcDri, equipmentManager, mesDri, id, factoryShortCode, mesOperation } = row;
    formId.value = id;
    setFieldsValue({
      code,
      name,
      bu,
      factoryArea,
      pmcDri,
      equipmentManager: equipmentManager && equipmentManager.split(','),
      mesDri: mesDri && mesDri.split(','),
      mesOperation: mesOperation && mesOperation.split(','),
      factoryShortCode,
    });
    if (bu) {
      updateFactoryAreaList(bu);
    }
    updateSchema({
      field: 'bu',
      componentProps: {
        onChange: e => {
          updateFactoryAreaList(e);
          setFieldsValue({ factoryArea: '' });
        },
      },
    });
    changeLoading(false);
  }

  async function updateFactoryAreaList(e) {
    const { data } = await getfactorylist({ bu: e });
    updateSchema([
      {
        field: 'factoryArea',
        componentProps: {
          options: data,
        },
      },
    ]);
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const res = await businessscopeSave({
      ...values,
      equipmentManager: values.equipmentManager.join(','),
      mesDri: values.mesDri.join(','),
      mesOperation: values.mesOperation.join(','),
      id: formId.value,
    }).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
