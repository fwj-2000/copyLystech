<template>
  <BasicModal
    title="工程图纸"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :minHeight="520"
    :width="1100"
    @register="registerModal"
    destroy-on-close
    showOkBtn>
    <Grid>
      <template #status="{ row }">
        <Lydc-tag v-if="row.status == 1" theme="gray">未审核</Lydc-tag>
        <Lydc-tag v-if="row.status == 2" theme="green">启用</Lydc-tag>
        <Lydc-tag v-if="row.status == 3" theme="red">禁用</Lydc-tag>
      </template>

      <template #originFileName="{ row }">
        <a style="color: #ff7b00" @dblclick="handlePreview(row)">{{ row.originFileName }}</a>
      </template>

      <template #action="{ row }">
        <a-button :disabled="!hasBtnP('btn_download')" type="link" @click="handleHistoryDownload(row)">下载 </a-button>
      </template>
    </Grid>
    <!--    <UploadModal @register="registerUpload" @getTable="getDrawingList(state.current.Id)" @close="getDrawingList(state.current.Id)" />-->
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { VxeGridPropTypes } from 'vxe-table';

  import { deleteDrawings, enableDrawings, disableDrawings, drawingshistory, downloadDrawings } from '/@/api/business/quantitation';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { computed, nextTick, reactive, ref, toRefs, watchEffect } from 'vue';
  import { Col, message, Row } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import PreviewModal from './Preview.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicColumn } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { previewPartnumberapplyDrawingshistory } from '/@/api/engineering/ecn';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['changeLoading', 'register']);
  const { t } = useI18n();

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

  const columns: VxeGridPropTypes.Columns = [
    {
      title: '版本',
      field: 'version',
      // customCell: (record, index, column) => {
      //   const rowSpan = getRowSpan(record, index);
      //   return { rowSpan };
      // },
      width: 50,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      // customCell: (record, index, column) => {
      //   const rowSpan = getRowSpan(record, index);
      //   return { rowSpan };
      // },
      slots: {
        default: 'status',
      },
    },
    {
      title: '名称',
      field: 'originFileName',
      slots: {
        default: 'originFileName',
      },
    },
    {
      title: '上传时间',
      field: 'creatorTime',
      width: 160,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '上传人',
      field: 'creatorUserName',
      width: 180,
    },
    {
      title: '操作',
      field: 'action',
      width: 80,
      slots: {
        default: 'action',
      },
      // colSpan: 4,
      // customCell: (record, index, column) => {
      //   const rowSpan = getRowSpan(record, index);
      //   return { rowSpan };
      // },
    },
    // {
    //   title: '',
    //   colSpan: 0,
    //   field: 'enable',
    //   customCell: (record, index, column) => {
    //     const rowSpan = getRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   field: 'delete',
    // },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-askPrice-engineeringDrawingsModal-list',
      height: 520,
      columns,
      toolbarConfig: {
        enabled: false,
        // refresh: false
      },
      pagerConfig: {
        autoHidden: false,
        enabled: false,
      },
    },
  });

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
      gridApi.reloadData(state.desensitizedPicList);
    });
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    // hasBtnP('btn_detail')
    if (!hasBtnP('btn_view_pic')) return;
    console.log(item);
    const params = {
      // previewApi: downloadDrawings,
      name: item.fileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }
  // function handleUpload(record) {
  //   openUpload(true, {
  //     Id: state.current?.Id,
  //     version: record.version,
  //   });
  // }

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

  function initData(val) {
    getDrawingList(val.id);
    state.current.Id = val.id;
  }

  async function handleHistoryDownload(val) {
    console.log(val);
    const {
      data: { name, url },
    } = await downloadDrawings(val.id);
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }

  function handleDeletePic(val) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: () => {
        emit('changeLoading', true);
        deleteDrawings(val.Id)
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
