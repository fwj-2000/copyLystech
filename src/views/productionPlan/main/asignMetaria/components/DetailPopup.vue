<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('dict.metarail.recommend')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <BasicPopPage :config="state" @change="handleChangePage"></BasicPopPage>
      <a-button class="ml-12px" @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="metarial-wrap p-10px h-full">
      <ScrollContainer style="width: 48%; margin-right: 10px; height: 100%">
        <BaseInfo :source="state.base"></BaseInfo>
      </ScrollContainer>
      <ScrollContainer class="h-full flex-1">
        <div>
          <Subtitle :title="t('common.metariaInfo')"></Subtitle>
          <div class="mb-10px">
            <div class="pb-10px flex flex-start" style="align-items: center">
              <a-button type="primary" ghost @click="handleChange('2')">+ {{ t('common.supplierMetaria') }}</a-button>
            </div>
            <metarialReplay ref="metarialReplyRef" :role="'1'" :id="state.base.materialDevelopApplyId"></metarialReplay>
          </div>
        </div>
      </ScrollContainer>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { storageMaterial, recommendMaterial, getDetails } from '/@/api/purchase/newMateriaCheckin';
  import { useI18n } from '/@/hooks/web/useI18n';
  import metarialReplay from '/@/views/purchase/newMaterial/recommend/components/metarialReplay/index.vue';
  import BaseInfo from '/@/views/purchase/newMaterial/recommend/components/BaseInfo.vue';
  import { BasicPopPage } from '/@/components/Basic';

  const { createMessage } = useMessage();
  const emits = defineEmits(['reload', 'register']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const state = reactive<any>({
    base: {},
    id: '',
    total: 0,
    currentIndex: 0,
    ids: [],
    activeKey: '2',
    isRecommend: '',
    currentId: 0,
  });

  function getCurrentId() {
    return state.qualityDesensitizationId[state.currentIndex];
  }

  const { t } = useI18n();
  const metarialReplyRef = ref();
  async function init(data) {
    state.qualityDesensitizationId = data.qualityDesensitizationId;
    state.id = data.ids[0];
    state.ids = data.ids;
    state.total = data.ids.length;
    state.currentIndex = 0;
    state.base = {};
    getDetail();
  }

  async function getDetail() {
    changeLoading(true);
    const r = await getDetails([getCurrentId()]);
    if (r.code == 200) {
      const _item = r.data[0];
      state.base = _item;
      metarialReplyRef.value.handleClear();
      const { developApplyPurchaseDetailOutputs } = _item;
      if (developApplyPurchaseDetailOutputs && developApplyPurchaseDetailOutputs.length) {
        metarialReplyRef.value.handleUpdate(developApplyPurchaseDetailOutputs, 'view');
      } else {
        state.activeKey = '2';
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
    metarialReplyRef.value.handleAdd(e);
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = {
      id: state.ids[state.currentId],
      qualityDesensitizationId: state.qualityDesensitizationId[state.currentId],
      ...metarialReplyRef.value.getValues(),
    };
    if (state.base.status == 16) {
      params.isRecommend = state.isRecommend;
    }
    try {
      const r = type == 'storage' ? await storageMaterial(params) : await recommendMaterial(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        if (state.currentIndex == state.total - 1) {
          closePopup();
          emits('reload');
        } else {
          createMessage.success(t('sys.api.operationSuccess'));
          handleChangePage('next');
        }
      }
      changeOkLoading(false);
    } catch (error) {
      console.log(error);
      changeOkLoading(false);
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
