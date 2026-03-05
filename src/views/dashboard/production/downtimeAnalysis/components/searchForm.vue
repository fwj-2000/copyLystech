<template>
  <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="searchFormValue">
    <a-row :gutter="24">
      <a-col :span="4">
        <a-form-item name="factoryName" label="厂区">
          <a-select v-model:value="searchFormValue.factoryName">
            <a-select-option value="1">平湖一厂</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item name="timeDimension" label="时间维度">
          <a-select v-model:value="searchFormValue.timeDimension">
            <a-select-option value="0">天</a-select-option>
            <a-select-option value="1">周</a-select-option>
            <a-select-option value="2">月</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item name="NUD" label="NUD">
          <a-select v-model:value="searchFormValue.NUD">
            <a-select-option value="0">是</a-select-option>
            <a-select-option value="1">否</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item name="time" label="选择时间">
          <a-range-picker v-model:value="searchFormValue.time" :picker="timeSelectType" />
        </a-form-item>
      </a-col>
      <a-col :span="6" style="text-align: right">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
  import { Dayjs } from 'dayjs';
  import { reactive, ref, defineEmits } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { FormInstance } from 'ant-design-vue';

  const emits = defineEmits();

  interface SearchFormValueType {
    time: Dayjs[];
    factoryName: string;
    timeDimension: string;
    NUD: string;
  }

  const timeSelectType = ref<'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'>('time');

  const formRef = ref<FormInstance>();
  const searchFormValue = reactive<UnwrapRef<SearchFormValueType>>({
    time: [],
    factoryName: '1',
    timeDimension: '1',
    NUD: '0',
  });

  const handleSearch = () => {
    // console.log(formRef.value?.getFieldsValue());
    const data = formRef.value?.getFieldsValue();
    // 子传父测试
    emits('searchAction', data);
  };
</script>
