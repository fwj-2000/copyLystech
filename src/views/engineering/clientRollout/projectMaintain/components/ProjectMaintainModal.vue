<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.maintenance')" showOkBtn @ok="handleSubmit" width="500px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProductStage, batchMaintenanceHandle } from '/@/api/engineering/clientRollout';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'factoryCode',
      label: '工厂',
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
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      i18nField: 'CommonCol.factoryName',
    },

    {
      label: '客户产品阶段',
      field: 'customerProductStage',
      component: 'Select',
      i18nField: 'CustomerProductStage',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: {
        onChange: e => {
          changeCustomerProductStage(e);
        },
      },
    },
    {
      label: '内部产品阶段',
      field: 'internalProductStage',
      component: 'Select',
      i18nField: 'InternalProductStage',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'stageBeginDate',
      label: '阶段开始日期',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
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
  const [registerForm, { resetFields, getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'NpiProjectStageColumn',
    },
  });

  const productStageList = ref<any[]>([]);
  const getProductStageFn = async ({ productLineCode, terminalCustomerCode }) => {
    const { data } = await getProductStage({ productLineCode, terminalCustomerCode });
    productStageList.value = data;
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

    // 对内部产品阶段数据进行去重过滤
    const seen = new Map();
    const deduplicateInternalProductStage = internalProductStageList.filter(item => {
      // 如果 Map 中没有当前项的 fullName 值，则添加到 Map 并返回 true
      if (!seen.has(item.fullName)) {
        seen.set(item.fullName, true);
        return true;
      }
      // 如果已经出现过，则返回 false 不包含在新数组中
      return false;
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
          options: deduplicateInternalProductStage,
        },
      },
    ]);
  };

  const changeCustomerProductStage = e => {
    const internalProductStage = productStageList.value.find(item => item.customerProductStage === e)?.internalProductStage;
    setFieldsValue({ internalProductStage });
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
    const values = await validate();
    if (!values) return;
    const fieldsValue = { ...getFieldsValue() };
    if (fieldsValue.stageEndDate && fieldsValue.stageBeginDate > fieldsValue.stageEndDate) {
      return createMessage.warning(t('dict.CommonCol.startTimeGreaterEndTimeTip'));
    }
    const params = {
      optType: 1,
      ...fieldsValue,
      idList: idList.value,
      stageBeginDate: dayjs(fieldsValue.stageBeginDate).format('YYYY-MM-DD'),
      stageEndDate: fieldsValue.stageEndDate ? dayjs(fieldsValue.stageEndDate).format('YYYY-MM-DD') : '',
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
