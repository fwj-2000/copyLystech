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
    <template #insertToolbar>
      <a-button class="mr-3" @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
      <a-divider type="vertical" class="ml-10px"></a-divider>
    </template>
    <ScrollContainer class="p-10px">
      <Subtitle :title="t('dict.metarial.inputMetarial')"></Subtitle>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'files'">
            <span class="table-a" @click="handleFileView(record)">{{ t('dict.DocumentControlColumn.files') }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record)" />
          </template>
        </template>
      </BasicTable>
      <!-- <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }">
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </VxeBasicTable> -->
    </ScrollContainer>
    <UploadModal @register="registerUpload" @success="handleAfterUpload" />
    <FileListModal @register="registerFileList"></FileListModal>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { addCols, getMainProcess } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useTable, ActionItem, TableAction } from '/@/components/Table';
  import { updateDc, getDetails, storageDc } from '/@/api/structure/materialCode';
  import {
    fileDownload,
    getFiles,
    upload,
    // enableFile,
    // disableFile,
  } from '/@/api/purchase/importMateria';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  // import { BasicTableProps, VxeBasicTable, VxeGridInstance, VxeGridPropTypes } from '/@/components/VxeTable';
  import { useModal } from '/@/components/Modal';
  import { FileListModal, UploadModal } from '/@/components/Upload';
  import { ref, reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [registerTable, { setTableData, getDataSource, deleteTableDataRecord, updateTableDataRecord, setColumns }] = useTable({
    columns: addCols,
    pagination: false,
    showTableSetting: false,
    striped: true,
    canResize: true,
    rowkey: 'id',
    resizeHeightOffset: 20,
    actionColumn: {
      title: t('common.action'),
      dataIndex: 'action',
      width: 130,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  onMounted(async () => {
    const r = await getMainProcess();
    addCols.forEach(el => {
      if (el.dataIndex == 'mainProcess') {
        el.editComponentProps = {
          options: r,
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        };
      }
    });
  });

  // const tableRef = ref<VxeGridInstance>();
  // const tableList = ref([]);

  // const gridOptions = reactive<BasicTableProps>({
  //   id: 'VxeTable',
  //   keepSource: true,
  //   editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
  //   mouseConfig: {
  //     area: true, // 是否开启区域选取
  //     extension: false,
  //   },
  //   columns: addCols,
  //   columnConfig: {
  //     resizable: true,
  //   },
  //   data: tableList,
  //   toolbarConfig: {
  //     buttons: [
  //       {
  //         content: '在第一行新增',
  //         buttonRender: {
  //           name: 'AButton',
  //           props: {
  //             type: 'primary',
  //             preIcon: 'mdi:page-next-outline',
  //           },
  //           events: {
  //             click: () => {
  //               tableRef.value?.insert({ name: '新增的' });
  //               createMessage.success('新增成功');
  //             },
  //           },
  //         },
  //       },
  //       {
  //         content: '在最后一行新增',
  //         buttonRender: {
  //           name: 'AButton',
  //           props: {
  //             type: 'warning',
  //           },
  //           events: {
  //             click: () => {
  //               tableRef.value?.insertAt({ name: '新增的' }, -1);
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   height: 'auto',
  //   proxyConfig: {
  //     enabled: false,
  //   },
  // });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        setTableData(
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
        onClick: handleDelete.bind(null, record.id),
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
  function handleDelete(id = '') {
    deleteTableDataRecord(id);
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
    updateTableDataRecord(currentUploadId.value, {
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
    const params = getDataSource().map(item => {
      if (!validateInput(item.materialCode)) {
        isOk = false;
        changeOkLoading(false);
        return message.info(t('dict.metarial.codeTip'));
      }
      return {
        id: item.id,
        materialCode: item.materialCode,
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
