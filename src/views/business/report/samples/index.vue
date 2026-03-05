<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <VxeBasicTable>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_download'" @click="handleOpenExportModal">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #ReviewDetail="{ row }">
            <span v-if="row.reviewId" class="table-a" @click="() => showRequirementDetail(row.reviewId, row.ProductionTypeEnum)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #DrawingsReviewDetail="{ row }">
            <span v-if="row.drawingsReviewId" class="table-a" @click="() => showDrawingDetail(row.drawingsReviewId)">{{ t('common.detailText') }}</span>
          </template>
          <template #QuotationIdDetail="{ row }">
            <span v-if="row.quotationId" class="table-a" @click="() => showEngineeringQuotationDetail(row.quotationId)">{{ t('common.detailText') }}</span>
          </template>
          <template #PccId="{ row }">
            <span v-if="row.pccId" class="table-a" @click="() => showPccDetail(row.pccId)">{{ t('common.detailText') }}</span>
          </template>
          <template #pdLeaderInfoId="{ row }">
            <span v-if="row.pdLeaderInfoId" class="table-a" @click="() => showPccDetail(row.pdLeaderInfoId)">{{ t('common.detailText') }}</span>
          </template>
          <template #sampleDeliveryReplyId="{ row }">
            <span v-if="row.sampleDeliveryReplyId" class="table-a" @click="() => showDeliveryDateResponsePopup(row.sampleDeliveryReplyId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #deliveryConfirmId="{ row }">
            <span v-if="row.deliveryConfirmId" class="table-a" @click="() => showDeliveryConfirmDetail(row.deliveryConfirmId)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #confirmOpinion="{ row }">
            <Lydc-tag v-if="row.isSatisfy == 1" theme="green">满足</Lydc-tag>
            <Lydc-tag v-if="row.isSatisfy == 0" theme="red">不满足</Lydc-tag>
          </template>
        </VxeBasicTable>
      </div>
    </div>

    <!-- 需求评审 -->
    <SelfDetail @register="registerReviewPop" />
    <OutDetail @register="registerOutReviewPop" />

    <!-- 图纸评审 -->
    <DrawingDetailPop @register="registerDrawingDetail" />

    <!-- 工程报价 -->
    <EngineeringQuotationDetail @register="registerEngineeringQutationDetail" />

    <!-- PCC详情 -->
    <PccDetailPopup @register="registerPccDetail" />

    <!-- 导出 -->
    <ExportModal @register="registerExportModal" />

    <!-- 样品组交期回复 -->
    <DeliveryDateResponsePopup @register="registerDeliveryDateResponsePopup" />

    <!-- 商务确认详情 -->
    <DeliveryConfirmDetail @register="registerDeliveryConfirmDetail" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { vxeTableColumns } from './config';
  import { getBusinessSamplesReport, exportBusinessSamplesReport } from '/@/api/business/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { getQuotationDetail } from '/@/api/engineering/quotatios';
  import { useModal } from '/@/components/Modal';
  import { omit } from 'lodash-es';
  import { useRoute } from 'vue-router';
  import { onMounted, computed, watch, nextTick } from 'vue';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';
  import { ModeTypeEnum } from '/@/enums/modeEnum';

  import SelfDetail from '/@/views/business/quantitation/assess/components/SelfDetail.vue';
  import OutDetail from '/@/views/business/quantitation/assess/components/OutDetail.vue';
  import DrawingDetailPop from '/@/views/engineering/drawing/drawingReview/components/drawingDetailPop.vue';
  import EngineeringQuotationDetail from '/@/views/engineering/data/quotationInit/components/ApplyPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import PccDetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import DeliveryDateResponsePopup from '/@/views/business/report/quantitativeApply/components/deliveryDateResponsePopup.vue';
  import DeliveryConfirmDetail from '/@/views/business/deliveryConfirm/components/DetailPopup.vue';

  defineOptions({ name: 'business-report-samples' });

  const { t } = useI18n();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
    formOptions: undefined,
    gridOptions: {
      id: 'business-report-samples-list',
      columns: vxeTableColumns,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      keyboardConfig: {
        isBack: false,
      },
      formConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      api: getBusinessSamplesReport,
      toolbarConfig: {
        refresh: true,
        custom: true,
      },
      // @ts-ignore
      // i18nConfig: {
      //   moduleCode: 'BusinessSamplesReportColumn'
      // }
    },
  });

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
   * @param detailId 图纸评审id
   */
  function showDrawingDetail(detailId: string) {
    openDrawingDetail(true, {
      sign: 'detail',
      index: 0,
      detailId,
      cacheList: [],
    });
  }

  const [registerEngineeringQutationDetail, { openPopup: openEngineeringQutationDetail }] = usePopup();
  /**
   * @description 显示工程报价详情
   * @param id 工程报价id
   */
  function showEngineeringQuotationDetail(id: string) {
    getQuotationDetail({ id }).then(res => {
      openEngineeringQutationDetail(true, {
        index: 0,
        mode: 'view',
        cacheList: [res.data],
      });
    });
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  function handleOpenExportModal() {
    const { pager } = tableRef.grid.getProxyInfo()!;
    const filters = tableRef.grid.getCheckedFilters().reduce((pre, item) => {
      pre[item.field] = Array.isArray(item.datas) ? item.datas.join() : item.datas;
      return pre;
    }, {});
    // const checkedList = tableRef.grid!.getCheckboxRecords();

    openExportModal(true, {
      listQuery: { ...filters, ...omit(pager, 'total') },
      api: (query: any) => exportBusinessSamplesReport({ ...query, id: query.selectIds }),
      exportOptions: vxeTableColumns.slice(1),
      nameProps: 'title',
      idProps: 'field',
      // selectIds: checkedList.map(item => item.id)
    });
  }

  const [registerPccDetail, { openPopup: openPccDetail }] = usePopup();
  function showPccDetail(id: string) {
    openPccDetail(true, {
      index: 0,
      mode: ModeTypeEnum.VIEW,
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
