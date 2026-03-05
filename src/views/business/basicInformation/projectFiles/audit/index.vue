<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="3" :tab="t('common.todoText')" class="h-full">
            <Grid>
              <template #toolbar-actions>
                <ModelConfirmButton
                  type="primary"
                  v-auth="'btn_agree'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.agreenOperationText'),
                      onOk: handleAgree.bind(null),
                    },
                  }">
                  <span>{{ t('common.agree') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }} </a-button>
                <a-button v-auth="'btn_downloadFiles'" @click="handleDownloadFiles">{{ t('common.downFiles') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #files="{ row }">
                <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-button v-auth="'btn_downloadFiles'" @click="handleDownloadFiles">{{ t('common.downFiles') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #files="{ row }">
                <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <RejectModal @register="registerRejectModal" @reload="reload"></RejectModal>
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadProjFiles, getPagingList, rejectProjFiles, submitProjFiles } from '/@/api/business/projectFiles';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './config';
  import { ModelConfirmButton } from '/@/components/Button';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useBaseStore } from '/@/store/modules/base';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();

  defineOptions({ name: 'business-basicInformation-projectFiles-aduit' });

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const state = reactive({
    activeKey: '3',
  });

  const formOptions = {
    commonConfig: {
      labelClass: 'w-0',
    },
    showCollapseButton: true,
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: formSchema,
    handleValuesChange: handleValuesChange,
    // i18nConfig: {
    //   moduleCode: 'WarehouseBaseColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const gridOptions = {
    showIndexColumn: true,
    columns: columnsVxe,
    api: getPagingList,
    beforeFetch: params => {
      return {
        ...params,
        pageTag: 1,
        dataFilter: state.activeKey,
      };
    },
    i18nConfig: {
      moduleCode: 'ProjDocColumn',
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      ...gridOptions,
      id: 'business-basicInformation-projectFiles-aduit-Todo',
    },
  });
  const [GridDone, gridApiDone] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      ...gridOptions,
      id: 'business-basicInformation-projectFiles-aduit-Done',
    },
  });

  const {
    getSelectRowKeys: getSelectRowKeysTodo,
    reload: reloadTodo,
    clearSelectedRowKeys: clearSelectedRowKeysTodo,
    updateSchema: updateSchemaTodo,
  } = gridApi;
  const {
    getSelectRowKeys: getSelectRowKeysDone,
    reload: reloadDone,
    clearSelectedRowKeys: clearSelectedRowKeysDone,
    updateSchema: updateSchemaDone,
  } = gridApiDone;

  function getSelectRowKeys() {
    return state.activeKey == '3' ? getSelectRowKeysTodo() : getSelectRowKeysDone();
  }
  function reload() {
    return state.activeKey == '3' ? reloadTodo() : reloadDone();
  }
  function clearSelectedRowKeys() {
    return state.activeKey == '3' ? clearSelectedRowKeysTodo() : clearSelectedRowKeysDone();
  }
  function updateSchema(schema) {
    return state.activeKey == '3' ? updateSchemaTodo(schema) : updateSchemaDone(schema);
  }

  async function handleValuesChange(values) {
    const { stage } = values;
    if (stage) {
      // 选择阶段后，清空fileType 变更fileType的options
      // setFieldValue('fileType', '');
      const options = ((await baseStore.getDictionaryData(stage + 'FileType')) || []).map(item => {
        return {
          label: item.fullName,
          value: item.enCode,
        };
      });
      updateSchema([
        {
          fieldName: 'fileType',
          componentProps: {
            options: options,
          },
        },
      ]);
    }
  }

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  // 批量同意
  const handleAgree = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return submitProjFiles(idList).then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          reload();
          clearSelectedRowKeys();
        } else {
          createMessage.error(msg);
        }
      });
    }
    createMessage.info(t('common.selectText'));
  };

  // 批量拒绝
  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openRejectModal(true, {
        id: idList,
        api: rejectProjFiles,
        beforeFetch: params => {
          return {
            ...params,
            ids: idList,
          };
        },
      });
      return;
    }
    createMessage.info(t('common.selectText'));
  };

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

  // 批量下载
  const handleDownloadFiles = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      downloadProjFiles(idList).then(({ code, msg, data }) => {
        if (code == 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          // reload();
          clearSelectedRowKeys();
          const { downloadVo, downloadName } = data;
          downloadByUrl({ url: downloadVo.url, target: '_blank', fileName: downloadName });
        } else {
          createMessage.error(msg);
        }
      });
      return;
    }
    createMessage.info(t('common.selectText'));
  };
</script>
<style lang="less" scoped>
  @import url('/@/design/page.less');
</style>
