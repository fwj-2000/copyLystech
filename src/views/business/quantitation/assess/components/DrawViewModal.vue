<template>
  <BasicModal
    :title="t('dict.CommonCol.desensitizedDrawingsName')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="1100"
    @register="registerModal"
    destroy-on-close
    :showOkBtn="false">
    <a-table :dataSource="state.fileList" :columns="columns" :pagination="false" class="pic-list" bordered>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'status'">
          <lydcTag v-if="text == 1" theme="green">{{ t('common.enableText') }}</lydcTag>
          <lydcTag v-if="text == 2" theme="red">{{ t('common.disableText') }}</lydcTag>
        </template>
        <template v-else-if="column.dataIndex === 'originFileName'">
          <a @dblclick="handlePreview(record)">{{ text }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'creatorTime'">
          {{ dateUtil(text).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleHistoryDownload(record)">{{ t('component.upload.download') }} </a-button>
        </template>
      </template>
    </a-table>
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { downloadDesensitizedDrawings } from '/@/api/business/quantitation';
  import { getDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { computed, nextTick, reactive, ref, toRefs, watchEffect } from 'vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicColumn } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['changeLoading', 'register']);
  const { t } = useI18n();

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(initData);

  const props = defineProps({
    sign: { type: String, default: '' },
  });

  const state = reactive({
    visible: false,
    fileList: [],
    current: {
      id: '',
    },
    customerPicList: [],
    engineeringPicList: [],
    quotaList: [],
  });

  const columns: BasicColumn[] = [
    {
      title: t('component.upload.version'),
      dataIndex: 'version',
      key: 'version',
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: t('dict.CommonCol.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: t('component.upload.name'),
      dataIndex: 'originFileName',
      key: 'originFileName',
      minWidth: 250,
    },
    { title: t('component.upload.time'), dataIndex: 'creatorTime' },
    {
      title: t('component.upload.user'),
      dataIndex: 'creatorUserName',
      width: 230,
    },
    {
      title: t('common.action'),
      dataIndex: 'action',
      colSpan: 4,
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
  ];

  function getRowSpan(record, index) {
    if (index === 0 || record?.version !== state.fileList[index - 1]?.version) {
      const count = state.fileList.slice(index).filter(item => item.version === record.version).length;
      return count;
    }
    return 0;
  }

  function getDrawingList(id, InsidePartNumber) {
    getDrawingshistory(
      {
        InsidePartNumber,
        DrawingsType: 'DesensitizedDrawings',
      },
      id,
    ).then(({ data, code }) => {
      state.fileList = data;
    });
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    console.log(item, 'itemitem');
    const params = {
      name: item.FileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function initData(val) {
    getDrawingList(val.id, val.InsidePartNumber);
    state.current.id = val.id;
  }

  async function handleHistoryDownload(val) {
    const {
      data: { name, url },
    } = await downloadDesensitizedDrawings(val.id);
    downloadByUrl({ url: url, target: '_blank', fileName: name });
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
