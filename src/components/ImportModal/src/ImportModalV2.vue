<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :okButtonProps="okBtnProps"
    :title="title"
    destroyOnClose
    class="full-popup pb-10px top-0"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <template #centerToolbar>
      <a-button v-if="state.pollingParams.interval" @click="handleBack" type="primary" ghost class="ml-12px">{{ t('common.clearData') }}</a-button>
    </template>
    <ScrollContainer>
      <uploadExcelData
        class="h-full"
        v-if="!!state.tempList.length"
        :list="state.tempList"
        :usePolling="state.usePolling"
        :getTaskDataList="state.pollingParams.getTaskDataList"
        :columns="state.previewColumn"
        :api-params="state.apiParams"
        :i18n-config="state.i18nConfig"
        :exclude-fields="state.excludeFields"
        @correct="handleChangeOkbtnStatus"
        @deleteTable="handleDeleteTable" />
      <BatchImport
        v-else
        ref="importRef"
        :tplInfo="{ title: t('common.batchImport') }"
        :template-api="state.templateApi"
        :templateUrl="state.templateUrl"
        :version="state.version"
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
</template>
<script lang="ts" setup>
  import { h, nextTick, onMounted, reactive, ref, toRefs, watch, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BatchImport } from '/@/components/Import';
  import uploadExcelData from './ImportedListPreview.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button } from 'ant-design-vue';
  import { NodeJS } from 'timers';
  import { buildUUID } from '/@/utils/uuid';
  import { ScrollContainer } from '/@/components/Container';

  const { createMessage, notification, createConfirm } = useMessage();

  const emits = defineEmits(['register', 'reload', 'refresh']);

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
    importSaveSuccessCallback: CallableFunction; // 保存成功后的callback
    version: string;
    templateUrl: string;
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
    /**
     * 导入列国际化配置
     */
    i18nConfig?: {
      moduleCode?: string;
    };
    excludeFields: string[]; // 不显示的字段
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
    importSaveSuccessCallback: () => {},
    templateApi: () => {},
    version: '1',
    templateUrl: '',
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

  // const okBtnProps = reactive({
  //   disabled: true,
  //   ghost: false,
  // });

  const okBtnProps = computed(() => {
    return {
      ghost: false,
      disabled: !state.tempList.length || state.tempList.some(item => item.ErrorMsg || item.errorMsg),
    };
  });

  // 变更提交按钮的状态
  function handleChangeOkbtnStatus(type) {
    // okBtnProps.disabled = type;
  }

  // 删除表格数据
  function handleDeleteTable(id) {
    state.tempList = state.tempList.filter(item => item.id !== id);
  }

  const { title, loading, tip, pollingStatus } = toRefs(state);

  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);

  function init(data) {
    changeLoading(true);
    state.title = data.title || t('common.batchImport');
    state.tempList = [];
    state.multiplyKey = '';
    state.tplList = [];
    // okBtnProps.disabled = true;
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
      state.importSaveSuccessCallback = data.importSaveSuccessCallback;
      state.templateApi = data.templateApi;
      state.templateUrl = data.templateUrl || '';
      state.version = data.version || '1';
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
          // okBtnProps.disabled = true;
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
              // okBtnProps.disabled = false;
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
            setTimeout(() => {
              handleTaskRead();
              notification.close(key);
            }, 2000);
            state.pollingInterval.forEach(interval => {
              clearInterval(interval);
            });
            // okBtnProps.disabled = true;
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
            setTimeout(() => {
              notification.warning({
                key,
                message: t('common.exportClearTooltip'),
                description: t('common.autoClearExportError'),
                duration: 0,
              });
              handleTaskRead();
              setTimeout(() => {
                notification.error({
                  key,
                  message: t('common.exportClearTooltip'),
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
                handleBack();
              }, 3000);
            }, 3000);
            // okBtnProps.disabled = true;
          }
        }
      }
    });
  }

  function handleTaskRead() {
    const { taskRead } = state.pollingParams;
    const { apiParams } = state;
    console.log(apiParams);
    taskRead(apiParams.taskRead);
  }

  function handleBack() {
    state.tempList = [];
    // okBtnProps.disabled = true;
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
    // okBtnProps.disabled = !state.BatchCode;
    state.tempList = list.map(el => {
      return {
        ...el,
        uuid: buildUUID(),
      };
    });
  }

  const handleVisibleChange = v => {
    if (!v) {
      // okBtnProps.disabled = true;
      state.BatchCode = '';
    }
  };

  const importRef = ref();
  const saveImport = () => {
    changeOkLoading(true);
    let _params: any = {};
    if (state?.apiParams?.importSave) {
      _params = state.apiParams.importSave;
    }
    if (state.multiplyKey) {
      _params.multiplyKey = state.multiplyKey;
    }
    state
      .importSaveApi(state.BatchCode, _params)
      .then(res => {
        console.log(res, 'res', state.usePolling);
        createMessage.success(res?.message || t('sys.api.operationSuccess'));
        closePopup();
        state.importSaveSuccessCallback(res.data);
      })
      .catch(err => {
        console.log(err, 'err');
      })
      .finally(() => {
        console.log('finally');
        emits('reload');
        emits('refresh');
        changeOkLoading(false);
      });
  };

  function buildRepetitionTipFromTempList() {
    const hasRepetition = (state.tempList || []).some(it => Number(it.repetitionStatus) === 1);
    return hasRepetition ? '终端客户料号存在重复，请确认是否继续提交' : '';
  }

  const handleSave = () => {
    const repTip = buildRepetitionTipFromTempList();
    if (repTip) {
      return createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: repTip,
        onOk: () => {
          saveImport();
        },
        onCancel: () => {},
      });
    }
    const hasConfirmMsg = state.tempList.some(item => item.confirmMsg);
    if (hasConfirmMsg) {
      return createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.CommonCol.confirmMsgTipByImport'),
        onOk: () => {
          saveImport();
        },
      });
    }
    saveImport();
  };

  // const handleSave = () => {
  //   const hasConfirmMsg = state.tempList.some(item => item.confirmMsg);
  //   if (hasConfirmMsg) {
  //     return createConfirm({
  //       iconType: 'warning',
  //       title: t('common.tipTitle'),
  //       content: t('dict.CommonCol.confirmMsgTipByImport'),
  //       onOk: () => {
  //         saveImport();
  //       },
  //     });
  //   }
  //   saveImport();
  // };
  onMounted(() => {
    init({});
  });
</script>
<style lang="less" scoped>
  :deep(.scrollbar__view) {
    height: 100%;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
