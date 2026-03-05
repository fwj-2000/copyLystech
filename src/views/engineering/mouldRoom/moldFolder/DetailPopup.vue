<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" :showCancelBtn="true" :title="title" :destroyOnClose="true" :showFooter="false">
    <Grid>
      <template #attachment="{ row }">
        <div class="table-a" @dblclick="handlePreview(row.attachmentUrl, row.attachmentName)">
          {{ row.attachmentName }}
        </div>
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PreviewModal } from '/@/components/Upload';
  import { TableAction } from '/@/components/Table';
  import { downloadFile } from '/@/utils/file/download';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const [registerPopup] = usePopupInner(init);
  const title = ref('');

  const column: any[] = [
    {
      title: '文件名称',
      field: 'attachmentName',
      i18nField: 'CommonCol.fileName',
      slots: { default: 'attachment' },
    },
    {
      title: '操作',
      field: 'action',
      width: 80,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-moldFolder-folderList',
      columns: column,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldBomColumn',
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-download',
        tooltip: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  const handleDownload = row => {
    const { attachmentName, attachmentUrl } = row;
    downloadFile({ filePath: attachmentUrl, fileName: attachmentName });
  };

  const filePreviewRef = ref<any | null>(null);
  const handlePreview = (filePath, fileName) => {
    const params = {
      name: fileName,
      filePath: filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  };

  function init(data) {
    title.value = data.factoryMoldNo ? `${data.moldNo}(${data.factoryMoldNo})` : data.moldNo;
    gridApi.grid.reloadData(data.fileList);
  }
</script>

<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;

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

  .files {
    display: flex;
    flex-wrap: wrap;

    .files-item {
      width: 33%;
      margin-top: 4px;

      .item-list {
        display: flex;
        align-items: center;

        .name {
          flex-shrink: 0;
        }

        .list-right {
          flex: 1;
          display: flex;
          align-items: center;

          .item-file-name {
            max-width: 90%;
            word-break: break-all;
          }
        }
      }
    }
  }
</style>
