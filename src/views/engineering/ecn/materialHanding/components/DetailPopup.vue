<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="t('common.reviewText')"
    destroyOnClose
    class="full-popup pb-10px">
    <template #centerToolbar v-if="cacheList[index]?.currentNode == 'PMC' || cacheList[index]?.currentNode == 'MaterialHandle'">
      <a-button v-if="mode === 'edit'" @click="handleSubmit('save')" :loading="loading" type="primary" ghost>{{ t('common.temporarySave') }} </a-button>
      <a-button v-if="mode === 'edit'" class="mx-12px" :loading="loading" @click="handleSubmit('commit')" type="primary">{{ t('common.submit') }} </a-button>
    </template>
    <template #appendToolbar>
      <div class="toggle-current">
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
        <div class="state-box">
          <span>{{ index + 1 }}</span>
          / {{ cacheList.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
      </div>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
      <QuantitativeChange ref="QuantitativeChangeRef" @getPartNumberList="getPartNumberList" :applyList="ecnApplyList" />
      <MaterialDispose ref="materialDisposeRef" />
    </ScrollContainer>
    <RejectModal
      @register="registerRejectModal"
      @reload="
        () => {
          emit('reload');
          closePopup();
        }
      " />
    <DisagreeModal
      @register="registerDisagreeModal"
      @reload="
        () => {
          emit('reload');
          closePopup();
        }
      " />
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { reactive, ref, toRefs } from 'vue';
  import EcnApply from '/@/views/engineering/ecn/components/EcnApply.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { getEcnDetail, getMaterialHandle, getMaterialHandleComments, getNodeDetail, rejectEcr, withdrawEcr } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { DisagreeModal, RejectModal } from '/@/components/CustomComponents';
  import { isFunction } from '/@/utils/is';
  import { message } from 'ant-design-vue';
  import QuantitativeChange from '/@/views/engineering/ecn/components/QuantitativeChange.vue';
  import MaterialDispose from '/@/views/engineering/ecn/components/MaterialDispose.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerDisagreeModal, { openModal: openDisAgreeModal }] = useModal();

  const ecnApplyRef = ref(null);
  const QuantitativeChangeRef = ref(null);
  const materialDisposeRef = ref(null);
  const mainScroll = ref(null);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    detailData: {},
    ecnApplyList: [],
  });

  const { mode, ecnApplyList, cacheList, index } = toRefs(state);

  function init(data) {
    changeLoading(true);
    const { cacheList, index } = data;
    state.cacheList = cacheList;
    state.index = index;
    state.mode = data.mode;
    const currentData = cacheList[index];
    if (currentData) {
      changeLoading(true);
      const nodeDetailPromise = getNodeDetail({ id: currentData.id });
      const ecnDetailPromise = getEcnDetail(currentData);
      Promise.all([nodeDetailPromise, ecnDetailPromise])
        .then(([nodeDetailRet, ecnDetailRet]) => {
          const { code: nodeCode, data: nodeData } = nodeDetailRet;
          const { code: ecnCode, data: ecnData } = ecnDetailRet;
          console.log(nodeData, 'nodeDatanodeData');
          console.log(ecnData, 'ecnDataecnData');
          cacheList[index].status = ecnData.status;
          ecnApplyRef.value.init({
            ...ecnData,
            ...data,
            origin: 'ECN',
            mode: 'view',
          });
          QuantitativeChangeRef.value.init({
            ...ecnData,
            ...nodeData,
            ...data,
            origin: 'ECN',
            mode: 'view',
          });
          materialDisposeRef.value.init({
            ...ecnData,
            ...nodeData,
            ...data,
            currentNode: cacheList[index].currentNode,
            origin: 'ECN',
            mode: data.mode,
          });
        })
        .finally(() => {
          changeLoading(false);
        });
      // ECN
    }
  }

  function getPartNumberList() {
    state.ecnApplyList = ecnApplyRef.value.getDataSource();
  }

  function handleReject() {
    // const {cacheList, index} = state
    const { id } = state.detailData;
    openRejectModal(true, {
      api: rejectEcr,
      ids: [id],
    });
  }

  async function handleRecall() {
    const idList = waitGetSelectRowKeys() || [];
    if (idList.length) {
      return withdrawEcr(idList);
    }
    message.info(t('common.selectText'));
  }

  const loading = ref<boolean>(false);
  function setLoading(isLoading = false) {
    changeLoading(isLoading);
    loading.value = isLoading;
  }

  function handleSubmit(type: 'save' | 'commit') {
    const { cacheList, index } = state;
    let func;
    const partNumberList = materialDisposeRef.value.submit();

    /**
     * 当前节点是`物料处理(MaterialHandle)`节点，并且是`提交`，则`partNumberList`中的`申请人处理意见(comments)`不可为空
     */
    if (cacheList[index].currentNode === 'MaterialHandle' && type === 'commit' && partNumberList.some(item => !item.comments)) {
      message.warning(t('dict.ECN.commentsTip'));
      return false;
    }

    const data = {
      id: cacheList[index].id,
      partNumberList,
    };

    if (cacheList[index].currentNode === 'MaterialHandle') {
      func = getMaterialHandleComments;
    } else {
      func = getMaterialHandle;
    }

    // const data = ecnApplyRef.value.submit();
    if (isFunction(data)) return setLoading(false);
    if (type === 'commit') {
      data.saveAndCommit = true;
    }
    setLoading(true);
    func(data)
      .then(({ code, msg }) => {
        if (code == 200) {
          emit('reload');
          createMessage.success(msg);
          setLoading(true);
          if (type == 'commit') {
            cacheList[index].currentNode = 'Countersign';
          }
          if (index !== state.cacheList.length - 1) {
            return changeCurrent('next');
          }
          if (type == 'commit') closePopup();
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      state.index = index - 1;
      init({
        cacheList: state.cacheList,
        index: state.index,
        mode: state.mode,
      });
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      state.index = index + 1;
      init({
        cacheList: state.cacheList,
        index: state.index,
        mode: state.mode,
      });
    }
  }
</script>
<style lang="less" scoped>
  .main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
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

  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 12px;
  }

  .state-box {
    margin: 0 10px;
  }

  //.scroll-container {
  //  padding-bottom: 60px;
  //}
</style>
