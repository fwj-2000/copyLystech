<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :title="t('common.upgrade')"
    :show-ok-btn="true"
    destroyOnClose
    :okText="t('common.confirm')"
    @register="registerModal"
    @ok="handleSubmit">
    <div>
      <Grid :style="{ minHeight: '450px' }">
        <template #files="{ row }">
          <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
        </template>
      </Grid>
    </div>
  </BasicModal>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref } from 'vue';
  import { getPagingList } from '/@/api/business/projectFiles';
  import { IS_ENABLE_LIST } from '/@/components/CustomComponents/src/Constant';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['reload', 'register']);

  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      api: getPagingList,
      columns: [
        { field: 'checkbox', minWidth: 50, type: 'checkbox' },
        {
          title: '产品内部料号',
          field: 'insidePartNumber',
          minWidth: 200,
          // @ts-ignore
          filters: [{ data: '' }],
          filterRender: {
            name: 'Input',
          },
        },
        {
          title: '工厂',
          field: 'factory',
          minWidth: 200,
        },
        {
          title: '阶段',
          field: 'stageName',
          minWidth: 200,
        },
        {
          title: '文件类型',
          field: 'fileTypeName',
          minWidth: 200,
        },
        { field: 'files', title: '附件', slots: { default: 'files' } },
        {
          field: 'version',
          title: '版本',
          width: 120,
          formatter: ({ cellValue }) => {
            return `T${cellValue}`;
          },
        },
        {
          title: '是否启用',
          field: 'enable',
          i18nField: 'CommonCol.isEnable',
          minWidth: 150,
          cellRender: {
            name: 'Tag',
            // @ts-ignore
            options: IS_ENABLE_LIST,
          },
          // @ts-ignore
          filters: [{ data: '' }],
          filterRender: {
            name: 'VxeSelect',
            // @ts-ignore
            options: IS_ENABLE_LIST,
          },
        },
        {
          title: '上传人',
          field: 'creatorUserName',
          minWidth: 180,
        },
        {
          field: 'creatorTime',
          title: '上传时间',
          cellRender: {
            name: 'Date',
          },
        },
      ],
      toolbarConfig: {
        enabled: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          pageTag: 2,
          status: 3,
        };
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProjDocColumn',
      },
      position: 'modal',
    },
  });
  const [registerModal, { closeModal }] = useModalInner(init);
  async function init() {
    reload();
  }

  //  文件预览
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  function handleSubmit() {
    const selectedRows = getSelectRows();
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    emit('reload', selectedRows);
    closeModal();
  }
</script>
