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
    <template #centerToolbar>
      <a-space :size="10">
        <!--        <a-button v-if="mode === 'edit'" @click="handleReject" type="primary" ghost>驳回 </a-button>-->
        <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" :loading="loading" class="mr-12px" @click="handleSubmit('commit')" type="primary"
          >{{ t('common.submit') }}
        </a-button>
      </a-space>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
      <QuantitativeChange ref="QuantitativeChangeRef" />
      <MaterialDispose ref="materialDisposeRef" />
      <SignDept ref="SignDeptRef" />
    </ScrollContainer>
    <RejectModal
      @register="registerRejectModal"
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
  import QuantitativeChange from '/@/views/engineering/ecn/components/QuantitativeChange.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { addEcr, getCounterSign, getEcnDetail, getNodeDetail, rejectEcn } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { RejectModal } from '/@/components/CustomComponents';
  import SignDept from '/@/views/engineering/ecn/components/SignDept.vue';
  import MaterialDispose from '/@/views/engineering/ecn/components/MaterialDispose.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const ecnApplyRef = ref(null);
  const QuantitativeChangeRef = ref(null);
  const materialDisposeRef = ref(null);
  const SignDeptRef = ref(null);
  const mainScroll = ref(null);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    detailData: {},
  });

  const { mode } = toRefs(state);

  function init(data) {
    const { cacheList, index } = data;
    state.mode = data.mode;
    state.cacheList = cacheList;
    state.index = index;
    console.log(data, 'init signDept data');

    const currentData = cacheList[index];
    console.log(cacheList[index], 'currentData');
    if (currentData) {
      changeLoading(true);
      const nodeDetailPromise = getNodeDetail({ id: currentData.id });
      const ecnDetailPromise = getEcnDetail(currentData);
      Promise.all([nodeDetailPromise, ecnDetailPromise])
        .then(([nodeDetailRet, ecnDetailRet]) => {
          const { code: nodeCode, data: nodeData } = nodeDetailRet;
          const { code: ecnCode, data: ecnData } = ecnDetailRet;
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
            mode: 'view',
          });
          SignDeptRef.value.init({
            ...ecnData,
            ...data,
            origin: 'ECN',
            mode: mode,
          });
        })
        .finally(() => {
          changeLoading(false);
        });
    }
  }

  const handleReject = async () => {
    const { cacheList, index } = state;
    const idList = [cacheList[index].id];
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectEcn,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };

  const loading = ref<boolean>(false);
  function setLoading(isLoading = false) {
    changeLoading(isLoading);
    loading.value = isLoading;
  }

  function handleSubmit(type: 'save' | 'commit') {
    const { cacheList, index } = state;

    const ret = SignDeptRef.value.submit();

    if (ret.some(item => !item.reviewResult)) {
      // 必须得勾选同意或者不同意
      message.warn(t('dict.ECN.reviewResultRequiredTip'));
      return;
    }

    if (ret.some(item => +item.reviewResult === 2 && !item.reviewComments)) {
      // 不同意(+item.reviewResult === 2)时，必须输入不同意的理由
      message.warn(t('common.enterDisagreeText'));
      return;
    }

    setLoading(true);
    let func;

    const data = {
      list: ret,
    };
    if (type === 'commit') {
      data.saveAndCommit = true;
    }
    if (cacheList[index].id) {
      func = getCounterSign;
    } else {
      return;
      func = addEcr;
    }

    func({
      ...data,
      id: cacheList[index].id,
    })
      .then(({ code, msg, data }) => {
        if (code === 200) {
          emit('reload');
          closePopup();
          createMessage.success(msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
</style>
