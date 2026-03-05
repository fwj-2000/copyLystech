<template>
  <a-select
    v-bind="getBindValue"
    :options="options"
    :filter-option="false"
    v-model:value="innerValue"
    allow-clear
    @change="onChange"
    @dropdown-visible-change="handleFetch"
    @search="debounceSearchFn"
    @popupScroll="debounceScrollSearch"
    ref="selectRef">
    <template #[item]="data" v-for="item in Object.keys($slots)"><slot :name="item" v-bind="data || {}"></slot></template>
  </a-select>
</template>

<script lang="ts" setup>
  import { computed, onUnmounted, reactive, ref, toRefs, unref, watch } from 'vue';
  import { customOrganizeSelectProps, FieldNames } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { getOrganizeSelectorAsyncByAuth, getDepartmentSelectorAsyncByAuth, getDepartmentSelectAsyncList } from '/@/api/permission/organize';
  import { useDebounceFn } from '@vueuse/core';
  import { isNullOrUnDef } from '/@/utils/is';

  defineOptions({ name: 'LydcCustomOrganizeSelect', inheritAttrs: false });
  defineExpose({ getSelectRef });
  const props = defineProps(customOrganizeSelectProps);
  const emit = defineEmits(['update:value', 'change', 'options-change']);
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const innerValue = ref<string | string[]>('');
  const selectRef = ref(null);
  const searchParams = ref<any>({});
  const pagination = reactive({
    keyword: '',
    currentPage: 1,
    pageSize: 20,
    currOrgId: '',
  });
  const state = reactive({
    options: [] as any[],
    finish: false,
    needBackName: true, // 是否需要调用接口回显
  });
  const { options } = toRefs(state);
  const isFirstLoaded = ref(false);
  const method = !props.auth ? getDepartmentSelectAsyncList : props.isOnlyOrg ? getOrganizeSelectorAsyncByAuth : getDepartmentSelectorAsyncByAuth;

  const getFieldNames = computed((): Required<FieldNames> => {
    const { fieldNames } = props;
    return {
      options: '',
      label: 'fullName',
      value: 'id',
      disabled: 'disabled',
      ...fieldNames,
    };
  });
  const getOptionFilterProp = computed(() => props.optionFilterProp || unref(getFieldNames).label);

  const getBindValue = computed(() => {
    return {
      ...unref(attrs),
      ...props,
      optionFilterProp: unref(getOptionFilterProp),
      fieldNames: unref(getFieldNames),
      mode: props.multiple ? 'multiple' : props?.mode || '',
      showArrow: Reflect.has(unref(attrs), 'showArrow') ? (unref(attrs) as { showArrow: boolean }).showArrow : true,
      getPopupContainer: () => document.body,
      showSearch: true,
      dropdownStyle: { minWidth: '700px' },
    };
  });

  if (!isNullOrUnDef(props.defaultValue)) {
    setValue(props.defaultValue);
    emit('update:value', props.defaultValue, []);
    emit('change', props.defaultValue, []);
  }

  function handleFetch(visible: boolean) {
    if (visible) {
      if (!props.immediate && !unref(isFirstLoaded)) {
        fetchOrganizeList(innerValue.value);
      }
    }
  }

  watch(
    () => props.value,
    val => {
      setValue(val);
      console.log('🚀 ~  ~ props: ', props);

      // 外部变动的时候才去调用接口
    },
    { immediate: true },
  );

  // let debounceSearchFn = useDebounceFn(handleSearch, 500);
  // 核心修复：使用响应式变量存储当前搜索值
  const currentSearchValue = ref('');
  const isSearching = ref(false);
  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  const debounceSearchFn = function (value: string) {
    // 立即更新当前搜索值
    currentSearchValue.value = value;

    // 清除之前的定时器
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }

    // 设置新的防抖定时器
    searchTimer = setTimeout(() => {
      // 确保使用最新的值
      handleSearch(currentSearchValue.value);
    }, 500);
  };
  const debounceScrollSearch = useDebounceFn(scrollSearch, 500);

  function setValue(value) {
    innerValue.value = value || value === 0 ? value : undefined;
    if (innerValue.value && state.needBackName) {
      // 如果带上了name值的话，直接填充到options
      if (props.label) {
        if (props.multiple) {
          const names = props.label.split('  ');
          const ids = Array.isArray(innerValue.value) ? innerValue.value : [props.value];
          ids.forEach((id, index) => {
            state.options.push({
              fullName: names[index],
              id: id,
            });
          });
        } else {
          state.options.push({
            id: innerValue.value,
            fullName: props.label,
          });
        }
      } else {
        if (props.immediate) {
          fetchOrganizeList(innerValue.value);
        }
      }
    } else if (!innerValue.value && props.multiple) {
      // 如果是多选且没有值，重置选中项
      innerValue.value = [];
    }
    state.needBackName = true;
  }

  function onChange(val, option) {
    console.log('🚀 ~ onChange ~ val, option: ', val, option);
    emit('update:value', val, option);
    emit('change', val, option);
  }
  function getSelectRef() {
    const select = unref(selectRef);
    if (!select) {
      throw new Error('select is null!');
    }
    return select;
  }

  function handleSearch(value, type = 'search') {
    // lastFetchId += 1;
    // const fetchId = lastFetchId;
    const { searchName } = props;
    const searchValue = value.trim();

    if (!searchValue) {
      state.options = [];
      state.finish = false;
      isSearching.value = false;
      emit('options-change', []);
      return;
    } else {
      pagination.keyword = searchValue;
    }
    if (searchParams.value[searchName] !== value) {
      state.finish = false;
      pagination.currentPage = 1;
    }
    method('0', pagination)
      .then(res => {
        const list = res?.data?.list || [];
        if (list.length < pagination.pageSize) state.finish = true;
        if (type == 'scroll') {
          options.value = [...options.value, ...list];
        } else {
          options.value = list;
        }
        emit('options-change', options.value);
      })
      .finally(() => {
        isSearching.value = false;
      });
    state.needBackName = false;
    searchParams.value = {
      [searchName]: value,
    };
  }

  function scrollSearch() {
    if (state.finish) return;
    pagination.currentPage += 1;
    const { searchName } = props;
    handleSearch(searchParams.value[searchName], 'scroll');
  }

  function fetchOrganizeList(value) {
    const hasLength = (val: any): val is string | any[] => typeof val === 'string' || Array.isArray(val);
    if (!value || !hasLength(value)) return false;
    const ids = props.multiple ? (value as any[]) : [value];
    method(ids[0], { currentPage: 1, pageSize: 99999 })
      .then(res => {
        options.value = res.data.list;
        isFirstLoaded.value = true;
      })
      .catch(() => {
        isFirstLoaded.value = false;
      });
  }
  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
  });
</script>
