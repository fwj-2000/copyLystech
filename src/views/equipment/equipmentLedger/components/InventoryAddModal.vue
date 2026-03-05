<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.add2Text')" showOkBtn @ok="handleSubmit" :width="1000">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { setEquipmentledger, getfactoryarealist } from '/@/api/equipment/equipmentLedger';
  import { useBaseStore } from '/@/store/modules/base';

  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const state = ref({
    currentYear: '',
    currentWeek: '',
  });

  const inventoryAddSchemas = [
    {
      field: 'factoryArea',
      label: 'SBU(小厂)',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getfactoryarealist,
        showSearch: true,
        apiSearch: {
          show: false,
          // searchName: 'equipmentCode',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        immediate: true,
        placeholder: 'SBU(小厂)',
      },
      i18nField: 'factoryAreaName',
    },
    {
      field: 'equipmentCode',
      label: '设备编码',
      component: 'Input',
      componentProps: {
        placeholder: '设备编码',
      },
    },
    {
      field: 'equipmentType',
      label: '设备类型',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('equipmentType'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
      },
      i18nField: 'equipmentTypeName',
    },
    {
      field: 'equipmentCategory',
      label: '设备分类',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('equipmentCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
      },
      i18nField: 'equipmentCategoryName',
    },
    {
      field: 'fixedAssetCode',
      label: '固定资产编号',
      component: 'Input',
      componentProps: {
        placeholder: '固定资产编号',
      },
    },
    {
      field: 'equipmentModelCategory',
      label: '设备型号分类',
      component: 'Input',
      // componentProps: {
      //   api: () => baseStore.getDictionaryData('equipmentModelCategory'),
      //   labelField: 'fullName',
      //   valueField: 'enCode',
      //   showSearch: true,
      //   filterOption: false,
      // },
      i18nField: 'equipmentModelCategoryName',
    },
    {
      field: 'fixedAssetName',
      label: '固定资产名称',
      component: 'Input',
      componentProps: {
        placeholder: '固定资产编号',
      },
    },
    {
      field: 'specifications',
      label: '规格型号',
      component: 'Input',
      componentProps: {
        placeholder: '规格型号',
      },
    },
    {
      field: 'fuselageSerialNo',
      label: '机身序列号',
      component: 'Input',
      componentProps: {
        placeholder: '机身序列号',
      },
    },
    {
      field: 'equipmentVendor',
      label: '设备制造商',
      component: 'Input',
      componentProps: {
        placeholder: '设备制造商',
      },
    },
    {
      field: 'isOldLl',
      label: '是否老领略',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
      },
      i18nField: 'isOldLlName',
    },
    {
      field: 'isAssemble',
      label: '是否是拼接改装设备',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('isAssembleName'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
      },
      i18nField: 'isAssembleName',
    },
    {
      field: 'useStatus',
      label: '使用状态',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('equipmentUseStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
        onChange: val => {
          if (val === '2') {
            setFieldsValue({ freeCategory: '' });
            // 使用状态选择闲置可使用时，闲置分类只能选择产能不足和多余设备
            updateSchema({
              field: 'freeCategory',
              componentProps: {
                fieldNames: { value: 'enCode', label: 'fullName' },
                options: freeCategoryList.value.filter(item => item.enCode === '1' || item.enCode === '2'),
              },
            });
          } else if (val === '3') {
            setFieldsValue({ freeCategory: '' });
            // 使用状态选择闲置不可使用时，闲置分类只能选择无法维修和维修中
            updateSchema({
              field: 'freeCategory',
              componentProps: {
                fieldNames: { value: 'enCode', label: 'fullName' },
                options: freeCategoryList.value.filter(item => item.enCode === '3' || item.enCode === '4'),
              },
            });
          } else {
            updateSchema({
              field: 'freeCategory',
              componentProps: {
                fieldNames: { value: 'enCode', label: 'fullName' },
                options: freeCategoryList.value,
              },
            });
          }
        },
      },
      i18nField: 'useStatusName',
    },
    {
      field: 'freeReasons',
      label: '闲置原因',
      component: 'Input',
      componentProps: {
        placeholder: '闲置原因',
      },
    },
    {
      field: 'freeCategory',
      label: '闲置分类',
      component: 'Select',
      componentProps: {
        showSearch: true,
      },
      i18nField: 'freeCategoryName',
    },
    {
      field: 'isNeedConnection',
      label: '是否需要联线',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
        onChange: val => {
          if (val === '1') {
            setFieldsValue({ connectionStatus: '' });
            // 是否需要联线选择是时，联线状态只能选择已联线和未联线
            updateSchema({
              field: 'connectionStatus',
              componentProps: {
                fieldNames: { value: 'enCode', label: 'fullName' },
                options: connectionStatusList.value.filter(item => item.enCode === '1' || item.enCode === '2'),
              },
            });
          } else if (val === '0') {
            setFieldsValue({ connectionStatus: '' });
            // 是否需要联线选择否时，联线状态只能选择不需联线
            updateSchema({
              field: 'connectionStatus',
              componentProps: {
                fieldNames: { value: 'enCode', label: 'fullName' },
                options: connectionStatusList.value.filter(item => item.enCode === '3'),
              },
            });
          }
        },
      },
      i18nField: 'isNeedConnectionName',
    },
    {
      field: 'connectionStatus',
      label: '联线状态',
      component: 'Select',
      componentProps: {},
      i18nField: 'connectionStatusName',
    },
    {
      field: 'nameplateManufactureDate',
      label: '铭牌出厂日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '铭牌出厂日期',
      },
      //
    },
    {
      field: 'nameplateYears',
      label: '铭牌年限',
      component: 'Input',
      componentProps: {
        placeholder: '铭牌年限',
      },
    },
    {
      field: 'nameplateYearsCategory',
      label: '铭牌年限分类',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('nameplateYearsCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
      },
      i18nField: 'nameplateYearsCategoryName',
    },
    {
      field: 'factoryAreaRemark',
      label: '厂区备注',
      component: 'Input',
      componentProps: {
        placeholder: '厂区备注',
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '备注',
      },
    },
  ];

  const [registerForm, { validate, setFieldsValue, updateSchema, resetFields }] = useForm({
    labelWidth: 180,
    baseColProps: { span: 6 },
    schemas: inventoryAddSchemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const freeCategoryList = ref<any>([]);
  const connectionStatusList = ref<any>([]);

  async function init({ factoryArea, weeks }) {
    resetFields();
    if (factoryArea) {
      // 设置SBU(小厂)
      setFieldsValue({ factoryArea });
    }
    // 设置年-周
    state.value.currentYear = weeks.split('-')[0];
    state.value.currentWeek = weeks.split('-')[1];
    // 获取闲置分类数组
    baseStore.getDictionaryData('freeCategory').then(res => {
      freeCategoryList.value = res;
      updateSchema({
        field: 'freeCategory',
        componentProps: {
          fieldNames: { value: 'enCode', label: 'fullName' },
          options: freeCategoryList.value,
        },
      });
    });
    // 获取联线状态数组
    baseStore.getDictionaryData('connectionStatus').then(res => {
      connectionStatusList.value = res;
      updateSchema({
        field: 'connectionStatus',
        componentProps: {
          fieldNames: { value: 'enCode', label: 'fullName' },
          options: connectionStatusList.value,
        },
      });
    });
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const params = { ...values, ...state.value };
    const res = await setEquipmentledger(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }

  onMounted(() => {});
</script>
