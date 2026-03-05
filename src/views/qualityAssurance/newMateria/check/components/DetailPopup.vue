<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    :title="t('common.newMateriaCheck')"
    destroyOnClose
    @ok="handleSubmit"
    class="h-full full-popup">
    <template #centerToolbar>
      <a-button @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <ScrollContainer class="p-10px h-full">
      <Grid style="height: 100%">
        <template #toolbar-actions>
          <Subtitle :title="t('common.newMateriaCheck')"></Subtitle>
        </template>
        <template #reportDetail="{ row }">
          <span class="table-a" @click="emits('handleReport', { ...row, id: row.sendSamplesRecordId })"> {{ t('common.viewDetails') }} </span>
        </template>
        <template #action="{ row }">
          <TableAction :actions="getTableActions(row)" />
        </template>
      </Grid>
      <!-- <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record)" />
          </template>
        </template>
      </BasicTable> -->
    </ScrollContainer>
    <UploadModal @register="registerUpload" @success="handleAfterUpload" />
    <FileListModal @register="registerFileList"></FileListModal>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { addColumns, testStatus } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';
  import {
    storageNewMaterial,
    updateNewMaterial,
    getDetails,
    upload,
    getReports,
    fileDownload,
    enableFile,
    disableFile,
  } from '/@/api/quanlity/newMetarialCheck';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import { FileListModal, UploadModal } from '/@/components/Upload';
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload', 'register', 'handleReport']);
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  // const [registerTable, { setTableData, getDataSource, deleteTableDataRecord, updateTableDataRecord }] = useTable({
  //   columns: addColumns(handleFileView),
  //   pagination: false,
  //   showTableSetting: false,
  //   striped: true,
  //   canResize: true,
  //   resizeHeightOffset: 20,
  //   actionColumn: {
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //     width: 130,
  //   },
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  //   i18nConfig: {
  //     moduleCode: 'MaterialDevelopApplyColumn',
  //   },
  // });

  const [Grid, { reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-newMateria-check-add',
      columns: addColumns(),
      // api: getNewMaterial,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  const statusId = testStatus.map(el => Number(el.value));
  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        reloadData(
          r.data.map(item => {
            item = {
              testReportId: '',
              ...item,
              testReportStatus: statusId.includes(item.status) ? item.status : '',
              testReportRemarks: item.remarks,
              onEdit: true,
              editable: true,
            };
            return item;
          }),
        );
      }
    } catch (error) {
      closePopup();
      throw error;
    }
    changeLoading(false);
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('common.uploadReport'),
        toolTip: t('common.uploadReport'),
        onClick: handleUpload.bind(null, record),
        auth: 'btn_uploadReport',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record.id),
      },
    ];
  }
  const currentRow = ref(null);
  function handleUpload(record) {
    currentRow.value = record;
    openUpload(true, {
      id: record.sendSamplesRecordId,
      title: '检验报告',
      uploadApi: upload,
    });
  }
  function handleDelete(id = '') {
    // deleteTableDataRecord(id);
    const list = getDataSource().filter(item => item.id != id);
    reloadData(list);
  }
  function handleFileView(record) {
    openFileList(true, {
      id: record.sendSamplesRecordId,
      downloadApi: fileDownload,
      listApi: getReports,
      hideVersion: true,
    });
  }

  function handleAfterUpload() {
    // updateTableDataRecord(currentUploadId.value, {
    //   testReportId: '--',
    // });
    currentRow.value.testReportId = '--';
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = getDataSource().map(item => {
      return {
        id: item.id,
        testReportStatus: item.testReportStatus,
        sendSamplesRecordId: item.sendSamplesRecordId,
        testReportRemarks: item.testReportRemarks,
        fieldTest: item.fieldTest,
      };
    });
    try {
      const r = type == 'storage' ? await storageNewMaterial(params) : await updateNewMaterial(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      changeOkLoading(false);
      throw error;
    }
  }
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');

  :deep(.scrollbar__view) {
    height: 100%;
  }
</style>
