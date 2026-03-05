<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { RejectModal } from '/@/components/CustomComponents';
  import { getBaseDataWagerateList } from '/@/api/finance/wageRate';
  import { computed, markRaw, nextTick, onBeforeUnmount, ref, shallowRef, reactive } from 'vue';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { Subtitle } from '/@/components/Subtitle';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { handleUnpack, registerMouseEvent } from '/@/views/engineering/quotationBom/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGlobSetting } from '/@/hooks/setting';
  import NavBar from '/@/views/engineering/quotationBom/components/NavBar.vue';
  import { useVbenForm } from '/@/adapter/form';
  import { getBaseFormSchema } from '/@/views/engineering/quotationBom/components/config';
  import Process from '/@/views/engineering/quotationBom/components/Process/Process.vue';
  import { isEmpty } from 'xe-utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import History from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import {
    rejectQuotation,
    getQuotationBOM,
    getQuotationBOMDetail,
    updateQuotationFinishedParts,
    addQuotationFinishedParts,
    getQuotationDetail,
    updateQuotationHalfFinishedParts,
  } from '/@/api/engineering/quotatios';
  import { postConvertHistoryData } from '/@/api/engineering/pcc';
  import HalfFinished from './HalfFinished/HalfFinished.vue';
  import Material from './Material/Material.vue';
  import Mold from './Mold/Mold.vue';
  import BomPackage from './BomPackage/BomPackage.vue';
  import Silicone from './Silicone/Silicone.vue';
  import { bignumber, chain, divide, format, multiply } from 'mathjs';
  import { useBaseStore } from '/@/store/modules/base';
  import { useUserStore } from '/@/store/modules/user';
  import { isBoolean, isExist, isNullOrUnDef } from '/@/utils/is';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { dateUtil } from '/@/utils/dateUtil';
  import { getToken } from '/@/utils/auth';
  import { encryptByBase64 } from '/@/utils/cipher';
  import { cloneDeep, pick } from 'lodash-es';
  import { processUrl } from '/@/adapter/utils';
  import { useQuotaStore } from '/@/views/engineering/quotationBom/store/index';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadFile, isNewFile } from '/@/utils/file/download';
  import { updatePrice } from '/@/api/business/priceConfirmation';
  import { uploadFiles } from '/@/api/engineering/pcc';
  import PriceList from './PriceList/PriceList.vue';
  import DrawViewModal from '/@/views/engineering/pcc/pccApply/components/DrawViewModal.vue';
  import { PRODUCTION_TYPE_ENUM } from './HalfFinished/config';
  import { calculateUseQty } from './Material/config';
  import KeepScroll from './KeepScroll';
  import { ImageUpload } from '/@/components/Upload';

  const quotaStore = useQuotaStore();
  const emit = defineEmits(['reload', 'register']);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerQuotaModal, { openModal: openQuotaModal }] = useModal();
  const baseStore = useBaseStore();
  const userStore = useUserStore();

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();
  const getUserInfo = computed(() => userStore.getUserInfo || {});
  const globSetting = useGlobSetting();

  const [registerPopup, { closePopup, changeLoading: changePopupLoading }] = usePopupInner(init);
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();

  const divider = ref(null);
  const container = ref(null);
  const bomContent = ref<HTMLElement | null>(null);
  const mainContent = ref<HTMLElement | null>(null);
  const mainScroll = ref<HTMLElement | null>(null);
  const treeHeight = ref(600);
  let cleanupMouseEvent: null | (() => void) = null;
  const wageRateCache = new Map<string, any>();
  let treeRequestId = 0;
  let bomDetailRequestId = 0;

  const isPack = ref(false);
  const filePreviewRef = ref<any | null>(null);
  const treeData = shallowRef<any[]>([]);
  const cacheList = shallowRef<any[]>([]);
  const index = ref(0);
  const loading = ref(false);
  const wageRate = shallowRef<any>({});
  const isCommit = ref(false);
  const mode = ref('');
  const showSyncPrice = ref(false);
  const quotaImageList = ref<any[]>([]);
  const finishedProductId = ref('');
  const halfSign = ref('');
  const halfFinishedPartId = ref('');
  const halfFinishedPartBomId = ref('');
  const isReview = ref(false);
  const showDialog = ref(false);
  const showSubmit = ref(false);
  const loadingBom = ref(false);

  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as File[],
  });

  const IMAGE_EXTENSIONS = new Set(['.bmp', '.gif', '.heic', '.heif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp']);

  function normalizeQuotaFileItem(item: any) {
    const fileName = item?.fileName || item?.name || '';
    const filePath = item?.filePath || item?.url || '';
    return {
      ...item,
      fileName,
      filePath,
    };
  }

  function getQuotaFileKey(item: any): string {
    return `${getQuotaFileUrl(item)}|${getQuotaFileName(item)}`;
  }

  function isSameQuotaImageList(currentList: any[], nextList: any[]): boolean {
    if (currentList.length !== nextList.length) return false;
    for (let i = 0; i < currentList.length; i += 1) {
      if (getQuotaFileKey(currentList[i]) !== getQuotaFileKey(nextList[i])) {
        return false;
      }
    }
    return true;
  }

  const quotaFileList = computed(() =>
    quotaImageList.value
      .map((item, sourceIndex) => ({
        ...normalizeQuotaFileItem(item),
        sourceIndex,
      }))
      .filter(item => !isImageQuotaFile(item)),
  );

  const imageList = computed({
    get() {
      return quotaImageList.value.filter(item => isImageQuotaFile(item));
    },
    set(value) {
      const nextImages = normalizeQuotaImageValue(value);
      const restFiles = quotaImageList.value.filter(item => !isImageQuotaFile(item));
      const currentImages = quotaImageList.value.filter(item => isImageQuotaFile(item));
      if (isSameQuotaImageList(currentImages, nextImages)) {
        return;
      }
      quotaImageList.value = [...restFiles, ...nextImages];
    },
  });

  const [BaseForm, { getValues, setValues, setState }] = useVbenForm({
    wrapperClass: 'grid-cols-24',
    commonConfig: {
      colon: false,
      formItemClass: 'col-span-8',
      labelClass: 'w-full justify-start',
      componentProps: {
        class: 'w-full',
      },
    },
    layout: 'vertical',
    schema: getBaseFormSchema(),
    showDefaultActions: false,
    i18nConfig: {
      moduleCode: 'QuotationColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const currentData = computed(() => {
    return cacheList.value[index.value];
  });

  const formValues = computed(async () => {
    return await getValues();
  });

  const ProcessRef = ref(null);
  const MaterialRef = ref(null);
  const MoldRef = ref(null);
  const BomPackageRef = ref(null);
  const SiliconeRef = ref(null);
  const PriceListRef = ref(null);
  const HalfFinishedRef = ref(null);

  function handleScroll(top) {
    if (isNaN(top) || !mainScroll.value) return;
    const warp = mainScroll.value.getScrollWrap();
    mainScroll.value.scrollTo(warp.scrollTop + top - 230);
  }

  function updateTreeHeight() {
    const el = container.value as HTMLElement | null;
    if (!el) return;
    treeHeight.value = Math.max(260, el.clientHeight - 80);
  }

  async function init(data) {
    isPack.value = false;
    isReview.value = Boolean(data.isReview);

    await initData(data);
    await nextTick();

    handleDisabled(data);
    updateTreeHeight();

    cleanupMouseEvent?.();
    cleanupMouseEvent = registerMouseEvent({ isPack }, divider, container, bomContent, mainContent);
  }

  onBeforeUnmount(() => {
    cleanupMouseEvent?.();
    cleanupMouseEvent = null;
  });

  async function initData(data: any) {
    changeLoading(true);
    const { cacheList: list, index: idx, showDialog: dialog, showSubmit: submit, mode: m, showSyncPrice: sync } = data;
    showDialog.value = dialog;
    quotaImageList.value = [];
    index.value = idx;
    const nextCacheList = Array.isArray(list) ? list.slice() : [];
    cacheList.value = nextCacheList;
    finishedProductId.value = nextCacheList?.[idx]?.id || '';
    halfSign.value = '';
    halfFinishedPartId.value = '';
    halfFinishedPartBomId.value = '';

    showSubmit.value = submit;
    mode.value = m;
    showSyncPrice.value = sync;

    if (isEmpty(nextCacheList)) {
      return resetData();
    }
    const _current = nextCacheList[idx];
    try {
      const res = await getQuotationDetail({ id: _current.id });
      const updated = cacheList.value.slice();
      updated[idx] = Object.assign(res.data, updated[idx]);
      cacheList.value = updated;
    } catch (error) {}

    const _currentData = cacheList.value[idx];
    initWagerate(_currentData);
    buildBaseInfo(_currentData);
    buildTreeData(_currentData.bomId);
    buildBomData(_currentData);
  }

  function handleDisabled(data) {
    const isDiabled = data.mode == 'view';
    setState({
      commonConfig: {
        disabled: isDiabled,
      },
    });
    BomPackageRef.value?.setDisabled(isDiabled);
    MaterialRef.value?.setDisabled(isDiabled);
    MoldRef.value?.setDisabled(isDiabled);
    SiliconeRef.value?.setDisabled(isDiabled);
    ProcessRef.value?.setDisabled(isDiabled);
    HalfFinishedRef.value?.setDisabled(isDiabled);
  }

  async function handleDblClick(_event, value) {
    if (!value.hasChild) {
      createMessage.warn(t('dict.QuotationColumn.noBOMTip'));
      return false;
    }

    if ((!halfFinishedPartBomId.value && value.id === currentData.value.bomId) || value.id === halfFinishedPartBomId.value) {
      return false;
    }

    let flag = true;
    if (mode.value !== 'view') {
      flag = await new Promise(resolve =>
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          content: t('dict.QuotationColumn.enterClearConfirm'),
          onOk: async () => {
            resolve(true);
          },
          onCancel: async () => {
            resolve(false);
          },
        }),
      );
    }

    if (!flag) {
      return false;
    }

    halfSign.value = '';
    halfFinishedPartId.value = '';
    halfFinishedPartBomId.value = '';

    if (+value.type === 1) {
      return initData({
        cacheList: cacheList.value,
        index: index.value,
        showDialog: showDialog.value,
        showSubmit: showSubmit.value,
        mode: mode.value,
        showSyncPrice: showSyncPrice.value,
        isReview: isReview.value,
      });
    }

    changeLoading(true);
    return Promise.all([getQuotationDetail({ id: value.detailId }), buildBomData({ bomId: value.id })])
      .then(([{ data: baseInfo }, data]) => {
        if (!data) {
          return false;
        }
        data?.parentPartInfo?.factory && initWagerate(data.parentPartInfo);

        setValues({
          ...(baseInfo || {}),
          ...pick(data.parentPartInfo || {}, ['productSpec', 'moq', 'remark', 'images']),
          factory: baseInfo?.factory,
          factoryName: baseInfo?.factoryName,
          productSpec: data.parentPartInfo?.productSpec || currentData.value?.productSpec || '',
          moq: data.parentPartInfo?.moq || currentData.value?.moq || '',
          managementRate: data.managementRate * 100,
          isBonded: data.isBonded ? 1 : 0,
        });
        const parseImage = JSON.parse(data?.parentPartInfo?.images || '[]');
        if (isEmpty(parseImage) || isEmpty(parseImage[0])) {
          quotaImageList.value = [];
        } else {
          quotaImageList.value = parseImage;
        }

        halfSign.value = 'edit';
        halfFinishedPartId.value = data?.parentPartInfo?.id || '';
        halfFinishedPartBomId.value = value.id || '';
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  function buildBaseInfo(data) {
    const {
      qrApplyCode,
      purpose,
      productDesc,
      insidePartNumber,
      insidePartNumberOld,
      factory,
      factoryName,
      qrApplyUserName,
      terminalCustomerProjectCode,
      members,
      phase,
      totalQty,
      remark,
      productSpec,
      moq,
    } = data;
    setValues({
      qrApplyCode,
      purpose,
      purposeName: purpose,
      productDesc,
      insidePartNumber,
      insidePartNumberOld,
      factory,
      factoryName,
      qrApplyUserName,
      terminalCustomerProjectCode,
      members,
      phase,
      totalQty,
      remark: remark || '',
      productSpec: productSpec || '',
      moq: moq || '100',
    });
  }

  function buildTreeData(bomId) {
    const requestId = ++treeRequestId;
    getQuotationBOM({ bomId: bomId }).then(({ code, data }) => {
      if (requestId !== treeRequestId) return;
      if (code !== 200) return;
      treeData.value = markRaw(Array.isArray(data) ? data : []);
    });
  }

  async function buildBomData(currentValues) {
    const { bomId } = currentValues;
    if (bomId) {
      const requestId = ++bomDetailRequestId;
      const { code, data } = await getQuotationBOMDetail({ id: bomId });
      if (requestId !== bomDetailRequestId) return;
      if (code !== 200) {
        changeLoading(false);
        return;
      }
      const { processList, materialList, moldList, packingMaterialList, parentPartInfo, siliconePartList, halfFinishedPartsList } = data;

      handleRate(parentPartInfo || {});
      handleProcessData(processList);
      handleMaterialData(materialList, processList);
      handleMoldData(moldList);
      handleBomPackageData(packingMaterialList);
      handleSiliconeData(siliconePartList);
      handleParentPartData(parentPartInfo || {});
      handleHalfFinishedData(halfFinishedPartsList);
      await nextTick();
      if (requestId === bomDetailRequestId) {
        changeLoading(false);
      }
      return data;
    }
    resetData();
  }

  async function handleRate(parentPartInfo) {
    const {
      materialCost,
      directLaborCost,
      indirectLaborCost,
      moldCost,
      outsourcingCost,
      dynamicEquipmentCost,
      managementCost,
      singleCost,
      fixedEquipmentCost,
    } = parentPartInfo;

    const list = [
      {
        name: t('common.materialCost'),
        value: materialCost,
        rate:
          format(multiply(divide(bignumber(materialCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.directLaborCost'),
        value: directLaborCost,
        rate:
          format(multiply(divide(bignumber(directLaborCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.indirectLaborCosts'),
        value: indirectLaborCost,
        rate:
          format(multiply(divide(bignumber(indirectLaborCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.MoldCampFixtureFee'),
        value: moldCost,
        rate:
          format(multiply(divide(bignumber(moldCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.outsourcingProcessingFee'),
        value: outsourcingCost,
        rate:
          format(multiply(divide(bignumber(outsourcingCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.equipmentChangeFee'),
        value: dynamicEquipmentCost,
        rate:
          format(multiply(divide(bignumber(dynamicEquipmentCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.fixedEquipmentManufacturingCost'),
        value: fixedEquipmentCost,
        rate:
          format(multiply(divide(bignumber(fixedEquipmentCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.administrativeExpenses'),
        value: managementCost,
        rate:
          format(multiply(divide(bignumber(managementCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('common.costPrice'),
        value: singleCost,
        rate:
          format(multiply(divide(bignumber(singleCost || 0), bignumber(singleCost || 1)), bignumber(100)), {
            notation: 'fixed',
            precision: 2,
          }) + '%',
      },
      {
        name: t('dict.QuotationColumn.managementRate'),
        value: '9.32%',
        rate: t('dict.Process.ProduceType.1'),
      },
    ];
    PriceListRef.value.reloadData(list);
  }

  function initRate() {
    const list = [
      {
        name: t('common.materialCost'),
        value: null,
        rate: null,
      },
      {
        name: t('common.directLaborCost'),
        value: null,
        rate: null,
      },
      {
        name: t('common.indirectLaborCosts'),
        value: null,
        rate: null,
      },
      {
        name: t('common.MoldCampFixtureFee'),
        value: null,
        rate: null,
      },
      {
        name: t('common.outsourcingProcessingFee'),
        value: null,
        rate: null,
      },
      {
        name: t('common.equipmentChangeFee'),
        value: null,
        rate: null,
      },
      {
        name: t('common.fixedEquipmentManufacturingCost'),
        value: null,
        rate: null,
      },
      {
        name: t('common.administrativeExpenses'),
        value: null,
        rate: null,
      },
      {
        name: t('common.costPrice'),
        value: null,
        rate: null,
      },
      {
        name: t('dict.QuotationColumn.managementRate'),
        value: '9.32%',
        rate: t('dict.Process.ProduceType.1'),
      },
    ];
    PriceListRef.value.reloadData(list);
  }

  async function handleProcessData(list) {
    list = Array.isArray(list) ? list : [];
    const LaborRate = await baseStore.getDictionaryData('LaborRateTypeEnum', true);
    const data = list.map(item => ({
      ...item,
      productionTypeName: item.productionTypeDesc,
      processCodeName: item.processCode && item.processName ? `${item.processCode}(${item.processName})` : '',
      periodOfDepreciationName: LaborRate.find(value => value.enCode == item.periodOfDepreciation)?.fullName,
      yield: format(multiply(bignumber(item.yield || 0), bignumber(100)), { notation: 'fixed', precision: 2 }),
      fpy: format(multiply(bignumber(item.fpy || 0), bignumber(100)), { notation: 'fixed', precision: 2 }),
      utilizationRateName: format(multiply(bignumber(item.utilizationRate || 0), bignumber(100)), {
        notation: 'fixed',
        precision: 2,
      }),
    }));
    quotaStore.setFirstProcessFpy(data?.[0]?.fpy);
    const sumYield = updateYieldSum(data);
    ProcessRef.value.reloadData(data);
    await nextTick();
    const { grid: processGrid } = ProcessRef.value.processGridApi;
    const { footerData } = processGrid.getTableData();
    footerData[0].yield = sumYield;
    ProcessRef.value.calculateSum(data);
  }

  function handleMaterialData(list, processList) {
    const singleProcessLosses =
      format(
        chain(bignumber(1))
          .subtract(bignumber(processList?.[0]?.fpy || 0))
          .multiply(100)
          .done(),
        { notation: 'fixed', precision: 2 },
      ) + '%';
    list = Array.isArray(list) ? list : [];
    const data = list.map(item => ({
      ...item,
      singleProcessLosses,
      hasPriceName: item.hasPrice ? t('dict.NewsStatusEnum.Have') : t('dict.NewsStatusEnum.Nothing'),
      // 材料利用率
      utilizationRate: isExist(item.utilizationRate) ? item.utilizationRate * 100 + '%' : '',
      // 偶现料号没有originInsideCode情况
      originInsideCode: item.originInsideCode || item.insideCode,
      materialDosage: isNaN(item.materialDosage) ? 0 : +item.materialDosage,
      singleUseQty: item.singleUseQty || calculateUseQty(item.singleWidth, item.singleStepDistance, item.singleModulus, item.materialDosage),
    }));
    MaterialRef.value.reloadData(data);
    MaterialRef.value.calculateSum(data);
  }

  async function handleMoldData(list) {
    const moldTypeList = await baseStore.getDictionaryData('MoldApply.MoldType');
    list = Array.isArray(list) ? list : [];
    const data = list.map(item => ({
      ...item,
      moldTypeName: moldTypeList.find(value => value.enCode == item.moldType)?.fullName,
      utilizationRate: item.utilizationRate * 100 + '%',
    }));
    MoldRef.value.reloadData(data);
    MoldRef.value.calculateSum(data);
  }

  function handleBomPackageData(list) {
    list = Array.isArray(list) ? list : [];
    const data = list.map(item => ({
      ...item,
      uuid: item.id,
      hasPriceName: item.hasPrice ? t('dict.NewsStatusEnum.Have') : t('dict.NewsStatusEnum.Nothing'),
    }));
    BomPackageRef.value.reloadData(data);
    BomPackageRef.value.calculateSum(data);
  }

  function handleSiliconeData(list) {
    list = Array.isArray(list) ? list : [];
    const data = list.map(item => ({
      ...item,
      uuid: item.id,
      defectRate: item.defectRate * 100,
      hasPriceName: item.hasPrice ? t('dict.NewsStatusEnum.Have') : t('dict.NewsStatusEnum.Nothing'),
    }));
    SiliconeRef.value.reloadData(data);
    SiliconeRef.value.calculateSum(data);
  }

  function handleParentPartData(data) {
    const { images = '[]' } = data;
    setValues({
      ...currentData.value,
      ...data,
      managementRate: data.managementRate * 100,
      isBonded: data.isBonded ? 1 : 0,
      insidePartNumber: data.code,
    });
    const parseImage = JSON.parse(images);
    if (isEmpty(parseImage) || isEmpty(parseImage[0])) {
      return (quotaImageList.value = []);
    }
    quotaImageList.value = JSON.parse(images);
  }

  function getQuotaFileName(data): string {
    return (data?.fileName || data?.name || '').trim();
  }

  function getQuotaFileUrl(data): string {
    const url = data?.url ?? data?.filePath ?? '';
    return url.replaceAll('\\', '/');
  }

  function getQuotaFileExtension(value: string): string {
    const clean = (value || '').split('?')[0].split('#')[0];
    const dotIndex = clean.lastIndexOf('.');
    if (dotIndex <= 0) return '';
    return clean.slice(dotIndex).toLowerCase();
  }

  function isImageQuotaFile(data): boolean {
    const fileName = getQuotaFileName(data);
    const fileUrl = getQuotaFileUrl(data);
    const target = fileName || fileUrl;
    return IMAGE_EXTENSIONS.has(getQuotaFileExtension(target));
  }

  function normalizeQuotaImageValue(value: any) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    return list
      .map(item => {
        if (!item) return null;
        if (typeof item === 'string') {
          const fileName = item.substring(item.lastIndexOf('/') + 1);
          return {
            url: item,
            filePath: item,
            name: fileName,
            fileName,
          };
        }
        if (typeof item === 'object') {
          const filePath = item.url || item.filePath || '';
          const fileName = item.name || item.fileName || (filePath ? filePath.substring(filePath.lastIndexOf('/') + 1) : '');
          return {
            ...item,
            url: item.url ?? filePath,
            filePath: item.filePath ?? filePath,
            name: item.name ?? fileName,
            fileName: item.fileName ?? fileName,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  function getQuotaFileUrlV2(data): string {
    let filePath = getQuotaFileUrl(data).replace(globSetting.downloadUrl, '');
    const fileName = getQuotaFileName(data);
    if (!filePath.includes('.')) {
      filePath = `${filePath}/${fileName}`;
    }
    return `${globSetting.downloadUrl}?filePath=${filePath}&fullfilename=${fileName}&fileName=${fileName}`;
  }

  function buildQuotaPreviewUrl(fileUrl: string): string {
    return `${globSetting.filePreviewServer}/onlinePreview?url=${encodeURI(encryptByBase64(processUrl(fileUrl)))}&token=${getToken()}`;
  }

  function beforeInstallUpload(file: File, fileList: File[]): boolean {
    const lastFile = fileList[fileList.length - 1];
    const shouldSkip = !lastFile || !fileList.length || file.name !== lastFile.name;
    if (!shouldSkip) {
      uploadState.activeUploads = 0;
      uploadState.allFiles = fileList;
      loading.value = true;

      const totalFiles = uploadState.allFiles.length;
      let completedUploads = 0;

      const handleUploadComplete = () => {
        completedUploads += 1;
        if (completedUploads === totalFiles) {
          nextTick(() => {
            loading.value = false;
          });
        }
      };

      for (const item of uploadState.allFiles) {
        requestIdleCallbackAdapter(() => {
          const formData = new FormData();
          formData.append('fileList', item);

          uploadFiles(formData)
            .then(({ code, msg, data }) => {
              if (code === 200 && data?.[0]) {
                const fileInfo = data[0];
                quotaImageList.value.push({
                  fileName: fileInfo.originFileName,
                  filePath: fileInfo.fullPath,
                  name: fileInfo.originFileName,
                  url: fileInfo.fullPath,
                  creatorUserName: getUserInfo.value.userName,
                  creatorTime: dateUtil().valueOf(),
                });
                uploadState.activeUploads += 1;
              } else if (msg) {
                createMessage.error(msg);
              }
            })
            .catch(error => {
              createMessage.error(String(error));
            })
            .finally(handleUploadComplete);
        });
      }
      // 单一出口，避免 invariant return
      return false;
    }
  }

  function handleQuotaPreview(item) {
    const fileName = item?.fileName || item?.name;
    const filePath = item?.filePath || item?.url;
    if (!filePath) {
      return;
    }
    filePreviewRef.value?.init({
      name: fileName,
      url: filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    });
  }

  function handleQuotaOpen(item) {
    const fileUrl = getQuotaFileUrl(item);
    if (!fileUrl) {
      return;
    }
    const isV2 = item?.version == 2 || isNewFile(fileUrl);
    const previewUrl = buildQuotaPreviewUrl(isV2 ? getQuotaFileUrlV2(item) : fileUrl);
    window.open(previewUrl, '_blank');
  }

  function handleQuotaDownload(item) {
    const fileName = item?.fileName || item?.name;
    const filePath = item?.filePath || item?.url;
    if (!filePath) {
      return;
    }
    downloadFile({ url: filePath, target: '_blank', fileName });
  }

  function handleQuotaDelete(target: any) {
    const directIndex = typeof target === 'number' ? target : target?.sourceIndex;
    if (!isNullOrUnDef(directIndex)) {
      if (directIndex >= 0) {
        quotaImageList.value.splice(directIndex, 1);
      }
      return;
    }
    const filePath = target?.filePath || target?.url || '';
    const fileName = target?.fileName || target?.name || '';
    const index = quotaImageList.value.findIndex(item => (item?.filePath || item?.url || '') === filePath && (item?.fileName || item?.name || '') === fileName);
    if (index >= 0) {
      quotaImageList.value.splice(index, 1);
    }
  }

  function handleHalfFinishedData(list: Array<any>) {
    if (!HalfFinishedRef.value || !Array.isArray(list)) {
      return false;
    }
    list.forEach(item => {
      item.drawingFile = Array.isArray(item.drawingFileList) ? item.drawingFileList : [];
    });
    HalfFinishedRef.value?.reloadData(list);
    HalfFinishedRef.value?.calculateSum(list);
  }

  async function resetData() {
    ProcessRef.value?.initData?.();
    initRate();
    await nextTick();
    changeLoading(false);
  }

  async function initWagerate(currentValue) {
    const factory = currentValue.factory || '';
    let currentWageRate = wageRateCache.get(factory);
    if (!currentWageRate) {
      const { data: wageRateList } = await getBaseDataWagerateList({ factory });
      currentWageRate = wageRateList?.[0] || {};
      wageRateCache.set(factory, currentWageRate);
    }
    setValues({
      wageRateId: currentWageRate?.id,
      wageRateName: currentWageRate?.baseName,
      isBonded: 0,
    });
    wageRate.value = currentWageRate;
  }

  function handleHistory() {
    openQuotaModal(true, {
      menuDocType: 'Quotation',
    });
  }

  async function handleQuotaModal(row) {
    if (!row) return createMessage.warning(t('common.selectText'));
    changeLoading(true);
    return postConvertHistoryData({ docId: row.docId, inputDocType: row.docType, outputDocType: 2 })
      .then(res => {
        const {
          processList = [],
          materialList = [],
          moldList = [],
          packingMaterialList = [],
          parentPartInfo = {},
          siliconePartList = [],
          halfFinishedPartsList = [],
        } = res.data;
        handleRate(parentPartInfo);
        handleProcessData(processList || []);

        materialList.forEach(item => {
          item.insideCode = item?.originInsideCode || '';
          item.materialDosage = item?.materialDosage || 1;
        });
        handleMaterialData(materialList || [], processList || []);

        handleMoldData(moldList || []);
        handleBomPackageData(packingMaterialList || []);
        handleSiliconeData(siliconePartList || []);

        setValues({
          ...pick(parentPartInfo, ['productSpec', 'moq', 'remark', 'images']),
        });
        const parseImage = JSON.parse(parentPartInfo?.images || '[]');
        if (isEmpty(parseImage) || isEmpty(parseImage[0])) {
          quotaImageList.value = [];
        } else {
          quotaImageList.value = parseImage;
        }
        handleHalfFinishedData(halfFinishedPartsList || []);
      })
      .finally(() => changeLoading(false));
  }

  function handleSyncPrice() {
    if (!currentData.value?.id) {
      return false;
    }

    loading.value = true;
    changeLoading(true);
    updatePrice([currentData.value.id]).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        buildBomData(currentData.value);
        buildTreeData(currentData.value.bomId);
        loading.value = false;
      } else {
        createMessage.error(msg);
      }
    });
  }

  async function handleSaveAction(type) {
    changeLoading(true);
    const form = await getValues();

    const processList = ProcessRef.value.getDataSource().map(item => ({
      ...item,
      yield: item.yield / 100,
    }));

    const materialList = MaterialRef.value.getDataSource().map(item => ({
      ...item,
      singleProcessLosses: parseFloat(item.singleProcessLosses) / 100,
      singleUseQty: isNaN(item.singleUseQty) || item.singleUseQty == 'NaN' ? null : item.singleUseQty,
      utilizationRate: null,
    }));

    const moldList = MoldRef.value.getDataSource().map(item => ({
      ...item,
    }));

    const bomPackageList = BomPackageRef.value.getDataSource().map(item => ({
      ...item,
      hasPrice: typeof item.hasPrice === 'boolean' ? item.hasPrice : Boolean(item.hasPrice),
    }));

    const siliconeList = SiliconeRef.value.getDataSource().map(item => ({
      ...item,
      defectRate: item.defectRate / 100,
    }));

    const halfFinishedPartList: Array<any> = [];
    try {
      HalfFinishedRef.value && halfFinishedPartList.push(...HalfFinishedRef.value.getDataSource().map(item => ({ ...item })));
    } catch {
      return changeLoading(false);
    }

    if (moldList.length === 1 && !moldList[0]['moldType']) {
      moldList.shift();
    }
    if (bomPackageList.length === 1 && !bomPackageList[0]['insideCode']) {
      bomPackageList.shift();
    }

    const PDP = currentData.value.members.find(item => item.configType === 'PDPerson');
    form.wageRateId = wageRate.value?.id;
    const params = {
      ...currentData.value,
      ...form,
      wageRateId: wageRate.value?.id,
      quotationEngineerId: PDP?.memberId,
      quotationEngineerName: PDP?.memberName,
      parentPartInfo: {
        ...form,
        wageRateId: wageRate.value?.id,
        managementRate: '0.0932',
        images: quotaImageList.value.map(item => ({ filePath: item.url || item.filePath, fileName: item.name || item.fileName })),
      },
      processList: processList,
      materialList: materialList,
      moldList: moldList,
      packingMaterialList: bomPackageList,
      siliconePartList: siliconeList,
      halfFinishedPartList: halfFinishedPartList,
    };
    delete params.purpose;

    if (type == 'commit') {
      params.saveAndCommit = true;
    } else {
      params.saveAndCommit = false;
    }
    if (params.saveAndCommit) {
      if (!validateParams(params)) return;
    }

    if (cacheList.value.length) {
      const updated = cacheList.value.slice();
      updated[index.value] = { ...(updated[index.value] || {}), productSpec: form.productSpec };
      cacheList.value = updated;
    }

    try {
      if (!currentData.value.bomId) {
        const { code, data: id } = await addQuotationFinishedParts(params);
        if (code !== 200) return;
        const {
          code: detailCode,
          data: { bomId },
        } = await getQuotationDetail({ id });
        if (detailCode !== 200) return;
        buildTreeData(bomId);
        buildBomData({ bomId });
        currentData.value.bomId = bomId;
        finishedProductId.value = id;
        const updated = cacheList.value.slice();
        updated[index.value] = { ...(updated[index.value] || {}), id };
        cacheList.value = updated;

        createMessage.success(t('component.batchImport.saveSuccess'));
        if (params.saveAndCommit) {
          emit('reload');
          closePopup();
        }
      } else {
        if (!halfSign.value) {
          const { code } = await updateQuotationFinishedParts(params);
          if (code == 200) {
            changeLoading(false);
            createMessage.success(t('component.batchImport.saveSuccess'));
            buildTreeData(currentData.value.bomId);
            buildBomData({ bomId: currentData.value?.bomId });
            emit('reload');
            if (type === 'commit' || params.saveAndCommit) {
              closePopup();
            }
          }
          return;
        }

        if (halfSign.value === 'edit') {
          params.parentPartInfo.id = halfFinishedPartId.value;
          const { code } = await updateQuotationHalfFinishedParts({
            ...pick(params, [
              'saveAndCommit',
              'parentPartInfo',
              'processList',
              'materialList',
              'moldList',
              'packingMaterialList',
              'siliconePartList',
              'halfFinishedPartList',
            ]),
            quotationId: finishedProductId.value,
            bomId: halfFinishedPartBomId.value,
            id: halfFinishedPartBomId.value,
            productSpec: params?.parentPartInfo?.productSpec || '',
            remark: params?.parentPartInfo?.remark || '',
            moq: params?.parentPartInfo?.moq || '',
            images: params?.parentPartInfo?.images || '',
          });
          if (code == 200) {
            changeLoading(false);
            createMessage.success(t('component.batchImport.saveSuccess'));
            buildTreeData(currentData.value.bomId);
            buildBomData({ bomId: halfFinishedPartBomId.value });
            emit('reload');
            if (type === 'commit' || params.saveAndCommit) {
              closePopup();
            }
          }
          return;
        }

        if (type === 'commit') {
          closePopup();
        }
      }
    } catch (e) {
      changeLoading(false);
    }
  }

  function updateYieldSum(list = []) {
    return (list[0]?.fpy || 0) + '%';
  }

  function validateParams(params) {
    const { productSpec, processList, materialList, moldList, packingMaterialList, siliconePartList, halfFinishedPartList } = params;
    try {
      if (!productSpec) {
        throw new Error(t('dict.QuotationColumn.selectProductSpec'));
      }
      if (+processList?.[0]?.fpy === 0) {
        throw new Error(t('dict.Quotation.checkProcessYield'));
      }
      processList.forEach((item, index) => {
        if (!item.productionType) {
          throw new Error(t('dict.QuotationColumn.selectProcessStepProductionType', [index + 1]));
        } else if (!item.processCode) {
          throw new Error(t('dict.QuotationColumn.selectProcessStep', [index + 1]));
        } else if (!item.capacity) {
          throw new Error(t('dict.QuotationColumn.selectProcessStepCapacity', [index + 1]));
        }
      });

      materialList.forEach((item, index) => {
        if (!item.insideCode && !item.materialTypeFromManufacturer) {
          throw new Error(t('dict.QuotationColumn.materialInputError', [index + 1]));
        } else if (!item.singleWidth) {
          throw new Error(t('dict.QuotationColumn.selectSingMaterialWidth', [index + 1]));
        } else if (isNullOrUnDef(item.singleStepDistance)) {
          throw new Error(t('dict.QuotationColumn.selectMaterialPitch', [index + 1]));
        } else if (isNullOrUnDef(item.singleModulus)) {
          throw new Error(t('dict.QuotationColumn.selectMaterialModulus', [index + 1]));
        } else if (isBoolean(item.hasPrice) && !item.hasPrice && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectMaterialPurchaser', [index + 1]));
        } else if (!item.materialTypeFromManufacturer && !item.wholeWidth) {
          throw new Error(t('dict.QuotationColumn.selectMaterialWidth', [index + 1]));
        } else if (!item.materialTypeFromManufacturer && +item.singleWidth > +item.wholeWidth) {
          throw new Error(t('dict.Quotation.singleWidthGtTip', [index + 1]));
        } else if (!item.materialTypeFromManufacturer && !item.wholeLength) {
          throw new Error(t('dict.QuotationColumn.selectMaterialLength', [index + 1]));
        } else if (isNaN(item.singleUseQty) || +item.singleUseQty === 0) {
          throw new Error(t('dict.Quotation.singleUseQtyCheckTip', [index + 1]));
        } else if (isNaN(item.materialDosage) || +item.materialDosage <= 0) {
          throw new Error(t('dict.Quotation.materialDosageCheckTip', [index + 1]));
        }
      });
      moldList.forEach((item, index) => {
        if (!item.moldType) {
          return;
        }
        if (!item.moldLifespan) {
          throw new Error(t('dict.QuotationColumn.selectMoldLifespan', [index + 1]));
        } else if (!item.price) {
          throw new Error(t('dict.QuotationColumn.selectMoldPrice', [index + 1]));
        }
      });

      packingMaterialList.forEach((item, index) => {
        if (!item.insideCode) {
          return;
        }
        if (!item.packQty) {
          throw new Error(t('dict.QuotationColumn.selectPackagingMaterialQuantity', [index + 1]));
        } else if (isBoolean(item.hasPrice) && !item.hasPrice && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectPackagingMaterialPurchaser', [index + 1]));
        }
      });
      siliconePartList.forEach((item, index) => {
        if (!item.insideCode) {
          return;
        }
        if (!item.useQty) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartUsageQuantity', [index + 1]));
        } else if (isNullOrUnDef(item.defectRate)) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartDefectRate', [index + 1]));
        } else if (item.hasPrice && item.hasPrice == 'false' && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectSiliconePartPurchaser', [index + 1]));
        }
      });
      halfFinishedPartList.forEach((item, index) => {
        if (!item.halfFinishedPart) {
          throw new Error(t('dict.QuotationColumn.selectHalfFinishedPart', [index + 1]));
        } else if (item.materialDosage !== 0 && !item.materialDosage) {
          throw new Error(t('dict.QuotationColumn.selectHalfFinishedMaterialDosage', [index + 1]));
        } else if (item.productionType !== PRODUCTION_TYPE_ENUM.自制 && !item.purchaserId) {
          throw new Error(t('dict.QuotationColumn.selectHalfFinishedPurchaserId', [index + 1]));
        } else if (item.productionType !== PRODUCTION_TYPE_ENUM.自制 && (!Array.isArray(item.drawingFile) || item.drawingFile.length === 0)) {
          throw new Error(t('dict.QuotationColumn.selectHalfFinishedDrawingFile', [index + 1]));
        }
      });
    } catch (e: any) {
      createMessage.warning(e.message);
      changeLoading(false);
      return false;
    }
    return true;
  }

  function changeLoading(patchLoading) {
    changePopupLoading(patchLoading);
    loading.value = patchLoading;
  }

  function handleDrawView() {
    openDrawViewModal(true, {
      id: currentData.value.desensitizedDrawingsId,
    });
  }

  const handleReject = async () => {
    openRejectModal(true, {
      api: rejectQuotation,
      ids: [currentData.value.id],
    });
  };
</script>
<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="false"
    :cancelButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup pb-10px">
    <template #title>
      <a-space>
        <p>{{ t('dict.QuotationRequirements.FlowNode.Quotation') }}</p>
      </a-space>
    </template>
    <template #insertToolbar>
      <a-button v-auth="'btn_edit'" @click="handleDrawView">{{ t('dict.PartNumberApplyDrawingsType.DesensitizedDrawings') }} </a-button>
      <a-button class="ml-12px" @click="handleHistory" v-if="mode == 'edit'">{{ t('common.quotaHistory') }} </a-button>
      <a-button v-auth="'btn_edit'" v-if="showSyncPrice" class="ml-12px" :loading="loading" @click="handleSyncPrice"
        >{{ t('dict.QuotationFlowNode.SyncPrice') }}
      </a-button>
      <a-divider type="vertical" class="mx-12px"></a-divider>
    </template>
    <template #centerToolbar>
      <a-button v-auth="'btn_edit'" :loading="loading" v-if="mode == 'edit'" @click="handleSaveAction('save')" type="primary" ghost>{{
        t('common.temporarySave')
      }}</a-button>
      <a-button v-auth="'btn_reject'" v-if="mode == 'edit'" @click="handleReject" class="mx-12px" type="primary" ghost>{{ t('common.rejectText') }} </a-button>

      <a-button @click="handleSaveAction('commit')" v-if="mode == 'edit'" :loading="loading" type="primary">{{
        isReview ? t('common.agree') : t('common.submitText')
      }}</a-button>
      <a-button
        v-auth="'btn_edit'"
        :loading="loading"
        v-if="isCommit && currentData.currentNode === 'Leader'"
        @click="handleSaveAction('commit')"
        type="primary"
        >{{ t('common.submitText') }}
      </a-button>
    </template>
    <div ref="container" class="container-box">
      <div ref="bomContent" class="bom-content">
        <div class="drag-box">
          <div ref="divider" class="drag-ctrl"></div>
        </div>
        <div class="flex flex-col">
          <div class="w-full h-44px title flex flex-row-reverse justify-between">
            <div class="cursor-pointer" @click="() => (isPack = handleUnpack(bomContent, mainContent, isPack))">
              <i :class="['icon-ym icon-ym-nav-prev icon-color', isPack ? '' : 'rotate-90']" />
            </div>
            <Subtitle :title="t('common.Bom')" :class="[isPack ? 'opacity-100' : 'opacity-0', 'duration-300 ease-out pb-0']" />
          </div>

          <a-spin class="h-full w-full px-10px" :spinning="loadingBom">
            <div class="bom-list">
              <BasicTree
                :treeData="treeData"
                :virtual="true"
                :height="treeHeight"
                :itemHeight="24"
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
      </div>
      <div ref="mainContent" class="main-content">
        <NavBar @scroll-event="handleScroll" />
        <ScrollContainer ref="mainScroll" class="mt-40px getScrollValue">
          <a-card class="lydc-content-wrapper-search-box">
            <a-row :gutter="20">
              <a-col :span="12">
                <Subtitle :title="t('common.baseinfo')" id="base-info" />
                <BaseForm />
                <Subtitle :title="t('common.quotaImg')" id="quota-info" class="mt-16px">
                  <template #afterTitle>
                    <a-upload v-if="mode == 'edit'" :multiple="true" :before-upload="beforeInstallUpload" :showUploadList="false">
                      <a-button type="primary" ghost>{{ t('common.upFiles') }} </a-button>
                    </a-upload>
                  </template>
                </Subtitle>
              </a-col>
              <a-col :span="12">
                <PriceList ref="PriceListRef" />
              </a-col>
            </a-row>
            <a-row :gutter="10" class="mt-5px">
              <a-col :span="8">
                <div class="file-upload-wrapper-box">
                  <div class="file-upload-wrapper">
                    <b class="mr-10px mt-5px">{{ t('common.attachment') }}:</b>
                    <template v-for="(item, index) in quotaFileList" :key="item.filePath || item.fileName || index">
                      <div class="item-list mr-3px w-full">
                        <a @dblclick.stop="handleQuotaPreview(item)" class="item-file-name ellipsis w-2/3">
                          {{ item.fileName }}
                        </a>
                        <div>
                          <a-button type="link" @click="handleQuotaOpen(item)">
                            <template #icon>
                              <i class="icon-ym icon-ym-generator-link"></i>
                            </template>
                          </a-button>
                          <a-button type="link" @click="handleQuotaDownload(item)">
                            <template #icon>
                              <i class="icon-ym icon-ym-btn-download"></i>
                            </template>
                          </a-button>
                          <a-button v-if="mode !== 'view'" type="link" @click="handleQuotaDelete(item)">
                            <template #icon>
                              <i class="icon-ym icon-ym-delete"></i>
                            </template>
                          </a-button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </a-col>
              <a-col :span="16">
                <!-- :maxNumber="3" -->
                <ImageUpload
                  :disabled="mode == 'view'"
                  :maxNumber="null"
                  version="2"
                  v-model:value="imageList"
                  updateType="all"
                  :api="null"
                  :draggablePreview="true"
                  class="min-h-115px mb-0" />
              </a-col>
            </a-row>
          </a-card>
          <Process ref="ProcessRef" :wageRate="wageRate" />
          <HalfFinished ref="HalfFinishedRef" :currentData="currentData" />
          <Material ref="MaterialRef" :currentData="currentData" :formValues="formValues" />
          <Mold ref="MoldRef" />
          <BomPackage ref="BomPackageRef" :current-data="currentData" :form-values="formValues" />
          <Silicone ref="SiliconeRef" :current-data="currentData" :form-values="formValues" />
        </ScrollContainer>
      </div>
    </div>
    <History @register="registerQuotaModal" @submit="handleQuotaModal" />
    <DrawViewModal @register="registerDrawViewModal" />
    <PreviewModal ref="filePreviewRef" />
    <RejectModal @register="registerRejectModal" />
    <KeepScroll />
  </BasicPopup>
</template>

<style scoped lang="less" src="./style.less" />
