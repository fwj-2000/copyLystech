<!-- 产值趋势图 -->
<template>
  <div class="bx-shadow p-12px">
    <div class="color-[#1A1A1A] font-bold">
      <a-select ref="select" v-model:value="field" style="width: 120px">
        <a-select-option v-for="(item, idx) in props.metricKeyList" :key="idx" :value="item.field">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="flex gap-12px h-[284px]">
      <Rate
        :class="[showRank ? 'w-[calc(100%-292px)]' : 'w-[100%]', 'h-[100%]']"
        v-bind="{ searchFormValue: props.searchFormValue, field, fieldName, showRank }" />
      <!-- <Rate v-show="!showRank" class="w-[100%] h-[100%]" v-bind="{ searchFormValue: props.searchFormValue, field, fieldName, showRank }" /> -->
      <Rank v-show="showRank" class="w-280px p-8px" v-bind="{ searchFormValue: props.searchFormValue, field, fieldName }" v-model:show="showRank" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';

  import Rate from './Rate.vue';
  import Rank from './Rank.vue';
  import { IMetricKey } from '../types';

  interface IProps {
    searchFormValue: Record<string, any>;
    metricKeyList: IMetricKey[];
  }
  const props = withDefaults(defineProps<IProps>(), {});
  const field = ref<string>('');
  const showRank = ref<boolean>(true);

  const fieldName = computed(() => {
    return (props.metricKeyList.find(item => item.field === field.value) || { name: '' }).name;
  });

  watch(
    () => props.metricKeyList,
    () => {
      field.value = props.metricKeyList[0].field;
    },
  );
</script>
