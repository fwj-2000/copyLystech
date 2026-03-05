<template>
  <BasicModal
    :title="state.title"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="1100"
    @register="registerModal"
    destroy-on-close
    :cancelText="t('common.closeText')"
    :show-ok-btn="false">
    <a-table :dataSource="state.fileList" :columns="columns" :pagination="false" class="pic-list" bordered>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'status'">
          <LydcTag v-if="text == 1" theme="green" :text="t('common.enableText')"></LydcTag>
          <LydcTag v-else theme="red" :text="t('common.disableText')"></LydcTag>
        </template>
        <template v-else-if="column.dataIndex === 'originFileName'">
          <a @dblclick="handlePreview(record)">{{ text || record.fileName }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'creatorTime'">
          {{ dayjs(text).tz().format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <!--          <a-button type="link" @click="handleHistoryDownload(record)">{{ t('component.upload.download') }} </a-button>-->
          <a-button type="link" @click="handleDelete(record)">{{ t('common.delText') }} </a-button>
        </template>
      </template>
    </a-table>
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadFile } from '/@/utils/file/download';
  import { BasicColumn } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { get } from 'lodash-es';
  import { isBoolean, isNullOrUnDef } from '/@/utils/is';
  const { t } = useI18n();

  const emit = defineEmits(['changeLoading', 'register', 'delete']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(initData);

  const state = reactive<any>({
    title: t('component.upload.title'),
    ImmediateCustomerCodeOption: [],
    InsideProjectCodeOption: [],
    mainProcessOption: [],
    mainProcess: '',
    shipPattern: [],
    visible: false,
    fileList: [],
    current: {
      Id: '',
    },
    useMerge: true,
    usePath: false,
    customerPicList: [],
    fileLiat: [],
    engineeringPicList: [],
    quotaList: [],
    downloadApi: null,
  });

  const columns = ref<BasicColumn[]>([
    // {
    //   title: t('dict.CommonCol.status'),
    //   dataIndex: 'status',
    //   key: 'Status',
    //   width: 100,
    //   customCell: (record, index, column) => {
    //     const rowSpan = getRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    {
      title: t('component.upload.name'),
      dataIndex: 'originFileName',
      key: 'OriginFileName',
      // maxWidth: 280,
    },
    { title: t('component.upload.time'), dataIndex: 'creatorTime', width: 180 },
    {
      title: t('component.upload.user'),
      dataIndex: 'creatorUserName',
      width: 230,
    },
    {
      title: t('common.action'),
      dataIndex: 'action',
      // colSpan: 4,
      // customCell: (record, index, column) => {
      // const rowSpan = getRowSpan(record, index);
      // return { rowSpan };
      // },
    },
  ]);

  /**
   * @description: 合并单元格
   * @param {any} record: 当前行数据
   * @param {any} index: 当前行索引
   * @return {number}
   */
  function getRowSpan(record, index) {
    if (state.hideVersion) {
      return 1;
    }
    if (!state.useMerge) {
      return 1;
    }
    console.log(record?.version !== state.fileList[index - 1]?.version, 'record?.version !== state.fileList[index - 1]?.version');
    if (![null, undefined].includes(record.Version) && (index === 0 || record?.Version !== state.fileList[index - 1]?.Version)) {
      const count = state.fileList.slice(index).filter(item => item.Version === record.Version).length;
      return count;
    }
    if (![null, undefined].includes(record.Version) && (index === 0 || record?.version !== state.fileList[index - 1]?.version)) {
      const count = state.fileList.slice(index).filter(item => item.version === record.version).length;
      console.log(count, 'count----');
      return count;
    }
    return 1;
  }
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    if (state.usePath) {
      delete params.Id;
      params.url = item.path || item.filePath;
    }
    console.log(params);
    filePreviewRef.value?.init(params);
  }

  function initData(data) {
    console.log(data);
    console.log(isBoolean(data.useMerge), 'isBoolean(data.useMerge)');
    if (isBoolean(data.hideVersion)) {
      state.hideVersion = data.hideVersion;
    }
    if (isBoolean(data.usePath)) {
      state.usePath = data.usePath;
    }
    if (isBoolean(data.useMerge)) {
      state.useMerge = data.useMerge;
    }
    if (data.hideVersion) {
      for (let i = 0; i < columns.value.length; i++) {
        if (columns.value[i].dataIndex == 'version') {
          columns.value.splice(i, 1);
          continue;
        }
      }
    }
    if (isNullOrUnDef(data.listApi)) {
      // 如果没有传入listApi参数，那么直接setTableData FileList
      const { fileList } = data;
      state.fileList = fileList;
      state.row = data.row;
      return;
    }
    let param;
    const keyFieldName = data.keyFieldName || 'id';
    if (data.useQuery) {
      param = {
        [keyFieldName]: data[keyFieldName],
      };
    } else {
      param = data[keyFieldName];
    }
    console.log(param, 'param');
    data.listApi(param).then(({ data: retData, code }) => {
      if (data.resultField) {
        console.log(retData);
        console.log(get(retData, data.resultField));
        state.fileList = get(retData, data.resultField);
      } else {
        state.fileList = retData;
      }
    });
    state.current.Id = data.id;
    state.downloadApi = data.downloadApi;
    state.title = data.title || t('component.upload.title');
  }

  async function handleHistoryDownload(val) {
    if (state.usePath) {
      return downloadFile({ url: val.filePath, target: '_blank', fileName: val.fileName });
    }
    const {
      data: { name, url },
    } = await state.downloadApi(val.id);
    downloadFile({ url: url, target: '_blank', fileName: name });
  }

  function handleDelete(index) {
    console.log(1231231, index, '11111111111111');
    emit('delete', state.row, index);
  }
</script>
<style lang="less" scoped>
  .content-box {
    padding: 10px 40px;
    height: 74vh;
    overflow-y: scroll;
  }

  .bottom-box {
    position: relative;
    background: #fff;
    box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);
  }

  .bottom-submit {
    display: flex;
    bottom: 0;
    height: 66px;
    width: 100%;
    padding: 16px;
    flex-direction: row;
    justify-content: space-between;
  }

  .row-margin {
    margin-bottom: 10px;
  }

  .btn-not-primary {
    color: #ff7b00;
    border: 1px solid #ff7b00;
  }

  .form-pd {
    padding: 0 15px 15px;
  }

  :deep(.ant-form-item) {
    margin-bottom: 12px !important;
  }

  //:deep(.lydc-basic-form) {
  //  margin-bottom: 12px;
  //}
  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }

  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0;
  }

  :deep(.pic-list .ant-table-thead > tr > th, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
    padding: 8px;
  }

  :deep(.pic-list .ant-table-tbody > tr > td) {
    padding: 8px;
  }

  //:deep(.ant-table .ant-table-cell) {
  //  white-space: nowrap;
  //  overflow: hidden;
  //  text-overflow: ellipsis;
  //}

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }
</style>
