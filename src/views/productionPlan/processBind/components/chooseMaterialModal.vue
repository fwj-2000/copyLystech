<template>
  <BasicModal
    width="850px"
    v-bind="$attrs"
    @register="registerModal"
    title="选择物料"
    showOkBtn
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    wrapClassName="chooseModal">
    <div class="w-full h-[400px] bg-white">
      <Grid> </Grid>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getList } from '/@/api/business/material';
  import { reactive, ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const emit = defineEmits(['select']);
  const state = reactive({
    selectList: [] as any,
  });
  const activeProcessName = ref();
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 45 },
    { title: ' 物料编码 ', field: 'MaterialCode' },
    { title: ' 原材料规格 ', field: 'MaterialSpec' },
    { title: ' 物料名称 ', field: 'MaterialName' },
    { title: ' 材料描述 ', field: 'MaterialDesc' },
    { title: ' 产品内部料号 ', field: 'InsidePartNumber' },
    { title: ' 实配范围 ', field: 'ActualDistributionRange' },
    { title: ' 是否启用 ', field: 'StatusDesc' },
    { title: ' 主要制程 ', field: 'MainProcessDesc' },
    { title: ' 用途 ', field: 'Purpose' },
    { title: ' 具体应用 ', field: 'SpecificApplications' },
    { title: ' 基材厚度 ', field: 'SubstrateThickness' },
    { title: ' 涂胶 ', field: 'Tds' },
    { title: ' 颜色 ', field: 'MaterialColor' },
    { title: ' 材质 ', field: 'MaterialQuality' },
    { title: ' 离型面要求 ', field: 'SurfaceRequirements' },
    { title: ' 抗静电要求 ', field: 'AntistaticRequirements' },
    { title: ' 其他要求 ', field: 'OtherRequirements' },
    { title: ' 结构组成 ', field: 'Layers' },
    { title: ' 胶系 ', field: 'AdhesiveSystem' },
    { title: ' 材料类型 ', field: 'MaterialType' },
    { title: ' 克重 ', field: 'Grammage' },
    { title: ' 残粘率 ', field: 'ResidualAdhesionRate' },
    { title: ' 被贴材料 ', field: 'AppliedMaterials' },
    { title: ' 实配测试方法 ', field: 'ActualTestingMethod' },
    // { title: ' 开发采购人 Id', field: 'developmentPurchaserId' },
    { title: ' 开发采购人名称 ', field: 'DevelopmentPurchaserName' },
    { title: ' 开发类型 ', field: 'DevelopmentType' },
    { title: ' 工厂 ', field: 'Factory' },
    // { title: ' 工厂 Id', field: 'factoryId' },
    // { title: ' 主要制程 ', field: 'mainProcess' },
    { title: ' 原材料厚度 ', field: 'MaterialThickness' },
    { title: ' 长 M / 卷 ', field: 'MaterialLength' },
    { title: ' 宽 mm', field: 'MaterialWidth' },
    // { title: ' 组织 Id', field: 'orgId' },
    { title: ' 组织名称 ', field: 'OrgName' },
    { title: ' 采购单位 ', field: 'PurchaseUnit' },
    { title: ' 材料 8 码 ', field: 'ShortMaterialCode' },
    { title: ' 尺寸单位 ', field: 'SizeUnit' },
    { title: ' 标准 / 非标 ', field: 'Standard' },
    // { title: ' 供应商 Id', field: 'supplierId' },
    { title: ' 供应商名称 ', field: 'SupplierName' },
    { title: ' 供应商料号 ', field: 'SupplierNumber' },
    { title: ' 临时料号 ', field: 'TemporaryNumber' },
    { title: ' 公差 ', field: 'Tolerance' },
    { title: ' 粘性/离型力等级 ', field: 'ReleaseForceLevel' },
    { title: ' 附膜 ', field: 'Appendage' },
    { title: ' 基材类型 ', field: 'MaterialClass' },
    { title: ' 备注 ', field: 'Remark' },
    // { title: ' 申请日期 ', field: 'AskDate', format:'YYYY/MM/DD' },
    // { title: ' 申请人员 ', field: 'AskMan' },
    { title: ' 创建时间 ', field: 'CreatorTime', cellRender: { name: 'Date' } },
    { title: ' 创建人 ', field: 'CreatorUserName' },
    { title: ' 修改人 ', field: 'LastModifyUserName' },
    { title: ' 修改时间 ', field: 'LastModifyTime', cellRender: { name: 'Date' } },
  ];
  const [registerModal, { closeModal }] = useModalInner(init);
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: [
        {
          fieldName: 'MaterialCode',
          label: '',
          component: 'Input',
          defaultValue: '',
          labelWidth: 0,
          componentProps: {
            placeholder: '物料编码',
          },
        },
        {
          fieldName: 'InsidePartNumber',
          label: '',
          component: 'Input',
          labelWidth: 0,
          defaultValue: '',
          componentProps: {
            placeholder: '内部料号',
          },
        },
        {
          fieldName: 'SupplierNumber',
          label: '',
          component: 'Input',
          labelWidth: 0,
          defaultValue: '',
          componentProps: {
            placeholder: '供应商料号',
          },
        },
        {
          fieldName: 'MainProcess',
          label: '',
          component: 'Select',
          labelWidth: 0,
          defaultValue: '',
          componentProps: {
            placeholder: '主要制程',
          },
        },
      ],
    },
    gridOptions: {
      id: 'productionPlan-processBind-components-chooseMaterialModal',
      api: getList,
      columns: columns as any,
      showIndexColumn: true,
      beforeFetch: params => {
        params.processRouteType = 2;
        return params;
      },
      rowConfig: {
        keyField: 'OriginalModelNumber',
      },
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      afterFetch(data) {
        if (selectList.value.length > 0 && data.list.length > 0) {
          nextTick(() => {
            let selectListRow = data.list.filter(
              item => selectList.value.includes(item.OriginalModelNumber as never) || selectList.value.includes(item.MaterialCode),
            );
            gridApi.grid.setCheckboxRow(selectListRow, true);
          });
        }
      },
    },
  });

  function handleSubmit() {
    emit('select', { list: gridApi.grid.getCheckboxRecords(), processName: activeProcessName.value });
    closeModal();
  }
  function handleCloseFn() {
    closeModal();
  }
  const selectList = ref([]);
  function init({ processName, materials }) {
    activeProcessName.value = processName;
    if (!materials) return;
    selectList.value = materials.split(',');
  }
</script>

<style lang="less" scoped>
  :deep(.ant-table-body) {
    height: 380px !important;
  }

  :deep(.vxe-form.page) {
    border-bottom: none;
  }
</style>
