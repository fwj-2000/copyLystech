<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.synchronizeData')" showOkBtn @ok="handleSubmit" width="400px">
    <a-checkbox v-model:checked="statusValue" @change="radioChange" class="mb-10px">{{ t('dict.CommonCol.complete') }}</a-checkbox>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { shipmentSyncData } from '/@/api/engineering/clientRollout';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const statusValue = ref(false);

  const schemas: FormSchema[] = [
    {
      field: 'factoryCode',
      label: t('dict.CommonCol.factoryName'),
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'pickerDate',
      label: t('dict.CommonCol.actualMovementDate'),
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
  ];
  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { validate, resetFields, getFieldsValue, updateSchema, clearValidate }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    fieldMapToTime: [['pickerDate', ['startDate', 'endDate']]],
  });

  const radioChange = () => {
    updateSchema([
      {
        field: 'factoryCode',
        componentProps: {
          disabled: statusValue.value,
        },
      },
      {
        field: 'pickerDate',
        componentProps: {
          disabled: statusValue.value,
        },
      },
    ]);
    if (statusValue.value) {
      clearValidate();
    }
  };

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init() {
    resetFields();
  }

  //提交
  async function handleSubmit() {
    const params = {
      ...getFieldsValue(),
    };
    if (!statusValue.value) {
      if (!params.startDate || !params.factoryCode) {
        createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
        return;
      }
      // 开始时间不能小于20250601
      const date = dayjs(params.startDate);
      const deadline = dayjs('2025-06-01');
      // 比较时间戳是否小于2025年6月1日
      if (date.isBefore(deadline)) {
        createMessage.warning(t('dict.CommonCol.actualMobileDateMinTimeTip'));
        return;
      }
    }
    changeOkLoading(true);
    const res = await shipmentSyncData(
      statusValue.value
        ? { startDate: '', endDate: '', factoryCode: '' }
        : {
            ...params,
            startDate: params.startDate ? dayjs(params.startDate).format('YYYY-MM-DD') : '',
            endDate: params.endDate ? dayjs(params.endDate).format('YYYY-MM-DD') : '',
          },
    ).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
