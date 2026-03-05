<!-- 顶部搜索条件组件封装 -->
<template>
  <div class="dashboard-common-search-header">
    <div class="search-form relative flex flex-wrap justify-between gap-4">
      <BaseForm
        class="w-[100%] flex justify-start flex-wrap gap-4"
        v-model:searchFormValue="state.searchFormValue"
        v-bind="{
          formOptions: state.formOptions,
          commonAttrs: props.commonAttrs,
        }">
        <template #right>
          <slot name="right"></slot>
          <!-- 展开条件搜索 -->
          <text v-if="hasFilters" @click="state.isExtendFilters = !state.isExtendFilters" class="flex text-[#ff7b00]" style="user-select: none">
            <span :class="['extend-btn mr-4px', { rotate: state.isExtendFilters }]">
              <img width="16" height="16" :src="extendPng" />
            </span>
            {{ state.isExtendFilters ? '收起' : '展开' }}
          </text>
        </template>
      </BaseForm>
      <!-- 过滤条件  -->
      <div v-if="!isEmpty(props.filterOptions)" :class="[{ 'h-0': !state.isExtendFilters }, 'filter-form dashboard-common-shadow']">
        <BaseForm
          class="w-[100%] h-full px-1rem pb-1rem flex justify-start flex-wrap gap-4"
          v-model:searchFormValue="state.searchFormValue"
          v-bind="{
            formOptions: state.filterOptions,
            commonAttrs: props.commonAttrs,
            isGutter: true,
          }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, isEmpty, set } from 'lodash-es';
  import { computed, reactive, watch, unref } from 'vue';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { getOptionList } from './utils';
  import Api from './api';

  import extendPng from '/@/assets/icons/extend.png';
  import BaseForm from './BaseForm/index.vue';
  import { IProps, ISearchFormState } from './types';

  const state = reactive<ISearchFormState>({
    formOptions: [],
    filterOptions: [],
    searchLoading: true,
    searchFormValue: {},
    isExtendFilters: false,
  });

  const props = withDefaults(defineProps<IProps>(), {
    api: () => new Api(),
    formOptions: () => [],
    filterOptions: () => [],
    commonAttrs: () => ({}),
  });
  const hasFilters = computed(() => {
    return !isEmpty(props?.filterOptions);
  });
  const { getParams } = useRouteParams();
  const { routeQuery } = useRouteQuery();

  // 初始设置表单配置
  const setAllOptions = async () => {
    state.searchLoading = true;
    const params = getParams();
    const commonParams = getCommonParams();
    state.formOptions = await getOptionList({
      ...commonParams,
      options: cloneDeep(unref(props.formOptions)),
    });
    state.filterOptions = await getOptionList({
      ...commonParams,
      options: cloneDeep(unref(props.filterOptions)),
    });
    // 路由参数赋值
    if (!isEmpty(params)) {
      Object.keys(params).forEach(key => {
        state.searchFormValue[key] = params[key];
      });
    }
    state.searchLoading = false;
  };

  props?.api?.mount(state);

  setAllOptions();

  // 监听配置变化，动态初始化表单内容
  watch(
    [() => props.filterOptions],
    () => {
      setFilterOptions();
    },
    {
      deep: true,
      immediate: true,
    },
  );

  async function setFilterOptions() {
    state.filterOptions = await getOptionList({
      ...getCommonParams(),
      options: unref(props.filterOptions),
    });
  }

  function getCommonParams() {
    const params = getParams();
    const commonParams = {
      routeQuery,
      initParams: {
        ...state.searchFormValue,
        ...params,
      },
      searchFormValue: state.searchFormValue,
      setSearchFormValue: (key, value) => {
        set(state.searchFormValue, key, value);
      },
    };
    return commonParams;
  }
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
