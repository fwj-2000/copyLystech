<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('dict.Flow.BillStatus.1')">
            <WaitGrid>
              <template #toolbar-actions>
                <div class="btn-wrapper">
                  <a-button type="primary" @click="handleSingleApply">{{ t('common.add2Text') }} </a-button>
                  <!--              <a-button type="primary" ghost @click="handleBulkEdit">批量编辑</a-button>-->
                  <ModelConfirmButton
                    v-bind="{
                      modelConfirm: {
                        title: t('common.tipTitle'),
                        content: t('common.beforeDelTip'),
                        onOk: handleBatchDel.bind(null),
                      },
                    }">
                    <span>{{ t('common.batchDelText') }}</span>
                  </ModelConfirmButton>
                  <vShowDropdown>
                    <template #overlay>
                      <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                      <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                    </template>
                    <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
                  </vShowDropdown>
                  <a-button v-auth="'btn_batchRemove'" @click="handleDel">{{ t('common.batchDelText') }} </a-button>
                </div>
              </template>
              <template #quotationType="{ row }">
                {{ quotaTypes.find(item => item.enCode == row.quotationType)?.fullName }}
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #applyCode="{ row }">
                <span class="table-a" @click="handleAttachmentReviewPop(row)">{{ row.applyCode }} </span>
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
                  <a-row :gutter="36" class="pt-8px">
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
                                value:
                                  record.priceTypeOriginalCurrency == '1' ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2'),
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
                      <a-row :gutter="36" class="pt-19px">
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
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.submitted')">
            <DoneGrid>
              <template #toolbar-actions>
                <!--								<a-button type="primary"-->
                <!--								          @click="handleBatchRevocation"-->
                <!--								>撤回-->
                <!--								</a-button>-->
                <!--								<div class="btn-wrapper">-->
                <!--									<a-button type="primary"-->
                <!--									          @click="handleSingleApply"-->
                <!--									>新增-->
                <!--									</a-button>-->
                <!--									&lt;!&ndash;              <a-button type="primary" ghost @click="handleBulkEdit">批量编辑</a-button>&ndash;&gt;-->
                <!--									<ModelConfirmButton-->
                <!--										v-bind="{-->
                <!--                  modelConfirm: {-->
                <!--                    title: t('common.tipTitle'),-->
                <!--                    content: '确认要删除？',-->
                <!--                    onOk: handleBatchDel.bind(null),-->
                <!--                  },-->
                <!--                }"-->
                <!--									>-->
                <!--										<span>批量删除</span>-->
                <!--									</ModelConfirmButton>-->
                <!--									<a-dropdown>-->
                <!--										<template #overlay>-->
                <!--											<a-menu @click="batchImportOrExport">-->
                <!--												<a-menu-item v-if="hasBtnP('btn_upload')"-->
                <!--												             key="import"-->
                <!--												>批量导入-->
                <!--												</a-menu-item>-->
                <!--												<a-menu-item v-if="hasBtnP('btn_download')"-->
                <!--												             key="export"-->
                <!--												>批量导出-->
                <!--												</a-menu-item>-->
                <!--											</a-menu>-->
                <!--										</template>-->
                <!--										<a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>-->
                <!--									</a-dropdown>-->
                <!--									<a-button v-auth="'btn_batchRemove'"-->
                <!--									          @click="handleDel"-->
                <!--									>批量删除-->
                <!--									</a-button>-->
                <!--								</div>-->
              </template>
              <template #applyCode="{ row }">
                <span class="table-a" @click="handleAttachmentReviewPop(row)">{{ row.applyCode }} </span>
              </template>
              <template #quotationType="{ row }">
                {{ quotaTypes.find(item => item.enCode == row.quotationType)?.fullName }}
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="doneGetTableActions(row, rowIndex)" />
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
                              { label: t('dict.PurchaseQuotation.PriceType'), value: record.priceType == '1' ? '含税' : '未税' },
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
                                value:
                                  record.priceTypeOriginalCurrency == '1' ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2'),
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
            </DoneGrid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="backReload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reloadTable"></ImportModal>
    <BulkEditModal @register="registerBulkEditModal" @reload="reloadTable" />
    <Revocation @register="registerForm" @reload="reloadTable" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <AttachmentReviewPopup @register="registerAttachmentReview" @reload="backReload" />
  </div>
</template>
<script setup lang="ts">
  import { ActionItem, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    deleteMaterialPriceList,
    deletePurchaseQuotation,
    deletePurchaseQuotationList,
    downloadTemplate,
    exportPurchaseQuotationList,
    getCurrencyList,
    getMaterialPriceList,
    getProductLineList,
    importPreview,
    savePurchaseQuotation,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/finance/materialPrice';
  import { getColumns } from './components/CONFIG';
  import { message } from 'ant-design-vue';
  import ApplyPopup from './components/ApplyPopup.vue';
  import AttachmentReviewPopup from './components/AttachmentReviewPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import CustomRows from '/@/views/engineering/data/produce/components/CustomRows.vue';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onActivated, onMounted, reactive, toRefs } from 'vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import CustomRowsColumn from './components/CustomRowsColumn.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useAskPriceStore } from '/@/store/modules/askPrice';
  import BulkEditModal from './components/BulkEditModal.vue';
  import Revocation from './components/Revocation.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'purchase-basicInformation-materialPrice' });

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
  const [registerAttachmentReview, { openPopup: openAttachmentReviewPop }] = usePopup();

  const dataConfig = [
    { title: '产品线编码', dataIndex: 'productLineCode' },
    { title: '项目代码', dataIndex: 'projectCode', width: 120 },
    { title: '内部编码', dataIndex: 'insideCode', width: 120 },
    { title: '原厂商材料号', dataIndex: 'materialTypeFromManufacturer', width: 120 },
    { title: '供应商简称', dataIndex: 'supplierShortName', width: 120 },
    { title: '物料宽度（MM）', dataIndex: 'materialWidth', width: 120 },
    { title: '物料长度（M）', dataIndex: 'materialLength', width: 120 },
    { title: '物料厚度（MM）', dataIndex: 'materialThickness', width: 120 },
    { title: '物料面积（M²）', dataIndex: 'materialArea', width: 120 },
    { title: '采购单位', dataIndex: 'purchasingUnit', width: 200 },
    { title: '价格类型', dataIndex: 'priceTypeDesc', width: 200 },
    { title: '供应商报价-采购价格（本位币）', dataIndex: 'supplierPriceBaseCurrency', width: 120 },
    { title: '供应商报价-单位价格（本位币）', dataIndex: 'supplierUnitPriceBaseCurrency', width: 120 },
    {
      title: '交货条件',
      dataIndex: 'deliveryTermsDesc',
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
    { title: '报价类型', dataIndex: 'quotationTypeDesc', width: 120 },
    { title: '生效日期', dataIndex: 'effectiveDate', width: 120, format: 'date|YYYY-MM-DD HH:mm' },
    { title: '失效日期', dataIndex: 'expirationDate', width: 120, format: 'date|YYYY-MM-DD HH:mm' },
    { title: '报价时间', dataIndex: 'quotationTime', width: 120, format: 'date|YYYY-MM-DD HH:mm' },
    { title: 'Supplier To Customer Price', dataIndex: 'supplierToCustomerPrice', width: 120 },
    { title: 'Gap1', dataIndex: 'gap1', width: 120 },
    { title: 'Supplier To Competitor Price', dataIndex: 'supplierToCompetitorPrice', width: 120 },
    { title: 'Gap2', dataIndex: 'gap2', width: 120 },
    { title: '原产地', dataIndex: 'originLocation', width: 120 },
    { title: 'MOQ', dataIndex: 'moq', width: 120 },
    { title: 'Lt', dataIndex: 'lt', width: 120 },
    { title: '备注', dataIndex: 'remark', width: 120 },
  ];
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
    if (state.activeKey == '1') {
      waitReload();
    } else {
      doneReload();
    }
  }

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, 'wait', index),
        // auth: "btn_detail"
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.id),
        },
        // auth: "btn_remove"
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

  function handleBatchDel() {
    const idList = waitGetSelectRowKeys() || [];
    if (idList.length) {
      deleteMaterialPriceList(idList).then(({ code, msg }) => {
        if (code == 200) {
          message.success(msg);
        } else {
          message.error(msg);
        }
        reloadTable();
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  async function onDelete(id) {
    const { code, msg } = await deletePurchaseQuotation(id);
    if (code === 200) {
      createMessage.success(msg);
      reloadTable();
    }
  }

  const [
    WaitGrid,
    { reload: waitReload, clearSelectedRowKeys: waitClearSelectedRowKeys, getSelectRowKeys: waitGetSelectRowKeys, getFetchParams: waitGetFetchParams },
  ] = useVbenVxeGrid({
    formOptions: getFormConfig() as any,
    gridOptions: {
      id: 'purchase-basicInformation-materialPrice-todo-list',
      columns: getColumns(),
      api: getMaterialPriceList,
      beforeFetch: (params: any) => {
        params.dataFilter = 1;
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

  const [DoneGrid, { reload: doneReload }] = useVbenVxeGrid({
    formOptions: getFormConfig() as any,
    gridOptions: {
      id: 'purchase-basicInformation-materialPrice-done-list',
      columns: getColumns(),
      api: getMaterialPriceList,
      beforeFetch: params => {
        params.dataFilter = 2;
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
        state.doneCacheList = Array.isArray(data?.list) ? data.list : [];
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
              { fullName: t('dict.PurchaseQuotation.Status.1'), enCode: '1' },
              { fullName: t('dict.FileInfoStatus.2'), enCode: '2' },
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
            placeholder: '',
          },
        },
        {
          fieldName: 'creatorTime',
          label: '',
          component: 'RangePicker',
          componentProps: {
            placeholder: [t('dict.PurchaseQuotationColumn.quotationTime'), t('dict.PurchaseQuotationColumn.quotationTime')],
          },
        },
        {
          fieldName: 'date',
          label: '',
          component: 'RangePicker',
          componentProps: {
            placeholder: [t('dict.PurchaseQuotationColumn.effectiveDate'), t('dict.PurchaseQuotationColumn.expirationDate')],
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
        transferRange: ['placeholder'],
        excludeFields: ['creatorTime', 'date'],
      },
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
      usePolling: true,
      pollingParams: {
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
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
        i18nField: 'supplierShortName',
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
        i18nField: 'materialName',
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
    const exportColumns = cloneDeep(getColumns());
    openExportModal(true, {
      listQuery: {
        ...waitGetFetchParams(),
      },
      api: exportPurchaseQuotationList,
      exportOptions: [...exportColumns, ...supplement],
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'PurchaseQuotationColumn',
      },
    });
  };

  const handleSingleApply = () => {
    // console.log('单个申请');
    openApplyPop(true, {
      mode: 'edit',
      cacheList: [],
      index: 0,
      showSubmit: true,
    });
  };

  const handleBulkEdit = () => {
    const ids = waitGetSelectRowKeys();
    openBulkEditModal(true, {
      ids,
    });
  };

  async function handleDel() {
    const selectedRowKeys = waitGetSelectRowKeys();
    console.log(selectedRowKeys);
    if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      // title: t('common.tipTitle'),
      // content: '此操作将永久删除该数据, 是否继续？',
      onOk: async () => {
        try {
          const { msg, code } = await deletePurchaseQuotationList(selectedRowKeys);
          if (code === 200) {
            waitClearSelectedRowKeys();
            message.success(msg);
            waitReload();
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:1024 ~ handleDel ~ e:', e);
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
      cacheList: type == 'wait' ? state.cacheList : state.doneCacheList,
      showSubmit: type == 'wait',
      hideSubmit: true,
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

  function handleAttachmentReviewPop(record) {
    openAttachmentReviewPop(true, record);
  }

  onMounted(() => {
    getTypeOptions();
  });

  onActivated(() => {
    const askPriceList = askPriceStore.getInsidePartList;
    if (askPriceList.length > 0) {
      openApplyPop(true, {
        mode: 'edit',
        index: 0,
        cacheList: askPriceList,
        source: 'askPrice',
        showSubmit: true,
      });
    }
    askPriceStore.clearInsidePartList();
  });
</script>
<style scoped lang="less">
  @import url('/src/design/page.less');
  @import url('./expand.less');

  // :deep(.ant-table-expanded-row .ant-card-body) {
  //   padding: 0;
  // }
</style>
