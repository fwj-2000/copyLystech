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
      <a-input v-model:value="baseState.changeTheme" :placeholder="t('dict.ECNColumn.changeTheme')" />
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeSource')" :span="4">
      <a-radio-group v-model:value="baseState.changeSource">
        <a-radio v-for="item in changeSourceOptions" :value="item.enCode">{{ item.fullName }}</a-radio>
      </a-radio-group>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeReason')" :span="4">
      <a-checkbox-group
        v-model:value="baseState.changeReason"
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
      <a-input :disabled="!baseState.changeReason.includes('6')" v-model:value="baseState.otherReason" />
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeItem')" :span="4">
      <div class="flex-row full-wid">
        <a-checkbox-group
          v-model:value="baseState.changeItem"
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
        <a-input :disabled="!baseState.changeItem.includes('14')" v-model:value="baseState.otherProject" />
      </div>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.changeDescription')" :span="2" :contentStyle="{ width: '30%' }">
      <span>{{ t('common.beforeTheChange') }}</span>
      <a-textarea :placeholder="t('dict.ECNColumn.beforeApplication')" v-model:value="baseState.applicantDescribeBehind" />
      <Divider />
      <a-upload-dragger v-feature :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeFormerUpload">
        <a-button v-if="customerBeforeFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          <a-space
            >{{ t('common.attachment')
            }}<a-button v-if="mode == 'edit'" size="small">{{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}</a-button></a-space
          >
          <template v-for="(item, index) in customerBeforeFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <i @click.stop="handleDel(index)" class="icon-ym icon-ym-delete"></i>
            </div>
          </template>
        </div>
      </a-upload-dragger>
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ display: 'none' }" :span="2" :contentStyle="{ width: '30%' }">
      <span>{{ t('common.afterTheChange') }}</span>
      <a-textarea :placeholder="t('dict.ECNColumn.afterApplication')" v-model:value="baseState.applicantDescribeAfter" />
      <Divider />
      <a-upload-dragger v-feature :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeAfterUpload">
        <a-button v-if="customerAfterFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          <a-space
            >{{ t('common.attachment')
            }}<a-button v-if="mode == 'edit'" size="small">{{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}</a-button></a-space
          >
          <template v-for="(item, index) in customerAfterFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <i @click.stop="handleAfterDel(index)" class="icon-ym icon-ym-delete"></i>
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
  import { ActionItem, TableAction, useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { onMounted, reactive, ref, toRaw, toRefs } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { getApplyColumns, ROW_DATA } from '/@/views/engineering/ecn/ecr/CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { useBaseStore } from '/@/store/modules/base';
  import { uploadInstallFile } from '/@/api/engineering/pcc';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { mode } from 'mathjs';
  import { useI18n } from '/@/hooks/web/useI18n';

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const filePreviewRef = ref<any | null>(null);

  const [registerTable, { setTableData, setProps, getDataSource, updateTableDataRecord, insertTableDataRecord, deleteTableDataRecord, reload }] = useTable({
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
    //   align: 'center',
    //   dataIndex: 'action',
    // },
  });

  const state = reactive({
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
      } else {
        // 编辑
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
        console.log(partNumberList, 'partNumberListpartNumberListpartNumberList');
        setTableData(
          partNumberList.map(item => ({
            ...item,
            onEdit: true,
            editable: true,
            disabled: {
              // factory: true,
              // pd: true,
              productDesc: true,
            },
          })),
        );
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
      console.log('view');
    }
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

  function handleDel(index) {
    state.customerBeforeFileList.splice(index, 1);
  }
  function handleAfterDel(index) {
    state.customerAfterFileList.splice(index, 1);
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
          return createMessage.warning(t('common.retainAtLeastOneDataEntry'));
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

    if (!isSamePD) {
      return createMessage.warning(t('dict.ECNColumn.inconsistentPartNumberPD'));
    }
    const data = cloneDeep(toRaw(state.baseState));
    if (!data.changeTheme) return createMessage.warning(t('dict.ECNColumn.fillChangeSubject'));
    if (!data.changeSource) return createMessage.warning(t('dict.ECNColumn.fillChangeSource'));
    console.log(data.changeReason);
    if (data.changeReason.length === 0) return createMessage.warning(t('dict.ECNColumn.selectChangeReason'));
    if (data.changeItem.length === 0) return createMessage.warning(t('dict.ECNColumn.selectChangeProject'));

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
    if (!data.applicantDescribeBehind) return createMessage.warning(t('dict.ECNColumn.fillPreApplicationDescription'));
    if (!data.applicantDescribeAfter) return createMessage.warning(t('dict.ECNColumn.fillPostApplicationDescription'));
    // if (state.customerBeforeFileList <= 0) return createMessage.warning('请上传变更前附件');
    state.customerBeforeFileList.forEach(item => {
      attachmentList.push({
        type: 1,
        name: item.name,
        path: item.flagPath,
        ...item,
      });
    });
    // if (state.customerAfterFileList <= 0) return createMessage.warning('请上传变更后附件');
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
