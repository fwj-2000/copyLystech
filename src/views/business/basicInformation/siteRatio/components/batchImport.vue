<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.submitText')"
    :title="title"
    destroyOnClose
    class="full-popup pb-10px">
    <div class="basic-form-container">
      <Subtitle :title="t('common.batchImport')" class="mt-8px" />
      <BasicForm @register="registerForm" />
    </div>
    <BatchImport
      :tplInfo="{ title: t('common.batchImport') }"
      :template-api="downloadTemplate"
      :preview-api="uploadExcelFile"
      :beforeUpload="handleBeforeUpload"
      @update="handleAfterImport" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { useBaseStore } from '/@/store/modules/base';
  import { reactive, toRefs, onMounted, ref, h } from 'vue';
  import { importSalesSite, downloadTemplate } from '/@/api/business/siteRatio';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BatchImport } from '/@/components/Import';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Subtitle } from '/@/components/Subtitle';
  import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';

  const { createMessage, notification } = useMessage();
  const baseStore = useBaseStore();

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    tempList: any[];
    BatchCode: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    tempList: [],
    BatchCode: '',
  });

  const mainProcess = ref<string>('');

  const { title } = toRefs(state);

  const [registerPopup, { closePopup }] = usePopupInner(init);

  function init() {
    state.title = t('common.batchImport');
    updateTempList([]);
    state.BatchCode = '';
  }

  const [registerForm, { validate }] = useForm({
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.SalesSiteColumn.mainProcessDesc'),
        component: 'ApiSelect',
        defaultValue: MAIN_PROCESS_ENUM.模切,
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess'),
          showSearch: true,
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
    ],
    labelWidth: 80,
  });

  /**
   * 上传文件前校验表单
   */
  async function handleBeforeUpload(file: File) {
    const data = await validate();

    if (data) {
      mainProcess.value = data.mainProcess;
      return file;
    }

    createMessage.warning(t('dict.SalesSiteColumn.addMainProcessTip'));
    throw new Error(t('dict.SalesSiteColumn.addMainProcessTip'));
  }

  function updateTempList(list: any[]) {
    state.tempList = list;
  }

  async function uploadExcelFile(file: { file: File }) {
    return importSalesSite(file, mainProcess.value).then(res => {
      const errorMsgList = (Array.isArray(res.data) ? res.data : []).filter((item: { number: number; errorMsg: string }) => item.errorMsg);
      if (errorMsgList.length > 0) {
        notification.error({
          key: 'uploadMaterialRatio',
          message: t('component.batchImport.saveFail'),
          description: () => {
            return h(
              'span',
              errorMsgList.map((item: { number: number; errorMsg: string }) => {
                return h('div', `${item.number}：${item.errorMsg}`);
              }),
            );
          },
          duration: 0,
        });
        return new Error(errorMsgList);
      }

      createMessage.success(res?.message || t('component.batchImport.importSuccess'));
      return { data: { list: res.data } };
    });
  }

  function handleAfterImport() {
    closePopup();
    emits('reload');
  }

  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .basic-form-container {
    width: 50vw;
    margin: 16px auto 0;
  }

  ::v-deep(.batch-import) {
    .tpl-card:first-child {
      margin-top: 0;
    }
  }
</style>
