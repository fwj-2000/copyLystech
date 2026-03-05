<!--  -->
<template>
  <span class="flex justify-end">
    <span class="text-hover">
      {{ cellValue }}
    </span>
    <template v-if="hasAnalysis">
      <a-popover placement="right">
        <template #content>
          <AnalysisPopover v-bind="props" />
        </template>
        <img class="text-hover" :src="vectorSvg" style="margin: 0 0 1px 4px" />
      </a-popover>
    </template>
  </span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { get, isFunction } from 'lodash-es';

  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import AnalysisPopover from './AnalysisPopover.vue';

  interface IProps {
    column: Record<string, any>;
    row: Record<string, any>;
    formParams: Record<string, any>;
  }
  const props = withDefaults(defineProps<IProps>(), {
    column: () => ({}),
    row: () => ({}),
    formParams: () => ({}),
  });

  const cellValue = computed(() => {
    const { field, formatter } = props.column;
    const value = get(props.row, field);
    if (isFunction(formatter)) {
      return formatter({ cellValue: value });
    }
    return value;
  });

  const hasAnalysis = computed(() => {
    const { getHasAnalysis } = props.column.params;
    if (isFunction(getHasAnalysis)) {
      return getHasAnalysis(props.row) && cellValue.value;
    }
    return false;
  });
</script>
