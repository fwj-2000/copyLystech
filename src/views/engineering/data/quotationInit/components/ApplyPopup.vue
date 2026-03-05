<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" :title="getTitle" destroyOnClose class="full-popup p-10px">
    <template #title>
      <a-space>
        <p>{{ t('dict.QuotationRequirements.FlowNode.Quotation') }}</p>
        <a-button v-auth="'btn_edit'" @click="handleDrawView">{{ t('dict.PartNumberApplyDrawingsType.DesensitizedDrawings') }} </a-button>
      </a-space>
    </template>
    <template #insertToolbar>
      <a-space :size="10">
        <a-button class="mr-3" @click="handleHistory" type="primary" ghost>{{ t('common.quotaHistory') }} </a-button>
        <!--        <a-button v-auth="'btn_edit'" @click="handleCopyPCC" v-if="mode == 'edit'" type="primary" ghost>引用PCC </a-button>-->
        <!--        <a-button v-auth="'btn_review'" v-if="state.currentData.status == 1" @click="handleReview">审核 </a-button>-->
        <a-button v-auth="'btn_edit'" :loading="loading" v-if="mode == 'edit'" @click="handleSaveAction('save')" type="primary" ghost
          >{{ t('common.temporarySave') }}
        </a-button>
        <a-button v-auth="'btn_edit'" :loading="loading" v-if="mode == 'edit' && !isCommit" @click="handleSaveAction('commit')" type="primary"
          >{{ t('common.submitText') }}
        </a-button>
        <!--   审核提交     -->
        <!--        <a-button v-auth="'btn_edit'" :loading="loading" v-if="isCommit && currentData.currentNode === 'Leader'" @click="handleCommit" type="primary"-->
        <!--          >{{ t('common.submitText') }}-->
        <!--        </a-button>-->
        <a-button
          v-auth="'btn_edit'"
          :loading="loading"
          v-if="isCommit && currentData.currentNode === 'Leader'"
          @click="handleSaveAction('commit')"
          type="primary"
          >{{ t('common.submitText') }}
        </a-button>
        <!--        -->
        <a-button v-auth="'btn_edit'" v-if="showSyncPrice" :loading="loading" @click="handleSyncPrice">{{ t('dict.QuotationFlowNode.SyncPrice') }} </a-button>
        <a-button v-auth="'btn_detail'" @click="handlePre">{{ t('common.prevRecord') }} </a-button>
        <a-button v-auth="'btn_detail'" @click="handleNext" ghost type="primary">{{ t('common.nextRecord') }} </a-button>
      </a-space>
    </template>
    <div ref="container" class="container-box">
      <div ref="bomContent" class="bom-content">
        <div class="drag-box">
          <div ref="divider" class="drag-ctrl"></div>
        </div>
        <ScrollContainer>
          <div class="bom-header">
            <div style="display: flex; flex-flow: row-reverse wrap; justify-content: space-between; align-items: center; padding-bottom: 15px">
              <div style="cursor: pointer" @click="handleUnpack">
                <i v-if="isPack" style="display: block; width: 40px; text-align: center" class="icon-ym icon-ym-nav-prev" />
                <i v-else style="display: block; width: 40px; text-align: center" class="icon-ym icon-ym-nav-next" />
              </div>
              <Subtitle :title="t('common.Bom')" />
            </div>
            <div class="line"></div>
            <div class="bom-list">
              <BasicTree
                :treeData="treeData"
                :checkable="false"
                :defaultExpandAll="true"
                @dblclick="handleDblClick"
                :clickRowToExpand="true"
                :fieldNames="{
                  children: 'children',
                  title: 'code',
                  key: 'id',
                }" />
            </div>
          </div>
        </ScrollContainer>
      </div>
      <div ref="mainContent" class="main-content">
        <ScrollContainer>
          <div ref="navBox" class="main-nav" @click="handleScroll">
            <div class="nav-item active" data-index="base-info">{{ t('common.baseinfo') }} </div>
            <div class="nav-item" data-index="process">{{ t('common.process') }} </div>
            <div class="nav-item" data-index="material">{{ t('common.metaria') }} </div>
            <div class="nav-item" data-index="mould">{{ t('common.Mold') }} </div>
            <div class="nav-item" data-index="packaging">{{ t('dict.Quotation.BOMType.4') }} </div>
            <div class="nav-item" data-index="silicone">{{ t('dict.Quotation.BOMType.3') }} </div>
          </div>
          <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
            <Subtitle :title="t('common.baseinfo')" id="base-info" style="margin-top: 40px" />
            <!--            <CustomRows :list="baseInfo" />-->
            <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
              <BasicForm @register="registerForm"></BasicForm>
            </a-card>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <ProcessTable
              class="rounded-8px"
              :columns="formatProcessTableColumns"
              :title="t('common.process')"
              :list="state.ProcessList"
              :fieldsValue="state.fieldsValue"
              :detailed="!editable"
              ref="processTableRef"
              @getProcessData="getProcessData" />
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <MaterialTable
              class="rounded-8px"
              :columns="formatMaterialTableColumns"
              :title="t('common.metaria')"
              :list="state.MaterialList"
              :detailed="!editable"
              :fieldsValue="state.fieldsValue"
              :currentData="state.currentData"
              :processData="state.processData"
              @getProcessData="getProcessData"
              ref="materialTableRef" />
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Mould
              class="rounded-8px"
              :columns="formatMouldTableColumns"
              :title="t('common.Mold')"
              :list="state.MouldList"
              :detailed="!editable"
              :fieldsValue="state.fieldsValue"
              :currentData="state.currentData"
              :processData="state.processData"
              ref="mouldTableRef" />
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Packaging
              class="rounded-8px"
              :columns="formatPackagingTableColumns"
              :title="t('dict.Quotation.BOMType.4')"
              :list="state.PackagingList"
              :detailed="!editable"
              :fieldsValue="state.fieldsValue"
              :currentData="state.currentData"
              :processData="state.processData"
              ref="packagingTableRef" />
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Silicone
              class="rounded-8px"
              :columns="formatSiliconeTableColumns"
              :title="t('dict.Quotation.BOMType.3')"
              :list="state.SiliconeList"
              :detailed="!editable"
              :fieldsValue="state.fieldsValue"
              :currentData="state.currentData"
              :processData="state.processData"
              ref="siliconeTableRef" />
          </a-card>
        </ScrollContainer>
      </div>
    </div>
    <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" />
    <DrawViewModal @register="registerDrawViewModal" />
    <History @register="registerQuotaModal" @submit="handleQuotaModal" />
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { computed, nextTick, reactive, ref, toRefs } from 'vue';
  import {
    addQuotationFinishedParts,
    addQuotationHalfFinishedParts,
    commitQuotation,
    getHistoryRecord,
    getProcessAllList,
    getQuotationBOM,
    getQuotationBOMDetail,
    getQuotationDetail,
    postHistoryQuotation,
    postHistoryRecord,
    updateQuotationFinishedParts,
    updateQuotationHalfFinishedParts,
  } from '/@/api/engineering/quotatios';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getMaterialCodeList, getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { getBaseDataWagerateList } from '/@/api/finance/wageRate';
  import ProcessTable from './Process.vue';
  import MaterialTable from './Material.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import Mould from './Mould.vue';
  import Packaging from './Packaging.vue';
  import Silicone from './Silicone.vue';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Upgrade from './Upgrade.vue';
  import { useModal } from '/@/components/Modal';
  import { createFromPcc } from '/@/api/business/quota';
  import { updatePrice } from '/@/api/business/priceConfirmation';
  import DrawViewModal from '/@/views/engineering/pcc/pccApply/components/DrawViewModal.vue';
  import History from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import { isNullOrUnDef } from '/@/utils/is';
  import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();
  const { createConfirm } = useMessage();

  const [registerUpgradeModal, { openModal: openUpgradeModal, closeModal: closeUpgradeModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();
  const [registerQuotaModal, { openModal: openQuotaModal }] = useModal();

  const emit = defineEmits(['reload', 'register']);

  const state = reactive({
    navIndex: 0,
    cacheList: [],
    currentData: {},
    baseInfo: [],
    pageType: 'edit',
    ProcessList: [],
    MaterialList: [],
    MouldList: [],
    PackagingList: [],
    SiliconeList: [],
    LaborRateTypeEnum: [],
    fieldsValue: {},
    ProcessData: [],
    treeData: [],
    halfSign: '',
    halfBomId: '',
    PurposeEnum: [],
    isPack: true,
    isCommit: false,
    showReject: false,
    loading: false,
    showSyncPrice: false,
  });
  const { baseInfo, fieldsValue, treeData, isPack, showReject, isCommit, loading, showSyncPrice, currentData } = toRefs(state);

  const container = ref(null);
  const divider = ref(null);
  const bomContent = ref(null);
  const mainContent = ref(null);
  const navBox = ref(null);
  let isDragging = false;
  const processTableRef = ref(null);
  const materialTableRef = ref(null);
  const mouldTableRef = ref(null);
  const packagingTableRef = ref(null);
  const siliconeTableRef = ref(null);
  const mode = ref('');

  const [registerForm, { setFieldsValue, setProps, validateFields, updateSchema, getFieldsValue }] = useForm({
    schemas: getFormSchema(),
    layout: 'vertical',
    labelWidth: 200,
    baseColProps: {
      span: 3,
    },
    i18nConfig: {
      moduleCode: 'QuotationColumn',
      transferRange: ['label'],
    },
  });

  const editable = computed(() => {
    return state.pageType == 'edit';
  });

  const getTitle = computed(() => (state.mode == 'edit' ? '工程报价制作' : '工程报价查看'));

  function handlePre() {
    state.loading = true;
    changeLoading(true);
    const index = state.cacheList.findIndex(item => item.id === state.currentData.id);
    if (index === 0) {
      state.loading = false;
      changeLoading(false);
      return message.warning('当前已经是第一条');
    }
    state.currentData = state.cacheList[index - 1];

    getBomMessage(state.currentData.bomId);
    console.log(state.currentData, 123123123);
    buildBaseInfo(state.currentData);
  }

  // function handleReview() {
  //   changeLoading(true);
  //   reviewQuotation([state.currentData.id])
  //     .then(({ code, msg }) => {
  //       if (code == 200) {
  //         createMessage.success(msg);
  //         closePopup();
  //         emit('reload');
  //       } else {
  //         createMessage.error(msg);
  //       }
  //     })
  //     .finally(() => {
  //       changeLoading(false);
  //     });
  // }

  function handleNext() {
    state.loading = true;
    changeLoading(true);
    const index = state.cacheList.findIndex(item => item.id === state.currentData.id);
    console.log(index);
    if (index === state.cacheList.length - 1) {
      state.loading = false;
      changeLoading(false);
      return message.warning('当前已经是最后一条');
    }
    console.log(state.cacheList, 'state.cacheListstate.cacheListstate.cacheList');
    state.currentData = state.cacheList[index + 1];
    getBomMessage(state.currentData.bomId);
    buildBaseInfo(state.currentData);
  }

  function getFormSchema(): FormSchema[] {
    return [
      // {
      //   field: 'qrApplyUserName',
      //   label: '申请人',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入思想很情人' },
      // },
      {
        field: 'qrApplyCode',
        label: '报价需求单号',
        component: 'Input',
        componentProps: { placeholder: '请输入报价需求单号' },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'terminalCustomerProjectCode',
        label: '终端项目代码',
        component: 'Input',
        componentProps: { placeholder: '请输入终端项目代码' },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'insidePartNumber',
        label: '产品内部料号',
        component: 'Input',
        componentProps: { placeholder: '请输入产品内部料号' },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'productDesc',
        label: '产品描述',
        component: 'Input',
        componentProps: { placeholder: '请输入产品描述', disabled: true },
        colProps: {
          span: 8,
        },
      },
      {
        field: 'factory',
        label: '工厂',
        component: 'Input',
        componentProps: { placeholder: '请输入工厂' },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'purpose',
        label: '报价用途',
        component: 'Input',
        componentProps: { placeholder: '请输入报价用途' },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'productSpec',
        label: '产品规格(长*宽*厚)MM',
        className: 'form-required',
        component: 'Input',
        componentProps: { placeholder: `${t('common.example')}: 10*10*0.1` },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'managementRate',
        label: '管理费用费率',
        component: 'Input',
        defaultValue: '9.32',
        componentProps: {
          disabled: true,
          placeholder: '请输入管理费用费率',
          suffix: '%',
        },
        colProps: {
          span: 3,
        },
      },

      {
        field: 'wageRateId',
        label: '工资率',
        i18nField: 'wageRate',
        component: 'ApiSelect',
        // defaultValue: '587878584496947141',
        componentProps: {
          disabled: true,
          api: getBaseDataWagerateList,
          placeholder: '请选择工资率',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          useChangeCopy: true,
          labelField: 'baseName',
          valueField: 'id',
          onChange: (e, v) => {
            state.fieldsValue.wageRate = v;
          },
          colProps: {
            span: 4,
          },
          // nameFormat: ['baseName'],
        },
      },
      {
        field: 'isBonded',
        label: '是否保税',
        component: 'Select',
        componentProps: {
          disabled: true,
          onChange: e => {
            state.fieldsValue.isBonded = e;
          },
          defaultValue: 'false',
          options: [
            {
              fullName: t('common.yes'),
              enCode: 'true',
            },
            {
              fullName: t('common.no'),
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
        },
        colProps: {
          span: 3,
        },
      },

      {
        field: 'costUnit',
        label: '成本单位',
        component: 'ApiSelect',
        defaultValue: 'PCS',
        componentProps: {
          disabled: true,
          api: getUnitListByKeyword,
          placeholder: '请选择成本单位',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          useChangeCopy: true,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'currency',
        label: '币别',
        defaultValue: 'RMB',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '请选择成本单位',
        },
        colProps: {
          span: 3,
        },
      },
    ];
  }

  const formatProcessTableColumns = computed(() => [
    {
      title: t('dict.SampleLabelPrintColumn.productionTypeName'),
      width: 120,
      dataIndex: 'productionType',
      compType: 'Select',
      mode: 'searchInput',
      className: 'table-required',
      placeholder: t('dict.SampleLabelPrintColumn.productionTypeName'),
      defaultValue: 1,
      fieldNames: {
        label: 'fullName',
        value: 'enCode',
      },
      assignFields: {},
      searchFunc: () => baseStore.getDictionaryData('Process.ProduceType', true),
    },
    {
      title: t('dict.Module.Process'),
      dataIndex: 'processCode',
      key: 'processCode',
      className: 'table-required',
      width: 200,
      compType: 'Select',
      mode: 'searchInput',
      fieldNames: {
        label: 'code',
        value: 'code',
      },
      beforeParams: () => {
        return { mainProcess: 1 };
      },
      placeholder: t('dict.Module.Process'),
      assignFields: {
        processName: 'name',
        processCode: 'value',
        productionType: 'type',
      },
      nameFormat: ['code', '(', 'name', ')'],
      searchFunc: v => getProcessAllList(v),
    },
    {
      title: `${t('dict.QuotationColumn.productionCapacity')}(K/H)`,
      dataIndex: 'capacity',
      key: 'capacity',
      className: 'table-required',
      placeholder: t('dict.QuotationColumn.productionCapacity'),
      width: 100,
      precision: 3,
      step: 0.001,
      compType: 'InputNumber',
    },
    {
      title: t('dict.QuotationColumn.processYield'),
      dataIndex: 'yield',
      key: 'yield',
      className: 'table-required',
      precision: 1,
      step: 0.1,
      placeholder: t('dict.QuotationColumn.processYield'),
      width: 120,
      compType: 'InputNumber',
    },

    // Quotation.ProductionType
    {
      title: t('dict.QuotationColumn.numberOfUsers'),
      dataIndex: 'numberOfUsers',
      placeholder: t('dict.QuotationColumn.numberOfUsers'),
      className: 'table-required',
      precision: 1,
      step: 0.1,
      defaultValue: 1,
      key: 'numberOfUsers',
      width: 120,
      compType: 'InputNumber',
    },
    {
      title: t('dict.QuotationColumn.depreciationPeriod'),
      dataIndex: 'periodOfDepreciation',
      key: 'periodOfDepreciation',
      width: 90,
      defaultValue: '1',
      mode: 'searchInput',
      compType: 'Select',
      disabled: true,
      assignFields: {},
      // componentProps: {
      //   options: state.LaborRateTypeEnum,
      // },
      fieldNames: {
        label: 'fullName',
        value: 'enCode',
      },
      searchFunc: () => baseStore.getDictionaryData('LaborRateTypeEnum'),
    },
    // {
    //   title: '工序名称',
    //   dataIndex: 'processName',
    //   helpMessage: '工序编码数据',
    //   placeholder: '自动带入',
    //   disabled: true,
    //   key: 'processName',
    //   width: 120,
    //   compType: 'Input',
    // },
    // {
    //   title: '生产类型',
    //   dataIndex: 'productionType',
    //   disabled: true,
    //   placeholder: '系统计算',
    //   helpMessage: '工序编码数据',
    //   key: 'productionType',
    //   width: 180,
    //   compType: 'Input',
    // },

    // 还原直通率
    {
      title: t('common.restoreFirstPassYield'),
      dataIndex: 'fpy',
      helpMessage: t('dict.QuotationColumn.currentRowRestoreFirstPassYieldTip'),
      disabled: true,
      defaultValue: 100,
      placeholder: t('common.systemCalculation'),
      key: 'fpy',
      width: 120,
      compType: 'InputNumber',
    },
    {
      title: t('dict.QuotationColumn.equipmentLaborRatePerHour'),
      dataIndex: 'equipmentLaborRate',
      disabled: true,
      show: !hasBtnP('price-process'),
      helpMessage: t('dict.QuotationColumn.laborRateTableLookup'),
      placeholder: t('common.systemCalculation'),
      key: 'equipmentLaborRate',
      width: 140,
      compType: 'Input',
    },
    {
      title: t('dict.UtilizationRateColumn.utilizationRate'),
      dataIndex: 'utilizationRate',
      disabled: true,
      helpMessage: t('dict.QuotationColumn.manualOperationOrPackagingValue'),
      placeholder: t('common.systemCalculation'),
      key: 'utilizationRate',
      width: 120,
      compType: 'InputNumber',
    },
    // 人工成本
    {
      title: t('dict.QuotationColumn.laborCost'),
      dataIndex: 'laborCost',
      disabled: true,
      show: !hasBtnP('price-process'),
      helpMessage: t('dict.QuotationColumn.wageRateDividedByCapacityTimesPeopleTip'),
      placeholder: t('common.systemCalculation'),
      key: 'laborCost',
      width: 120,
      compType: 'Input',
    },
    {
      title: t('dict.QuotationColumn.theoreticalManufacturingCost'),
      dataIndex: 'theoreticalManufacturingCost',
      disabled: true,
      show: !hasBtnP('price-process'),
      helpMessage: t('dict.QuotationColumn.equipmentLaborRateDividedByCapacityPlusLaborCostDividedByUtilizationRateTip'),
      placeholder: t('common.systemCalculation'),
      key: 'theoreticalManufacturingCost',
      width: 130,
      compType: 'Input',
    },
    {
      title: t('dict.QuotationColumn.actualManufacturingCost'),
      dataIndex: 'actualManufacturingCost',
      disabled: true,
      show: !hasBtnP('price-process'),
      helpMessage: t('dict.QuotationColumn.currentRowActualManufacturingCost'),
      placeholder: t('common.systemCalculation'),
      key: 'actualManufacturingCost',
      width: 140,
      compType: 'Input',
    },
    {
      title: t('dict.QuotationColumn.equipmentFixedManufacturingCostPerHour'),
      dataIndex: 'fixedEquipmentRate',
      disabled: true,
      show: !hasBtnP('price-process'),
      placeholder: t('common.systemCalculation'),
      helpMessage: t('dict.QuotationColumn.processCodeLookup'),
      key: 'fixedEquipmentRate',
      width: 140,
      compType: 'Input',
    },
    {
      title: t('dict.QuotationColumn.equipmentVariableManufacturingCostPerHour'),
      dataIndex: 'dynamicEquipmentRate',
      disabled: true,
      show: !hasBtnP('price-process'),
      placeholder: t('common.systemCalculation'),
      helpMessage: t('dict.QuotationColumn.processCodeLookup'),
      key: 'dynamicEquipmentRate',
      width: 140,
      compType: 'Input',
    },
  ]);

  const formatMaterialTableColumns = computed(() => [
    // Process.ProduceType
    {
      // 材料
      title: t('common.metaria'),
      align: 'center',
      children: [
        // {
        //   title: '生产类型',
        //   width: 200,
        //   dataIndex: 'productionType',
        //   compType: 'Select',
        //   mode: 'searchInput',
        //   fieldNames: {
        //     label: 'fullName',
        //     value: 'enCode',
        //   },
        //   assignFields: {},
        //   searchFunc: () => baseStore.getDictionaryData('Process.ProduceType'),
        // },
        // 物料名称 长度 宽度 厚度 采购单位
        {
          // 材料八码
          title: t('dict.PCCColumn.eightCode'),
          width: 120,
          dataIndex: 'eightCode',
          className: 'table-required',
          placeholder: t('dict.PCCColumn.eightCode'),
          compType: 'Input',
        },
        {
          // 宽度
          title: t('dict.QuantitativePlanColumn.width'),
          width: 100,
          dataIndex: 'singleWidth',
          className: 'table-required',
          placeholder: t('dict.QuantitativePlanColumn.width'),
          compType: 'InputNumber',
        },
        {
          // 查询结果
          title: t('dict.PCCColumn.originPartNumber'),
          width: 300,
          dataIndex: 'originInsideCode',
          compType: 'Select',
          className: 'table-required',
          mode: 'searchInput',
          fieldNames: {
            label: 'materialCode',
            value: 'materialCode',
          },
          beforeParams: record => {
            return {
              shortMaterialCode: record['eightCode'],
              // materialWidth: isNaN(Number(record['singleWidth'])) ? 0 : '',
              toleranceNegative: 0,
              materialWidth: isNullOrUnDef(record['singleWidth']) ? '' : Number(record['singleWidth']),
            };
          },
          afterFetch: (res: any) => {
            if (!res) {
              return res;
            }
            const list = Array.isArray(res?.data) ? res?.data : [];
            res.data = list.map((item: any) => {
              return {
                ...item,
                desc: getOriginPartNumberDesc(item),
              };
            });
          },
          nameFormat: ['materialCode', '', 'desc'],
          placeholder: t('dict.PCCColumn.originPartNumber'),
          assignFields: {
            materialDescription: 'materialDesc',
            wholeLength: 'materialLength',
            wholeWidth: 'materialWidth',
            // wholeUnit: 'purchasingUnit',
            wholeUnit: 'purchaseUnit',
            purchaserId: 'developmentPurchaserId',
            priceActual: 'actualPurchasePrice',
          },
          searchFunc: v => getMaterialSearchByShortCode(v),
        },
        {
          // 料号
          title: t('dict.QuotationColumn.materialNumber'),
          width: 200,
          dataIndex: 'insideCode',
          className: 'table-required',
          placeholder: t('dict.QuotationColumn.materialNumber'),
          disabled: true,
          compType: 'Input',
        },
        {
          // 描述
          title: t('dict.QuantitativePlanColumn.materialDesc'),
          width: 200,
          placeholder: t('dict.QuantitativePlanColumn.materialDesc'),
          disabled: true,
          dataIndex: 'materialDescription',
          compType: 'Input',
        },
        // {
        //   title: '新材料厂商型号',
        //   width: 200,
        //   dataIndex: 'materialTypeFromManufacturer',
        //   fieldNames: {
        //     label: 'materialTypeFromManufacturer',
        //     value: 'materialTypeFromManufacturer',
        //   },
        //   placeholder: '请选择新材料厂商型号',
        //   compType: 'Select',
        //   mode: 'searchInput',
        //   assignFields: {
        //     materialDescription: 'materialDesc',
        //     wholeUnit: 'purchasingUnit',
        //   },
        //   beforeParams: tableLineData => {
        //     console.log(tableLineData);
        //     return {
        //       insideCode: tableLineData['insideCode'],
        //     };
        //   },
        //   immediate: false,
        //   searchFunc: v => getMaterialPriceList(v),
        // },
        {
          // 新材料厂商型号
          title: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
          width: 200,
          dataIndex: 'materialTypeFromManufacturer',
          placeholder: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
          className: 'table-required',
          compType: 'Input',
          assignFields: {
            materialDescription: 'materialDesc',
            wholeLength: 'materialLength',
            wholeWidth: 'materialWidth',
            // wholeUnit: 'purchasingUnit',
            wholeUnit: 'purchaseUnit',
            purchaserId: 'developmentPurchaserId',
            priceActual: 'actualPurchasePrice',
          },
        },
      ],
      dataIndex: 'material-group',
    },
    {
      // 单个规格
      title: t('dict.QuotationColumn.singleStepDistance'),
      dataIndex: 'single-spec-group',
      children: [
        {
          // 步距
          title: `${t('common.step')}(MM)`,
          width: 100,
          placeholder: t('common.step'),
          dataIndex: 'singleStepDistance',
          className: 'table-required',
          compType: 'InputNumber',
        },
        {
          // 模数
          title: t('dict.QuotationColumn.singleModulus'),
          width: 80,
          placeholder: t('dict.QuotationColumn.singleModulus'),
          dataIndex: 'singleModulus',
          className: 'table-required',
          compType: 'InputNumber',
        },
        {
          // 用量
          title: t('dict.QuotationColumn.singleUseQty'),
          width: 100,
          helpMessage: [t('dict.QuotationColumn.singleUseQtyTip')],
          disabled: true,
          placeholder: t('common.systemCalculation'),
          dataIndex: 'singleUseQty',
          compType: 'Input',
        },
        {
          // 制程损耗
          title: t('dict.QuotationColumn.singleProcessLosses'),
          width: 100,
          helpMessage: [t('dict.QuotationColumn.singleProcessLossesTip')],
          placeholder: t('dict.QuotationColumn.singleProcessLosses'),
          disabled: true,
          dataIndex: 'singleProcessLosses',
          compType: 'InputNumber',
        },
        // {
        //   title: '新材料',
        //   width: 200,
        //   placeholder: '请选择新材料',
        //   dataIndex: 'newMaterial',
        //   compType: 'Select',
        //   options: [
        //     {
        //       fullName: '是',
        //       enCode: 'true',
        //     },
        //     {
        //       fullName: '否',
        //       enCode: 'false',
        //     },
        //   ],
        //   fieldNames: {
        //     label: 'fullName',
        //     value: 'enCode',
        //   },
        // },
        {
          // 开发采购
          title: t('dict.MaterialDevelopImport.purchaseUserName'),
          width: 200,
          placeholder: t('dict.MaterialDevelopImport.purchaseUserName'),
          dataIndex: 'purchaserId',
          className: 'table-required',
          compType: 'UserSelect',
        },
        {
          // 有无价格
          title: t('dict.QuotationColumn.hasPrice'),
          width: 120,
          placeholder: t('common.systemCalculation'),
          dataIndex: 'hasPrice',
          compType: 'Select',
          helpMessage: [t('dict.QuotationColumn.hasPriceTip1'), t('dict.QuotationColumn.hasPriceTip2')],
          disabled: true,
          options: [
            {
              fullName: t('dict.NewsStatusEnum.Have'),
              enCode: 'true',
            },
            {
              fullName: t('dict.NewsStatusEnum.Nothing'),
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
        },
        {
          // 原`成本中心价`标题改为`材料成本`
          // 总面积/ ( 购买原材料宽 / 报价工程录入原材料宽) 注意去小数位取整*（购买长度/材料步距）*模数*（1-制程损耗）
          title: t('common.materialCost'),
          width: 120,
          helpMessage: [t('dict.QuotationColumn.costCenterPrice1')],
          disabled: true,
          relevancy: true,
          show: !hasBtnP('price-material'),
          dataIndex: 'cost',
          placeholder: t('common.systemCalculation'),
          key: 'cost',
          compType: 'InputNumber',
        },
        // {
        //   // 底价
        //   // 总面积/ ( 购买原材料宽 / 报价工程录入原材料宽) 注意去小数位取整*（购买长度/材料步距）*模数*（1-制程损耗）
        //   title: '底价',
        //   width: 100,
        //   helpMessage: [t('dict.QuotationColumn.costCenterPrice1'), t('dict.QuotationColumn.costActualTip2')],
        //   disabled: true,
        //   show: !hasBtnP('price-material'),
        //   dataIndex: 'costActual',
        //   relevancy: true,
        //   placeholder: t('common.systemCalculation'),
        //   key: 'costActual',
        //   compType: 'InputNumber',
        // },
      ],
    },
    {
      // 整支料规格
      title: t('dict.QuotationColumn.wholeWidth'),
      dataIndex: 'whole-spec-group',
      children: [
        {
          // 宽幅
          title: t('dict.QuotationColumn.wholeWidth1'),
          width: 120,
          helpMessage: t('dict.QuotationColumn.wholeWidthTip'),
          placeholder: t('common.systemCalculation'),
          dataIndex: 'wholeWidth',
          className: 'table-required',
          compType: 'InputNumber',
        },
        {
          // 长度
          title: t('dict.QuantitativePlanColumn.Length'),
          width: 120,
          helpMessage: t('dict.QuotationColumn.wholeWidthTip'),
          placeholder: t('common.systemCalculation'),
          dataIndex: 'wholeLength',
          className: 'table-required',
          compType: 'InputNumber',
        },
        // {
        //   title: '原材厚度',
        //   width: 200,
        //   disabled: true,
        //   placeholder: '系统计算',
        //   helpMessage: '材料价格库数据',
        //   dataIndex: 'wholeThickness',
        //   compType: 'InputNumber',
        // },
        {
          // 原 `成本中心价` 标题改为`材料单价`
          title: t('common.unitPriceOfMaterials'),
          width: 140,
          disabled: true,
          placeholder: t('common.systemCalculation'),
          relevancy: true,
          show: !hasBtnP('price-material'),
          helpMessage: t('dict.QuotationColumn.wholeWidthTip'),
          dataIndex: 'wholePrice',
          compType: 'InputNumber',
        },
        // {
        //   // 底价
        //   title: t('dict.PurchaseQuotationColumn.actualPurchasePrice'),
        //   width: 150,
        //   disabled: true,
        //   placeholder: t('common.systemCalculation'),
        //   relevancy: true,
        //   show: !hasBtnP('price-material'),
        //   helpMessage: t('dict.QuotationColumn.wholeWidthTip'),
        //   dataIndex: 'priceActual',
        //   compType: 'InputNumber',
        // },
        {
          // 采购单位
          title: t('dict.PriceInquiryColumn.purchasingUnit'),
          width: 120,
          disabled: true,
          placeholder: t('common.systemCalculation'),
          helpMessage: t('dict.QuotationColumn.wholeWidthTip'),
          dataIndex: 'wholeUnit',
          compType: 'Input',
        },
        {
          // 材料利用率
          title: t('dict.QuotationColumn.utilizationRate'),
          width: 150,
          disabled: true,
          placeholder: t('common.systemCalculation'),
          rate: true,
          // show: !hasBtnP('price-material'),
          dataIndex: 'utilizationRate',
          compType: 'InputNumber',
        },
      ],
    },
  ]);

  /**
   * 格式化材料查询结果的说明，`altMaterial`代表是否为替代料，`hasPrice`代表为是否存在价格
   * @param option
   */
  function getOriginPartNumberDesc(option: { altMaterial: 0 | 1; priority: number; hasPrice: boolean }) {
    let desc = '';
    if (option.altMaterial) {
      desc += `(${[t('dict.CommonCol.alternativeMaterials'), option.priority !== undefined && option.priority !== null ? option.priority.toString() : '']
        .filter(Boolean)
        .join(': ')})`;
    }

    if (option.hasPrice) {
      desc += `(${t('dict.CommonCol.hasPrice')})`;
    }

    return desc;
  }

  const formatMouldTableColumns = computed(() => [
    {
      // 模夹治具类型
      title: t('dict.QuotationColumn.moldType'),
      key: 'moldType',
      width: 150,
      // className: 'table-required',
      compType: 'Select',
      placeholder: t('dict.QuotationColumn.moldType'),
      mode: 'searchInput',
      fieldNames: {
        label: 'fullName',
        value: 'enCode',
      },
      assignFields: {},
      dataIndex: 'moldType',
      searchFunc: () => baseStore.getDictionaryData('MoldApply.MoldType'),
    },
    {
      // 价格
      title: t('dict.QuotationColumn.price'),
      key: 'price',
      width: 150,
      // className: 'table-required',
      placeholder: t('dict.QuotationColumn.price'),
      show: !hasBtnP('price-mould'),
      dataIndex: 'price',
      compType: 'InputNumber',
    },
    {
      // 寿命
      title: t('dict.QuotationColumn.moldLifespan'),
      key: 'moldLifespan',
      width: 150,
      // className: 'table-required',
      placeholder: t('dict.QuotationColumn.moldLifespan'),
      dataIndex: 'moldLifespan',
      compType: 'InputNumber',
    },
    {
      // 模具费用
      title: t('dict.QuotationColumn.mouldCost'),
      key: 'cost',
      width: 150,
      placeholder: t('common.systemCalculation'),
      helpMessage: t('dict.QuotationColumn.mouldCostTip'),
      disabled: true,
      show: !hasBtnP('price-mould'),
      dataIndex: 'cost',
      compType: 'InputNumber',
    },
  ]);

  const formatPackagingTableColumns = computed(() => [
    {
      // 料号
      title: t('dict.QuotationColumn.insideCode'),
      key: 'insideCode',
      // width: 220,
      placeholder: t('dict.QuotationColumn.insideCode'),
      compType: 'Select',
      mode: 'searchInput',
      // className: 'table-required',
      dataIndex: 'insideCode',
      fieldNames: {
        label: 'materialCode',
        value: 'materialCode',
      },
      assignFields: {
        materialDescription: 'materialDesc',
        purchasingUnit: 'purchasingUnit',
        purchaserId: 'developmentPurchaserId',
        priceActual: 'actualPurchasePrice',
      },
      searchFunc: v => getMaterialCodeList(v),
    },
    {
      // 描述
      title: t('dict.QuantitativePlanColumn.materialDesc'),
      key: 'materialDescription',
      width: 160,
      disabled: true,
      placeholder: t('dict.QuantitativePlanColumn.materialDesc'),
      dataIndex: 'materialDescription',
      compType: 'Input',
    },
    // {
    //   title: '原厂商材料型号',
    //   width: 200,
    //   dataIndex: 'materialTypeFromManufacturer',
    //   placeholder: '请输入原厂商材料型号',
    //   fieldNames: {
    //     label: 'materialTypeFromManufacturer',
    //     value: 'materialTypeFromManufacturer',
    //   },
    //   compType: 'Select',
    //   mode: 'searchInput',
    //   assignFields: {
    //     materialDescription: 'materialDesc',
    //     wholeUnit: 'purchasingUnit',
    //   },
    //   beforeParams: tableLineData => {
    //     console.log(tableLineData);
    //     return {
    //       insideCode: tableLineData['insideCode'],
    //     };
    //   },
    //   immediate: false,
    //   searchFunc: v => getMaterialPriceList(v),
    // },

    {
      // 包装数量(KPCS/个)
      title: t('dict.QuotationColumn.packQty'),
      key: 'packQty',
      width: 140,
      placeholder: t('dict.QuotationColumn.packQty'),
      // className: 'table-required',
      dataIndex: 'packQty',
      compType: 'InputNumber',
    },
    {
      // 开发采购
      title: t('dict.MaterialDevelopImport.purchaseUserName'),
      key: 'purchaserId',
      width: 160,
      placeholder: t('dict.MaterialDevelopImport.purchaseUserName'),
      dataIndex: 'purchaserId',
      // className: 'table-required',
      compType: 'UserSelect',
    },
    {
      // 采购单位
      title: t('dict.PriceInquiryColumn.purchasingUnit'),
      key: 'purchasingUnit',
      width: 80,
      disabled: true,
      placeholder: t('common.systemCalculation'),
      dataIndex: 'purchasingUnit',
      compType: 'Input',
    },
    {
      // 有无价格
      title: t('dict.QuotationColumn.hasPrice'),
      width: 100,
      dataIndex: 'hasPrice',
      compType: 'Select',
      placeholder: t('common.systemCalculation'),
      disabled: true,
      options: [
        {
          fullName: t('dict.NewsStatusEnum.Have'),
          enCode: 'true',
        },
        {
          fullName: t('dict.NewsStatusEnum.Nothing'),
          enCode: 'false',
        },
      ],
      fieldNames: {
        label: 'fullName',
        value: 'enCode',
      },
    },
    {
      // 成本中心价 标题改为`材料单价`
      title: t('common.unitPriceOfMaterials'),
      key: 'price',
      width: 140,
      disabled: true,
      placeholder: t('common.systemCalculation'),
      relevancy: true,
      helpMessage: [t('dict.QuotationColumn.costCenterPriceTip1'), t('dict.QuotationColumn.costCenterPriceTip2')],
      show: !hasBtnP('price-packaging'),
      dataIndex: 'price',
      compType: 'InputNumber',
    },
    // {
    //   // 底价 隐藏不显示
    //   title: t('dict.PurchaseQuotationColumn.actualPurchasePrice'),
    //   key: 'price',
    //   width: 140,
    //   disabled: true,
    //   relevancy: true,
    //   placeholder: t('common.systemCalculation'),
    //   helpMessage: [t('dict.QuotationColumn.costCenterPriceTip1'), t('dict.QuotationColumn.costCenterPriceTip2')],
    //   show: !hasBtnP('price-packaging'),
    //   dataIndex: 'priceActual',
    //   compType: 'InputNumber',
    // },

    {
      // 成本中心价费用分摊 标题改为`材料成本`
      title: t('common.materialCost'),
      key: 'cost',
      width: 180,
      disabled: true,
      dataIndex: 'cost',
      placeholder: t('common.systemCalculation'),
      helpMessage: [t('dict.QuotationColumn.packagingCostTip')],
      // helpMessage: '价格/包装数量',
      show: !hasBtnP('price-packaging'),
      compType: 'InputNumber',
    },
    // {
    //   // 底价费用分摊 隐藏不显示
    //   // 总面积/ ( 购买原材料宽 / 报价工程录入原材料宽) 注意去小数位取整*（购买长度/材料步距）*模数*（1-制程损耗）
    //   title: t('dict.QuotationColumn.packagingCostActual'),
    //   width: 160,
    //   helpMessage: [t('dict.QuotationColumn.packagingCostActualTip')],
    //   disabled: true,
    //   show: !hasBtnP('price-packaging'),
    //   dataIndex: 'costActual',
    //   placeholder: t('common.systemCalculation'),
    //   key: 'costActual',
    //   compType: 'InputNumber',
    // },
  ]);

  const formatSiliconeTableColumns = computed(() => [
    {
      // 料号
      title: t('dict.QuotationColumn.insideCode'),
      key: 'insideCode',
      width: 220,
      compType: 'Select',
      mode: 'searchInput',
      // className: 'table-required',
      dataIndex: 'insideCode',
      fieldNames: {
        label: 'materialCode',
        value: 'materialCode',
      },
      assignFields: {
        materialDescription: 'materialDesc',
        purchasingUnit: 'purchasingUnit',
        price: 'purchasingUnit',
        purchaserId: 'developmentPurchaserId',
      },
      searchFunc: v => getMaterialCodeList(v),
    },
    // {
    //   title: '新材料厂商型号',
    //   width: 200,
    //   dataIndex: 'materialTypeFromManufacturer',
    //   fieldNames: {
    //     label: 'materialTypeFromManufacturer',
    //     value: 'materialTypeFromManufacturer',
    //   },
    //   compType: 'Select',
    //   mode: 'searchInput',
    //   assignFields: {
    //     materialDescription: 'materialDesc',
    //     wholeUnit: 'purchasingUnit',
    //     price: 'purchasingUnit',
    //   },
    //   beforeParams: tableLineData => {
    //     console.log(tableLineData);
    //     return {
    //       insideCode: tableLineData['insideCode'],
    //     };
    //   },
    //   immediate: false,
    //   searchFunc: v => getMaterialPriceList(v),
    // },
    {
      // 新材料厂商型号
      title: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
      width: 200,
      dataIndex: 'materialTypeFromManufacturer',
      placeholder: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
      compType: 'Input',
    },
    {
      // 描述
      title: t('dict.QuantitativePlanColumn.materialDesc'),
      key: 'materialDescription',
      width: 160,
      placeholder: t('dict.QuantitativePlanColumn.materialDesc'),
      disabled: true,
      dataIndex: 'materialDescription',
      compType: 'Input',
    },
    {
      // 用量
      title: t('dict.QuotationColumn.useQtyOfG'),
      key: 'useQty',
      width: 100,
      placeholder: t('dict.QuotationColumn.useQtyOfG'),
      dataIndex: 'useQty',
      // className: 'table-required',
      compType: 'InputNumber',
    },
    {
      // 不良率 显示标题改为`制程损耗`
      title: t('dict.QuotationColumn.singleProcessLosses'),
      key: 'defectRate',
      width: 100,
      placeholder: t('dict.QuotationColumn.singleProcessLosses'),
      dataIndex: 'defectRate',
      // className: 'table-required',
      rate: true,
      compType: 'InputNumber',
    },
    {
      // 开发采购
      title: t('dict.MaterialDevelopImport.purchaseUserName'),
      key: 'purchaserId',
      width: 160,
      placeholder: t('dict.MaterialDevelopImport.purchaseUserName'),
      // className: 'table-required',
      dataIndex: 'purchaserId',
      compType: 'UserSelect',
    },

    {
      // 采购单位
      title: t('dict.PriceInquiryColumn.purchasingUnit'),
      key: 'purchasingUnit',
      width: 100,
      placeholder: t('common.systemCalculation'),
      disabled: true,
      dataIndex: 'purchasingUnit',
      compType: 'Input',
    },
    {
      // 有无价格
      title: t('dict.QuotationColumn.hasPrice'),
      width: 100,
      dataIndex: 'hasPrice',
      compType: 'Select',
      placeholder: t('common.autoCarry'),
      disabled: true,
      options: [
        {
          fullName: t('dict.NewsStatusEnum.Have'),
          enCode: 'true',
        },
        {
          fullName: t('dict.ResistStaticElectricityEnum.Nothing'),
          enCode: 'false',
        },
      ],
      fieldNames: {
        label: 'fullName',
        value: 'enCode',
      },
    },
    {
      // 成本中心价 标题改为`材料单价`
      title: t('common.unitPriceOfMaterials'),
      key: 'price',
      width: 120,
      disabled: true,
      relevancy: true,
      placeholder: t('common.systemCalculation'),
      helpMessage: [t('dict.QuotationColumn.costCenterPriceTip1'), t('dict.QuotationColumn.costCenterPriceTip2')],
      show: !hasBtnP('price-silicone'),
      dataIndex: 'price',
      compType: 'InputNumber',
    },
    // {
    //   // 底价
    //   title: t('dict.PurchaseQuotationColumn.actualPurchasePrice'),
    //   key: 'price',
    //   width: 140,
    //   disabled: true,
    //   relevancy: true,
    //   helpMessage: [t('dict.QuotationColumn.costCenterPriceTip1'), t('dict.QuotationColumn.costCenterPriceTip2')],
    //   placeholder: t('common.systemCalculation'),
    //   show: !hasBtnP('price-silicone'),
    //   dataIndex: 'priceActual',
    //   compType: 'InputNumber',
    // },

    {
      // 成本中心价费用分摊 标题改为`材料成本`
      title: t('common.materialCost'),
      key: 'cost',
      width: 180,
      placeholder: t('common.systemCalculation'),
      disabled: true,
      helpMessage: [t('dict.QuotationColumn.siliconeCostTip')],
      show: !hasBtnP('price-silicone'),
      dataIndex: 'cost',
      compType: 'InputNumber',
    },
    // {
    //   // 底价费用分摊
    //   // 总面积/ ( 购买原材料宽 / 报价工程录入原材料宽) 注意去小数位取整*（购买长度/材料步距）*模数*（1-制程损耗）
    //   title: t('dict.QuotationColumn.packagingCostActual'),
    //   width: 160,
    //   helpMessage: [t('dict.QuotationColumn.siliconecostActualTip')],
    //   disabled: true,
    //   show: !hasBtnP('price-silicone'),
    //   dataIndex: 'costActual',
    //   placeholder: t('common.systemCalculation'),
    //   key: 'costActual',
    //   compType: 'InputNumber',
    // },
  ]);

  async function init(data) {
    const { data: wagerateList } = await getBaseDataWagerateList({});
    console.log(wagerateList, 'wagerateList');
    setFieldsValue({
      wageRateId: wagerateList[0].id,
    });
    state.showReject = data.showReject;
    state.isCommit = data.isCommit;
    console.log(data.showSyncPrice, 'data.showSyncPricedata.showSyncPricedata.showSyncPrice');
    state.showSyncPrice = data.showSyncPrice;
    mode.value = data.mode;
    if (data.mode == 'view') {
      // state.pageType = 'view';
      state.pageType = 'edit';
      nextTick(() => {
        setProps({
          disabled: true,
        });
      });
    } else {
      state.pageType = 'edit';
      mode.value = 'edit';
    }
    state.fieldsValue.wageRate = wagerateList[0];
    // TODO 暂时默认非保税 正确为从报价需求带出
    state.fieldsValue.isBonded = 'false';
    state.loading = true;
    changeLoading(true);
    // getTypeOps();
    console.log(data, '---------------------------------');
    state.cacheList = data.cacheList;
    state.index = data.index;
    const currentData = data.cacheList[data.index];
    state.currentData = currentData;
    // getBaseDetail(currentData);
    console.log(currentData, 'currentData-----------');
    getBomMessage(currentData.bomId);
    buildBaseInfo(currentData);

    registerMouseEvent();
  }

  function handleUnpack() {
    bomContent.value.style.transition = 'all 0.5s';

    // nextTick(() => {
    //   bomContent.value.style.flex = `0 0 0px`;
    //   mainContent.value.style.flex = `1 1 auto`;
    //   bomContent.value.style.transition = 'none';
    // })
    setTimeout(() => {
      if (state.isPack) {
        bomContent.value.style.flex = `0 0 10px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      } else {
        bomContent.value.style.flex = `0 0 280px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      }
    }, 100);
  }

  function setValues(data) {
    const { processList, materialList, moldList, packingMaterialList, parentPartInfo, siliconePartList } = data;
    state.ProcessList = processList.map(item => {
      return {
        ...item,
        yield: item.yield * 100,
        fpy: item.fpy * 100,
        utilizationRate: item.utilizationRate * 100,
        // productionType: item.productionType + '',
        equipmentLaborRate: item.equipmentLaborRate.toString(),
        periodOfDepreciation: item.periodOfDepreciation.toString(),
      };
    });
    state.MaterialList = materialList.map(item => {
      return {
        ...item,
        'material-group': '',
        'specification-group': '',
        'whole-spec-group': '',
        singleProcessLosses: item.singleProcessLosses * 100,
        newMaterial: item.newMaterial ? item.newMaterial + '' : item.newMaterial,
        hasPrice: item.hasPrice ? item.hasPrice + '' : item.hasPrice,
        singleUseQty: item.singleUseQty ? item.singleUseQty + '' : item.singleUseQty,
        // productionType: item.productionType ? item.productionType + '' : item.productionType,
        purchaserId: item.hasPrice ? null : item.purchaserId,
      };
    });
    state.MouldList = moldList.map(item => {
      return {
        ...item,
      };
    });
    state.PackagingList = packingMaterialList.map(item => {
      return {
        ...item,
        hasPrice: item.hasPrice + '',
        purchaserId: item.hasPrice ? null : item.purchaserId,
      };
    });
    state.SiliconeList = siliconePartList.map(item => {
      return {
        ...item,
        hasPrice: item.hasPrice + '',
        defectRate: item.defectRate * 100,
        purchaserId: item.hasPrice ? null : item.purchaserId,
      };
    });
    setFieldsValue({
      ...state['currentData'],
      ...parentPartInfo,
      isBonded: parentPartInfo.isBonded ? parentPartInfo.isBonded + '' : 'false',
      managementRate: parentPartInfo.managementRate * 100,
    });
    processTableRef.value?.init();
    materialTableRef.value?.init();
    mouldTableRef.value?.init();
    packagingTableRef.value?.init();
    siliconeTableRef.value?.init();
    state.loading = false;
    changeLoading(false);
  }

  function handleCopyPCC() {
    openUpgradeModal(true, {
      InsidePartNumber: state.currentData.insidePartNumber,
    });
  }

  async function getBomMessage(bomId) {
    if (bomId) {
      const { code, data } = await getQuotationBOM({ bomId: bomId });
      console.log(data);
      if (code == 200) {
        state.treeData = data;
        const { code: processCode, data: bomData } = await getQuotationBOMDetail(data[0]);
        if (processCode == 200) {
          setValues(bomData);
        }
      } else {
        state.treeData = [];
      }
    } else {
      state.ProcessList = [];
      state.MaterialList = [];
      state.MouldList = [];
      state.PackagingList = [];
      state.SiliconeList = [];
      processTableRef.value.init();
      materialTableRef.value.init();
      mouldTableRef.value.init();
      packagingTableRef.value.init();
      siliconeTableRef.value.init();
      setTimeout(() => {
        state.loading = false;
        changeLoading(false);
      }, 500);
      state.treeData = [];
    }
  }

  function handleCommit() {
    state.loading = true;
    changeLoading(true);
    state.loading = true;
    commitQuotation({
      id: state.currentData.id,
    })
      .then(({ code, msg }) => {
        if (code == 200) {
          const { cacheList } = state;
          const index = state.cacheList.findIndex(item => item.id === state.currentData.id);
          if (index !== state.cacheList.length - 1) {
            state['cacheList'][index]['currentNode'] = 'Confirm';
            handleNext();
          }
          message.success(msg);
          console.log(cacheList, 'cacheList');
          console.log(index, 'index');
          // closePopup();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        state.loading = false;
        emit('reload');
        changeLoading(false);
      });
  }

  async function handleSaveAction(type) {
    const fieldsValue = getFieldsValue();
    const processList = processTableRef.value.getData().map(item => {
      return {
        ...item,
        // productionType: null,
        yield: item.yield / 100,
      };
    });
    console.log(processList, 'processListprocessListprocessList');
    let materialList = [];
    try {
      materialList = materialTableRef.value.getData().map((item, index) => {
        // console.log(item, 'item');
        // if ((!item.hasPrice || item.hasPrice == 'false') && !item.purchaserId) {
        //   throw new Error(`请选择材料中第${index + 1}条采购员`);
        // }
        return {
          ...item,
          singleProcessLosses: item.singleProcessLosses / 100,
          singleUseQty: isNaN(item.singleUseQty) || item.singleUseQty == 'NaN' ? null : item.singleUseQty,
        };
      });
    } catch (e) {
      return message.error(e.message);
    }
    const moldList = mouldTableRef.value.getData();
    let packingMaterialList = [];
    try {
      packingMaterialList = packagingTableRef.value.getData().map((item, index) => {
        // if ((item.hasPrice && item.hasPrice == 'false') && !item.purchaserId) {
        //   throw new Error(`请选择包材中第${index + 1}条采购员`);
        // }
        return {
          ...item,
          hasPrice: item.hasPrice ? item.hasPrice + '' : null,
        };
      });
    } catch (e) {
      return message.error(e.message);
    }

    let siliconePartList = [];
    try {
      siliconePartList = siliconeTableRef.value.getData().map((item, index) => {
        // console.log(item);
        // if ((item.hasPrice && item.hasPrice == 'false') && !item.purchaserId) {
        //   throw new Error(`请选择硅胶件中第${index + 1}条采购员`);
        // }
        return {
          ...item,
          defectRate: item.defectRate / 100,
        };
      });
    } catch (e) {
      return message.error(e.message);
    }
    console.log(processList, 'processData');
    console.log(materialList, 'materialData');
    console.log(moldList, 'mouldData');
    console.log(packingMaterialList, 'PackagingData');
    console.log(siliconePartList, 'siliconeData');

    if (moldList.length === 1 && !moldList[0]['moldType']) {
      moldList.shift();
    }
    if (packingMaterialList.length === 1 && !packingMaterialList[0]['insideCode']) {
      packingMaterialList.shift();
    }
    if (siliconePartList.length === 1 && !siliconePartList[0]['insideCode']) {
      siliconePartList.shift();
    }

    console.log(state.currentData, 'state.currentDatastate.currentDatastate.currentData');
    const PDP = state.currentData.members.find(item => item.configType === 'PDPerson');
    console.log(PDP, 'PDP');
    state.loading = true;
    changeLoading(true);
    const params = {
      ...state.currentData,
      ...fieldsValue,
      quotationEngineerId: PDP?.memberId,
      quotationEngineerName: PDP?.memberName,
      parentPartInfo: {
        ...fieldsValue,
        managementRate: fieldsValue.managementRate / 100,
      },
      processList,
      materialList,
      moldList,
      packingMaterialList,
      siliconePartList,
    };
    delete params.purpose;
    console.log(3333);

    if (type == 'commit') {
      params.saveAndCommit = true;
    } else {
      params.saveAndCommit = false;
    }
    if (params.saveAndCommit) {
      if (!validateParams(params)) return;
    }
    console.log(444);

    try {
      if (!state.currentData?.bomId) {
        const res = await addQuotationFinishedParts(params);
        message.success(t('component.batchImport.saveSuccess'));
        getBomMessage(state.currentData?.bomId);
        console.log(555);
        emit('reload');
        closePopup();
      } else {
        if (state.halfSign == 'add') {
          params.quotationId = params.id;
          params.bomId = state.halfBomId;
          delete params.id;
          const { code, data } = await addQuotationHalfFinishedParts(params);
          if (code == 200) {
            message.success(t('component.batchImport.saveSuccess'));
            getBomMessage(state.currentData?.bomId);
            emit('reload');
            closePopup();
          }
          return;
        }
        if (state.halfSign == 'edit') {
          params.quotationId = params.id;
          params.bomId = state.halfBomId;
          const { code, data } = await updateQuotationHalfFinishedParts(params);
          if (code == 200) {
            message.success(t('component.batchImport.saveSuccess'));
            getBomMessage(state.currentData?.bomId);
            emit('reload');
            closePopup();
          }
          return;
        }
        const res = await updateQuotationFinishedParts(params);
        console.log(res);
        if (res.code == 200) {
          changeLoading(false);
          message.success(t('component.batchImport.saveSuccess'));
          getBomMessage(state.currentData?.bomId);
          emit('reload');
          closePopup();
        }
      }
    } catch (e) {
      state.loading = false;
      changeLoading(false);
    }
  }

  function handleUpgradeSubmit(selectRow) {
    console.log(state);
    const row = selectRow[0];
    if (!row) return createMessage.warning(t('dict.QuotationColumn.referenceSuccessfulTip'));
    createFromPcc({
      ...row,
      pccId: row.id,
      qrApplyCode: state.currentData.applyCode,
    }).then(({ code, data }) => {
      if (code == 200) {
        getBomMessage(data);
        createMessage.success(t('dict.QuotationColumn.referenceSuccessful'));
        closeUpgradeModal();
        closePopup();
      }
    });
  }

  function registerMouseEvent() {
    divider.value.addEventListener('mousedown', e => {
      isDragging = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;

      const containerRect = container.value.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      bomContent.value.style.flex = `0 0 ${offsetX}px`;
      mainContent.value.style.flex = `1 1 auto`;
      state.isPack = offsetX >= 140;
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    });
  }

  // 引用历史记录
  function handleHistory() {
    openQuotaModal(true, {
      menuDocType: 'Quotation',
    });
  }

  function handleScroll(e) {
    const NAV_MAP = {
      'base-info': 0,
      process: 1,
      material: 2,
      mould: 3,
      packaging: 4,
      silicone: 5,
    };
    const ele = e.target;
    const dataIndex = ele.getAttribute('data-index');
    const list = navBox.value.children;

    if (dataIndex == null || NAV_MAP[dataIndex] === state.navIndex) return;
    ele.classList.add('active');
    list[state.navIndex].classList.remove('active');
    state.navIndex = NAV_MAP[dataIndex];
    const target = document.querySelector(`#${dataIndex}`);
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  async function getBaseDetail(data) {
    console.log(data);
    const { code, msg } = await getQuotationDetail(data);
  }

  // 基础信息
  function buildBaseInfo(data) {
    const { qrApplyCode, purpose, productDesc, insidePartNumber, factory, qrApplyUserName, terminalCustomerProjectCode, members, phase } = data;

    setFieldsValue({
      qrApplyUserName,
      qrApplyCode,
      factory,
      terminalCustomerProjectCode,
      insidePartNumber,
      productDesc,
      PDPerson: members?.find(item => item.configType === 'PDPerson')?.memberName,
      purpose,
      phase,
    });
    updateSchema([
      {
        field: 'qrApplyUserName',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'qrApplyCode',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'factory',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'terminalCustomerProjectCode',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'insidePartNumber',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'productDesc',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'PDPerson',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'purpose',
        componentProps: {
          disabled: true,
        },
      },
    ]);

    // return [
    //   {
    //     label: '报价需求单号',
    //     value: qrApplyCode,
    //   },
    //   {
    //     label: '产品内部料号',
    //     value: insidePartNumber,
    //   },
    //   {
    //     label: '申请人',
    //     value: qrApplyUserName,
    //   },
    //   {
    //     label: '终端项目代码',
    //     value: terminalCustomerProjectCode,
    //   },
    //   {
    //     label: '终端客户',
    //     value: `${terminalCustomerName}(${terminalCustomerCode})`,
    //   },
    //   {
    //     label: '工厂',
    //     value: factory,
    //   },
    //   {
    //     label: '报价工程',
    //     value: members.find(item => item.configType === 'PDPerson')?.memberName,
    //   },
    //   {
    //     label: '产品描述',
    //     value: productDesc,
    //   },
    //   {
    //     label: '报价用途',
    //     value: purpose,
    //   },
    //   {
    //     label: '产品线代码',
    //     value: `${productLineName}-${productLineCode}`,
    //   },
    // ];
  }

  function handleDblClick(event, value) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.QuotationColumn.enterClearConfirm'),
      onOk: async () => {
        state.loading = true;
        changeLoading(true);
        state.ProcessList = [];
        state.MaterialList = [];
        state.MouldList = [];
        state.PackagingList = [];
        state.SiliconeList = [];
        processTableRef.value.init();
        materialTableRef.value.init();
        mouldTableRef.value.init();
        packagingTableRef.value.init();
        siliconeTableRef.value.init();
        updateSchema([
          {
            field: 'phase',
            componentProps: {
              disabled: true,
            },
          },
          {
            field: 'productSpec',
            componentProps: {
              disabled: true,
            },
          },
        ]);
        setFieldsValue({
          wageRateId: '',
          moq: '',
          isBonded: 'false',
          managementRate: '',
          costUnit: '',
        });

        const { code, data } = await getQuotationBOMDetail(value);
        if (code != 200) return;
        const { processList } = data;
        if (processList && processList?.length > 0) {
          setValues(data);

          // 修改
          state.halfSign = 'edit';
          state.halfBomId = value.id;
        } else {
          // 新增
          state.halfSign = 'add';
          state.halfBomId = value.id;
          state.loading = false;
          changeLoading(false);
        }
      },
    });
  }

  async function getTypeOps() {
    state.LaborRateTypeEnum = await baseStore.getDictionaryData('LaborRateTypeEnum');
    console.log(state.LaborRateTypeEnum, 'ddddd');
    console.log(await baseStore.getDictionaryData('QuotationRequirements.Purpose'));
    state.PurposeEnum = await baseStore.getDictionaryData('QuotationRequirements.Purpose');
    console.log(state.PurposeEnum, 'ssss');
  }

  function getProcessData() {
    // console.log();
    nextTick(() => {
      const data = processTableRef.value.getData();
      console.log(data, 'processData11111111111111');
      state.processData = data;
    });
  }

  function handleSyncPrice() {
    state.loading = true;
    changeLoading(true);
    // const rows = waitGetSelectRowKeys();
    // console.log(rows);
    // const filterRows = rows.filter(item => item.originType == 1);
    // if (filterRows.length <= 0) return createMessage.warning('请选择工程报价的数据同步！');
    updatePrice([state.currentData.id]).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        getBomMessage(state.currentData.bomId);
        state.loading = false;
      } else {
        createMessage.error(msg);
      }
    });
  }

  function validateParams(params) {
    console.log(params, 'paramsparamsparamsparams');
    const { productSpec, processList, materialList, moldList, packingMaterialList, siliconePartList } = params;
    try {
      if (!productSpec) {
        throw new Error(t('dict.QuotationColumn.selectProductSpec'));
      }
      processList.forEach((item, index) => {
        if (!item.productionType) {
          throw new Error(t('dict.QuotationColumn.selectProcessStepProductionType', index + 1));
        } else if (!item.processCode) {
          throw new Error(t('dict.QuotationColumn.selectProcessStep', index + 1));
        } else if (!item.capacity) {
          throw new Error(t('dict.QuotationColumn.selectProcessStepCapacity', index + 1));
        }
      });

      materialList.forEach((item, index) => {
        if (!item.insideCode && !item.materialTypeFromManufacturer) {
          throw new Error(t('dict.QuotationColumn.materialInputError', index + 1));
        } else if (!item.singleWidth) {
          throw new Error(t('dict.QuotationColumn.selectSingMaterialWidth', index + 1));
        } else if (!item.singleStepDistance) {
          throw new Error(t('dict.QuotationColumn.selectMaterialPitch', index + 1));
        } else if (!item.singleModulus) {
          throw new Error(t('dict.QuotationColumn.selectMaterialModulus', index + 1));
        } else if (item.hasPrice && item.hasPrice == 'false' && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectMaterialPurchaser', index + 1));
        } else if (!item.wholeWidth && !item.materialTypeFromManufacturer) {
          // 不存在`新材料厂商型号`时，`宽幅`才是必填的
          throw new Error(t('dict.QuotationColumn.selectMaterialWidth', index + 1));
        } else if (!item.wholeLength && !item.materialTypeFromManufacturer) {
          // 不存在`新材料厂商型号`时，`长度`才是必填的
          throw new Error(t('dict.QuotationColumn.selectMaterialLength', index + 1));
        }
      });
      moldList.forEach((item, index) => {
        if (!item.moldType) {
          return;
          // throw new Error(`请选择模具第${index + 1}条的模夹治具类型`)
        }
        if (!item.moldLifespan) {
          throw new Error(t('dict.QuotationColumn.selectMoldLifespan', index + 1));
        } else if (!item.price) {
          throw new Error(t('dict.QuotationColumn.selectMoldPrice', index + 1));
        }
      });
      packingMaterialList.forEach((item, index) => {
        if (!item.insideCode) {
          return;
          // throw new Error(`请选择模包材第${index + 1}条的料号`);
        }
        if (!item.packQty) {
          throw new Error(t('dict.QuotationColumn.selectPackagingMaterialQuantity', index + 1));
        } else if (item.hasPrice && item.hasPrice == 'false' && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectPackagingMaterialPurchaser', index + 1));
        }
      });
      siliconePartList.forEach((item, index) => {
        if (!item.insideCode) {
          return;
          // throw new Error(`请选择模包材第${index + 1}条的料号`);
        }
        if (!item.useQty) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartUsageQuantity', index + 1));
        } else if (isNullOrUnDef(item.defectRate)) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartDefectRate', index + 1));
        } else if (item.hasPrice && item.hasPrice == 'false' && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartPurchaser', index + 1));
        }
      });
    } catch (e) {
      createMessage.warning(e.message);
      changeLoading(false);
      state.loading = false;
      return false;
    }
    return true;
  }

  function handleDrawView() {
    const { currentData } = state;
    openDrawViewModal(true, {
      id: currentData.desensitizedDrawingsId,
    });
  }

  // 对引用的料号进行覆盖处理
  async function handleQuotaModal(selectRow) {
    const row = selectRow;
    if (!row) return createMessage.warning(t('common.selectText'));
    console.log(row);
    const { code, data } = await postHistoryQuotation({
      docType: row.docType,
      docId: row.docId,
      // 如果是to make 则没有bomId
      id: state.currentData.bomId ? state.currentData.id : null,
      qrApplyCode: state.currentData.qrApplyCode,
      insidePartNumber: state.currentData.insidePartNumber,
    });
    if (code == 200) {
      state['cacheList'][state.index] = {
        ...state['cacheList'][state.index],
        ...data,
      };
      console.log(state['cacheList'][state.index], "state['cacheList'][state.index]");
      init({
        // ...data,
        showReject: state.showReject,
        isCommit: state.isCommit,
        showSyncPrice: state.showSyncPrice,
        mode: state.mode,
        cacheList: state.cacheList,
        index: state.index,
      });
    }

    // const res = await getRecordTransfer(row.docId);
    // if (res.code) {
    // 	const { data } = res;
    // 	handleBaseQuotaDetail(data);
    // 	handlePackDetail(data);
    // 	handleStepDetail(data.engineeringStepDistances);
    // 	handleMetaria(data.engineeringMaterials);
    // 	handleProcessDetail(data.engineeringProcesses);
    // 	createMessage.success(t('sys.api.operationSuccess'));
    // }
  }
</script>

<style scoped lang="less">
  .container-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .bom-content {
    //width: 20%;
    flex: 0 0 280px;
    padding: 0 16px 16px 0;
    margin-top: 8px;
    min-width: 5%;
    max-width: 60%;
    height: 100%;
    overflow-x: scroll;
    position: relative;

    .drag-box {
      position: absolute;
      right: 10px;
      height: 100%;
      display: flex;
      align-items: center;

      .drag-ctrl {
        width: 3px;
        height: 200px;
        background: #ccc;
        cursor: ew-resize;
        top: 50%;
        transform: translate(-50%);
      }
    }
  }

  .main-content {
    flex: 5;
    overflow-x: auto;
    height: 100%;
  }

  .line {
    height: 1px;
    width: 100%;
    background: rgb(219 219 219);
    margin-bottom: 8px;
  }

  .bom-header {
    position: relative;
    height: 100%;

    //.drag-box {
    //  position: absolute;
    //  height: 100%;
    //  right: 0;
    //  background: #ccc;
    //  width: 2px;
    //}
    //
    //.drag-ctrl {
    //  height: 200px;
    //  position: absolute;
    //  top: 50%;
    //  transform: translateY(-50%);
    //  cursor: ew-resize;
    //}
  }

  .bom-list {
    //border-top: 1px solid #333;
    box-sizing: border-box;
    //height: 100%;
    //height: 600px;
  }

  .main-nav {
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 10;
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #dbdbdb;

    .nav-item {
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: center;
      gap: -3px;
      color: #666;
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid #ff7b00;
      color: #1a1a1a;
      transition: all 0.3s;
    }
  }

  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 10px;
  }

  :deep(.ant-form-vertical .ant-form-item-label) {
    padding: 0 0 3px;
  }

  :deep(.subtitle-container) {
    padding-bottom: 0;
  }

  :deep(.basic-content-wrap) {
    margin-right: 3px;
  }

  :deep(.form-required) {
    & > div > div > label::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  :deep(.table-required) {
    & > span:first-child::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
</style>
