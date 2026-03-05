<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- 项目资料维护 -->
            <a-button v-if="isTodoList" type="primary" v-auth="'btn_uploadFiles'" @click="handleUploadFiles">{{
              t('routes.business-basicInformation-projectFiles-maint')
            }}</a-button>
            <!-- 升版 -->
            <a-button v-if="isTodoList" type="primary" ghost v-auth="'btn_upgradeFiles'" @click="showUpgradeModal">{{ t('common.upgrade') }}</a-button>
            <!-- 撤回 -->
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
            <!-- 下载附件 -->
            <a-button v-auth="'btn_downloadFiles'" @click="handleDownloadFiles">{{ t('common.downFiles') }}</a-button>
            <!-- 批量删除 -->
            <ModelConfirmButton
              v-if="isTodoList"
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
          <!-- <template #applyCode="{ row }">
            <span class="table-a" @click="handleDetail(row)">{{ row.applyCode }}</span>
          </template> -->
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
    <FilesModal @register="registerFiles"></FilesModal>
    <PreviewModal ref="filePreviewRef" />
    <UpgradeModal @register="registerUpgradeModal" @reload="handleupgradeFiles" />

    <Teleport to="#BusinessProjectFilesMaint">
      <ApplyPop @register="registerApplyPop" @refresh="reload" />
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPagingList, bulkDeleteProjFiles, downloadProjFiles, bulkWithdrawProjFiles } from '/@/api/business/projectFiles';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import ApplyPop from './ApplyPopupVxe.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './dataTableConfig';
  import { ModelConfirmButton } from '/@/components/Button';
  import FilesModal from '../../components/Files/FilesModal.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useBaseStore } from '/@/store/modules/base';
  import { TABS_ENUM } from '../config';
  import UpgradeModal from './upgradeModal.vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();

  defineOptions({ name: 'business-basicInformation-projectFiles-maint' });

  const props = defineProps({
    type: {
      type: String,
      default: '1',
    },
  });

  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerFiles, { openModal: openFiles }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  /**
   * 当前是否为`待处理`列表
   */
  const isTodoList = computed(() => props.type === TABS_ENUM.待处理);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
      // i18nConfig: {
      //   moduleCode: 'WarehouseBaseColumn',
      //   transferRange: ['placeholder'],
      // },
      handleValuesChange: handleValuesChange,
    },
    gridOptions: {
      id: `business-basicInformation-projectFiles-maint-${isTodoList.value ? 'todo' : 'done'}List`,
      showIndexColumn: true,
      columns: columnsVxe,
      api: (params: any) => getPagingList({ ...params, dataFilter: props.type }),
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
  const { getSelectRowKeys, reload, clearSelectedRowKeys, getSelectRows, updateSchema, setFieldValue } = gridApi;

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

  // 项目资料维护
  const handleUploadFiles = async () => {
    const rows = getSelectRows() || [];

    if (rows.length === 0) {
      return createMessage.info(t('common.selectText'));
    }

    let isUpgrade = 1;
    let isUploadFile = 1;

    rows.forEach(item => {
      if (`${item.version}` !== '0') {
        if (isUploadFile) {
          isUploadFile = 0;
        }
      } else if (isUpgrade) {
        isUpgrade = 0;
      }
    });

    // 异或操作，必须一真一假，确保只有一种操作
    if (!(isUpgrade ^ isUploadFile)) {
      return createMessage.warning(t('dict.ProjDoc.selectedVersionTip'));
    }

    openApplyPopup(true, {
      mode: isUploadFile ? 'uploadFile' : isUpgrade ? 'upgrade' : 'view',
      list: rows,
      setDefaultAudit: true,
    });
  };

  // 升版附件
  const handleupgradeFiles = async (rows: Array<any>) => {
    // const rows = getSelectRows() || [];
    if (rows.length) {
      // 结束节点，才能升级
      if (rows.some(item => item.currentNode != 'End')) {
        return createMessage.info(t('common.upgradeTip'));
      }
      return openApplyPopup(true, {
        mode: 'upgrade',
        list: rows,
        setDefaultAudit: true,
      });
    }
    createMessage.info(t('common.selectText'));
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
  const handleDetail = async row => {
    // 当节点为申请时：版本号为0时，表示新增，否则为升级
    // 当节点为其他时：点击查看详情
    const { currentNode } = row;
    let mode = 'view';
    if (currentNode == 'ApplyNode') {
      mode = row.version == 0 ? 'add' : 'upgrade';
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
      await bulkDeleteProjFiles(idList);
      createMessage.success(t('sys.api.operationSuccess'));
      clearSelectedRowKeys();
      return reload();
    }
    createMessage.info(t('common.selectText'));
  };

  const [registerUpgradeModal, { openModal: openUpgradeModal }] = useModal();
  /** 打开升版勾选弹窗 */
  function showUpgradeModal() {
    openUpgradeModal(true, {});
  }
</script>
