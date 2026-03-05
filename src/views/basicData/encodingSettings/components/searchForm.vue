<template>
  <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="searchFormValue" @finish="onFinish">
    <a-row :gutter="24">
      <a-col :span="6">
        <a-form-item name="Name" label="规则名称">
          <a-input v-model:value="searchFormValue.Name" placeholder="请输入规则名称" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item name="Type" label="规则类型">
          <a-select v-model:value="searchFormValue.Type" placeholder="请选择规则类型">
            <a-select-option v-for="item in typeOption" :value="item.enCode">{{ item.fullName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item name="Version" label="版本号">
          <a-input v-model:value="searchFormValue.Version" placeholder="请输入版本号" />
        </a-form-item>
      </a-col>
      <a-col :span="6" style="text-align: right">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button style="margin: 0 8px" @click="resetForm">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
  import { reactive, ref, defineEmits, defineProps, unref } from 'vue';
  import { FormInstance } from 'ant-design-vue';
  import type { UnwrapRef } from 'vue';

  const emits = defineEmits(['searchAction']);
  const { typeOption } = defineProps(['typeOption']);

  interface SearchFormValueType {
    Name: string;
    Type: string | null;
    Version: string;
  }

  const formRef = ref<FormInstance>();
  const searchFormValue = reactive<UnwrapRef<SearchFormValueType>>({
    Name: '',
    Type: null,
    Version: '',
  });

  const handleSearch = () => {
    const data = formRef.value?.getFieldsValue();
    // 子传父
    emits('searchAction', data);
  };

  const resetForm = () => {
    unref(formRef).resetFields();
    emits('searchAction', {});
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    console.log('formState: ', searchFormValue);
  };
</script>
