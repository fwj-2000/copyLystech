<template>
  <BasicModal
    :title="state.title"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="800"
    @register="registerModal"
    destroy-on-close
    :cancelText="t('common.closeText')"
    :show-ok-btn="false">
    <Grid :style="{ minHeight: '550px' }">
      <template #file="{ row }">
        <a @click="handlePreview(row)">{{ row.originFileName || row.fileName }}</a>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleDownload(row)">{{ t('component.upload.download') }} </a-button>
        <!-- 如果外部传入的数据带有`isDel`字段，代表该数据可以删除，并且在删除后，暴露出最新的数据 -->
        <a-button v-if="row.isDel" type="link" @click="handleDel(row)">{{ t('common.delText') }} </a-button>
      </template>
    </Grid>
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadFile } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { PreviewModal } from '/@/components/Upload';

  const props = defineProps({
    isShowVersion: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['changeLoading', 'register', 'fileChange']);

  const [registerModal] = useModalInner(initData);
  const { t } = useI18n();

  const state = reactive<any>({
    title: t('dict.CommonCol.file'),
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldBusiness-apply-file-list-modal',
      columns: [
        {
          type: 'seq',
          width: 50,
        },
        {
          title: t('common.version'),
          field: 'version',
          width: 80,
          visible: props.isShowVersion,
        },
        {
          title: t('component.upload.name'),
          field: 'originFileName',
          slots: {
            default: 'file',
          },
          minWidth: 30,
        },
        {
          title: t('common.action'),
          field: 'action',
          slots: {
            default: 'action',
          },
          width: 150,
        },
      ],
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
        enabled: false,
      },
      position: 'modal',
    },
  });

  const filePreviewRef = ref<InstanceType<typeof PreviewModal>>();
  async function handlePreview(item) {
    filePreviewRef.value?.init({
      // @ts-ignore
      name: item.originFileName || item.fileName,
      previewType: 'localPreview',
      url: item.path || item.filePath,
    });
  }

  function initData(data: {
    title: string; // 标题
    list: Array<{ fileName: string; filePath: string }>;
  }) {
    state.title = data.title || t('dict.CommonCol.file');
    nextTick(() => gridApi.reloadData(data.list));
  }

  //  处理下载
  async function handleDownload(val) {
    downloadFile({ url: val.filePath, target: '_blank', fileName: val.fileName, originFileName: val.originFileName });
  }

  function handleDel(row) {
    gridApi.remove(row).then(() => {
      emits('fileChange', gridApi.getDataSource());
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

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }
</style>
