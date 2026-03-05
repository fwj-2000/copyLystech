<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_seniorManager'" type="primary" @click="hrFinalReviewHandle">{{ t('common.hrFinalReviewText') }}</a-button>
              <a-button v-auth="'btn_mentorAudit'" type="primary" @click="mentorReviewHandle">{{ t('common.mentorReviewText') }}</a-button>
              <a-button v-auth="'btn_rollback'" type="primary" @click="rollbackOrResignHandle">{{ t('common.rollbackOrResignText') }}</a-button>
              <a-button v-auth="'btn_edit'" @click="initiateExpediteHandle">{{ t('common.UrgingText') }}</a-button>
              <a-button v-auth="'btn_seniorManager'" @click="handleTrainTemplateConfig">{{ t('common.contentTemplateConfigText') }}</a-button>
              <a-button v-auth="'btn_edit'" class="ml-8px" danger @click="handleBatchDel">{{ t('common.batchDelText') }}</a-button>
              <a-button v-auth="'btn_edit'" @click="batchImportFile">
                {{ t('common.importText') }}
              </a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <PrintTrainCardPop @register="registerPrintPop" @reload="waitReload()" />
    <add @register="registerForm" @reload="waitReload()" />
    <ImportModal @register="registerImportPop" @reload="waitReload()"></ImportModal>
    <rollbackOrResign @register="registerRollbackOrResignForm" @reload="waitReload()" />
    <MentorAuditModal @register="registerMentorReviewForm" @reload="waitReload()" />
    <HrApplyPop @register="registerHrFinalReviewForm" @refresh="waitReload()"></HrApplyPop>
    <!-- <MentorApplyPop @register="registerMentorReviewForm" @refresh="waitReload()"></MentorApplyPop> -->
    <trainTemplateConfig @register="registerTrainTemplateConfigForm" @reload="waitReload()" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRefs } from 'vue';
  import {
    getEmployeeListV2,
    delEmployee,
    blukDeleteEmployeeInfo,
    templateDownloadV2,
    importPreviewV2,
    importData,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    saveImportData,
    bulkInitiateExpedite,
  } from '/@/api/hr/training/employee';
  import { BasicTable, useTable, TableAction, BasicColumn, FormProps, ActionItem } from '/@/components/Table';
  import { importTableColumns, getHrTrainFormConfig, getHrTrainPageColumns } from './config';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message, Table } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';
  import dayjs from 'dayjs';
  import { ImportModal } from '/@/components/ImportModal';
  import add from './components/add.vue';
  import trainTemplateConfig from './components/trainTemplateConfig.vue';
  import PrintTrainCardPop from './components/printTrainCardPop.vue';
  import rollbackOrResign from './components/rollbackOrResign.vue';
  import MentorAuditModal from './components/MentorAuditModal.vue';
  import HrApplyPop from './components/HrApplyPop.vue';
  import MentorApplyPop from './components/MentorApplyPop.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';

  defineOptions({ name: 'hr-employeeV2' });

  interface DicChildItem {
    isTree?: number;
    id: string;
    enCode: string;
    fullName: string;
  }
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const organizeStore = useOrganizeStore();

  const { hasBtnP } = usePermission();

  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();

  const [registerRollbackOrResignForm, { openModal: openRollbackOrResignModal }] = useModal();
  const [registerMentorReviewForm, { openModal: openMentorAuditModal }] = useModal();
  const [registerHrFinalReviewForm, { openPopup: openHrFinalReviewPopup }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerTrainTemplateConfigForm, { openModal: openTrainTemplateConfigModal }] = useModal();

  interface State {
    flowTaskStatus: DicChildItem[];
  }

  const state = reactive<State>({
    flowTaskStatus: [],
  });

  const [
    Grid,
    {
      getSelectRows: waitGetSelectRows,
      getSelectRowKeys: waitGetSelectRowKeys,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      setLoading: waitSetLoading,
      reload: waitReload,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getHrTrainFormConfig(),
    },
    gridOptions: {
      id: 'hr-employeeV2',
      columns: getHrTrainPageColumns(),
      api: getEmployeeListV2,
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal) {
          // _params.JoinedDateStart = params.pickerVal[0];
          // _params.JoinedDateEnd = params.pickerVal[1];
          _params.JoinedDateStart = dateUtil(params.pickerVal[0]).valueOf();
          _params.JoinedDateEnd = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
      i18nConfig: {
        moduleCode: 'EmployeeTrainingColumn',
      },
    },
  });

  const getTableActions = (record): ActionItem[] => {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        tooltip: t('common.editText'),
        onClick: addOrUpdateHandle.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        tooltip: t('common.viewDetails'),
        onClick: handleToViewDetail.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_seniorManager',
      },
      {
        icon: 'ym-custom ym-custom-printer',
        tooltip: t('common.printText'),
        onClick: printTrainCardHandle.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_seniorManager',
      },
    ];
  };

  function addOrUpdateHandle({ id = '', status = 0 }) {
    if (status === 7) {
      return message.error(t('dict.EmployeeTrain.wrongStatusToEditTips'));
    }
    openFormModal(true, { id });
  }

  function rollbackOrResignHandle() {
    const idList = waitGetSelectRows();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }

    openRollbackOrResignModal(true, {
      list: idList.map(el => {
        return el.id;
      }),
    });
  }

  // 催办
  const initiateExpediteHandle = async () => {
    const idList = waitGetSelectRows();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }

    const data = {
      employeeTrainIds: idList.map(el => {
        return el.id;
      }),
    };

    try {
      const { code } = await bulkInitiateExpedite(data);
      if (code == 200) {
        message.success(t('common.UrgingSuccessText'));
      }
      waitReload();
    } catch (e) {
      waitReload();
    }
  };

  // 处理培训内容模板配置
  const handleTrainTemplateConfig = () => {
    openTrainTemplateConfigModal(true, {});
  };

  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importPreviewV2,
      importSaveApi: saveImportData,
      templateApi: templateDownloadV2,
      previewColumn: importTableColumns,
      usePolling: true,
      pollingParams: {
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'EmployeeTrainingColumn', // 字典分类EnCode
      },
    });
  };

  const hrFinalReviewHandle = async () => {
    const idList = waitGetSelectRows();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }

    // +++ 新增状态检查逻辑 +++
    const invalidItems = idList.filter(item => item.status != 6);
    if (invalidItems.length > 0) {
      message.error(t('dict.EmployeeTrain.wrongStatusToHrAuditTips'));
      return;
    }

    openHrFinalReviewPopup(true, {
      ids: idList.map(el => {
        return el.id;
      }),
      auth: 'btn_add',
      title: t('common.hrFinalReviewText'),
    });
  };

  //  导师审批
  const mentorReviewHandle = async () => {
    const idList = waitGetSelectRows();

    // 检查是否有选择项
    if (!idList?.length) {
      message.warning(t('common.selectText'));
      return;
    }

    // 过滤出状态不符合条件的项
    const invalidItems = idList.filter(({ status }) => ![1, 3, 5].includes(status));
    // 如果存在无效项，显示提示
    if (invalidItems.length > 0) {
      message.error(t('dict.EmployeeTrain.wrongStatusToHrAuditTips1'));
      return;
    }

    // 提取 idList 中的 id 值
    const idListOnly = idList.map(({ id }) => id);
    const dates = idList.map(({ employmentDate }) => employmentDate);

    // 判断是否只有一个唯一日期
    const uniqueDates = [...new Set(dates)];
    if (uniqueDates.length !== 1) {
      message.error(t('dict.EmployeeTrain.wrongStatusToHrAuditTips2'));
      return;
    }

    const uniqueDate = uniqueDates[0];
    // 打开审核弹窗
    openMentorAuditModal(true, { list: idListOnly, date: uniqueDate });
  };

  function printTrainCardHandle({ id = '', status = 0 }) {
    if (status != 7) {
      return message.error(t('dict.EmployeeTrain.wrongStatusToPrintTips'));
    }
    openPrintPop(true, { id });
  }

  function handleToViewDetail({ id = '', status = 0 }) {
    openHrFinalReviewPopup(true, {
      ids: [id],
      auth: 'btn_seniorManager',
      type: 'view',
      title: t('common.previewAuditText'),
    });
  }
  const handleBatchDel = async () => {
    const idList = waitGetSelectRows();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }

    // +++ 新增状态检查逻辑 +++
    const invalidItems = idList.filter(item => item.status > 0);
    if (invalidItems.length > 0) {
      message.error(t('dict.EmployeeTrain.wrongStatusToDelTips2'));
      return;
    }

    const list = idList.map(el => {
      return el.id;
    });
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code } = await blukDeleteEmployeeInfo(list);
          if (code == 200) {
            waitClearSelectedRowKeys([]);
            message.success(t('common.delSuccess'));
          }
          waitReload();
        } catch (e) {
          waitReload();
        }
      },
    });
  };
</script>
