<template>
  <!-- 自动选中第一个 -->
  <Select
    v-if="props.autoSelect"
    @dropdown-visible-change="handleFetch"
    @change="handleChange"
    @search="debounceSearchFn"
    :options="getOptions"
    :allowClear="true"
    :autofocus="true"
    @keydown="handleKeydown"
    v-model:value="state"
    v-model:searchValue="searchValue"
    ref="selectRef"
    v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
  <!-- 非自动选中第一个 -->
  <Select
    v-else
    @dropdown-visible-change="handleFetch"
    @change="handleChange"
    @search="debounceSearchFn"
    :options="getOptions"
    :allowClear="true"
    :autofocus="true"
    @keydown="handleKeydown"
    v-model:value="state"
    ref="selectRef"
    v-bind="$attrs">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref, unref, watch, nextTick, isReactive } from 'vue';
  import { Select } from 'ant-design-vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { isEmpty, isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { assignIn, get, isEqual, omit } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';
  import { useDebounceFn } from '@vueuse/core';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };
  type ApiResult = OptionsItem[] | Recordable | Fn | null;

  type ApiSearchOption = {
    // 展示搜索
    show?: boolean;
    // 待搜索字段名
    searchName?: string;
    // 是否允许空搜索
    emptySearch?: boolean;
    // 搜索前置方法
    beforeFetch?: (value?: string) => Promise<string>;
    // 拦截方法
    interceptFetch?: (value?: string) => Promise<boolean>;
  };

  defineOptions({ name: 'ApiSelect', inheritAttrs: false });

  const { createMessage } = useMessage();

  const props = defineProps({
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: any) => Promise<ApiResult> | ApiResult>,
      default: null,
    },
    // api params
    params: propTypes.any.def({}),
    // support xxx.xxx.xx
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    immediate: propTypes.bool.def(true),
    memoInputVal: propTypes.bool.def(false),
    singleDefaultFirst: propTypes.bool.def(false),
    preciseParam: propTypes.string.def(''),
    nameFormat: {
      type: Array<string>,
      default: [],
    },
    useChangeCopy: propTypes.bool.def(false),
    alwaysLoad: propTypes.bool.def(false),
    options: {
      type: Array<OptionsItem>,
      default: [],
    },
    apiSearch: {
      type: Object as PropType<ApiSearchOption>,
      default: () => null,
    },
    beforeFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    defaultFirstOption: {
      type: Boolean,
      default: false,
    },
    emitOptions: {
      type: Boolean,
      default: false,
    },
    /**
     * 远程搜索之后，自动选中第一项数据，默认为`false`
     * @type { boolean }
     * @default false
     */
    autoSelect: {
      type: Boolean,
      default: false,
    },
    // 默认label名称
    defaultLabel: {
      type: String,
      default: '',
    },
    // 模糊获取输入内容
    memoInputVagueVal: {
      type: Boolean,
      default: false,
    },
    /**
     * 搜索防抖延迟时间，单位为毫秒，默认为`800`毫秒
     * @type { number }
     * @default 800
     */
    delay: {
      type: Number,
      default: 800,
    },
  });

  const emit = defineEmits(['options-change', 'change', 'update:value']);

  const optionsRef = ref<OptionsItem[]>([]);
  const selectRef = ref(null);

  // 缓存
  const memorize = ref<string>('');
  const loading = ref(false);
  // 首次是否加载过了
  const isFirstLoaded = ref(false);
  const emitData = ref<OptionsItem[]>([]);
  const searchParams = ref<any>({});
  const { t } = useI18n();
  const searchValue = ref<string>('');

  const currentOption = ref({});

  /**
   * 请求数据中断控制器，用于解决处理`fetch`方法中`loading`状态下，无法再次触发请求，从而导致用户搜索与返回接口不一致的问题
   *  */
  let controller: AbortController | null = null;

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const debounceFetchFn = useDebounceFn(fetch, props.delay);

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString, nameFormat } = props;
    let data = unref(optionsRef).reduce((prev, next: any) => {
      if (next) {
        let label = '';
        if (nameFormat && nameFormat.length > 0) {
          nameFormat.forEach((item, index) => {
            if (index % 2 === 0) {
              label += get(next, [item]) || '';
            } else {
              label += item;
            }
          });
        } else {
          label = get(next, labelField);
        }
        const value = get(next, valueField);
        prev.push({
          ...omit(next, [labelField, valueField]),
          label,
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    if (props.memoInputVagueVal && props.memoInputVal && memorize.value) {
      data.unshift({
        label: memorize.value,
        value: memorize.value,
        isMemorize: true,
      });
    }
    if (props.memoInputVal && data.length === 0 && props.options.length === 0) {
      if (!memorize.value && isFunction(props.memoInputFormat)) return;
      data.push({
        label: memorize.value,
        value: memorize.value,
        isMemorize: true,
      });
    }
    if (props.singleDefaultFirst && data.length === 1) {
      console.log('自动选中第一项');
      // 自动选中第一项
      currentOption.value = data[0];
      state.value = data[0]['value'] || data[0]['label'];
      handleChange(data[0]['value'] || data[0]['label'], data[0]);
    }
    if (props.preciseParam && data.length > 0) {
      // 自动命中传入的Params参数
      console.log('自动命中传入的Params参数');
      const target = data.find(item => props['params'][props.preciseParam] === item[props.preciseParam]);
      if (target) {
        currentOption.value = target;
        state.value = target['label'];
        handleChange(target['label'], target);
      }
    }
    return data.length > 0 ? data : props.options || [];
  });
  watch(
    () => state.value,
    v => {
      if (!v) {
        memorize.value = '';
      }
      emit('update:value', v, getCurrentOption());
    },
  );

  watch(
    () => props.params,
    (value, oldValue) => {
      // 如果是reactive对象，说明是vxe表格，直接请求
      if (isReactive(value)) {
        return nextTick(() => {
          debounceFetchFn();
        });
      }
      if (isEqual(value, oldValue)) return;
      fetch();
    },
    { deep: true, immediate: props.immediate },
  );

  watch(
    () => searchParams.value,
    (value, oldValue) => {
      if (isEmpty(value) || isEqual(value, oldValue)) return;
      (async () => {
        await fetch();
        searchParams.value = {};
      })();
    },
    { deep: true, immediate: props.immediate },
  );

  const firstLabelChange = ref(true);
  watch(
    () => props.defaultLabel,
    v => {
      if (v) {
        firstLabelChange.value = true;
        nextTick(() => {
          handleDefaultLabel(v);
        });
      }
    },
  );

  function getSelectRef() {
    const select = unref(selectRef);
    if (!select) {
      throw new Error('select is null!');
    }
    return select;
  }

  function handleKeydown(event) {
    // 如果是enter键，触发change事件
    if (event.key === 'Enter') {
      emit('change', state.value, unref(getCurrentOption()));
    }
    if (event.ctrlKey && event.key === 'c') {
      const options = getOptions.value;
      const target = options.find(item => item.value === props.value);
      copyTextToClipboard(target?.label || props.value);
      createMessage.success(t('common.copySuccess'));
      event.preventDefault(); // 阻止默认行为（如文本复制）
    }
  }

  function handleDefaultLabel(defaultLabel?: string) {
    // 配置了defaultLabel，且options中未查询到数据的情况下，默认添加一条数据
    const label = defaultLabel || props.defaultLabel;
    if (
      label &&
      unref(firstLabelChange) &&
      (!props.apiSearch?.searchName || !searchParams.value?.[props.apiSearch.searchName]) && // 存在搜索关键词，则不添加默认选项
      (unref(optionsRef).length === 0 || !unref(optionsRef).find(item => item[props.valueField] === state.value))
    ) {
      // debugger
      optionsRef.value.push({
        [props.labelField]: label,
        [props.valueField]: state.value,
      });
      firstLabelChange.value = false;
    }
  }

  const isAutoSelected = ref<boolean>(false);
  async function resolveApiResult(apiFn: Fn, apiParams: Recordable) {
    const result = await apiFn(apiParams);
    if (isFunction(result)) {
      // 支持 api 返回一个 Promise Fn，再次调用该 Fn 获取实际数据
      return await result(apiParams);
    }
    return result;
  }
  async function fetch() {
    let { api, beforeFetch, afterFetch, params, resultField } = props;
    if (!api || !isFunction(api)) return;
    if (loading.value && controller) {
      controller.abort();
      return nextTick(() => fetch());
    }
    optionsRef.value = [];
    try {
      let res: any = {};
      controller = new AbortController();

      await new Promise(async (resolve, reject) => {
        if (controller) {
          // 监听中止事件处理，中断当前请求处理
          controller.signal.onabort = () => {
            reject(new Error('abort controller.value !'));
          };
        }
        loading.value = true;
        let apiParams = assignIn({}, params, searchParams.value);
        if (beforeFetch && isFunction(beforeFetch)) {
          apiParams = (await beforeFetch(apiParams)) || apiParams;
        }
        res = await resolveApiResult(api, apiParams);
        if (afterFetch && isFunction(afterFetch)) {
          res = (await afterFetch(res)) || res;
        }
        resolve(res);
      });

      if (Array.isArray(res)) {
        optionsRef.value = res;
        emitChange();
        return;
      }
      if (resultField) {
        const list = get(res, resultField) || [];
        optionsRef.value = list;
      }

      // 配置了defaultLabel，且options中未查询到数据的情况下，默认添加一条数据
      handleDefaultLabel();

      if (props.defaultFirstOption && unref(optionsRef).length && !unref(isFirstLoaded)) {
        console.log('未配置数据自动选中赋值输入值');
        state.value = unref(optionsRef)[0][props.valueField];
      }

      // 远程搜索并且开启自动选择的情况下，自动选中第一项数据
      const searchKeyword = props.apiSearch?.searchName ? searchParams.value[props.apiSearch.searchName] : '';
      if (searchKeyword && props.autoSelect && unref(optionsRef).length && unref(isFirstLoaded)) {
        console.log('远程搜索并且开启自动选择的情况下，自动选中第一项数据');
        // currentOption.value = unref(optionsRef)[0];
        currentOption.value = unref(getOptions)[0];
        state.value = currentOption.value[props.valueField];
        handleChange(currentOption.value[props.valueField], {
          ...unref(optionsRef)[0],
          value: currentOption.value[props.valueField],
        });
        isAutoSelected.value = true;
      }
      // 远程搜索并且开启自动选择的情况下，搜索不到相应的数据，默认清空选中项
      if (searchKeyword && props.autoSelect && unref(optionsRef).length === 0) {
        console.log('远程搜索并且开启自动选择的情况下，搜索不到相应的数据，默认清空选中项');
        currentOption.value = {};
        state.value = '';
      }

      isFirstLoaded.value = true;
      emitChange();
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.value = false;
    } finally {
      controller = null;
      loading.value = false;
    }
  }

  async function handleFetch(visible: boolean) {
    if (visible) {
      if (props.alwaysLoad) {
        await fetch();
      } else if (!props.immediate && !unref(isFirstLoaded)) {
        // 动态搜索查询时，允许控制初始不加载数据
        if (!!props.apiSearch && !!props.apiSearch.show && !props.apiSearch.emptySearch) {
          console.log(
            !!props.apiSearch && !!props.apiSearch.show && !props.apiSearch.emptySearch,
            '!!props.apiSearch && !!props.apiSearch.show && !props.apiSearch.emptySearch',
          );
          await fetch();
        } else {
          optionsRef.value = [];
          emitChange();
        }
      }
    }
  }

  let debounceSearchFn = useDebounceFn(handleSearch, 800);

  async function handleSearch(value: any) {
    if (isAutoSelected.value && !value) {
      isAutoSelected.value = false;
      return;
    }

    if (!props.apiSearch) {
      return;
    }
    const { show, searchName, beforeFetch, interceptFetch } = props.apiSearch;
    if (!show || !searchName) {
      return;
    }

    value = value || undefined;
    memorize.value = value;
    if (beforeFetch && isFunction(beforeFetch)) {
      memorize.value = value;
      value = (await beforeFetch(value)) || value;
    }

    if (interceptFetch && isFunction(interceptFetch)) {
      if (!(await interceptFetch(value))) {
        return;
      }
    }
    searchParams.value = {
      [searchName]: value,
    };
  }

  function emitChange() {
    const res = unref(getOptions);

    emit('options-change', res);
  }
  function handleChange(_, ...args) {
    isAutoSelected.value = false;
    const { useChangeCopy } = props;
    if (useChangeCopy) {
      copyTextToClipboard(args[0].label);
    }
    emitData.value = args;
    currentOption.value = args[0];
  }

  function getCurrentOption() {
    return unref(currentOption);
  }

  defineExpose({ getCurrentOption });
</script>
