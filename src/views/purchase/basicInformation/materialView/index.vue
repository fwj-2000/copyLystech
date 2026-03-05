<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <WaitGrid>
          <template #toolbar-actions>
            <div class="btn-wrapper">
              <a-button v-auth="'btn_copyAdd'" type="primary" @click="handleCopyAdd">{{ t('common.copyAdd') }} </a-button>
              <vShowDropdown class="mx-10px">
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_batchRemove'" @click="handleDel">{{ t('common.batchDelText') }} </a-button>
              <a-button v-auth="'btn_enable'" type="primary" @click="handleEnable" ghost>
                {{ t('common.enableText') }}
              </a-button>
              <a-button v-auth="'btn_disable'" @click="handleDisable">
                {{ t('common.disableText') }}
              </a-button>
            </div>
          </template>
          <template #quotationType="{ row }">
            {{ quotaTypes.find(item => item.enCode == row.quotationType)?.fullName }}
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #applyCode="{ row }">
            <span>{{ row.applyCode }} </span>
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getTableActions(row, rowIndex)" />
          </template>
          <template #expandedRowRender="{ row: record }">
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <Subtitle :title="t('common.BasicInformation')" />
              <CustomRows
                :list="[
                  { label: t('dict.SampleApplyColumn.shortName'), value: record.supplierShortName },
                  { label: t('dict.OriginCountryColumn'), value: record.originLocation },
                  { label: t('dict.PriceInquiryColumn.purchasingUnit'), value: record.purchasingUnit },
                  { label: t('dict.QuantitativePlanColumn.width'), value: record.materialWidth },
                  { label: t('dict.QuantitativePlanColumn.Length'), value: record.materialLength },
                  { label: t('dict.QuantitativePlanColumn.Thickness'), value: record.materialThickness },
                  { label: t('dict.SampleApplyColumn.Area'), value: record.materialArea },
                ]" />
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <Subtitle :title="t('dict.PurchaseQuotationColumn.supplierUnitPriceOriginalCurrency')" />
              <a-row :gutter="36">
                <a-col :span="8" style="border-right: 1px solid #dfdfdf">
                  <b class="p-8px mr-20px">{{ t('dict.MouldRoomColumn.quotation') }}</b>
                  <a-row>
                    <a-col :span="12">
                      <CustomRowsColumn
                        :list="[
                          {
                            label: t('dict.PurchaseQuotation.PriceType'),
                            value: record.priceType == '1' ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2'),
                          },
                          {
                            label: t('dict.PurchaseQuotation.DeliveryTerms'),
                            value: deliveryList.find(item => item.enCode === record.deliveryTerms)?.fullName,
                          },
                        ]" />
                    </a-col>
                    <a-col :span="12">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.SampleApplyColumn.UnitPrice'), value: record.supplierUnitPriceBaseCurrency },
                          { label: t('dict.PurchaseQuotationColumn.freightBaseCurrency'), value: record.freightBaseCurrency },
                        ]" />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="8" style="border-right: 1px solid #dfdfdf">
                  <b class="p-8px mr-20px">{{ t('dict.SampleApplyColumn.USD') }}</b>
                  <a-row :gutter="36">
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          {
                            label: t('dict.SampleApplyColumn.TaxType'),
                            value: record.priceTypeOriginalCurrency == '1' ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2'),
                          },
                          { label: t('dict.PurchaseQuotationColumn.tariff'), value: record.flagOriginalCurrency },
                          // { label: '美金转人民币到厂价(单位单价)', value: record.priceOc2bcUntaxedPriceUnit }
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          {
                            label: t('dict.PurchaseQuotationColumn.exchangeRate'),
                            value: record.exchangeRate == '1' ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2'),
                          },
                          {
                            label: t('dict.PurchaseQuotation.DeliveryTerms'),
                            value: deliveryList.find(item => item.enCode == record.deliveryTermsOriginalCurrency)?.fullName,
                          },
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.SampleApplyColumn.UnitPrice'), value: record.supplierUnitPriceOriginalCurrency },
                          { label: t('dict.PurchaseQuotationColumn.freightUnit'), value: record.freightOriginalCurrency },
                        ]" />
                    </a-col>
                  </a-row>
                  <CustomRowsColumn
                    :list="[
                      {
                        label: `${t('dict.SampleApplyColumn.USDtoRMBFactoryPrice')}(${t('dict.SampleApplyColumn.UnitPrice')})`,
                        value: record.priceOc2bcUntaxedPriceUnit,
                      },
                    ]" />
                </a-col>
                <a-col :span="8">
                  <a-row :gutter="36">
                    <a-col :span="14">
                      <CustomRowsColumn
                        :list="[
                          { label: `${t('dict.SampleApplyColumn.USD')} VS ${t('dict.MouldRoomColumn.RMB')}Gap(%)`, value: record.usdRmbGap },
                          { label: t('dict.PurchaseQuotationColumn.reservedBuffer'), value: record.reservedBuffer },
                        ]" />
                    </a-col>
                    <a-col :span="10">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.PurchaseQuotationColumn.benchmarkCurrency'), value: record.benchmarkCurrency },
                          { label: t('dict.PurchaseQuotationColumn.suggestedPurchaseCurrency'), value: record.suggestedPurchaseCurrency },
                        ]" />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <a-row :gutter="36">
                <a-col :span="14" style="border-right: 1px solid #dfdfdf">
                  <Subtitle :title="`${t('dict.MouldRoomColumn.CostQuotationCenterPrice')}(${t('dict.IDGeneratorRuleExcludeType.2')}buffer)`" />
                  <a-row :gutter="36">
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.PurchaseQuotationColumn.generalTradePricePriceUnit'), value: record.generalTradePricePriceUnit },
                          { label: t('dict.PurchaseQuotationColumn.bondedPricePriceUnit'), value: record.bondedPricePriceUnit },
                          { label: `${t('dict.PurchaseQuotationColumn.proportionOfPriceReduction')}(%)`, value: record.proportionOfPriceReduction },
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: `To${t('dict.MouldRoomColumn.EndUserPrice')}`, value: record.supplierToCustomerPrice },
                          { label: `To${t('dict.MouldRoomColumn.EndUser')}Gap`, value: record.gap1 },
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.PurchaseQuotationColumn.exchangeRate'), value: record.exchangeRate },
                          {
                            label: t('dict.PurchaseQuotation.DeliveryTerms'),
                            value: deliveryList.find(item => item.enCode === record.deliveryTerms)?.fullName,
                          },
                        ]" />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="10">
                  <Subtitle :title="t('dict.MouldRoomColumn.OtherInformation')" />
                  <a-row :gutter="36">
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: 'MOQ', value: record.moq },
                          { label: `L/T(${t('component.time.days')})`, value: record.lt },
                          // { label: '实际采买价', value: record.proportionOfPriceReduction },
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.MouldRoomColumn.BaseCurrencyType'), value: record.baseCurrency },
                          { label: t('dict.MouldRoomColumn.OriginalCurrencyType'), value: record.originalCurrency },
                          // { label: '备注', value: record.proportionOfPriceReduction },
                        ]" />
                    </a-col>
                    <a-col :span="8">
                      <CustomRowsColumn
                        :list="[
                          { label: t('dict.PCCColumn.effectiveDate'), value: dateUtil(record.effectiveDate).format('YYYY-MM-DD') },
                          { label: t('dict.PurchaseQuotationColumn.expirationDate'), value: dateUtil(record.expirationDate).format('YYYY-MM-DD') },
                        ]" />
                    </a-col>
                  </a-row>
                  <CustomRows
                    :list="[
                      { label: t('dict.PurchaseQuotationColumn.actualPurchasePrice'), value: record.actualPurchasePrice },
                      { label: t('dict.CommonCol.remark'), value: record.remark },
                    ]" />
                </a-col>
              </a-row>
            </a-card>
          </template>
        </WaitGrid>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="backReload" @close="backReload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reloadTable"></ImportModal>
    <BulkEditModal @register="registerBulkEditModal" @close="reloadTable" @reload="reloadTable" />
    <Revocation
      @register="registerForm"
      @reload="
        () => {
          reloadTable();
        }
      " />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script setup lang="ts">
  import { dateUtil } from '/@/utils/dateUtil';
  import { ActionItem, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { Subtitle } from '/@/components/Subtitle';
  import CustomRows from '/@/views/engineering/data/produce/components/CustomRows.vue';
  import CustomRowsColumn from '/@/views/purchase/basicInformation/materialPrice/components/CustomRowsColumn.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import BulkEditModal from '/@/views/purchase/basicInformation/materialPrice/components/BulkEditModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import Revocation from '/@/views/purchase/basicInformation/materialPrice/components/Revocation.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import ApplyPopup from '/@/views/purchase/basicInformation/materialPrice/components/ApplyPopup.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { onMounted, reactive, toRefs, toRaw } from 'vue';
  import {
    deletePurchaseQuotationList,
    downloadTemplate,
    exportPurchaseQuotationList,
    getCurrencyList,
    getMaterialPriceList,
    getProductLineList,
    importPreview,
    savePurchaseQuotation,
    enable,
    disable,
  } from '/@/api/finance/materialPrice';
  import { getColumns } from '/@/views/purchase/basicInformation/materialPrice/components/CONFIG';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { useAskPriceStore } from '/@/store/modules/askPrice';
  import { downTemplate } from './config';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'purchase-basicInformation-materialView' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();
  const askPriceStore = useAskPriceStore();

  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBulkEditModal, { openModal: openBulkEditModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const state = reactive<any>({
    cacheList: [],
    quotaTypes: [],
    deliveryList: [],
    currencyList: [],
    activeKey: '1',
    doneCacheList: [],
  });
  const { quotaTypes, deliveryList, currencyList, activeKey } = toRefs(state);

  function reloadTable() {
    waitReload();
  }

  function getTableActions(record, index): ActionItem[] {
    return [
      // {
      // 	icon: 'ym-custom ym-custom-backup-restore',
      // 	onClick: handleRevocation.bind(null, index),
      // 	// auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, 'done', index),
        // auth: "btn_detail"
      },
    ];
  }

  function doneGetTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: handleRevocation.bind(null, index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, 'done', index),
        // auth: "btn_detail"
      },
    ];
  }

  const [
    WaitGrid,
    {
      reload: waitReload,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      getSelectRowKeys: waitGetSelectRowKeys,
      getSelectRows,
      getFetchParams: waitGetFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: getFormConfig() as any,
    gridOptions: {
      id: 'purchase-basicInformation-materialView-list',
      columns: getColumns(),
      api: getMaterialPriceList,
      beforeFetch: params => {
        if (params.date) {
          // params.effectiveDate = dateUtil(params.date[0]).startOf('day');
          // params.expirationDate = dateUtil(params.date[1]).endOf('day');
          params.effectiveDate = params.date[0];
          params.expirationDate = params.date[1];
          delete params.date;
        }
        if (params.creatorTime) {
          // params.startTime = dateUtil(params.creatorTime[0]).startOf('day');
          // params.endTime = dateUtil(params.creatorTime[1]).endOf('day');
          params.startTime = params.creatorTime[0];
          params.endTime = params.creatorTime[1];
          delete params.creatorTime;
        }
        return params;
      },
      afterFetch: data => {
        state.cacheList = Array.isArray(data?.list) ? data.list : [];
      },
      pagerConfig: {
        autoHidden: false,
        pageSize: 100,
      },
      expandConfig: {
        padding: true,
      },
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
      },
    },
  });

  function getFormConfig() {
    return {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [
        {
          fieldName: 'insideCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料内部编码',
          },
        },
        {
          fieldName: 'applyCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '报价单号',
          },
        },
        {
          fieldName: 'materialTypeFromManufacturer',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '原厂商材料型号',
          },
        },
        {
          fieldName: 'productLineCode',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            api: getProductLineList,
            placeholder: '产品线代码',
            showSearch: true,
            apiSearch: {
              show: true,
            },
            labelField: 'Name',
            valueField: 'Code',
            resultField: 'data',
            filterOption: false,
            nameFormat: ['Code', '-', 'Name'],
            notFoundContent: null,
            immediate: true,
          },
        },
        {
          fieldName: 'status',
          label: '',
          component: 'Select',
          i18nField: 'priceStatusDesc',
          componentProps: {
            placeholder: '选择状态',
            options: [
              { fullName: t('dict.FileInfoStatus.1'), enCode: '1' },
              { fullName: t('common.loseEfficacy'), enCode: '2' },
            ],
            fieldNames: { value: 'enCode', label: 'fullName' },
          },
        },
        {
          fieldName: 'applyUserName',
          label: '',
          component: 'Input',
          i18nField: 'CommonCol.creatorUserName',
          componentProps: {
            placeholder: '创建人',
          },
        },
        {
          fieldName: 'materialAreaName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '物料分类',
          },
        },
        {
          fieldName: 'terminalCustomerName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '终端客户',
          },
        },
        {
          fieldName: 'handlerName',
          label: '',
          component: 'Input',
          i18nField: 'CommonCol.currentProcessorName',
          componentProps: {
            placeholder: '当前处理人',
          },
        },
        {
          fieldName: 'creatorTime',
          label: '',
          component: 'RangePicker',
          componentProps: {
            // placeholder: ['报价日期', '结束日期'],
            placeholder: [t('dict.PurchaseQuotationColumn.quotationTime'), t('dict.PurchaseQuotationColumn.quotationTime')],
          },
        },
        {
          fieldName: 'date',
          label: '',
          component: 'RangePicker',
          componentProps: {
            // placeholder: ['生效日期', '失效日期'],
            placeholder: [t('dict.PurchaseQuotationColumn.effectiveDate'), t('dict.PurchaseQuotationColumn.expirationDate')],
          },
        },
        {
          fieldName: 'remark',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '备注',
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
        transferRange: ['placeholder'],
        excludeFields: ['date', 'creatorTime'],
      },
    };
  }

  function handleCommon(method, tipText) {
    const selectKeys = waitGetSelectRowKeys();
    console.log('🚀 ~ handleCommon ~ selectKeys: ', selectKeys);
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tipText,
      onOk: async () => {
        try {
          const { code, msg } = await method({ ids: selectKeys });
          if (code === 200) {
            waitClearSelectedRowKeys();
            createMessage.success(msg);
            waitReload();
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:533 ~ handleCommon ~ e:', e);
          waitClearSelectedRowKeys();
          waitReload();
        }
      },
    });
  }

  function handleEnable() {
    handleCommon(enable, t('common.beforeEnableTip'));
  }
  function handleDisable() {
    handleCommon(disable, t('common.beforeEnableTip'));
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: savePurchaseQuotation,
      templateApi: downloadTemplate,
      previewColumn: [],
      apiParams: {
        importSave: {
          // isoperation: hasBtnP('btn_review') ? 1 : 0,
          isoperation: 1,
        },
      },
    });
  }

  function handleRevocation(index) {
    openFormModal(true, { ...state.doneCacheList[index] });
  }

  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...waitGetFetchParams(),
      },
      api: exportPurchaseQuotationList,
      exportOptions: downTemplate,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
      },
    });
  };

  async function handleDel() {
    const selectedRowKeys = waitGetSelectRowKeys();
    if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { msg, code } = await deletePurchaseQuotationList(selectedRowKeys);
          if (code === 200) {
            waitClearSelectedRowKeys();
            message.success(msg);
            waitReload();
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:603 ~ handleDel ~ e:', e);
          waitClearSelectedRowKeys();
          waitReload();
        }
      },
    });
  }

  function backReload() {
    askPriceStore.clearInsidePartList();
    reloadTable();
  }

  function handleEdit(type, index) {
    console.log(type, 'typetypetypetypetype');
    openApplyPop(true, {
      mode: type == 'wait' ? 'edit' : 'view',
      index,
      cacheList: state.cacheList,
    });
  }

  async function getTypeOptions() {
    state.quotaTypes = await baseStore.getDictionaryData('PurchaseQuotation.QuotationType');
    state.deliveryList = await baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms');
    const { data } = await getCurrencyList({ keyword: '' });
    state.currencyList = data;
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.masterId,
    });
  }

  function handleCopyAdd() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    openApplyPop(true, {
      mode: 'edit',
      index: 0,
      cacheList: [],
      // 传入要复制的数据
      copyData: toRaw(rows),
      showSubmit: true,
    });
  }

  onMounted(() => {
    getTypeOptions();
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/purchase/basicInformation/materialPrice/expand.less');
</style>
