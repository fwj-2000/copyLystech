<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getTemplateManagementList, postTemplateManagementByDiabled, postTemplateManagementById } from '/@/api/basicData/templateManage';
  import { getColumns, getSchema } from '/@/views/basicData/templateManagement/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { DETAIL_PAGE_TYPE_ENUM } from '/@/views/engineering/basicInformation/semifinishedproducts/config';
  import DetailPopup from './components/detailPopup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { ref } from 'vue';
  import { downloadFile } from '/@/utils/file/download';

  const { t } = useI18n();

  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  defineOptions({ name: 'templateManagement' });

  const { createMessage } = useMessage();
  const filePreviewRef = ref<any | null>(null);

  const [Grid, { getSelectRows, reload, getSelectRowKeys }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getSchema(),
    },
    gridOptions: {
      id: 'basicData-templateManagement-list',
      columns: getColumns(),
      api: getTemplateManagementList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
    },
  });

  const handleEdit = (type: string) => {
    if (type === DETAIL_PAGE_TYPE_ENUM.新增) {
      return openDetailPopup(true, { type });
    }
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    return openDetailPopup(true, { type, rows: selectedRows });
  };

  function handleEnable() {
    const selectKeys = getSelectRowKeys();
    postTemplateManagementById(selectKeys).then(() => {
      createMessage.success(t('sys.api.operationSuccess'));
      reload();
    });
  }
  function handleDisabled() {
    const selectKeys = getSelectRowKeys();
    postTemplateManagementByDiabled(selectKeys).then(() => {
      createMessage.success(t('sys.api.operationSuccess'));
      reload();
    });
  }

  // 拼接下载路径
  function getDownloadParams(item): {
    filePath: string;
    fileName: string;
    version: '2';
  } {
    const { fileName, moduleEnCode } = item;
    let filePath = item.filePath || '';
    if (filePath == '') {
      filePath = `/TemplateFile/${moduleEnCode}/${fileName}`;
    }
    return {
      filePath,
      fileName,
      version: '2',
    };
  }

  function handleDownload() {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    if (selectedRows.length !== 1) {
      return createMessage.warning(t('common.selectOneText'));
    }
    downloadFile(getDownloadParams(selectedRows[0]));
    // const params = {
    // 	id: selectedRows.map(item => item.id),
    // }
    // downloadTemplateManagement({
    //   moduleEnCode: selectedRows[0].moduleEnCode,
    //   name: selectedRows[0].name,
    //   language: selectedRows[0].language,
    // })
  }

  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleEdit(DETAIL_PAGE_TYPE_ENUM.新增)" type="primary">{{ t('common.add2Text') }} </a-button>
              <a-button @click="handleEdit(DETAIL_PAGE_TYPE_ENUM.修改)" type="primary" ghost>{{ t('common.updateText') }} </a-button>
              <a-button @click="handleEnable">{{ t('common.enableText') }} </a-button>
              <a-button @click="handleDisabled" danger>{{ t('common.disableText') }} </a-button>
              <a-button @click="handleDownload">{{ t('common.downFiles') }} </a-button>
            </a-space>
          </template>
          <template #files="{ row }">
            <FileCell :list="[{ fileName: row.fileName, filePath: row.filePath }]" @click="handlePreview"></FileCell>
          </template>
        </Grid>
      </div>
    </div>
    <DetailPopup @register="registerDetailPopup" @reload="reload" />
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>
