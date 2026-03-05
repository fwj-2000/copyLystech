<template>
  <BasicForm @register="registerForm" v-loading="isLoading">
    <template #file="data">
      <div>
        <div class="w-[65%]">
          <UploadItem v-model:file-list="state.fileList" :uploadParams="{ maxCount: 1 }"></UploadItem>
        </div>
      </div>
    </template>
  </BasicForm>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { packagingTestsFromSchemas } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getApplyordertestitem, savePackage } from '/@/api/qms/iqc';
  import UploadItem from '/@/views/qms/mrb/mrbApply/components/mrbApplyPop/UploadItem.vue';
  import { isEmpty } from '/@/utils/is';

  type TState = {
    id: string;
    fileList: any[];
  };
  // 获取清单数据的参数
  const props = withDefaults(
    defineProps<{
      params?: {
        [key: string]: any;
      };
    }>(),
    {
      params: () => ({}),
    },
  );
  const state = reactive<TState>({
    id: '',
    fileList: [],
  });
  const isLoading = ref(false);
  let lastDataJson = '';
  let curDataJson = '';
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerForm, formApi] = useForm({
    layout: 'vertical',
    schemas: packagingTestsFromSchemas,
    labelWidth: 500,
    labelAlign: 'left',
    baseColProps: { span: 12 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    // submitFunc: handleSubmit,
    i18nConfig: {
      moduleCode: 'IQCApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  function getParamsFn() {
    return formApi.getFieldsValue();
  }

  async function getApplyordertestitemFn() {
    const { code, data } = await getApplyordertestitem(props.params);
    if (code === 200) {
      if (!data) return;
      const _fileList: any = [];
      const { attachmentPath, attachmentName } = data;
      if (attachmentPath && attachmentName) {
        _fileList.push({
          fullPath: data.attachmentPath,
          originFileName: data.attachmentName,
          name: data.attachmentName,
        });
        state.fileList = _fileList;
      }
      if (data.packageQualified) {
        data.packageQualified = String(data.packageQualified);
      }
      if (data.qualifiedSupplier) {
        data.qualifiedSupplier = String(data.qualifiedSupplier);
      }
      if (data.quantityEqual) {
        data.quantityEqual = String(data.quantityEqual);
      }
      formApi.setFieldsValue(data);
      setTimeout(() => {
        lastDataJson = JSON.stringify(getParamsFn());
      }, 300);
    }
  }

  function initSaveStatus() {
    lastDataJson = curDataJson = JSON.stringify(getParamsFn());
  }
  async function submitFn() {
    const result = await formApi.validate();
    if (!result) return;
    const { code, applyId } = props.params;
    const fileObj = {
      attachmentPath: '',
      attachmentName: '',
    };
    if (state.fileList.length) {
      fileObj.attachmentPath = state.fileList[0].fullPath;
      fileObj.attachmentName = state.fileList[0].originFileName;
    }
    const reqParams = {
      applyId,
      testProjectCode: code,
      ...formApi.getFieldsValue(),
      ...fileObj,
    };
    return await savePackageFn(reqParams);
  }
  async function savePackageFn(params) {
    isLoading.value = true;
    try {
      const { code, msg } = await savePackage(params);
      if (code === 200) {
        createMessage.success(msg);
        initSaveStatus();
        return true;
      } else {
        // createMessage.error(msg);
      }
    } catch (error) {
      createMessage.error(String(error));
    } finally {
      isLoading.value = false;
    }
  }

  function checkUnsavedDataFn(): Promise<boolean> {
    return new Promise(resolve => {
      const diffData = getParamsFn();
      if (!isEmpty(diffData)) {
        curDataJson = JSON.stringify(diffData);
      }
      if (lastDataJson === curDataJson) {
        return resolve(true);
      }
      createConfirm({
        iconType: 'warning',
        title: t('common.saveTips'),
        onOk: async () => {
          const flag: boolean = (await submitFn()) ?? false;
          resolve(flag);
        },
        onCancel: () => {
          resolve(true);
        },
      });
    });
  }

  onMounted(() => {
    getApplyordertestitemFn();
  });

  defineExpose({
    submitFn, // 提交函数
    checkUnsavedDataFn, // 检查未保存
    getParamsFn,
    // reloadFn,
    formApi,
  });
</script>
