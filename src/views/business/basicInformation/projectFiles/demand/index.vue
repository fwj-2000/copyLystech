<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_add'" @click="handleAdd">{{ t('routes.business-basicInformation-projectFiles-demand') }}</a-button>
            <ModelConfirmButton
              v-auth="'btn_recall'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
              }">
              <span>{{ t('common.revoke') }}</span>
            </ModelConfirmButton>
            <a-button v-auth="'btn_downloadFiles'" @click="handleDownloadFiles">{{ t('common.downFiles') }}</a-button>
            <ModelConfirmButton
              type="primary"
              ghost
              danger
              v-auth="'btn_batchRemove'"
              v-bind="{
                modelConfirm: {
                  onOk: handleDel.bind(null),
                },
              }">
              <span>{{ t('common.batchDelText') }}</span>
            </ModelConfirmButton>
          </template>
          <template #applyCode="{ row }">
            <span class="table-a" @click="handleDetail(row)">{{ row.applyCode }}</span>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #files="{ row }">
            <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ApplyPop @register="registerApplyPop" @refresh="reload" />
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPagingList, bulkDeleteProjFiles, downloadProjFiles, bulkWithdrawProjFiles } from '/@/api/business/projectFiles';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import ApplyPop from './components/ApplyPopupVxe.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './config';
  import { ModelConfirmButton } from '/@/components/Button';
  import { NodeModal } from '/@/components/CustomComponents';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  defineOptions({ name: 'business-basicInformation-projectFiles-demand' });

  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
    },
    gridOptions: {
      id: 'business-basicInformation-projectFiles-demand-list',
      showIndexColumn: true,
      columns: columnsVxe as any,
      api: getPagingList,
      beforeFetch: params => {
        return {
          ...params,
          pageTag: 1,
        };
      },
      i18nConfig: {
        moduleCode: 'ProjDocColumn',
      },
    },
  });
  const { getSelectRowKeys, reload, clearSelectedRowKeys } = gridApi;

  // 撤回
  const handleRecall = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkWithdrawProjFiles(idList).then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      });
    }
    createMessage.info(t('common.selectText'));
  };

  /**
   * 新增
   */
  const handleAdd = async () => {
    openApplyPopup(true, {
      mode: 'add',
      setDefaultAudit: true,
    });
  };

  // 下载附件
  const handleDownloadFiles = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return downloadProjFiles(idList).then(({ code, msg, data }) => {
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
    }
    createMessage.info(t('common.selectText'));
  };

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }
  // 详情
  const handleDetail = async (row: any) => {
    // 只有`待提交(1)`、`撤回(4)`、`驳回(5)`等状态可以编辑
    const editStatusList = [1, 4, 5];
    openApplyPopup(true, {
      mode: editStatusList.includes(row.status) ? 'edit' : 'view',
      list: [row],
      setDefaultAudit: false,
    });
  };

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  // 删除
  const handleDel = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      await bulkDeleteProjFiles(idList);
      createMessage.success(t('sys.api.operationSuccess'));
      clearSelectedRowKeys();
      return reload();
    }
    createMessage.info(t('common.selectText'));
  };

  // useRouteParams({ id: {} }, params => {
  //   getQuantationReviewInfo([params.id]).then(res => {
  //     const item = res.data[0];
  //     const { productionType } = item;
  //     openSelfOutModal([params.id], productionType == 1);
  //   });
  // });
</script>
