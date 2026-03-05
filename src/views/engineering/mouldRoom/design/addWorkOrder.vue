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
  import { addWorkOrder, updateWorkOrder, getInnermaterialnumberlist, getWorkorderbymouldno } from '/@/api/productionDeal/workOrder';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { useBaseStore } from '/@/store/modules/base';
  import { func } from 'vue-types';
  const baseStore = useBaseStore();

  interface State {
    dataForm: any;
    draft: boolean;
    relationWorkOrderList: [];
  }

  const state = reactive<State>({
    dataForm: {},
    draft: false,
    relationWorkOrderList: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'workOrderType',
      i18nField: 'workOrderTypeDesc',
      label: '工单类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择类型',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'produceWorkshopCode',
      label: '生产车间编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        console.log(values);
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'mouldNo',
      label: '模具编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onChange: e => {
          handleMouldNoChange(e);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return ['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'bomType',
      label: 'BOM类型',
      component: 'Select',
      componentProps: { placeholder: '请选择类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'workOrderDate',
      label: '工单日期',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择日期', format: 'YYYY-MM-DD' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'relationWorkOrderNo',
      label: '关联工单',
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        // options: state.relationWorkOrderList,
        // fieldNames: {
        //   id: 'workOrderNo',
        //   fullName: 'workOrderNo',
        // },
      },
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3'].includes(values.workOrderType);
      },
    },
    {
      field: 'processRouteType',
      label: '工艺路线优先类型',
      component: 'Select',
      componentProps: { placeholder: '请选择类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'productCode',
      label: '内部料号',
      component: 'ApiSelect',
      componentProps: {
        api: getInnermaterialnumberlist,
        placeholder: '请选择',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'code',
        valueField: 'code',
        // nameFormat: ['name', '(', 'code', ')'],
      },
      rules: [{ required: true, message: '请选择内部料号', trigger: 'blur' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'quantity',
      label: '数量(K)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'difficultyLevel',
      i18nField: 'difficulty',
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
      field: 'pccDieCutEfficiency',
      label: 'PCC模切效率(K/H)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'pccManualEfficiency',
      label: 'PCC手工效率(K/H)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'bOrderType',
      label: 'B/非B工单',
      component: 'Select',
      componentProps: { placeholder: '请选择类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
      ifShow: ({ values }) => {
        return !['3', '4'].includes(values.workOrderType);
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', row: 1, autoSize: { minRows: 1, maxRows: 6 } },
      colProps: { span: 12 },
    },
    // {
    //   field: 'deliveryTime',
    //   label: '交期',
    //   component: 'DatePicker',
    //   componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD' },
    //   colProps: { span: 12 },
    //   ifShow: ({ values }) => {
    //     return ['3', '4'].includes(values.workOrderType);
    //   },
    // },
    // {
    //   field: 'personnel',
    //   label: '人员',
    //   component: 'UserSelect',
    //   componentProps: { placeholder: '请选择' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    //   colProps: { span: 12 },
    //   ifShow: ({ values }) => {
    //     return ['3', '4'].includes(values.workOrderType);
    //   },
    // },
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
      ifShow: ({ values }) => {
        return ['3', '4'].includes(values.workOrderType);
      },
    },
  ];

  const getTitle = computed(() => (!state.dataForm.id ? t(['common.addText', 'dict.Module.WorkOrder']) : t(['common.editText', 'dict.Module.WorkOrder'])));
  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'WorkOrderColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    console.log(data);
    state.draft = data.draft === true;
    resetFields();
    state.dataForm.id = data.record.id;
    //更新下拉列表
    if (!data.workOrderTypeList) {
      const workOrderTypeList = (await baseStore.getDictionaryData('WorkOrder.Type')) as any[];
      const optionsWorkOrderTypeList = workOrderTypeList.map(i => {
        return {
          id: i.enCode,
          fullName: i.fullName,
        };
      });
      data.workOrderTypeList = optionsWorkOrderTypeList.filter(x => ['3', '4'].includes(x.id));
    }
    updateSchema({ field: 'workOrderType', componentProps: { options: data.workOrderTypeList } });
    if (!data.bomTypeList) {
      const bomTypeList = (await baseStore.getDictionaryData('WorkOrder.BomType')) as any[];
      const optionsBomTypeList = bomTypeList.map(i => {
        return {
          id: i.enCode,
          fullName: i.fullName,
        };
      });
      data.bomTypeList = optionsBomTypeList;
    }
    updateSchema({ field: 'bomType', componentProps: { options: data.bomTypeList } });
    if (!data.processRouteTypeList) {
      const processRouteTypeList = (await baseStore.getDictionaryData('ProcessRoute.RouteType')) as any[];
      const optionsProcessRouteTypeList = processRouteTypeList.map(i => {
        return {
          id: i.enCode,
          fullName: i.fullName,
        };
      });
      data.processRouteTypeList = optionsProcessRouteTypeList;
    }
    updateSchema({ field: 'processRouteType', componentProps: { options: data.processRouteTypeList } });
    if (!data.bOrderTypeList) {
      const bOrderTypeList = (await baseStore.getDictionaryData('WorkOrder.BOrderType')) as any[];
      const optionsBOrderTypeList = bOrderTypeList.map(i => {
        return {
          id: i.enCode,
          fullName: i.fullName,
        };
      });
      data.bOrderTypeList = optionsBOrderTypeList;
    }
    updateSchema({ field: 'bOrderType', componentProps: { options: data.bOrderTypeList } });

    if (state.dataForm.id) {
      data.record.workOrderType = data.record.workOrderType?.toString() || ''; //转化为字符串 防止下拉无法渲染
      data.record.bomType = data.record.bomType?.toString() || ''; //转化为字符串 防止下拉无法渲染
      data.record.processRouteType = data.record.processRouteType?.toString() || ''; //转化为字符串 防止下拉无法渲染
      data.record.bOrderType = data.record.bOrderType?.toString() || ''; //转化为字符串 防止下拉无法渲染
      state.dataForm = data.record;
      setFieldsValue(data.record); //设置表单值
    }
    setFieldsValue(data.record); //设置表单值
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
      draft: state.draft,
    };

    const formMethod = state.dataForm.id ? updateWorkOrder : addWorkOrder;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('added', res.data);
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
  async function handleMouldNoChange(val) {
    console.log(val);
    try {
      const { code, data } = await getWorkorderbymouldno(val);
      if (code === 200) {
        if (data.length)
          updateSchema({
            field: 'relationWorkOrderNo',
            componentProps: {
              options: data,
              fieldNames: {
                label: 'workOrderNo',
                value: 'workOrderNo',
              },
            },
          });
        state.relationWorkOrderList = data;
        console.log(data);
      }
    } catch (error) {}
  }
</script>
