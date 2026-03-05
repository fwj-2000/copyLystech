<template>
  <BasicPopup @register="registerPopup" v-bind="$attrs" destroyOnClose>
    <template #title>
      <div class="header-title">{{ t('common.detailText') }}</div>
    </template>
    <div class="form">
      <Subtitle title="基础信息"></Subtitle>
      <BasicForm @register="registerForm" title="基础信息"> </BasicForm>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getMaintenanceById } from '/@/api/equipment/maintenance';

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'equipmentCode',
      label: '设备编码',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentName',
      label: '设备名称',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentCategory',
      label: '设备分类',
      component: 'Select',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentSpe',
      label: '规格型号',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentSN',
      label: '机身序列号',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentSupplierName',
      label: '设备制造商',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'equipmentPosition',
      label: '设备位置',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'factoryArea',
      label: '厂区',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'arrivalTime',
      label: '到厂时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'lastTime',
      label: '上次保养时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'itemsName',
      label: '保养项目',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        mode: 'multiple',
        disabled: true,
      },
    },
    {
      field: 'planType',
      label: '计划类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        disabled: true,
      },
    },
    {
      field: 'planTime',
      label: '计划保养日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请输入',
        disabled: true,
      },
    },
  ];

  const [registerPopup] = usePopupInner(init);
  const [registerForm, { setFieldsValue, updateSchema }] = useForm({
    schemas: schemas,
    layout: 'vertical',
    labelWidth: 100,
    baseColProps: {
      span: 6,
    },
  });

  async function init(data) {
    if (data.id) {
      const list = (await getMaintenanceById(data.id)).data;
      setFieldsValue(list);
      updateSchema([
        { field: 'equipmentCategory', componentProps: { options: data.equipmentClassList } },
        { field: 'planType', componentProps: { options: data.maintenPlanTypeList } },
      ]);
    }
  }
</script>

<style scoped>
  .form {
    margin: 0 36px 0 24px;
  }
</style>
