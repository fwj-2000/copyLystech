<template>
  <BasicModal
    :width="420"
    v-bind="$attrs"
    @register="registerModal"
    :title="id ? t('common.edit') : t('common.add2Text')"
    showOkBtn
    destroyOnClose
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { addSchemas } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateLineType, addLineType } from '/@/api/productionDeal/lineTypeConfig';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { alllistbyfactory } from '/@/api/engineering/mould';

  const { t } = useI18n();

  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: addSchemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'LineTypeColumn',
    },
  });
  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const id = ref('');

  async function setProcessOptions(e) {
    changeLoading(true);
    const res = await alllistbyfactory({ factoryArea: e }).finally(() => changeLoading(false));
    updateSchema({
      field: 'processCodes',
      componentProps: {
        options: res.data,
      },
    });
  }
  function init(data) {
    id.value = '';
    resetFields();
    if (data && data.id) {
      id.value = data.id;
      const fieldsValue = {
        ...data,
        processCodes: data.processCodes,
      };
      setFieldsValue({ ...fieldsValue, processCodes: data.processCodes?.split(',') });

      if (data.factoryArea) {
        setProcessOptions(data.factoryArea);
      }
    }
    nextTick(() => {
      updateSchema({
        field: 'factoryArea',
        componentProps: {
          onChange: async e => {
            setFieldsValue({ processCodes: null });
            setProcessOptions(e);
          },
        },
      });
    });
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      processCodes: values.processCodes?.join(','),
      id: id.value,
    };
    const formMethod = id.value ? updateLineType : addLineType;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
