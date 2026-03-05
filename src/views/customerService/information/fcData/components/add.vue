<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactoryAreaList, addFcData, updateFcData } from '/@/api/customerSerivce/fcData';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'customerCode',
      label: '客户代码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'factory',
      label: '工厂',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'customerPerson',
      label: '客服',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'project',
      label: '内部项目',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'projectPhase',
      label: '项目阶段',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('fcProjectPhase');
        },
        labelField: 'fullName',
        valueField: 'fullName',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'innerMaterialNumber',
      label: '内部编号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'middleMaterialNumber',
      label: '中间料号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'factoryArea',
      label: '产地',
      i18nField: 'factoryAreaName',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryAreaList,
        placeholder: '请选择产地',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
        nameFormat: ['name'],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'useQuantity',
      label: '用量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'vmiOrJit',
      label: 'VMI/JIT',
      component: 'Select',
      componentProps: {
        options: [
          { id: 'VMI', fullName: 'VMI' },
          { id: 'JIT', fullName: 'JIT' },
        ],
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'tradeCurrency',
      label: '交易币种',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'productCategory',
      label: '产品类别',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('fcProductCategory');
        },
        labelField: 'fullName',
        valueField: 'fullName',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'materialPrinciple',
      label: '备料建议(FYI)',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'lastWeekDemandQuantity',
      label: '上周需求',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'lastWeekOweQuantity',
      label: '上周欠数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'changeRatio',
      label: '本周较上周F/C变化%',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'customerInventory',
      label: '客户库存(FYI)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'customerInventoryUseWeek',
      label: '客户库存可使用周数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'remark1',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'finishedProductInventory',
      label: '备成品库存',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'quantity1',
      label: 'WK1',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity2',
      label: 'WK2',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity3',
      label: 'WK3',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity4',
      label: 'WK4',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity5',
      label: 'WK5',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity6',
      label: 'WK6',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity7',
      label: 'WK7',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity8',
      label: 'WK8',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity9',
      label: 'WK9',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity10',
      label: 'WK10',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity11',
      label: 'WK11',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity12',
      label: 'WK12',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity13',
      label: 'WK13',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity14',
      label: 'WK14',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity15',
      label: 'WK15',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity16',
      label: 'WK16',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity17',
      label: 'WK17',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity18',
      label: 'WK18',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity19',
      label: 'WK19',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity20',
      label: 'WK20',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity21',
      label: 'WK21',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity22',
      label: 'WK22',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity23',
      label: 'WK23',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity24',
      label: 'WK24',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity25',
      label: 'WK25',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity26',
      label: 'WK26',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity27',
      label: 'WK27',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity28',
      label: 'WK28',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity29',
      label: 'WK29',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity30',
      label: 'WK30',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity31',
      label: 'WK31',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity32',
      label: 'WK32',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity33',
      label: 'WK33',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity34',
      label: 'WK34',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'quantity35',
      label: 'WK35',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'materialIsMore',
      label: '料件价值是否大于0.2RMB',
      component: 'Select',
      componentProps: {
        options: [
          { id: '是', fullName: '是' },
          { id: '否', fullName: '否' },
        ],
        placeholder: '请选择',
      },
      colProps: { span: 12 },
    },
    {
      field: 'remark2',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: { span: 12 },
    },
    {
      field: 'price',
      label: '单价',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      auth: 'price',
    },
    {
      field: 'currency',
      label: '币种',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t(['common.editText', 'dict.FcDataColumn']) : t(['common.addText', 'dict.FcDataColumn'])));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 240,
    schemas: schemas,
    layout: 'vertical',
    autoFocusFirstItem: true,
    i18nConfig: {
      moduleCode: 'FcDataColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log(data);
    if (!hasBtnP('btn_edit')) {
      setProps({
        disabled: true,
      });
    }
    resetFields();
    state.dataForm.id = data.record.id;
    state.dataForm.searchDate = data.searchDate;

    // 修改label
    let week = Number.parseInt(data.searchDate.split('WK')[1]);
    for (let index = 1; index < 36; index++) {
      let field = 'quantity' + index;
      let label = 'WK' + week;
      updateSchema({ field: field, label: label });
      week++;
      if (week > 52) {
        week = 1;
      }
    }

    if (state.dataForm.id) {
      state.dataForm = data.record;
      setFieldsValue(data.record); //设置表单值
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
      dataId: state.dataForm.dataId,
      searchDate: state.dataForm.searchDate,
    };

    const formMethod = state.dataForm.id ? updateFcData : addFcData;
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
