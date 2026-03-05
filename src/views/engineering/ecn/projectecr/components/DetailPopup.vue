<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :title="t('common.audit')"
    destroyOnClose
    class="full-popup pb-10px">
    <template #centerToolbar v-if="mode == 'edit'">
      <a-button v-auth="'btn_reject'" class="ml-12px" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }} </a-button>
      <a-button v-auth="'btn_disagree'" class="mx-12px" danger @click="handleDisagree">{{ t('common.disagree') }} </a-button>
      <a-button v-auth="'btn_agree'" class="mr-12px" type="primary" @click="handleSubmit">{{ t('common.agree') }} </a-button>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
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
  import EcnApply from './EcnApply.vue';
  import { agreeEcr, disagreeEcr, getEcrDetail, rejectEcr, withdrawEcr } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { DisagreeModal, RejectModal } from '/@/components/CustomComponents';
  import { isFunction } from '/@/utils/is';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerDisagreeModal, { openModal: openDisAgreeModal }] = useModal();

  const ecnApplyRef = ref(null);
  const mainScroll = ref(null);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    detailData: {},
  });

  const { mode, cacheList, index } = toRefs(state);

  function init(data) {
    changeLoading(true);
    const { cacheList, index } = data;
    state.cacheList = cacheList;
    state.index = index;
    state.mode = data.mode;

    if (cacheList[index]) {
      // 详情
      getEcrDetail(cacheList[index]).then(({ code, data: ret }) => {
        if (code === 200) {
          console.log(ret, 'getEcrDetail');
          state.detailData = ret;
          ecnApplyRef.value.init({
            ...ret,
            ...data,
          });
          changeLoading(false);
        }
      });
    } else {
      // 新增
      ecnApplyRef.value.init({
        ...data,
        index: -1,
      });
      state.detailData = {};
      setTimeout(() => {
        changeLoading(false);
      });
    }
  }

  function handleDisagree() {
    const { id } = state.detailData;

    openDisAgreeModal(true, {
      api: disagreeEcr,
      ids: [id],
    });
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

  function handleSubmit(type: 'save' | 'commit') {
    changeLoading(true);
    let func;

    const data = ecnApplyRef.value.submit();
    if (isFunction(data)) return changeLoading(false);
    data.id = state.detailData.id;
    agreeEcr(data)
      .then(({ code, msg }) => {
        if (code === 200) {
          emit('reload');
          closePopup();
          createMessage.success(msg);
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
    // if (type === 'commit') {
    //   data.saveAndCommit = true;
    // }
    // if (state.detailData.id) {
    //   func = updateEcr;
    //   data.id = state.detailData.id;
    // } else {
    //   func = addEcr;
    // }
    // func(data)
    //   .then(({ code, msg, data }) => {
    //     if (code === 200) {
    //       emit('reload');
    //       closePopup();
    //       createMessage.success(msg);
    //     }
    //   })
    //   .finally(() => {
    //     changeLoading(false);
    //   });
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

  //.scroll-container {
  //  padding-bottom: 60px;
  //}
</style>
