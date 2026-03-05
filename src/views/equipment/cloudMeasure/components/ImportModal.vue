<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.template')"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    class="lydc-import-modal">
    <div class="import-main" v-show="activeStep == 0">
      <div class="upload">
        <div class="up_left">
          <img src="../../../../assets/images/upload.png" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('common.uploadReportTemplateExcel') }}</p>
          <p class="tip">{{ t('common.fileSuffixMustBeXlsXlsxOrXlsm') }}</p>
          <a-upload
            v-feature
            v-model:file-list="fileList"
            class="upload-area"
            accept=".xls,.xlsx,.xlsm"
            :max-count="1"
            :action="getData"
            :headers="getHeaders"
            @remove="handleFileRemove"
            @change="handleFileChange">
            <a-button type="link">{{ t('common.importTemplate') }}</a-button>
          </a-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="../../../../assets/images/import.png" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('component.batchImport.fillTheImportData') }}</p>
          <p class="tip">{{ t('component.batchImport.prepareDataAccordingToTemplateFormat') }}</p>
          <a-button type="link" @click="handleTemplateDownload()">{{ t('common.exportTemplate') }}</a-button>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { exportTemplate } from '../../../../api/equipment/cloudMeasure';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';

  interface State {
    activeStep: number;
    fileName: string;
    fileList: UploadFile[];
    btnLoading: boolean;
    list: any[];
    result: any;
    resultList: any[];
  }
  const emit = defineEmits(['register', 'reload']);
  const [registerModal] = useModalInner(init);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const globSetting = useGlobSetting();
  const state = reactive<State>({
    activeStep: 0,
    fileName: '',
    fileList: [],
    btnLoading: false,
    list: [],
    result: {},
    resultList: [],
  });
  const { activeStep, fileList } = toRefs(state);
  const getData = computed(() => globSetting.apiUrl + `/api/Equipment/CloudMeasure/importTemplate`);
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  function init() {
    state.activeStep = 0;
    state.fileName = '';
    state.fileList = [];
    state.btnLoading = false;
  }

  function handleFileChange({ file }: UploadChangeParam) {
    if (file.status === 'error') {
      createMessage.error('上传失败');
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 200) {
        state.fileName = file.response.data.name;
      } else {
        createMessage.error(file.response.msg);
      }
    }
  }

  function handleFileRemove(file) {
    return new Promise<void>((resolve, reject) => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: `确定移除${file.name}?`,
        onOk: () => {
          state.fileName = '';
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }
  function handleTemplateDownload() {
    exportTemplate('FAI Template.xlsm').then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }
</script>
