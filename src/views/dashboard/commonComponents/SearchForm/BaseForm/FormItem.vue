<!--  -->
<template>
  <div class="flex flex-nowrap">
    <!-- 文本 -->
    <div v-if="props.option?.label" class="flex pl-6px pr-9px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">{{ props.option?.label }}</div>
    <!-- 表单 -->
    <div class="w-[calc(100%+3px)] ml-[-3px]">
      <!-- 输入框 -->
      <template v-if="props.option.type === EFormItemType.INPUT">
        <a-input
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...commonInputAttrs,
            ...props.option.attrs,
          }"
          v-model:value="props.searchFormValue[props.option.key]" />
      </template>
      <!-- 下拉 -->
      <template v-if="props.option.type === EFormItemType.SELECT">
        <a-select
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...getAttrs(props.option.attrs),
          }">
          <a-select-option v-for="(option, oidx) in props.option.options" :key="oidx" :value="option.value">
            {{ option.text }}
          </a-select-option>
        </a-select>
      </template>
      <!-- 树型下拉 -->
      <template v-else-if="props.option.type === EFormItemType.TREE_SELECT">
        <TreeSelect
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...commonTreeSelectAttrs,
            ...props.option.attrs,
          }"
          :treeData="getTreeOptions(props.option.options)"
          :fieldNames="{ label: 'text', value: 'value' }">
        </TreeSelect>
      </template>
      <!-- 开关 -->
      <template v-else-if="props.option.type === EFormItemType.RADIO_GROUP">
        <a-radio-group
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...props.option.attrs,
          }">
          <a-radio-button v-for="(option, oidx) in props.option.options" :key="oidx" :value="option.value"> {{ option.text }}</a-radio-button>
        </a-radio-group>
      </template>
      <!-- 范围选择 -->
      <template v-else-if="props.option.type === EFormItemType.RANGE_PICKER">
        <a-range-picker
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...getRangePickerAttrs(props.option),
          }" />
      </template>
      <!--日期选择 -->
      <template v-else-if="props.option.type === EFormItemType.DATE_PICKER">
        <a-date-picker
          v-if="props.option?.pickerKey"
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...(props.option.attrs ?? {}),
          }"
          :picker="props.searchFormValue[props.option?.pickerKey] ?? 'week'" />
        <a-date-picker
          v-else
          v-model:value="props.searchFormValue[props.option.key]"
          v-bind="{
            ...(props.commonAttrs ?? {}),
            ...props.option.attrs,
          }" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { commonSelectAttrs, commonTreeSelectAttrs, commonRangePickerAttrs, commonMultiSelectAttrs, commonInputAttrs } from './config';

  import { TreeSelect } from 'ant-design-vue';
  import { EFormItemType, ITreeSelectOption, TFormItemOption } from '../types';
  import { buildTree } from '../utils';

  interface IProps {
    searchFormValue: Record<string, any>;
    commonAttrs?: Record<string, any>;
    option: TFormItemOption;
  }
  const props = withDefaults(defineProps<IProps>(), {
    formOptions: () => [],
    searchFormValue: () => ({}),
    commonAttrs: () => ({}),
  });

  // 获取单选多选下拉属性
  const getAttrs = (attrs: any = {}) => {
    const { mode = 'single' } = attrs;
    return {
      ...(mode === 'single' ? commonSelectAttrs : commonMultiSelectAttrs),
      ...attrs,
    };
  };
  // 获取范围选择属性
  const getRangePickerAttrs = ({ pickerKey, attrs }: any) => {
    return {
      picker: props.searchFormValue[pickerKey] ?? 'week',
      ...commonRangePickerAttrs,
      ...attrs,
    };
  };
  // 获取树型下拉配置
  const getTreeOptions = (options: ITreeSelectOption[]) => {
    const res = buildTree(options);
    return res;
  };
</script>
