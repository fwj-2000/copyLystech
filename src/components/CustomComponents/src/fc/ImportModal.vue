<template>
  <BasicPopup
    v-bind="$attrs"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :title="title"
    destroyOnClose
    class="full-popup pb-10px top-0"
    @ok="handleSave"
    @register="registerPopup"
    @close="handleClose"
    @visible-change="handleVisibleChange">
    <template #centerToolbar>
      <a-button v-if="state.pollingParams.interval" @click="handleBack" type="primary" ghost class="ml-12px">{{ t('common.clearData') }}</a-button>
    </template>
    <ScrollContainer>
      <div class="h-full" v-if="!!state.tempList.length">
        <uploadExcelData
          style="min-height: 400px; height: 60%"
          :list="state.tempList"
          :usePolling="state.usePolling"
          :getTaskDataList="state.pollingParams.getTaskDataList"
          :columns="state.previewColumn"
          :api-params="state.apiParams"
          :i18n-config="state.i18nConfig"
          :exclude-fields="state.excludeFields"
          @correct="handleChangeOkbtnStatus" />
        <BasicAudit class="pl-10px" ref="basicAuditRef" approver-type="FC"></BasicAudit>
        <BasicForm class="pl-10px" @register="registerMaterialForm"></BasicForm>
      </div>
      <BatchImport
        v-else
        ref="importRef"
        :tplInfo="{ title: t('common.batchImport') }"
        :template-api="state.templateApi"
        :import-save-api="state.importSaveApi"
        :preview-api="state.importPreviewApi"
        :api-params="state.apiParams"
        :usePolling="state.usePolling"
        :multiKey="state.multiplyKey"
        :tplList="state.tplList"
        :multiplyList="state.multiplyList"
        class="mt-16px h-full"
        @change="handleChange"
        @update="updateExcelInfo" />
    </ScrollContainer>
  </BasicPopup>
  <matchImportModal @register="registerMatch" @ok="closePop"></matchImportModal>
</template>
<script lang="ts" setup>
  import { h, nextTick, onBeforeUnmount, reactive, ref, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BatchImport } from '/@/components/Import';
  import uploadExcelData from '/@/components/ImportModal/src/ImportedListPreview.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button } from 'ant-design-vue';
  import { NodeJS } from 'timers';
  import { buildUUID } from '/@/utils/uuid';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import BasicAudit from '/@/components/CustomComponents/src/fc/BasicAudit.vue';
  import matchImportModal from './MatchModalV3.vue';
  import { useModal } from '/@/components/Modal';
  import { importValidate } from '/@/api/customerSerivce/fcData';
  const { createMessage, notification } = useMessage();

  const emits = defineEmits(['register', 'reload', 'refresh']);
  const basicAuditRef = ref<InstanceType<typeof BasicAudit>>();
  const [registerMatch, { openModal: openMatchModal }] = useModal();

  const key = 'updatable';

  interface State {
    title: string;
    loading: boolean;
    tip: string;
    tableList: any[];
    tempList: any[];
    BatchCode: any;
    previewColumn: [];
    importPreviewApi: CallableFunction; // 导入数据的api，拿到的数据会显示在表格中
    importSaveApi: CallableFunction; // 保存导入的数据api
    templateApi: CallableFunction; // 下载模板api
    apiParams: any;
    multiplyList: any[];
    usePolling: boolean;
    pollingParams: {
      interval: number;
      getTaskStatus: CallableFunction;
      getTaskDataList: CallableFunction;
      cancelTask: CallableFunction;
      taskRead: CallableFunction;
    };
    pollingStatus: {
      qty: number;
      checkQty: number;
      batchCode: string;
    };
    pollingInterval: NodeJS.Timeout[] | null[];
    intervalTimer: any;
    multiplyKey: any;
    tplList: any[];
    excludeFields: any[];
    /**
     * 导入列国际化配置
     */
    i18nConfig?: {
      moduleCode?: string;
    };
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    loading: false,
    tip: '',
    tableList: [],
    tempList: [],
    BatchCode: '',
    previewColumn: [],
    importPreviewApi: () => {},
    importSaveApi: () => {},
    templateApi: () => {},
    apiParams: {
      importSave: {},
    },
    pollingStatus: {
      qty: 10,
      checkQty: 0,
      batchCode: '',
    },
    pollingParams: {
      interval: 10000,
      getTaskStatus: () => {},
      getTaskDataList: () => {},
      cancelTask: () => {},
      taskRead: () => {},
    },
    multiplyList: [], // 多模板列表
    pollingInterval: [],
    usePolling: false,
    intervalTimer: null,
    multiplyKey: '',
    tplList: [],
    i18nConfig: {},
    excludeFields: [],
  });

  const okBtnProps = reactive({
    disabled: true,
  });

  const [registerMaterialForm, { getFieldsValue: getFieldsValueMateria, validate: validateMaterial }] = useForm({
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: { span: 24 },
    schemas: [
      {
        required: true,
        field: 'yuanze',
        label: t('dict.fcDataAudit.MP'),
        component: 'Textarea',
        defaultValue: '',
        componentProps: {
          allowClear: false,
        },
      },
    ],
  });
  // 变更提交按钮的状态
  function handleChangeOkbtnStatus(type) {
    okBtnProps.disabled = type;
  }

  const { title } = toRefs(state);

  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);

  function init(data) {
    changeLoading(true);
    state.title = t('common.batchImport');
    state.tempList = [];
    state.multiplyKey = '';
    state.tplList = [];
    okBtnProps.disabled = true;
    state.BatchCode = '';
    state.i18nConfig = data.i18nConfig || {};
    state.excludeFields = data.excludeFields || [];
    setTimeout(() => {
      changeLoading(false);
    }, 300);
    if (data) {
      state.previewColumn = data.previewColumn || [];
      state.importPreviewApi = data.importPreviewApi;
      state.importSaveApi = data.importSaveApi;
      state.templateApi = data.templateApi;
      state.apiParams = data.apiParams || {};
      state.multiplyList = data.multiplyList || [];
      state.usePolling = data.usePolling || false;
      if (data.usePolling) {
        const { pollingParams } = data;
        state.pollingParams = {
          interval: pollingParams.interval || 1000,
          getTaskStatus: pollingParams.getTaskStatus,
          getTaskDataList: pollingParams.getTaskDataList,
          cancelTask: pollingParams.cancelTask,
          taskRead: pollingParams.taskRead,
        };
        updateTaskStatus();
        startTask();
      }
      nextTick(() => {
        state.multiplyKey = data.multiplyKey || '';
        state.tplList = data.tplList || [];
      });
    }
  }
  onBeforeUnmount(() => {
    state.pollingInterval.forEach(interval => {
      clearInterval(interval);
    });
    handleBack();
  });
  function handleClose() {
    handleBack();
  }

  function startTask() {
    // clearInterval(state.intervalTimer);
    // state.intervalTimer = null;
    const interval = setInterval(updateTaskStatus, state.pollingParams.interval);
    state.pollingInterval.push(interval);
  }

  function updateTaskStatus() {
    // 如果使用轮询，则需要获取任务状态
    const { getTaskStatus } = state.pollingParams;
    const { apiParams } = state;
    getTaskStatus(apiParams.getTaskStatus).then(({ data, code }) => {
      if (code == 200) {
        if (!data) {
          // 如果任务不存在，则可以进行导入数据
          // state.usePolling = false;
          state.pollingInterval.forEach(interval => {
            clearInterval(interval);
          });
          state.tempList = [];
          okBtnProps.disabled = true;
        } else {
          if (data.status == 2) {
            state.pollingStatus.qty = data.qty;
            state.pollingStatus.checkQty = data.checkQty;
            state.pollingStatus.batchCode = data.batchCode;

            notification.warning({
              key,
              message: t('component.batchImport.importing'),
              description: t('component.batchImport.importTip', [data.checkQty, data.qty]),
              duration: 0,
            });
          } else if (data.status == 3) {
            notification.success({
              key,
              message: t('component.batchImport.importSuccess'),
              description: t('component.batchImport.importTip', [data.checkQty, data.qty]),
              duration: 4.5,
            });
            state.pollingInterval.forEach(interval => {
              clearInterval(interval);
            });
            state.BatchCode = data.batchCode;
            if (data.checkResult) {
              okBtnProps.disabled = false;
            }
            getTaskData();
          } else if (data.status == 4) {
            state.pollingStatus.qty = data.qty;
            state.pollingStatus.checkQty = data.checkQty;
            state.pollingStatus.batchCode = data.batchCode;

            notification.warning({
              key,
              message: t('component.batchImport.saving'),
              description: t('component.batchImport.saveTip', [data.saveQty, data.qty]),
              duration: 0,
            });
          } else if (data.status == 5) {
            // ok
            notification.success({
              key,
              message: t('component.batchImport.saveSuccess'),
              description: t('component.batchImport.saveTip', [data.saveQty, data.qty]),
              duration: 0,
              btn: () =>
                h(
                  Button,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => {
                      handleTaskRead();
                      notification.close(key);
                    },
                  },
                  { default: () => t('component.modal.okText') },
                ),
            });
            state.pollingInterval.forEach(interval => {
              clearInterval(interval);
            });
            okBtnProps.disabled = true;
            changeLoading(false);
          } else if (data.status == 6) {
            // 错误
            notification.error({
              key,
              message: t('component.batchImport.saveFail'),
              description: data.errMsg,
              duration: 0,
              btn: () =>
                h(
                  Button,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => {
                      handleTaskRead();
                      notification.close(key);
                    },
                  },
                  { default: () => t('component.modal.okText') },
                ),
            });
            changeLoading(false);
            state.pollingInterval.forEach(interval => {
              clearInterval(interval);
            });
            okBtnProps.disabled = true;
          }
        }
      }
    });
  }

  function handleTaskRead() {
    const { taskRead } = state.pollingParams;
    const { apiParams } = state;
    taskRead(apiParams.taskRead);
  }

  function handleBack() {
    state.tempList = [];
    okBtnProps.disabled = true;
    state.pollingInterval.forEach(interval => {
      clearInterval(interval);
    });
    notification.success({
      key,
      message: t('component.batchImport.clearSuccess'),
      description: t('component.batchImport.clearSuccessDescription'),
      duration: 3.5,
    });
    importRef.value?.clearUploadStatus();
    changeLoading(false);
    console.log(state.apiParams.cancelTask);
    state.pollingParams.cancelTask(state.apiParams.cancelTask);
  }

  function getTaskData(page = 1, pageSize = 100) {
    changeLoading(false);
    const { getTaskDataList } = state.pollingParams;

    let params = {
      page,
      pageSize,
    };
    if (state.apiParams.getTaskDataList) {
      params = {
        ...params,
        ...state.apiParams.getTaskDataList,
      };
    }

    getTaskDataList(params).then(({ code, data }) => {
      if (code == 200) {
        const { list } = data;
        state.tempList = list.map(el => {
          return {
            ...el,
            uuid: buildUUID(),
          };
        });
      }
    });
  }

  function handleChange(v) {
    state.multiplyKey = v;
    const list = state.tplList.filter(item => item.EnterpriseTemplateTypeCode == v);
    state.previewColumn = (list.length ? list[0].tableTitle : []).map(item => ({ ...item, title: item.label, dataIndex: item.field })) || [];
  }

  function updateExcelInfo(BatchCode, list) {
    if (state.usePolling) {
      changeLoading(true);
      updateTaskStatus();
      startTask();
      return;
    }
    state.BatchCode = BatchCode || '';
    okBtnProps.disabled = !state.BatchCode;
    state.tempList = list.map(el => {
      return {
        ...el,
        uuid: buildUUID(),
      };
    });
  }

  const handleVisibleChange = v => {
    console.log('handleVisable---', v);
    if (!v) {
      okBtnProps.disabled = true;
      state.BatchCode = '';
    }
  };

  const importRef = ref();
  const handleSave = async () => {
    // openMatchModal(true, {
    //   matchData: {},
    //   params: {},
    //   // params: { ..._params, ...auditParams },
    //   batchCode: state.BatchCode,
    // });
    // return;
    const auditValue = basicAuditRef?.value?.getValues() ?? {};
    const res = (await basicAuditRef?.value?.validateAll()) ?? [];
    if ([...res, await validateMaterial()]?.includes(false)) {
      return;
    }
    changeOkLoading(true);
    const { yuanze = '' } = getFieldsValueMateria();
    const { mainProcess, approverGroupId, CustomerManager = [], CustomerSupervisor = [], PMC = [], Sale = [], SaleLeader = [] } = auditValue;
    const auditParams = {
      approveId: approverGroupId,
      mainProcesses: mainProcess,
      materialPreparationPrinciple: yuanze,
      customerManagerUserIds: CustomerManager,
      customerSupervisorUserIds: CustomerSupervisor,
      pmcUserIds: PMC,
      saleUserIds: Sale,
      saleLeaderUserIds: SaleLeader,
    };
    let _params: any = {};
    if (state?.apiParams?.importSave) {
      _params = state.apiParams.importSave;
    }
    if (state.multiplyKey) {
      _params.multiplyKey = state.multiplyKey;
    }
    importValidate({
      ..._params,
      ...auditParams,
      batchCode: state.BatchCode,
    })
      .then(res => {
        const { data } = res;
        if (!data) {
          createMessage.success(res?.message || t('sys.api.operationSuccess'));
          return closePop();
        }
        // 若是存在部分数据处于流程中，则提示用户
        if (data.existDealing && data.existDealing.length) {
          createMessage.success('行号：' + data.existDealing.join(',') + '的数据处于流程中，请处理完再导入，其余数据已导入成功');
        }
        // 若是没有匹配到的数据，则直接关闭弹框
        if (res.code == 200 && (!data || !data.indexList || !data.indexList.length)) {
          createMessage.success(res?.message || t('sys.api.operationSuccess'));
          return closePop();
        }
        // 若是有匹配到的数据，则展示匹配弹框
        openMatchModal(true, {
          matchData: res?.data,
          params: { ..._params, ...auditParams },
          batchCode: state.BatchCode,
        });
      })
      .finally(() => {
        changeOkLoading(false);
      });
  };

  function closePop() {
    setTimeout(() => {
      emits('reload');
      emits('refresh');
    }, 500);
    changeOkLoading(false);
    closePopup();
  }
</script>
<style lang="less" scoped>
  :deep(.scrollbar__view) {
    height: 100%;
  }
</style>
