<template>
  <BasicModal
    :title="title"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="600"
    @register="registerModal"
    @ok="handleSubmit"
    destroy-on-close
    :showOkBtn="!!operation"
    :cancelText="t('common.closeText')">
    <a-button v-if="operation" class="ml-12px" type="primary" ghost @click="handleUpload">{{ t('common.uploadText') }}</a-button>
    <Grid style="height: 300px">
      <template #File="{ row }">
        <div class="table-a" @dblclick="handlePreview(row.fileUrl, row.fileName)">
          {{ row.fileName }}
        </div>
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
    <PreviewModal ref="filePreviewRef" />
    <UploadModal @register="registerUpload" @getTable="getDrawingList" :title="t('common.uploadText')" :single="true" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref } from 'vue';
  import { PreviewModal } from '/@/components/Upload';
  import { uploaddraw } from '/@/api/engineering/mould';
  import { uploadfiles } from '/@/api/basic/common';
  import { TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadFn } from '/@/views/engineering/mouldRoom/newMold/util';
  import { useModal } from '/@/components/Modal';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  const { t } = useI18n();

  const emit = defineEmits(['reload']);
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(initData);

  const columns = ref([]);
  const operation = ref(false);
  const params = ref({
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    id: '',
  });
  const tableList = ref<any[]>([]);
  const title = ref('');

  const [Grid, { remove, reloadColumn, reloadData, loadData, getDataSource, insertAt }] = useVbenVxeGrid({
    gridOptions: {
      columns: columns.value,
      // i18nConfig: {
      //   moduleCode: 'PartNumberApplyColumn',
      // },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
    },
  });

  function getTableActions(row) {
    if (operation.value) {
      return [
        {
          icon: 'icon-ym icon-ym-btn-clearn',
          onClick: handleDelete.bind(null, row),
          tooltip: '删除',
          // auth: 'btn_detail',
        },
        {
          icon: 'icon-ym icon-ym-download',
          onClick: handleDownload.bind(null, row),
          tooltip: '下载',
          // auth: 'btn_detail',
        },
      ];
    } else {
      return [
        {
          icon: 'icon-ym icon-ym-download',
          onClick: handleDownload.bind(null, row),
          tooltip: '下载',
          // auth: 'btn_detail',
        },
      ];
    }
  }

  function handleUpload() {
    openUpload(true, {
      api: uploadfiles,
    });
  }

  function getDrawingList(list) {
    const drawingList = list.map(item => {
      return {
        fileName: item.originFileName,
        fileUrl: item.fullPath,
      };
    });
    // for (let i = 0; i < drawingList.length; i++) {
    //   insertAt(drawingList[i], 0);
    // }

    const newList = [...(drawingList || []), ...getDataSource()];
    loadData(newList);
  }

  const handleDelete = row => {
    remove(row);
  };

  const handleSubmit = async () => {
    const list = getDataSource();
    const fileNames = list.map(item => item.fileName).join(',');
    const fileUrls = list.map(item => item.fileUrl).join(',');
    const queryParams = {
      [params.value.fileName]: fileNames,
      [params.value.fileUrl]: fileUrls,
      id: params.value.id,
    };
    await api.value(queryParams);
    emit('reload');
    closeModal();
  };

  const handleDownload = row => {
    downloadFn(row.fileUrl, row.fileName);
  };

  const filePreviewRef = ref<any | null>(null);
  const handlePreview = (filePath, fileName) => {
    // if (!hasBtnP('btn_detail')) return createMessage.warning('当前账号暂无查看权限');
    const params = {
      name: fileName,
      filePath: filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  };

  const api = ref<any>('');
  function initData(data) {
    operation.value = data.operation;
    columns.value = data.column;
    title.value = data.title;
    api.value = data.api ? data.api : uploaddraw;
    reloadColumn(data.column);
    reloadData(data.list);
    tableList.value = data.list;
    if (data.params) {
      params.value = data.params;
    }
  }
</script>
