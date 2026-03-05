<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_add'" @click="handleApply">{{ t('routes.business-basicInformation-projectFiles-qsPublish') }}</a-button>
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
            <span class="table-a" @click="handleDetail(row)">{{ row.problemReleaseNo }}</span>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #files="{ row }">
            <span class="table-a" @click="handlePreview(row)">{{ row.problemReleaseFiles ? t('common.searchDetail') : '' }}</span>
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
  import { getQsList, bulkDeleteQs, bulkWithdrawQs, getNodeDetail } from '/@/api/business/projectQs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import ApplyPop from './components/ApplyPopup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './config';
  import { ModelConfirmButton } from '/@/components/Button';
  import { NodeModal } from '/@/components/CustomComponents';
  import { PreviewModal } from '/@/components/Upload';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  defineOptions({ name: 'business-basicInformation-projectFiles-qsPublish' });

  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: false,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
      // i18nConfig: {
      //   moduleCode: 'WarehouseBaseColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'business-basicInformation-projectFiles-qsPublish',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getQsList,
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

  // 申请
  const handleApply = async () => {
    openApplyPopup(true, {
      mode: 'add',
    });
  };

  // 撤回
  const handleRecall = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkWithdrawQs(idList).then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      });
    }
    createMessage.info(t('common.selectText'));
  };

  //  文件预览
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      fileList: item.problemReleaseFiles,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }
  // 详情
  const handleDetail = async row => {
    const { currentNode, status } = row;
    let mode = 'view';
    // 当前节点为问题发布，或状态为未发布
    if (status == 0 || currentNode == 'ProblemRelease') {
      mode = 'add';
    }
    openApplyPopup(true, {
      mode: mode,
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
      await bulkDeleteQs(idList);
      createMessage.success(t('sys.api.operationSuccess'));
      clearSelectedRowKeys();
      return reload();
    }
    createMessage.info(t('common.selectText'));
  };
</script>
