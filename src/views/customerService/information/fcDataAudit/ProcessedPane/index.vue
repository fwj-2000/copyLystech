<!-- 已处理数据页 -->
<template>
  <Grid>
    <!-- <template #toolbar-actions>
      <a-space>
        <a-button type="primary" v-auth="'btn_discard'" @click="handleDiscard" :loading="btnLoading">{{ t('common.discard') }}</a-button>
      </a-space>
    </template> -->
    <template #Version="{ row }">
      <span class="table-a" @click="handleVersionPopup(row)">
        {{ row.batchNumber }}
      </span>
    </template>
    <template #NodeRecords="{ row }">
      <span class="table-a" @click="handleNodeModal(row)">
        {{ t('common.searchDetail') }}
      </span>
    </template>
    <template #FCData="{ row }">
      <span v-if="`${row.fcReportPreparationStatus}` === '0'">
        {{ t('views.fcDataAudit.reportGeneration') }}
      </span>
      <span
        v-else
        class="table-a"
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
</template>

<script lang="ts" setup>
  import { columns, schema } from '../PendingPane/config';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getFcDataAudit, getNodeList, considerVoidFcDataAudit, considerVoidFCChangeAudit } from '/@/api/dashbord/fc';
  import { NodeModal } from '/@/components/CustomComponents';
  import { EAuditIdentification, ETableType } from '../types';
  import { getWeekDate, goPath, funcAuditCore } from '../utils';
  import { useGo } from '/@/hooks/web/usePage';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  dayjs.extend(isoWeek);

  const go = useGo();
  const emits = defineEmits(['openVersionPopup']);
  const btnLoading = ref(false);
  const { t } = useI18n();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗
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
      id: 'customerService-information-fcDataAudit-ProcessedPane',
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
      beforeFetch: params => {
        const { fcWeek } = params;
        params['identification'] = EAuditIdentification.PROCESSED;
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

  // 废弃
  const handleDiscard = async () => {
    btnLoading.value = true;
    const selectRows = getSelectRows();
    try {
      await funcAuditCore(selectRows, considerVoidFcDataAudit, considerVoidFCChangeAudit);
      reload();
    } finally {
      btnLoading.value = false;
    }
  };
</script>
