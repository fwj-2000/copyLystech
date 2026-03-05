<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.batchImport')"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    :canFullscreen="true"
    class="lydc-import-modal">
    <div class="header-steps">
      <a-steps v-model:current="activeStep" type="navigation" size="small">
        <a-step :title="t('component.upload.uploadFile')" disabled />
        <a-step :title="t('common.dataPreview')" disabled />
        <a-step :title="t('common.importData')" disabled />
      </a-steps>
    </div>
    <div class="import-main" v-show="activeStep == 0">
      <div class="upload">
        <div class="up_left">
          <img src="/@/assets/images/upload.png" />
        </div>
        <div class="up_right">
          <p class="title">{{ t('component.batchImport.uploadCompletedDataSheet') }}</p>
          <p class="tip">{{ t('component.batchImport.fileSizeLimit') }}</p>
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
          <img src="/@/assets/images/import.png" />
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
        <img src="/@/assets/images/success.png" />
        <p class="success-title">{{ t('common.batchImportSuccess') }}</p>
        <p class="success-tip"> {{ t('component.batchImport.successfulImportXData', [result.snum]) }} </p>
      </div>
      <div class="unsuccess" v-if="result.resultType">
        <a-alert :message="t('common.importErrorTip')" type="warning" show-icon />
        <div class="upload error-show">
          <div class="up_left">
            <img src="/@/assets/images/tip.png" />
          </div>
          <div class="up_right">
            <p class="tip success-tip">
              {{ t('component.batchImport.normalDataNum', [result.snum]) }}
            </p>
            <p class="tip error-tip">
              {{ t('component.batchImport.abnormalDataNum', [result.fnum]) }}
            </p>
          </div>
        </div>
        <div class="conTips">
          <p>{{ t('component.batchImport.followingAbnormalData') }}</p>
        </div>
        <a-table :data-source="resultList" :columns="resultColumns" size="small" :pagination="false" :scroll="{ x: 'max-content', y: '205px' }" />
      </div>
    </div>
    <template #insertFooter>
      <a-button @click="handleClose()" v-if="activeStep == 0">{{ t('common.cancelText') }}</a-button>
      <a-button @click="handlePrev" v-if="activeStep === 1">{{ t('common.prev') }}</a-button>
      <a-button type="primary" @click="handleNext" :loading="btnLoading" v-if="activeStep < 2" :disabled="activeStep === 0 && !fileName">
        {{ t('common.next') }}
      </a-button>
      <a-button type="primary" @click="handleClose(true)" v-else>{{ t('common.closeText') }}</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { templateDownload, importEquipmentPreview, importEquipmentData } from '/@/api/equipment/information';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const equipmentType = route.query.equipmentType || 0; // 设备类型

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
    { title: '工厂', dataIndex: 'FactoryArea', key: 'FactoryArea' },
    { title: '设备类型', dataIndex: 'Type', key: 'Type' },
    { title: '设备分类', dataIndex: 'Category', key: 'Category' },
    { title: '设备编码', dataIndex: 'Code', key: 'Code' },
    { title: '固定资产编码', dataIndex: 'AssetCode', key: 'AssetCode' },
    { title: '管制编码', dataIndex: 'customizeCode', key: 'customizeCode' },
    { title: '固定资产名称', dataIndex: 'Name', key: 'Name' },
    { title: '规格型号', dataIndex: 'Specification', key: 'Specification' },
    { title: '机身序列号', dataIndex: 'SerialNumber', key: 'SerialNumber' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '设备制造商', dataIndex: 'SupplierName', key: 'SupplierName' },
    { title: '实物是否存在', dataIndex: 'Exist', key: 'Exist' },
    { title: '使用状态', dataIndex: 'UseStatus', key: 'UseStatus' },
    { title: '异常备注', dataIndex: 'faultReasonName', key: 'faultReasonName' },
    { title: '设备型号', dataIndex: 'EquipmentModel', key: 'EquipmentModel' },
    { title: '物理位置', dataIndex: 'Position', key: 'Position' },
    { title: '使用部门', dataIndex: 'DepartmentId', key: 'DepartmentId' },
    { title: '是否启用', dataIndex: 'Status', key: 'Status' },
    { title: '线体', dataIndex: 'LineInfoName', key: 'LineInfoName' },
    { title: '责任人', dataIndex: 'DutyUserName', key: 'DutyUserName' },
    { title: '是否专用设备', dataIndex: 'UseSpecial', key: 'UseSpecial' },
    { title: '使用年限', dataIndex: 'ServiceLife', key: 'ServiceLife' },
    { title: '到厂时间', dataIndex: 'ArrivalTime', key: 'ArrivalTime', format: 'YYYY-MM-DD HH:mm:ss' },
    { title: '财务折旧', dataIndex: 'Depreciation', key: 'Depreciation' },
    { title: '备注', dataIndex: 'Remark', key: 'Remark' },
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

  const getAction = computed(() => globSetting.apiUrl + '/api/Equipment/ECommon/Uploader');

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
      importEquipmentPreview({ fileName: state.fileName })
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
      importEquipmentData({ Data: state.list, equipmentType: equipmentType })
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
    const isRightSize = file.size / 1024 < 1024;
    if (!isRightSize) createMessage.error(`文件大小不能超过1M`);
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
