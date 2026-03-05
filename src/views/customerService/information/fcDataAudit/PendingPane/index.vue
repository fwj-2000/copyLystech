<!-- 待处理数据页 -->
<template>
  <Grid>
    <template #toolbar-actions>
      <a-space>
        <a-button type="primary" v-auth="'btn_agree'" @click="handleAgree" :loading="agreeLoading">{{ t('common.agree') }}</a-button>
        <a-button type="primary" v-auth="'btn_reject'" ghost @click="handleRejectModal">{{ t('common.rejectText') }}</a-button>
        <a-button type="primary" v-auth="'btn_recall'" ghost @click="handleRevoke" :loading="agreeLoading">{{ t('common.revoke') }}</a-button>
        <a-button type="primary" v-auth="'btn_saveNotify'" ghost @click="handleNotify" :loading="agreeLoading">{{ t('common.saveNotify') }}</a-button>
        <a-button type="primary" v-auth="'btn_pushMPS'" ghost danger @click="handlePushMPS" :loading="pushLoading">{{ t('tip.FC.pushMPS') }}</a-button>
        <!-- <a-button type="primary" @click="handleDiscard" :loading="agreeLoading">{{ t('common.discard') }}</a-button> -->
        <a-dropdown>
          <a-button type="primary" v-auth="'btn_urging'" ghost :loading="agreeLoading">{{ t('common.UrgingText') }}</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(item, idx) in reminderType" :key="idx" @click="handleUrging(item.value)">
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </template>
    <template #Version="{ row }">
      <span class="table-a text-hover" @click="handleVersionPopup(row)">
        {{ row.batchNumber }}
      </span>
    </template>
    <template #NodeRecords="{ row }">
      <span class="table-a text-hover" @click="handleNodeModal(row)">
        {{ t('common.searchDetail') }}
      </span>
    </template>
    <template #FCData="{ row }">
      <span v-if="`${row.fcReportPreparationStatus}` === '0'">
        {{ t('views.fcDataAudit.reportGeneration') }}
      </span>
      <span
        v-else
        class="table-a text-hover"
        @click="
          goPath(
            '/dashboard/customerService/forecastTable',
            {
              status: ETableType.PRE,
              batchNumber: row.batchNumber,
              customerPerson: row.applyUserName?.split('/')[1] ?? '',
              date: getWeekDate(row.fcWeek),
              materialPreparationPrinciple: row.materialPreparationPrinciple,
            },
            go,
          )
        ">
        {{ t('common.searchDetail') }}
      </span>
    </template>
  </Grid>
  <NodeModal @register="registerNodeModal"></NodeModal>
  <RejectModal @register="registerRejectModal" @reload="reload"></RejectModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { columns, schema, reminderType } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import {
    getFcDataAudit,
    rejectFcDataAudit,
    getNodeList,
    commitFcDataAudit,
    withdrawFcDataAudit,
    reminderFcDataAudit,
    fcdataauditnotify,
    rejectFCChangeAudit,
    commitFCChangeAudit,
    withdrawFCChangeAudit,
    reminderFCChangeAudit,
    FCChangeAuditnotify,
    pushFcDataToMPS,
  } from '/@/api/dashbord/fc';
  import { EAuditIdentification, ETableType } from '../types';
  import { getWeekDate, goPath, funcAuditCore } from '../utils';
  import { useGo } from '/@/hooks/web/usePage';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { useMessage } from '/@/hooks/web/useMessage';
  dayjs.extend(isoWeek);

  const go = useGo();
  const { createMessage, createConfirm } = useMessage();
  const emits = defineEmits(['openVersionPopup']);
  const { t } = useI18n();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal(); // 驳回弹窗
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗

  const agreeLoading = ref(false);
  const pushLoading = ref(false);
  const [Grid, { getSelectRows, reload }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-2',
      schema,
    },
    gridOptions: {
      id: 'customerService-information-fcDataAudit-PendingPane',
      columns: ([{ type: 'checkbox', field: 'checkbox', width: 50 }] as any).concat(columns),
      rowConfig: {
        keyField: 'Id',
      },
      // 关闭单元格选取
      mouseConfig: {
        selected: false,
        area: false,
      },
      api: getFcDataAudit,
      i18nConfig: {
        moduleCode: 'FcDataAuditColumn',
      },
      beforeFetch: params => {
        const { fcWeek } = params;
        params['identification'] = EAuditIdentification.PENDING;
        if (!fcWeek) {
          return params;
        }
        // if (fcWeek.includes('WK')) return params;
        // const year = fcWeek.split('-')[0];
        // const week = fcWeek.split('-')[1];
        // params.fcWeek = `${year}WK${week}`;
        const weeksDayjs = dayjs(fcWeek);
        params.fcWeek = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
        return params;
      },
    },
  });

  // 打开驳回弹窗
  const handleRejectModal = () => {
    const selectRows = getSelectRows();
    openRejectModal(true, {
      ids: selectRows.map(item => item.id) ?? [],
      api: async params => {
        try {
          await funcAuditCore(selectRows, rejectFcDataAudit, rejectFCChangeAudit, params);
          return { code: 200 };
        } catch (error) {
          console.error('驳回失败:', error);
        }
      },
    });
  };

  // 打开节点弹窗
  const handleNodeModal = record => {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  };

  // 打开查看数据版本页
  const handleVersionPopup = record => {
    emits('openVersionPopup', record);
  };

  // 同意
  const handleAgree = async () => {
    agreeLoading.value = true;
    const selectRows = getSelectRows();
    try {
      await funcAuditCore(selectRows, commitFcDataAudit, commitFCChangeAudit);
      reload();
    } finally {
      agreeLoading.value = false;
    }
  };

  // 撤回
  const handleRevoke = async () => {
    agreeLoading.value = true;
    const selectRows = getSelectRows();
    try {
      await funcAuditCore(selectRows, withdrawFcDataAudit, withdrawFCChangeAudit);
      reload();
    } finally {
      agreeLoading.value = false;
    }
  };

  // 催办
  const handleUrging = async reminderType => {
    agreeLoading.value = true;
    const selectRows = getSelectRows();
    try {
      await funcAuditCore(selectRows, reminderFcDataAudit, reminderFCChangeAudit, { reminderType });
      reload();
    } finally {
      agreeLoading.value = false;
    }
  };

  // 提交知会
  const handleNotify = async () => {
    agreeLoading.value = true;
    const selectRows = getSelectRows();
    try {
      await funcAuditCore(selectRows, fcdataauditnotify, FCChangeAuditnotify);
      reload();
    } finally {
      agreeLoading.value = false;
    }
  };

  // 补推MPS
  const handlePushMPS = async () => {
    const selectRows = getSelectRows();
    if (selectRows.length === 0) {
      return createMessage.error(t('common.selectText'));
    }
    pushLoading.value = true;
    createConfirm({
      iconType: 'warning',
      title: t('tip.FC.pushMPS'),
      content: t('tip.FC.pushMPSConfirm'),
      onOk: async () => {
        try {
          // 手动推送
          await pushFcDataToMPS({ batchNumber: selectRows.map(item => item.batchNumber) ?? [], autoType: 0 });
          reload();
        } finally {
          pushLoading.value = false;
        }
      },
      onCancel: () => {
        pushLoading.value = false;
      },
    });
  };

  defineExpose({
    reload,
  });
</script>
