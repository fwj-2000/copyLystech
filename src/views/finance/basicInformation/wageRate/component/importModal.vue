<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="批量导入"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    class="lydc-import-modal">
    <div class="header-steps">
      <a-steps v-model:current="activeStep" type="navigation" size="small">
        <a-step title="上传文件" disabled />
        <a-step title="导入数据" disabled />
      </a-steps>
    </div>
    <div class="import-main" v-show="activeStep == 0">
      <div class="upload">
        <div class="up_left">
          <img src="/@/assets/images/upload.png" />
        </div>
        <div class="up_right">
          <p class="title">上传填好的数据表</p>
          <p class="tip">文件后缀名必须是xls或xlsx，文件大小不超过500KB，最多支持导入1000条数据</p>
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
            <a-button type="link">上传文件</a-button>
          </a-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="/@/assets/images/import.png" />
        </div>
        <div class="up_right">
          <p class="title">填写导入数据信息</p>
          <p class="tip"> 请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</p>
          <a-button type="link" @click="handleTemplateDownload()">下载模板</a-button>
        </div>
      </div>
    </div>
    <div class="import-main" v-show="activeStep == 1">
      <a-table :data-source="list" :columns="columns" size="small" :pagination="false" :scroll="{ x: 'max-content', y: '440px' }" class="import-preview-table">
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.dataIndex === 'errorMsg'">
            <template v-if="record.errorMsg">
              <a-tooltip :title="text">
                <div style="color: #ff4d4f; cursor: pointer">数据错误</div>
              </a-tooltip>
            </template>
            <template v-else>
              <div style="color: #52c41a">正确</div>
            </template>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <template v-if="text == '2'">
              <Badge color="#f50" :text="STATE_MAP[text]" />
            </template>
            <template v-if="text == '1'">
              <Badge color="#87d068" :text="STATE_MAP[text]" />
            </template>
          </template>
          <template v-else-if="column.dataIndex === 'mainProcess'">
            {{ mainProcessList.find(item => item.enCode == text)?.fullName }}
          </template>
        </template>
      </a-table>
    </div>
    <template #insertFooter>
      <a-button @click="handleClose()" v-if="activeStep == 0">{{ t('common.cancelText') }} </a-button>
      <a-button @click="handlePrev" v-if="activeStep === 1">{{ t('common.prev') }}</a-button>
      <a-button type="primary" @click="handleNext" :loading="btnLoading" v-if="activeStep === 1" :disabled="activeStep === 0 && !fileName">
        {{ t('common.next') }}
      </a-button>
      <a-button type="primary" @click="handleClose(true)" v-else>关闭</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { Badge, message, Upload as AUpload } from 'ant-design-vue';
  import { saveBaseDataLaborrate } from '/@/api/purchase/rateOfWork';
  import { downloadBaseDataWagerateImportTemplate, saveBaseDataWagerate } from '/@/api/finance/wageRate';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  interface State {
    activeStep: number;
    fileName: string;
    fileList: UploadFile[];
    btnLoading: boolean;
    list: any[];
    result: any;
    BatchCode: '';
    resultList: any[];
    mainProcessList: [];
  }

  const STATE_MAP = {
    '1': '启用',
    '2': '停用',
  };

  const emit = defineEmits(['register', 'reload']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const tableData = [
    { title: 'excel行号', dataIndex: 'number', width: 150 },
    { title: '数据', dataIndex: 'errorMsg', width: 150 },
    { title: '组织', dataIndex: 'orgName', width: 200 },
    { title: '主要制程', dataIndex: 'mainProcess', width: 160 },
    { title: '基数', dataIndex: 'baseName', width: 120 },
    { title: '直接', dataIndex: 'direct', width: 120 },
    { title: '间接', dataIndex: 'indirect', width: 200 },
    { title: '间/直%(公允)', dataIndex: 'indirectDirect', width: 180 },
    { title: '合计', dataIndex: 'total', width: 180 },
    { title: '系数', dataIndex: 'coefficient', width: 100 },
    { title: '间接总人工', dataIndex: 'indirectManTotal', width: 100 },
    { title: '是否启用', dataIndex: 'status', width: 100 },
    { title: '备注', dataIndex: 'remark', width: 100 },
  ];
  const columns: any[] = [...tableData];

  const errorColumn = {
    title: '异常原因',
    dataIndex: 'errorsInfo',
    align: 'center',
    width: 150,
    fixed: 'right',
  };
  const resultColumns: any[] = [
    {
      width: 50,
      title: '序号',
      align: 'center',
      customRender: ({ index }) => index + 1,
    },
    ...tableData,
    errorColumn,
  ];
  const globSetting = useGlobSetting();
  const state = reactive<State>({
    activeStep: 0,
    fileName: '',
    fileList: [],
    btnLoading: false,
    list: [],
    result: {},
    resultList: [],
    mainProcessList: [],
  });
  const { activeStep, fileName, fileList, btnLoading, list, result, resultList, mainProcessList } = toRefs(state);

  const getAction = computed(() => globSetting.apiUrl + '/api/BaseData/wagerate/import');
  const getHeaders = computed(() => ({
    Authorization: getToken() as string,
    'lydc-origin': 'pc',
  }));

  function init() {
    state.activeStep = 0;
    state.fileName = '';
    state.fileList = [];
    state.btnLoading = false;
    getTypeOps();
  }

  function handlePrev() {
    if (state.activeStep == 0) return;
    state.activeStep -= 1;
  }

  function handleNext() {
    if (state.activeStep == 1) {
      if (!state.BatchCode) return message.error('excel数据导入失败，请确认数据是否正确');
      if (!state.list.length) return createMessage.warning('导入数据为空');
      state.btnLoading = true;
      saveBaseDataWagerate(state.BatchCode)
        .then(res => {
          const { data, msg } = res;
          state.result = data;
          state.btnLoading = false;
          message.success(msg);
          return handleClose(true);
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
        const { list, batchCode } = file.response.data;
        state.list = list;
        state.BatchCode = batchCode;
        activeStep.value = 1;
      } else {
        createMessage.error(file.response.msg);
      }
    }
    state.btnLoading = false;
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
    downloadBaseDataWagerateImportTemplate().then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }

  // function handleExportExceptionData() {
  //   exportExceptionData({ list: state.resultList }).then(res => {
  //     downloadByUrl({ url: res.data?.url });
  //   });
  // }

  function handleDelItem(index) {
    state.list.splice(index, 1);
  }

  function handleClose(reload = false) {
    closeModal();
    if (reload) emit('reload');
  }

  async function getTypeOps() {
    state.mainProcessList = await baseStore.getDictionaryData('MainProcess');
  }
</script>

<style lang="less" scoped>
  .epic-tooltip {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
