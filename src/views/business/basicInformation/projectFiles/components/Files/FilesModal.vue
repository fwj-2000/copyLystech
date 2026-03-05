<template>
  <BasicModal v-bind="$attrs" :width="900" :title="t('common.attachment')" :show-ok-btn="false" destroyOnClose @register="registerModal">
    <div>
      <a-tabs v-model:activeKey="state.currentModule" @change="query" class="h-full">
        <a-tab-pane v-for="item in state.projDocModule" :key="item.enCode" :tab="item.fullName"></a-tab-pane>
      </a-tabs>
      <Grid :style="{ minHeight: '450px' }">
        <template #files="{ row }">
          <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
        </template>
        <template #nodeDetail="{ row }">
          <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
        </template>
        <template #action="{ row }">
          <TableAction :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>

    <PreviewModal ref="filePreviewRef" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { reactive, ref } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { getPagingList, downloadProjFiles } from '/@/api/business/projectFiles';
  import { IS_ENABLE_LIST } from '/@/components/CustomComponents/src/Constant';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const state = reactive<any>({
    projDocModule: [],
    currentModule: 'ESI',
    apiParams: {},
  });

  const [Grid, { query }] = useVbenVxeGrid({
    gridOptions: {
      api: getPagingList,
      columns: [
        {
          title: '文件类型',
          field: 'fileTypeName',
          minWidth: 200,
        },
        { field: 'files', title: '附件', slots: { default: 'files' } },
        {
          field: 'version',
          title: '版本',
          width: 100,
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
        { field: 'handlerName', title: '当前处理人', i18nField: 'CommonCol.currentNodeUser' },
        { field: 'currentNodeName', title: '当前节点', i18nField: 'CommonCol.currentNode' },
        { field: 'nodeDetail', title: '节点详情', slots: { default: 'nodeDetail' }, i18nField: 'CommonCol.nodeDetail' },
        { field: 'action', title: '操作', width: 60, fixed: 'right', slots: { default: 'action' } },
      ],
      toolbarConfig: {
        enabled: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...state.apiParams,
          stage: state.currentModule,
          pageTag: '2',
        };
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProjDocColumn',
      },
      position: 'modal',
    },
  });
  const [registerModal] = useModalInner(init);
  const baseStore = useBaseStore();
  async function init(data) {
    state.currentModule = data.currentStage || 'ESI';
    state.apiParams = data.params || {};
    // 获取动态参数
    if (data.states) {
      state.projDocModule = data.states;
    } else {
      state.projDocModule = (await baseStore.getDictionaryData('projDocStage')) || [];
    }
    query();
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-download',
        tooltip: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  // 下载文件
  async function handleDownload(item) {
    console.log(item, 'item');
    downloadProjFiles([item.id]).then(({ code, msg, data }) => {
      if (code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        const { downloadVo, downloadName } = data;
        downloadByUrl({ url: downloadVo.url, target: '_blank', fileName: downloadName });
      } else {
        createMessage.error(msg);
      }
    });
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

  // 节点详情
  async function handleNodeModal(row) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: row.id,
    });
  }
</script>
