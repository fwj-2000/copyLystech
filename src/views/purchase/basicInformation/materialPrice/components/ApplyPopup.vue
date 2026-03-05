<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :cancelButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('dict.PurchaseQuotationColumn')"
    class="full-popup stop-0">
    <template #insertToolbar v-if="showSubmit">
      <UploadBtn type="default" ref="uploadRef" @success="afterUpload"> </UploadBtn>
      <a-divider type="vertical" style="margin: 12px" />
    </template>
    <template #centerToolbar v-if="showSubmit">
      <template v-if="!hideSubmit">
        <a-button @click="handleSaveAction('save')" class="mr-12px" v-auth="'btn_detail'" ghost type="primary">
          {{ t('common.temporarySave') }}
        </a-button>
        <a-button @click="handleSaveAction('commit')" v-auth="'btn_detail'" type="primary">{{ t('common.submitText') }} </a-button>
      </template>
      <template v-else>
        <a-button @click="handleSaveAction('save', true)" v-auth="'btn_detail'" type="primary">{{ t('common.saveText') }} </a-button>
      </template>
    </template>
    <template #appendToolbar v-auth="'btn_review'" v-if="showReject || showReview">
      <div class="toggle-current">
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
        <div class="state-box">
          <span>{{ index + 1 }}</span>
          / {{ cacheList.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
      </div>
    </template>
    <div class="table-wrapper">
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :actions="getTableActions(rowIndex, row)" />
        </template>
        <template #expandedRowRender="{ row: record }">
          <a-form layout="vertical" :disabled="mode !== 'edit'" @click="handleClickForm">
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px expand-card">
              <Subtitle :title="t('common.baseinfo')" />
              <a-row :gutter="16">
                <a-col :span="3">
                  <!-- 报价类型 -->
                  <a-form-item :label="t('dict.PurchaseQuotation.QuotationType')" required>
                    <ApiSelect
                      :api="() => baseStore.getDictionaryData('PurchaseQuotation.QuotationType', true)"
                      v-model:value="record.quotationType"
                      label-field="fullName"
                      value-field="enCode"
                      allow-clear
                      :filter-option="false"
                      :not-founded-content="t('common.noData')"
                      :immediate="true" />
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="3">
                  <a-form-item required :label="t('dict.PurchaseQuotationColumn.mainProcess')">
                    <ApiSelect
                      :api="() => baseStore.getDictionaryData('MainProcess')"
                      v-model:value="record.mainProcess"
                      show-search
                      label-field="fullName"
                      value-field="enCode"
                      :filter-option="false"
                      :immediate="true" />
                  </a-form-item>
                </a-col> -->
                <a-col :span="3">
                  <a-form-item required :label="t('dict.PurchaseQuotationColumn.terminalCustomerName')">
                    <!--                    <a-input v-model:value="record.insideCode" placeholder="请输入申请单号" />-->
                    <ApiSelect
                      :api="getBaseDataTerminalCustomerList"
                      v-model:value="record.terminalCustomerCode"
                      show-search
                      :disabled="
                        source == 'askPrice' ||
                        record.materialAreaEnCode == 'AuxiliaryMaterials' ||
                        record.materialAreaEnCode == 'PackagingMaterials' ||
                        mode == 'view'
                      "
                      :params="{
                        mainProcess: record.mainProcess,
                      }"
                      :api-search="{
                        show: true,
                        searchName: 'keyword',
                      }"
                      :name-format="['terminalCustomerName', '(', 'terminalCustomerCode', ')']"
                      label-field="fullName"
                      value-field="terminalCustomerCode"
                      resultField="data"
                      :not-founded-content="null"
                      :filter-option="false"
                      :immediate="true" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item required :label="t('dict.ProductLineColumn')">
                    <!--                    <a-input v-model:value="record.productLineCode" placeholder="请输入申请单号" />-->
                    <ApiSelect
                      :api="getProductLineList"
                      v-model:value="record.productLineCode"
                      label-field="Name"
                      value-field="Code"
                      :disabled="
                        source == 'askPrice' ||
                        record.materialAreaEnCode == 'AuxiliaryMaterials' ||
                        record.materialAreaEnCode == 'PackagingMaterials' ||
                        mode == 'view'
                      "
                      :filter-option="false"
                      resultField="data"
                      :name-format="['Code', '-', 'Name']"
                      :not-founded-content="t('common.noData')"
                      :immediate="true" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <!--采购方式-->
                  <a-form-item required :label="t('dict.PurchaseQuotation.PurchaseWay')">
                    <ApiSelect
                      :api="() => baseStore.getDictionaryData('PurchaseQuotation.PurchaseWay', true)"
                      v-model:value="record.purchasingWay"
                      label-field="fullName"
                      value-field="enCode"
                      :showSearch="true"
                      :filter-option="(input: string, option: any) => option.label.toLowerCase().includes(input.toLowerCase())"
                      :not-founded-content="t('common.noData')"
                      :immediate="true" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <!--采购单位-->
                  <a-form-item required :label="t('dict.PriceInquiryColumn.purchasingUnit')">
                    <!--                    <a-input v-model:value="record.insideCode" placeholder="请输入申请单号" />-->
                    <ApiSelect
                      :api="getUnitListByKeyword"
                      v-model:value="record.purchasingUnit"
                      label-field="Name"
                      value-field="Code"
                      :filter-option="false"
                      resultField="data"
                      :showSearch="true"
                      :apiSearch="{
                        show: true,
                        searchName: 'keyword',
                      }"
                      @change="buildViewData(record)"
                      :name-format="['Code', '-', 'Name']"
                      :not-founded-content="t('common.noData')"
                      :immediate="true" />
                  </a-form-item>
                </a-col>
                <a-col :span="2">
                  <a-form-item :label="t('dict.PCCColumn.width')">
                    <InputNumber v-model:value="record.materialWidth" @change="buildViewData(record)" />
                  </a-form-item>
                </a-col>
                <a-col :span="2">
                  <a-form-item :label="t('dict.QuantitativePlanColumn.Length')">
                    <InputNumber v-model:value="record.materialLength" @change="buildViewData(record)" />
                  </a-form-item>
                </a-col>
                <a-col :span="2">
                  <a-form-item :label="t('dict.QuantitativePlanColumn.Thickness')">
                    <a-input v-model:value="record.materialThickness" />
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item>
                    <template #label>
                      {{ t('dict.SampleApplyColumn.applyArea') }}
                      <BasicHelp :text="t('dict.PurchaseQuotationColumn.AreaTip')" />
                    </template>
                    <a-input disabled v-model:value="record.materialArea" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px expand-card">
              <a-space>
                <Subtitle :title="t('dict.PurchaseQuotationColumn.SupplierQuotation')" />
                <!--        供应商报价        -->
                <div class="currency-checkbox">
                  <!--									<div>{{ t('dict.Module.Currency') }} {{ t('component.lydc.iconPicker.select') }}:</div>-->
                  <!--                  <a-checkbox-group v-model:value="record.currencyCheckbox">-->
                  <!-- 币别选择 -->
                  <a-checkbox
                    v-model:checked="record.baseCurrencyChecked"
                    @change="
                      e => {
                        if (!record.originalCurrencyChecked && !e.target.checked) {
                          getExchangeRate(record.baseCurrency, record.originalCurrency, record);
                          record.suggestedPurchaseCurrency = record.originalCurrency;
                          record.originalCurrencyChecked = true;
                          buildViewData(record);
                          return createMessage.warning(t('dict.PurchaseQuotationColumn.baseCurrencyCheckedWarning'));
                        }
                        if (e.target.checked) {
                          record.suggestedPurchaseCurrency = record.baseCurrency;
                        } else {
                          getExchangeRate(record.baseCurrency, record.originalCurrency, record);
                          record.suggestedPurchaseCurrency = record.originalCurrency;
                        }

                        buildViewData(record);
                      }
                    "
                    >{{ t('dict.PurchaseQuotationColumn.baseCurrency') }}:
                  </a-checkbox>
                  <ApiSelect
                    disabled
                    class="min-w-160px mr-15px"
                    :placeholder="t('dict.MouldRoomColumn.BaseCurrencyType')"
                    :api="getCurrencyList"
                    default-value="CNY"
                    v-model:value="record.baseCurrency"
                    label-field="ShortName"
                    value-field="ISOCode"
                    :filter-option="false"
                    resultField="data"
                    :after-fetch="
                      ({ data }) => {
                        console.log(data, 'datadatadatadatadata');
                        console.log(record.baseCurrency, 'record.baseCurrencyrecord.baseCurrency');
                        const target = data.find(item => item.ISOCode === record.baseCurrency);
                        record.baseCurrencyName = target?.ShortName || target?.label;
                      }
                    "
                    :not-founded-content="t('common.noData')"
                    :immediate="true" />
                  <a-checkbox v-model:checked="record.originalCurrencyChecked" @change="handleOriginalCurrencyChecked($event, record)"
                    >{{ t('dict.PurchaseQuotationColumn.originalCurrency') }}:
                  </a-checkbox>
                  <ApiSelect
                    :disabled="!record.originalCurrencyChecked || mode == 'view'"
                    class="min-w-160px"
                    :placeholder="t('dict.MouldRoomColumn.OriginalCurrencyType')"
                    default-value="USD"
                    :api="getCurrencyList"
                    v-model:value="record.originalCurrency"
                    label-field="ShortName"
                    value-field="ISOCode"
                    :filter-option="false"
                    resultField="data"
                    @change="
                      (e, data) => {
                        if (isNullOrUnDef(e)) return;
                        record.suggestedPurchaseCurrency = e;
                        getExchangeRate('CNY', e, record);
                        buildViewData(record);
                        record.originalCurrencyName = data.label || data.ShortName;
                      }
                    "
                    :not-founded-content="t('common.noData')"
                    :after-fetch="
                      ({ data }) => {
                        const target = data.find(item => item.ISOCode === record.originalCurrency);
                        console.log(target);
                        record.originalCurrencyName = target?.ShortName || target?.label;
                        if (data.length > 0) {
                          data = data.map(item => ({ ...item, disabled: item.ISOCode === record.baseCurrency }));
                        }
                        return data;
                      }
                    "
                    :immediate="true" />
                  <!--                  </a-checkbox-group>-->
                </div>
              </a-space>
              <a-row :gutter="16">
                <a-col :span="8">
                  <b>{{ t('dict.PurchaseQuotationColumn.baseCurrency') }}: {{ record.baseCurrencyName }}</b>
                  <a-row :gutter="8">
                    <a-col :span="12">
                      <!-- 人民币税别 -->
                      <a-form-item :label="t('dict.SampleApplyColumn.TaxType')">
                        <!--                        <a-input default-value="未税" disabled v-model:value="record.insideCode" placeholder="税别" />-->
                        <a-select disabled :placeholder="t('dict.SampleApplyColumn.TaxType')" v-model:value="record.priceType">
                          <a-select-option :value="1">{{ t('dict.PurchaseQuotation.PriceType.1') }}</a-select-option>
                          <a-select-option :value="2">{{ t('dict.PurchaseQuotation.PriceType.2') }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item :label="t('dict.SampleApplyColumn.UnitPrice')" required>
                        <!--	         单位单价             -->
                        <InputNumber
                          :disabled="!record.baseCurrencyChecked || mode == 'view'"
                          v-model:value="record.supplierUnitPriceBaseCurrency"
                          @change="buildViewData(record)"
                          :placeholder="t('dict.SampleApplyColumn.UnitPrice')" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item :label="t('dict.PurchaseQuotation.DeliveryTerms')" required>
                        <!-- 交货条件 -->
                        <ApiSelect
                          :disabled="!record.baseCurrencyChecked || mode == 'view'"
                          :api="() => baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms', true)"
                          v-model:value="record.deliveryTerms"
                          label-field="fullName"
                          value-field="enCode"
                          :showSearch="true"
                          :filter-option="(value: string, option: { label: string }) => option.label.includes(value)"
                          :not-founded-content="t('common.noData')"
                          :immediate="true" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <!--	         运费           -->
                      <a-form-item :label="t('dict.PurchaseQuotationColumn.FreightCost')" required>
                        <InputNumber
                          :disabled="!record.baseCurrencyChecked || mode == 'view'"
                          v-model:value="record.freightBaseCurrency"
                          @change="buildViewData(record)"
                          :placeholder="t('dict.PurchaseQuotationColumn.FreightCost')" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="8">
                  <b>{{ t('dict.PurchaseQuotationColumn.originalCurrency') }}: {{ record.originalCurrencyName }}</b>
                  <a-row :gutter="8">
                    <a-col :span="6">
                      <!-- 美元税别 -->
                      <a-form-item :label="t('dict.SampleApplyColumn.TaxType')">
                        <a-select disabled :placeholder="t('dict.PurchaseQuotation.PriceType.2')" v-model:value="record.priceTypeOriginalCurrency">
                          <a-select-option :value="1">{{ t('dict.PurchaseQuotation.PriceType.1') }}</a-select-option>
                          <a-select-option :value="0">{{ t('dict.PurchaseQuotation.PriceType.2') }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="t('dict.SampleApplyColumn.UnitPrice')" required>
                        <InputNumber
                          :disabled="!record.originalCurrencyChecked || mode == 'view'"
                          v-model:value="record.supplierUnitPriceOriginalCurrency"
                          @change="buildViewData(record)"
                          :placeholder="t('dict.SampleApplyColumn.UnitPrice')" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="t('dict.PurchaseQuotation.DeliveryTerms')" required>
                        <!--                        <a-input v-model:value="record.insideCode" placeholder="交货条件" />-->
                        <ApiSelect
                          :disabled="!record.originalCurrencyChecked || mode == 'view'"
                          :api="() => baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms')"
                          v-model:value="record.deliveryTermsOriginalCurrency"
                          label-field="fullName"
                          value-field="enCode"
                          :showSearch="true"
                          :filter-option="(value: string, option: { label: string }) => option.label.includes(value)"
                          @change="buildViewData(record)"
                          :not-founded-content="t('common.noData')"
                          :immediate="true" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="t('dict.PurchaseQuotationColumn.FreightCost')" required>
                        <InputNumber
                          :disabled="!record.originalCurrencyChecked || mode == 'view'"
                          v-model:value="record.freightOriginalCurrency"
                          @change="buildViewData(record)"
                          :placeholder="t('dict.PurchaseQuotationColumn.FreightCost')" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item class="label-width-full" required>
                        <template #label>
                          <span>{{ t('dict.PurchaseQuotationColumn.exchangeRate') }}</span>
                          <i
                            v-if="showSubmit"
                            class="icon-ym icon-ym-btn-edit ml-auto cursor-pointer"
                            style="color: #ff7b00"
                            @click="() => handleExchangeRateEdit(record, true)" />
                        </template>
                        <InputNumber
                          :ref="el => (record.exchangeRateInputRef = el)"
                          :disabled="!record.exchangeRateEditabled"
                          v-model:value="record.exchangeRate"
                          :placeholder="t('dict.PurchaseQuotationColumn.exchangeRate')"
                          :min="0"
                          @change="buildViewData(record)"
                          @blur="() => handleExchangeRateEdit(record, false)" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="t('dict.PurchaseQuotationColumn.tariff')" required>
                        <InputNumber
                          :disabled="!record.originalCurrencyChecked || mode == 'view'"
                          v-model:value="record.tariff"
                          @change="buildViewData(record)"
                          :placeholder="t('dict.PurchaseQuotationColumn.tariff')" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <!--											<a-form-item :label="`${t('dict.SampleApplyColumn.USDtoRMBFactoryPrice')}(${t('dict.SampleApplyColumn.UnitPrice')})`">-->
                      <a-form-item
                        :label="`${t('dict.PurchaseQuotationColumn.exchangeRateParams', [record.originalCurrencyName, record.baseCurrencyName])}(${t(
                          'dict.SampleApplyColumn.UnitPrice',
                        )})`">
                        <a-input
                          disabled
                          v-model:value="record.priceOc2bcUntaxedPriceUnit"
                          :placeholder="`${t('dict.SampleApplyColumn.USDtoRMBFactoryPrice')}(${t('dict.SampleApplyColumn.UnitPrice')})`" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="8">
                  <!--									<b>{{ t('dict.MouldRoomColumn.RMB') }}|{{ t('dict.SampleApplyColumn.USD') }}</b>-->
                  <b>{{ record.baseCurrencyName }}|{{ record.originalCurrencyName }}</b>
                  <a-row :gutter="8">
                    <a-col :span="12">
                      <a-form-item :label="`${record.originalCurrencyName} VS ${record.baseCurrencyName}Gap(%)`">
                        <a-input
                          disabled
                          v-model:value="record.usdRmbGap"
                          :placeholder="`${t('dict.SampleApplyColumn.USD')} VS ${t('dict.MouldRoomColumn.RMB')}Gap(%)`" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item required :label="t('dict.PurchaseQuotationColumn.benchmarkCurrency')">
                        <ApiSelect
                          :placeholder="t('dict.PurchaseQuotationColumn.benchmarkCurrency')"
                          :api="getCurrencyList"
                          v-model:value="record.benchmarkCurrency"
                          label-field="ShortName"
                          :disabled="!(record.originalCurrencyChecked && record.baseCurrencyChecked) || mode == 'view'"
                          value-field="ISOCode"
                          :filter-option="false"
                          resultField="data"
                          :not-founded-content="t('common.noData')"
                          :immediate="true" />
                      </a-form-item>
                    </a-col>

                    <!--	                  建议采购币别-->
                    <a-col :span="12">
                      <a-form-item required :label="t('dict.PurchaseQuotationColumn.suggestedPurchaseCurrency')">
                        <!--                        <a-input v-model:value="record.insideCode" placeholder="系统计算" />-->
                        <ApiSelect
                          :api="getCurrencyList"
                          v-model:value="record.suggestedPurchaseCurrency"
                          :placeholder="t('dict.PurchaseQuotationColumn.suggestedPurchaseCurrency')"
                          :disabled="!(record.originalCurrencyChecked && record.baseCurrencyChecked) || mode == 'view'"
                          label-field="ShortName"
                          value-field="ISOCode"
                          :filter-option="false"
                          resultField="data"
                          @change="buildViewData(record)"
                          :not-founded-content="t('common.noData')"
                          :immediate="true" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px expand-card">
              <Subtitle :title="t('dict.PurchaseQuotationColumn.ReportCostCenterPriceinRMB')" />
              <a-row :gutter="16">
                <a-col :span="4">
                  <!-- 预留buffer -->
                  <a-form-item :label="t('dict.PurchaseQuotationColumn.reservedBuffer')" required>
                    <InputNumber
                      v-model:value="record.reservedBuffer"
                      :rate="true"
                      :step="0.00000001"
                      :precision="8"
                      :min="-100"
                      :max="Infinity"
                      @change="buildViewData(record)"
                      :placeholder="t('dict.PurchaseQuotationColumn.reservedBuffer')" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <!-- 一般贸易价 -->
                  <a-form-item :label="t('dict.PurchaseQuotationColumn.generalTradePricePriceUnit')">
                    <a-input
                      disabled
                      v-model:value="record.generalTradePricePriceUnit"
                      :placeholder="t('dict.PurchaseQuotationColumn.generalTradePricePriceUnit')" />
                  </a-form-item>
                </a-col>
                <!-- 保税价 -->
                <a-col :span="4">
                  <a-form-item :label="t('dict.PurchaseQuotationColumn.bondedPricePriceUnit')">
                    <a-input disabled v-model:value="record.bondedPricePriceUnit" :placeholder="t('dict.PurchaseQuotationColumn.bondedPricePriceUnit')" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="`${t('dict.PurchaseQuotationColumn.proportionOfPriceReduction')}(%)`">
                    <InputNumber
                      @change="buildViewData(record)"
                      v-model:value="record.proportionOfPriceReduction"
                      :placeholder="t('dict.PurchaseQuotationColumn.proportionOfPriceReduction')" />
                  </a-form-item>
                </a-col>

                <!--								<a-col :span="4">-->
                <!--									<a-form-item :label="t('dict.MouldRoomColumn.BaseCurrencyType')" required>-->
                <!--										<ApiSelect-->
                <!--											disabled-->
                <!--											:placeholder="t('dict.MouldRoomColumn.BaseCurrencyType')"-->
                <!--											:api="getCurrencyList"-->
                <!--											default-value="CNY"-->
                <!--											v-model:value="record.baseCurrency"-->
                <!--											label-field="ShortName"-->
                <!--											value-field="ISOCode"-->
                <!--											:filter-option="false"-->
                <!--											resultField="data"-->
                <!--											:not-founded-content="t('common.noData')"-->
                <!--											:immediate="true" />-->
                <!--									</a-form-item>-->
                <!--								</a-col>-->
                <!--								<a-col :span="4">-->
                <!--									<a-form-item :label="t('dict.MouldRoomColumn.OriginalCurrencyType')" required>-->
                <!--										<ApiSelect-->
                <!--											disabled-->
                <!--											:placeholder="t('dict.MouldRoomColumn.OriginalCurrencyType')"-->
                <!--											default-value="USD"-->
                <!--											:api="getCurrencyList"-->
                <!--											v-model:value="record.originalCurrency"-->
                <!--											label-field="ShortName"-->
                <!--											value-field="ISOCode"-->
                <!--											:filter-option="false"-->
                <!--											resultField="data"-->
                <!--											:not-founded-content="t('common.noData')"-->
                <!--											:immediate="true" />-->
                <!--									</a-form-item>-->
                <!--								</a-col>-->
                <a-col :span="4">
                  <a-form-item :label="`To${t('dict.MouldRoomColumn.EndUserPrice')}`">
                    <Input
                      @change="buildViewData(record)"
                      v-model:value="record.supplierToCustomerPrice"
                      :placeholder="t('dict.MouldRoomColumn.EndUserPrice')" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="`To${t('dict.MouldRoomColumn.EndUser')}Gap(%)`">
                    <InputNumber @change="buildViewData(record)" v-model:value="record.gap1" :placeholder="t('dict.MouldRoomColumn.EndUser')" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="`To${t('dict.PurchaseQuotationColumn.CompetitorPrice')}`">
                    <Input
                      @change="buildViewData(record)"
                      v-model:value="record.supplierToCompetitorPrice"
                      :placeholder="`To${t('dict.PurchaseQuotationColumn.CompetitorPrice')}`" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="`To${t('dict.PurchaseQuotationColumn.Competitor')}Gap(%)`">
                    <InputNumber
                      v-model:value="record.gap2"
                      :placeholder="`To${t('dict.PurchaseQuotationColumn.Competitor')}Gap`"
                      @change="buildViewData(record)" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px expand-card">
              <Subtitle :title="t('dict.MouldRoomColumn.OtherInformation')" />
              <a-row :gutter="16">
                <a-col :span="4">
                  <a-form-item label="MOQ">
                    <a-input-number v-model:value="record.moq" placeholder="MOQ" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="`L/T(${t('component.time.days')})`">
                    <a-input-number v-model:value="record.lt" placeholder="L/T" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    :label="t('dict.PurchaseQuotationColumn.effectiveDate')"
                    :helpMessage="t('dict.PurchaseQuotationColumn.effectiveDateTip')"
                    required>
                    <!--                    <a-input-->
                    <!--                      v-model:value="record.effectiveDate"-->
                    <!--                      placeholder="生效日期"-->
                    <!--                    />-->
                    <!--	                  :disabled="source == 'askPrice' || record?.editValueRefs?.materialAreaEnCode == 'Out' || mode == 'view'"-->
                    <!--         询价数据取消禁用日期 20250724 柳           -->
                    <!--	                  <a-date-picker-->
                    <!--		                  :disabled="source == 'askPrice' || mode == 'view'"-->
                    <!--		                  v-model:value="record.effectiveDate"-->
                    <!--		                  :placeholder="t('dict.PurchaseQuotationColumn.effectiveDate')"-->
                    <!--		                  :disabled-date="-->
                    <!--                        current => {-->
                    <!--                          return current < dateUtil().startOf('day');-->
                    <!--                        }-->
                    <!--                      " />-->
                    <a-date-picker
                      :disabled="mode == 'view'"
                      v-model:value="record.effectiveDate"
                      :placeholder="t('dict.PurchaseQuotationColumn.effectiveDate')"
                      :disabled-date="
                        current => {
                          return current < dateUtil().startOf('day');
                        }
                      " />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item :label="t('dict.PurchaseQuotationColumn.expirationDate')" required>
                    <!--                    <a-input-->
                    <!--                      v-model:value="record.expirationDate"-->
                    <!--                      placeholder="失效日期"-->
                    <!--                    />-->
                    <a-date-picker v-model:value="record.expirationDate" :placeholder="t('dict.PurchaseQuotationColumn.expirationDate')" />
                  </a-form-item>
                </a-col>
                <!--                <a-col :span="4">-->
                <!--                  <a-form-item :label="t('dict.PurchaseQuotationColumn.actualPurchasePrice')">-->
                <!--                    <a-input v-model:value="record.actualPurchasePrice" :placeholder="t('dict.PurchaseQuotationColumn.actualPurchasePrice')" />-->
                <!--                  </a-form-item>-->
                <!--                </a-col>-->
                <a-col :span="4">
                  <a-form-item :label="t('dict.CommonCol.creatorUserName')">
                    <a-input disabled v-model:value="record.applyUserName" :placeholder="t('dict.CommonCol.creatorUserName')" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('dict.CommonCol.remark')">
                    <a-textarea
                      v-model:value="record.remark"
                      :placeholder="t('dict.CommonCol.remark')"
                      :autoSize="{
                        minRows: 1,
                        maxRows: 6,
                      }" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card v-if="record.type === 3" class="lydc-content-wrapper-search-box p-12px mb-16px expand-card">
              <Subtitle :title="t('dict.CommonCol.prjDrawingsName')" />
              <FileList :list="record.halfFinishedPartFiles" @click="handlePreview" />
            </a-card>
          </a-form>
        </template>
      </Grid>
    </div>
    <div class="upload-box">
      <Subtitle :title="t('common.attachment')" class="pl-12px pt-8px pb-none" />
      <Empty v-if="!Array.isArray(customerFileList) || customerFileList.length === 0" :description="t('common.noData')" class="mt-5px" />
      <ScrollContainer v-else style="height: 86px">
        <div class="file-upload-wrapper">
          <a-row :gutter="[16, 10]">
            <a-col :span="8" v-for="(item, index) in customerFileList">
              <div class="item-list">
                <a @click.stop="handlePreview(item)" class="item-file-name ellipsis">{{ item.name }}</a>
                <div>
                  <a-button type="link" @click="handleDownloadImg(item)">
                    <template #icon>
                      <i class="icon-ym icon-ym-btn-download"></i>
                    </template>
                  </a-button>
                  <a-button type="link" @click="handleDeleteImg(index)">
                    <template #icon>
                      <i class="icon-ym icon-ym-delete"></i>
                    </template>
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </ScrollContainer>
    </div>
  </BasicPopup>
  <RejectModal @register="registerRejectModal" @reload="handleRejectClose" />
  <PreviewModal ref="filePreviewRef" />
</template>
<script setup lang="ts">
  import type { VxeGridPropTypes, VxeTablePropTypes } from 'vxe-table';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { nextTick, reactive, ref, toRaw, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { rowData } from './CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { isEmpty } from 'lodash-es';
  import {
    addMaterialPrice,
    getCurrencyList,
    getExchangeRateList,
    getMaterialCodeList,
    getMaterialPriceDetail,
    getOriginCountryList,
    getProductLineList,
    getUnitListByKeyword,
    updateMaterialPrice,
  } from '/@/api/finance/materialPrice';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  import { getHalfFinishedPartFile } from '/@/api/engineering/quotatios';
  import { uploadInstallFile, getMaterialQueryByMaterialCode } from '/@/api/engineering/pcc';
  import { dateUtil } from '/@/utils/dateUtil';
  import { downloadByUrl } from '/@/utils/file/download';
  import { buildArea } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildArea';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import { getMaterialList } from '/@/api/purchase/materialBase';
  import { useAskPriceStore } from '/@/store/modules/askPrice';
  import InputNumber from '/@/components/Lydc/InputNumber/src/InputNumber.vue';
  import { buildCurrencyPrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildCurrencyPrice';
  import { buildPriceOc2bcUntaxedPurchasingUnit } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildPriceOc2bcUntaxedPurchasingUnit';
  import { buildPriceOc2bcUntaxedPriceUnit } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildPriceOc2bcUntaxedPriceUnit';
  import { buildGap } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildGap';
  import { useBuildGeneralTradePrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/useBuildGeneralTradePrice';
  import { useBuildBondedPrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/useBuildBondedPrice';
  import { getSupplierList } from '/@/api/equipment/information';
  import { commitPurchasequotation, getMaterialBatchSearch, rejectPriceInquiry } from '/@/api/engineering/ecn';
  import { message, Input } from 'ant-design-vue';
  import { RejectModal } from '/@/components/CustomComponents';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGlobSetting } from '/@/hooks/setting';
  import { isNullOrUnDef } from '/@/utils/is';
  import { FileCell, PreviewModal, UploadBtn } from '/@/components/Upload';
  import FileList from './fileList.vue';
  import { getBatchSemiFinishedProductsByCode } from '/@/api/engineering/semifinishedproducts';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import Empty from '/@/components/Lydc/Empty/src/Empty.vue';

  defineOptions({
    name: 'ApplyPopup',
  });

  const { hasBtnP } = usePermission();
  const emit = defineEmits(['register', 'reload']);

  const baseStore = useBaseStore();

  const globSetting = useGlobSetting();
  const filePreviewRef = ref<any | null>(null);
  const uploadRef = ref();

  const { createMessage } = useMessage();

  const state = reactive<any>({
    customerFileList: [],
    cacheList: [],
    index: 0,
    mode: '',
    detailData: {},
    showReject: false,
    showReview: false,
    showSubmit: false,
    hideSubmit: false,
    source: '',
    baseCurrencyName: '',
    originalCurrencyName: '',
  });
  const askPriceStore = useAskPriceStore();
  const { t } = useI18n();

  const { customerFileList, source, mode, cacheList, index, showReject, showReview, showSubmit, hideSubmit } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  async function initData(data) {
    console.log(data, 'datadatadatadatadata');
    state.mode = data.mode;
    state.showSubmit = data.showSubmit;
    state.hideSubmit = data.hideSubmit;
    state.showReject = data.showReject;
    state.showReview = data.showReview;
    state.cacheList = data.cacheList;
    state.index = data.index;

    state.customerFileList = [];

    const { cacheList, source, index } = data;
    console.log('🚀 ~ initData ~ cacheList:', cacheList);
    state.detailData = {};
    if (source === 'askPrice') {
      const expandId = [];
      state.source = 'askPrice';
      // const materialCodes = cacheList.filter(item => item.type == 1).map(item => item.materialCode);
      // 区分出对应的`材料编码`和`半成品编码`，用于获取对应详情
      const { materialCodes, semifinishedproductCodes } = cacheList.reduce(
        (acc: { materialCodes: Array<string>; semifinishedproductCodes: Array<string> }, cur: any) => {
          if (cur.type == 1) {
            acc.materialCodes.push(cur.materialCode);
          } else if (cur.type == 3) {
            acc.semifinishedproductCodes.push(cur.materialCode);
          }
          return acc;
        },
        { materialCodes: [], semifinishedproductCodes: [] },
      );

      console.log(materialCodes, 'materialCodesmaterialCodesmaterialCodesmaterialCodes');
      let infoList: Array<any> = [];
      // if (materialCodes.length <= 0) {
      //   infoList = [];
      // } else {
      //   const { data } = await getMaterialBatchSearch({ materialCodes });
      //   infoList = data;
      // }
      const taskList: Array<Promise<any>> = [
        materialCodes.length > 0 ? getMaterialBatchSearch({ materialCodes }) : Promise.resolve({}),
        semifinishedproductCodes.length > 0 ? getBatchSemiFinishedProductsByCode(semifinishedproductCodes) : Promise.resolve({}),
      ];

      await Promise.all(taskList).then(res => {
        const [materialInfo, semiFinishedProductsInfo] = res;
        infoList = [
          // 材料处理
          ...(Array.isArray(materialInfo?.data) ? materialInfo.data : []),
          // 半成品处理
          ...(Array.isArray(semiFinishedProductsInfo?.data) ? semiFinishedProductsInfo.data : []).map((item: any) => {
            return {
              ...item,
              materialDesc: item.semiFinishedProductsDesc,
              materialCode: item.semiFinishedProductsPartNumber,
            };
          }),
        ];
      });

      const list = cacheList.map(async (item, index) => {
        console.log(item);
        if (index == 0) {
          expandId.push(item.id);
        }
        let target;
        if (infoList.length > 0) target = infoList.find(value => value.materialCode == item.materialCode);

        await fetchHalfFinishedPartFile(item);

        if (target) {
          // 询价进来的
          return {
            ...item,
            ...target,
            insideCode: item.type == 1 || item.type == 3 ? item.materialCode : item.insidePartNumber,
            materialName: target.materialDesc,
            materialThickness: target.materialThickness || target.totalThickness,
            materialTypeFromManufacturer: target.materialNo || target.originalModelNumber,
            uuid: item.id,
            priceInquiryId: item.id,
            effectiveDate: dateUtil(item.effectiveDate),
            expirationDate: '',
            priceType: 2,
            baseCurrency: 'CNY',
            originalCurrency: 'USD',
            suggestedPurchaseCurrency: 'CNY',
            baseCurrencyChecked: true,
            exchangeRate: await getExchangeRate(item.baseCurrency || target.baseCurrency, item.originalCurrency || target.originalCurrency, item, false),
            onEdit: true,
            editable: true,
            disabled: {
              insideCode: true,
              materialType: true,
              materialTypeFromManufacturer: true,
              materialDesc: true,
              supplierShortName: false,
              materialAreaId: item.type == 3,
            },
          };
        }

        return {
          ...item,
          insideCode: item.type == 1 || item.type == 3 ? item.materialCode : item.insidePartNumber,
          materialName: item.materialDesc || item.materialDescription,
          materialTypeFromManufacturer: item.materialNo || item.originalModelNumber || item.materialTypeFromManufacturer,
          uuid: item.id,
          priceInquiryId: item.id,
          reservedBuffer: (item.reservedBuffer * 100).toFixed(8),
          tariff: (item.tariff * 100).toFixed(2),
          usdRmbGap: item.usdRmbGap ? (item.usdRmbGap * 100).toFixed(2) : null,
          proportionOfPriceReduction: (item.proportionOfPriceReduction * 100).toFixed(2),
          effectiveDate: dateUtil(item.effectiveDate),
          expirationDate: '',
          priceType: 2,
          baseCurrency: 'CNY',
          originalCurrency: 'USD',
          suggestedPurchaseCurrency: 'CNY',
          supplierShortName: item.supplierShortName || '',
          exchangeRate: await getExchangeRate(item.baseCurrency || 'CNY', item.originalCurrency || 'USD', item, false),
          baseCurrencyChecked: true,
          onEdit: true,
          editable: true,
          disabled: {
            insideCode: true,
            materialType: true,
            materialTypeFromManufacturer: true,
            materialDesc: true,
            supplierShortName: false,
            materialAreaId: item.type == 3,
          },
        };
      });
      console.log(list, 'listlistlistlist');
      Promise.all(list).then(data => {
        setTableData(data);
        nextTick(() => {
          expandRows(expandId);
        });
      });

      return;
    }

    // 编辑
    if (!isEmpty(toRaw(data.cacheList))) {
      // state.mode = 'edit';
      changeLoading(true);
      console.log(cacheList[index], 'cacheList[index]cacheList[index]');
      // if (cacheList[index]?.priceInquiryOriginType == 2 && cacheList[index]?.priceInquiryType == 2) {
      //   state.source = 'askPrice';
      // } else {
      //   state.source = '';
      // }
      console.log(state.source, 'state.source');
      getMaterialPriceDetail(cacheList[index])
        .then(async ({ code, data: ret }) => {
          if (code === 200) {
            state.detailData = ret;
            let { fileList, material } = ret;
            // material里面的originType  1：工程报价  2：新建报价  3：新材料，来自于工程报价的时候，state.source = 'askPrice'
            const isFromAskPrice = +material?.originType === 1;
            state.source = isFromAskPrice ? 'askPrice' : '';
            if (material.originalCurrencyChecked) {
              console.log('🚀 ~ .then ~ material.originalCurrencyChecked:', material.originalCurrencyChecked);
              material.exchangeRate = await getExchangeRate(material.originalCurrency, material.baseCurrency, material, false);
            }
            await fetchHalfFinishedPartFile(material);
            console.log('🚀 ~  ~ material: ', material, fileList);
            state.customerFileList = fileList.map(item => ({
              ...item,
              name: item.fileName,
              flagPath: item.filePath,
            }));
            // const targetId = cacheList[index].id;
            // const list = materialList
            //   .filter(item => item.id === targetId)
            //   .map((item, index) => {
            //     return {
            //       ...item,
            //       uuid: item.id,
            //       effectiveDate: dateUtil(item.effectiveDate),
            //       expirationDate: dateUtil(item.expirationDate),
            //       onEdit: state.mode === 'edit',
            //       editable: state.mode === 'edit',
            //       disabled: {
            //         insideCode: false,
            //         materialType: true,
            //         materialTypeFromManufacturer: true,
            //         materialDesc: true,
            //         supplierShortName: false,
            //       },
            //     };
            //   });
            console.log(material, 'materialmaterialmaterialmaterial');
            if (material.status != 2 || material.status != 3) {
              material.exchangeRate = await getExchangeRate(material.baseCurrency, material.originalCurrency, material, false);
            }
            const list = [
              {
                ...material,
                uuid: material.id,
                materialTypeFromManufacturer: material.materialTypeFromManufacturer || material.originalModelNumber,
                reservedBuffer: (material.reservedBuffer * 100).toFixed(8),
                tariff: (material.tariff * 100).toFixed(2),
                usdRmbGap: material.usdRmbGap ? (material.usdRmbGap * 100).toFixed(2) : null,
                // exchangeRate: await getExchangeRate(material.baseCurrency, material.originalCurrency),
                proportionOfPriceReduction: (material.proportionOfPriceReduction * 100).toFixed(2),
                effectiveDate: dateUtil(material.effectiveDate),
                expirationDate: dateUtil(material.expirationDate),
                supplierShortName: material.supplierShortName || '',
                onEdit: state.mode === 'edit',
                editable: state.mode === 'edit',
                disabled: {
                  // 如果是来自于工程报价(isFromAskPrice)或者是新材料(+material?.originType === 3)，则不能修改内部编码
                  insideCode: isFromAskPrice || +material?.originType === 3,
                  materialType: true,
                  materialTypeFromManufacturer: true,
                  materialDesc: true,
                  supplierShortName: false,
                },
              },
            ];
            setTableData(list);
          }
        })
        .finally(() => {
          changeLoading(false);
          nextTick(() => {
            expandAll();
          });
        });
      return;
    } else if (Array.isArray(data.copyData) && data.copyData.length > 0) {
      // 复制新增功能，数据来源于传入的`data`中的`data.copyData`
      state.mode = 'edit';
      state.source = '';
      const dataList = data.copyData.map((item: any) => {
        return {
          ...rowData,
          disabled: {
            ...rowData.disabled,
            insideCode: false,
          },
          ...item,
          effectiveDate: item.effectiveDate ? dateUtil(item.effectiveDate) : dateUtil(new Date()),
          expirationDate: item.expirationDate ? dateUtil(item.expirationDate) : null,
          quotationType: item.quotationType ? +item.quotationType : '',
          priceType: item.priceType ? +item.priceType : '',
          deliveryTerms: item.deliveryTerms ? +item.deliveryTerms : '',
          id: '',
          uuid: buildUUID(),
        };
      });
      setTableData(dataList);
      nextTick(() => {
        expandAll();
      });
    } else {
      // 新增报价
      state.source = '';
      setTableData([
        {
          ...rowData,
          disabled: {
            ...rowData.disabled,
            insideCode: false,
          },
          uuid: buildUUID(),
          baseCurrency: 'CNY',
          originalCurrency: 'USD',
          suggestedPurchaseCurrency: 'CNY',
          effectiveDate: dateUtil(new Date()),
          baseCurrencyName: t('dict.MouldRoomColumn.RMB'),
          originalCurrencyName: t('dict.SampleApplyColumn.USD'),
        },
      ]);
      nextTick(() => {
        expandAll();
      });
    }
  }

  /** 发送请求获取半成品料号的图纸 */
  async function fetchHalfFinishedPartFile(record: any) {
    record.type = record.type || record.pIQuotationType;
    if (record.type === 3 && record.originId) {
      // 如果是半成品，需要获取图纸
      return getHalfFinishedPartFile(record.originId)
        .then(res => {
          record.halfFinishedPartFiles = (res.data || []).map(item => {
            return {
              ...item,
              fileName: item.fileName,
              filePath: item.filePath || item.fullPath || item.fileUrl,
            };
          });
        })
        .catch(() => {});
    }
    record.halfFinishedPartFiles = [];
  }

  async function init(data) {
    console.log('🚀 ~ init ~ data: ', data);
    state.exchangeRateNow = 0;
    changeLoading(true);
    initData(data).finally(() => {
      changeLoading(false);
    });
  }

  function buildViewData(record) {
    console.log('🚀 ~ buildViewData ~ record: ', record);
    const materialArea = buildArea(record);
    record.priceUnit = record.purchasingUnit;
    const [supplierPriceBaseCurrency, supplierPriceOriginalCurrency] = buildCurrencyPrice(record);
    const priceOc2bcUntaxedPurchasingUnit = buildPriceOc2bcUntaxedPurchasingUnit({
      ...record,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
    });
    const priceOc2bcUntaxedPriceUnit = buildPriceOc2bcUntaxedPriceUnit({
      ...record,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
    });
    const gap = buildGap({
      ...record,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    const [generalTradePricePurchasingUnit, generalTradePricePriceUnit] = useBuildGeneralTradePrice({
      ...record,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    const [bondedPricePurchasingUnit, bondedPricePriceUnit] = useBuildBondedPrice({
      ...record,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    Object.assign(record, {
      materialArea,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
      generalTradePricePurchasingUnit,
      generalTradePricePriceUnit,
      bondedPricePurchasingUnit,
      bondedPricePriceUnit,
      usdRmbGap: Number.isNaN(gap) ? '' : gap,
    });

    // shouldClearForm(record);
  }

  function shouldClearForm(record) {
    // baseCurrencyChecked 本位币 前
    // originalCurrencyChecked 原币 后
    if (record.baseCurrencyChecked && record.originalCurrencyChecked) {
      return;
    }
    if (!record.baseCurrencyChecked) {
      clearBaseCurrencyForm(record);
    }
    if (!record.originalCurrencyChecked) {
      clearOriginalCurrencyForm(record);
    }
  }

  /** 表格 - 表格规则 */
  const editRules: VxeTablePropTypes.EditRules = {
    insideCode: [{ required: true, message: t('common.required') }],
    materialAreaId: [{ required: true, message: t('common.required') }],
  };
  // 材料
  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'purchase-basicInformation-materialPrice-edit-list',
      columns: getColumns(),
      height: 'auto',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        beforeEditMethod: allowToChange,
      },
      editRules,
      rowConfig: {
        keyField: 'uuid',
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: ({ currentAreas }) => {
          return currentAreas.every(item => {
            return item.cols.every(col => {
              item.rows.every(row => {
                return allowToChange({ column: col, row });
              });
            });
          });
        },
        afterPasteMethod: handleAfterPaster,
      },
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
      },
      pagerConfig: {
        enabled: false,
      },
      expandConfig: {
        padding: true,
      },
    },
  });

  function allowToChange({ column, row }) {
    if (
      // 不是可编辑单元格，禁止编辑、粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
      !column.editRender ||
      column.editRender.enabled === false ||
      column.editRender.props?.disabled === true ||
      column.editRender.props?.dynamicDisabled?.(row) === true
    ) {
      return false;
    }
    return true;
  }

  function handleClickForm() {
    gridApi.grid.clearCellAreas();
  }

  /** 设置表格数据 */
  function setTableData(data: Array<any>) {
    gridApi.reloadData(data);
  }

  /** 展开全部行 */
  function expandAll() {
    gridApi.grid.setAllRowExpand(true);
  }

  /** 根据`rowConfig.keyField`展开指定行 */
  function expandRows(rowIds: Array<string>) {
    if (!Array.isArray(rowIds) || rowIds.length === 0) {
      return false;
    }
    const rows = rowIds.map(id => gridApi.grid.getRowById(id)).filter(Boolean);
    rows.length > 0 && gridApi.grid.setRowExpand(rows, true);
  }

  /** 获取表格数据 */
  function getDataSource() {
    return gridApi.getDataSource();
  }

  /** 在指定位置插入数据 */
  function insertTableDataRecord(rows: object | Array<any>, index = -1) {
    const data = gridApi.getDataSource();
    rows = Array.isArray(rows) ? rows : [rows];
    data.splice(index, 0, ...rows);
    gridApi.reloadData(data);
  }

  /** 删除表格数据 */
  function deleteTableDataRecord(rowId: string) {
    const row = gridApi.getDataSource().find(item => item.uuid === rowId);
    row && gridApi.remove(row);
  }

  /** 处理黏贴数据 */
  function handleAfterPaster({ targetAreas, pasteCells, $grid }) {
    // 复制黏贴处理
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }

    // `物料料号`复制黏贴处理
    hanldeInsideCodePaster(cols, rows);

    // `物料归属`复制黏贴处理
    hanldeMaterialAreaPaster(cols, rows);

    // `供应商`复制黏贴处理
    hanldeSupplierPaster(cols, rows);

    // `原产国`复制黏贴处理
    hanldeOriginCountryPaster(cols, rows);
  }

  /**
   * 处理黏贴的物料料号数据
   * @param cols 表格列配置
   * @param rows 表格数据行
   */
  function hanldeInsideCodePaster(cols: Array<{ field: string; editRender: { props: { onChange: Function } } }>, rows: Array<{ insideCode: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insideCode');
    if (targetIndex == -1) return false;

    getMaterialQueryByMaterialCode([...new Set(rows.map(item => item.insideCode))]).then(res => {
      const dataList: Array<any> = Array.isArray(res?.data) ? res.data : [];
      const onChange = cols[targetIndex]?.editRender?.props?.onChange;
      rows.forEach(row => {
        const data = dataList.find(value => value.materialCode === row.insideCode);
        if (data && typeof onChange === 'function') {
          onChange(row.insideCode, data, { row });
        }
      });
    });
  }

  const materialAreaList: Array<any> = [];
  /**
   * 处理黏贴的物料归属数据
   * @param cols 表格列配置
   * @param rows 表格数据行
   */
  async function hanldeMaterialAreaPaster(
    cols: Array<{ field: string; editRender: { props: { onChange: Function } } }>,
    rows: Array<{ materialAreaId: string }>,
  ) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'materialAreaId');
    if (targetIndex == -1) return false;

    // 获取物料归属下拉列表数据
    if (materialAreaList.length === 0) {
      await getMaterialList({}).then(res => {
        materialAreaList.push(...(Array.isArray(res?.data?.list) ? res.data.list : []));
        materialAreaList.forEach(item => {
          item.value = item.id;
          item.label = item.fullName;
        });
      });
    }

    // 匹配物料归属数据
    const onChange = cols[targetIndex]?.editRender?.props?.onChange;
    rows.forEach(row => {
      if (row.materialAreaId && typeof onChange === 'function') {
        const data = materialAreaList.find(
          value => value.materialAreaId === row.materialAreaId || value.enCode === row.materialAreaId || value.fullName === row.materialAreaId,
        );
        if (data) {
          row.materialAreaId = data.id;
          onChange(data.id, data, { row });
        }
      }
    });
  }

  /**
   * 处理黏贴的供应商数据
   * @param cols 表格列配置
   * @param rows 表格数据行
   */
  function hanldeSupplierPaster(cols: Array<{ field: string }>, rows: Array<{ supplierCode: string; supplierShortName?: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'supplierCode');
    if (targetIndex == -1) return false;

    const dataSource = gridApi.getDataSource();

    // 当前表格内，复制黏贴供应商处理
    rows.forEach((row: any) => {
      const targetValue = row.supplierCode;
      const dataItem = dataSource.find(unit => unit.supplierShortName === targetValue && row.uuid !== unit.uuid);
      return Object.assign(
        row,
        dataItem
          ? { supplierCode: dataItem.supplierCode, supplierShortName: dataItem.supplierShortName, supplierId: dataItem.supplierId }
          : { supplierCode: '', supplierShortName: '', supplierId: '' },
      );
    });
  }

  /**
   * 处理黏贴的原产国数据
   * @param cols 表格列配置
   * @param rows 表格数据行
   */
  function hanldeOriginCountryPaster(cols: Array<{ field: string }>, rows: Array<{ originLocation: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'originLocation');
    if (targetIndex == -1) return false;

    const dataSource = gridApi.getDataSource();

    // 当前表格内，复制黏贴原产国处理
    rows.forEach((row: any) => {
      const targetValue = row.originLocation;
      const dataItem = dataSource.find(unit => unit.originLocationName === targetValue && row.uuid !== unit.uuid);
      return Object.assign(
        row,
        dataItem
          ? { originLocation: dataItem.originLocation, originLocationName: dataItem.originLocationName }
          : { originLocation: '', originLocationName: '' },
      );
    });
  }

  function beforeUpload(_, fileList) {
    const waitList = [];
    fileList.forEach(item => {
      if (!state.customerFileList.some(value => value.name === item.name)) {
        const params = {
          file: item,
          filePath: 'PurchaseQuotation',
        };

        state.customerFileList.push(item);
        waitList.push(uploadInstallFile(params));
      }
    });
    Promise.all(waitList).then(list => {
      list.forEach(item => {
        const {
          data: { fileName, filePath },
        } = item;
        state.customerFileList.forEach(item => {
          if (item.name === fileName) {
            item.flagPath = filePath;
            // item.
          }
        });
      });
    });
    return false;
  }

  // 拿到上传后的图片进行处理
  function afterUpload(fileList) {
    const list = fileList.map(item => {
      return {
        flagPath: item.filePath,
        filePath: item.filePath,
        name: item.fileName,
      };
    });
    state.customerFileList.push(...list);
    uploadRef.value?.handleClear();
  }

  function handleDownloadImg(item) {
    const { filePath, fileName } = item;
    window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${filePath}&fileName=${fileName}`);
  }

  function handleDeleteImg(index) {
    // if (state.mode !== 'edit') return
    state.customerFileList.splice(index, 1);
  }

  async function handlePreview(item) {
    if (!item.filePath) {
      item.filePath = item.flagPath;
    }

    const version = item.filePath.includes('http') ? 1 : 2; // 文件附带http的话，是旧版地址
    if (version === 1 && !item.filePath.includes('https')) {
      item.filePath = item.filePath.replace('http', 'https');
    }
    const params = {
      name: item.fileName || item.name,
      filePath: item.filePath,
      // previewType: 'localPreview',
      // noCache: false,
      // isCopy: 0,
      version: version,
    };
    filePreviewRef.value?.init(params);
  }

  function handleOriginalCurrencyChecked(e, record) {
    if (!record.baseCurrencyChecked && !e.target.checked) {
      record.baseCurrencyChecked = true;
      record.suggestedPurchaseCurrency = 'CNY';
      buildViewData(record);
      return createMessage.warning(t('dict.PurchaseQuotationColumn.baseCurrencyCheckedWarning'));
    }

    if (e.target.checked) {
      getExchangeRate(record.baseCurrency, record.originalCurrency, record);
    } else {
      // 取消勾选原币
      record.originalCurrency = 'USD';
      record.suggestedPurchaseCurrency = 'CNY';
    }
    nextTick(() => {
      getExchangeRate(record.baseCurrency, record.originalCurrency, record);
    });
    buildViewData(record);
  }

  async function getExchangeRate(ExchangeCurrency = 'CNY', HoldCurrency = 'USD', record?: Record<string, any>, isInit = true): Promise<number> {
    if (record?.exchangeRate && !isInit) {
      return record.exchangeRate;
    }

    if (HoldCurrency === ExchangeCurrency) {
      if (record) {
        record.exchangeRate = 1;
      }
      return 1;
    }

    const { code, data } = await getExchangeRateList({ HoldCurrency, ExchangeCurrency });

    if (code !== 200 || data.length === 0) {
      createMessage.warning(t('dict.PurchaseQuotationColumn.NoExchangeRateInformationFound'));
      return 1;
    }

    const rate = Number(data[0].ExchangeRateNow);
    state.exchangeRateNow = rate;

    if (record) {
      record.exchangeRate = rate;
    }

    return rate;
  }

  function validateNumber(number) {
    if (Number.isNaN(number)) {
      return false;
    }
    if (number == 'NaN') {
      return false;
    }
    if (number == 'Infinity') {
      return false;
    }
    if (number == '-Infinity') {
      return false;
    }
    if (isNullOrUnDef(number)) {
      return false;
    }
    return true;
  }

  const MATERIAL_AREA_NEED_SIZE = new Set(['AuxiliaryMaterials', 'MainMaterials']);

  const getRateValue = (value: unknown, fractionDigits: number): string | number => (validateNumber(value) ? (Number(value) / 100).toFixed(fractionDigits) : 0);

  function normalizeFileList() {
    return state.customerFileList.map(file => {
      const target: { filePath: string; fileName: string; id?: string | number } = {
        filePath: file.flagPath,
        fileName: file.name,
      };

      if (file.id) {
        target.id = file.id;
      }

      return target;
    });
  }

  function ensureMaterialAreaValid(item: any, index: number): void {
    const { materialAreaId, materialAreaEnCode } = item;

    if (!materialAreaId || !materialAreaEnCode) {
      return;
    }

    if (MATERIAL_AREA_NEED_SIZE.has(materialAreaEnCode)) {
      const { materialLength, materialWidth } = item;
      if (!validateNumber(materialLength) || !validateNumber(materialWidth)) {
        throw new Error(t('dict.PurchaseQuotationColumn.WidthLengthTip', [index + 1]));
      }
    }

    if (materialAreaEnCode === 'MainMaterials') {
      const { terminalCustomerCode, productLineCode } = item;
      if (!terminalCustomerCode || !productLineCode) {
        throw new Error(t('dict.PurchaseQuotationColumn.TerminalCustomerCodeProductLineCodeLineTip', [index + 1]));
      }
    }
  }

  async function handleSaveAction(type: string, isSubmit = false): Promise<void> {
    changeLoading(true);

    try {
      const dataList = getDataSource();

      const fileList = normalizeFileList();

      const list = dataList.map((item: any, index: number) => {
        if (type === 'commit' || isSubmit) {
          validateRowData(item, index);
        }

        ensureMaterialAreaValid(item, index);

        return {
          ...item,
          tariff: getRateValue(item.tariff, 4),
          reservedBuffer: getRateValue(item.reservedBuffer, 10),
          usdRmbGap: getRateValue(item.usdRmbGap, 4),
          proportionOfPriceReduction: getRateValue(item.proportionOfPriceReduction, 4),
          effectiveDate: item.effectiveDate.valueOf(),
          expirationDate: item.expirationDate.valueOf(),
        };
      });

      const params: Record<string, any> = {
        materialList: list,
        fileList,
      };

      let requestFn = addMaterialPrice;

      if (state.detailData.id) {
        requestFn = updateMaterialPrice;
        params.id = state.detailData.id;
      }

      if (type === 'commit') {
        params.saveAndCommit = true;
      }

      const { code, msg } = await requestFn(params);

      if (code === 200) {
        askPriceStore.clearInsidePartList();
        createMessage.success(msg);
        closePopup();
        emit('reload');
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      const err = error as Error;
      createMessage.warning(err.message ?? String(error));
    } finally {
      changeLoading(false);
    }
  }

  /** 必填校验配置项 */
  const validateConfigMap = [
    // 物料料号
    {
      field: 'insideCode',
      title: t('dict.PurchaseQuotationColumn.insideCode'),
      valid: (row: any) => {
        if (row.disabled.insideCode) {
          return true;
        }
        return !!row.insideCode;
      },
    },
    // 物料归属
    { field: 'materialAreaId', title: t('dict.PurchaseQuotationColumn.MaterialOwnership') },
    // 报价类型
    { field: 'quotationType', title: t('dict.PurchaseQuotation.QuotationType') },
    // 终端客户信息
    {
      field: 'terminalCustomerCode',
      title: t('dict.PurchaseQuotationColumn.terminalCustomerName'),
      valid: (row: any) => {
        if (state.source == 'askPrice' || row.materialAreaEnCode == 'AuxiliaryMaterials' || row.materialAreaEnCode == 'PackagingMaterials') {
          return true;
        }
        return !!row.terminalCustomerCode;
      },
    },
    // 产品线信息
    {
      field: 'productLineCode',
      title: t('dict.ProductLineColumn'),
      valid: (row: any) => {
        if (state.source == 'askPrice' || row.materialAreaEnCode == 'AuxiliaryMaterials' || row.materialAreaEnCode == 'PackagingMaterials') {
          return true;
        }
        return !!row.productLineCode;
      },
    },
    // 采购方式
    { field: 'purchasingWay', title: t('dict.PurchaseQuotation.PurchaseWay') },
    // 采购单位
    { field: 'purchasingUnit', title: t('dict.PriceInquiryColumn.purchasingUnit') },

    // 本位币 - 单价单位
    {
      field: 'supplierUnitPriceBaseCurrency',
      title: t('dict.SampleApplyColumn.UnitPrice'),
      valid: (row: any) => {
        if (!row.baseCurrencyChecked) {
          return true;
        }
        return row.supplierUnitPriceBaseCurrency !== '' && validateNumber(row.supplierUnitPriceBaseCurrency);
      },
    },
    // 本位币 - 交货条件
    {
      field: 'deliveryTerms',
      title: t('dict.PurchaseQuotation.DeliveryTerms'),
      valid: (row: any) => {
        if (!row.baseCurrencyChecked) {
          return true;
        }
        return !!row.deliveryTerms;
      },
    },
    // 本位币 - 运费
    {
      field: 'freightBaseCurrency',
      title: t('dict.PurchaseQuotationColumn.FreightCost'),
      valid: (row: any) => {
        if (!row.baseCurrencyChecked) {
          return true;
        }
        return typeof row.freightBaseCurrency === 'number' && !Number.isNaN(row.freightBaseCurrency) && +row.freightBaseCurrency >= 0;
      },
    },

    // 原币 - 单价单位
    {
      field: 'supplierUnitPriceOriginalCurrency',
      title: t('dict.SampleApplyColumn.UnitPrice'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked) {
          return true;
        }
        return row.supplierUnitPriceOriginalCurrency !== '' && validateNumber(row.supplierUnitPriceOriginalCurrency);
      },
    },
    // 原币 - 交货条件
    {
      field: 'deliveryTermsOriginalCurrency',
      title: t('dict.PurchaseQuotation.DeliveryTerms'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked) {
          return true;
        }
        return !!row.deliveryTermsOriginalCurrency;
      },
    },
    // 原币 - 运费
    {
      field: 'freightOriginalCurrency',
      title: t('dict.PurchaseQuotationColumn.FreightCost'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked) {
          return true;
        }
        return typeof row.freightOriginalCurrency === 'number' && !Number.isNaN(row.freightOriginalCurrency) && +row.freightOriginalCurrency >= 0;
      },
    },
    // 原币 - 汇率
    {
      field: 'exchangeRate',
      title: t('dict.PurchaseQuotationColumn.exchangeRate'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked) {
          return true;
        }
        return typeof +row.exchangeRate === 'number' && !Number.isNaN(row.exchangeRate) && +row.exchangeRate > 0;
      },
    },
    // 原币 - 关税(%)
    {
      field: 'tariff',
      title: t('dict.PurchaseQuotationColumn.tariff'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked) {
          return true;
        }
        return row.tariff !== '' && validateNumber(row.tariff);
      },
    },

    // 本位币 | 原币 - 基准币别
    {
      field: 'benchmarkCurrency',
      title: t('dict.PurchaseQuotationColumn.benchmarkCurrency'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked || !row.baseCurrencyChecked) {
          return true;
        }
        return !!row.benchmarkCurrency;
      },
    },
    // 本位币 | 原币 - 建议采购币别 suggestedPurchaseCurrency
    {
      field: 'suggestedPurchaseCurrency',
      title: t('dict.PurchaseQuotationColumn.suggestedPurchaseCurrency'),
      valid: (row: any) => {
        if (!row.originalCurrencyChecked || !row.baseCurrencyChecked) {
          return true;
        }
        return !!row.suggestedPurchaseCurrency;
      },
    },

    // 预留buffer
    {
      field: 'reservedBuffer',
      title: t('dict.PurchaseQuotationColumn.reservedBuffer'),
      valid: (row: any) => {
        const value = +row.reservedBuffer;
        return typeof value === 'number' && !Number.isNaN(value) && +value >= 0;
      },
    },
    // 失效日期
    { field: 'expirationDate', title: t('dict.PurchaseQuotationColumn.expirationDate') },
  ];
  /** 行数据填写验证 */
  function validateRowData(row: any, rowIndex: number) {
    validateConfigMap.forEach(config => {
      const { field, title, valid } = config;
      if (typeof valid === 'function' ? !valid(row) : !row[field]) {
        throw new Error(t('common.requiredFieldTip', [rowIndex + 1, title]));
      }
    });
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning(t('common.lastOneTip'));
      }
      state.index = index - 1;
      initData({
        mode: state.mode,
        showSubmit: state.showSubmit,
        showReject: state.showReject,
        showReview: state.showReview,
        cacheList: state.cacheList,
        index: state.index,
      });
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning(t('common.lastOneTip'));
      }
      state.index = index + 1;
      initData({
        mode: state.mode,
        showSubmit: state.showSubmit,
        showReject: state.showReject,
        showReview: state.showReview,
        cacheList: state.cacheList,
        index: state.index,
      });
    }
  }

  const handleRejectClose = () => {
    askPriceStore.clearInsidePartList();
    closePopup();
    emit('reload');
  };

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        ifShow: state.source !== 'askPrice',
        onClick: handleChange.bind(null, 'addBaseIndex', { index, record }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        ifShow: state.source !== 'askPrice',
        onClick: handleChange.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        // ifShow: state.source !== 'askPrice',
        modelConfirm: {
          onOk: handleChange.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  type ChangeType = 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex';

  interface ChangeData {
    rows?: number;
    index?: number;
    uuid?: string;
    record?: Record<string, any>;
    [key: string]: unknown;
  }

  function createNewRow() {
    return {
      ...rowData,
      disabled: {
        ...rowData.disabled,
        insideCode: false,
      },
      uuid: buildUUID(),
    };
  }

  function handleChange(type: ChangeType, data: ChangeData): void {
    switch (type) {
      case 'add': {
        const rows = Number(data.rows) || 0;
        const dataList = Array.from({ length: rows }, createNewRow);
        insertTableDataRecord(dataList);
        break;
      }

      case 'addBaseIndex': {
        const index = data.index ?? 0;
        const baseData = getDataSource()[index];

        insertTableDataRecord(
          {
            ...createNewRow(),
            type: baseData.type,
            originType: baseData.originType,
            priceInquiryId: baseData.priceInquiryId,
            insideCode: data.record?.insideCode,
            effectiveDate: dateUtil(new Date()),
          },
          index + 1,
        );
        break;
      }

      case 'copy': {
        const index = data.index ?? 0;
        const copyData = getDataSource()[index];

        insertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          index + 1,
        );
        break;
      }

      case 'delete': {
        const list = getDataSource();
        if (list.length <= 1) {
          createMessage.warning(t('common.retainAtLeastOneDataEntry'));
          return;
        }
        deleteTableDataRecord(data.uuid);
        break;
      }

      case 'update':
      default:
        break;
    }
  }

  /** 表格 - 列配置 */
  function getColumns(): VxeGridPropTypes.Columns {
    return [
      {
        type: 'expand',
        width: 50,
        slots: { content: 'expandedRowRender' },
      },
      {
        title: '物料料号',
        field: 'insideCode',
        width: 220,
        editRender: {
          name: 'ApiSelect',
          props: {
            api: getMaterialCodeList,
            placeholder: '物料料号',
            showSearch: true,
            memoInputVal: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            resultField: 'data',
            labelField: 'materialCode',
            valueField: 'materialCode',
            filterOption: false,
            immediate: false,
            dynamicDisabled: (row: any) => (typeof row.disabled.insideCode === 'boolean' ? row.disabled.insideCode : false),
            onChange: (_v: string | undefined, option: any, { row }) => {
              const {
                materialType,
                supplierId,
                supplierShortName,
                supplierCode,
                materialName,
                materialDesc,
                materialLength,
                materialWidth,
                materialThickness,
                totalThickness,
                materialNo,
                materialAreaId,
                materialAreaName,
                originalModelNumber,
              } = option || {};
              row.materialTypeFromManufacturer = materialNo || originalModelNumber || '';
              row.materialName = materialName || materialDesc || '';
              row.materialType = materialType || '';
              row.materialAreaId = materialAreaId || '';
              row.materialAreaName = materialAreaName || '';
              if (supplierCode) {
                row.supplierCode = supplierCode;
                row.supplierShortName = supplierShortName || '';
                row.supplierId = supplierId || '';
              }

              if (materialWidth && materialLength) {
                const materialArea = buildArea({ materialLength, materialWidth });
                row.materialArea = materialArea;
              }
              row.materialLength = materialLength;
              row.materialWidth = materialWidth;
              row.materialThickness = materialThickness || totalThickness;
            },
          },
        },
      },
      {
        title: '物料归属',
        field: 'materialAreaId',
        i18nField: 'MaterialOwnership',
        width: 200,
        formatter: 'ApiSelect',
        editRender: {
          name: 'ApiSelect',
          cacheField: 'materialAreaName',
          props: {
            api: getMaterialList,
            placeholder: '物料归属',
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            onChange: (_v: string, option: any, { row }) => {
              const { enCode } = option;
              row.materialAreaEnCode = enCode;
              row.materialAreaName = option.label;
            },
            resultField: 'data.list',
            labelField: 'fullName',
            valueField: 'id',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
      },

      {
        title: '厂商型号',
        field: 'materialTypeFromManufacturer',
        width: 220,
        // editRender: {
        //   name: 'Input',
        //   props: {
        //     placeholder: t('common.autoCarry'),
        //   },
        // },
      },
      {
        title: '材料描述',
        field: 'materialName',
        minWidth: 30,
        editRender: {
          name: 'Input',
          props: {
            placeholder: t('common.autoCarry'),
          },
        },
      },
      {
        title: '供应商简称',
        field: 'supplierCode',
        i18nField: 'supplierShortName',
        width: 220,
        formatter: 'ApiSelect',
        editRender: {
          name: 'ApiSelect',
          cacheField: 'supplierShortName',
          isDefaultLabel: true,
          props: {
            api: getSupplierList,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            afterFetch: (res: { data: any[] }) => {
              for (const item of res.data) {
                item.label = [item.code, item.shortName].filter(Boolean).join('/');
              }
              return res;
            },
            defaultLabel: '',
            originDefaultLabel: 'supplierShortName',
            resultField: 'data',
            valueField: 'code',
            labelField: 'label',
            onChange: (value: string | undefined, data: any, { row }) => {
              if (!value) {
                row.supplierShortName = '';
                row.supplierId = '';
                row.supplierName = '';
                return;
              }
              row.supplierShortName = data.label;
              row.supplierId = data.id;
              row.supplierName = data.name;
            },
            filterOption: false,
            immediate: true,
          },
        },
      },
      {
        title: '原产国',
        field: 'originLocation',
        width: 180,
        formatter: 'ApiSelect',
        editRender: {
          name: 'ApiSelect',
          props: {
            api: getOriginCountryList,
            placeholder: '请输入原产国',
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            resultField: 'data',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
            labelField: 'shortName',
            valueField: 'code',
            nameFormat: ['shortName', '(', 'code', ')'],
          },
        },
      },
      {
        title: t('common.action'),
        field: 'action',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'action',
        },
      },
    ];
  }

  function clearBaseCurrencyForm(record) {
    // record.priceType
    record.priceType = null;
    record.supplierUnitPriceBaseCurrency = null;
    record.deliveryTerms = null;
    record.freightBaseCurrency = null;

    record.usdRmbGap = null;
    record.benchmarkCurrency = null;
    record.suggestedPurchaseCurrency = null;
  }

  function clearOriginalCurrencyForm(record) {
    record.supplierUnitPriceOriginalCurrency = null;
    record.deliveryTermsOriginalCurrency = null;
    record.freightOriginalCurrency = null;
    record.exchangeRate = null;
    record.tariff = null;
    record.priceOc2bcUntaxedPriceUnit = null;

    record.usdRmbGap = null;
    record.benchmarkCurrency = null;
    record.suggestedPurchaseCurrency = null;
  }

  /** 汇率编辑处理 */
  function handleExchangeRateEdit(row: any, isEdit: boolean) {
    row.exchangeRateEditabled = isEdit;
    nextTick(() => {
      typeof row.exchangeRateInputRef?.focus === 'function' && row.exchangeRateInputRef.focus();
    });
  }
</script>
<style lang="less" scoped>
  :deep(.ant-form-item) {
    margin-bottom: 12px !important;
  }

  :deep(.ant-form-item-label) {
    padding: 0;
  }

  b {
    display: inline-block;
    margin-bottom: 8px;
  }

  .expand-card {
    border-bottom: 1px solid #dbdbdb;
    background: #fbfbfb;
    padding: 12px 0 8px 12px;
  }

  .currency-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 10px;

    //& > div {
    //	margin: 0 5px;
    //}
  }

  .file-upload-wrapper {
    width: 100%;
    height: 86px;
    padding: 12px;
    padding-top: 0;
  }

  .upload-box {
    height: 100px;
    margin-bottom: 10px;
  }

  .item-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .scroll-wrapper {
    height: calc(100vh - 200px);

    .item-title {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .item-time {
      color: #999;
    }
  }

  .ellipsis {
    overflow: hidden; /* 隐藏溢出的内容 */
    white-space: nowrap; /* 不换行 */
    text-overflow: ellipsis; /* 用省略号表示溢出的内容 */
    max-width: 75%;
  }

  .table-wrapper {
    height: calc(100vh - 292px);
    //height: 600px;
  }

  .table-height {
    height: 300px;
  }

  :deep(.ant-space .ant-space-horizontal .ant-space-align-center .item-title) {
    width: 80% !important;
  }

  :deep(.upload-box) {
    .scrollbar__wrap.scrollbar__wrap--hidden-default {
      margin-bottom: 0 !important;
    }
  }

  :deep(.ant-checkbox-wrapper) {
    & > span {
      width: max-content;
    }
  }

  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .state-box {
    margin: 0 10px;
  }

  :deep(.vxe-table--render-default .vxe-body--row-expanded-cell.is--padding) {
    padding: 12px !important;
  }

  :deep(div.ant-card-body) {
    padding: 0;
  }

  .lydc-content-wrapper .lydc-content-wrapper-center div.lydc-content-wrapper-search-box {
    padding: 10px;
  }

  :deep(.lydc-subtitle-container) {
    padding-bottom: 10px;

    &.pb-none {
      padding-bottom: 0;
    }
  }

  :deep(div.ant-col.ant-col-8) {
    padding-right: 0 !important;
  }

  :deep(div.ant-row) {
    margin-right: 0 !important;
  }

  :deep(.label-width-full label) {
    width: 100%;
  }
</style>
