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

    <!-- 导出 -->
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { vxeTableColumns, statusOptions } from './config';
  import { getQuotationReport, exportQuotationReport } from '/@/api/business/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { omit } from 'lodash-es';
  import { useRoute } from 'vue-router';
  import { onMounted, computed, watch, nextTick } from 'vue';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';

  import SelfDetail from '/@/views/business/quantitation/assess/components/SelfDetail.vue';
  import OutDetail from '/@/views/business/quantitation/assess/components/OutDetail.vue';
  import DrawingDetailPop from '/@/views/engineering/drawing/drawingReview/components/drawingDetailPop.vue';
  // import EngineeringQuotationDetail from '/@/views/engineering/data/quotationInit/components/ApplyPopup.vue';
  import EngineeringQuotationDetail from '/@/views/engineering/quotationBom/components/DetailPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'business-report-quotation' });

  const { t } = useI18n();

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
        {
          fieldName: 'handlerSataus',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: t('common.handlStatus'),
            style: 'width: 100%',
            // options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
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
      id: 'business-report-quotation-list',
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
      api: getQuotationReport,
      toolbarConfig: {
        refresh: true,
        custom: true,
      },
      i18nConfig: {
        moduleCode: 'QuotationReportColumn',
      },
      // @ts-ignore
      proxyConfig: {
        // 关闭自动加载
        autoLoad: false,
      },
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
    // getQuotationDetail({ id }).then(res => {
    //   openEngineeringQutationDetail(true, {
    //     index: 0,
    //     mode: 'view',
    //     cacheList: [{ id }],
    //     showSyncPrice: true,
    //   });
    // });
    openEngineeringQutationDetail(true, {
      index: 0,
      mode: 'view',
      cacheList: [{ id }],
      showSyncPrice: true,
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
      api: (query: any) => exportQuotationReport({ ...query, id: query.selectIds }),
      exportOptions: vxeTableColumns.slice(1),
      nameProps: 'title',
      idProps: 'field',
      // selectIds: checkedList.map(item => item.id)
      i18nConfig: {
        moduleCode: 'QuotationReportColumn',
      },
    });
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

      const currentFilterApplyCode = filter.find(item => item.field === 'applyCode')?.datas?.[0];
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
      tableRef.grid.setFilter('applyCode', [{ data: productCodeLifyCycleParams.value.applyCode, checked: true }]);
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
