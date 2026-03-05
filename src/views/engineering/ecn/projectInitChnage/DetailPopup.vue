<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="t('common.reviewText')"
    destroyOnClose
    class="full-popup pl-0px pb-10px">
    <template #centerToolbar>
      <a-button v-auth="'btn_reject'" v-if="mode === 'edit'" :disabled="agreeLoading" @click="handleReject" type="primary" ghost
        >{{ t('common.rejectText') }}
      </a-button>
      <a-button v-auth="'btn_agree'" v-if="mode === 'edit'" :loading="agreeLoading" class="mx-12px" @click="handleSubmit('commit')" type="primary"
        >{{ t('common.agree') }}
      </a-button>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
      <QuantitativeChange ref="QuantitativeChangeRef" />
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
  import { addEcr, commitEcn, getEcnDetail, rejectEcn } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { RejectModal } from '/@/components/CustomComponents';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { generatePdfByIds } from '/@/views/engineering/pcc/pccApply/components/print';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const ecnApplyRef = ref(null);
  const QuantitativeChangeRef = ref(null);
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

    const currentData = cacheList[index];
    console.log(cacheList[index], 'currentData');
    if (currentData) {
      changeLoading(true);
      // ECN
      getEcnDetail(currentData)
        .then(({ code, data: ret }) => {
          ecnApplyRef.value.init({
            ...ret,
            ...data,
            origin: 'ECN',
            mode: 'view',
          });
          QuantitativeChangeRef.value.init({
            ...ret,
            ...data,
            origin: 'ECN',
            mode: 'view',
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

  const agreeLoading = ref<boolean>(false);

  function handleSubmit(type: 'save' | 'commit') {
    console.log(state);
    const { cacheList, index } = state;
    changeLoading(true);
    agreeLoading.value = true;
    let func;

    const data = {};
    if (type === 'commit') {
      data.saveAndCommit = true;
    }
    if (cacheList[index].id) {
      func = commitEcn;
    } else {
      return;
      func = addEcr;
    }
    func({
      id: cacheList[index].id,
    })
      .then(({ code, msg, data }) => {
        if (code === 200) {
          emit('reload');
          closePopup();
          createMessage.success(msg);

          // 如果返回值的res.data是个`{ [id: string]: boolean }`的对象，则表示生成pdf推送到3.8
          if (cacheList[index].id && typeof data === 'object') {
            const ids = Object.keys(data).filter(id => data[id]);
            ids.length > 0 && generatePdfByIds(ids);
          }
        }
      })
      .finally(() => {
        changeLoading(false);
        agreeLoading.value = false;
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
