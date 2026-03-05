<template>
  <div v-for="(schema, index) in schemas" class="step-distance-group">
    <LabelValueItem v-for="item in schema" :key="`stepDistanceGropItem-${index}`" :data="list[index]" :schema="item" class="step-distance-group-item" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  import LabelValueItem from './labelValueItem.vue';

  const { t } = useI18n();

  const props = defineProps({
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const schemas = computed(() => {
    return props.list.map((_, index) => {
      return [
        {
          label: `${index + 1}、${index === 0 ? t('common.mainStep') : t('common.step')}(MM)`,
          field: 'stepDistance',
        },
        {
          label: t('common.modules'),
          field: 'modulus',
        },
      ];
    });
  });
</script>

<style scoped lang="less">
  .step-distance-group {
    display: flex;
    justify-content: space-between;

    .step-distance-group-item {
      width: 48%;
      margin-top: 8px;
    }
  }
</style>
