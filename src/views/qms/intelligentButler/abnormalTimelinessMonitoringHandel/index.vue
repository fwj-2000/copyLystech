<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <PendingGrid>
              <template #toolbar-actions>
                <a-space>
                  <!-- 上报 -->
                  <a-button v-auth="'btn_turn'" type="primary" @click="handleOpenTurn">{{
                    isGroupLeader ? t('common.ExceptionReporting') : t('dict.CommonCol.abnormalTransfer')
                  }}</a-button>
                  <!-- 处理 -->
                  <a-button v-auth="'btn_handle'" type="primary" ghost @click="handleProcess">{{ t('common.abnormalProcess') }}</a-button>
                  <!-- 同意 -->
                  <a-button v-auth="'btn_agree'" type="primary" ghost @click="handleAgree">{{ t('common.agree') }}</a-button>
                  <!-- 驳回 -->
                  <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
                  <!-- 返工 -->
                  <!-- <a-button v-auth="'btn_rework'" type="primary" ghost @click="handleRework">{{ t('dict.executionResult.5') }}</a-button> -->
                  <!-- 完成 -->
                  <!-- <a-button v-auth="'btn_complete'" type="primary" ghost @click="handleComplete">{{ t('common.completeText') }}</a-button> -->
                  <!-- 导出 -->
                  <!-- <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.exportText') }}</a-button> -->
                </a-space>
              </template>
              <template #record="{ row }">
                <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </PendingGrid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <DoneGrid>
              <!-- <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template> -->
              <template #record="{ row }">
                <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </DoneGrid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <!-- 上报弹窗 -->
    <TurnTo @register="registerTurnTo" @reload="reloadTable" />
    <!-- 返工弹窗 -->
    <reworkModal @register="registerRework" @reload="reloadTable" />
    <!-- 处理、详情弹窗 -->
    <add @register="registerPop" @reload="reloadTable"></add>
    <!-- 驳回弹窗 -->
    <RejectModal @register="registerRejectModal" @reload="reloadTable" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import {
    exportDataProcessor,
    getFlowPage,
    Reject,
    Agree,
    Rework,
    Complete,
    getMachinelCodeList,
    GetIsGroupLeader,
    GetStatusById,
    ListByUserfactory,
  } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { useLocalStorage } from '@vueuse/core';
  import TurnTo from './components/TurnTo.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { RejectModal, NodeModal } from '/@/components/CustomComponents';
  import { downloadByUrl } from '/@/utils/file/download';
  import add from '../abnormalTimelinessMonitoring/components/add.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import reworkModal from './components/reworkModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ASTATUS_AbnormalTimelinessMonitoring } from '../abnormalTimelinessMonitoring/components/config';

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerTurnTo, { openModal: openTurnToModal }] = useModal();
  const [registerRework, { openModal: openReworkModal }] = useModal();
  const [registerPop, { openPopup: openFormPop }] = usePopup();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { value: storeData } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: '' });

  const baseStore = useBaseStore();
  defineOptions({ name: 'qms-intelligentButler-abnormalTimelinessMonitoringHandel' });

  const { createConfirm } = useMessage();
  const factoryAreaPending = ref('');
  const factoryAreaDone = ref('');

  const columns = [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    { title: '异常单据号', field: 'orderNo' },
    { title: '工单号', field: 'workOrderNo' },
    { title: '内部料号', field: 'innerMaterialNumber' },
    { title: '机台号', field: 'machineNo' },
    {
      title: '状态',
      field: 'status',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('ExceptionStatus'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          filterOption: false,
          notFoundContent: null,
        },
      },
      cellRender: {
        name: 'Tag',
        options: ASTATUS_AbnormalTimelinessMonitoring,
      },
    },
    {
      title: '生产日期',
      field: 'fBizDate',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    { title: '厂区物理位置', field: 'factoryAddress' },
    { title: '班别', field: 'classesDes' },
    { title: '异常类型', field: 'exceptionTypeName' },
    { title: '异常描述', field: 'problemDescription' },
    { title: '当前处理人', field: 'currentName' },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'record',
      slots: { default: 'record' },
      width: 100,
      i18nField: 'CommonCol.nodeRecord',
    },
    {
      title: '上报时间',
      field: 'reportTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      i18nField: 'CommonCol.reportTime',
    },
    { title: '上报人', field: 'createUserName', i18nField: 'CommonCol.reportPerson' },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];

  const searchFormSchemaPending = [
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: ListByUserfactory,
        placeholder: '所属厂区',
        showSearch: true,
        resultField: 'data',
        defaultFirstOption: true,
        allowClear: false,
        filterOption: (inputValue, path) => {
          return [path].some(option => option.label.includes(inputValue));
        },
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
        onChange: e => {
          factoryAreaPending.value = e;
          nextTick(async () => {
            const { data } = await getMachinelCodeList({ factoryArea: e });
            updateSchemaPending([
              {
                fieldName: 'machineNo',
                componentProps: {
                  options: data,
                },
              },
            ]);
            reloadPending();
          });
        },
      },
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入工单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'machineNo',
      label: '',
      component: 'Select',
      // defaultValue: storeData.machineNo,
      componentProps: {
        fieldNames: {
          value: 'machineNo',
          label: 'machineNo',
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'machineNo',
        },
        options: [],
        filterOption: false,
        placeholder: t('dict.SelectMachine'),
        onChange: e => {
          const { value } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: e });
          value.machineNo = e;
        },
      },
    },
    {
      fieldName: 'classes',
      label: '',
      component: 'Select',
      colProps: { span: 4 },
      componentProps: {
        placeholder: '班别',
        options: [
          { label: t('common.dayShift'), value: '1' },
          { label: t('common.nightShift'), value: '2' },
        ],
      },
    },
  ];
  const searchFormSchemaDone = [
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: ListByUserfactory,
        placeholder: '所属厂区',
        showSearch: true,
        resultField: 'data',
        defaultFirstOption: true,
        allowClear: false,
        filterOption: (inputValue, path) => {
          return [path].some(option => option.label.includes(inputValue));
        },
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
        onChange: e => {
          factoryAreaDone.value = e;
          nextTick(async () => {
            const { data } = await getMachinelCodeList({ factoryArea: e });
            updateSchemaDone([
              {
                fieldName: 'machineNo',
                componentProps: {
                  options: data,
                },
              },
            ]);
            reloadDone();
          });
        },
      },
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入工单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'machineNo',
      label: '',
      component: 'Select',
      // defaultValue: storeData.machineNo,
      componentProps: {
        fieldNames: {
          value: 'machineNo',
          label: 'machineNo',
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'machineNo',
        },
        options: [],
        filterOption: false,
        placeholder: t('dict.SelectMachine'),
        onChange: e => {
          const { value } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: e });
          value.machineNo = e;
        },
      },
    },
    {
      fieldName: 'classes',
      label: '',
      component: 'Select',
      colProps: { span: 4 },
      componentProps: {
        placeholder: '班别',
        options: [
          { label: t('common.dayShift'), value: '1' },
          { label: t('common.nightShift'), value: '2' },
        ],
      },
    },
  ];

  const handleResetPending = () => {
    setFieldsValuePending('factoryArea', factoryAreaPending.value);
    reloadPending();
  };
  const handleResetDone = () => {
    setFieldsValueDone('factoryArea', factoryAreaDone.value);
    reloadDone();
  };

  const [
    PendingGrid,
    {
      reload: reloadPending,
      getFetchParams: getFetchParamsPending,
      getSelectRows: getSelectRowsPending,
      getSelectRowKeys: getSelectRowKeysPending,
      updateSchema: updateSchemaPending,
      setFieldValue: setFieldsValuePending,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchemaPending,
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
        transferRange: ['placeholder'],
      },
      handleReset: handleResetPending,
    },
    gridOptions: {
      id: 'qms-intelligentButler-abnormalTimelinessMonitoringHandel-pending-list',
      columns: columns,
      api: getFlowPage,
      showIndexColumn: true,
      beforeFetch: params => {
        params.type = 0;
        params.factoryArea = factoryAreaPending.value;
        return params;
      },
      proxyConfig: {
        autoLoad: false,
      },
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
      },
    },
  });
  const [DoneGrid, { reload: reloadDone, getFetchParams: getFetchParamsDone, updateSchema: updateSchemaDone, setFieldValue: setFieldsValueDone }] =
    useVbenVxeGrid({
      formOptions: {
        showCollapseButton: false,
        // 是否在字段值改变时提交表单
        submitOnChange: false,
        submitOnEnter: true,
        commonConfig: {
          componentProps: {},
          labelClass: 'w-0',
        },
        wrapperClass: 'grid grid-cols-6 gap-4',
        schema: searchFormSchemaDone,
        i18nConfig: {
          moduleCode: 'AbnormalTimelinessMonitoringColumn',
          transferRange: ['placeholder'],
        },
        handleReset: handleResetDone,
      },
      gridOptions: {
        id: 'qms-intelligentButler-abnormalTimelinessMonitoringHandel-done-list',
        columns: columns,
        api: getFlowPage,
        showIndexColumn: true,
        beforeFetch: params => {
          params.type = 1;
          params.factoryArea = factoryAreaDone.value;
          return params;
        },
        proxyConfig: {
          autoLoad: false,
        },
        i18nConfig: {
          moduleCode: 'AbnormalTimelinessMonitoringColumn',
        },
      },
    });

  const activeKey = ref('1');

  function getActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleOpenModal.bind(null, record, 'handlerDetail'),
        tooltip: t('common.detailText'),
        auth: 'btn_detail',
      },
    ];
  }

  // 查看节点记录
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  const handleOpenModal = (record, type) => {
    openFormPop(true, {
      type,
      record,
    });
  };

  function reloadTable() {
    if (activeKey.value === '1') {
      reloadPending();
    } else {
      reloadDone();
    }
  }

  //  驳回
  async function handleReject() {
    const ids = getSelectRowKeysPending() || [];
    if (ids.length) {
      return openRejectModal(true, {
        api: Reject,
        ids,
      });
    }
    message.info(t('common.selectText'));
  }

  // 同意
  function handleAgree() {
    const ids = getSelectRowKeysPending() || [];
    if (ids.length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.CommonCol.performBatchConsentTip'),
        onOk: async () => {
          const res = await Agree({ ids });
          if (res.code === 200) {
            message.success(res.msg);
            reloadTable();
          }
        },
      });
      return;
    }
    message.info(t('common.selectText'));
  }

  // 返工
  function handleRework() {
    const ids = getSelectRowKeysPending() || [];
    if (ids.length) {
      return openReworkModal(true, { ids });
    }
    message.info(t('common.selectText'));
  }

  // 完成
  function handleComplete() {
    const ids = getSelectRowKeysPending() || [];
    if (ids.length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.CommonCol.batchCompletTip'),
        onOk: async () => {
          const res = await Complete({ ids });
          if (res.code === 200) {
            message.success(res.msg);
            reloadTable();
          }
        },
      });
      return;
    }
    message.info(t('common.selectText'));
  }

  //导出
  function handleExport() {
    let params = {};
    if (activeKey.value === '1') {
      params = getFetchParamsPending();
    } else {
      params = getFetchParamsDone();
    }
    openExportModal(true, {
      listQuery: {
        ...params,
        status: activeKey.value,
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  const exportAction = query => {
    exportDataProcessor(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 转办
  async function handleOpenTurn() {
    const ids = getSelectRowKeysPending();
    if (ids?.length === 0) {
      return message.warning(t('common.selectDataTip'));
    }
    openTurnToModal(true, {
      ids,
    });
  }

  // 处理
  async function handleProcess() {
    const rows = getSelectRowsPending();
    if (!rows.length) {
      message.warning(t('dict.CheckDataTip'));
      return;
    }
    if (rows.length > 1) {
      message.warning(t('dict.CommonCol.selectedOneData'));
      return;
    }
    // 状态为待处理或处理中 才可以点击处理
    if (rows[0].status !== 2 && rows[0].status !== 3) {
      message.warning(t('dict.CommonCol.selectPendingProcessingTip'));
      return;
    }
    openFormPop(true, {
      type: 'handlerProcess',
      record: rows[0],
    });
  }

  const isGroupLeader = ref(false);

  const getIsGroupLeaderFn = async () => {
    const { data } = await GetIsGroupLeader();
    isGroupLeader.value = data.isGroupLeader;
  };

  const goDetail = async id => {
    // 根据id获取状态
    const { data } = await GetStatusById({ id });
    // 【待处理】、【处理中】的需要打开编辑进行提交操作,【已完成】需打开详情不能进行提交
    // 【审核中】、【已处理】不需要打开详情，需跳转待处理标签页
    if (data.status === 2 || data.status === 3 || data.status === 6) {
      // 【待处理】、【处理中】、【已完成】
      return openFormPop(true, {
        type: data.status === 6 ? 'handlerDetail' : 'handlerProcess',
        record: {
          id,
          status: data.status,
        },
      });
    } else {
      // 【审核中】、【已处理】
      activeKey.value = '1';
    }
  };

  onMounted(() => {
    // 判断当前人是否为组长
    getIsGroupLeaderFn();

    // 钉钉推送跳转详情
    const route = useRoute();
    const id = route.query?.id;
    if (id) {
      goDetail(id);
    }
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
