<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :okButtonProps="okBtnProps"
    :title="title"
    destroyOnClose
    class="full-popup p-10px"
    :close-func="beforeClose"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <template #insertToolbar>
      <a-upload v-feature v-if="isShowUploadExeclData" v-bind="uploadOptions">
        <a-button :loading="continueUploading" type="primary">{{ t('common.continueUpload') }}</a-button>
      </a-upload>
    </template>
    <uploadExcelData v-if="isShowUploadExeclData" :list="state.tempList" :loading="continueUploading" @update:list="updateTempList" />

    <template v-else>
      <div class="basic-form-container">
        <Subtitle :title="t('common.batchImport')" class="mt-8px" />
        <BasicForm @register="registerForm" />
      </div>
      <BatchImport
        :tplInfo="{ title: t('common.batchImport') }"
        :template-api="downloadSalesForecastDrawingTemplate"
        :preview-api="uploadExcelFile"
        :beforeUpload="handleBeforeUpload"
        @update="updateExcelInfo" />
    </template>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { useBaseStore } from '/@/store/modules/base';
  import { reactive, toRefs, onMounted, computed, ref } from 'vue';
  import { importSalesForecast, downloadSalesForecastDrawingTemplate, temporarySaveSalesForecast } from '/@/api/business/salesForecast';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BatchImport } from '/@/components/Import';
  import uploadExcelData from './uploadExcelData.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Subtitle } from '/@/components/Subtitle';
  import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';

  const { createMessage, createConfirm } = useMessage();
  const baseStore = useBaseStore();

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    tempList: any[];
    mainProcess: '';
    batchCode: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    tempList: [],
    mainProcess: '',
    batchCode: '',
  });

  const okBtnProps = computed(() => ({
    disabled: state.tempList.length === 0,
  }));

  const { title } = toRefs(state);

  const continueUploading = ref<boolean>(false);
  const uploadOptions = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest,
    beforeUpload: handleBeforeUpload,
  };

  const isShowUploadExeclData = computed(() => {
    return state.tempList.length > 0;
  });

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  function init() {
    state.title = t('common.batchImport');
    updateTempList([]);
  }

  function updateExcelInfo(_: string, list: Array<any>) {
    updateTempList(list);
  }

  const handleVisibleChange = v => {
    if (!v) {
      state.batchCode = '';
    }
  };

  const handleSave = async () => {
    const dataList = state.tempList.filter(item => !item.errorMsg);
    if (dataList.length === 0) {
      createMessage.warning(t('common.noDataToSave'));
      return;
    }
    changeOkLoading(true);
    return temporarySaveSalesForecast(formatImportDatasKeys(dataList))
      .then(res => {
        changeOkLoading(false);
        createMessage.success(res?.message || t('component.batchImport.saveSuccess'));
        closePopup();
        emits('reload');
      })
      .catch(err => {
        console.log(err, 'err');
      });
  };

  /**
   * @description 格式化数组元素中`importDatas`的key，如将2025-01-WK1、2025-1-WK2统一格式化为`2025-01-WK1`、`2025-01-WK2`
   * @param dataList 待转换数据
   */
  function formatImportDatasKeys(dataList: Array<{ importDatas: { [keys: string]: number | string } }>) {
    return dataList.map(item => {
      const { importDatas } = item || { importDatas: {} };
      const newImportDatas = {};
      for (const key in importDatas) {
        const [year, month, week] = key.split('-');
        const newKey = `${year}-${month.padStart(2, '0')}-${week}`;
        newImportDatas[newKey] = importDatas[key];
      }
      return { ...item, importDatas: newImportDatas };
    });
  }

  //表单提交
  async function handleSubmit() {
    await handleSave();
  }

  const [registerForm, { validate }] = useForm({
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.SalesForecastColumn.mainProcessDesc'),
        component: 'ApiSelect',
        defaultValue: MAIN_PROCESS_ENUM.模切,
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess'),
          showSearch: true,
          // memoInputVal: true,
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          allowClear: false,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'batchCode',
        label: t('dict.SalesForecastColumn.batchCode'),
        component: 'Input',
        defaultValue: '',
      },
    ],
    labelWidth: 80,
    submitFunc: handleSubmit,
  });

  /**
   * 上传文件前校验表单
   */
  async function handleBeforeUpload(file: File) {
    if (isShowUploadExeclData.value) {
      return file;
    }

    const data = await validate();

    if (data) {
      return file;
    }

    createMessage.warning(t('dict.SalesSiteColumn.addMainProcessTip'));
    throw new Error(t('dict.SalesSiteColumn.addMainProcessTip'));
  }

  async function customRequest(info: any) {
    try {
      continueUploading.value = true;
      const r = await uploadExcelFile({ file: info.file });
      state.tempList.push(...(r.data.List || []));
    } catch (e) {
      console.log('customRequest e:', e);
    } finally {
      continueUploading.value = false;
    }
  }

  function updateTempList(list: any[]) {
    state.tempList = list;
  }

  async function uploadExcelFile(file: { file: File }) {
    const { batchCode: dataBatchCode, mainProcess: dataMainProcess } = state.tempList?.[0] || {};
    let mainProcess = dataMainProcess;
    let batchCode = dataBatchCode;
    if (!isShowUploadExeclData.value) {
      const { mainProcess: formMainProcess, batchCode: formBatchCode } = await validate();
      mainProcess = formMainProcess;
      batchCode = formBatchCode;
    }
    return importSalesForecast(file, mainProcess, batchCode).then(res => {
      const List = res.data.list;
      if (!Array.isArray(List) || List.length === 0) {
        return { data: { List: [] } };
      }
      return { data: { List } };
    });
  }

  function beforeClose() {
    const dataList = state.tempList.filter(item => !item.errorMsg);
    return new Promise(resolve => {
      if (dataList.length === 0) {
        resolve(true);
      } else {
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          content: t('dict.SalesForecast.exitWithoutSavingTip'),
          onOk: () => {
            resolve(true);
            return Promise.resolve();
          },
          onCancel: () => {
            resolve(false);
          },
        });
      }
    });
  }

  onMounted(init);
</script>

<style lang="less" scoped>
  .basic-form-container {
    width: 50vw;
    margin: 16px auto 0;
  }

  ::v-deep(.import-container .batch-import) {
    .tpl-card:first-child {
      margin-top: 0;
    }

    .tpl-card div.upload-box {
      padding: 30px 0;
    }
  }
</style>
