<script setup lang="ts">
  import { handleUnpack } from '/@/views/engineering/quotationBom/utils';
  import { Subtitle } from '/@/components/Subtitle';
  import FileUpload from '/@/views/engineering/PCCBeta/components/PccFileUpload/FileUpload.vue';
  import ProcessFlow from '/@/views/engineering/PCCBeta/components/ProcessFlow/ProcessFlow.vue';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import NavBar from '/@/views/engineering/PCCBeta/components/NavBar.vue';
  import ProcessFlowForm from '/@/views/engineering/PCCBeta/components/ProcessFlow/Form.vue';
  import PccPackage from '/@/views/engineering/PCCBeta/components/PccPackage/PccPackage.vue';
  import BasicTree from '../../../../components/Tree/src/BasicTree.vue';
  import PccHistory from '/@/views/engineering/PCCBeta/components/PccHistory/PccHistory.vue';
  import FormWrapper from '/@/views/engineering/PCCBeta/components/FormWrapper.vue';
  import PccSemiFinished from './PccSemiFinished/PccSemiFinished.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { computed, nextTick, reactive, ref, toRaw, toRefs, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addFinishedPartsBomPcc,
    addHalfFinishedPartsBomPcc,
    commitPcc,
    getBomDetail,
    getBomStructure,
    getECNByPartNumber,
    getFactorySap,
    getListProjectClass,
    getMaterialAreaChildren,
    getPccDetail,
    getPccRevisionHistory,
    updateFinishedPartsBomPcc,
    updateHalfFinishedPartsBomPcc,
    uploadInstallFile,
  } from '/@/api/engineering/pcc';
  import { isEmpty, isExist, isFunction, isNullOrUnDef } from '/@/utils/is';
  import { bignumber, multiply } from 'mathjs';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { materialRowData, technologyRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { printPCCDetail, generatePdfByIds } from '/@/views/engineering/pcc/pccApply/components/print';
  import { usePccMaterial } from './PccMaterial/use-pccMaterial';
  import { usePccTestStrip } from '/@/views/engineering/PCCBeta/components/TestStrip/usePccTestStrip';
  import { cloneDeep, uniqBy, merge, omit, get } from 'lodash-es';
  import { useUserStore } from '/@/store/modules/user';
  import { useBaseStore } from '/@/store/modules/base';
  import { checkWidthMatch } from '/@/views/engineering/PCCBeta/components/PccMaterial/checkWidthMatch';
  import useKeepScroll from '/@/hooks/event/useKeepScroll';
  import { calculateUtilizationRate } from '/@/views/engineering/PCCBeta/utils/calcDowntimeOneHourUtilizationRate';
  import { calcMaterialUseQty, calcSemiFinishedUseQty, calcSingleRowUseQty } from '/@/views/engineering/PCCBeta/components/utils/useQty';
  import { calcCapacity } from '/@/views/engineering/PCCBeta/components/utils/buildCapacity';
  import { normalizeSapFactoryValue } from '/@/views/engineering/PCCBeta/components/utils/normalizeSapFactoryValue';
  import { findNodeById } from '/@/views/engineering/PCCBeta/components/utils/findNodeById';

  const { createConfirm } = useMessage();

  const userStore = useUserStore();
  const baseStore = useBaseStore();
  let packSubmitLock = true;
  let packListBack = {};
  let semiSubmitLock = true;
  let semiListBack = [];
  let testStripSubmitLock = true;
  let testStripListBack = [];
  let historyFlag = null;
  let skipPostSubmitRefresh = false;

  const { t } = useI18n();

  const emit = defineEmits(['register', 'changeLoading', 'closePopup', 'ecnOpenModal', 'changeCurrent', 'reload']);

  const state = reactive({
    isPack: false,
    loadingBom: false,
    canEditFactory: false,
    customerFileList: [],
    installImageList: [],
    mode: ModeTypeEnum.VIEW,
    cacheList: [],
    index: 0,
    treeData: [],
    pccDetailData: {},
    disabled: false,
    type: 1,
  });

  const bomContent = ref<HTMLElement | null>(null);
  const mainContent = ref<HTMLElement | null>(null);

  const ProcessFlowFormRef = ref(null);
  const ProcessFlowRef = ref(null);
  const PccSemiFinishedRef = ref(null);
  const PccPackageRef = ref(null);
  const FileUploadRef = ref(null);
  const PccHistoryRef = ref(null);

  const { createMessage } = useMessage();

  const divider = ref(null);
  const container = ref(null);
  const mainScroll = ref<ElRef>(null);

  interface VersionState {
    creatorTime: string;
    revisionRemark: string;
  }

  const versionState = reactive<VersionState>({
    creatorTime: '',
    revisionRemark: '',
  });

  const [PccMaterial, { reloadData: materialReloadData, materialSetState, getDataSource: materialGetDataSource, setDisabled: materialSetDisabled }] =
    usePccMaterial();
  const [PccTestStrip, { reloadData: testStripReload, loadData: testStripLoad, getDataSource: testStripGetDataSource, setDisabled: testStripDistable }] =
    usePccTestStrip();

  const { isPack, treeData, loadingBom, cacheList, index, mode } = toRefs(state);
  const formWrapperRef = ref(null);

  const currentData = computed(() => {
    return state.cacheList[state.index];
  });

  function normalizeSapFactoryInfo(info?: Record<string, any> | null) {
    if (!info) return info;
    const originalSapFactoryName = typeof info.sapFactoryName === 'string' ? info.sapFactoryName : null;
    const originalSapFactory = typeof info.sapFactory === 'string' ? info.sapFactory : null;
    const sourceValue = originalSapFactoryName ?? originalSapFactory;
    if (!sourceValue) return info;
    const normalizedSapFactory = normalizeSapFactoryValue(sourceValue);
    return {
      ...info,
      sapFactory: normalizedSapFactory,
      sapFactoryName: originalSapFactoryName ?? sourceValue,
    };
  }

  async function getNormalizedFormValues() {
    const values = await formWrapperRef.value?.getValues?.();
    if (!values) return values;
    return {
      ...values,
      baseInfo: normalizeSapFactoryInfo(values.baseInfo),
      prodInfo: normalizeSapFactoryInfo(values.prodInfo),
    };
  }

  async function getNormalizedProdInfoFieldsValue() {
    const prodInfo = await formWrapperRef.value?.getProdInfoFieldsValue?.();
    return normalizeSapFactoryInfo(prodInfo);
  }

  function normalizeSemiFinishedVersion(baseInfo: Record<string, any> = {}) {
    if (state.type !== 1) {
      return { ...baseInfo, version: 0 };
    }
    return baseInfo;
  }

  function handleScroll(top) {
    if (Number.isNaN(top) || !mainScroll.value) return;
    const warp = mainScroll.value.getScrollWrap();
    mainScroll.value.scrollTo(warp.scrollTop + top - 230);
  }

  const isEditMode = computed(() => {
    return state.mode === ModeTypeEnum.EDIT || state.mode === ModeTypeEnum.AUDIT_EDIT;
  });

  const currentRequestId = ref(0);
  const treeRequestId = ref(0);
  const loadingState = reactive({
    manual: false,
    detail: false,
    tree: false,
  });

  async function init(data) {
    currentRequestId.value++;
    skipPostSubmitRefresh = false;
    state.showDialog = undefined;
    state.mode = data.mode;
    packSubmitLock = true;
    semiSubmitLock = true;
    const { cacheList, index } = data;
    state.cacheList = cacheList;
    state.index = index;
    state.showDialog = data.showDialog;
    state.shouldInit = data.shouldInit;
    // state.canEditFactory = data.canEditFactory
    if (data.canEditFactory) {
      formWrapperRef.value.enableEditFactory();
    }
    await nextTick();

    // 如果列表数据为空，直接重置数据
    if (isEmpty(cacheList)) {
      resetData();
      return;
    }
    // 获取Bom数据
    getTreeData({
      id: cacheList[index]?.bomId,
      detailId: cacheList[index]?.id,
    });
    initData({
      ...toRaw(cacheList[index]),
    });
    state.bomId = cacheList[index].bomId;
    handleDisabled(data);
  }

  function initData(data, type = '') {
    const bomId = data.bomId || data.id;
    if (bomId) return handlePccDetail({ ...data, bomId }, type);
    resetData();
  }

  // 获取测试条信息
  function getTestStrip() {
    let list = testStripGetDataSource();
    if (list.length === 1 && !list[0].partNumber) {
      list = [];
    }
    return list;
  }

  // 处理物料列表
  function getMaterialList(): any {
    // const { getDataSource } = MaterialRef.value;
    return materialGetDataSource().map(item => ({
      ...item,
      utilizationRate: item?.utilizationRate?.replaceAll?.('%', '') / 100,
      stepDistanceNumber: item.stepDistanceNumber,
    }));
  }

  // 获取半成品数据
  function getSemiFinishedData() {
    const semiFinishedData = PccSemiFinishedRef.value.getDataSource();
    return semiFinishedData;
  }

  // 获取包装数据
  function getPackageData() {
    const packageData = PccPackageRef.value.getDataSource();
    return {
      ...packageData,
      packingMaterialList: packageData,
    };
  }

  // 获取工艺列表
  function getProcessList() {
    const { getDataSource } = ProcessFlowRef.value;
    const list = getDataSource().map(item => ({
      ...item,
      defectRate: item.defectRate / 100,
      imageList: (item.imageList || []).map((file, idx) => ({
        seqNumber: idx,
        filePath: file.url || file,
      })),
      isMain: item.isMain === 1,
    }));
    return list;
  }

  // 获取工程数据列表
  function getEngineeringDataList() {
    const customerFileList = FileUploadRef.value.getCustomerFileList();
    return customerFileList
      .map((item, index) => ({
        seqNumber: index,
        filePath: item.flagPath,
        fileName: item.name,
        ...item,
      }))
      .filter(item => item.origin !== 'interface');
  }

  // 处理步骤距离列表
  function getStepDistanceList() {
    const { technologyList } = formWrapperRef.value.getStateList();
    return technologyList.map((item, index) => ({
      ...item,
      seqNumber: index + 1,
      isMain: index === 0,
    }));
  }

  function handleDisabled(data) {
    const { mode } = data;
    state.disabled = mode === ModeTypeEnum.VIEW;
    if (mode === ModeTypeEnum.VIEW) {
      formWrapperRef.value?.setDisabled(true);
      ProcessFlowFormRef.value?.setDisabled(true);
      ProcessFlowRef.value?.setDisabled(true);
      materialSetDisabled(true);
      testStripDistable(true);
      PccPackageRef.value?.setDisabled(true);
      FileUploadRef.value?.setDisabled(true);
      PccSemiFinishedRef.value?.setDisabled(true);
    }
  }

  // 判断是否关闭弹窗
  function shouldClosePopup(): boolean {
    const { cacheList, index, showReview } = state;
    return (!showReview && cacheList.length === index + 1) || (!!showReview && cacheList.length === index + 1);
  }

  // 刷新BOM数据
  async function refreshBomData(dataId: string, options: { skipInit?: boolean; skipTree?: boolean } = {}) {
    const { data } = await getPccDetail({ id: dataId });
    if (!options.skipInit) {
      await initData({ id: dataId, bomId: data.bomId });
    }
    state.cacheList[state.index] = data;
    state.bomId = data.bomId;
    if (!options.skipTree) {
      await getTreeData({ id: data.bomId, detailId: dataId });
    }
    return data;
  }

  async function handlePccDetail(data, type) {
    console.trace(type, '1111111111111111111111');
    const reqId = currentRequestId.value;
    changeLoading(true, 'detail');
    const { baseInfo: nowBaseInfo } = (await getNormalizedFormValues()) || {};
    const formInfo = cloneDeep(nowBaseInfo || {});
    const bomId = data.bomId || state.bomId;
    if (isNullOrUnDef(bomId)) {
      changeLoading(false, 'detail');
      return;
    }
    const [bomRes, pccRes] = await Promise.all([getBomDetail({ id: bomId }), getPccDetail(data)]);

    // 如果请求ID不匹配，说明已经切换了页面，直接返回
    if (reqId !== currentRequestId.value) return;

    if (bomRes.code !== 200 || pccRes.code !== 200) {
      throw new Error('Failed to fetch details');
    }

    const { data: bomData } = bomRes;
    let { data: pccData } = pccRes;
    // 如果PccData为空，则是toMake数据
    // if ((data.id && isNullOrUnDef(pccData)) || (isEmpty(bomData) && isEmpty(pccData))) {
    if (data.id && isNullOrUnDef(pccData)) {
      return resetData() && changeLoading(false, 'detail');
    }

    if (!isEmpty(pccData)) {
      state.pccDetailData = pccData;
    }
    // 如果是半成品，则不更新current数据 并且 type !== child，那就是暂存，则不更新current数据
    if (currentData.value.bomId !== state.bomId && type !== 'child') pccData = {};

    if (isEmpty(bomData) && 1 != state.type) {
      return resetData() && changeLoading(false, 'detail');
    }

    testStripListBack = bomData?.testStripList || [];

    packListBack = {
      packingMaterialCustomList: bomData?.packingMaterialCustomList || [],
      packingMaterialFixedList: bomData?.packingMaterialFixedList || [],
    };
    await handleBomData(bomData, pccData, type);
    const mergeData = isExist(data.useCurrentForm)
      ? merge({}, pccData, omit(formInfo, ['productType', 'businessType', 'workCenter', 'sapFactory']))
      : // : merge({}, omit(formInfo, ['productType', 'businessType', 'workCenter', 'sapFactory', 'workshopEnv']), pccData);
        merge({}, pccData);

    await handlePccData(mergeData, type);
    changeLoading(false, 'detail');
  }

  async function handleBomData(bomData, pccData, type) {
    const {
      processList,
      stepDistanceList,
      materialList,
      installationDiagramList,
      moldList,
      parentPartInfo,
      packingMaterialCustomList,
      packingMaterialFixedList,
      testStripList,
      engineeringDataList,
      semiFinishedList,
    } = bomData;

    historyFlag = null;

    if (type !== 'child' && pccData?.bomId) {
      state.bomId = pccData.bomId;
    }
    // 工艺信息
    handleTechnicalData(
      stepDistanceList ?? [
        {
          stepDistance: '',
          modulus: '',
        },
      ],
    );
    // 判断成品还是半成品
    state.halfSign = isEmpty(processList) && isEmpty(materialList) ? 'add' : 'edit';

    // 如果precessList为空，重置数据
    if ((isNullOrUnDef(processList) && isNullOrUnDef(materialList)) || (isEmpty(processList) && isEmpty(materialList))) {
      // if(parentPartInfo.shipPattern){}
      return resetData(parentPartInfo, type);
    }
    // 回显设置数据
    // 基础数据
    handleParentPartInfo(parentPartInfo, type, pccData);

    // 模具编号
    handleMoldData(moldList);

    handleTechnologyForm(parentPartInfo);

    // 工艺流程
    await handleProcessData(processList);

    // 半成品
    await handleSemiFinishedData(semiFinishedList, pccData);

    // 材料
    await handleMaterialData(materialList, stepDistanceList, processList);
    // 测试条
    await handleTestStripData(testStripList);

    if (type === 'history') {
      pccData.shipPattern = currentData.value.shipPattern;
      historyFlag = get(bomData, 'parentPartInfo.isQuoteRecord', null);
    }

    if (type === 'child' && isEmpty(packingMaterialCustomList) && isEmpty(packingMaterialFixedList)) {
      await handlePackageData([], [], parentPartInfo);
    } else {
      // 包材数据
      await handlePackageData(packingMaterialCustomList, packingMaterialFixedList, {
        ...parentPartInfo,
        ...pccData, // 包材初始化需要区分片、卷。如列表没带，则取详情数据
      });
    }

    // 装机图
    handleInstallImage(installationDiagramList);
    state.installImageList = installationDiagramList;

    // 样品图纸
    handleEngineeringData(engineeringDataList);
    // state.toBeGenerateList = moldList;

    if (type === 'history') {
      changeLoading(false);
    }
  }

  function handleTechnologyForm(data) {
    if (isNullOrUnDef(data)) return;
    const { setTechnologyTableFieldsValue } = ProcessFlowFormRef.value;
    setTechnologyTableFieldsValue({
      ...data,
      downtimeOneHour: data.downtimeOneHour ? Number(data.downtimeOneHour).toFixed(2) : 0,
      utilizationRate: data.utilizationRate ? Number(data.utilizationRate * 100).toFixed(2) : 0,
    });
  }

  function handleEngineeringData(data) {
    if (isNullOrUnDef(data)) return;
    const { setCustomerFileList } = FileUploadRef.value;
    setCustomerFileList(
      data.map(item => ({
        ...item,
        delete: false,
        name: item.fileName,
        flagPath: item.filePath,
        flagVersion: item.version,
      })),
    );
  }

  function handleInstallImage(data) {
    if (isNullOrUnDef(data)) return;
    const { setInstallImageList } = FileUploadRef.value;
    setInstallImageList(data);
  }

  function handleMoldData(list) {
    const { setToBeGenerateList } = formWrapperRef.value;
    setToBeGenerateList(list);
  }

  async function handleParentPartInfo(data, type, pccData) {
    if (isEmpty(pccData) && type !== 'history') return;

    const workshopEnv = data?.workshopEnv?.toString() || undefined;
    const isBonded = data?.isBonded?.toString() || 'false';
    const sapFactoryValue = isNullOrUnDef(data?.sapFactoryName) ? data?.sapFactory : data?.sapFactoryName;

    const { setBaseInfoFieldsValue, resetFormFields } = formWrapperRef.value;
    if (type === 'child') {
      await resetFormFields();
    }
    await getFactorySap({
      isBonded,
      materialType: data.materialType,
      factoryCode: data.factoryCode,
    });
    // setBaseInfoFieldsValue({
    //   ...data,
    // });
    if (type === 'history') {
      delete data.factory;
    }
    setBaseInfoFieldsValue({
      ...data,
      sapFactory: sapFactoryValue,
      workshopEnv,
      process: data.process?.toString(),
      // businessType: data.businessType?.toString(),
      isBonded,
      // 如果type为history且data factory和 factory不相同，businessType为空
      // businessType: type === 'history' && data.factory !== factory ? '' : data.businessType?.toString(),
    });

    setTechnologyFields({
      ...data,
      data,
      utilizationRate: data.utilizationRate * 100,
    });
  }

  function setTechnologyFields({ data, utilizationRate }) {
    const { setTechnologyFieldsValue } = formWrapperRef.value;
    setTechnologyFieldsValue({ ...data });
  }

  function handleTechnicalData(data) {
    const { setTechnologyList } = formWrapperRef.value;
    setTechnologyList(
      data?.map(item => ({
        ...item,
        uuid: item.id,
        stepDistance: item.stepDistance?.toString(),
        modulus: item.modulus?.toString(),
      })) || [],
    );
  }

  async function handleMaterialData(data, stepDistanceList, processList) {
    const ShippingMaterials = await baseStore.getDictionaryData('PCC.ShippingMaterial', true);
    if (isNullOrUnDef(data)) data = [];
    const formattedMaterials = data.map((item, index) => {
      const shippingMaterialTarget = ShippingMaterials.find(v => v.enCode === item?.shippingMaterial);
      const target = {
        ...item,
        uuid: item.id,
        // origin: {
        //   useQty: item.useQty,
        // },
        // stepDistanceNumber: item.stepDistanceNumber,
        // shippingMaterial: shippingMaterialTarget?.enCode,
        // shippingMaterialName: shippingMaterialTarget?.fullName,
      };
      if (isExist(shippingMaterialTarget?.enCode)) {
        target.shippingMaterial = shippingMaterialTarget?.enCode;
      }
      if (shippingMaterialTarget?.fullName) {
        target.shippingMaterialName = shippingMaterialTarget?.fullName;
      }
      if (!isEmpty(processList)) {
        if (isExist(item.processCode) && item.processCode !== '') {
          const processCode = Math.max(Number.parseInt(item.processCode) - 1, 0);
          if (!Number.isNaN(processCode)) {
            const process = processList[processCode];
            target.processName = `${processCode + 1}、${process?.processCode}`;
          }
        }
      }
      if (item.utilizationRate && !item.utilizationRate?.includes?.('%')) {
        // utilizationRate: item.utilizationRate ? item.utilizationRate * 100 : '',
        target.utilizationRate = Number.parseFloat(multiply(bignumber(item.utilizationRate), 100)).toFixed(2) + '%';
      }
      return target;
    });
    materialSetState({
      list: formattedMaterials,
      stepDistanceList,
      processList,
    });
    materialReloadData(formattedMaterials);
  }

  async function handleTestStripData(testStripList) {
    if (isNullOrUnDef(testStripList)) {
      return testStripReload([]);
    }
    const testOptions = await baseStore.getDictionaryData('TestOption');
    testStripList.map(item => {
      item.testOptionName = testOptions.find(v => v.enCode === item.testOption)?.fullName;
    });
    return testStripReload(testStripList);
  }

  function createMaterialDisabledFields() {
    return {
      partNumber: true,
      description: true,
      color: true,
      utilizationRate: true,
      metersTenHour: true,
      useQty: true,
    };
  }

  async function handlePackageData(customList = [], fixedList = [], parentInfo = {}) {
    const packageRef = unref(PccPackageRef);
    state.shouldInit = false;
    const hasPackageData = customList.length || fixedList.length;

    if (!hasPackageData && state.shouldInit) {
      packageRef.init({
        // 包材初始化需要区分片、卷。如列表没带，则取详情数据
        shipPattern: currentData.value.shipPattern || parentInfo.shipPattern,
        source: 'PCC',
      });
    } else {
      const { data } = await getMaterialAreaChildren({
        enCode: 'PackagingMaterials',
      });
      packageRef.setTableData(createPackageData(customList, fixedList, parentInfo, data));
    }
  }

  function formatPackageType(list, unitTypeList) {
    return list.map(item => {
      const target = {
        ...item,
        uuid: item.id,
      };
      target.typeName = unitTypeList.find(value => value.enCode === item.type)?.fullName;
      return target;
    });
  }

  function createPackageData(customList, fixedList, parentInfo, unitTypeList) {
    const shipPattern = state.pccDetailData.shipPattern || parentInfo.shipPattern || currentData.value.shipPattern;
    if (!shipPattern) return createMessage.warning('初始化包材片/卷数据失败, 请联系管理员');
    return {
      packingMaterialCustomList: formatPackageType(customList, unitTypeList),
      packingMaterialFixedList: formatPackageType(fixedList, unitTypeList),
      // 升版列表参数不带currentData.value.shipPattern
      // packageSpecQty: currentData.value.shipPattern === 'R' ? parentInfo.packSpecQtyR : parentInfo.packSpecQtyPN,
      packageSpecQty: shipPattern === 'R' ? parentInfo.packSpecQtyR : parentInfo.packSpecQtyPN,
      config: {
        mode: state.mode,
        source: 'PCC',
        shipPattern,
      },
    };
  }

  async function handleProcessData(data) {
    const { setProcessFlowTable } = ProcessFlowRef.value;
    const { setTechnologyDetailTableData } = FileUploadRef.value;

    const processTableData = data.map(item => {
      delete item.children;
      return {
        ...item,
        imageList: item.imageList?.map(v => v.filePath) || [],
        isMain: item.isMain ? 1 : 0,
        defectRate: item.defectRate * 100,
        uuid: item.id,
        processName: item.processName && item.processCode ? `${item.processCode}(${item.processName})` : '',
      };
    });
    setTechnologyDetailTableData(processTableData);
    await setProcessFlowTable(processTableData);
  }

  async function handleSemiFinishedData(data, pccData) {
    const { setSemiFinishedTableData, setReviewNode } = PccSemiFinishedRef.value;
    const currentNode = pccData.currentNode || '';
    if (currentNode.includes('LeaderReview')) {
      await setReviewNode(data);
    } else {
      await setSemiFinishedTableData(data);
    }
  }

  function handleUpdateProcessFlow(data) {
    const { setTechnologyDetailTableData } = FileUploadRef.value;
    setTechnologyDetailTableData(data);
  }

  function createProcessDisabledFields(processCode) {
    const isSpecialProcess = ['1', '4', '5'].some(n => processCode?.startsWith(n));
    return isSpecialProcess ? { speed: true, speedUnit: true } : { capacity: true };
  }

  async function handlePccData(data: any, type: 'history' | 'child' | string) {
    if (isNullOrUnDef(data) || isEmpty(data)) return data;

    const { isBonded, creatorTime, revisionRemark, factory: historyFactory, productType, ...rest } = data;

    const { initBaseInfoFieldsValue } = formWrapperRef.value;
    const managerId = userStore.getUserInfo?.managerId;
    const { factory } = (await getNormalizedProdInfoFieldsValue()) || {};

    const baseInfo: any = {
      ...rest,
      handlerId: state.mode === 'edit' && !state.showReview ? managerId : data.handlerId,
    };

    if (type === 'history') {
      // 引用历史记录
      baseInfo.productType = factory === historyFactory ? data.productType : null;

      // 引用历史记录不更改 bomType
      state.bomType = baseInfo.bomType;
      delete baseInfo.bomType;
    } else {
      // 非 history 类型：需要带出成品数据
      baseInfo.insidePartNumber = data.insidePartNumber;
      baseInfo.bomType = data.bomType;
      state.bomType = data.bomType;

      // 双击 BOM 子件的特殊处理
      if (type === 'child') {
        baseInfo.isBonded = String(data.isBonded);
        baseInfo.sapFactory = data.sapFactory;
        // 去除成品 remark
        delete baseInfo.remark;
      }
    }

    const normalizedBaseInfo = normalizeSemiFinishedVersion(baseInfo);
    initBaseInfoFieldsValue(normalizedBaseInfo);

    await nextTick();
    getVersion(creatorTime, revisionRemark, data?.insidePartNumber);
  }

  function setFlowUnit(unit, unitName) {
    if (isNullOrUnDef(unit)) return;
    const { getDataSource } = ProcessFlowRef.value;
    const list = getDataSource();
    list.forEach(item => {
      if (item.processCode?.startsWith('2') || item.processCode?.startsWith('3')) {
        item.speedUnit = unit;
        item.speedUnitName = unitName;
      }
    });
  }

  // BOM类型
  const BOM_TYPE_SAMPLES = 4;

  const BOM_TYPE_QUANTITAVE = 1;
  // 工艺代码
  const PROCESS_CODES = {
    MATERIAL_PREP: '101',
    ORDINARY_TIDYING: '401',
    MANUAL_PACKAGING: '501',
  };

  async function resetData(parentPartInfo = {}, type = null) {
    const { resetFormFields, setBaseInfoFieldsValue } = formWrapperRef.value;

    const { businessType, productType } = (await getNormalizedProdInfoFieldsValue()) || {};

    changeLoading(true);
    // 重置数据
    const { getUserInfo } = userStore;
    const { cacheList, index } = state;
    const currentCache = cacheList[index];
    // 参数校验
    if (!currentCache) {
      console.error('Invalid cache index');
      changeLoading(false);
      return;
    }

    // 提取公用值
    const { demandType, shipPattern } = currentCache;

    const isSampleType = ['BusinessSamples', 'EngineeringSamples'].includes(demandType);
    const baseUserInfo = {
      creatorUserName: getUserInfo?.userId,
      handlerId: getUserInfo?.managerId,
    };

    handleMoldData([]);
    // 清空基础信息
    await resetFormFields();
    await nextTick();
    // 设置基础信息
    const resetBaseInfo = normalizeSemiFinishedVersion({
      ...currentCache,
      ...baseUserInfo,
      remark: '',
      bomType: isSampleType ? BOM_TYPE_SAMPLES : BOM_TYPE_QUANTITAVE,
      businessType: type === 'child' ? businessType : null,
      productType: type === 'child' ? productType : null,
    });
    setBaseInfoFieldsValue(resetBaseInfo);
    state.bomType = isSampleType ? BOM_TYPE_SAMPLES : BOM_TYPE_QUANTITAVE;

    // 如果是子BOM，需要带出成品的业务类型
    // if(type === 'history') {
    // 	currentCache.businessType = businessType
    // }
    // 设置产品信息
    // setProdInfoFieldsValue({
    //   ...currentCache,
    // });

    // 初始化表格数据
    initializeMaterialTable();
    initializeTestScripTable();
    initializeTechnologyData();
    initializeSemiFinishedTable();
    initializePackageData(parentPartInfo.shipPattern || shipPattern);

    // 重置图纸
    const { resetFileList } = FileUploadRef.value;
    resetFileList();

    // 初始化版本
    initializeVersionData();

    requestIdleCallbackAdapter(async () => {
      await nextTick();
      changeLoading(false);
    });
  }

  // 重置料号
  function initializeMaterialTable() {
    const initialMaterial = {
      ...materialRowData,
      uuid: buildUUID(),
      // origin: { ...materialRowData },
      // disabled: createDisabledFields([
      // 	'partNumber', 'description', 'color',
      // 	'utilizationRate', 'metersTenHour', 'useQty'
      // ])
    };

    if (1 != state.type) {
      return materialReloadData([]);
    }

    materialReloadData([initialMaterial]);
  }

  // 重置半成品
  function initializeSemiFinishedTable() {
    const { setSemiFinishedTableData } = PccSemiFinishedRef.value;
    const initialSemiFinished = [
      // {
      //   semiFinished: null,
      //   productionTypeName: null,
      //   hasBom: null,
      //   preparation: null,
      //   materialDosage: 1,
      //   qty: null,
      //   unit: 'PCS',
      //   remarks: null,
      // },
    ];
    if (1 != state.type) {
      return setSemiFinishedTableData([]);
    }
    setSemiFinishedTableData(initialSemiFinished);
  }

  function initializeTestScripTable() {
    const initialTestStrip = {
      uuid: buildUUID(),
    };
    testStripReload([initialTestStrip]);
  }

  function createDisabledFields(fields) {
    return fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
  }

  // 重置工艺
  function initializeTechnologyData() {
    const { setProcessFlowTable } = ProcessFlowRef.value;
    const { setTechnologyDetailTableData } = FileUploadRef.value;

    const baseTechRow = {
      ...technologyRowData,
      uuid: buildUUID(),
      isMain: 0,
    };

    const initialTechData = [
      createTechRow('101', 'materialPreparation', 0),
      { ...baseTechRow, processCode: null, processName: null, isMain: 1, useNumber: 1 },
      createTechRow('401', 'ordinaryEnvironmentTidying'),
      createTechRow('501', 'manualPackaging'),
    ];

    materialSetState({
      processList: initialTechData,
      stepDistanceList: [
        {
          modulus: '',
          stepDistance: '',
        },
      ],
    });

    setTechnologyDetailTableData(initialTechData);
    setProcessFlowTable(initialTechData);
  }

  function createTechRow(processCode, dictKey, isMain = 0) {
    const rowData = {
      processCode: null,
      processCodeName: '',
      adjustmentTime: 0,
      capacity: 0,
      speed: null,
      speedUnit: null,
      defectRate: 0,
      useNumber: 1,
      isMain: '',
    };

    const dictLabel = t(`dict.PCCApplyColumn.${dictKey}`);
    const processName = `${processCode}(${dictLabel})`;

    return {
      ...rowData,
      processCode,
      processName,
      uuid: buildUUID(),
      isMain,
      disabled: processCode ? { speed: false, speedUnit: false } : {},
    };
  }

  // 重置包材
  function initializePackageData(shipPattern) {
    const packageRef = unref(PccPackageRef);
    packageRef.init(
      {
        shipPattern: shipPattern,
        source: 'PCC',
      },
      // true,
    );
  }

  // 重置版本
  function initializeVersionData() {
    getVersion();
  }

  // 处理文件上传
  async function handleFileUploads() {
    const customerFileList = FileUploadRef.value.getCustomerFileList();
    const notUploadList = customerFileList.filter(item => item.flagVersion === 0 && !item.flagPath);

    if (notUploadList.length > 0) {
      await Promise.all(
        notUploadList.map(item =>
          uploadInstallFile({
            file: item,
            filePath: 'PCC',
          }).then(res => {
            item.flagPath = res.data.filePath;
          }),
        ),
      );
    }
  }

  // 获取修订备注
  function getRevisionRemark(): string | undefined {
    // const revisionRemarkList = getChangeHistoryDataSource();
    const revisionRemarkList = PccHistoryRef.value.getChangeHistoryDataSource();
    return revisionRemarkList[0]?.revisionRemark;
  }

  type SubmitAction = 'save' | 'commit' | 'calc' | 'agree';
  type SubmitFlowAction = 'close' | 'next' | 'modal';

  async function handleBomSubmitByType(params: any, type: SubmitAction, state: any, currentCache: any): Promise<SubmitFlowAction | undefined> {
    if (isProductBom(state) && !currentCache?.bomId) {
      // 成品 + 无 bomId = 新增 BOM
      return handleNewBom(params, type);
    }

    // 成品修改 or 半成品（目前都走更新逻辑）
    return handleExistingBom(params, type, currentCache);
  }

  function shouldBlockPackingSubmit(params: any) {
    const noPackingNow = isEmpty(params.packingMaterialFixedList) && isEmpty(params.packingMaterialCustomList);

    const hasPackingBefore = !isEmpty(packListBack.packingMaterialFixedList) || !isEmpty(packListBack.packingMaterialCustomList);

    return packSubmitLock && noPackingNow && hasPackingBefore;
  }

  function shouldBlockSemiFinishedSubmit(params: any) {
    const noSemiFinishedNow = isEmpty(params.semiFinishedList);

    const hasSemiFinishedBefore = !isEmpty(semiListBack);

    return semiSubmitLock && noSemiFinishedNow && hasSemiFinishedBefore;
  }

  function shouldBlockTestStripSubmit(params: any) {
    const noTestStripNow = isEmpty(params.testStripList);

    const hasTestStripBefore = !isEmpty(testStripListBack);

    return testStripSubmitLock && noTestStripNow && hasTestStripBefore;
  }

  function isProductBom(state: any) {
    // 成品：没有 treeData 或 type === 1
    return !state.treeData.length || state.type === 1;
  }

  async function handleSubmit(type: SubmitAction, close?: () => void) {
    changeLoading(true);

    try {
      const currentCache = currentData.value;

      // 1. 准备参数
      const params = await prepareSubmitParams(type, currentCache);

      // 2. 基础参数校验
      if (!(await validateParams(params))) return changeLoading(false);

      // 3. 包材校验
      if (shouldBlockPackingSubmit(params)) {
        packSubmitLock = false;
        createMessage.warning(t('dict.PCCApplyColumns.PackValidate'));
        return;
      }

      // if (shouldBlockSemiFinishedSubmit(params)) {
      //   semiSubmitLock = false;
      //   createMessage.warning(t('dict.PCCApplyColumns.SemiValidate'));
      //   return;
      // }

      if (shouldBlockTestStripSubmit(params)) {
        testStripSubmitLock = false;
        createMessage.warning(t('dict.PCCApplyColumns.TestStripValidate'));
        return;
      }

      // 4. 根据 BOM 类型 & 是否已有 bomId 选择新增 / 修改
      const submitAction = await handleBomSubmitByType(params, type, state, currentCache);

      // 5. 提交后的处理
      const autoClose = type !== 'agree';
      const skipRefresh = submitAction === 'close' || submitAction === 'next';
      handlePostSubmitActions(type, autoClose, skipRefresh);
      // 如果你需要用 close，可以在 handlePostSubmitActions 里调用，
      // 或者这里判断 autoClose 再手动调用 close?.();
    } catch (error) {
      console.log(error);
      // changeLoading(false);
    } finally {
      changeLoading(false);
    }
  }

  // 准备提交参数
  async function prepareSubmitParams(type: SubmitAction, currentCache: any): Promise<BomParams> {
    const { toBeGenerateList, technologyList } = formWrapperRef.value.getStateList();

    // 处理文件上传
    await handleFileUploads();

    const { baseInfo = {} } = (await getNormalizedFormValues()) || {};

    const params = {
      revisionRemark: getRevisionRemark(),
      ...getBaseParams(currentCache),
      ...baseInfo,
      parentPartInfo: await getParentPartInfo(),
      testStripList: getTestStrip(),
      materialList: getMaterialList(),
      semiFinishedList: getSemiFinishedData(),
      moldList: toBeGenerateList,
      ...getPackageData(),
      stepDistanceList: getStepDistanceList(technologyList),
      processList: getProcessList(),
      installationDiagramList: FileUploadRef.value.getInstallImageList(),
      engineeringDataList: getEngineeringDataList(),
    };

    if (type === 'commit' || type === 'agree') {
      params.saveAndCommit = true;
    }
    if (state.type !== 1) {
      params.version = 0;
    }
    return params;
  }

  // 处理新BOM
  async function handleNewBom(params: any, type: SubmitAction): Promise<SubmitFlowAction | undefined> {
    const { data, msg } = await addFinishedPartsBomPcc(params);

    // data的数据格式改为`{ [id: string]: boolean }`，故`dataId`的取值发生改变
    const dataId = Object.keys(data).pop()!;
    // state.bomId = dataId;
    // if (code !== 200) {
    //   // throw new Error(msg);
    //   return;
    // }

    createMessage.success(msg);
    let refreshedData;
    if (type !== 'agree') {
      const skipViewUpdate = type === 'commit';
      refreshedData = await refreshBomData(dataId, {
        skipInit: skipViewUpdate,
        skipTree: skipViewUpdate,
      });
    }

    sendPdf({ data });

    let commitResult: SubmitFlowAction | undefined;
    if (type === 'commit' || type === 'agree') {
      commitResult = await handleCommitActions(dataId);
    }

    const shouldSkipRefresh = commitResult === 'close' || commitResult === 'next';
    if (type === 'commit' && !shouldSkipRefresh && refreshedData) {
      await initData({ id: dataId, bomId: refreshedData.bomId });
      await getTreeData({ id: refreshedData.bomId, detailId: dataId });
    }
    return commitResult;
  }

  // 处理现有BOM
  async function handleExistingBom(params: any, type: 'save' | 'commit' | 'calc' | 'agree', currentCache: any): Promise<SubmitFlowAction | undefined> {
    if (!state.treeData.length || state.type === 1) {
      return handleRootBomUpdate(params, currentCache, type);
    }
    return handleChildBomUpdate(params, currentCache, type);
  }

  // 处理提交后操作
  function handlePostSubmitActions(type: 'save' | 'commit' | 'calc' | 'agree', initFlag = false, skipRefresh = false) {
    emit('reload');
    if (skipRefresh) {
      return;
    }
    if (skipPostSubmitRefresh) {
      return;
    }
    // if (type === 'save') {
    //   createMessage.success('暂存成功');
    // }
    // 如果是需要关闭的数据，直接关闭弹窗
    if (shouldClosePopup()) {
      // if (type === 'commit' || type === 'agree') {
      //   closePopup();
      // }
    } else {
      // 如果是calc，不关闭详情，刷新数据
      if (initFlag) {
        initData({ bomId: state.bomId, id: currentData.value.id, useCurrentForm: true }, type);
        return;
      }
      initData({ bomId: state.bomId, id: currentData.value.id }, type);
    }
  }

  // 错误处理
  function handleSubmitError(error: unknown) {
    // const message = error instanceof Error ? error.message : '提交失败';
    // createMessage.error(message);
    // 可以添加额外的错误处理逻辑
  }

  // 获取基础参数
  function getBaseParams(currentCache: any): Record<string, any> {
    return {
      originType: currentCache.originType,
      drawingsReviewId: currentCache.drawingsReviewId || currentCache.id,
      insidePartNumber: currentCache.insidePartNumber,
    };
  }

  // 获取父零件信息
  async function getParentPartInfo(): any {
    const technologyTable = ProcessFlowFormRef.value.getTechnologyTableFieldsValue();
    const packageData = PccPackageRef.value.getDataSource();

    const { baseInfo = {}, technology = {} } = (await getNormalizedFormValues()) || {};
    const params = {
      ...baseInfo,
      ...technology,
      ...technologyTable,
      packSpecQtyR: packageData.packSpecQtyR,
      packSpecQtyPN: packageData.packSpecQtyPN,
    };
    if (historyFlag) {
      params.isQuoteRecord = historyFlag;
    }
    return params;
  }

  async function handlePrint() {
    // 基础信息
    // 生产信息
    // 工艺信息
    const { baseInfo = {}, technology = {} } = (await getNormalizedFormValues()) || {};
    // technologyInfo.technologyList = technologyList.value || [];
    const { technologyList, toBeGenerateList } = formWrapperRef.value.getStateList();
    technology.technologyList = technologyList;
    // 模具料号1
    const moldNoList = toBeGenerateList.map(item => item.code);
    // 工艺流程
    const technologyTableData = getProcessList().map(item => ({ ...item, defectRate: item.defectRate * 100 }));
    const technologyTableForm = ProcessFlowFormRef.value.getTechnologyTableFieldsValue();
    // 材料表格数据
    const materialTableData = getMaterialList();
    // 材料表格数据
    const testStripTableData = getTestStrip();
    // 包规 & 包材
    const packageData = getPackageData();
    // 工艺流程详述
    const technologyDetailTableData = getProcessList();
    // 变更履历
    const changeHistoryTableData = PccHistoryRef.value.getChangeHistoryDataSource();
    // 半成品信息
    const semiFinishedTableData = getSemiFinishedData();
    const prodInfo = await getParentPartInfo();

    const cacheData: any = state?.cacheList?.[state.index] || {};

    changeLoading(true);
    printPCCDetail({
      ...baseInfo,
      technologyInfo: technology,
      moldNoList,
      technologyTableData,
      technologyTableForm,
      materialTableData,
      testStripTableData,
      packageData: {
        ...(state.cacheList?.[state.index] ? state.cacheList[state.index] : {}),
        ...packageData,
      },
      technologyDetailTableData,
      changeHistoryTableData,
      semiFinishedTableData,
      baseInfo: {
        ...baseInfo,
        // 从【样品组 - 交期回复】页面进入这个组件打印，需要打印【申请人(`applyUserName`)】和【需求数量(`demandQty`)】
        applyUserName: cacheData.applyUserName,
        demandQty: cacheData.demandQty,
      },
      prodInfo: { ...state.pccDetailData, ...prodInfo },
    }).finally(() => {
      changeLoading(false);
    });
  }

  function handleDblClick(_, value) {
    if (!value || !value.id) return;
    if (value.isBom) return createMessage.warning(t('该半成品料号已有Bom，不能编辑！'));
    if (!value.hasChild) return createMessage.warning(t('该类型不支持编辑bom结构'));
    // 该半成品料号已有Bom，不能编辑！
    const changeBom = () => {
      changeLoading(true, 'detail');
      state.bomId = value.id;
      initData(
        {
          bomId: value.id,
          id: value.detailId,
        },
        'child',
      );
      // getVersion(null, null, value.id);
      state.type = value.type || 1;
    };

    if (state.disabled) {
      changeBom();
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.QuotationColumn.enterClearConfirm'),
        onOk: changeBom,
      });
    }
    // createConfirm({
    //   iconType: 'warning',
    //   title: t('common.tipTitle'),
    //   content: t('dict.QuotationColumn.enterClearConfirm'),
    //   onOk: async () => {
    //     initData(
    //       {
    //         bomId: value.id,
    //       },
    //       'child',
    //     );
    //     state.bomId = value.id;
    //   },
    // });
  }

  // 处理提交后的ECN流程
  async function handleCommitActions(dataId: string): Promise<'close' | 'next' | 'modal'> {
    const { cacheList, index, bomType } = state;

    const { baseInfo = {} } = (await getNormalizedFormValues()) || {};
    const { version } = baseInfo;
    const currentItem = cacheList[index];

    const shouldCheckECN = currentItem.id && isExist(version) && version !== 0 && bomType !== 4;

    if (shouldCheckECN) {
      const { data: ecnFlag } = await getECNByPartNumber({
        insidePartNumber: currentItem.insidePartNumber,
        version: currentItem.version,
      });

      if (ecnFlag) {
        // ecnFlag 为 true → 直接关闭
        return closePopup();
      }
      changeLoading(true);
      // ecnFlag 为 false → 打开弹窗
      emit('ecnOpenModal', true, { id: currentItem.id });
      return 'modal';
    }

    // 不需要检查 ECN 的情况
    return closePopup();
  }

  /**
   * 如果返回值的data为`{ [id: string]: boolean }`，则表示生成pdf推送到3.8
   * @param res
   */
  function sendPdf(res: { data: { [id: string]: boolean } }) {
    if (!res.data || typeof res.data !== 'object') {
      return false;
    }
    const ids = Object.keys(res.data).filter(k => res.data[k]);
    ids.length > 0 && generatePdfByIds(ids);
  }

  // 处理根BOM更新
  async function handleRootBomUpdate(params: any, currentCache: any, type): Promise<SubmitFlowAction | undefined> {
    let res;
    if (state.mode === ModeTypeEnum.VIEW) {
      /**
       * 废弃
       */
      res = await commitPcc({ id: currentCache.id });
      sendPdf(res);
      /**
       * 废弃结束
       */
    } else {
      res = await updateFinishedPartsBomPcc({
        ...params,
        id: currentCache.id,
      });
      sendPdf(res);
    }
    createMessage.success(res.msg);

    if (type === 'calc' || type === 'save') {
      const dataId = Object.keys(res.data).pop()!;
      await refreshBomData(dataId);
      return;
    }

    let commitResult: SubmitFlowAction | undefined;
    if (type == 'commit' || type == 'agree') {
      if (res.code === 200 && (state.mode === ModeTypeEnum.AUDIT_VIEW || state.mode === ModeTypeEnum.AUDIT_EDIT)) {
        return closePopup();
      }

      // 如果只是提交，那么需要提示是否发起ECn
      if (res.code === 200 && (state.mode === ModeTypeEnum.EDIT || params.saveAndCommit)) {
        // createMessage.success(res.msg);
        commitResult = await handleCommitActions(params.id);
      }
    }

    if (commitResult === 'close' || commitResult === 'next') return;

    const [rootNode] = state.treeData || [];
    if (rootNode) {
      await getTreeData({ id: rootNode.id, detailId: rootNode.detailId });
    }
    // if (type != 'commit') return;
    // 如果是审核提交，那么直接关闭弹窗
  }

  // 处理子BOM更新
  async function handleChildBomUpdate(params: any, currentCache: any, type: SubmitAction): Promise<SubmitFlowAction | undefined> {
    let res;
    const currentPccId = findNodeById(state.treeData, state.bomId)?.detailId;
    // 1. 根据 halfSign & mode 决定调用哪个接口
    if (state.halfSign === 'add') {
      // 半成品新增
      res = await addHalfFinishedPartsBomPcc({
        ...params,
        PCCId: currentPccId,
        bomId: state.bomId,
      });
    } else if (state.mode === ModeTypeEnum.VIEW) {
      // 查看模式：提交 PCC
      res = await commitPcc({ id: currentPccId });
    } else {
      // 半成品修改
      res = await updateHalfFinishedPartsBomPcc({
        ...params,
        PCCId: currentCache.id,
        bomId: state.bomId,
        id: currentPccId,
      });
    }

    // 所有分支共用的处理
    sendPdf(res);

    if (res.code === 200) {
      createMessage.success(res.msg);
    }

    // 2. saveAndCommit 后续动作
    let commitResult: SubmitFlowAction | undefined;
    if (params.saveAndCommit) {
      if (type === 'agree') {
        // 审批通过直接关闭弹窗
        return closePopup();
      }

      // 非 agree 的情况执行提交流程
      if (res.code === 200 && (state.mode === ModeTypeEnum.EDIT || params.saveAndCommit)) {
        commitResult = await handleCommitActions(params.id);
      }
    }

    if (commitResult === 'close' || commitResult === 'next') return;

    // 3. 刷新数据
    await initData({ bomId: state.bomId }, 'child');

    const [rootNode] = state.treeData || [];
    if (rootNode) {
      await getTreeData({
        id: rootNode.id,
        detailId: rootNode.detailId,
      });
    }
    return commitResult;
  }

  async function getVersion(creatorTime, revisionRemark, bomId) {
    const currentValue = currentData.value;
    if (creatorTime) {
      versionState.creatorTime = creatorTime;
    }
    if (revisionRemark) {
      versionState.revisionRemark = revisionRemark;
    }
    // 获取版本信息
    const params = {
      PartNumber: currentValue.insidePartNumber,
      bomType: state.bomType,
    };
    if (!isNullOrUnDef(bomId)) {
      params.PartNumber = bomId;
    }
    getPccRevisionHistory(params).then(async ({ data = [] }) => {
      const historyRef = PccHistoryRef?.value;
      const formRef = formWrapperRef?.value;
      if (!historyRef || !formRef) return;

      const { setChangeHistoryTableData } = historyRef;

      const currentNode = getCurrentNode(currentValue);
      const hasOriginVersion = !isNullOrUnDef(currentValue?.originVersion);
      const mode = state.mode;

      let reviewList: any[] = [];
      let formVersion = 0;

      // 分支一：升版 / PCC 制作
      if (hasOriginVersion) {
        if (!isEditMode.value) return; // 非编辑模式，直接结束
        const res = buildReviewListForUpgrade({
          data,
          creatorTime,
          mode,
        });
        reviewList = res.reviewList;
        // formVersion = res.formVersion;
      } else {
        // 分支二：列表进入/普通查看
        const res = buildReviewListForView({
          data,
          currentValue,
          pccDetailData: state.pccDetailData,
          currentNode,
        });
        reviewList = res.reviewList;
        // formVersion = res.formVersion;
      }

      // 非结案节点 + 编辑/审核：补充第一行信息
      if (currentNode !== 'End') {
        reviewList = fillFirstRowForEdit({
          reviewList,
          data,
          mode,
          pccDetailData: state.pccDetailData,
          revisionRemark,
        });
      }

      if (mode !== ModeTypeEnum.VIEW && mode !== ModeTypeEnum.AUDIT_VIEW) {
        // 结案节点：去掉最后一条
        reviewList = trimEndNodeReviewList(reviewList, currentNode);
      }

      // 如有需要可以带回 baseInfo 的版本
      // setBaseInfoFieldsValue({ version: formVersion });

      setChangeHistoryTableData(reviewList);
      changeLoading(false);
    });
  }

  // 升版 / PCC 制作 分支封装
  interface BuildUpgradeParams {
    data: any[];
    creatorTime?: number;
    mode: ModeTypeEnum;
  }

  function buildReviewListForUpgrade({ data, creatorTime, mode }: BuildUpgradeParams) {
    const reviewList: any[] = [];
    const pureEdit = isPureEditMode(mode);

    // 升版时新增一行在最前
    reviewList.push({
      originVersion: data.length,
      version: `T${data.length}`,
      creatorTime: creatorTime || Date.now(),
      onEdit: pureEdit,
      editable: pureEdit,
    });

    // 历史版本
    data.forEach(item => {
      reviewList.push({
        ...item,
        version: `T${item.version}`,
        originVersion: item.version,
      });
    });

    // 表单版本取历史最后一个
    const formVersion = data.length - 1;

    return { reviewList, formVersion };
  }
  function getCurrentNode(currentValue: any) {
    return currentValue?.value?.currentNode ?? currentValue?.currentNode ?? '';
  }

  function isAuditEditMode(mode: ModeTypeEnum) {
    return mode === ModeTypeEnum.AUDIT_EDIT;
  }

  function isPureEditMode(mode: ModeTypeEnum) {
    return mode === ModeTypeEnum.EDIT;
  }

  // 列表进入 / 普通查看 分支封装
  interface BuildViewParams {
    data: any[];
    currentValue: any;
    pccDetailData: any;
    currentNode: string;
  }

  function buildReviewListForView({ data, currentValue, pccDetailData, currentNode }: BuildViewParams) {
    const reviewList: any[] = [];

    // 只保留 <= 当前版本
    data.forEach(item => {
      if (item.version <= currentValue.version) {
        reviewList.push({
          ...item,
          version: `T${item.version}`,
          originVersion: item.version,
        });
      }
    });

    let formVersion = currentValue.version;

    // 未结案时，头部补一条未生效版本
    if (currentNode !== 'End') {
      const nextIndex = reviewList.length;
      reviewList.unshift({
        version: `T${nextIndex}`,
        originVersion: nextIndex,
        revisionRemark: pccDetailData?.revisionRemark,
        creatorTime: pccDetailData?.creatorTime ?? Date.now(),
      });
    }

    return { reviewList, formVersion };
  }

  // 编辑/审核时，补充第一行信息（T0/Tn）
  interface FillFirstRowParams {
    reviewList: any[];
    data: any[];
    mode: ModeTypeEnum;
    pccDetailData: any;
    revisionRemark?: string;
  }

  function fillFirstRowForEdit({ reviewList, data, mode, pccDetailData, revisionRemark }: FillFirstRowParams) {
    if (!reviewList.length) return reviewList;

    const editMode = isEditMode.value;
    if (!editMode) return reviewList;

    const auditEdit = isAuditEditMode(mode);
    const isInitialVersion = data.length === 0;
    const baseItem = reviewList[0] || {};

    let remark = baseItem.revisionRemark || '';

    if (isInitialVersion) {
      // T0：默认“初版发行”
      remark = revisionRemark || t('dict.PCCApplyColumn.initialRelease');
    } else if (!isEmpty(pccDetailData)) {
      // 编辑/审核：优先用详情里的版本说明
      remark = pccDetailData.revisionRemark || remark;
    }

    if (auditEdit && pccDetailData?.revisionRemark) {
      remark = pccDetailData.revisionRemark;
    }

    const originVersion = isInitialVersion ? 0 : data.length;
    const versionLabel = `T${originVersion}`;

    const editableFlag = editMode;

    const firstRow = {
      ...baseItem,
      revisionRemark: remark,
      creatorTime: Date.now(),
      originVersion,
      version: versionLabel,
      onEdit: editableFlag,
      editable: editableFlag,
    };

    return [firstRow, ...reviewList.slice(1)];
  }

  // 结案节点处理
  function trimEndNodeReviewList(reviewList: any[], currentNode: string) {
    if (currentNode === 'End' && reviewList.length > 0) {
      return reviewList.slice(0, -1); // 负索引代表从末尾算起
    }
    return reviewList;
  }
  function getTreeData(data) {
    treeRequestId.value += 1;
    const reqId = treeRequestId.value;
    const treeId = data?.id || data?.bomId || state.bomId;
    if (isNullOrUnDef(treeId)) {
      if (reqId === treeRequestId.value) {
        state.loadingBom = false;
        changeLoading(false, 'tree');
      }
      return;
    }
    state.loadingBom = true;
    changeLoading(true, 'tree');
    getBomStructure({ ...data, id: treeId })
      .then(({ code, data: ret }) => {
        if (reqId !== treeRequestId.value) return;
        if (code == 200) {
          if (!isEmpty(ret)) {
            ret[0].detailId = data.detailId;
            ret[0].id = treeId;
          }
          state.treeData = ret;
        }
      })
      .finally(() => {
        if (reqId !== treeRequestId.value) return;
        state.loadingBom = false;
        changeLoading(false, 'tree');
      });
  }

  async function validateParams(params) {
    const {
      insidePartNumber,
      parentPartInfo,
      materialList = [],
      stepDistanceList = [],
      processList = [],
      productType,
      saveAndCommit,
      bomType,
      creatorUserName,
      handlerId,
      packingMaterialFixedList = [],
      revisionRemark,
      testStripList = [],
      semiFinishedList = [],
    } = params || {};

    const warn = msg => {
      createMessage.warning(msg);
      return false;
    };

    const ensure = (condition, msg) => {
      if (!condition) throw new Error(msg);
    };

    const checkRequiredFields = fieldList => {
      for (const { value, msg } of fieldList) {
        if (!value) return warn(msg);
      }
      return true;
    };

    // ---------- 1) 半成品唯一性（无论是否提交都需要） ----------
    if (!validateSemiFinishedUnique(semiFinishedList, warn, t)) return false;

    // 只是保存草稿时，不做后面的强校验
    if (!saveAndCommit) return true;

    // ---------- 2) 父件信息 + 关联校验 ----------
    const okParent = await validateParentInfo({
      insidePartNumber,
      parentPartInfo,
      productType,
      bomType,
      creatorUserName,
      handlerId,
      checkRequiredFields,
      warn,
      t,
    });
    if (!okParent) return false;

    // ---------- 3) 主步距 ----------
    if (!validateStepDistance(stepDistanceList, warn, t)) return false;

    // ---------- 4) 变更记录（非 BOM4 必填） ----------
    if (bomType != 4 && !revisionRemark) return warn('请输入变更记录');

    // ---------- 5) 其余强校验（用 throw 聚合消息，主流程更干净） ----------
    try {
      const { singleRefuelingDuration } = parentPartInfo || {};
      ensure(!!singleRefuelingDuration, t('dict.PCCColumn.enterChangeTime'));

      validateProcessList(processList, ensure, t);
      validateSemiFinishedFilled(semiFinishedList, ensure, t);
      validateMaterialList(materialList, ensure, t);
      validateTestStripList(testStripList, ensure, t);
      validatePackingFixedList(packingMaterialFixedList, ensure, t);
    } catch (e) {
      return warn(e.message || e.toString());
    }

    return true;
  }

  /** ------------------ helpers ------------------ **/

  function validateSemiFinishedUnique(semiFinishedList, warn, t) {
    const nonEmpty = (semiFinishedList || []).filter(item => !(isEmpty(item?.semiFinished) || isNullOrUnDef(item?.semiFinished)));
    const unique = uniqBy(nonEmpty, 'semiFinished');
    if (unique.length !== nonEmpty.length) {
      return warn(t('dict.QuotationColumn.enterUniqueSemiFinishedList'));
    }
    return true;
  }

  async function validateParentInfo({ insidePartNumber, parentPartInfo, productType, bomType, creatorUserName, handlerId, checkRequiredFields, warn, t }) {
    const {
      factory,
      businessType,
      isBonded,
      workshopEnv,
      mainOperatorSkills,
      numberOfKnives,
      process,
      mainOperatorNumber,
      sapFactory,
      workCenter,
      projectClass,
    } = parentPartInfo || {};

    const requiredOk = checkRequiredFields([
      { value: insidePartNumber, msg: t('dict.PCCColumn.enterInfoPartNum') },
      { value: productType, msg: t('dict.PCCColumn.enterProdType') },
      { value: bomType, msg: t('dict.PCCColumn.enterBOMType') },
      { value: creatorUserName, msg: t('dict.PCCColumn.enterChooseProder') },
      { value: handlerId, msg: t('dict.PCCColumn.enterApprover') },
      { value: businessType, msg: t('dict.PCCColumn.enterBusinessType') },
      { value: factory, msg: t('dict.PCCColumn.enterProdFactory') },
      { value: isBonded, msg: t('dict.PCCColumn.enterIsBonded') },
      { value: sapFactory, msg: t('dict.PCCColumn.enterSapFactory') },
      { value: workCenter, msg: t('dict.PCCColumn.enterWorkCenter') },
      { value: workshopEnv, msg: t('dict.PCCColumn.enterWorkEnv') },
      { value: numberOfKnives, msg: t('dict.PCCColumn.enterBlades') },
      { value: process, msg: t('dict.PCCColumn.enterProdProcess') },
      { value: mainOperatorSkills, msg: t('dict.PCCColumn.enterMainSkill') },
      { value: mainOperatorNumber, msg: t('dict.PCCColumn.enterMainNum') },
    ]);
    if (!requiredOk) return false;

    // 如果项目分类为空，请求接口校验当前工厂 产品类型下是否有项目分类，如有，则阻止用户提交
    if (isNullOrUnDef(projectClass)) {
      const { data: list } = await getListProjectClass({ id: productType });
      if (!isEmpty(list)) return warn(t('dict.PCCColumn.enterProjectClass'));
    }

    if (!workCenter.startsWith(sapFactory)) {
      return warn(t('dict.PCCColumn.enterSAPFactoryAndWorkCenter'));
    }

    return true;
  }

  function validateStepDistance(stepDistanceList, warn, t) {
    if (!(stepDistanceList && stepDistanceList.length > 0)) {
      return warn(t('dict.PCCColumn.enterMainDistance'));
    }
    const firstStep = stepDistanceList[0] || {};
    if (!firstStep.stepDistance) return warn(t('dict.PCCColumn.enterMainDistance'));
    if (!firstStep.modulus) return warn(t('dict.PCCColumn.enterMainDistanceModulus'));
    return true;
  }

  function validateProcessList(processList, ensure, t) {
    let mainProcess = null;

    (processList || []).forEach((item, index) => {
      const row = index + 1;

      ensure(!!item.processCode, t('dict.PCCColumn.selectProcessFlowProcess', [row]));

      const is3 = item.processCode.startsWith('3');
      if (is3) ensure(!isNullOrUnDef(item.speed), t('dict.PCCColumn.inputProcessFlowSpeed', [row]));
      else ensure(!isNullOrUnDef(item.adjustmentTime), t('dict.PCCColumn.inputProcessFlowSetupTime', [row]));

      ensure(!isNullOrUnDef(item.defectRate), t('dict.PCCColumn.selectProcessFlowDefectRate', [row]));
      ensure(!isNullOrUnDef(item.useNumber), t('dict.PCCColumn.selectUseNumber', [row]));
      ensure(!isNullOrUnDef(item.capacity), t('dict.PCCColumn.selectProcessFlowProductionCapacity', [row]));

      if (item.isMain == 1) {
        ensure(item.useNumber > 0, t('dict.PCCColumn.MainUseNumberGt0'));
        mainProcess = item;
      }
    });

    ensure(!!mainProcess, t('dict.PCCColumn.selectMainProcess'));
  }

  function validateSemiFinishedFilled(semiFinishedList, ensure, t) {
    (semiFinishedList || []).forEach((item, index) => {
      const row = index + 1;
      ensure(!!item.semiFinished, t('dict.PCCColumn.entersemiFinished', [row]));
    });
  }

  function validateMaterialList(materialList, ensure, t) {
    (materialList || []).forEach((item, index) => {
      const row = index + 1;

      ensure(checkWidthMatch(item.partNumber, item.width), t('dict.QuotationColumn.enterMaterialWidth', [row]));

      ensure(!isNullOrUnDef(item.stepDistanceNumber), t('dict.PCCColumn.inputMaterialStepPitchGroupNumber', [row]));
      ensure(!!item.eightCode, t('dict.PCCColumn.inputMaterialEightDigitCode', [row]));
      ensure(!!item.originPartNumber, t('dict.PCCColumn.inputMaterialOriginPartNumber', [row]));
      ensure(!!item.partNumber, t('dict.PCCColumn.inputMaterialOriginPartNumber', [row]));

      // 如需恢复 17 位校验，在这里加一条 ensure(item.partNumber.length === 17, ...)
      ensure(!!item.useQtyMultiple, t('dict.PCCColumn.inputMaterialUsageMultiplier', [row]));
      ensure(!!item.useQty, t('dict.PCCColumn.inputMaterialUsageMultiplierTip', [row]));
      ensure(!!item.unit, t('dict.PCCColumn.inputMaterialUnit', [row]));
    });
  }

  function validateTestStripList(testStripList, ensure, t) {
    if (isEmpty(testStripList)) return;

    (testStripList || []).forEach((item, index) => {
      const row = index + 1;

      if (!item.partNumber) return;

      ensure(!!item.originPartNumber && item.originPartNumber.length === 17 && item.partNumber.length === 17, t('dict.PCCColumn.enterTestStripNumber', [row]));

      ensure(!isNullOrUnDef(item.materialEffectiveDate), t('dict.PCCColumn.enterMaterialEffectiveDate', [row]));
    });
  }

  function validatePackingFixedList(packingMaterialFixedList, ensure, t) {
    (packingMaterialFixedList || []).forEach((item, index) => {
      const row = index + 1;

      ensure(!isNullOrUnDef(item.type), t('dict.PCCColumn.selectPackagingMaterialRowType', [row]));
      ensure(!!item.packQty, t('dict.PCCColumn.selectPackagingQty', [row]));
      ensure(!!item.unit, t('dict.PCCColumn.selectPackagingUnit', [row]));
      ensure(!!item.description, t('dict.PCCColumn.selectPackageDesc', [row]));
      ensure(!!item.useQtyMultiple, t('dict.PCCColumn.selectPackageUsageMult', [row]));
      ensure(!!item.packUnit, t('dict.PCCColumn.selectPackageUnit', [row]));

      if (item.partNumber) {
        ensure(item.partNumber.length === 17, t('dict.PCCColumn.enterPackagingMaterialNumber', [row]));
      }
    });
  }

  // 清空客户文件
  function clearCustomerFile() {
    state.customerFileList = [];
  }

  function changeLoading(flag, source: 'manual' | 'detail' | 'tree' = 'manual') {
    loadingState[source] = flag;
    emit('changeLoading', loadingState.manual || loadingState.detail || loadingState.tree);
  }

  function closePopup(): 'close' | 'next' {
    const { index, cacheList } = state;
    skipPostSubmitRefresh = true;
    if (index === cacheList.length - 1) {
      emit('closePopup');
      return 'close';
    } else {
      // debugger
      state.pccDetailData = {};
      state.treeData = [];
      state.bomId = null;
      emit('changeCurrent', 'next');
      return 'next';
    }
  }

  function getCurrentValue() {
    return {
      ...currentData.value,
      ...state.pccDetailData,
    };
  }

  function changeBomId(bomId) {
    state.bomId = bomId;
  }

  async function calcDowntimeOneHour(callBack) {
    await nextTick();
    const { setTechnologyTableFieldsValue, getTechnologyTableFieldsValue } = ProcessFlowFormRef.value;
    const formValues = (await getNormalizedFormValues()) || {};
    const { singleRefuelingDuration } = getTechnologyTableFieldsValue();

    const [downtimeOneHour, utilizationRate] = calculateUtilizationRate({
      processList: ProcessFlowRef.value?.getDataSource(),
      process: formValues.technology?.process,
      stepDistanceList: getStepDistanceList(),
      materialList: getMaterialList(),
      singleRefuelingDuration,
    });
    setTechnologyTableFieldsValue({
      downtimeOneHour: downtimeOneHour.toFixed(2),
      utilizationRate: utilizationRate.toFixed(2),
    });

    if (isExist(callBack) && isFunction(callBack)) {
      callBack({
        downtimeOneHour: downtimeOneHour.toFixed(2),
        utilizationRate: utilizationRate.toFixed(2),
      });
    }
    // return {
    //   downtimeOneHour: downtimeOneHour.toFixed(2),
    //   utilizationRate: utilizationRate.toFixed(2),
    // }
  }

  function changeType(type) {
    state.type = type;
  }

  useKeepScroll({
    getScrollDom: () => {
      const _dom = document.querySelector('.scrollWrap');
      return _dom?.children[0] as HTMLElement;
    },
  });

  defineExpose({
    init, // 初始化数据，传入data
    getCurrentValue, // 获取当前值，包括detail的值
    handleSubmit, // 提交
    handlePccDetail, // 处理PCC数据
    handlePrint, // 打印
    getTreeData, // 获取Bom数据
    changeBomId,
    handleBomData,
    changeType,
  });
</script>

<template>
  <div ref="container" class="container-box">
    <div ref="bomContent" class="bom-content">
      <div class="drag-box">
        <div ref="divider" class="drag-ctrl"></div>
      </div>
      <div class="flex flex-col">
        <div class="w-full h-44px title flex flex-row-reverse justify-between">
          <div class="cursor-pointer" @click="() => (state.isPack = handleUnpack(bomContent, mainContent, isPack))">
            <i :class="['icon-ym icon-ym-nav-prev icon-color', isPack ? '' : 'rotate-90']" />
          </div>
          <Subtitle :title="t('common.Bom')" :class="[isPack ? 'opacity-100' : 'opacity-0', 'duration-300 ease-out pb-0']" />
        </div>
      </div>
      <a-spin class="h-full" :spinning="loadingBom">
        <div class="bom-list">
          <BasicTree
            :treeData="treeData"
            :checkable="false"
            :expandAction="false"
            :showLine="true"
            :defaultExpandAll="true"
            @dblclick="handleDblClick"
            :clickRowToExpand="false"
            :fieldNames="{
              children: 'children',
              title: 'code',
              key: 'id',
            }" />
        </div>
      </a-spin>
    </div>
    <div ref="mainContent" class="main-content">
      <NavBar @scroll-event="handleScroll" />
      <ScrollContainer ref="mainScroll" class="mt-40px scrollWrap">
        <a-card class="lydc-content-wrapper-search-box">
          <FormWrapper
            ref="formWrapperRef"
            @materialSetState="materialSetState"
            @setFlowUnit="setFlowUnit"
            :currentData="currentData"
            @calcDowntimeOneHour="calcDowntimeOneHour"
            @clearCustomerFile="clearCustomerFile"
            @getVersion="getVersion"
            @calcMaterialUseQty="calcMaterialUseQty({ ProcessFlowRef, getMaterialList, getStepDistanceList, handleCallBack: handleMaterialData })" />
        </a-card>
        <ProcessFlowForm ref="ProcessFlowFormRef" @calcDowntimeOneHour="calcDowntimeOneHour" />
        <ProcessFlow
          ref="ProcessFlowRef"
          :getValues="getNormalizedFormValues"
          @update-process="handleUpdateProcessFlow"
          @calcDowntimeOneHour="
            callBack => {
              calcDowntimeOneHour(callBack);
            }
          "
          @materialSetState="materialSetState"
          @calcCapacity="params => calcCapacity({ getStepDistanceList, getTechnologyFieldsValue: formWrapperRef?.getTechnologyFieldsValue, ...params })"
          @calcMaterialUseQty="calcMaterialUseQty({ ProcessFlowRef, getMaterialList, getStepDistanceList, handleCallBack: handleMaterialData })" />
        <PccSemiFinished
          ref="PccSemiFinishedRef"
          :getValues="getNormalizedFormValues"
          @calcSemiFinishedUseQty="(row, $grid) => calcSemiFinishedUseQty({ ProcessFlowRef, getStepDistanceList, row, grid: $grid })" />
        <PccMaterial
          :getValues="formWrapperRef?.getValues"
          @calcDowntimeOneHour="calcDowntimeOneHour"
          @calcSingleRowUseQty="row => calcSingleRowUseQty({ ProcessFlowRef, getStepDistanceList, row })" />
        <PccTestStrip />
        <PccPackage ref="PccPackageRef" />
        <FileUpload ref="FileUploadRef" :state="state" x />
        <pccHistory ref="PccHistoryRef" />
      </ScrollContainer>
    </div>
  </div>
</template>

<style scoped lang="less" src="./style.less" />
