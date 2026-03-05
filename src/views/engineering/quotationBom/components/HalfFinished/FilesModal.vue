<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :title="title"
    :show-ok-btn="!disabled"
    :ok-text="t('component.modal.okText')"
    destroyOnClose
    @ok="handleOk"
    @register="registerModal">
    <div class="mb-5px ml-12px">
      <UploadBtn v-if="!disabled" ref="uploadRef" :maxFileSize="30" type="primary" @success="afterUpload" />
    </div>
    <div>
      <Grid :style="{ minHeight: '450px' }">
        <template #files="{ row }">
          <span class="table-a" @click="() => handlePreview(row)">
            {{ row.fileName }}
          </span>
        </template>
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>

    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, defineAsyncComponent } from 'vue';
  import { downloadFile } from '/@/utils/file/download';
  import { cloneDeep } from 'lodash-es';

  import { useModalInner } from '/@/components/Modal';
  import { ActionItem } from '/@/components/Table';

  const PreviewModal = defineAsyncComponent(() => import('/@/components/Upload').then(m => m.PreviewModal));
  const UploadBtn = defineAsyncComponent(() => import('/@/components/Upload').then(m => m.UploadBtn));
  const BasicModal = defineAsyncComponent(() => import('/@/components/Modal').then(m => m.BasicModal));
  const TableAction = defineAsyncComponent(() => import('/@/components/Table').then(m => m.TableAction));

  const { t } = useI18n();
  const emit = defineEmits(['change', 'register']);
  const [registerModal, { closeModal }] = useModalInner(init);

  const title = ref<string>(t('common.attachment'));
  const disabled = ref<boolean>(true);
  const uuid = ref<string>('');

  const columns: Array<any> = [
    // 文件
    { field: 'fileName', title: t('common.fileName'), slots: { default: 'files' } },
    // {
    //   title: '上传人',
    //   field: 'creatorUserName',
    //   minWidth: 180,
    // },
    // {
    //   field: 'creatorTime',
    //   title: '上传时间',
    //   cellRender: {
    //     name: 'Date',
    //   },
    // },
    // 操作
    { field: 'action', title: t('common.action'), width: 60, fixed: 'right', slots: { default: 'action' } },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      rowConfig: {
        keyField: 'fileUrl',
      },
    },
  });

  async function init(data: { drawingFile: Array<any>; halfFinishedPart: string; disabled: boolean; uuid: string }) {
    title.value = data.halfFinishedPart ? `${data.halfFinishedPart} ${t('common.attachment')}` : t('common.attachment');
    disabled.value = data.disabled;
    uuid.value = data.uuid || '';
    gridApi.reloadData([...data.drawingFile]);
  }

  function getTableActions(row: any): ActionItem[] {
    return [
      // 下载
      {
        icon: 'icon-ym icon-ym-btn-download',
        tooltip: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        ifShow: () => !disabled.value,
        modelConfirm: {
          onOk: handlDelete.bind(null, row),
        },
      },
    ];
  }

  /** 下载文件 */
  async function handleDownload(row: any) {
    downloadFile({ filePath: row.fileUrl, fileName: row.fileName });
  }

  /** 删除文件 */
  function handlDelete(row: any) {
    gridApi.remove(row);
  }

  const filePreviewRef = ref<any | null>(null);
  /** 文件预览 */
  async function handlePreview(item: any) {
    const params = {
      name: item.fileName,
      filePath: item.fileUrl,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  const uploadRef = ref<InstanceType<typeof UploadBtn>>();
  /** 上传成功后，赋值操作 */
  function afterUpload(fileList) {
    const fileListBackup = cloneDeep(fileList).map((item: any) => {
      return {
        ...item,
        fileUrl: item.filePath,
      };
    });
    gridApi.insertAt(fileListBackup, -1);
    uploadRef.value && uploadRef.value.clearUploadFileList();
  }

  /** 更改数据 */
  function handleOk() {
    emit('change', { drawingFile: gridApi.getDataSource(), uuid: uuid.value });
    closeModal();
  }
</script>
