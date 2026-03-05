<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs class="h-full" destroyInactiveTabPane>
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <DeliveryPriceConfrim ref="deliveryPriceConfrimRef" searchKey="0" />
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <DeliveryPriceConfrim ref="deliveryPriceConfrimRef" searchKey="1" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  import DeliveryPriceConfrim from './deliveryPriceConfrim.vue';

  defineOptions({ name: 'engineering-mouldBusiness-deliveryPrice' });

  const { t } = useI18n();
  const deliveryPriceConfrimRef = ref<InstanceType<typeof DeliveryPriceConfrim>>();

  useRouteParams({ billNo: {} }, params => {
    const { billNo } = params;
    billNo && deliveryPriceConfrimRef.value?.setFormValue({ applyNo: billNo });
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }

  :deep(.ant-tabs .ant-tabs-content) {
    height: 100%;
  }
</style>
