<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleAdd">{{ t('common.add2Text') }}</a-button>
              <a-button type="primary" v-auth="'btn_registration'" ghost @click="handleSyncProductStage">{{ t('dict.CommonCol.Registration') }}</a-button>
              <a-button type="primary" v-auth="'btn_agree'" ghost @click="approval('resolve')">{{ t('dict.MoldApply.ModifyResult.1') }}</a-button>
              <a-button type="primary" v-auth="'btn_reject'" ghost @click="approval('reject')">{{ t('dict.MoldApply.DrawingStatus.4') }}</a-button>
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                </template>
                <a-button>{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
            </a-space>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <AddPopup @register="registerAddPopup" @reload="reload"></AddPopup>
    <ImportModal @register="registerImportPop" @refresh="reload" @close="reload"></ImportModal>
    <RegistrationReminder @register="registerRegistrationReminder" />
    <RejectModal @register="registerRejectModal" @reload="reload"></RejectModal>
  </div>
</template>
<script lang="ts" setup>
  import { ActionItem } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema, column, dropDownList } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import AddPopup from './components/AddPopup.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { maintenanceCqeExportData } from '/@/api/engineering/clientRollout';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { usePopup } from '/@/components/Popup';
  import {
    getCrossBgSupport,
    getExportList,
    deleteCrossBgSupport,
    importPreview,
    importSave,
    templateDownload,
    approvalData,
  } from '/@/api/hr/personRegistration';
  import RegistrationReminder from './components/RegistrationReminder.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { createMessage, createConfirm } = useMessage();
  defineOptions({ name: 'hrBis-personRegistration' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 1 : 2;
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerRegistrationReminder, { openModal: openRegistrationReminder, closeModal: closeRegistrationModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [Grid, { reload, getSelectRows, getFetchParams, getSelectRowKeys, updateSchema }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formSchema(),
    },
    gridOptions: {
      id: 'hrBis-personRegistration-list',
      columns: column() as any,
      api: getCrossBgSupport,
      showIndexColumn: true,
      virtualYConfig: {
        scrollToTopOnChange: true,
      },
      beforeFetch: params => {
        return {
          ...params,
          identification: status.value,
        };
      },
    },
  });

  function batchImportOrExport({ key }) {
    if (key === 'import') {
      batchImportFile();
    }
    if (key === 'export') {
      handleExport();
    }
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      usePolling: false,
      previewColumn: column(true),
      excludeFields: ['creatorName', 'creatorTime', 'lastModifyUserName', 'lastModifyTime', 'supportDays', 'annualSupportDays'],
    });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
    ];
  }
  function handleAdd() {
    openAddPopup(true, { DropDownList: dropDownList, record: {} });
  }
  //编辑
  function handleEdit(record) {
    openAddPopup(true, { DropDownList: dropDownList, record });
  }

  // 批量删除
  const handelDelete = async () => {
    const list = getSelectRows();
    if (!list.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.id);
        const res = await deleteCrossBgSupport(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };
  // 登记提醒
  const handleSyncProductStage = () => {
    openRegistrationReminder(true, {});
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      api: getExportList,
      listQuery: await getFetchParams(),
      exportOptions: column(),
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const approval = async status => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      if (status === 'resolve') {
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          content: `确定要通过吗?`,
          onOk: () => {
            approvalData({ approvalStatus: true, id: idList }).then(({ msg }) => {
              createMessage.success(t(msg));
              reload();
            });
          },
          onCancel: () => {},
        });
      } else {
        openRejectModal(true, {
          id: idList,
          api: approvalData,
          beforeFetch: params => {
            return {
              rejectReason: params.rejectRemark,
              approvalStatus: false,
              id: idList,
            };
          },
          submitCallback: () => {
            reload();
          },
        });
      }
      return;
    }
    createMessage.info(t('common.selectText'));
  };
  const exportAction = query => {
    maintenanceCqeExportData(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };
  defineExpose({ reload });
</script>
