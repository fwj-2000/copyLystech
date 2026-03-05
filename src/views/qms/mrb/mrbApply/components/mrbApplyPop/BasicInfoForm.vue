<template>
  <BasicForm @register="registerForm">
    <template #file="data">
      <div>
        <div class="w-[65%]">
          <UploadItem v-model:file-list="state.fileList"></UploadItem>
        </div>
      </div>
    </template>
    <template #insidePartNumber="{ values }">
      <a-auto-complete v-model:value="values.insidePartNumber" :options="state.materialList" style="width: 100%" @change="debounceSearchMaterial" />
    </template>
  </BasicForm>
</template>
<script setup lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref, reactive, onMounted, watch } from 'vue';
  import { BASICINFO_FORMCONFIG } from './config';
  import UploadItem from './UploadItem.vue';
  import { useDebounceFn } from '@vueuse/core';
  import { getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';

  type TFileInfo = {
    [key: string]: string;
  };
  type TState = {
    id: string;
    url: string;
    fileList: any[];
    allFiles: any[];
    attachmentList: any[];
    materialList: any[];
  };
  const [registerForm, formApi] = useForm(BASICINFO_FORMCONFIG);
  const state = reactive<TState>({
    id: '',
    url: '',
    fileList: [],
    allFiles: [],
    attachmentList: [],
    materialList: [],
  });

  const isViewModel = ref(false);

  watch(
    () => state.fileList,
    fileList => {
      if (!fileList.length) {
        formApi.setFieldsValue({
          attachmentList: [],
        });
        return;
      }
      const _fileList = fileList.map(item => {
        return { attachmentUrl: item.fullPath, attachmentName: item.originFileName };
      });

      formApi.setFieldsValue({
        attachmentList: _fileList,
      });
    },
  );

  function initFn({ tableData, id, mode }) {
    if (mode === 'view') {
      formApi.setProps({
        disabled: true,
      });
      isViewModel.value = true;
    }
    if (!tableData) return;
    state.id = id;
    const { notifiedPersons, attachmentList } = tableData;
    if (notifiedPersons) {
      tableData.notifiedPersons = notifiedPersons.split(',');
    }
    state.attachmentList = attachmentList;
    if (attachmentList?.length) {
      const _fileList: TFileInfo[] = [];
      attachmentList.forEach(item => {
        _fileList.push({
          fullPath: item.attachmentUrl,
          originFileName: item.attachmentName,
          name: item.attachmentName,
        });
      });
      state.fileList = _fileList;
    }

    formApi.setFieldsValue(tableData);
    formApi.clearValidate();
  }

  const debounceSearchMaterial = useDebounceFn(getInnermaterialnumberlistFn, 300);

  async function getInnermaterialnumberlistFn(searchKey: string | number | null = ''): Promise<void> {
    try {
      const { data, code } = await getInnermaterialnumberlist({ searchKey });
      if (code == 200) {
        state.materialList = data.map(item => {
          return {
            value: item.code,
            label: item.name,
          };
        });
      }
      formApi.setFieldsValue({ insidePartNumber: searchKey });
    } catch (err) {
      console.error(err);
    }
  }

  async function getParamsFn(type) {
    const validateFlag = await formApi.validate();
    if (!validateFlag && type) return false;
    return formApi.getFieldsValue();
  }
  onMounted(() => {});

  defineExpose({
    getParamsFn,
    initFn,
    formApi,
  });
</script>
