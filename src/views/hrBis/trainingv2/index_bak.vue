<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_edit'" preIcon="icon-ym icon-ym-nav-close" class="ml-8px" color="error" @click="handleBatchDel">{{
              t('common.batchDelText')
            }}</a-button>
            <a-button v-auth="'btn_rollback'" @click="rollbackOrResignHandle">{{ t('common.rollbackOrResignText') }}</a-button>
            <a-button v-auth="'btn_edit'" @click="initiateExpediteHandle">{{ t('common.UrgingText') }}</a-button>
            <a-button v-auth="'btn_seniorManager'" type="primary" @click="hrFinalReviewHandle">{{ t('common.hrFinalReviewText') }}</a-button>
            <a-button v-auth="'btn_seniorManager'" type="primary" @click="handleTrainTemplateConfig">{{ t('common.contentTemplateConfigText') }}</a-button>
            <a-button v-auth="'btn_edit'" type="link" @click="batchImportFile"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"></i>{{ t('common.importText') }}</a-button
            >
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <PrintTrainCardPop @register="registerPrintPop" @reload="reload" />
    <add @register="registerForm" @reload="reload" />
    <ImportModal @register="registerImportPop" @reload="reload"></ImportModal>
    <rollbackOrResign @register="registerRollbackOrResignForm" @reload="reload" />
    <HrApplyPop @register="registerHrFinalReviewForm" @refresh="reload"></HrApplyPop>
    <trainTemplateConfig @register="registerTrainTemplateConfigForm" @reload="reload" />
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
  import { importTableColumns, STATUS_OPTIONS } from './config';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message, Table } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';
  import { ImportModal } from '/@/components/ImportModal';
  import add from './components/add.vue';
  import trainTemplateConfig from './components/trainTemplateConfig.vue';
  import PrintTrainCardPop from './components/printTrainCardPop.vue';
  import rollbackOrResign from './components/rollbackOrResign.vue';
  import HrApplyPop from './components/HrApplyPop.vue';

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
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();

  const [registerRollbackOrResignForm, { openModal: openRollbackOrResignModal }] = useModal();
  const [registerHrFinalReviewForm, { openPopup: openHrFinalReviewPopup }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerTrainTemplateConfigForm, { openModal: openTrainTemplateConfigModal }] = useModal();

  interface State {
    flowTaskStatus: DicChildItem[];
  }

  const state = reactive<State>({
    flowTaskStatus: [],
  });

  const columns: BasicColumn[] = [
    // { title: '序号', align: 'center', width: 50, customRender: ({ index }) => index + 1 },
    { title: '工号', dataIndex: 'trainerWorkNo', width: 100, fixed: 'left' },
    { title: '姓名', dataIndex: 'trainerName', width: 100, fixed: 'left' },
    { title: '档案分组', dataIndex: 'recordGrouping', width: 100 },
    { title: '厂区', dataIndex: 'factoryName', width: 100 },
    { title: '入职日期', dataIndex: 'employmentDate', width: 120, format: 'date|YYYY-MM-DD' },
    { title: '打卡班次', dataIndex: 'attendanceShift', width: 120 },
    { title: '办公级培训负责人', dataIndex: 'officeTrainingCoordinatorName', width: 160 },
    { title: '车间级培训负责人', dataIndex: 'workshopTrainingCoordinatorName', width: 160 },
    { title: '班组级培训负责人', dataIndex: 'teamLevelTrainingCoordinatorName', width: 160 },
    { title: '流程状态', dataIndex: 'statusName', width: 100 },
    { title: '当前流程节点', dataIndex: 'currentNodeName', width: 120 },
    { title: '创建人', dataIndex: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createdTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];
  const [registerTable, { getFetchParams, reload, getSelectRows }] = useTable({
    api: getEmployeeListV2,
    columns,
    useSearchForm: true,
    formConfig: getFormConfig(),
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
    rowSelection: {
      type: 'checkbox',
    },
    clickToRowSelect: false,
    i18nConfig: {
      moduleCode: 'EmployeeTrainingColumn',
    },
    beforeFetch: params => {
      if (params.JoinedDateStart) {
        params['JoinedDateStart'] = dayjs(params.JoinedDateStart).format('YYYY-MM-DD');
      }
      if (params.JoinedDateEnd) {
        params['JoinedDateEnd'] = dayjs(params.JoinedDateEnd).format('YYYY-MM-DD');
      }
    },
    afterFetch: data => {
      const list = data.map(o => {
        o.birthday = o.birthday || null;
        o.attendWorkTime = o.attendWorkTime || null;
        o.graduationTime = o.graduationTime || null;
        return o;
      });
      return list;
    },
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      i18nConfig: {
        moduleCode: 'EmployeeTrainingColumn',
        transferRange: ['placeholder'],
      },
      schemas: [
        {
          field: 'trainerWorkNo',
          label: '',
          component: 'Input',
          labelWidth: 50,
          componentProps: { placeholder: '入职员工工号', maxlength: 50 },
        },
        {
          field: 'trainerName',
          label: '',
          component: 'Input',
          labelWidth: 50,
          componentProps: { placeholder: '入职员工姓名', maxlength: 50 },
        },
        {
          field: 'officeTrainingCoordinatorName',
          label: '',
          component: 'Input',
          labelWidth: 50,
          componentProps: { placeholder: '办公培训导师', maxlength: 50 },
        },
        {
          field: 'workshopTrainingCoordinatorName',
          label: '',
          component: 'Input',
          labelWidth: 50,
          componentProps: { placeholder: '车间培训导师', maxlength: 50 },
        },
        {
          field: 'teamLevelTrainingCoordinatorName',
          label: '',
          component: 'Input',
          labelWidth: 50,
          componentProps: { placeholder: '班组培训导师', maxlength: 50 },
        },
        {
          field: 'status',
          label: '',
          i18nField: 'CommonCol.status',
          component: 'ApiSelect',
          componentProps: {
            api: () => baseStore.getDictionaryData('EmployeeTrain.Status'),
            disabled: false,
            showSearch: false,
            resultField: 'data',
            labelField: 'fullName',
            valueField: 'enCode',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
        {
          field: 'pickerVal',
          label: '',
          labelWidth: 100,
          component: 'DateRange',
          componentProps: {
            format: 'YYYY-MM-DD',
            placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
          },
        },
      ],
      fieldMapToTime: [['pickerVal', ['JoinedDateStart', 'JoinedDateEnd']]],
    };
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleToViewDetail.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_seniorManager',
      },
      {
        icon: 'ym-custom ym-custom-printer',
        onClick: printTrainCardHandle.bind(null, { id: record.id, status: record.status } as any),
        auth: 'btn_seniorManager',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        color: 'error',
        auth: 'btn_edit',
        modelConfirm: {
          onOk: handleDelete.bind(null, { id: record.id, status: record.status } as any),
        },
      },
    ];
  }

  function addOrUpdateHandle({ id = '', status = 0 }) {
    if (status === 7) {
      return message.error(t('dict.EmployeeTrain.wrongStatusToEditTips'));
    }
    openFormModal(true, { id });
  }

  function rollbackOrResignHandle() {
    const idList = getSelectRows();
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
    const idList = getSelectRows();
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
      reload();
    } catch (e) {
      reload();
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
    const idList = getSelectRows();
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

  function handleDelete({ id = '', status = 0 }) {
    console.log(id, status);
    if (status > 0) {
      return message.error(t('dict.EmployeeTrain.wrongStatusToDelTips'));
    }
    delEmployee(id).then(res => {
      createMessage.success(res.msg);
      organizeStore.resetState();
      reload();
    });
  }

  const handleBatchDel = async () => {
    const idList = getSelectRows();
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
            message.success(t('common.delSuccess'));
          }
          reload();
        } catch (e) {
          reload();
        }
      },
    });
  };
</script>
