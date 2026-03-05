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
      @change="handleChange">
      <template #dropdownRender="{ menuNode: menu }">
        <div @mouseleave="open = false">
          <v-nodes :vnodes="menu" />
          <template v-if="value === props.otherValue">
            <a-divider style="margin: 4px 0" />
            <div class="w-full py-[4px] px-[8px] flex justify-between items-center">
              <a-textarea
                autofocus
                ref="inputRef"
                v-model:value="name"
                :placeholder="`${t('common.otherText')}...`"
                class="flex-1"
                @blur="handleOtherContentChange" />
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
  function handleChange(_value: string | number, option?: { label: string; value: string | number }) {
    emits('update:value', option?.value || '');
    emits('update:label', option?.label || '');
    emits('change', option);
  }

  function handleOtherContentChange() {
    const list = cloneDeep(props.options);
    const otherOption = list.find(item => item.value === props.otherValue);
    if (otherOption) {
      otherOption.label = name.value || t('common.otherText');
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
