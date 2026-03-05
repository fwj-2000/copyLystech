<template>
  <div>
    <!-- 半成品提示 -->
    <div v-if="semiFinishedProductList.length > 0">
      <h3 class="font-semibold mt-10px">{{ t('dict.mpsMaterialType.2') }}:</h3>
      <div v-for="item in semiFinishedProductList">{{ `${item.materialCode}, ${t('common.purchaser')}: ${item.inquiryUserName}` }}</div>
    </div>
    <!-- 材料提示 -->
    <div v-if="materiaList.length > 0">
      <h3 class="font-semibold mt-10px">{{ t('common.metaria') }}:</h3>
      <div v-for="item in materiaList">{{ `${item.materialCode || item.insidePartNumber}, ${t('common.purchaser')}: ${item.inquiryUserName}` }}</div>
    </div>
    <!-- 提示 -->
    <div class="mt-10px">{{ t('dict.PriceInquiry.continueInquiryTip') }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const props = defineProps({
    list: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  });

  const semiFinishedProductList = computed(() => {
    return props.list.filter(item => +item.type === 3);
  });

  const materiaList = computed(() => {
    return props.list.filter(item => +item.type !== 3);
  });
</script>
