<template>
  <div>
    <Grid>
      <template #files="{ row, rowIndex }">
        <span class="table-a" @click="handlePreview(row, rowIndex)"> {{ row.fileName }} </span>
      </template>
      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { downloadFile } from '/@/utils/file/download';
  import { deleteFile } from '/@/api/business/projectQs';
  import { PreviewModal } from '/@/components/Upload';
  import { ref } from 'vue';

  const { t } = useI18n();
  const filePreviewRef = ref<any | null>(null);
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'components-filelist',
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      height: 'auto',
      pagerConfig: {
        enabled: false,
      },
      columns: [
        {
          title: '文件名称',
          field: 'fileName',
          width: 540,
          slots: {
            default: 'files',
          },
        },
        {
          title: '上传时间',
          field: 'creatorTime',
          cellRender: {
            name: 'Date',
          },
        },
        {
          title: '上传人',
          field: 'creatorUserName',
        },
        {
          title: '操作',
          field: 'action',
          width: 80,
          slots: {
            default: 'action',
          },
        },
      ],
      clipConfig: {
        isPaste: true,
      },
      position: 'modal',
    },
  });
  const { getDataSource, reloadData } = gridApi;

  const props = defineProps({
    mode: {
      type: String,
      default: 'view',
    },
    data: {
      type: Array,
      default: () => [],
    },
  });
  const getTableActions = (row): ActionItem[] => {
    const downloadAction: ActionItem = {
      label: '',
      icon: 'icon-ym icon-ym-btn-download',
      tooltip: t('common.downloadText'),
      onClick: handleDownload.bind(null, row),
    };
    const delAction: ActionItem = {
      label: '',
      color: 'error',
      icon: 'icon-ym icon-ym-delete',
      // ifShow: !props.disabled,
      tooltip: t('common.delText'),
      modelConfirm: {
        onOk: handleDelete.bind(null, row),
      },
    };
    return props.mode == 'view' ? [downloadAction] : [downloadAction, delAction];
  };
  // 删除文件
  async function handleDelete(row) {
    if (row.id) {
      await deleteFile(row.id);
    }
    gridApi.grid.remove(row);
  }
  // 下载文件
  function handleDownload(row) {
    downloadFile(row);
  }
  //  文件预览
  async function handlePreview(item, rowIndex) {
    const params = {
      fileList: getDataSource(),
      currentIndex: rowIndex,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }
  // 添加文件
  function handleAddFile(fileList) {
    gridApi.grid.insertAt(fileList, -1);
  }
  function setFileList(fileList) {
    reloadData(fileList);
  }
  // 初始化表格
  function init(fileList) {
    reloadData(fileList);
  }
  // 获取数据
  function getFileList() {
    return getDataSource();
  }
  defineExpose({
    setFileList,
    getFileList,
    init,
    handleAddFile,
  });
</script>
