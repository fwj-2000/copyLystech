<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    showOkBtn
    :title="t('common.drawingAttachmentUpload')"
    destroyOnClose
    class="full-popup p-10px">
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'attachmentName'">
          {{ text === '' ? t('common.pendingUpload') : text }}
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <!-- <UploadAttach @register="registerUploadAttach" @reload="updateAttach" /> -->
    <UploadModal v-bind="uploadState" @register="registerUploadAttach" @success="updateAttachFile" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive } from 'vue';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useBaseStore } from '/@/store/modules/base';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { UploadModal } from '/@/components/Upload';
  import UploadAttach from '/@/views/engineering/drawing/drawingReview/components/UploadAttach.vue';
  import { saveReviewResultBatch } from '/@/api/engineering/engineeringReview';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { postDrawingsReviewUploadAttach } from '/@/api/engineering/drawingReview';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerUploadAttach, { openModal: openUploadAttach }] = useModal();
  const state = reactive({
    current: {},
  });
  const uploadState = reactive({
    title: t('dict.DrawingsReviewColumn.uploadDrawingReviewAttachments'),
    param: {},
    mutiple: false,
    api: postDrawingsReviewUploadAttach,
  });
  const baseStore = useBaseStore();

  const columns: BasicColumn[] = [
    {
      title: '来源单号',
      dataIndex: 'originCode',
      width: 150,
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      width: 150,
    },
    {
      title: '附件',
      dataIndex: 'attachmentName',
      width: 150,
    },
    {
      title: '评审结论',
      dataIndex: 'reviewResult',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: () => {
          return baseStore.getDictionaryData('DrawingsReview.ReviewResult');
        },
        labelField: 'fullName',
        valueField: 'enCode',
      },
      width: 130,
    },
    {
      title: '工程资料制作',
      dataIndex: 'makeEngineeringInfo',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: () => {
          return baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo');
        },
        labelField: 'fullName',
        valueField: 'enCode',
      },
      width: 130,
    },
    {
      title: 'DFM',
      dataIndex: 'dfm',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: () => {
          return baseStore.getDictionaryData('DrawingsReview.DFM');
        },
        labelField: 'fullName',
        valueField: 'enCode',
      },
      width: 130,
    },
    {
      title: 'PD Leader',
      dataIndex: 'pdLeader',
      editRow: true,
      editComponent: 'CustomUserSelect',
      editComponentProps: {
        placeholder: 'PD Leader',
        allowClear: true,
        showSearch: true,
      },
      width: 180,
    },
    {
      title: 'EPM',
      dataIndex: 'epm',
      editRow: true,
      editComponent: 'CustomUserSelect',
      editComponentProps: {
        placeholder: 'EPM',
        allowClear: true,
        showSearch: true,
      },
      width: 180,
    },
  ];
  const [registerTable, { setTableData, getDataSource, updateTableDataRecord }] = useTable({
    rowKey: 'id',
    columns: columns,
    showIndexColumn: false,
    showTableSetting: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
    },
  });

  function handleSaveAction() {
    const tableData = getDataSource();
    const params = tableData.map(item => ({
      id: item.id,
      reviewResult: item.reviewResult,
      makeEngineeringInfo: item.makeEngineeringInfo,
      dfm: item.dfm,
      pdLeader: item.pdLeader,
      epm: item.epm,
    }));
    changeLoading(true);
    saveReviewResultBatch(params)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          closePopup();
          emit('reload');
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function updateAttach(data) {
    const { name, reviewId } = data;
    updateTableDataRecord(reviewId, {
      attachmentName: name,
    });
  }
  async function updateAttachFile(id, data) {
    const { fileList } = data;
    console.log(fileList);
    updateTableDataRecord(id, {
      attachmentName: fileList[0].name,
    });
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    return [
      {
        label: '上传附件',
        onClick: handleAttach.bind(null, record),
      },
    ];
  }

  function onEditChange({ column, value, record }) {
    if (column.dataIndex === 'reviewResult') {
      const {
        editValueRefs: { dfm },
      } = record;
      if (value == '2') dfm.value = '1';
    }
  }

  function handleAttach(record: EditRecordRow) {
    const { id, originCode, originType, insidePartNumber } = record;
    state.current = record;
    uploadState.param = {
      id,
      reviewId: id,
      originCode,
      originType,
      insidePartNumber,
    };
    openUploadAttach(true, {
      reviewId: id,
      originCode,
      originType,
      insidePartNumber,
    });
  }

  async function init(data) {
    const rowData = data.map(item => ({
      attachmentName: item.attachmentName, //没这个属性 后面更新文件名 没有响应
      ...item,
      onEdit: true,
      editable: true,
    }));
    console.log(rowData);
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 300);
    setTableData(cloneDeep(rowData));

    // const timeoutData = [...rowData, rowData[0]];
    // setTimeout(() => {
    //   setTableData(cloneDeep(timeoutData));
    // }, 3000);
  }
</script>
