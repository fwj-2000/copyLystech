<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <slot name="prenext"></slot>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { syncWorkOrderFromSAP } from '/@/api/productionDeal/workOrder';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
  const baseStore = useBaseStore();

  const schemas: FormSchema[] = [
    {
      field: 'workOrderDate',
      label: '工单日期',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择日期', format: 'YYYY-MM-DD' },
      colProps: { span: 12 },
    },
    {
      field: 'workOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'sapFactoryId',
      label: '工厂',
      component: 'ApiSelect',
      componentProps: {
        api: getSapFactoryList,
        // afterFetch: res => {
        //   //去重
        //   res.data = res.data.filter((item, index, self) => {
        //     return self.findIndex(i => i.code === item.code) === index;
        //   });
        // },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        nameFormat: ['name', '(', 'code', ')'],
        immediate: true,
      },
      // field: 'factory',
      // label: '工厂',
      // component: 'Input',
      // componentProps: { placeholder: '请输入' },
      // colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => t('common.syncSap'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init() {
    resetFields();
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    if (!values.workOrderDate && !values.workOrderNo) {
      createMessage.warn(t('dict.WorkOrderColumn.syncSapTip'));
      return;
    }

    changeOkLoading(true);
    const query = {
      ...values,
    };

    const formMethod = syncWorkOrderFromSAP;
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
