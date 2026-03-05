<template>
  <Card class="mb-24px">
    <Subtitle :title="t('common.otherBasicInfo')" />
    <BasicForm @register="registerForm" />
  </Card>
</template>
<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { ref, reactive, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { OTHERBASICINFO_SCHEMAS } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { getMaterialList } from '/@/api/purchase/materialBase';

  const { t } = useI18n();

  const [registerForm, formApi] = useForm({
    schemas: OTHERBASICINFO_SCHEMAS,
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: { span: 8 },
    rowProps: {
      align: 'top',
      justify: 'start',
      gutter: 8,
    },
    autoSubmitOnEnter: true,
    i18nConfig: {
      moduleCode: 'IQCApplyColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  onMounted(() => {
    initMaterialType();
  });

  // 初始化材料归属--默认模具 = enCode=Molds
  async function initMaterialType() {
    const { data } = await getMaterialList({
      isSelectRoot: 'true',
      displayArea: 'MaterialWarehouse',
    });
    const materialTypeList = data?.list || [];
    let materialTypeBigId = formApi.getFieldsValue().materialTypeBigId;
    if (!materialTypeBigId) {
      materialTypeBigId = materialTypeList?.find(x => x.enCode == 'Molds')?.id;
    }

    formApi.setFieldsValue({ materialTypeBigId: materialTypeBigId });
    materialTypeBigId && updateMaterialClassList(materialTypeBigId);

    formApi.updateSchema({
      field: 'materialTypeBigId',
      componentProps: {
        onChange: async e => {
          updateMaterialClassList(e);
        },
      },
    });
  }

  async function updateMaterialClassList(e) {
    const result = await getMaterialList({
      displayArea: 'MaterialWarehouse',
      keyword: e,
    });
    const r = result?.data?.list || [];
    formApi.updateSchema([
      {
        field: 'materialTypeId',
        componentProps: {
          options: r,
        },
      },
    ]);
  }

  function initFn({ tableData, mode }) {
    if (mode === 'view') {
      formApi.setProps({
        disabled: true,
      });
    }

    if (tableData.notifyPeopleId) {
      tableData.notifyPeopleId = tableData.notifyPeopleId.split(',');
    }
    tableData.materialTypeBigId && updateMaterialClassList(tableData.materialTypeBigId);
    formApi.setFieldsValue(tableData);
  }

  async function getParamsFn(type) {
    const validateFlag = await formApi.validate();
    if (!validateFlag && type) return false;
    return formApi.getFieldsValue();
  }

  defineExpose({
    getParamsFn,
    initFn,
    formApi,
  });
</script>
