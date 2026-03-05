<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :height="700"
    width="720px"
    :centered="true"
    :canFullscreen="true"
    :draggable="true"
    :title="getTitle"
    showOkBtn
    @ok="handleSubmit">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addEquipment,
    updateEquipment,
    getEquipmentById,
    getSupplierList,
    getLineInfoListBySearchKey,
    getFactoryAreaList,
  } from '/@/api/equipment/information';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { debounce } from '/@/utils/debounce';
  import { useRoute } from 'vue-router';
  const { t } = useI18n();
  const route = useRoute();
  const equipmentType = route.query.equipmentType || 0; // 设备类型

  interface State {
    dataForm: any;
    supplierList: any[];
    serviceLife: any[];
    useStatus: any[];
    equipmentClassList: any[];
    faultReasonList: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    supplierList: [],
    serviceLife: [],
    useStatus: [],
    equipmentClassList: [],
    faultReasonList: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'FactoryArea',
      label: '厂区',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryAreaList,
        placeholder: '请选择厂区',
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
        valueField: 'id',
        nameFormat: ['name'],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 12 },
    },
    {
      field: 'Type',
      label: '设备类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Category',
      label: '设备分类',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Code',
      label: '设备编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'AssetCode',
      label: '固定资产编号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'customizeCode',
      label: '管制编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Name',
      label: '固定资产名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Specification',
      label: '规格型号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'SerialNumber',
      label: '机身序列号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'brand',
      label: '品牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'SupplierId',
      label: '设备制造商',
      i18nField: 'SupplierName',
      component: 'Select',
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请选择',
        showSearch: true,
        onSearch: value => {
          if (!value.trim()) {
            value = ' ';
          }
          handleDebounceSupplierSearch(value);
        },
      },
    },
    {
      field: 'Exist',
      label: '实物是否存在',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isBonded.1'), id: 1 },
          { fullName: t('dict.isBonded.2'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'UseStatus',
      label: '使用状态',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      colProps: {
        span: 12,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'faultReason',
      label: '异常备注',
      i18nField: 'faultReasonName',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'EquipmentModel',
      label: '设备型号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Position',
      label: '物理位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DepartmentId',
      label: '使用部门',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isBonded.1'), id: 1 },
          { fullName: t('dict.isBonded.2'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LineInfoId',
      label: '线体',
      i18nField: 'LineInfoName',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateLineInfoList(value);
        },
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DutyUserId',
      label: '责任人',
      i18nField: 'DutyUserName',
      component: 'UserSelect',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'UseSpecial',
      label: '是否专用设备',
      component: 'Select',
      defaultValue: 1,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isBonded.1'), id: 1 },
          { fullName: t('dict.isBonded.2'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填', type: 'number' }],
    },
    {
      field: 'ServiceLife',
      label: '使用年限',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ArrivalTime',
      label: '到厂时间',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择', format: 'date|YYYY-MM-DD HH:mm:ss' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Depreciation',
      label: '财务折旧',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    // {
    //   field: 'AddressIp',
    //   label: 'IP地址',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入' },
    //   colProps: {
    //     span: 12,
    //   },
    // },
    // {
    //   field: 'AddressPort',
    //   label: '端口号',
    //   component: 'InputNumber',
    //   componentProps: { placeholder: '请输入' },
    //   colProps: {
    //     span: 12,
    //   },
    // },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentInformationColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    resetFields();
    state.dataForm.Id = data.id;
    state.supplierList = [];
    if (data.supplierName) {
      const params = {
        name: data.supplierName,
      };
      data.supplierList = (await getSupplierList(params)).data.map(i => {
        return {
          id: i.id,
          fullName: i.name,
        };
      });
    }
    if (data.typeOption) updateSchema({ field: 'Type', componentProps: { options: data.typeOption } });
    if (data.lineInfo) updateSchema({ field: 'LineInfoId', componentProps: { options: data.lineInfo } });
    if (data.useStatusList) updateSchema({ field: 'UseStatus', componentProps: { options: data.useStatusList } });
    if (data.serviceLifeList) updateSchema({ field: 'ServiceLife', componentProps: { options: data.serviceLifeList } });
    if (data.supplierList) updateSchema({ field: 'SupplierId', componentProps: { options: data.supplierList } });
    if (data.equipmentClassList) updateSchema({ field: 'Category', componentProps: { options: data.equipmentClassList } });
    if (data.faultReasonList) updateSchema({ field: 'faultReason', componentProps: { options: data.faultReasonList } });
    if (state.dataForm.Id) {
      changeLoading(true);
      getEquipmentById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      equipmentType,
      id: state.dataForm.Id,
      sapManufactureDate: state.dataForm.sapManufactureDate,
      sapFactoryAreaCode: state.dataForm.sapFactoryAreaCode,
      sapFactoryAreaName: state.dataForm.sapFactoryAreaName,
      sapEquipmentModel: state.dataForm.sapEquipmentModel,
    };
    const formMethod = state.dataForm.Id ? updateEquipment : addEquipment;
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

  const updateLineInfoList = debounce(getLineInfoList, 500);
  async function getLineInfoList(searchKey) {
    const optionList = (await getLineInfoListBySearchKey(searchKey)).data;
    const lineInfoList = optionList
      ? optionList.map(i => {
          return {
            id: i.Id,
            fullName: i.LineName,
          };
        })
      : [];
    updateSchema([
      {
        field: 'LineInfoId',
        componentProps: {
          options: lineInfoList,
        },
      },
    ]);
  }

  const handleDebounceSupplierSearch = debounce(handleSupplierSearch, 500);
  async function handleSupplierSearch(e) {
    const params = {
      name: e,
    };
    const options = (await getSupplierList(params)).data.map(i => {
      return {
        id: i.id,
        fullName: i.name,
      };
    });
    updateSchema([
      {
        field: 'SupplierId',
        componentProps: {
          options: options,
        },
      },
    ]);
  }
</script>
