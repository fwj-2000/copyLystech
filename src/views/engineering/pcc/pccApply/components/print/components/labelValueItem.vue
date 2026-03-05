<template>
  <section v-if="!props.schema.showIfHasValue || value" class="print-label-value">
    <span class="mb-5px block">{{ props.schema.label }}</span>
    <ValueItem :value="value" />
  </section>
</template>

<script lang="ts" setup>
  import type { Schema } from '../types';

  import { computed } from 'vue';

  import ValueItem from './valueItem.vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
    schema: {
      type: Object as PropType<Schema>,
      default: () => ({}),
    },
  });

  const value = computed(() => {
    const { field, format } = props.schema;
    const v = props.data[field];
    return typeof format === 'function' ? format(v) : v;
  });
</script>

<style scoped lang="less">
  .print-label-value {
    + .print-label-value {
      margin-top: 8px;
    }
  }
</style>
