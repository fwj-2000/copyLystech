<!-- 数据版本明细 -->
<template>
  <BasicPopup v-bind="attrs" @register="registerPopup">
    <template #insertToolbar>
      <a-space>
        <a-button type="primary" ghost @click="handleRejectModal" :loading="agreeLoading">{{ t('common.rejectText') }}</a-button>
        <a-button type="primary" @click="handleAgree" :loading="agreeLoading">{{ t('common.agree') }}</a-button>
        <a-button type="primary" @click="handleRevoke" :loading="agreeLoading">{{ t('common.revoke') }}</a-button>
        <a-button
          type="primary"
          @click="
            goPath(
              '/dashboard/customerService/forecastTable',
              {
                status: ETableType.PRE,
                batchNumber: recordInfo.batchNumber,
                customerPerson: recordInfo.applyUserName?.split('/')[1] ?? '',
                date: getWeekDate(recordInfo.fcWeek),
                materialPreparationPrinciple: recordInfo.materialPreparationPrinciple,
              },
              go,
            )
          ">
          {{ t('routes.dashboard-customerService-metricsCenter') }}
        </a-button>
        <a-tooltip placement="bottomLeft" :arrow="false">
          <template #title>
            <span>{{ recordInfo.materialPreparationPrinciple || '' }}</span>
          </template>
          <a-button type="primary">{{ t('dict.fcDataAudit.MP') }}</a-button>
        </a-tooltip>
      </a-space>
    </template>
    <div class="h-full flex flex-col p-2">
      <div class="w-[100%] h-[44px] flex justify-between items-center">
        <div class="flex gap-2">
          <div class="w-[2px] h-[14px] bg-[#ff7b00]"> </div>
          <div class="text-[14px] font-bold">
            {{ t('routes.customerService-information-fcDataAudit') }}
          </div>
        </div>
        <a-button type="primary" ghost @click="handleBatchExport">{{ t('common.batchExport') }}</a-button>
      </div>
      <div class="w-[100%] h-[100%] flex-shrink-1 overflow-hidden vxe-table">
        <Grid />
      </div>
    </div>
  </BasicPopup>
  <RejectModal @register="registerRejectModal" @reload="close"></RejectModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { isFunction } from 'lodash-es';
  import { attrs } from './config';
  import { columns } from '/@/views/customerService/information/fcData/components/config';
  import { getWeekTitle } from '/@/components/CustomComponents/src/fc/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { commitFcDataAudit, rejectFcDataAudit, withdrawFcDataAudit, commitFCChangeAudit, withdrawFCChangeAudit } from '/@/api/dashbord/fc';
  import { getWeekDate, goPath, funcAuditCore } from '../utils';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { RejectModal } from '/@/components/CustomComponents';
  import { getFcData } from '/@/api/customerSerivce/fcData';
  import { ETableType } from '../types';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  dayjs.extend(isoWeek);
  const emits = defineEmits(['reload']);
  const agreeLoading = ref(false);
  const recordInfo = ref<any>();
  const total = ref(0);
  const { t } = useI18n();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal(); // 驳回弹窗
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      footerCellClassName: 'vxe-foot-data-cell',
      proxyConfig: {
        response: {
          result: 'data.pageData.list',
          total: 'data.pageData.pagination.total',
        } as any,
        ajax: {
          queryAll: async () => {
            const list = await getFcData({
              batchNumber: recordInfo.value.batchNumber,
              searchDate: recordInfo.value.fcWeek,
              pageSize: total.value,
              currentPage: 1,
            });
            return list.data.pageData.list;
          },
        },
      },
      columns: columns.slice(2) as any,
      // 关闭单元格选取
      mouseConfig: {
        selected: false,
        area: false,
      },
      // 关闭工具栏
      toolbarConfig: {
        zoom: false,
        custom: false,
        refresh: false,
      },
      exportConfig: {
        type: 'xlsx',
        types: ['xlsx'],
        mode: 'all',
        modes: ['current', 'all'],
      },
      i18nConfig: {
        // moduleCode: 'FcDataColumn',
      },
      beforeFetch: params => {
        params.batchNumber = recordInfo.value.batchNumber;
        params.searchDate = recordInfo.value.fcWeek;
        // 使用 dayjs 根据年份和周数获取该周的第一天
        const data = recordInfo.value.fcWeek.split('WK');
        // 修改列名
        const year = Number.parseInt(data[0], 10);
        const week = Number.parseInt(data[1], 10);
        const date = dayjs().year(year).isoWeek(week).startOf('isoWeek');
        let nowColumns = columns.slice(2).map(item => {
          if (item.field.startsWith('quantity') || item.field.startsWith('totalPrice')) {
            const idx = item.field.replace('quantity', '').replace('totalPrice', '');
            return {
              ...item,
              title: getWeekTitle(date, Number.parseInt(idx, 10) - 1),
            };
          }
          return item;
        });
        gridApi.setState({
          gridOptions: {
            columns: nowColumns as any,
          },
        });
        return params;
      },
      afterFetch: result => {
        console.log(result);
        const { summaryData, pageData } = result;
        total.value = pageData.pagination.total;
        // 设置表尾数据
        const footerData = columns.reduce((pre, cur) => {
          const { field, formatter } = cur;
          if (isFunction(formatter)) {
            return {
              ...pre,
              [field]: formatter({ cellValue: summaryData[field] }),
            };
          }
          return {
            ...pre,
            [field]: summaryData[field],
          };
        }, {});
        gridApi.setState({
          gridOptions: {
            footerData: [footerData],
          },
        });
      },
      api: getFcData,
      position: 'modal',
    },
  });
  const { reload } = gridApi;
  const [registerPopup, { closePopup }] = usePopupInner(({ record }) => {
    recordInfo.value = record;
    reload();
  });
  // 批量导出
  const handleBatchExport = () => {
    gridApi?.grid?.openExport({
      filename: () => `${t('FC')}_${dayjs().format('YYYY-MM-DD')}`,
    });
  };
  // 打开驳回弹窗
  const handleRejectModal = () => {
    agreeLoading.value = true;
    openRejectModal(true, {
      ids: [recordInfo.value.id],
      api: rejectFcDataAudit,
    });
  };

  function close() {
    agreeLoading.value = false;
    closePopup();
    emits('reload');
  }

  // 同意
  const handleAgree = async () => {
    agreeLoading.value = true;
    try {
      await funcAuditCore([{ id: recordInfo.value.id }], commitFcDataAudit, commitFCChangeAudit);
      close();
    } finally {
      agreeLoading.value = false;
    }
  };

  // 撤回
  const handleRevoke = async () => {
    agreeLoading.value = true;
    try {
      await funcAuditCore([{ id: recordInfo.value.id }], withdrawFcDataAudit, withdrawFCChangeAudit);
      close();
    } finally {
      agreeLoading.value = false;
    }
  };
</script>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .vxe-foot-data-cell {
      font-weight: bold;
      color: #000;
      text-align: right;
      background-color: rgb(255 123 0 / 20%);
    }
  }
</style>
