<!-- 顶部搜索条件组件封装 -->
<template>
  <div class="dashboard-common-search-header">
    <div class="search-form relative flex flex-wrap justify-between gap-4">
      <BaseForm
        class="w-[100%] flex justify-start flex-wrap gap-4"
        v-model:searchFormValue="state.searchFormValue"
        v-bind="{
          formOptions: state.formOptions,
          commonAttrs: state.commonAttrs,
        }">
        <template #right>
          <slot name="right"></slot>
          <!-- 展开条件搜索 -->
          <text v-if="hasFilters" @click="isExtendFilters = !isExtendFilters" class="flex text-[#ff7b00]">
            <span :class="['extend-btn mr-4px', { rotate: isExtendFilters }]">
              <img width="16" height="16" :src="extendPng" />
            </span>
            {{ isExtendFilters ? '收起' : '展开' }}
          </text>
        </template>
      </BaseForm>
      <!-- 过滤条件  -->
      <div v-if="!isEmpty(state.filterOptions)" :class="[{ 'h-0': !isExtendFilters }, 'filter-form dashboard-common-shadow']">
        <BaseForm
          class="w-[100%] h-full px-1rem pb-1rem flex justify-start flex-wrap gap-4"
          v-model:searchFormValue="state.searchFormValue"
          v-bind="{
            formOptions: state.filterOptions,
            commonAttrs: state.commonAttrs,
            isGutter: true,
          }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, unref, reactive, onMounted } from 'vue';
  import { isEmpty } from 'lodash-es';

  import extendPng from '/@/assets/icons/extend.png';
  import BaseForm from './BaseForm/index.vue';
  import { ISearchFormAction, ISearchFormState } from './types';

  const emits = defineEmits(['register']);
  const isExtendFilters = ref(false);
  const state = reactive<ISearchFormState>({
    searchLoading: true,
    searchFormValue: {},
    formOptions: reactive([]),
    filterOptions: reactive([]),
    commonAttrs: {},
  });
  const hasFilters = computed(() => {
    return !isEmpty(unref(state?.filterOptions));
  });

  const action: ISearchFormAction = {
    state,
  };

  onMounted(() => {
    emits('register', action);
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');

  :deep(.ant-form .ant-form-item) {
    margin: 0;
  }

  .extend-btn {
    transition: all 0.2s linear;
    transform-origin: 50% 50%;

    &.rotate {
      transform: scaleY(-1);
    }
  }

  .filter-form {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 2;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
  }
</style>
