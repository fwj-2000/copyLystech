<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="showEdit"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :okbuttonProps="{ class: 'mr-12px' }"
    :cancelbuttonProps="{}"
    :title="t('common.materialComfirm')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #appendToolbar>
      <BasicPopPage :config="state" @change="handleChangePage"></BasicPopPage>
    </template>

    <div class="metarial-wrap p-10px h-full">
      <ScrollContainer style="width: 48%; margin-right: 10px; height: 100%">
        <BaseInfo :source="state.base"></BaseInfo>
      </ScrollContainer>
      <ScrollContainer class="flex-1 h-full">
        <div>
          <Subtitle :title="t('common.metariaInfo')"></Subtitle>
          <div class="mb-10px">
            <metarialReplay
              ref="metarialReplyRef"
              :order-status="state.base.status"
              :can-edit="showEdit"
              role="2"
              :id="state.base.materialDevelopApplyId"></metarialReplay>
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
  import { computed, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateMaterial, getDetails } from '/@/api/engineering/newMateriaConfirm';
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
  });

  // 是否启用编辑状态
  const editStatus = [3, 4, 6, 15, 17];
  const showEdit = computed(() => {
    return editStatus.includes(state.base.status);
  });

  const { t } = useI18n();
  const metarialReplyRef = ref();
  async function init(data) {
    changeLoading(true);
    state.id = data.ids[0];
    state.ids = data.ids;
    state.total = data.ids.length;
    state.currentIndex = 0;
    state.base = {};
    getDetail();
  }

  async function getDetail() {
    changeLoading(true);
    try {
      metarialReplyRef.value.handleClear();
      const r = await getDetails([state.id]);
      if (r.code == 200) {
        const _item = r.data[0];
        state.base = _item;
        const { developApplyPurchaseDetailOutputs } = _item;
        if (developApplyPurchaseDetailOutputs && developApplyPurchaseDetailOutputs.length) {
          metarialReplyRef.value.handleUpdate(developApplyPurchaseDetailOutputs, 'view');
        }
      }
    } finally {
      changeLoading(false);
    }
  }

  function handleChangePage(type) {
    if (type == 'prev') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }

  async function handleSubmit(type) {
    const params = {
      id: state.id,
      ...metarialReplyRef.value.getValues(),
    };

    changeOkLoading(true);
    try {
      const r = await updateMaterial(params);
      if (r.code === 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        const isLast = state.currentIndex === state.total - 1;
        if (isLast) {
          closePopup();
          emits('reload');
        } else {
          handleChangePage('next');
        }
      }
    } finally {
      changeOkLoading(false);
    }
  }
</script>
<style scoped lang="less">
  .metarial-wrap {
    display: flex;
    align-items: flex-start;
  }
</style>
