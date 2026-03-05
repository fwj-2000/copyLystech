<template>
  <Subtitle :title="t('dict.ECNColumn.changeRequest')" id="process-flow" />
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record, index, text }">
      <template v-if="column.dataIndex === 'action'">
        <TableAction :actions="getTableActions(index, record)" />
      </template>
    </template>
  </BasicTable>

  <Descriptions :labelStyle="{ width: '200px' }" bordered style="margin-top: 10px" :column="4" size="small">
    <DescriptionsItem :label="t('dict.ECNColumn.changeTheme')" :span="4">
      <a-input disabled v-model:value="baseState.changeTheme" :placeholder="t('dict.ECNColumn.changeTheme')" />
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeSource')" :span="4">
      <a-radio-group disabled :value="baseState.changeSource">
        <a-radio v-for="item in changeSourceOptions" :value="item.enCode">{{ item.fullName }}</a-radio>
      </a-radio-group>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeReason')" :span="4">
      <a-checkbox-group
        disabled
        :value="baseState.changeReason"
        style="width: max-content"
        @change="
          list => {
            if (!list.includes('6')) {
              baseState.otherReason = '';
            }
          }
        ">
        <a-checkbox v-for="item in changeReasonOptions" :value="item.enCode">{{ item.fullName }}</a-checkbox>
      </a-checkbox-group>
      <a-input disabled :disabled="!baseState.changeReason.includes('6')" v-model:value="baseState.otherReason" />
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeItem')" :span="4">
      <div class="flex-row full-wid">
        <a-checkbox-group
          disabled
          :value="baseState.changeItem"
          style="width: max-content"
          @change="
            list => {
              if (!list.includes('14')) {
                baseState.otherProject = '';
              }
            }
          ">
          <a-checkbox v-for="item in changeProjectOptions" :value="item.enCode">{{ item.fullName }}</a-checkbox>
        </a-checkbox-group>
        <a-input disabled v-model:value="baseState.otherProject" />
      </div>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.changeDescription')" :span="2" :contentStyle="{ width: '30%' }">
      <a-textarea disabled :placeholder="t('dict.ECNColumn.beforeApplication')" v-model:value="baseState.applicantDescribeBehind" />
      <Divider />
      <a-upload-dragger v-feature disabled :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeFormerUpload">
        <a-button disabled v-if="customerBeforeFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          {{ t('common.attachment') }}
          <template v-for="(item, index) in customerBeforeFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <!--              <i @click.stop="handleDel(index)" class="icon-ym icon-ym-delete"></i>-->
              <div @click.stop="handleDownload(item)" class="icon-ym icon-ym-download"></div>
            </div>
          </template>
        </div>
      </a-upload-dragger>
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ display: 'none' }" :span="2" :contentStyle="{ width: '30%' }">
      <a-textarea disabled :placeholder="t('dict.ECNColumn.afterApplication')" v-model:value="baseState.applicantDescribeAfter" />
      <Divider />
      <a-upload-dragger v-feature disabled :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeAfterUpload">
        <a-button disabled v-if="customerAfterFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          {{ t('common.attachment') }}
          <template v-for="(item, index) in customerAfterFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <!--              <i @click.stop="handleAfterDel(index)" class="icon-ym icon-ym-delete"></i>-->
              <div @click.stop="handleDownload(item)" class="icon-ym icon-ym-download"></div>
            </div>
          </template>
        </div>
      </a-upload-dragger>
    </DescriptionsItem>
  </Descriptions>
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { Descriptions, DescriptionsItem, Divider } from 'ant-design-vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { onMounted, reactive, ref, toRaw, toRefs } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { ROW_DATA } from '/@/views/engineering/ecn/projectecr/CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { useBaseStore } from '/@/store/modules/base';
  import { uploadInstallFile } from '/@/api/engineering/pcc';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep, isEmpty, isNil } from 'lodash-es';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
  import { isNullOrUnDef } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const filePreviewRef = ref<any | null>(null);

  const [
    registerTable,
    { setTableData, setProps, getDataSource, getRawDataSource, updateTableDataRecord, insertTableDataRecord, deleteTableDataRecord, reload },
  ] = useTable({
    columns: getApplyColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    rowKey: 'uuid',
    isCanResizeParent: true,
    canResize: false,
    showIndexColumn: false,
    // actionColumn: {
    //   width: 80,
    //   title: '操作',
    //   dataIndex: 'action',
    // },
  });

  const state = reactive({
    dataList: [],
    baseState: {
      changeReason: [],
      changeItem: [],
    },
    customerBeforeFileList: [],
    customerAfterFileList: [],
    changeSourceOptions: [],
    changeReasonOptions: [],
    changeProjectOptions: [],
  });

  const { changeSourceOptions, changeReasonOptions, changeProjectOptions } = toRefs(state);

  const { baseState, customerBeforeFileList, customerAfterFileList } = toRefs(state);

  function init(data) {
    console.log('🚀 ~ init ~ data: ', data);
    const rawData = toRaw(data);
    if (rawData.mode === 'edit') {
      if (data.index === -1) {
        // 新增
        const tableList = [
          {
            ...ROW_DATA,
            uuid: buildUUID(),
          },
        ];
        setTableData(tableList);
        state.dataList = tableList;
      } else {
        // 编辑
        console.log(data);
        const {
          attachmentList,
          changeItemList,
          changeReason,
          changeItem,
          changeReasonList,
          changeSource,
          changeTheme,
          partNumberList,
          applicantDescribeAfter,
          applicantDescribeBehind,
        } = data;
        const list = partNumberList.map(item => ({
          ...item,
          pd: item.pdName,
          onEdit: true,
          editable: true,
          disabled: {
            insidePartNumber: true,
            factory: true,
            pd: true,
            productDesc: true,
            version: true,
          },
        }));
        setTableData(list);
        state.dataList = list;
        state.baseState.changeReason = changeReasonList.map(item => item.key);
        if (!!changeReasonList.find(item => item.key == '6')) {
          state.baseState.otherReason = changeReasonList.find(item => item.key === '6').value;
        }
        state.baseState.changeItem = changeItemList.map(item => item.key);
        if (!!changeItemList.find(item => item.key == '14')) {
          state.baseState.otherProject = changeItemList.find(item => item.key === '14').value;
        }
        state.baseState.changeSource = changeSource;
        state.baseState.applicantDescribeAfter = applicantDescribeAfter;
        state.baseState.applicantDescribeBehind = applicantDescribeBehind;
        state.baseState.changeTheme = changeTheme;
        state.baseState.changeSource = changeSource + '';
        attachmentList.forEach((item, index) => {
          if (item.type == 1) {
            state.customerBeforeFileList.push({
              ...item,
              flagPath: item.path,
            });
          } else if (item.type == 2) {
            state.customerAfterFileList.push({
              ...item,
              flagPath: item.path,
            });
          }
        });
      }
    } else {
      //编辑
      console.log(data);
      const {
        attachmentList,
        changeItemList,
        changeReason,
        changeItem,
        changeReasonList,
        changeSource,
        changeTheme,
        partNumberList,
        applicantDescribeAfter,
        applicantDescribeBehind,
      } = data;
      const list = partNumberList.map(item => ({
        ...item,
        onEdit: true,
        editable: true,
        disabled: {
          insidePartNumber: true,
          factory: true,
          pd: true,
          productDesc: true,
          version: true,
          documentType: true,
        },
      }));
      console.log(list, '--------------');
      setTableData(list);
      state.baseState.changeReason = changeReasonList.map(item => item.key);
      if (!!changeReasonList.find(item => item.key == '6')) {
        state.baseState.otherReason = changeReasonList.find(item => item.key === '6').value;
      }
      state.baseState.changeItem = changeItemList.map(item => item.key);
      if (!!changeItemList.find(item => item.key == '14')) {
        state.baseState.otherProject = changeItemList.find(item => item.key === '14').value;
      }
      state.baseState.changeSource = changeSource;
      state.baseState.applicantDescribeAfter = applicantDescribeAfter;
      state.baseState.applicantDescribeBehind = applicantDescribeBehind;
      state.baseState.changeTheme = changeTheme;
      state.baseState.changeSource = changeSource + '';
      attachmentList.forEach((item, index) => {
        if (item.type == 1) {
          state.customerBeforeFileList.push({
            ...item,
            flagPath: item.path,
          });
        } else if (item.type == 2) {
          state.customerAfterFileList.push({
            ...item,
            flagPath: item.path,
          });
        }
      });
    }
  }

  function handleDownload(item) {
    const { flagPath: url, name } = item;
    downloadByUrl({ url, target: '_blank', name });
  }

  function beforeFormerUpload(file, fileList) {
    const waitList = [];
    fileList.forEach(item => {
      if (!state.customerBeforeFileList.find(value => value.name === item.name)) {
        const params = {
          file: item,
          filePath: 'PCC',
        };
        state.customerBeforeFileList.push(item);
        waitList.push(uploadInstallFile(params));
      }
    });
    Promise.all(waitList).then(list => {
      list.forEach(item => {
        const {
          data: { fileName, filePath },
        } = item;
        state.customerBeforeFileList.forEach(item => {
          if (item.name === fileName) {
            item.flagPath = filePath;
          }
        });
      });
    });
    return false;
  }

  function beforeAfterUpload(file, fileList) {
    const waitList = [];
    fileList.forEach(item => {
      if (!state.customerAfterFileList.find(value => value.name === item.name)) {
        const params = {
          file: item,
          filePath: 'PCC',
        };
        state.customerAfterFileList.push(item);
        waitList.push(uploadInstallFile(params));
      }
    });
    Promise.all(waitList).then(list => {
      list.forEach(item => {
        const {
          data: { fileName, filePath },
        } = item;
        state.customerAfterFileList.forEach(item => {
          if (item.name === fileName) {
            item.flagPath = filePath;
          }
        });
      });
    });
    return false;
  }

  async function handlePreview(item) {
    if (!item.flagPath) {
      const params = {
        file: item,
        filePath: 'PCC',
      };
      const {
        data: { filePath },
      } = await uploadInstallFile(params);
      item.flagPath = filePath;
    }
    const params = {
      name: item.name,
      url: item.flagPath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function getApplyColumns(): BasicColumn[] {
    return [
      {
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          placeholder: '请选择产品内部料号',
          api: getPartNumberApplySearch,
          showSearch: true,
          resultField: 'data',
          notFoundContent: null,
          labelField: 'insidePartNumber',
          valueField: 'insidePartNumber',
          immediate: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          onChange: (insidePartNumber, data, record) => {
            console.log(insidePartNumber);
            const { factory, productDesc, members } = data;
            const { editValueRefs } = record;
            editValueRefs.factory = factory;
            editValueRefs.productDesc = productDesc;
            const PD = members.find(item => item.configType === 'PDPerson')?.memberName;
            editValueRefs.pd = PD || '';
          },
        },
        width: 120,
      },
      {
        title: t('dict.ECNColumn.documentType'),
        dataIndex: 'documentType',
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          placeholder: t('dict.ECNColumn.documentType'),
          api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType', true),
          showSearch: true,
          resultField: 'data',
          notFoundContent: null,
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          onChange: (documentType, data, record) => {
            console.log(documentType);
            const { editValueRefs, id } = record;
            const list = getDataSource();
            const target = state.dataList.find(item => item.id === id);
            console.log(target);
            const version = target.versionList.find(item => item.documentType == documentType)?.version;
            if (isNullOrUnDef(version)) return createMessage.warning('当前版本不存在');
            editValueRefs.version = version;
          },
        },
        width: 120,
      },
      {
        title: t('dict.ECNColumn.version'),
        dataIndex: 'version',
        editRow: true,
        editComponentProps: {
          placeholder: t('dict.ECNColumn.version'),
        },
        width: 120,
      },
      {
        title: t('dict.CommonCol.factory'),
        dataIndex: 'factory',
        editRow: true,
        width: 120,
      },
      {
        title: 'PD',
        dataIndex: 'pd',
        editRow: true,
        width: 120,
      },
      {
        title: t('dict.ECNColumn.productDesc'),
        dataIndex: 'productDesc',
        editRow: true,
        width: 120,
      },
    ];
  }

  function handleDel(index) {
    state.customerBeforeFileList.splice(index, 1);
  }

  function handleAfterDel(index) {
    state.customerAfterFileList.splice(index, 1);
  }

  function handleDataSource() {
    const datalist = getDataSource();
    if (datalist.length > 0) {
      console.log('清空数据');
    } else {
      console.log('添加数据');
    }
  }

  onMounted(() => {
    getTypeOps();
  });

  async function getTypeOps() {
    const source = await baseStore.getDictionaryData('ECN.ChangeSource');
    state.changeSourceOptions = source;
    const reason = await baseStore.getDictionaryData('ECN.ChangeReason');
    state.changeReasonOptions = reason;
    const project = await baseStore.getDictionaryData('ECN.ChangeItem');
    state.changeProjectOptions = project;
  }

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChange.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChange.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  function handleChange(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add':
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...ROW_DATA,
            uuid: buildUUID(),
          });
        }
        insertTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        insertTableDataRecord(
          {
            ...ROW_DATA,
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'copy':
        const copyData = getDataSource()[data.index];
        insertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'delete':
        const list = getDataSource();
        if (list.length <= 1) {
          return createMessage.warning('最少必须有一条数据');
        }
        deleteTableDataRecord(data.uuid);
        break;
      case 'update':
        // updateMaterialTableDataRecord(data);
        break;
    }
  }

  function submit() {
    const dataSource = getDataSource();
    const PDValues = dataSource.map(item => item.pd);
    const isSamePD = PDValues.every(item => item === PDValues[0]);

    const validate = dataSource.find(item => isNil(item.documentType) || item.documentType == '');
    if (!isEmpty(validate)) {
      return createMessage.warning('请选择资料类型');
    }
    if (!isSamePD) {
      return createMessage.warning('选择的料号PD不一致，请重新选择');
    }
    const data = cloneDeep(toRaw(state.baseState));
    if (data.changeReason.includes('6') && !data.otherReason) {
      return createMessage.warning('');
    }
    if (data.changeReason.includes('14') && !data.otherProject) {
      return createMessage.warning('');
    }
    data.changeReasonList = data.changeReason.map(item => ({
      key: item,
      value: item == '6' ? data.otherReason : '',
    }));
    data.changeItemList = data.changeItem.map(item => ({
      key: item,
      value: item == '14' ? data.otherProject : '',
    }));
    delete data.changeReason;
    delete data.changeItem;
    const attachmentList = [];
    state.customerBeforeFileList.forEach(item => {
      attachmentList.push({
        type: 1,
        name: item.name,
        path: item.flagPath,
        ...item,
      });
    });
    state.customerAfterFileList.forEach(item => {
      attachmentList.push({
        type: 2,
        name: item.name,
        path: item.flagPath,
        ...item,
      });
    });
    return {
      ...data,
      attachmentList,
      partNumberList: dataSource,
    };
  }

  defineExpose({
    init,
    submit,
  });
</script>

<style lang="less" scoped>
  .annex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    cursor: pointer;
  }

  :deep(.ant-divider-horizontal) {
    margin: 8px 0;
  }

  .full-wid {
    display: flex;
    flex-wrap: wrap;
    width: calc(100vw - 420px);
  }

  :deep(.ant-checkbox-wrapper) {
    margin: 5px 8px 5px 0;
  }

  :deep(.ant-upload-drag) {
    background: #fff;
    border: none;
  }

  :deep(.ant-upload-btn) {
    text-align: left;
  }

  .file-wrapper {
    display: flex;
    flex-flow: row wrap;
  }

  .ellipsis {
    margin-right: 10px;
    max-width: 300px; /* 设置宽度 */
    width: max-content;
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 溢出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
  }

  :deep(.ant-radio-disabled .ant-radio-inner::after) {
    background: rgb(255 123 0 / 70%);
  }

  :deep(.ant-radio-checked .ant-radio-inner) {
    border-color: rgb(255 123 0 / 70%) !important;
  }

  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: rgb(255 123 0 / 70%) !important;
    border-color: rgb(255 123 0 / 30%) !important;
  }

  :deep(.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after) {
    border-color: rgb(255 255 255 / 80%) !important;
  }

  :deep(.ant-table-cell-ellipsis.ant-table-cell-fix-right-first) {
    overflow: hidden;
  }

  :deep(.ant-radio-disabled + span) {
    color: #1a1a1a;
  }

  :deep(.ant-checkbox-disabled + span) {
    color: #1a1a1a;
  }
</style>
