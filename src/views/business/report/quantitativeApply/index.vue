<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <VxeBasicTable>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #id="{ row: record }">
            <span v-if="record.id" class="table-a" @click="() => showRequirementDetail(record.id, record.productionType)">{{ t('common.detailText') }}</span>
          </template>
          <template #drawingsReviewId="{ row: record }">
            <span v-if="record.drawingsReviewId" class="table-a" @click="() => showDrawingDetail(record.drawingsReviewId)">{{ t('common.detailText') }}</span>
          </template>
          <template #quantitativeInformationId="{ row: record }">
            <span v-if="record.quantitativeInformationId" class="table-a" @click="() => showQuantitativeInformationDetail(record.quantitativeInformationId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #mainPlanId="{ row: record }">
            <span v-if="record.mainPlanId" class="table-a" @click="() => showProductionPlanDetail(record.mainPlanId)">{{ t('common.detailText') }}</span>
          </template>
          <template #deliveryMcId="{ row: record }">
            <span v-if="record.deliveryMcId" class="table-a" @click="() => showMaterialRequirementDetail(record.deliveryMcId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #quantitativeDiecuttingPlanId="{ row: record }">
            <span v-if="record.quantitativeDiecuttingPlanId" class="table-a" @click="() => showDiecutPlanDetail(record.quantitativeDiecuttingPlanId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #deliveryPlanId="{ row: record }">
            <span v-if="record.deliveryPlanId" class="table-a" @click="() => showDeliveryPlanDetail(record.deliveryPlanId)">{{ t('common.detailText') }}</span>
          </template>
          <template #sampleDeliveryReplyId="{ row: record }">
            <span v-if="record.sampleDeliveryReplyId" class="table-a" @click="() => showDeliveryDateResponsePopup(record.sampleDeliveryReplyId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #deliveryConfirmId="{ row: record }">
            <span v-if="record.deliveryConfirmId" class="table-a" @click="() => showDeliveryConfirmDetail(record.deliveryConfirmId)">{{
              t('common.detailText')
            }}</span>
          </template>
        </VxeBasicTable>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />

    <!-- 需求评审 -->
    <SelfDetail @register="registerReviewPop" />
    <OutDetail @register="registerOutReviewPop" />

    <!-- 图纸评审 -->
    <DrawingDetailPop @register="registerDrawingDetail" />

    <!-- 量试资料详情 -->
    <QuantitativeInformationDetail @register="registerQuantitativeInformationDetail" />

    <!-- 主计划 -->
    <ProductionPlanDetailPopup @register="registerProductionPlanDetailDetail" />

    <!-- 材料交期 -->
    <MaterialRequirementDetail @register="registerMaterialRequirementDetail" />

    <!-- 交货计划 -->
    <DeliveryPlanDetail @register="registerDeliveryPlanDetail" />

    <!-- 样品组交期回复 -->
    <DeliveryDateResponsePopup @register="registerDeliveryDateResponsePopup" />

    <!-- 商务确认详情 -->
    <DeliveryConfirmDetail @register="registerDeliveryConfirmDetail" />
  </div>
</template>

<script setup lang="ts">
  // import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getQuantitativeReport, exportQuantitativeReport } from '/@/api/business/report';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { columns, statusOptions /* demandTypeOptions, DemandTypeEnum, vxeDynamicsColumns */ } from './config';
  import { omit } from 'lodash-es';
  import { useRoute } from 'vue-router';
  import { onMounted, computed, watch, nextTick } from 'vue';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import SelfDetail from '/@/views/business/quantitation/assess/components/SelfDetail.vue';
  import OutDetail from '/@/views/business/quantitation/assess/components/OutDetail.vue';
  import DrawingDetailPop from '/@/views/engineering/drawing/drawingReview/components/drawingDetailPop.vue';
  import ProductionPlanDetailPopup from '/@/views/productionPlan/main/quantitation/components/DetailPopup.vue';
  import MaterialRequirementDetail from '/@/views/productionPlan/materialRequirement/deliveryDate/components/ViewPopup.vue';
  import DeliveryPlanDetail from '/@/views/productionPlan/main/deliveryPlan/components/ViewPopup.vue';
  import QuantitativeInformationDetail from '/@/views/engineering/data/produce/componentsBom/DetailPopup.vue';
  import DeliveryDateResponsePopup from './components/deliveryDateResponsePopup.vue';
  import DeliveryConfirmDetail from '/@/views/business/deliveryConfirm/components/DetailPopup.vue';

  defineOptions({ name: 'business-report-quantitativeApply' });

  const { t } = useI18n();

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: [
        // {
        //   fieldName: 'demandType',
        //   label: '',
        //   component: 'Select',
        //   defaultValue: DemandTypeEnum.量试需求,
        //   componentProps: {
        //     placeholder: t('dict.SampleLabelPrintColumn.demandTypeName'),
        //     style: 'width: 100%',
        //     options: demandTypeOptions,
        //     // defaultValue: DemandTypeEnum.量试需求,
        //     allowClear: false,
        //   },
        // },
        {
          fieldName: 'handlerSataus',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: t('common.handlStatus'),
            style: 'width: 100%',
            options: statusOptions,
            allowClear: true,
          },
        },
        {
          fieldName: 'handlerUserName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('common.handler'),
            allowClear: true,
          },
        },
      ],
    },
    gridOptions: {
      id: 'business-report-quantitativeApply-list',
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns,
      formConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      api: getTableData,
      toolbarConfig: {
        refresh: true,
        custom: true,
      },
      i18nConfig: {
        moduleCode: 'QuantitativeReportColumn',
      },
      // @ts-ignore
      proxyConfig: {
        // 关闭自动加载
        autoLoad: false,
      },
    },
  });

  // const currentDemandType = ref<string>('');
  /**
   * @description 获取表格数据
   * @param query
   */
  async function getTableData(query: any) {
    return getQuantitativeReport(formatQuery(query)).then(res => {
      // if (currentDemandType.value !== query.demandType) {
      //   currentDemandType.value = query.demandType;
      //   tableRef.loadColumn(getColumns(query.demandType));
      // }
      return res;
    });
  }

  /**
   * @description 获取表格列
   * @param demandType 需求类型
   */
  // function getColumns(demandType: `${DemandTypeEnum}`) {
  //   const list = [...columns];
  //   const dynamicsColumns = vxeDynamicsColumns[demandType];
  //   if (dynamicsColumns) {
  //     // 在`图纸评审(drawingsReviewId)`之后，插入动态列
  //     list.splice(
  //       columns.findIndex(item => item.field === 'drawingsReviewId'),
  //       0,
  //       ...dynamicsColumns,
  //     );
  //   }
  //   return list;
  // }

  /**
   * 分页接口及导出接口 - 请求参数处理
   */
  function formatQuery(query: any) {
    // `单号`展示字段为`applyNo`，筛选字段为`applyCode`，做兼容处理
    if (query.applyNo) {
      query.applyCode = query.applyNo;
    }
    return query;
  }

  //导出
  function handleExport() {
    const { pager } = tableRef.grid.getProxyInfo()!;
    const filters = tableRef.grid.getCheckedFilters().reduce((pre, item) => {
      pre[item.field] = Array.isArray(item.datas) ? item.datas.join() : item.datas;
      return pre;
    }, {});
    // const checkedList = tableRef.grid!.getCheckboxRecords();

    openExportModal(true, {
      // 请求 api
      api: (query: any) => exportQuantitativeReport(formatQuery(query)),
      listQuery: { ...filters, ...omit(pager, 'total') },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns.slice(1),
      // selectIds: checkedList.map(item => item.Id)
      i18nConfig: {
        moduleCode: 'QuantitativeReportColumn',
      },
    });
  }

  const [registerReviewPop, { openPopup: openReviewPopup }] = usePopup();
  const [registerOutReviewPop, { openPopup: openOutReviewPopup }] = usePopup();
  /**
   * @description: 显示需求评审详情
   * @param { string } requirementId 需求评审id
   * @param { 1 | 2 } productionType 1 为自制，2 为外购
   */
  function showRequirementDetail(requirementId: string, productionType: 1 | 2) {
    productionType === 2
      ? openOutReviewPopup(true, { id: [requirementId], title: t('common.add'), type: 'view' })
      : openReviewPopup(true, { id: [requirementId], title: t('common.add'), type: 'view' });
  }

  const [registerDrawingDetail, { openPopup: openDrawingDetail }] = usePopup();
  /**
   * @description 显示图评详情
   * @param detailId 图纸详情id
   */
  function showDrawingDetail(detailId: string) {
    openDrawingDetail(true, {
      sign: 'detail',
      index: 0,
      detailId,
      cacheList: [],
    });
  }

  const [registerProductionPlanDetailDetail, { openPopup: openProductionPlanDetail }] = usePopup();
  /**
   * @description 显示生产计划详情
   * @param id 生产计划id
   */
  function showProductionPlanDetail(id: string) {
    openProductionPlanDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
    });
  }

  const [registerMaterialRequirementDetail, { openPopup: openMaterialRequirementDetail }] = usePopup();
  /**
   * @description 显示材料交付详情
   * @param id 材料交付id
   */
  function showMaterialRequirementDetail(id: string) {
    openMaterialRequirementDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
    });
  }

  const [registerDeliveryPlanDetail, { openPopup: openDeliveryPlanDetail }] = usePopup();
  /**
   * @description 显示交货计划详情
   * @param id 交货计划id
   */
  function showDeliveryPlanDetail(id: string) {
    openDeliveryPlanDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
      planType: '2',
      title: t('dict.QuantitativeReportColumn.deliveryPlanId'),
    });
  }
  /**
   * @description 显示模切计划详情
   * @param id 模切计划id
   */
  function showDiecutPlanDetail(id: string) {
    openDeliveryPlanDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
      planType: '1',
      title: t('dict.QuantitativeReportColumn.quantitativeDiecuttingPlanId'),
    });
  }

  const [registerQuantitativeInformationDetail, { openPopup: openQuantitativeInformationDetail }] = usePopup();
  /**
   * @description 量试订单评审
   * @param id 量试订单评审id
   */
  function showQuantitativeInformationDetail(id: string) {
    openQuantitativeInformationDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
      cacheList: [{ id }],
    });
  }

  const [registerDeliveryDateResponsePopup, { openPopup: openDeliveryDateResponsePopup }] = usePopup();
  /**
   * @description 样品组回复详情
   * @param id 样品组回复id
   */
  function showDeliveryDateResponsePopup(id: string) {
    openDeliveryDateResponsePopup(true, id);
  }

  const [registerDeliveryConfirmDetail, { openPopup: openDeliveryConfirmDetail }] = usePopup();
  /**
   * @description 商务确认详情
   * @param id 商务确认id
   */
  function showDeliveryConfirmDetail(id: string) {
    openDeliveryConfirmDetail(true, { ids: [id], type: 'view' });
  }

  // 成品编码生命周期跳转到当前页面的处理 开始
  const productCodeLifyCycleStore = useProductCodeLifyCycleStore();
  const routePath = useRoute().path;
  const productCodeLifyCycleParams = computed(() => productCodeLifyCycleStore.lifeCycleParamMap[routePath]);

  watch(productCodeLifyCycleParams, () => {
    productCodeLifyCycleParams.value && reloadByProductCodeLifyCycle();
  });

  function reloadByProductCodeLifyCycle() {
    setTimeout(() => {
      if (!productCodeLifyCycleParams.value) {
        return false;
      }
      const { filter, pager } = tableRef.grid.getProxyInfo() || { filter: [] };

      const currentFilterApplyCode = filter.find(item => item.field === 'applyNo')?.datas?.[0];
      const currentFilterInsidePartNumber = filter.find(item => item.field === 'insidePartNumber')?.datas?.[0];

      if (
        currentFilterApplyCode === productCodeLifyCycleParams.value.applyCode &&
        currentFilterInsidePartNumber === productCodeLifyCycleParams.value.insidePartNumber
      ) {
        return false;
      }

      // 手动设置筛选条件并提交查询
      if (pager) {
        pager.currentPage = 1;
      }
      tableRef.grid.setFilter('applyNo', [{ data: productCodeLifyCycleParams.value.applyCode, checked: true }]);
      tableRef.grid.setFilter('insidePartNumber', [{ data: productCodeLifyCycleParams.value.insidePartNumber, checked: true }]);
      tableRef.grid.commitProxy('query');
      // 清空存储的筛选条件
      productCodeLifyCycleStore.setLifeCycleParam(routePath, null);
    });
  }

  onMounted(async () => {
    await nextTick();
    productCodeLifyCycleParams.value ? reloadByProductCodeLifyCycle() : tableRef.grid.commitProxy('query');
  });
  // 成品编码生命周期跳转到当前页面的处理 结束
</script>

<style lang="less" scoped>
  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
