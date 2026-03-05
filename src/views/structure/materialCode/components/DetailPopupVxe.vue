<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <!-- <template #centerToolbar>
      <a-button @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template> -->
    <div class="h-full popup-container p-10px">
      <Subtitle :title="t('common.metariaInfo')"></Subtitle>
      <Grid>
        <template #files="{ row }">
          <span class="table-a" @click="handleFileView(row)">{{ t('dict.DocumentControlColumn.files') }}</span>
        </template>
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
    <UploadModal @register="registerUpload" @success="handleAfterUpload" />
    <FileListModal @register="registerFileList"></FileListModal>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { addCols, getMainProcess } from '../configVxe';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { updateDc, getDetails, storageDc } from '/@/api/structure/materialCode';
  import { fileDownload, getFiles, upload } from '/@/api/purchase/importMateria';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { FileListModal, UploadModal } from '/@/components/Upload';
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      height: 'auto',
      columns: addCols as any,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        enabled: false,
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  onMounted(async () => {
    const r = await getMainProcess();
    addCols.forEach(el => {
      if (el.field == 'mainProcess') {
        el.editRender = {
          name: 'ASelect',
          props: {
            options: r,
            fieldNames: {
              value: 'id',
              label: 'fullName',
            },
          },
        };
      }
    });
    gridApi.reloadColumn(addCols);
  });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        gridApi.reloadData(
          r.data.map(item => {
            item = {
              ...item,
              onEdit: true,
              editable: true,
            };
            return item;
          }),
        );
      }
    } catch (error) {
      closePopup();
    }
    changeLoading(false);
  }

  function getTableActions(record): ActionItem[] {
    return [
      // {
      //   label: '上传资料',
      //   onClick: handleUpload.bind(null, record),
      //   // auth: 'btn_uploadReport',
      // },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record),
      },
    ];
  }
  const currentUploadId = ref();
  function handleUpload(record) {
    currentUploadId.value = record.id;
    openUpload(true, {
      id: record.materialDevelopImportId,
      title: '技术资料',
      uploadApi: upload,
    });
  }
  function handleDelete(row: any) {
    gridApi.grid.remove(row);
  }
  function handleFileView(record) {
    openFileList(true, {
      id: record.materialDevelopImportId,
      downloadApi: fileDownload,
      listApi: getFiles,
      hideVersion: true,
    });
  }

  function handleAfterUpload() {
    gridApi.grid.setRow(currentUploadId.value, {
      testReportId: '--',
    });
  }
  function validateInput(input) {
    const regex = /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/;
    return regex.test(input);
  }
  async function handleSubmit(type) {
    changeOkLoading(true);
    let isOk = true;
    const params = gridApi.getDataSource().map(item => {
      if (!validateInput(item.materialCode)) {
        isOk = false;
        changeOkLoading(false);
        return message.info(t('dict.metarial.codeTip'));
      }
      return {
        id: item.id,
        materialCode: item.materialCode,
        mainProcess: item.mainProcess,
      };
    });
    if (!isOk) {
      return;
    }
    try {
      const r = type == 'storage' ? await storageDc(params) : await updateDc(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      changeOkLoading(false);
    }
  }
</script>

<style scoped lang="less">
  .popup-container {
    display: flex;
    flex-direction: column;
  }
</style>
