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
  import { updatePositionStaff, batchaddPositionStaff } from '/@/api/productionDeal/positionStaff';
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
      moduleCode: 'ApplyWorkProcessPersonnelColumn',
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const id = ref('');

  async function setProcessOptions(e) {
    const res = await alllistbyfactory({ factoryArea: e });
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
        processCodes: data.processCode,
        operateUserIds: data.operateUserId,
      };
      setFieldsValue({ ...fieldsValue });
      updateSchema({
        field: 'processCodes',
        componentProps: {
          mode: '',
        },
      });
      updateSchema({
        field: 'operateUserIds',
        componentProps: {
          multiple: false,
        },
      });

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
      id: id.value,
    };
    const formMethod = id.value ? updatePositionStaff : batchaddPositionStaff;
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
