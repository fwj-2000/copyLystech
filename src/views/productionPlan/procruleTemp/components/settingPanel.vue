<template>
  <Subtitle title="表单设置：" />
  <div class="setting-item">
    <span>是否禁用：</span>
    <a-select v-model:value="isDisabled" placeholder="请选择类型" style="width: 100%; min-width: 140px" @change="updateValue('isDisabled', $event)">
      <a-select-option :value="1">是</a-select-option>
      <a-select-option :value="0">否</a-select-option>
    </a-select>
  </div>

  <div class="setting-item">
    <span>是否必填：</span>
    <a-select v-model:value="isRequired" placeholder="请选择类型" style="width: 100%" @change="updateValue('isRequired', $event)">
      <a-select-option :value="1">是</a-select-option>
      <a-select-option :value="0">否</a-select-option>
    </a-select>
  </div>

  <div class="setting-item">
    <span>表单显示：</span>
    <a-select v-model:value="isShowForm" placeholder="请选择类型" style="width: 100%" @change="updateValue('isShowForm', $event)">
      <a-select-option :value="1">是</a-select-option>
      <a-select-option :value="0">否</a-select-option>
    </a-select>
  </div>

  <div class="setting-item">
    <span>表格显示：</span>
    <a-select v-model:value="isShowTable" placeholder="请选择类型" style="width: 100%" @change="updateValue('isShowTable', $event)">
      <a-select-option :value="1">是</a-select-option>
      <a-select-option :value="0">否</a-select-option>
    </a-select>
  </div>
</template>
<script setup lang="ts">
  import { toRefs } from 'vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';

  const props = defineProps({
    isDisabled: String || Number,
    isRequired: String || Number,
    isShowForm: String || Number,
    isShowTable: String || Number,
  });

  let { isDisabled, isRequired, isShowForm, isShowTable } = toRefs(props);

  const emit = defineEmits(['update:isDisabled', 'update:isRequired', 'update:isShowForm', 'update:isShowTable']);
  function updateValue(key, value) {
    const str: any = `update:${key}`;
    emit(str, value);
  }
  //   const isDisabled = defineModel({
  //     type: String,
  //     default: '0',
  //   });
  //   const isRequired = defineModel({
  //     type: String,
  //     default: '0',
  //   });
  //   const isShowForm = defineModel({
  //     type: String,
  //     default: '1',
  //   });
  //   const isShowTable = defineModel({
  //     type: String,
  //     default: '1',
  //   });
</script>
