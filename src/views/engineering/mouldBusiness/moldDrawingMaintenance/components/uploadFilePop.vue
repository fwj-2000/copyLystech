<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="isResubmit ? t('dict.MoldApply.resubmit') : t('common.uploadDrawingText')"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    class="full-popup">
    <template #centerToolbar>
      <UploadBtn
        v-auth="'btn_upload'"
        ref="uploadRef"
        type="primary"
        :buttonText="t('common.uploadDrawingText')"
        :maxFileSize="30"
        class="ml-12px"
        @success="setFilesToRow" />
    </template>
    <div class="h-full py-10px">
      <Grid>
        <template #buttons>
          <Subtitle :title="t('dict.CommonCol.moldDrawingsName')" class="pb-none" />
        </template>

        <template #moldDrawings="{ row }">
          <span class="table-a" @click="() => handlePreview(row)">{{ row.fileName }}</span>
        </template>

        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
    <Preview ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import type { ActionItem } from '/@/components/Table';

  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns } from './uploadFilePopConfig';
  import { downloadFile } from '/@/utils/file/download';
  import { createMoldDrawing, resubmitMoldDrawing } from '/@/api/engineering/moldDrawingLibrary';
  import { buildUUID } from '/@/utils/uuid';
  import { isNullOrUnDef } from '/@/utils/is';

  import { UploadBtn } from '/@/components/Upload';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import Preview from '/@/components/Upload/src/components/Preview.vue';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  const uploadRef = ref<InstanceType<typeof UploadBtn>>();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      showIndexColumn: true,
      columns: columns,
      rowConfig: {
        keyField: 'uuid',
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: false,
        slots: {
          buttons: 'buttons',
        },
      },
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: handleDownload.bind(null, row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.deleted'),
          onOk: handleDel.bind(null, row),
        },
      },
    ];
  }

  const currentRow = ref<any>({});
  /** 是否重新提交 */
  const isResubmit = ref<boolean>(false);

  function init(data: { row: any; fileList: Array<{ fileName: string; filePath: string }>; isResubmit: boolean }) {
    currentRow.value = data.row;
    isResubmit.value = data.isResubmit;
    setFilesToRow(data.fileList);
  }

  function setFilesToRow(fileList: Array<{ fileName: string; filePath: string }>) {
    const dataList = gridApi.getDataSource();
    const baseInfo = dataList?.[0] || {
      ...currentRow.value,
      drawingVersion: isNullOrUnDef(currentRow.value.drawingVersion) ? 0 : currentRow.value.drawingVersion + 1,
    };

    fileList.forEach(file => {
      dataList.push({
        ...baseInfo,
        ...file,
        uuid: buildUUID(),
        file,
      });
    });
    gridApi.reloadData(dataList).then(() => {
      setMergeCell(dataList.length);
    });
    uploadRef.value?.clearUploadFileList();
  }

  function setMergeCell(rowsLength: number) {
    const merges = columns.slice(0, -2).map((_el, index) => ({
      row: 0,
      col: index + 1,
      rowspan: rowsLength,
      colspan: 1,
    }));
    gridApi.grid.setMergeCells(merges);
  }

  /**
   * 处理下载
   * @param val
   */
  async function handleDownload(val: any) {
    downloadFile({ url: val.filePath, target: '_blank', fileName: val.fileName, originFileName: val.originFileName });
  }

  /** 删除 */
  function handleDel(row: any) {
    gridApi.remove(row);
  }

  const filePreviewRef = ref<InstanceType<typeof Preview>>();
  /** 预览 */
  async function handlePreview(row: any) {
    filePreviewRef.value?.init({
      filePath: row.filePath,
      version: 2,
      // @ts-ignore
      name: row.fileName,
    });
  }

  function setLoading(isLoading = false) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
  }

  /** 提交 */
  async function handleSubmit() {
    const api = isResubmit.value ? resubmitMoldDrawing : createMoldDrawing;

    setLoading(true);
    // TODO 接口联调
    api({
      id: currentRow.value.id,
      moldDrawings: gridApi.getDataSource().map(item => item.file),
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<style scoped lang="less">
  div.pb-none {
    padding-bottom: 0;
  }
</style>
