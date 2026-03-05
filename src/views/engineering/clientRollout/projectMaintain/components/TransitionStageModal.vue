<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.transitionStage')" showOkBtn @ok="handleSubmit" width="500px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProductStage, batchMaintenanceHandle } from '/@/api/engineering/clientRollout';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      label: '客户产品阶段',
      field: 'customerProductStage',
      component: 'Select',
      i18nField: 'CustomerProductStage',
    },
    {
      label: '内部产品阶段',
      field: 'internalProductStage',
      component: 'Select',
      i18nField: 'InternalProductStage',
    },
    {
      field: 'stageBeginDate',
      label: '阶段开始日期',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
      i18nField: 'StageBeginDate',
    },
    {
      field: 'stageEndDate',
      label: '阶段结束日期',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
      i18nField: 'StageEndDate',
    },
  ];
  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerForm, { resetFields, getFieldsValue, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
  });

  const getProductStageFn = async ({ productLineCode, terminalCustomerCode }) => {
    const { data } = await getProductStage({ productLineCode, terminalCustomerCode });
    const customerProductStageList = data.map(item => {
      return {
        id: item.customerProductStage,
        fullName: item.customerProductStage,
      };
    });
    const internalProductStageList = data.map(item => {
      return {
        id: item.internalProductStage,
        fullName: item.internalProductStage,
      };
    });
    updateSchema([
      {
        field: 'customerProductStage',
        componentProps: {
          options: customerProductStageList,
        },
      },
      {
        field: 'internalProductStage',
        componentProps: {
          options: internalProductStageList,
        },
      },
    ]);
  };

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const idList = ref([]);
  async function init({ ids, row }) {
    resetFields();
    setFieldsValue(row);
    idList.value = ids;
    const { productLineCode, terminalCustomerCode } = row;
    getProductStageFn({ productLineCode, terminalCustomerCode });
  }

  //提交
  async function handleSubmit() {
    const fieldsValue = { ...getFieldsValue() };
    const params = {
      optType: 2,
      ...fieldsValue,
      idList: idList.value,
      stageBeginDate: dayjs(fieldsValue.stageBeginDate).format('YYYY-MM-DD'),
      stageEndDate: dayjs(fieldsValue.stageEndDate).format('YYYY-MM-DD'),
    };
    changeOkLoading(true);
    const res = await batchMaintenanceHandle(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
