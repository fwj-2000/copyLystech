<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <div class="btn-wrapper">
              <a-button v-auth="'btn_add'" type="primary" @click="handleSingleApply">新增</a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="batchImportOrExport">
                    <a-menu-item v-if="hasBtnP('btn_upload')" key="import">批量导入</a-menu-item>
                    <a-menu-item v-if="hasBtnP('btn_download')" key="export">批量导出</a-menu-item>
                  </a-menu>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </a-dropdown>
              <a-button v-auth="'btn_batchRemove'" @click="handleDel">批量删除</a-button>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag v-auth="'btn_enable'" v-if="record.status == '1'" color="success">启用</a-tag>
              <a-tag v-auth="'btn_edit'" v-if="record.status == '2'" color="error">禁用</a-tag>
            </template>
            <template v-else-if="column.key === 'quotationType'">
              {{ quotaTypes.find(item => item.enCode == record.quotationType)?.fullName }}
            </template>
            <template v-else-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <Subtitle title="基本信息" />
              <CustomRows
                :list="[
                  { label: '产品线代码', value: record.productLineCode },
                  { label: '终端客户', value: record.terminalCustomerName },
                  { label: '材料内部编码', value: record.insideCode },
                  { label: '原厂商材料型号', value: record.materialTypeFromManufacturer },
                  { label: '供应商', value: record.supplierName },
                  { label: '长(M)', value: record.materialLength },
                  { label: '宽(MM)', value: record.materialWidth },
                  { label: '面积', value: record.materialArea },
                  { label: '采购单位', value: record.purchasingUnit },
                  { label: '报价单位', value: record.priceUnit },
                  // { label: '尺寸单位', value: record.materialTypeFromManufacturer },
                  { label: '物料名称', value: record.materialDescription },
                ]" />
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <Subtitle title="供应商报价" />
              <CustomRows
                :list="[
                  { label: '本位币币别', value: currencyList.find(item => item.ISOCode == record.baseCurrency)?.ShortName },
                  { label: '原币币别', value: currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName },
                  { label: '价格类型', value: record.priceType == '1' ? '含税' : '未税' },
                  { label: '基准币别', value: currencyList.find(item => item.ISOCode == record.benchmarkCurrency)?.ShortName },
                  { label: '建议采购币别', value: currencyList.find(item => item.ISOCode == record.suggestedPurchaseCurrency)?.ShortName },
                  { label: '预留buffer(%)', value: record.reservedBuffer * 100 + '%' },
                  { label: `${record.baseCurrency}:${record.originalCurrency} Gap(%)`, value: record.usdRmbGap },
                ]" />
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #ebebeb">
              <CustomRows :list="[{ label: '交货条件', value: deliveryList.find(item => item.enCode === record.deliveryTerms)?.fullName }]" />
              <a-row :gutter="36">
                <a-col :span="12" style="border-right: 1px solid #dfdfdf">
                  <b class="p-8px mr-20px">{{ currencyList.find(item => item.ISOCode == record.baseCurrency)?.ShortName }}, 未税</b>
                  <CustomRows
                    :list="[
                      { label: '采购价格', value: record.supplierPriceBaseCurrency },
                      { label: '单价价格', value: record.supplierUnitPriceBaseCurrency },
                      { label: '运费', value: record.freightBaseCurrency },
                    ]" />
                </a-col>
                <a-col :span="12">
                  <b class="p-8px mr-20px">{{ currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName }}</b>
                  <CustomRows
                    :list="[
                      { label: '采购价格', value: record.supplierPriceOriginalCurrency },
                      { label: '报价单位', value: record.supplierUnitPriceOriginalCurrency },
                      { label: '运费', value: record.freightOriginalCurrency },
                    ]" />
                </a-col>
              </a-row>
              <b class="p-8px pt-10px mr-20px block" style="border-top: 1px solid #dfdfdf"
                >{{ currencyList.find(item => item.ISOCode == record.baseCurrency)?.ShortName }} -->
                {{ currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName }} 未税, 到厂</b
              >
              <CustomRows
                :list="[
                  { label: '报价当月汇率', value: record.exchangeRate },
                  { label: '关税', value: record.tariff * 100 + '%' },
                  {
                    label: `${currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName}转${
                      currencyList.find(item => item.ISOCode == record.baseCurrency)?.ShortName
                    }未税到厂价(采购单位)`,
                    value: record.priceOc2bcUntaxedPurchasingUnit,
                  },
                  {
                    label: `${currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName}转${
                      currencyList.find(item => item.ISOCode == record.baseCurrency)?.ShortName
                    }未税到厂价(报价单位)`,
                    value: record.priceOc2bcUntaxedPriceUnit,
                  },
                ]" />
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
              <Subtitle :title="`成本报价中心价格${currencyList.find(item => item.ISOCode == record.originalCurrency)?.ShortName}(包含buffer)`" />
              <CustomRows
                :list="[
                  { label: '一般贸易价(采购单位)', value: record.generalTradePricePurchasingUnit },
                  { label: '一般贸易价(报价单位)', value: record.generalTradePricePriceUnit },
                  { label: '保税价(采购单位)', value: record.bondedPricePurchasingUnit },
                  { label: '保税价(报价单位)', value: record.bondedPricePriceUnit },
                ]" />
            </a-card>
          </template>
        </BasicTable>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="reload" />
    <DetailPopup @register="registerDetail" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  </div>
</template>
<script setup lang="ts">
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    deletePurchaseQuotation,
    deletePurchaseQuotationList,
    downloadTemplate,
    exportPurchaseQuotationList,
    getCurrencyList,
    getMaterialPriceList,
    getProductLineList,
    importPreview,
    savePurchaseQuotation,
  } from '/@/api/finance/materialPrice';
  import { message } from 'ant-design-vue';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import CustomRows from '/@/views/engineering/data/produce/components/CustomRows.vue';
  import DetailPopup from './components/DetailPopup.vue';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onMounted, reactive, toRefs } from 'vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'purchase-basicInformation-materialPrice' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();

  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerDetail, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const columns: BasicColumn[] = [
    {
      title: '报价单号',
      dataIndex: 'applyCode',
      sorter: true,
      width: 150,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      sorter: true,
      width: 100,
    },
    {
      title: '负责人',
      dataIndex: 'responsiblePersonName',
      sorter: true,
      width: 220,
      customRender: ({ record }) => {
        if (!record.responsiblePersonName || !record.responsiblePersonAccount) return null;
        return `${record.responsiblePersonName}/${record.responsiblePersonAccount}`;
      },
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      sorter: true,
      width: 150,
      format: 'date|YYYY-MM-DD',
    },
    {
      title: '失效日期',
      dataIndex: 'expirationDate',
      sorter: true,
      format: 'date|YYYY-MM-DD',
      width: 150,
    },
    {
      title: '报价时间',
      dataIndex: 'quotationTime',
      sorter: true,
      format: 'date|YYYY-MM-DD',
      width: 150,
    },
    {
      title: '报价类型',
      dataIndex: 'quotationType',
      sorter: true,
      width: 150,
    },
    {
      title: '本次降价比例',
      dataIndex: 'proportionOfPriceReduction',
      sorter: true,
      width: 150,
    },
    {
      title: 'supplier to customer price',
      dataIndex: 'supplierToCustomerPrice',
      sorter: true,
      width: 150,
    },
    {
      title: 'Gap1',
      dataIndex: 'gap1',
      sorter: true,
      width: 150,
    },
    {
      title: 'supplier to competitor price',
      dataIndex: 'supplierToCompetitorPrice',
      sorter: true,
      width: 150,
    },
    {
      title: 'Gap2',
      dataIndex: 'gap2',
      sorter: true,
      width: 150,
    },
    {
      title: '原产地',
      dataIndex: 'originLocation',
      sorter: true,
      width: 150,
    },
    {
      title: 'MOQ',
      dataIndex: 'moq',
      sorter: true,
      width: 150,
    },
    {
      title: 'L/T',
      dataIndex: 'lt',
      sorter: true,
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      sorter: true,
      width: 240,
    },
    {
      title: '创建人',
      dataIndex: 'creatorUserName',
      sorter: true,
      width: 220,
    },
    {
      title: '创建时间',
      dataIndex: 'creatorTime',
      sorter: true,
      format: 'date|YYYY-MM-DD',
      width: 150,
    },
    {
      title: '修改人',
      dataIndex: 'lastModifyUserName',
      sorter: true,
      width: 220,
    },
    {
      title: '修改日期',
      dataIndex: 'lastModifyTime',
      sorter: true,
      format: 'date|YYYY-MM-DD',
      width: 150,
    },
  ];

  const dataConfig = [
    { title: '产品线编码', dataIndex: 'productLineCode' },
    { title: '项目代码', dataIndex: 'projectCode', width: 120 },
    { title: '内部编码', dataIndex: 'insideCode', width: 120 },
    { title: '原厂商材料号', dataIndex: 'description', width: 120 },
    { title: '供应商简称', dataIndex: 'manufacturer', width: 120 },
    { title: '物料宽度（MM）', dataIndex: 'materialWidth', width: 120 },
    { title: '物料长度（M）', dataIndex: 'materialLength', width: 120 },
    { title: '物料厚度（MM）', dataIndex: 'materialThickness', width: 120, format: 'date|YYYY-MM-DD' },
    { title: '物料面积（M²）', dataIndex: 'materialArea', width: 120 },
    { title: '采购单位', dataIndex: 'purchasingUnit', width: 200 },
    { title: '价格类型', dataIndex: 'priceType', width: 200 },
    { title: '供应商报价-采购价格（本位币）', dataIndex: 'supplierPriceBaseCurrency', width: 120 },
    { title: '供应商报价-单位价格（本位币）', dataIndex: 'supplierUnitPriceBaseCurrency', width: 120 },
    {
      title: '交货条件',
      dataIndex: 'deliveryTerms',
      width: 200,
    },
    { title: '运费（本位币）', dataIndex: 'freightBaseCurrency', width: 120 },
    { title: '本位币', dataIndex: 'baseCurrency', width: 120 },
    { title: '原币', dataIndex: 'originalCurrency', width: 120 },
    { title: '供应商报价-采购价格（原币）', dataIndex: 'supplierPriceOriginalCurrency', width: 120 },
    { title: '供应商报价-单位价格（原币）', dataIndex: 'supplierUnitPriceOriginalCurrency', width: 120 },
    { title: '运费（原币）', dataIndex: 'freightOriginalCurrency', width: 120 },
    { title: '报价当月汇率', dataIndex: 'exchangeRate', width: 120 },
    { title: '关税（%）', dataIndex: 'tariff', width: 120 },
    { title: '原币转本位币未税到厂价（采购单位）', dataIndex: 'priceBeforeTax', width: 120 },
    { title: '报价单位', dataIndex: 'priceUnit', width: 120 },
    { title: '原币转本位币未税到厂价（报价单位）', dataIndex: 'priceOc2bcUntaxedPurchasingUnit', width: 120 },
    { title: 'USD:RMB Gap (%)', dataIndex: 'usdRmbGap', width: 120 },
    { title: '基准币别', dataIndex: 'benchmarkCurrency', width: 120 },
    { title: '建议采购币别', dataIndex: 'suggestedPurchaseCurrency', width: 120 },
    { title: '预留Buffer(%)', dataIndex: 'reservedBuffer', width: 120 },
    { title: '一般贸易价（采购单位）', dataIndex: 'generalTradePricePurchasingUnit', width: 120 },
    { title: '一般贸易价（报价单位）', dataIndex: 'generalTradePricePriceUnit', width: 120 },
    { title: '保税价（采购单位）', dataIndex: 'bondedPricePurchasingUnit', width: 120 },
    { title: '保税价（报价单位）', dataIndex: 'bondedPricePriceUnit', width: 120 },
    { title: '价格（非M²）单位', dataIndex: 'priceUnitNonM2', width: 120 },
    { title: '本次降价比例', dataIndex: 'proportionOfPriceReduction', width: 120 },
    { title: '报价类型', dataIndex: 'quotationType', width: 120 },
    { title: '生效日期', dataIndex: 'effectiveDate', width: 120 },
    { title: '失效日期', dataIndex: 'expirationDate', width: 120 },
    { title: '报价时间', dataIndex: 'quotationTime', width: 120 },
    { title: 'Supplier To Customer Price', dataIndex: 'supplierToCustomerPrice', width: 120 },
    { title: 'Gap1', dataIndex: 'gap1', width: 120 },
    { title: 'Supplier To Competitor Price', dataIndex: 'supplierToCompetitorPrice', width: 120 },
    { title: 'Gap2', dataIndex: 'gap2', width: 120 },
    { title: '原产地', dataIndex: 'originLocation', width: 120 },
    { title: 'MOQ', dataIndex: 'moq', width: 120 },
    { title: 'Lt', dataIndex: 'lt', width: 120 },
    { title: '备注', dataIndex: 'remark', width: 120 },
  ];
  const state = reactive({
    cacheList: [],
    quotaTypes: [],
    deliveryList: [],
    currencyList: [],
  });
  const { quotaTypes, deliveryList, currencyList } = toRefs(state);
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, {
          ...record,
          cacheList: state.cacheList,
        }),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.id),
        },
        auth: 'btn_remove',
      },
    ];
  }

  async function onDelete(id) {
    const { code, msg } = await deletePurchaseQuotation(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  const [registerTable, { reload, getForm, setSelectedRowKeys, clearSelectedRowKeys, getSelectRowKeys, getFetchParams }] = useTable({
    api: getMaterialPriceList,
    columns,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    tableSetting: {
      redo: false,
    },
    beforeFetch: params => {
      if (params.date) {
        params.effectiveDate = params.date[0];
        params.expirationDate = params.date[1];
        delete params.date;
      }
    },
    afterFetch: data => {
      state.cacheList = data;
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 100,
    },
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: 'insideCode',
          label: '',
          component: 'Input',
          componentProps: {
            // api: getMaterialCodeList,
            placeholder: '材料内部编码',
            // submitOnPressEnter: true,
            // showSearch: true,
            // apiSearch: {
            //   show: true,
            //   // 搜索字段名
            //   searchName: 'keyword',
            // },
            // // memoInputVal: true,
            // resultField: 'data',
            // labelField: 'materialCode',
            // valueField: 'materialCode',
            // filterOption: false,
            // notFoundContent: null,
            // immediate: true,
          },
        },
        {
          field: 'materialTypeFromManufacturer',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '原厂商材料型号',
          },
        },
        {
          field: 'productLineCode',
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
          field: 'status',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: '选择状态',
            options: [
              { fullName: '生效', enCode: '1' },
              { fullName: '失效', enCode: '2' },
            ],
            fieldNames: { value: 'enCode' },
          },
        },
        {
          field: 'applyUser',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '创建人',
          },
        },
        {
          field: 'date',
          label: '',
          component: 'DateRange',
          componentProps: {
            placeholder: ['生效日期', '失效日期'],
          },
        },
      ],
    };
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
      previewColumn: dataConfig,
      apiParams: {
        importSave: {
          // isoperation: hasBtnP('btn_review') ? 1 : 0,
          isoperation: 1,
        },
      },
    });
  }
  const handleExport = async () => {
    const supplement = [
      {
        title: '产品线代码',
        dataIndex: 'productLineCode',
      },
      {
        title: '终端客户',
        dataIndex: 'terminalCustomerName',
      },
      {
        title: '材料内部编码',
        dataIndex: 'insideCode',
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
      },
      {
        title: '长(M)',
        dataIndex: 'materialLength',
      },
      {
        title: '宽(MM)',
        dataIndex: 'materialWidth',
      },
      {
        title: '面积',
        dataIndex: 'materialArea',
      },
      {
        title: '采购单位',
        dataIndex: 'purchasingUnit',
      },
      {
        title: '报价单位',
        dataIndex: 'priceUnit',
      },
      {
        title: '物料名称',
        dataIndex: 'materialDescription',
      },
      {
        title: '本位币币别',
        dataIndex: 'baseCurrency',
      },
      {
        title: '原币币别',
        dataIndex: 'originalCurrency',
      },
      {
        title: '价格类型',
        dataIndex: 'priceType',
      },
      {
        title: '基准币别',
        dataIndex: 'benchmarkCurrency',
      },
      {
        title: '建议采购币别',
        dataIndex: 'suggestedPurchaseCurrency',
      },
      {
        title: '预留buffer(%)',
        dataIndex: 'reservedBuffer',
      },
      {
        title: 'Gap',
        dataIndex: 'usdRmbGap',
      },
      {
        title: '报价当月汇率',
        dataIndex: 'exchangeRate',
      },
      {
        title: '关税',
        dataIndex: 'tariff',
      },
      {
        title: '未税到厂价(采购单位)',
        dataIndex: 'priceOc2bcUntaxedPurchasingUnit',
      },
      {
        title: '未税到厂价(报价单位)',
        dataIndex: 'priceOc2bcUntaxedPriceUnit',
      },
      {
        title: '一般贸易价(采购单位)',
        dataIndex: 'generalTradePricePurchasingUnit',
      },
      {
        title: '一般贸易价(报价单位)',
        dataIndex: 'generalTradePricePriceUnit',
      },
      {
        title: '保税价(采购单位)',
        dataIndex: 'bondedPricePurchasingUnit',
      },
      {
        title: '保税价(报价单位)',
        dataIndex: 'bondedPricePriceUnit',
      },
    ];
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
      },
      api: exportPurchaseQuotationList,
      exportOptions: [...exportColumns, ...supplement],
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  };

  const handleSingleApply = () => {
    // console.log('单个申请');
    openApplyPop(true, {});
  };
  async function handleDel() {
    const selectedRowKeys = getSelectRowKeys();
    console.log(selectedRowKeys);
    if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: async () => {
        try {
          const { msg, code } = await deletePurchaseQuotationList(selectedRowKeys);
          if (code === 200) {
            setSelectedRowKeys([]);
            message.success(msg);
            reload();
          }
        } catch (e) {
          setSelectedRowKeys([]);
          reload();
        }
      },
    });
  }

  function handleEdit(record) {
    openDetailPopup(true, record);
  }
  async function getTypeOptions() {
    state.quotaTypes = await baseStore.getDictionaryData('PurchaseQuotation.QuotationType');
    state.deliveryList = await baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms');
    const { code, data } = await getCurrencyList({ keyword: '' });
    state.currencyList = data;
  }

  onMounted(() => {
    getTypeOptions();
  });
</script>
<style scoped lang="less">
  :deep(.ant-table-expanded-row .ant-card-body) {
    padding: 0;
  }

  :deep(.icon-ym) {
    font-size: 18px;
  }
</style>
