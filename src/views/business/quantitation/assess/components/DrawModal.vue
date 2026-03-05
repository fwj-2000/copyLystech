<template>
  <BasicModal
    :title="t('dict.EngineeringDocApply.DocType.1')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="1300"
    @register="registerModal"
    destroy-on-close
    showOkBtn>
    <a-table :dataSource="state.desensitizedPicList" :columns="columns" :pagination="false" class="pic-list" bordered>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'status'">
          <Lydc-tag v-if="text == 1" theme="gray">{{ t('dict.Quotation.Status.1') }}</Lydc-tag>
          <Lydc-tag v-if="text == 2" theme="green">{{ t('common.enableText') }}</Lydc-tag>
          <Lydc-tag v-if="text == 3" theme="red">{{ t('common.disableText') }}</Lydc-tag>
        </template>
        <template v-else-if="column.dataIndex === 'originFileName'">
          <a @dblclick="handlePreview(record)">{{ text }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'creatorTime'">
          {{ dateUtil(text).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleUpload(record)">{{ t('common.uploadText') }} </a-button>
        </template>
        <template v-else-if="column.dataIndex === 'enable'">
          <a-button v-if="record.status == 3" type="link" @click="handleEnable(record)">{{ t('common.enableText') }} </a-button>
          <a-button v-if="record.status == 2" type="link" @click="handleDisable(record)">{{ t('common.disableText') }} </a-button>
        </template>
        <template v-else-if="column.dataIndex === 'download'">
          <a-button type="link" @click="handleHistoryDownload(record)">{{ t('component.upload.download') }} </a-button>
        </template>
        <template v-else-if="column.dataIndex === 'delete'">
          <a-button type="link" @click="handleDeletePic(record)">{{ t('common.delText') }} </a-button>
        </template>
      </template>
    </a-table>
    <UploadModal @register="registerUpload" @getTable="getDrawingList(state.current.Id)" @close="getDrawingList(state.current.Id)" />
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { deleteDrawings, enableDrawings, disableDrawings, drawingshistory, downloadDrawings, previewDrawingshistory } from '/@/api/business/quantitation';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { computed, nextTick, reactive, ref, toRefs, watchEffect } from 'vue';
  import { Col, message, Row } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import UploadModal from './UploadModal.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicColumn } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['changeLoading', 'register']);
  const { t } = useI18n();

  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(initData);

  const props = defineProps({
    sign: { type: String, default: '' },
  });

  const state = reactive({
    fileList: [],
    current: {
      Id: '',
    },
    customerPicList: [],
    desensitizedPicList: [],
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
      width: 100,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: t('component.upload.name'),
      dataIndex: 'originFileName',
      key: 'originFileName',
      width: 300,
    },
    { title: t('component.upload.time'), dataIndex: 'creatorTime', width: 180 },
    {
      title: t('component.upload.user'),
      dataIndex: 'creatorUserName',
      width: 260,
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
    {
      title: '',
      colSpan: 0,
      dataIndex: 'enable',
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'download',
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'delete',
    },
  ];

  function getRowSpan(record, index) {
    if (index === 0 || record?.version !== state.desensitizedPicList[index - 1]?.version) {
      const count = state.desensitizedPicList.slice(index).filter(item => item.version === record.version).length;
      return count;
    }
    return 0;
  }

  function getDrawingList(id) {
    // 工程图纸
    drawingshistory({
      id,
    }).then(({ data, code }) => {
      state.desensitizedPicList = data;
    });
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    // hasBtnP('btn_detail')
    const params = {
      name: item.FileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      previewApi: previewDrawingshistory,
    };
    filePreviewRef.value?.init(params);
  }

  function handleUpload(record) {
    openUpload(true, {
      Id: state.current?.Id,
      version: record.version,
    });
  }

  // 启用
  function handleEnable(record) {
    enableDrawings({
      id: state.current.Id,
      version: record.version,
    }).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        getDrawingList(state.current.Id);
      }
    });
  }
  function handleDisable(record) {
    disableDrawings({
      id: state.current.Id,
      version: record.version,
    }).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        getDrawingList(state.current.Id);
      }
    });
  }

  function initData(data) {
    getDrawingList(data.id);
    state.current.Id = data.id;
  }

  /**
   * 移除URL中的API前缀部分，保留路径
   *
   * @param url - 原始URL字符串，可能包含域名或前缀路径
   * @returns {string} 处理后的路径字符串。当未找到/api前缀时返回原URL，
   *                   找到时返回从第一个/api开始的子路径（保留/api前缀）
   */
  function removeApiPrefix(url: string) {
    const apiIndex = url.indexOf('/api');
    return apiIndex === -1 ? url : url.slice(apiIndex);
  }
  async function handleHistoryDownload(val) {
    const {
      data: { name, url },
    } = await downloadDrawings(val.id);
    downloadByUrl({ url: removeApiPrefix(url), target: '_blank', fileName: name });
  }

  function handleDeletePic(item) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: () => {
        emit('changeLoading', true);
        deleteDrawings({
          engineeringId: item.id,
          id: state.current.Id,
        })
          .then(({ code }) => {
            if (code === 200) {
              message.success(t('common.delSuccess'));
              getDrawingList(state.current.Id);
            }
          })
          .finally(e => {
            emit('changeLoading', false);
          });
      },
    });
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
    padding: 8px !important;
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
