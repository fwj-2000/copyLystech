<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="scanMaterials()">{{ t('common.scanMaterials') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <materialAdd @register="registerMaterialForm" @reload="reload" />
    <add @register="registerForm" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getPcScanMaterials } from '/@/api/productionDeal/pcScanMaterials';
  import { useModal } from '/@/components/Modal';
  import { reactive, onMounted } from 'vue';
  import add from './components/add.vue';
  import materialAdd from './components/materialAdd.vue';
  import { useRoute } from 'vue-router';
  import { dateUtil } from '/@/utils/dateUtil';
  import { cloneDeep } from 'lodash-es';
  const route = useRoute();
  const materialsType = route.query.materialsType || 0; // 扫描物料类型

  console.log(materialsType, 'materialsType');
  const { t } = useI18n();

  const [registerMaterialForm, { openModal: openMaterialFormModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();

  const searchFormSchema = [
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工单编码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '产品编码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'snCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: 'SN',
      },
      colProps: { span: 4 },
    },
    // {
    //   fieldName: 'subSnCode',
    //   label: '',
    //   component: 'Input',
    //   defaultValue: '',
    //   ifShow: materialsType === 0,
    //   componentProps: {
    //     placeholder: '副SN',
    //   },
    //   colProps: { span: 4 },
    // },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      colProps: { span: 4 },
      componentProps: {
        placeholder: ['生产日期开始时间', '生产日期结束时间'],
      },
    },
  ];
  const getFormSchema = () => {
    const formSchema = cloneDeep(searchFormSchema);
    const addFormSchema = [
      {
        fieldName: 'subSnCode',
        label: '',
        component: 'Input',
        defaultValue: '',
        // ifShow: materialsType === 0,
        componentProps: {
          placeholder: '副SN',
        },
        colProps: { span: 4 },
      },
    ];
    if (materialsType === 0) {
      formSchema.splice(3, 0, ...addFormSchema);
    }
    return formSchema;
  };

  const column = [
    { title: '单据号', field: 'documentNumber', width: 120 },
    { title: '工单编码', field: 'workOrderNo', width: 120 },
    { title: '产品编码', field: 'innerMaterialNumber', width: 200 },
    { title: 'SN', field: 'snCode', width: 200 },
    // {
    //   title: '副SN',
    //   field: 'subSnCode',
    //   width: 200,
    //   ifShow: materialsType === 0,
    // },
    { title: '物料', field: 'materialCode', width: 200 },
    { title: '规格', field: 'materialSpecs', width: 160 },
    // 材料批次
    { title: t('dict.CommonCol.materialBatches'), field: 'materialBatch', width: 120 },
    {
      title: '生产日期',
      field: 'productionDate',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 140,
    },
    { title: '标签数（PCS）', field: 'tagsQuantityPcs', width: 120 },
    { title: '生产批次', field: 'productionBatch', width: 120 },
    { title: '唯一码', field: 'uniqueCode', width: 120 },
    { title: '备注', field: 'remark', width: 120 },
    { title: '录入人', field: 'creatorUserName', width: 120 },
    {
      title: '录入时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 140,
    },
  ];
  const getColumn = () => {
    const basicColumn = cloneDeep(column);
    const addColumn = [
      {
        title: '副SN',
        field: 'subSnCode',
        width: 200,
      },
    ];
    if (materialsType === 0) {
      basicColumn.splice(4, 0, ...addColumn);
    }
    return basicColumn;
  };

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
    },
    gridOptions: {
      id: 'productionPlan-main-produceContrast-list',
      columns: getColumn(),
      showIndexColumn: true,
      api: getPcScanMaterials,
      beforeFetch: params => {
        const _params = {
          ...params,
          materialsType,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
    },
  });

  //扫料
  function scanMaterials() {
    if (materialsType === 0) {
      // 物料扫描
      openMaterialFormModal(true, {});
    } else {
      // 胶水扫料
      openFormModal(true, {});
    }
  }

  onMounted(async () => {});
</script>
