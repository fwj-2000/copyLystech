<script setup lang="ts">
  import { handleUnpack } from '/@/views/engineering/quotationBom/utils';
  import { Subtitle } from '/@/components/Subtitle';
  import ProcessFlow from './ProcessFlow/ProcessFlow.vue';
  import HalfPart from './HalfPart/halfPart.vue';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import NavBar from './navBar.vue';
  import PccPackage from '/@/views/engineering/PCCBeta/components/PccPackage/PccPackage.vue';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { useMaterial } from './Material/useMaterial';
  import FormWrapper from './FormWrapper.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { computed, nextTick, reactive, ref, toRefs, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getBomStructure, getBomDetail, updateFinishedParts, updateHalfFinishedParts } from '/@/api/engineering/quanlityReview';
  import { isEmpty } from '/@/utils/is';
  import { bignumber, multiply } from 'mathjs';
  import { materialRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { packageFieldMap, packageCoreFieldMap } from '../config';
  import { cloneDeep } from 'lodash-es';
  import useKeepScroll from '/@/hooks/event/useKeepScroll';
  import { calcHalfPartUseQty } from '/@/views/engineering/data/produce/componentsBom/utils/calcHalfPart';
  import { calcSingleRowUseQty } from '/@/views/engineering/PCCBeta/components/utils/useQty';

  const { createConfirm } = useMessage();

  const { t } = useI18n();

  const emit = defineEmits(['register', 'changeLoading', 'closePopup']);

  const state = reactive({
    isPack: false, // 是否是折叠状态
    disabled: false, // 是否禁用
    loadingBom: false,
    mode: ModeTypeEnum.VIEW,
    cacheList: [],
    index: 0,
    treeData: [], // BOM树数据
    partId: '', // 成品id
    bomId: '', // 当前bom层的id
    bomType: 1, // 默认是成品BOM
    bomMainBaseInfo: {}, // bom主体基础信息
    orderMainBaseInfo: {}, // 成品单主体基础信息
  });

  const bomContent = ref<HTMLElement | null>();
  const mainContent = ref<HTMLElement | null>();

  const ProcessFlowRef = ref();
  const PccPackageRef = ref();
  const HalfPartRef = ref();
  const MaterialRef = ref();

  const { createMessage } = useMessage();

  const divider = ref();
  const container = ref();
  const mainScroll = ref<ElRef>();

  const [
    Material,
    {
      reloadData: materialReloadData,
      materialSetState,
      getDataSource: materialGetDataSource,
      setDisabled: materialSetDisabled,
      validateMaterialList,
      setInitMaterialList,
    },
  ] = useMaterial();

  const { isPack, treeData, loadingBom } = toRefs(state);
  const formWrapperRef = ref();

  const currentBaseData = computed(() => {
    return state.cacheList[state.index] || {};
  });

  function handleScroll(top) {
    if (isNaN(top) || !mainScroll.value) return;
    const warp = mainScroll.value?.getScrollWrap();
    mainScroll.value.scrollTo(warp.scrollTop + top - 230);
  }

  // 获取当前成品的id
  function getEngineerInfoId(data) {
    if (typeof data.engineeringInformationId == 'undefined' || data.engineeringInformationId == '') {
      return state.partId;
    }
    return data.engineeringInformationId;
  }

  // 初始化数据
  async function init(data) {
    const cacheList = data.cacheList || [];
    const index = data.index || 0;
    state.cacheList = cacheList;
    state.index = index;
    state.mode = data.mode;
    changeLoading(true);

    // 如果列表数据为空，直接重置数据
    if (isEmpty(cacheList)) {
      resetData();
      return;
    }
    const _currentData: any = cacheList[index];
    state.bomId = _currentData.id;
    state.partId = _currentData.id;
    // 获取Bom数据
    getTreeData({
      id: _currentData?.id,
    });
    initData(_currentData, 'init');
    handleDisabled(data);
  }

  // 处理数据展示
  function initData(data, type?: 'init' | 'history') {
    changeLoading(true);
    const bomId = data.bomId || data.id;
    state.bomId = bomId;
    if (bomId) return handleDetail(data, type);
    resetData();
  }

  // 处理物料列表
  function getMaterialList(): any {
    return materialGetDataSource().map((item, index) => ({
      ...item,
      engineeringInformationId: getEngineerInfoId(item),
      materialNumber: index + 1,
      materialUtilization: item.materialUtilization ? item.materialUtilization.replace('%', '') : '',
    }));
  }

  // 获取包装数据
  function getPackageData() {
    const packageData = PccPackageRef.value.getDataSource();
    const changePackageData = (list, fieldMap) => {
      return list.map((item, index) => {
        const _item: any = {
          id: item.id,
          packagingNumber: index + 1,
          qeParentId: item.qeParentId,
          engineeringInformationId: getEngineerInfoId(item),
        };
        // 字段映射
        for (const key in fieldMap) {
          const _originkey = fieldMap[key];
          if (Object.hasOwnProperty.call(item, _originkey)) {
            const element = item[_originkey];
            _item[key] = element;
          }
        }
        return _item;
      });
    };
    return {
      engineeringPackagings: changePackageData(packageData.packingMaterialFixedList, packageFieldMap),
      engineeringPackagingList: changePackageData(packageData.packingMaterialCustomList, packageCoreFieldMap),
    };
  }

  // 获取工艺列表
  function getProcessList() {
    const { getDataSource } = ProcessFlowRef.value;
    const list = getDataSource().map((item, index) => ({
      ...item,
      engineeringInformationId: getEngineerInfoId(item),
      processNumber: index + 1,
    }));
    return list;
  }

  // 获取半成品料号
  function getHalfPartList() {
    const { getDataSource } = HalfPartRef.value;
    return getDataSource().map((item, index) =>
      Object.assign(item, {
        number: index + 1,
        engineeringInformationId: getEngineerInfoId(item),
      }),
    );
  }

  // 处理步骤距离列表
  function getStepDistanceList() {
    const technologyList = formWrapperRef.value.getStepDistanceList();
    return technologyList.map((item, index) => ({
      ...item,
      engineeringInformationId: getEngineerInfoId(item),
      number: index + 1,
      level: index === 0,
    }));
  }

  // 处理可编辑状态
  function handleDisabled(data) {
    const { type: mode } = data;
    state.disabled = mode === ModeTypeEnum.VIEW;
    if (mode === ModeTypeEnum.VIEW) {
      formWrapperRef.value?.setDisabled(true);
      ProcessFlowRef.value?.setDisabled(true);
      materialSetDisabled(true);
      PccPackageRef.value?.setDisabled(true);
      HalfPartRef.value?.setDisabled(true);
    } else {
      HalfPartRef.value?.setDisabled(false);
    }
  }

  // 处理详情
  async function handleDetail(data, type?: 'init' | 'history') {
    try {
      const bomRes = await getBomDetail(data.bomId || data.id);
      if (bomRes.code !== 200) {
        throw new Error('Failed to fetch details');
      }
      const { data: bomData } = bomRes;
      // 初始值时，更换成品数据
      if (type == 'init') {
        state.cacheList[state.index] = bomData.parentPartInfo;
      }
      await handleBomData(bomData);
      await nextTick();
      changeLoading(false);
    } catch (err) {
      handleSubmitError(err);
      return changeLoading(false);
    }
  }
  // 处理Bom数据
  async function handleBomData(bomData, type?: string) {
    const {
      processList,
      stepDistanceList,
      materialList,
      parentPartInfo,
      engineeringPackagingList,
      engineeringPackagings,
      quantitativeSemiList,
      quantitativePlanUserId,
      quantitativePlanUserName,
    } = bomData;
    parentPartInfo.quantitativePlanUserId = quantitativePlanUserId || '';
    parentPartInfo.quantitativePlanUserName = quantitativePlanUserName || '';
    // 基础数据
    if (type == 'history') {
      parentPartInfo.shipPattern = state.cacheList[state.index]?.shipPattern;
      handleParentPartInfoByHistory(parentPartInfo);
    } else {
      handleParentPartInfo(parentPartInfo);
    }
    // 步距信息
    handleTechnicalData(stepDistanceList);
    // 工艺流程
    await handleProcessData(processList);
    // 半成品料号
    handleHalfPartData(quantitativeSemiList);
    // 材料
    handleMaterialData(materialList, stepDistanceList, processList);
    // 包材数据
    handlePackageData(engineeringPackagingList, engineeringPackagings, parentPartInfo);
  }

  // 处理基础数据
  async function handleParentPartInfo(data) {
    const { setBaseInfoFieldsValue, resetFormFields, setDisabledByBomType } = formWrapperRef.value;
    resetFormFields();
    const _d = cloneDeep(data);
    setBaseInfoFieldsValue(_d);
    setDisabledByBomType(state.bomType);
    state.bomMainBaseInfo = _d;
  }
  // 处理引用过来的基础数据
  async function handleParentPartInfoByHistory(data) {
    const { setBaseInfoFieldsValue } = formWrapperRef.value;
    const _d = cloneDeep(data);
    // 过滤出需要填写的数据
    const currentBaseInfo = {
      experimentType: _d.experimentType,
      experimentDuration: _d.experimentDuration,
      experimentQty: _d.experimentQty,
      mould: _d.mould,
      estimatedMoldTime: _d.estimatedMoldTime,
      engineeringRemarks: _d.engineeringRemarks,
      process: _d.process,
    };
    setBaseInfoFieldsValue(currentBaseInfo);
  }

  // 处理步距信息
  function handleTechnicalData(data) {
    const { setTechnologyList, setInitTechnologyList } = formWrapperRef.value;
    if ((!data || !data.length) && !state.disabled) {
      setInitTechnologyList();
      return;
    }
    setTechnologyList(
      (data || [])?.map(item => ({
        ...item,
        uuid: item.id,
        stepDistance: item.stepDistance?.toString(),
        modulus: item.modulus?.toString(),
      })),
    );
  }
  // 处理材料
  async function handleMaterialData(data, stepDistanceList, processList) {
    let formattedMaterials = [];
    if ((!data || !data.length) && !state.disabled) {
      setInitMaterialList();
    } else {
      formattedMaterials = (data || []).map(item => {
        const target = {
          ...item,
          uuid: item.id,
          origin: {
            qty: item.qty,
          },
        };
        const processNumber = parseInt(item.processNumber - 1) <= 0 ? 0 : parseInt(item.processNumber - 1);
        if (!isNaN(processNumber)) {
          const process = processList[processNumber];
          target.processName = `${processNumber + 1}、${process.processCode}`;
        }
        if (item.materialUtilization) {
          target.materialUtilization = parseFloat(multiply(bignumber(item.materialUtilization), '100')).toFixed(2) + '%';
        }
        return target;
      });
      materialReloadData(formattedMaterials);
    }
    materialSetState({
      list: formattedMaterials,
      stepDistanceList,
      processList,
    });
  }
  // 处理工艺流程
  async function handleProcessData(data) {
    const { setProcessFlowTable, setInitList } = ProcessFlowRef.value;
    if ((!data || !data.length) && !state.disabled) {
      setInitList();
      return;
    }
    const processTableData = (data || []).map(item => {
      return {
        ...item,
        uuid: item.id,
        processName: item.processName && item.processNumber ? `${item.processCode}(${item.processName})` : '',
      };
    });
    await setProcessFlowTable(processTableData);
  }
  // 处理半成品料号
  function handleHalfPartData(data) {
    HalfPartRef.value?.setHalfPartTableData(data || []);
  }
  // 处理包材
  async function handlePackageData(customList, fixedList, parentInfo) {
    const packageRef = unref(PccPackageRef);
    const hasPackageData = (customList && customList.length) || (fixedList && fixedList.length);
    let PackInfos = {
      packingMaterialFixedList: [],
      packingMaterialCustomList: [],
    };
    if (hasPackageData) {
      PackInfos = formatPackageList(customList, fixedList);
    }
    packageRef.setTableData({
      config: {
        shipPattern: parentInfo.shipPattern, // 取父级的信息，避免切换bom时，数据错乱
        source: 'quanlity',
        mode: state.mode,
      },
      packageSpecQty: parentInfo.packageRuleQty || '',
      ...PackInfos,
    });
  }

  // 获取bom初始层数据
  function formatPackageList(customList, fixedList) {
    // 更新数据格式
    const formatPackageType = (list, FieldMap = {}) => {
      return (list || []).map(item => {
        const target = {
          ...item,
          uuid: item.id,
          typeName: item.packagingType,
        };
        // 字段映射
        for (const key in FieldMap) {
          if (Object.hasOwnProperty.call(item, key)) {
            const element = item[key];
            target[FieldMap[key]] = element;
          }
        }
        return target;
      });
    };
    return {
      packingMaterialCustomList: formatPackageType(customList, packageCoreFieldMap),
      packingMaterialFixedList: formatPackageType(fixedList, packageFieldMap),
    };
  }

  async function handleHistoryData(data) {
    handleBomData(data, 'history');
  }

  async function resetData() {
    changeLoading(true);
    // 重置数据
    const { cacheList, index } = state;
    const currentCache: any = cacheList[index];
    // 参数校验
    if (!currentCache) {
      changeLoading(false);
      return;
    }
    // 清空基础信息
    const { resetFormFields, setBaseInfoFieldsValue } = formWrapperRef.value;
    await resetFormFields();
    await nextTick();

    // 设置基础信息
    setBaseInfoFieldsValue({
      ...currentCache,
    });
    // 初始化表格数据
    initializeMaterialTable();
    initializeTechnologyData();
    initializePackageData(currentCache?.parentPartInfo?.shipPattern);

    await nextTick();
    changeLoading(false);
  }

  // 重置料号
  function initializeMaterialTable() {
    const initialMaterial = {
      ...materialRowData,
      uuid: buildUUID(),
    };

    materialReloadData([initialMaterial]);
  }

  // 重置工艺
  function initializeTechnologyData() {
    const { setProcessFlowTable } = ProcessFlowRef.value;
    const initialTechData = [
      createTechRow('101', 'materialPreparation', 0),
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
    setProcessFlowTable(initialTechData);
  }

  function createTechRow(processCode, dictKey) {
    const rowData = {
      processCode: null,
      processCodeName: '',
      lineAdjustmentTime: 0,
      capacity: 0,
      defectiveRate: 0,
    };

    return {
      ...rowData,
      processCode,
      processName: `${processCode}(${t(`dict.PCCApplyColumn.${dictKey}`)})`,
      uuid: buildUUID(),
      disabled: processCode ? { speed: false, speedUnit: false } : {},
    };
  }

  // 重置包材
  function initializePackageData(shipPattern) {
    const packageRef = unref(PccPackageRef);
    packageRef.init({
      shipPattern: shipPattern,
      source: 'quanlity',
    });
  }

  async function handleSubmit(type: 'save' | 'commit' | 'calc') {
    try {
      changeLoading(true);
      const currentCache = currentBaseData.value;
      // 数据准备部分
      const params = await prepareSubmitParams(type, currentCache);
      if (!(await validateParams(params))) return;
      if (!state.treeData.length || state.bomType === 1) {
        // 成品
        await handleRootBomUpdate(params, currentCache, type);
      } else {
        // 半成品
        await handleHalfPartBomUpdate(params);
      }
      handlePostSubmitActions(type);
    } finally {
      changeLoading(false);
    }
  }

  // 准备提交参数
  async function prepareSubmitParams(type: 'save' | 'commit' | 'calc', currentCache: any): Promise<any> {
    const baseInfo = formWrapperRef.value.getBaseInfoFieldsValue();
    const params = {
      innerMaterialNumber: currentCache.innerMaterialNumber,
      insidePartNumberOld: currentCache.insidePartNumberOld,
      quantitativeApplyId: currentCache.quantitativeApplyId,
      engineeringInformationId: getEngineerInfoId(currentCache),
      ...baseInfo,
      parentPartInfo: getParentPartInfo(),
      materialList: getMaterialList(),
      ...getPackageData(),
      stepDistanceList: getStepDistanceList(), // 步距
      processList: getProcessList(), // 工艺
      quantitativeSemis: getHalfPartList(), // 半成品
      saveAndCommit: type === 'commit',
    };
    return params;
  }
  // 处理提交后操作
  function handlePostSubmitActions(type: 'save' | 'commit' | 'calc') {
    if (type === 'save') {
      createMessage.success(t('common.draft') + t('common.successText'));
    }
    if (type === 'commit') {
      createMessage.success(t('common.submitText') + t('common.successText'));
      return closePopup();
    }
    // 如果是calc，不关闭详情，刷新数据
    return initData({ bomId: state.bomId, id: currentBaseData.value.id });
  }

  // 错误处理
  function handleSubmitError(error: unknown) {
    createMessage.error('获取BOM详情失败:' + error);
    changeLoading(false);
  }

  // 获取父零件信息
  function getParentPartInfo(): any {
    const packageData = PccPackageRef.value.getDataSource();
    const baseInfo = formWrapperRef.value.getBaseInfoFieldsValue();
    return {
      ...baseInfo,
      engineeringInformationId: getEngineerInfoId(baseInfo),
      packageRuleQty: packageData.packSpecQtyR || packageData.packSpecQtyPN,
    };
  }

  function handleDblClick(_, value) {
    if (!value || !value.id) return;
    if (!value.hasChild) return createMessage.warning(t('common.halfTip'));
    const changeBom = () => {
      initData({
        bomId: value.id,
      });
      state.bomType = value.type || 1; // 默认是成品BOM
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
  }

  // 获取当前层的主键id
  function getMainId() {
    return state.treeData.length ? state.treeData[0].id : state.bomId;
  }
  // 处理根BOM更新
  async function handleRootBomUpdate(params: any, currentCache: any, type) {
    await updateFinishedParts(currentCache.id, {
      ...params,
      saveAndCommit: type == 'commit',
    });
    await getTreeData({ id: getMainId() });
  }

  // 处理半成品BOM更新
  async function handleHalfPartBomUpdate(params: any) {
    params.engineeringId = state.bomMainBaseInfo.engineeringInformationId;
    params.bomId = state.bomId;
    const res = await updateHalfFinishedParts(state.bomId, params);
    await initData({ id: state.bomId });
    await getTreeData({ id: getMainId() });
  }

  // 获取bom初始层数据
  function getTreeData(data) {
    state.loadingBom = true;
    getBomStructure(data.id)
      .then(({ code, data }) => {
        if (code == 200) {
          state.treeData = data;
        }
      })
      .then(() => {
        state.loadingBom = false;
      });
  }

  async function validateParams(params) {
    // 校验半成品是否有相同的物料
    const { validateSameHalfPart } = HalfPartRef.value;
    try {
      if (!(await validateSameHalfPart())) return false;
      const { saveAndCommit } = params;
      if (!saveAndCommit) {
        return true;
      }
      // 如果是提交，进行参数校验
      const { validateStepDistanceList, validateBaseInfoFields } = formWrapperRef.value;
      const { validateBasePackage } = PccPackageRef.value;
      const { validateHalfPart } = HalfPartRef.value;
      await validateBaseInfoFields();
      await validateHalfPart();
      await ProcessFlowRef.value.validateProcessFlow();
      const materialList = await validateMaterialList();
      // 有材料时，才校验基础信息
      if (materialList?.length) {
        await validateStepDistanceList();
      }
      await validateBasePackage();
      return true;
    } catch (errorInfo) {
      let errorMessage = errorInfo;
      if (errorInfo && errorInfo?.errorFields) {
        errorMessage = t('common.inputText', [t('common.baseinfo')]);
      }
      createMessage.info(errorMessage as string);
      return false;
    }
  }

  function changeLoading(flag) {
    emit('changeLoading', flag);
  }

  function closePopup() {
    emit('closePopup');
  }

  function getCurrentValue() {
    return {
      ...currentBaseData.value,
    };
  }

  function changeBomId(bomId) {
    state.bomId = bomId;
  }

  useKeepScroll({
    getScrollDom: () => {
      const _dom = document.querySelector('.getScrollValue');
      return _dom?.children[0] as HTMLElement;
    },
  });

  defineExpose({
    init, // 初始化数据，传入data
    getCurrentValue, // 获取当前值，包括detail的值
    handleSubmit, // 提交
    handleDetail, // 处理详情
    getTreeData, // 获取Bom数据
    changeBomId,
    handleHistoryData,
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
            :showLine="true"
            :expandAction="false"
            :defaultExpandAll="true"
            @dblclick="handleDblClick"
            :clickRowToExpand="false"
            :style="{ overflowY: 'hidden' }"
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
      <ScrollContainer ref="mainScroll" class="getScrollValue">
        <a-card class="lydc-content-wrapper-search-box">
          <FormWrapper ref="formWrapperRef" @materialSetState="materialSetState" :currentBaseData="currentBaseData" />
        </a-card>
        <ProcessFlow ref="ProcessFlowRef" @materialSetState="materialSetState" />
        <HalfPart ref="HalfPartRef" :config="currentBaseData" @calcHalfPartUseQty="row => calcHalfPartUseQty({ ProcessFlowRef, row })" />
        <Material
          ref="MaterialRef"
          @calcSingleRowUseQty="row => calcSingleRowUseQty({ ProcessFlowRef, getStepDistanceList: formWrapperRef.getStepDistanceList, row })"
          :currentData="currentBaseData" />
        <PccPackage ref="PccPackageRef" />
      </ScrollContainer>
    </div>
  </div>
</template>

<style scoped lang="less" src="/@/views/engineering/PCCBeta/components/style.less" />
<style lang="less" scoped>
  .main-content .ant-card {
    margin-top: 8px;
  }

  :deep(.ant-tree-list) {
    overflow-x: hidden !important;
  }
</style>
