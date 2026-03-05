<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.batchImport')"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    class="lydc-import-modal">
    <div class="header-steps">
      <a-steps v-model:current="activeStep" type="navigation" size="small">
        <a-step :title="t('component.upload.uploadFile')" disabled />
        <a-step :title="t(['component.batchImport.data', 'common.previewText'])" disabled />
        <a-step :title="t(['common.importText', 'component.batchImport.data'])" disabled />
      </a-steps>
    </div>
    <div class="import-main" v-show="activeStep == 0">
      <div class="upload">
        <div class="up_left">
          <img src="../../../../../assets/images/upload.png" alt="" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('component.batchImport.uploadCompletedDataSheet') }}</p>
          <p class="tip"
            >{{ t('component.batchImport.fileExtensionMustBe') }}xls、xlsx，{{ t('component.batchImport.fileSizeNotMoreThan') }} 500KB，{{
              t('component.batchImport.upportsUpToXPiecesOfData', [1000])
            }}</p
          >
          <a-upload
            v-feature
            v-model:file-list="fileList"
            class="upload-area"
            accept=".xls,.xlsx"
            :max-count="1"
            :action="getAction"
            :headers="getHeaders"
            :before-upload="beforeUpload"
            @remove="handleFileRemove"
            @change="handleFileChange">
            <a-button type="link">{{ t('component.upload.uploadFile') }}</a-button>
          </a-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="../../../../../assets/images/import.png" alt="" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('component.batchImport.fillTheImportData') }}</p>
          <p class="tip">{{ t('component.batchImport.prepareDataAccordingToTemplateFormat') }}</p>
          <a-button type="link" @click="handleTemplateDownload()">{{ t('common.exportTemplate') }}</a-button>
        </div>
      </div>
    </div>
    <div class="import-main" v-show="activeStep == 1">
      <a-table :data-source="list" :columns="columns" size="small" :pagination="false" :scroll="{ x: 'max-content', y: '440px' }" class="import-preview-table">
        <template #bodyCell="{ column, record, index }">
          <template v-for="item in tableData">
            <template v-if="column.key === item.key">
              <a-input v-model:value="record[column.key]" />
            </template>
          </template>
          <template v-if="column.key === 'action'">
            <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index)" size="small">{{ t('common.delText') }}</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <div class="import-main" v-show="activeStep == 2">
      <div class="success" v-if="!result.resultType">
        <img src="../../../../../assets/images/success.png" alt="" />
        <p class="success-title">{{ t(['common.batchImport', 'common.successText']) }}</p>
        <p class="success-tip">{{ t('component.batchImport.successfulImportXData', [result.snum]) }}</p>
      </div>
      <div class="unsuccess" v-if="result.resultType">
        <a-alert :message="t('component.batchImport.importFailedDataDisplay')" type="warning" show-icon />
        <div class="upload error-show">
          <div class="up_left">
            <img src="../../../../../assets/images/tip.png" alt="" />
          </div>
          <div class="up_right">
            <p class="tip success-tip">
              {{ t(['common.normalText', 'component.batchImport.data']) }}: <span>{{ result.snum }}</span>
            </p>
            <p class="tip error-tip">
              {{ t('component.batchImport.abnormal', 'component.batchImport.data') }}: <span>{{ result.fnum }}</span>
            </p>
          </div>
        </div>
        <div class="conTips">
          <p>{{ t('component.batchImport.followingAbnormalData') }}</p>
        </div>
        <a-table
          :data-source="resultList"
          :columns="transformI18nBasicTable(resultColumns, 'CustomerColumn')"
          size="small"
          :pagination="false"
          :scroll="{ x: 'max-content', y: '205px' }" />
      </div>
    </div>
    <template #insertFooter>
      <a-button @click="handleClose()" v-if="activeStep == 0">{{ t('common.cancelText') }}</a-button>
      <a-button @click="handlePrev" v-if="activeStep === 1">{{ t('common.prev') }}</a-button>
      <a-button type="primary" @click="handleNext" :loading="btnLoading" v-if="activeStep < 2" :disabled="activeStep === 0 && !fileName">
        {{ t('common.next') }}
      </a-button>
      <a-button type="primary" @click="handleClose(true)" v-else>关闭</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { templateDownload, importLineInfoPreview, importLineInfoData } from '/@/api/productionDeal/lineInfo';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { transformI18nBasicTable } from '/@/utils';

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
  const [registerModal, { closeModal }] = useModalInner(init);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const tableData = [
    { title: '导入错误信息', dataIndex: 'ImportError', key: 'ImportError', width: 70 },
    { title: '线体编码', dataIndex: 'LineCode', key: 'LineCode', width: 50 },
    { title: '线体名称', dataIndex: 'LineName', key: 'LineName', width: 50 },
    { title: '是否启用', dataIndex: 'StatusName', key: 'StatusName', width: 50 },
    { title: '备注', dataIndex: 'Remark', key: 'Remark', width: 50 },
  ];
  const columns: any[] = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    ...tableData,
    { title: '操作', dataIndex: 'action', key: 'action', width: 50, fixed: 'right' },
  ];
  const resultColumns: any[] = [{ width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 }, ...tableData];
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
  const { activeStep, fileName, fileList, btnLoading, list, result, resultList } = toRefs(state);

  const getAction = computed(() => globSetting.apiUrl + '/api/extend/Employee/Uploader');
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  function init() {
    state.activeStep = 0;
    state.fileName = '';
    state.fileList = [];
    state.btnLoading = false;
  }
  function handlePrev() {
    if (state.activeStep == 0) return;
    state.activeStep -= 1;
  }
  function handleNext() {
    if (state.activeStep == 0) {
      if (!state.fileList.length || !state.fileName) return createMessage.warning('请先上传文件');
      state.btnLoading = true;
      importLineInfoPreview({ fileName: state.fileName })
        .then(res => {
          state.list = res.data.dataRow || [];
          state.btnLoading = false;
          state.activeStep += 1;
        })
        .catch(() => {
          state.btnLoading = false;
        });
      return;
    }
    if (state.activeStep == 1) {
      if (!state.list.length) return createMessage.warning('导入数据为空');
      state.btnLoading = true;
      importLineInfoData({ Data: state.list })
        .then(res => {
          state.result = res.data;
          state.resultList = res.data.failResult;
          state.btnLoading = false;
          state.activeStep += 1;
        })
        .catch(() => {
          state.btnLoading = false;
        });
    }
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
  function beforeUpload(file) {
    const isRightSize = file.size / 1024 < 500;
    if (!isRightSize) createMessage.error(`文件大小不能超过500KB`);
    return isRightSize;
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
    templateDownload().then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }
  function handleDelItem(index) {
    state.list.splice(index, 1);
  }
  function handleClose(reload = false) {
    closeModal();
    if (reload) emit('reload');
  }
</script>
