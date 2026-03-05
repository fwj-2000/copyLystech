<template>
  <div :class="`${prefixCls}`">
    <InputNumber ref="inputNumberRef" v-model:value="innerValue" v-bind="getBindValue" @change="onChange" v-if="!detailed">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </InputNumber>
    <p class="leading-32px" :title="thousands ? thousandsFormat(innerValue) : innerValue" v-if="detailed">
      <span v-if="$attrs.addonBefore">{{ $attrs.addonBefore }}</span>
      {{ thousands ? thousandsFormat(innerValue) : innerValue }}
      <span v-if="$attrs.addonAfter">{{ $attrs.addonAfter }}</span>
    </p>
    <p v-if="isAmountChinese && getChineseName" class="amount-chinese-name">{{ getChineseName }}</p>
  </div>
</template>

<script lang="ts" setup>
  import { InputNumber } from 'ant-design-vue';
  import { computed, ref, unref, watch } from 'vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAmountChinese, thousandsFormat } from '/@/utils/lydc';

  defineOptions({ name: 'LydcInputNumber', inheritAttrs: false });
  const props = defineProps({
    value: [Number, String],
    thousands: { type: Boolean, default: false },
    isAmountChinese: { type: Boolean, default: false },
    detailed: { type: Boolean, default: false },
    safe: { type: Boolean, default: true },
    rate: { type: Boolean, default: false },
    carry: { type: Boolean, default: false }, // 是否需要进位
  });
  const emit = defineEmits(['update:value', 'change']);
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const { prefixCls } = useDesign('input-number');
  const innerValue = ref<number | undefined | null>(undefined);

  const getBindValue = computed(() => {
    const bindValue = {
      allowClear: true,
      ...unref(attrs),
      precision: Reflect.has(unref(attrs), 'precision') && (unref(attrs).precision || unref(attrs).precision === 0) ? unref(attrs).precision : undefined,
    };
    if (props.thousands) {
      bindValue.formatter = value => thousandsFormat(value);
      bindValue.parser = value => value.replaceAll(/\$\s?|(,*)/g, '');
    }
    // 如果没有传safe，并且没有设置min 和 max 其中min 和max都不为0，那么就不设置safe
    if (props.safe) {
      if (!unref(attrs).min && unref(attrs).min != 0) {
        bindValue.min = 0;
      }
    }
    if (props.rate) {
      bindValue.min = bindValue.min || 0;
      bindValue.max = bindValue.max || 100;
      bindValue.step = bindValue.step || 0.1;
      bindValue.precision = bindValue.precision || 1;
      // bindValue.formatter = value => `${Number(value).toFixed(1)}%`;
      bindValue.formatter = value => {
        const _value = props.carry ? (value * 100).toFixed(0) : value;
        return `${_value}%`;
      };
      bindValue.parser = value => {
        const _value = props.carry ? (value * 100).toFixed(0) : value;
        return _value.replace('%', '');
      };
    }
    return bindValue;
  });
  const getChineseName = computed(() => (!props.isAmountChinese || (!innerValue.value && innerValue.value !== 0) ? '' : getAmountChinese(innerValue.value)));

  watch(
    () => props.value,
    val => {
      setValue(val);
    },
    { immediate: true },
  );

  function setValue(value) {
    let finalValue;
    if ((!value && value !== 0) || Number.isNaN(value)) {
      finalValue = null;
    } else if (props.detailed) {
      finalValue = value;
    } else {
      finalValue = Number(value);
    }
    innerValue.value = finalValue;
  }
  function onChange(value) {
    emit('update:value', value);
    emit('change', value);
  }

  const inputNumberRef = ref<InstanceType<typeof InputNumber> & { focus: () => void }>();
  /** 获取焦点 */
  function focus() {
    typeof inputNumberRef.value?.focus === 'function' && inputNumberRef.value.focus();
  }

  defineExpose({
    focus,
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-input-number';
  .@{prefix-cls} {
    .amount-chinese-name {
      font-size: 14px;
      line-height: 20px;
      margin-top: 4px;
      color: @text-color-secondary;
    }
  }

  .ant-table {
    .@{prefix-cls} {
      .leading-32px {
        line-height: 22px !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
