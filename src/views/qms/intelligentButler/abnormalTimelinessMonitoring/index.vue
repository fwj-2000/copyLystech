<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-tooltip :title="t('common.abnormalRegisterTip')" placement="bottom">
                <a-button v-auth="'btn_add'" type="primary" @click="handleOpenModal(null, 'add')">
                  {{ t('dict.CommonCol.abnormalRegister') }}
                </a-button>
              </a-tooltip>
              <!-- 异常上报 -->
              <a-tooltip :title="t('common.ExceptionReportingTip')" placement="bottom">
                <a-button v-auth="'btn_report'" type="primary" ghost @click="handleOpenModal(null, 'report')">
                  {{ t('common.ExceptionReporting') }}
                </a-button>
              </a-tooltip>
              <!-- 异常返工 -->
              <a-button v-auth="'btn_rework'" type="primary" ghost @click="handleRework">{{ t('dict.executionResult.5') }}</a-button>
              <!-- 异常撤回 -->
              <a-button v-auth="'btn_revoke'" type="primary" ghost @click="handleRevork">{{ t('common.revoke') }}</a-button>
              <!-- 异常关闭 -->
              <a-button v-auth="'btn_complete'" type="primary" ghost @click="handleComplete">{{ t('common.closeText') }}</a-button>
              <!-- 批量删除 -->
              <a-button danger v-auth="'btn_delete'" @click="handleDeleteList">
                {{ t('common.batchDelText') }}
              </a-button>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">
                {{ t('common.batchExport') }}
              </a-button>
            </a-space>
          </template>
          <template #record="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerPop" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <!-- 返工弹窗 -->
    <reworkModal @register="registerRework" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getPageList,
    deleteDataList,
    exportProductLineExcel,
    getMachinelCodeList,
    ListByUserfactory,
    Complete,
    Bathwithdraw,
  } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { columns, searchFormSchema } from './components/config';
  import { useLocalStorage } from '@vueuse/core';
  import { getShiftType } from '/@/utils/time';
  import reworkModal from '/@/views/qms/intelligentButler/abnormalTimelinessMonitoringHandel/components/reworkModal.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  const { value: storeData } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: '' });

  defineOptions({ name: 'qms-intelligentButler-abnormalTimelinessMonitoring' });

  const { t } = useI18n();
  const factoryArea = ref('');

  const { createConfirm } = useMessage();
  const [registerPop, { openPopup: openFormPop }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerRework, { openModal: openReworkModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const handleReset = () => {
    setFieldValue('factoryArea', factoryArea.value);
    reload();
  };

  const [Grid, { reload, getSelectRows, getSelectRowKeys, getFetchParams, setFieldValue, getFromValue, updateSchema }] = useVbenVxeGrid({
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
      schema: [
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
              factoryArea.value = e;
              nextTick(async () => {
                const { data } = await getMachinelCodeList({ factoryArea: e });
                updateSchema([
                  {
                    fieldName: 'machineNo',
                    componentProps: {
                      options: data,
                    },
                  },
                ]);
                reload();
              });
            },
          },
        },
        {
          fieldName: 'innerMaterialNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '请输入内部料号',
            allowClear: true,
          },
        },
        {
          fieldName: 'workOrderNo',
          label: '',
          component: 'Input',
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
          defaultValue: getShiftType(),
          componentProps: {
            placeholder: '班别',
            options: [
              { label: t('common.dayShift'), value: '1' },
              { label: t('common.nightShift'), value: '2' },
            ],
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
        transferRange: ['placeholder'],
      },
      handleReset,
    },
    gridOptions: {
      id: 'qms-intelligentButler-abnormalTimelinessMonitoring-list',
      columns,
      showIndexColumn: true,
      api: getPageList,
      beforeFetch: param => {
        return {
          ...param,
          factoryArea: factoryArea.value,
        };
      },
      proxyConfig: {
        autoLoad: false,
      },
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
      },
    },
  });

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

  // status-1待上报、2待处理、3处理中、4审核中、5已处理、6已完成
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleOpenModal.bind(null, record, 'detail'),
        // 待上报状态的没有详情按钮
        disabled: record.status === 1,
        auth: 'btn_detail',
        tooltip: t('common.detailText'),
      },
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleOpenModal.bind(null, record, 'edit'),
        auth: 'btn_edit',
        // 待处理状态的有编辑按钮
        disabled: record.status !== 2,
        tooltip: t('common.editText'),
      },
    ];
  }

  // 打开弹窗
  async function handleOpenModal(record, type) {
    // type: 新增-add 上报-report 详情-detail 编辑-edit
    if (type == 'report') {
      const list = getSelectRows();
      if (list.length === 0) {
        return message.warning(t('common.selectReportTip'));
      }
      if (list.length > 1) {
        return message.warning(t('common.selectTheOne'));
      }
      if (list[0].status != 1) {
        return message.warning(t('common.selectReport'));
      }
      record = list[0];
    }
    openFormPop(true, {
      type,
      record,
      machineNo: (await getFromValue()).machineNo,
      factoryArea: (await getFromValue()).factoryArea,
    });
  }

  // 返工
  function handleRework() {
    const ids = getSelectRowKeys() || [];
    if (ids.length) {
      return openReworkModal(true, { ids });
    }
    message.info(t('common.selectText'));
  }

  // 撤回
  function handleRevork() {
    const ids = getSelectRowKeys() || [];
    if (ids.length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.PerformBatchRecallTip'),
        onOk: async () => {
          const res = await Bathwithdraw({ ids });
          if (res.code === 200) {
            message.success(res.msg);
            reload();
          }
        },
      });
      return;
    }
    message.info(t('common.selectText'));
  }

  // 完成
  function handleComplete() {
    const ids = getSelectRowKeys() || [];
    if (ids.length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.batchCloseTip'),
        onOk: async () => {
          const res = await Complete({ ids });
          if (res.code === 200) {
            message.success(res.msg);
            reload();
          }
        },
      });
      return;
    }
    message.info(t('common.selectText'));
  }

  //批量删除
  async function handleDeleteList() {
    const ids = getSelectRowKeys();
    if (ids?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        const { code } = await deleteDataList({ ids });
        if (code === 200) {
          message.warning(t('common.delSuccess'));
          reload();
        }
      },
    });
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportProductLineExcel,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
        transferRange: ['placeholder'],
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
