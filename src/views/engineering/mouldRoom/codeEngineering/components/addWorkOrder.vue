<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.createWorkOrder')" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { moldprogramcreatworkorder } from '/@/api/engineering/mould';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';
  const baseStore = useBaseStore();

  const draft = ref(false);
  const state = ref({
    workOrderType: '',
    moldNo: '',
  });

  const schemas: FormSchema[] = [
    {
      field: 'workOrderType',
      i18nField: 'CommonCol.workOrderType',
      label: '工单类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择类型',
        disabled: true,
      },
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'mouldNo',
      label: '模具编号',
      i18nField: 'moldNo',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        disabled: true,
      },
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'factoryArea',
      label: '厂区',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        placeholder: '请选择厂区',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
      },
      colProps: { span: 12 },
      i18nField: 'CommonCol.factoryArea',
    },
    {
      field: 'workOrderDate',
      label: '工单日期',
      component: 'DatePicker',
      required: true,
      componentProps: { placeholder: '请选择日期', format: 'YYYY-MM-DD' },
      colProps: { span: 12 },
      i18nField: 'CommonCol.workOrderDate',
    },
    {
      field: 'difficultyLevel',
      i18nField: 'CommonCol.difficulty',
      label: '难度',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择难度',
        api: () => {
          return baseStore.getDictionaryData('WorkOrder.DifficultyLevel');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', row: 1, autoSize: { minRows: 1, maxRows: 6 } },
      colProps: { span: 12 },
      i18nField: 'CommonCol.remark',
    },
  ];

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MoldProgramColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    changeLoading(true);
    draft.value = data.draft;
    resetFields();
    //更新工单类型下拉列表
    const workOrderTypeList = (await baseStore.getDictionaryData('WorkOrder.Type')) as any[];
    const optionsWorkOrderTypeList = workOrderTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    const workOrderType = optionsWorkOrderTypeList.find(item => item.fullName === data.record.moldTypeName)?.id;
    updateSchema({ field: 'workOrderType', componentProps: { options: optionsWorkOrderTypeList } });
    state.value = data.record;
    setFieldsValue({ ...data.record, workOrderDate: new Date(), workOrderType }); //设置表单值
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      workOrderDate: dayjs(values.workOrderDate).format('YYYY-MM-DD'),
      draft: draft.value,
    };
    const res = await moldprogramcreatworkorder(query).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
