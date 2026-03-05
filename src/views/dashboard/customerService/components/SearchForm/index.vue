<!-- 顶部搜索条件组件封装 -->
<template>
  <div class="dashboard-fc-search-header">
    <a-form v-if="!isEmpty(allOptions)" class="search-form flex justify-start flex-wrap gap-2">
      <div class="flex" v-for="(item, idx) in allOptions" :key="idx">
        <!-- 文本 -->
        <div v-if="item.label" class="flex pl-6px pr-9px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">{{ item.label }}</div>
        <!-- 表单 -->
        <div class="ml-[-3px]">
          <a-form-item :name="item.key">
            <!-- 下拉 -->
            <template v-if="item.type === EFormItemType.SELECT">
              <a-select v-model:value="props.searchFormValue[item.key]" v-bind="item.attrs">
                <a-select-option v-for="(option, oidx) in item.options" :key="oidx" :value="option.value">
                  {{ option.text }}
                </a-select-option>
              </a-select>
            </template>
            <!-- 树型下拉 -->
            <template v-else-if="item.type === EFormItemType.TREE_SELECT">
              <TreeSelect v-model:value="props.searchFormValue[item.key]" v-bind="item.attrs" :treeData="item.options"> </TreeSelect>
            </template>
            <!-- 开关 -->
            <template v-else-if="item.type === EFormItemType.RADIO_GROUP">
              <a-radio-group v-model:value="props.searchFormValue[item.key]" v-bind="item.attrs">
                <a-radio-button v-for="(option, oidx) in item.options" :key="oidx" :value="option.value"> {{ option.text }}</a-radio-button>
              </a-radio-group>
            </template>
            <!--日期选择 -->
            <template v-else-if="item.type === EFormItemType.DATE_PICKER">
              <a-date-picker v-model:value="props.searchFormValue[item.key]" :picker="props.searchFormValue[item.pickerKey] ?? 'week'" />
            </template>
          </a-form-item>
        </div>
        <!-- end -->
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { isEmpty } from 'lodash-es';

  import { TreeSelect } from 'ant-design-vue';
  import { EFormItemType, IFormItemOptions } from './types';
  import { isFunction } from '/@/utils/is';

  const props = defineProps({
    searchFormValue: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    searchLoading: {
      type: Boolean,
      required: true,
      default: true,
    },
    options: {
      type: Array<IFormItemOptions>,
      required: true,
      default: () => [],
    },
  });

  const allOptions = ref<any[]>([]);
  const emits = defineEmits(['update:search-loading']);

  const setAllOptions = async () => {
    emits('update:search-loading', true);
    const resultList = await Promise.allSettled(
      props.options.map(item => {
        if (isFunction(item.getOptions)) {
          return item.getOptions();
        }
        return item.options;
      }),
    );
    allOptions.value = resultList.map((item, idx) => {
      if (item.status !== 'rejected') {
        const firstValue = item.value[0]?.value ?? '';
        const { key, attrs, isOverrideDefault = false } = props.options[idx];
        if (attrs?.mode === 'multiple' && isOverrideDefault) {
          props.searchFormValue[key] = [firstValue];
        } else {
          props.searchFormValue[key] = props.searchFormValue[key] || firstValue;
        }
      }
      return {
        ...props.options[idx],
        options: item.status === 'rejected' ? [] : item.value,
      };
    });
    emits('update:search-loading', false);
  };
  setAllOptions();
</script>

<style lang="less" scoped>
  :deep(.ant-form .ant-form-item) {
    margin: 0 12px 0 0;
  }
</style>
