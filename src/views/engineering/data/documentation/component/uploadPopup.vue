<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :ok-text="t('dict.Flow.NodeAction.1')"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-upload v-feature name="fileList" :showUploadList="false" :multiple="true" :beforeUpload="handleBeforeUpload">
        <a-button class="ml-12px" type="primary" ghost :loading="uploadLoading">
          <!-- <upload-outlined style="transform: translateY(-3px)"></upload-outlined> -->
          {{ t('common.upFiles') }}
        </a-button>
      </a-upload>
    </template>
    <div style="height: 400px">
      <div class="warp">
        <div class="warp-left pl-12px">
          <Subtitle :title="t('routes.engineering-data-documentation')" />
        </div>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'version'"> T{{ record[column.dataIndex] }} </template>
            <template v-else-if="column.dataIndex === 'FactoryCode'">
              <ApiSelect
                v-model:value="record.FactoryCode"
                :api="getPartNumberFactoryList"
                :show-search="true"
                :api-search="{
                  show: true,
                  searchName: 'factoryCode',
                }"
                :params="{
                  partNumber: record.insidePartNumber,
                  partNumberType: state.engineeringType === '1' ? 1 : 2,
                }"
                result-field="data"
                value-field="Code"
                label-field="Name"
                :filter-option="false"
                :not-found-content="null"
                :immediate="true"
                :nameFormat="['Name', '/', 'Code']"
                :default-label="record.FactoryName"
                @change="(value, option) => handleChangeFactory(value, option, record)" />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record, index)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <ECNConfirmModal @register="registerConfirmEcn" @submit="handleConfirmEcn" @close="closePopup" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, ActionItem, TableAction } from '/@/components/Table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { UPLOAD_POP_COLUMNS } from '../config';
  import {
    engineeringDocApply,
    saveEngineeringdocapply,
    reUpload,
    updateEngineeringDoc,
    createSemiFinishedProducts,
    semiFinishedProductsReUpload,
  } from '/@/api/engineering/engineeringReview';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ECNConfirmModal from './ECNConfirmModal.vue';
  import { useModal } from '/@/components/Modal';
  import { pick } from 'lodash-es';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getPartNumberFactoryList } from '/@/api/basicData/factory';

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const { createMessage, createConfirm } = useMessage();

  interface State {
    // fileList: UploadProps['fileList'];
    fileList: any;
    /** 是否为重新上传 */
    isReUpload: boolean;
    /** 上传资料类型：1 是成品  3 是半成品 */
    engineeringType: '' | '1' | '3';
  }
  const state = reactive<State>({
    fileList: [],
    isReUpload: false,
    engineeringType: '',
  });
  // const getHeaders = computed(() => ({ Authorization: getToken() as string, ContentType: ContentTypeEnum.FORM_DATA }));
  // const getActions = computed(() => globSetting.apiUrl + '/api/Information/engineeringdocapply');

  const title = computed(() => {
    if (state.engineeringType === '1') {
      return t('dict.PCC.uploadFinishedProduct');
    }
    if (state.engineeringType === '3') {
      return t('dict.PCC.uploadSemiFinishedProduct');
    }
    return t('component.upload.batchUpload');
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerConfirmEcn, { openModal: openConfirmEcn }] = useModal();
  const [registerTable, { setTableData }] = useTable({
    // api: getMoldapplyDetail,
    // title: '',
    columns: UPLOAD_POP_COLUMNS,
    rowKey: 'id',
    // isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      // schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
      baseColProps: { span: 5 },
      actionColOptions: {
        span: 5,
      },
    },
    striped: true,
    useSearchForm: false, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    showIndexColumn: false, //显示序号
    pagination: false,
    actionColumn: {
      width: 90,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
  });

  function getTableActions(_record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, index),
      },
    ];
  }

  /**
   * 成品资料(`state.engineeringType === '1'`)上传时，校验成品料号倒数第二.三位，是FV、EV、BU时，弹窗提醒：“请受控包装POP、手工SOP、模切SOP、对比图”，点击确认后资料才能继续上传
   * @param dataList 数据列表
   * @returns 是否通过校验，返回`true`为通过，`false`为不通过
   */
  function checkFinishedProduct(dataList: Array<{ insidePartNumber: string }>) {
    return new Promise<boolean>(resolve => {
      // 不是成品，直接通过
      if (state.engineeringType !== '1') return resolve(true);
      // 校验传入数据是否正确
      if (!Array.isArray(dataList) || dataList.length === 0) return resolve(false);
      const tipFragments = ['FV', 'EV', 'BU'];
      if (dataList.some(item => tipFragments.includes(item.insidePartNumber.slice(-3, -1)))) {
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          content: t('dict.PCC.uploadFinishedProductcheckTip'),
          width: 435,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      } else {
        resolve(true);
      }
    });
  }

  /** 提交 */
  async function handleSubmit() {
    changeLoading(true);
    let _list: any = [];
    for (let i = 0; i < state.fileList.length; i++) {
      const item = state.fileList[i];
      if (item.result !== '正确') {
        changeLoading(false);
        // 状态错误项不允许提交!
        return createMessage.warning(t('common.statusErrorItemNotAllowedSubmitted'));
      }
      if (!item.FactoryCode) {
        changeLoading(false);
        // 工厂校验
        return createMessage.warning(t('common.requiredFactory'));
      }
      _list.push({
        filePath: item.filePath,
        fileName: item.fileName,
        insidePartNumber: item.insidePartNumber,
        docTypeEnum: item.docTypeEnum,
        version: item.version,
        FactoryCode: item.FactoryCode,
        EngineeringType: state.engineeringType,
      });
    }
    if (_list.length === 0 || !(await checkFinishedProduct(_list))) return changeLoading(false);

    if (state.isReUpload) {
      // 重新上传提交处理
      return handleSubmitReUpload();
    }

    try {
      const { data, code, msg } = await saveEngineeringdocapply(_list);
      if (code === 200) {
        changeLoading(false);
        createMessage.success(msg);
        emits('reload');
        // 弹出工程资料维护ECN确认
        const ecnList = Array.isArray(data) ? data.filter(item => item.version) : [];
        if (ecnList.length) {
          openConfirmEcn(true, ecnList);
        } else {
          closePopup();
        }
      }
    } catch (error) {
      console.error('🚀 ~ uploadPopup.vue:211 ~ handleSubmit ~ error:', error);
      changeLoading(false);
    }
  }

  /** 提交重新上传 */
  async function handleSubmitReUpload() {
    changeLoading(true);
    return updateEngineeringDoc(state.fileList.map((item: any) => pick(item, ['id', 'filePath', 'fileName', 'FactoryCode'])))
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        const ecnList = Array.isArray(res?.data) ? res.data.filter(item => item.version) : [];
        if (ecnList.length) {
          openConfirmEcn(true, ecnList);
        } else {
          closePopup();
        }
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  const uploadLoading = ref<boolean>(false);
  function handleBeforeUpload(file, fileList) {
    if (state.isReUpload) {
      return handleBeforeReUpload(file, fileList);
    }

    console.log(file);
    console.log(fileList);

    // 判断是否已存在相同的`工程资料`文件
    const targetFileName = file.name.split('.')[0];
    if (state.fileList.some(item => item.fileName && item.fileName.split('.')[0] === targetFileName)) {
      createMessage.warning(t('dict.PCC.fileNameAlreadyExists', [targetFileName]));
      return false;
    }

    const fileParams = new FormData();
    fileParams.append('fileList', file);

    const api = state.engineeringType === '3' ? createSemiFinishedProducts : engineeringDocApply;

    uploadLoading.value = true;
    api(fileParams)
      .then(({ code, data }) => {
        console.log(data);
        if (code === 200) {
          state.fileList = state.fileList?.concat(data);
          setTableData(state.fileList);
        }
      })
      .finally(() => {
        uploadLoading.value = false;
      });
    return false;
  }

  /** 重新上传处理 */
  function handleBeforeReUpload(file: File, _fileList?: Array<File>) {
    const formData = new FormData();
    formData.append(
      'ids',
      state.fileList.map((item: any) => item.id),
    );
    formData.append('fileList', file);
    const api = state.engineeringType === '3' ? semiFinishedProductsReUpload : reUpload;

    uploadLoading.value = true;
    api(formData)
      .then(res => {
        Array.isArray(res.data) &&
          res.data.forEach((item: any) => {
            const index = state.fileList.findIndex((fileItem: any) => fileItem.id === item.id && +item.isUpdate === 1);
            if (index !== -1) {
              state.fileList[index] = item;
            }
          });
      })
      .finally(() => {
        uploadLoading.value = false;
      });
    return false;
  }

  // function handleFileChange({ file, fileList, event }) {
  //   if (file.status === 'done' && file.response) {
  //     const { data } = file.response;
  //     state.fileList = state.fileList?.concat(data);
  //     setTableData(state.fileList);
  //   }
  // }
  function handleDeleteItem(i) {
    state.fileList.splice(i, 1);
  }

  /**
   * 初始化
   * @param data isReUpload 是否为重新上传；list 数据列表；engineeringType 将上传的工程资料类型，1 是成品  3 是半成品
   */
  function init(data?: { isReUpload?: boolean; list?: Array<any>; engineeringType: '' | '1' | '3' }) {
    state.fileList = data?.list || [];
    state.engineeringType = data?.engineeringType || '';
    if (state.fileList.length > 0) {
      setTableData(state.fileList);
    }
    state.isReUpload = data?.isReUpload || false;
  }

  function handleConfirmEcn() {
    console.log('handleConfirmEcn');
  }

  function handleChangeFactory(_value, option, row) {
    row.FactoryName = option ? `${option.Name}/${option.Code}` : '';
  }
</script>
