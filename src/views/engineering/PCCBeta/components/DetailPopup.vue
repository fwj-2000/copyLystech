<script setup lang="ts">
  import { BasicPopup, usePopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { computed, nextTick, reactive, ref, toRaw, toRefs, unref } from 'vue';
  import { isEmpty } from 'xe-utils';
  import { getBomStructure, getECNByPartNumber, getPccRevisionHistory, postConvertHistoryData, rejectPcc } from '/@/api/engineering/pcc';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import DetailContainer from './DetailContainer.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import { RejectModal } from '/@/components/CustomComponents';
  import ECNModal from '/@/views/engineering/pcc/pccApply/components/ECNModal.vue';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import DrawViewModal from '/@/views/engineering/pcc/pccApply/components/DrawViewModal.vue';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { postHistoryRecord } from '/@/api/engineering/quotatios';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { set } from 'lodash-es';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const userStore = useUserStore();
  const baseStore = useBaseStore();

  const [registerPopup, { closePopup: closeDetailPopup, changeLoading: changePopuploading }] = usePopupInner(init);
  const [registerECNModal, { openModal: ecnOpenModal, closeModal: ecnCloseModal }] = useModal();

  const [registerUpgradeModal, { openModal: openUpgradeModal, closeModal: closeUpgradeModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();

  const { createMessage } = useMessage();

  const { hasBtnP } = usePermission();

  const btnLoading = ref(false);

  interface State {
    isPack: boolean;
    treeData: any[];
    cacheList: any[];
    index: number;
    customerFileList: any[];
    installImageList: any[];
    mode: ModeTypeEnum;
    bomType: 1 | 2 | 3 | 4;
    showSubmit: boolean;
    showReview: boolean;
    showReject: boolean;
    shouldInit: boolean;
  }

  const showBtn = computed(() => {
    return {
      history: isEditMode && hasBtnP('btn_edit'),
      calc: isEditMode && hasBtnP('btn_edit'),
      temp: isEditMode && hasBtnP('btn_edit'),
      saveSubmit: !!state.showSubmit && !state.showReview && hasBtnP('btn_edit'),
      reject:
        !!state.showReject && (currentData?.value.currentNode == 'PCCLeaderReview' || currentData?.value.currentNode == 'LeaderReview') && hasBtnP('btn_edit'),
      agree:
        !!state.showReview && (currentData.value?.currentNode == 'PCCLeaderReview' || currentData.value?.currentNode == 'LeaderReview') && hasBtnP('btn_edit'),
      drawView: isEditMode && hasBtnP('btn_edit'),
    };
  });

  const isEditMode = computed(() => {
    return state.mode === ModeTypeEnum.EDIT || state.mode === ModeTypeEnum.AUDIT_EDIT;
  });

  const state = reactive<State>({
    isPack: false,
    treeData: [],
    cacheList: [],
    index: 0,
    mode: ModeTypeEnum.VIEW,
    bomType: 1,
    loadingBom: false,
    showSubmit: false,
    showReview: false,
    showReject: false,
  });

  interface VersionState {
    creatorTime: string;
    revisionRemark: string;
  }

  const versionState = reactive<VersionState>({
    creatorTime: '',
    revisionRemark: '',
  });

  const { treeData, cacheList, index, mode, showSubmit, showReview, showReject } = toRefs(state);
  const formWrapperRef = ref(null);
  const detailContainerRef = ref(null);

  const currentData = computed(() => {
    return state.cacheList[state.index];
  });

  async function init(data) {
    console.log(data, 'datadatadatadatadatadatadatadata');
    // 初始化按钮显示
    initButtons(data);
    // 设置当前处理列表值
    const { cacheList, index } = data;
    state.cacheList = cacheList;
    state.index = index;
    // 加载数据
    detailContainerRef.value?.init(data);
  }
  function initButtons(data) {
    console.log('🚀 ~ initButtons ~ data: ', data);
    state.mode = data.mode;
    state.doNotTemplate = data.doNotTemplate;
    state.showDialog = data.showDialog;
    state.showSubmit = data.showSubmit;
    state.showReject = data.showReject;
    state.showReview = data.showReview;
    state.shouldInit = data.shouldInit;
  }

  async function handleSubmit(type: 'save' | 'commit' | 'calc' | 'agree', close) {
    detailContainerRef.value?.handleSubmit(type, close);
  }

  // 脱敏图纸处理
  function handleDrawView(row) {
    const { cacheList, index } = state;
    const detailVal = detailContainerRef.value.getCurrentValue();
    openDrawViewModal(true, {
      id: cacheList[index].desensitizedDrawingsId || detailVal.desensitizedDrawingsId,
    });
  }

  // 打开历史记录
  function handleHistory() {
    openUpgradeModal(true, {
      menuDocType: 'PCC',
    });
  }

  async function handleUpgradeSubmit(row) {
    if (!row) return createMessage.warning(t('common.selectText'));
    changeLoading(true);
    // const currentValue = currentData.value;
    // const currentValue = detailContainerRef.value.getCurrentValue();
    // const params = ;
    // if (currentValue.bomId) {
    //   params.id = currentValue.id;
    //   params.drawingsReviewId = currentValue.drawingsReviewId;
    // } else {
    //   params.drawingsReviewId = currentValue.id;
    // }
    let code, data, ret;
    const { demandType } = currentData.value;
    const isSampleType = ['BusinessSamples', 'EngineeringSamples'].includes(demandType);
    const params = {
      inputDocType: row.docType,
      outputDocType: 1,
      docId: row.docId,
    };
    if (isSampleType) {
      params.bomType = 4;
    }
    try {
      ret = await postConvertHistoryData(params);
    } catch (e) {
      console.error(e);
      changeLoading(false);
    }
    code = ret.code;
    data = ret.data;
    if (code != 200) return;
    state['cacheList'][state.index] = {
      ...state['cacheList'][state.index],
      ...data,
    };
    set(data, 'parentPartInfo.isQuoteRecord', `${row.insidePartNumber}.${row.version}`);
    console.log('🚀 ~ handleUpgradeSubmit ~ data: ', data);
    detailContainerRef.value?.handleBomData(data, {}, 'history');
    // detailContainerRef.value?.getTreeData({ id: data.bomId });
  }

  function handleCalculate() {
    handleSubmit('calc');
  }

  function closePopup() {
    const { index, cacheList } = state;
    // if(state)

    if (cacheList.length - 1 === index) {
      closeDetailPopup();
    } else {
      changeCurrent('next');
    }
  }

  function handleReject() {
    openRejectModal(true, {
      api: rejectPcc,
      ids: [currentData.value.id],
    });
  }

  async function handlePrint() {
    detailContainerRef.value.handlePrint();
  }

  function changeCurrent(type: 'pre' | 'next') {
    detailContainerRef.value?.changeType(1);
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      changeLoading(true);
      state.index = index - 1;
      detailContainerRef.value?.changeBomId(cacheList[index - 1].bomId);
      detailContainerRef.value?.init({
        ...state,
        index: index - 1,
      });
      // initData({ id: cacheList[index - 1].bomId });
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      changeLoading(true);
      detailContainerRef.value?.changeBomId(cacheList[index + 1].bomId);
      state.index = index + 1;
      detailContainerRef.value?.init({
        ...state,
        index: index + 1,
      });
      // initData({ id: cacheList[index + 1].bomId });
    }
  }

  function changeLoading(loading) {
    changePopuploading(loading);
    btnLoading.value = loading;
  }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.temporarySave')"
    :showCancelBtn="false"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup pb-10px">
    <template #title>
      <a-space>
        <p>PCC</p>
      </a-space>
    </template>
    <template #insertToolbar>
      <div>
        <a-button v-if="showBtn.drawView" @click="handleDrawView">{{ t('dict.MoldApplyColumn.drawingshistory') }} </a-button>
        <template v-if="currentData?.currentNode != 'LeaderReview'">
          <a-button class="ml-12px" v-if="showBtn.history" @click="handleHistory">{{ t('dict.PCCApplyColumn.referenceHistoryRecord') }} </a-button>
        </template>
      </div>

      <!--      <a-button :loading="btnLoading" class="ml-12px" v-if="showBtn.calc" @click="handleCalculate">{{ t('common.calText') }}</a-button>-->
      <a-divider type="vertical" class="mr-12px"></a-divider>
    </template>
    <template #centerToolbar>
      <div>
        <template v-if="currentData?.currentNode != 'LeaderReview'">
          <a-button :loading="btnLoading" v-if="hasBtnP('btn_print')" class="mx-12px" @click="handlePrint" type="primary">{{ t('common.printText') }}</a-button>
          <!--					<a-button v-auth="'btn_edit'" v-if="isEditMode" @click="handleAddTemplate">{{ t('dict.PCCApplyColumn.addAsTemplate') }} </a-button>-->
          <!--					<a-button v-auth="'btn_edit'" v-if="isEditMode" @click="handleTemplateList" type="primary" ghost-->
          <!--					>{{ t('dict.PCCApplyColumn.invokeTemplate') }}-->
          <!--					</a-button>-->
        </template>

        <a-button :loading="btnLoading" class="mx-12px" v-if="showBtn.temp" @click="handleSubmit('save')" type="primary" ghost
          >{{ t('common.temporarySave') }}
        </a-button>
        <a-button :loading="btnLoading" v-if="showBtn.saveSubmit" @click="handleSubmit('commit')" type="primary">{{ t('common.submit') }} </a-button>
        <a-button :loading="btnLoading" v-if="showBtn.reject" @click="handleReject" class="mr-12px" type="primary" ghost
          >{{ t('common.rejectText') }}
        </a-button>
        <a-button :loading="btnLoading" v-if="showBtn.agree" @click="handleSubmit('agree', true)" type="primary">{{ t('common.agree') }} </a-button>
      </div>
    </template>
    <template #appendToolbar>
      <div class="toggle-current">
        <a-button :disabled="btnLoading" preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
        <div class="state-box">
          <span>{{ index + 1 }}</span>
          / {{ cacheList.length }}
        </div>
        <a-button :disabled="btnLoading" preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
      </div>
    </template>
    <DetailContainer
      @changeLoading="changeLoading"
      @changeCurrent="changeCurrent"
      ref="detailContainerRef"
      @reload="() => emit('reload')"
      @close-popup="
        () => {
          emit('reload');
          closePopup();
        }
      "
      @ecnOpenModal="ecnOpenModal" />
    <Preview ref="filePreviewRef" />
    <!--    <SaveTemplateModal @register="registerSaveTemplateForm" />-->
    <!--    <TemplateList @register="registerTemplateList" @submit="handleTmpListSubmit" />-->
    <DrawViewModal @register="registerDrawViewModal" />
  </BasicPopup>
  <!--  <Template @register="registerTemplate" @submit="handleTemplateSubmit" />-->
  <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" @openAttachUpload="openAttachUpload(true, $event)" />
  <ECNModal
    @register="registerECNModal"
    @submit="changeCurrent"
    @close="
      () => {
        emit('reload');
        closePopup();
      }
    " />
  <RejectModal
    @register="registerRejectModal"
    @reload="
      () => {
        emit('reload');
        closePopup();
      }
    " />
</template>

<style scoped lang="less" src="./style.less" />

<style scoped lang="less">
  :deep(.toggle-current) {
    margin-left: 12px;
    margin-right: 12px;
  }
</style>
