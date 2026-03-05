<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <VxeBasicTable>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_download'" @click="handleOpenExportModal">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #produceId="{ row }">
            <span
              v-if="row.produceHandlerStausEnum && row.produceHandlerStausEnum !== TODO_STATUS_VALUE"
              class="table-a"
              @click="() => showProduceDetail(row.id)"
              >{{ t('common.detailText') }}</span
            >
          </template>
          <template #engineeringId="{ row }">
            <span
              v-if="row.engineeringHandlerStausEnum && row.engineeringHandlerStausEnum !== TODO_STATUS_VALUE"
              class="table-a"
              @click="() => showEngineeringDetail(row.id)"
              >{{ t('common.detailText') }}</span
            >
          </template>
          <template #reviewId="{ row }">
            <span
              v-if="row.reviewHandlerStausEnum && row.reviewHandlerStausEnum !== TODO_STATUS_VALUE"
              class="table-a"
              @click="() => showReviewDetail(row.id)"
              >{{ t('common.detailText') }}</span
            >
          </template>
          <template #fbId="{ row }">
            <span v-if="row.fbHandlerStausEnum && row.fbHandlerStausEnum !== TODO_STATUS_VALUE" class="table-a" @click="() => showFbDetail(row.id)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #effId="{ row }">
            <span v-if="row.departureStatusEnum || row.exportStatusEnum" class="table-a" @click="() => showEffDetail(row.id)">{{
              t('common.detailText')
            }}</span>
          </template>
        </VxeBasicTable>
      </div>
    </div>
    <!-- 导出 -->
    <ExportModal @register="registerExportModal" />

    <!-- 生产 - 关务备案资料 -->
    <ProduceDetail @register="registerProducePop" />

    <!-- 工程 - 关务备案资料 -->
    <EngineerDetail @register="registerEngineerPop" />

    <!-- 资料审核 - 详情 -->
    <ReviewDetail @register="registerReviewPop" />

    <!-- 备案资料制作 -->
    <FbDetail @register="registerFbPop" />

    <!-- 终版详情 -->
    <EffDetail @register="registerEffPopup" />
  </div>
</template>

<script lang="ts" setup async>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getVxeTableColumns, TODO_STATUS_VALUE } from './config';
  import { getCustomSaffairsReport, exportCustomSaffairsReport } from '/@/api/logisticAffairs/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { omit } from 'lodash-es';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import ProduceDetail from '/@/views/productionDeal/fillings/maintain/components/detailPopup.vue';
  import EngineerDetail from '/@/views/engineering/filings/maintain/components/detailPopup.vue';
  import ReviewDetail from '/@/views/logisticAffairs/export/filings/demand/components/ApplyPop.vue';
  import FbDetail from '/@/views/logisticAffairs/export/filings/maintain/components/DetailPop.vue';
  import EffDetail from '/@/views/logisticAffairs/export/filings/finalForm/components/detailPopup.vue';

  defineOptions({ name: 'business-report-engineeringSamples' });

  const { t } = useI18n();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
    /**
     * 表单区域搜索，暂时改为列筛选，后续可能恢复，故而暂时注释
     */
    // formOptions: {
    //   collapsed: true,
    //   showCollapseButton: true,
    //   // 是否在字段值改变时提交表单
    //   submitOnChange: false,
    //   // 按下回车时是否提交表单
    //   submitOnEnter: true,
    //   commonConfig: {
    //     componentProps: {},
    //     labelClass: 'w-0',
    //   },
    //   wrapperClass: 'grid grid-cols-6 gap-4',
    //   schema: [
    //     {
    //       fieldName: 'filingsApplyNo',
    //       label: '',
    //       component: 'Input',
    //       componentProps: {
    //         placeholder: t('dict.CustomsAffairsReportColumn.filingsApplyNo'),
    //         allowClear: true,
    //       },
    //     },
    //     {
    //       fieldName: 'quantitativeApplyNo',
    //       label: '',
    //       component: 'Input',
    //       componentProps: {
    //         placeholder: t('dict.CustomsAffairsReportColumn.quantitativeApplyNo'),
    //         allowClear: true,
    //       },
    //     },
    //     {
    //       fieldName: 'innerMaterialNumber',
    //       label: '',
    //       component: 'Input',
    //       componentProps: {
    //         placeholder: t('dict.CustomsAffairsReportColumn.innerMaterialNumber'),
    //         allowClear: true,
    //       },
    //     },
    //     {
    //       fieldName: 'terminalCustomerMaterialNumber',
    //       label: '',
    //       component: 'Input',
    //       componentProps: {
    //         placeholder: t('dict.CustomsAffairsReportColumn.terminalCustomerMaterialNumber'),
    //         allowClear: true,
    //       },
    //     },
    //     {
    //       fieldName: 'directCustomerName',
    //       label: '',
    //       component: 'Input',
    //       componentProps: {
    //         placeholder: t('dict.CustomsAffairsReportColumn.directCustomerName'),
    //         allowClear: true,
    //       },
    //     },
    //   ],
    // },
    formOptions: undefined,
    gridOptions: {
      columns: getVxeTableColumns(),
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
      api: getCustomSaffairsReport,
      toolbarConfig: {
        refresh: true,
        custom: true,
      },
    },
  });

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
      api: (query: any) => exportCustomSaffairsReport({ ...query, id: query.selectIds }),
      exportOptions: getVxeTableColumns().slice(1),
      nameProps: 'title',
      idProps: 'field',
      // selectIds: checkedList.map(item => item.id)
    });
  }

  const [registerProducePop, { openPopup: openProducePopup }] = usePopup();
  function showProduceDetail(id: string) {
    openProducePopup(true, {
      id: id,
      title: t('common.view'),
    });
  }

  const [registerEngineerPop, { openPopup: openEngineerPopup }] = usePopup();
  function showEngineeringDetail(id: string) {
    openEngineerPopup(true, {
      id: id,
      title: t('common.view'),
    });
  }

  const [registerReviewPop, { openPopup: openReviewPopup }] = usePopup();
  function showReviewDetail(id: string) {
    openReviewPopup(true, {
      ids: [id],
      type: 'view',
      title: t('common.view'),
    });
  }

  const [registerFbPop, { openPopup: openFbPopup }] = usePopup();
  function showFbDetail(id: string) {
    openFbPopup(true, { id });
  }

  const [registerEffPopup, { openPopup: openEffPopup }] = usePopup();
  function showEffDetail(id: string) {
    openEffPopup(true, {
      type: 'view',
      id,
      title: t('common.detailText'),
    });
  }

  onMounted(() => {
    tableRef.reload();
  });
</script>

<style lang="less" scoped>
  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
