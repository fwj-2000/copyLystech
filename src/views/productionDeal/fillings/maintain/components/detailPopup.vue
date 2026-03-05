<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="isCanEdit"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup popup-top">
    <ScrollContainer class="p-10px">
      <DetailPopupContainer ref="detailPopupContainerRef" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDetail } from '/@/api/productionDeal/customsAffairsProduce';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import DetailPopupContainer from './detailPopupContainer.vue';

  const { t } = useI18n();
  const detailPopupContainerRef = ref<InstanceType<typeof DetailPopupContainer>>();
  const isCanEdit = ref<boolean>(false);

  const emits = defineEmits(['reload']);
  const [registerPopup, { changeLoading }] = usePopupInner(init);

  async function init(data: { id: string }) {
    nextTick(() => {
      getDetailData(data.id);
    });
  }

  async function getDetailData(id: string) {
    changeLoading(true);
    return getDetail([id])
      .then(res => {
        const data = res?.data?.[0] || {};
        detailPopupContainerRef.value && detailPopupContainerRef.value.initData(data, isCanEdit.value);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSubmit() {
    // const applyInfoData = await validateApplyInfo();
    // changeLoading(true);
    // return save([applyInfoData])
    //   .then(() => {
    //     createMessage.success(t('sys.api.operationSuccess'));
    //     emits('reload');
    //     closePopup();
    //   })
    //   .catch(() => {})
    //   .finally(() => {
    //     changeLoading(false);
    //   });
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }
</style>
