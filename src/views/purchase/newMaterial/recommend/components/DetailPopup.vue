<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="showEdit"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    :title="t('dict.metarail.recommend')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <BasicPopPage :config="state" @change="handleChangePage"></BasicPopPage>
      <template v-if="showStorageBtn">
        <a-button :loading="storageLoading" @click="handleSubmit('storage')" type="primary" ghost>
          {{ t('common.temporarySave') }}
        </a-button>
      </template>
    </template>
    <div class="metarial-wrap p-10px h-full">
      <ScrollContainer style="width: 48%; margin-right: 10px; height: 100%">
        <BaseInfo :source="state.base"></BaseInfo>
      </ScrollContainer>
      <ScrollContainer class="flex-1 h-full">
        <div>
          <Subtitle :title="t('common.metariaInfo')"></Subtitle>
          <div class="mb-10px">
            <div class="pb-10px flex flex-start" style="align-items: center">
              <div v-if="state.base.status == 16">
                {{ t('common.isRecommendTip') }}：
                <a-radio-group v-model:value="state.isRecommend">
                  <a-radio value="1">{{ t('dict.StateEnum.Yes') }}</a-radio>
                  <a-radio value="0">{{ t('dict.StateEnum.No') }}</a-radio>
                </a-radio-group>
              </div>
              <div v-if="showRecommendBtn">
                <a-button type="primary" v-if="showSupplier" ghost @click="handleChange('2')">+ {{ t('common.supplierMetaria') }}</a-button>
                <a-button class="ml-5px" v-if="showMetaria" type="primary" ghost @click="handleChange('1')">+ {{ t('common.aleardyMetaria') }}</a-button>
              </div>
            </div>
            <MetarialReplay
              ref="metarialReplyRef"
              v-bind="metarialReplayRoleProps"
              :order-status="state.base.status"
              :id="state.base.materialDevelopApplyId"
              :can-edit="showEdit" />
          </div>
        </div>
      </ScrollContainer>
    </div>
  </BasicPopup>
  <RemarkModal @register="registerRemarkModal" @reload="handleSuccess"></RemarkModal>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { computed, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { storageMaterial, updateMaterial, resendRecommend, getDetails } from '/@/api/purchase/newMateria';
  import { useI18n } from '/@/hooks/web/useI18n';
  import MetarialReplay from './metarialReplay/index.vue';
  import BaseInfo from './BaseInfo.vue';
  import { RemarkModal } from '/@/components/CustomComponents';
  import { BasicPopPage } from '/@/components/Basic';

  const { createMessage, createConfirm } = useMessage();
  const emits = defineEmits(['reload', 'register']);
  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const { t } = useI18n();

  const state = reactive<any>({
    base: {},
    id: '',
    activeKey: '',
    isRecommend: '',
    reRecommendFromDone: false,
    total: 0,
    currentIndex: 0,
    ids: [],
  });

  const showSupplier = ref(true);
  const showMetaria = ref(true);
  const storageLoading = ref(false);
  const metarialReplayRoleProps = { role: '1' };

  const showRecommendBtn = computed(() => {
    if (state.reRecommendFromDone) {
      return true;
    }
    const { status } = state.base;
    if (status == 16) {
      if (state.isRecommend == 0) {
        return false;
      }
    }
    if (status == 7) {
      return false;
    }
    return true;
  });

  const editStatus = [3, 4, 6, 15, 16];
  const showEdit = computed(() => {
    if (state.reRecommendFromDone) {
      return true;
    }
    return editStatus.includes(state.base.status);
  });
  const showStorageBtn = computed(() => {
    return state.reRecommendFromDone || showEdit.value;
  });

  const todoStatus = [6, 15];
  const metarialReplyRef = ref();

  async function init(data) {
    changeLoading(true);
    state.id = data.ids[0];
    state.ids = data.ids;
    state.total = data.ids.length;
    state.currentIndex = 0;
    state.base = {};
    state.reRecommendFromDone = !!data.reRecommendFromDone;
    await getDetail();
  }

  async function getDetail() {
    changeLoading(true);
    const r = await getDetails([state.id]);
    if (r.code == 200) {
      const _item = r.data[0];
      state.base = _item;
      // 待确认状态下，显示继续推荐
      if (state.base.status == 16) {
        state.isRecommend = '1';
      }
      metarialReplyRef.value.handleClear();
      const { developApplyPurchaseDetailOutputs } = _item;
      if (developApplyPurchaseDetailOutputs && developApplyPurchaseDetailOutputs.length) {
        metarialReplyRef.value.handleUpdate(developApplyPurchaseDetailOutputs, 'view');
        // 显示默认值
        state.activeKey = _item.recommendType;
        // 根据之前的推荐类型，显示对应的, 待处理状态下两个都显示
        if (_item.status == '6') {
          showSupplier.value = true;
          showMetaria.value = true;
        } else if (_item.recommendType == 2) {
          showSupplier.value = true;
          showMetaria.value = false;
        } else {
          showSupplier.value = false;
          showMetaria.value = true;
        }
      } else {
        state.activeKey = '2'; // 默认显示供应商类型
        showMetaria.value = true;
        showSupplier.value = true;
        metarialReplyRef.value.handleAdd(2);
      }
    }
    changeLoading(false);
  }

  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }

  function handleChange(e) {
    // 如果是待处理的话，不允许切换
    const todoCan = todoStatus.includes(state.base.status) && e != state.activeKey;
    const toComfirmCan = state.base.status == 16 && state.activeKey !== '' && e != state.activeKey;
    if (todoCan || toComfirmCan) {
      return createConfirm({
        title: t('common.tipTitle'),
        iconType: 'info',
        content: t('common.changeMetariaTip'),
        onOk: () => {
          state.activeKey = e;
          toComfirmCan ? metarialReplyRef.value.handleClearNew() : metarialReplyRef.value.handleClear();
          metarialReplyRef.value.handleAdd(Number(e));
        },
      });
    }
    state.activeKey = e;
    metarialReplyRef.value.handleAdd(Number(e));
  }

  function handleSuccess() {
    createMessage.success(t('sys.api.operationSuccess'));
    closePopup();
    emits('reload');
  }

  async function handleSubmit(type?) {
    if (type === 'storage') {
      storageLoading.value = true;
    } else {
      changeOkLoading(true);
    }

    const params: any = { id: state.id, ...metarialReplyRef.value.getValues() };
    if (state.base.status == 16) params.isRecommend = state.isRecommend;

    try {
      const submitApi = state.reRecommendFromDone ? resendRecommend : updateMaterial;
      const r = type === 'storage' ? await storageMaterial(params) : await submitApi(params);
      if (r.code === 200) {
        if (type === 'storage') {
          createMessage.success(t('sys.api.operationSuccess'));
          await getDetail();
          return;
        }
        if (state.currentIndex == state.total - 1) {
          handleSuccess();
        } else {
          createMessage.success(t('sys.api.operationSuccess'));
          handleChangePage('next');
        }
      }
    } catch (error) {
      console.log(error);
      createMessage.error(t('sys.api.operationFailed'));
    } finally {
      if (type === 'storage') {
        storageLoading.value = false;
      } else {
        changeOkLoading(false);
      }
    }
  }
</script>

<style scoped lang="less">
  .metarial-wrap {
    display: flex;
    align-items: flex-start;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
