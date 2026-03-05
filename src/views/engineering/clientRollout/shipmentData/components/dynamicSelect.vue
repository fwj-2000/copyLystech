<template>
  <div @click="open = !open">
    <a-select
      ref="selectRef"
      :value="props.value"
      :open="open"
      :placeholder="t('common.selectPlaceholder')"
      style="width: 100%"
      :options="props.options"
      :disabled="props.disabled"
      :showSearch="true"
      @change="handleChange">
      <template #dropdownRender="{ menuNode: menu }">
        <div @mouseleave="open = false">
          <v-nodes :vnodes="menu" />
          <template v-if="value === props.otherValue">
            <a-divider style="margin: 4px 0" />
            <div class="w-full py-[4px] px-[8px] flex justify-between items-center">
              <a-textarea ref="inputRef" v-model:value="name" :placeholder="`${t('common.otherText')}...`" class="flex-1" @blur="handleOtherContentChange" />
              <!-- <a-button type="text" :title="t('common.add1Text')" @click="addItem">
                <template #icon>
                  <plus-outlined style="transform: translateY(-2px)" />
                </template>
              </a-button> -->
              <!-- <a-button type="primary" :title="t('common.okText')" class="ml-5px" @click="submit">
                <template #icon>
                  <CheckOutlined style="transform: translateY(-2px)" />
                </template>
              </a-button> -->
            </div>
          </template>
        </div>
      </template>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

  // import {
  //   // PlusOutlined,
  //   // CheckOutlined
  // } from '@ant-design/icons-vue';

  type OptionsType = Array<{ label: string; value: string | number } & Partial<Record<string, any>>>;

  const { t } = useI18n();
  const selectRef = ref();
  const open = ref<boolean>(false);

  const props = defineProps({
    options: {
      type: Array as PropType<OptionsType>,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    otherValue: {
      type: String,
      default: undefined,
    },
    otherContent: {
      type: String,
      default: '',
    },
  });

  // watch(
  //   () => props.value,
  //   async val => {
  //     await nextTick();
  //     // 当前选中值不存在时，自动创建对应的选项
  //     if (val && props.options.every(item => item.value !== val)) {
  //       const option = { label: `${val}`, value: val };
  //       emits('update:options', [...props.options, option]);
  //       handleChange(val, option);
  //     }
  //   },
  //   { immediate: true },
  // );

  const emits = defineEmits(['update:value', 'update:label', 'update:options', 'change', 'update:otherContent']);

  const VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true,
      },
    },
    render() {
      return this.vnodes;
    },
  });

  const inputRef = ref();
  const name = ref<string>('');

  // const addItem = (e: any) => {
  //   e.preventDefault();
  //   const inputValue = name.value.trim();
  //   if (inputValue === '') {
  //     return false;
  //   }
  //   emits('update:options', [...props.options, { label: inputValue, value: inputValue }]);
  //   name.value = '';
  //   setTimeout(() => {
  //     inputRef.value?.focus();
  //   }, 0);
  // };

  // const otherValue = ref<string>('');
  // function submit(e: any) {
  //   e.preventDefault();
  //   const inputValue = name.value.trim();
  //   if (inputValue === '') {
  //     return false;
  //   }
  //   otherValue.value = inputValue;
  //   name.value = '';
  //   changeOptions();
  // }

  // function changeOptions() {
  //   const list = cloneDeep(props.options);
  //   const otherOption = list.find(item => item.value === props.otherValue);
  //   if (otherOption) {
  //     const labels = [otherOption?.label.split('-')[0] || ''];
  //     otherValue.value && labels.push(otherValue.value);
  //     otherOption.label = labels.join('-');
  //     if (isOtherValue) {
  //       emits('update:label', otherOption.label || '');
  //     }
  //   }
  //   emits('update:options', [...list]);
  // }

  // const isOtherValue = computed(() => {
  //   return props.value === props.otherValue;
  // });

  function handleChange(_value: string | number, option?: { label: string; value: string | number }) {
    emits('update:value', option?.value || '');
    emits('update:label', option?.label || '');
    emits('change', option);
  }

  function handleOtherContentChange() {
    const list = cloneDeep(props.options);
    const otherOption = list.find(item => item.value === props.otherValue);
    if (otherOption) {
      // t('common.otherText') +
      otherOption.label = name.value ? name.value : '其他';
      if (name.value) {
        emits('update:label', otherOption.label || '');
      }
    }
    emits('update:otherContent', name.value);
    emits('update:options', [...list]);
  }

  watch(
    () => props.otherContent,
    async val => {
      name.value = val;
      handleOtherContentChange();
    },
    { immediate: true },
  );
</script>

<style scoped lang="less">
  :deep(.ant-space) {
    .ant-space-item:first-child {
      flex: 1;
    }
  }
</style>
