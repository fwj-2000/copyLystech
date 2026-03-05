<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { computed, reactive, ref } from 'vue';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import DetailContainer from './DetailContainer.vue';
  import { useModal } from '/@/components/Modal';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import DrawViewModal from '/@/views/engineering/pcc/pccApply/components/DrawViewModal.vue';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { BasicPopPage } from '/@/components/Basic';
  import { FileListModal } from '/@/components/Upload';
  import { handleDrawParams } from '/@/components/Upload/src/utils';
  import { postConvertHistoryData } from '/@/api/engineering/pcc';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading: changePopuploading }] = usePopupInner(init);

  const [registerUpgradeModal, { openModal: openUpgradeModal }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();

  const { createMessage } = useMessage();

  const btnLoading = ref(false);

  interface State {
    isPack: boolean;
    treeData: any[];
    cacheList: any[];
    index: number;
    mode: ModeTypeEnum;
    bomType: 1 | 2 | 3 | 4; // 1: 成品
    loadingBom: boolean;
  }

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
  });

  const pageInfo = computed(() => {
    return {
      total: state?.cacheList?.length || 1,
      currentIndex: state.index + 1,
    };
  });

  const detailContainerRef = ref();
  async function init(data) {
    // 设置当前处理列表值
    const { cacheList, index, type } = data;
    state.cacheList = cacheList || [];
    state.index = index || 0;
    state.mode = type;
    // 加载数据
    detailContainerRef.value?.init(data);
  }

  async function handleSubmit(type: 'save' | 'commit' | 'calc', close?: boolean) {
    detailContainerRef.value?.handleSubmit(type, close);
  }

  // 脱敏图纸处理
  function handleDrawView() {
    const record = detailContainerRef.value.getCurrentValue();
    openFileList(
      true,
      handleDrawParams({
        insidePartNumber: record.innerMaterialNumber,
      }),
    );
  }

  // 打开历史记录
  function handleHistory() {
    openUpgradeModal(true, {
      menuDocType: 'EngineeringInformation',
    });
  }
  // 引用历史记录
  async function handleUpgradeSubmit(row) {
    if (!row) return createMessage.warning(t('common.selectText'));
    changeLoading(true);
    let ret;
    try {
      ret = await postConvertHistoryData({
        docId: row.docId,
        inputDocType: row.docType,
        outputDocType: 3, // 固定输出类型为量试订单
      });
      const { code, data } = ret;
      if (code != 200) return changeLoading(false);
      detailContainerRef.value?.handleHistoryData(data);
      changeLoading(false);
    } catch (e) {
      changeLoading(false);
    }
  }

  function handleCalculate() {
    handleSubmit('calc');
  }

  // 切换数据
  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    if (type === 'pre') {
      state.index = index - 1;
      detailContainerRef.value?.init({
        ...state,
        index: index - 1,
      });
      detailContainerRef.value?.changeBomId(cacheList[index - 1].bomId);
    } else {
      state.index = index + 1;
      detailContainerRef.value?.init({
        ...state,
        index: index + 1,
      });
      detailContainerRef.value?.changeBomId(cacheList[index - 1].bomId);
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
    class="full-popup">
    <template #title>
      <a-space>
        <p>{{ t('common.engineMake') }}</p>
        <a-button :loading="btnLoading" v-auth="'btn_edit'" @click="handleDrawView">{{ t('dict.MoldApplyColumn.drawingshistory') }} </a-button>
        <a-button :loading="btnLoading" v-auth="'btn_edit'" v-if="isEditMode" @click="handleHistory">
          {{ t('dict.PCCApplyColumn.referenceHistoryRecord') }}
        </a-button>
      </a-space>
    </template>
    <template #insertToolbar>
      <a-space :size="10">
        <a-button :loading="btnLoading" v-auth="'btn_edit'" v-if="isEditMode" @click="handleCalculate" type="primary" ghost
          >{{ t('common.calText') }}
        </a-button>
        <a-button :loading="btnLoading" v-auth="'btn_edit'" v-if="isEditMode" @click="handleSubmit('save')" type="primary" ghost
          >{{ t('common.temporarySave') }}
        </a-button>
        <a-button :loading="btnLoading" v-auth="'btn_edit'" v-if="isEditMode" @click="handleSubmit('commit')" type="primary"
          >{{ t('common.submit') }}
        </a-button>
      </a-space>
    </template>
    <template #appendToolbar>
      <BasicPopPage class="ml-10px" :config="pageInfo" @change="changeCurrent" />
    </template>
    <DetailContainer
      @changeLoading="changeLoading"
      ref="detailContainerRef"
      @close-popup="
        () => {
          emit('reload');
          closePopup();
        }
      " />
    <Preview ref="filePreviewRef" />
    <DrawViewModal @register="registerDrawViewModal" />
    <FileListModal @register="registerFileList"></FileListModal>
  </BasicPopup>
  <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" />
</template>
