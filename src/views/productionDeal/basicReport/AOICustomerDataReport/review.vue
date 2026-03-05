<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 审核 -->
              <a-button type="primary" class="mr-12px" v-auth="'btn_audit'" v-if="props.searchKey === '0' || props.searchKey === '1'" @click="handleAudit">
                {{ t('common.audit') }}
              </a-button>
              <!-- 撤回 -->
              <a-button
                type="primary"
                ghost
                class="mr-12px"
                v-auth="'btn_revoke'"
                v-if="props.searchKey === '0' || props.searchKey === '1'"
                @click="handleFlowwithdraw">
                {{ t('common.revoke') }}
              </a-button>
              <!-- 推送Serin -->
              <a-button type="primary" ghost class="mr-12px" @click="handlePush" v-auth="'btn_push'" v-if="props.searchKey === '2'">
                {{ t('dict.CommonCol.pushSerin') }}
              </a-button>
              <!-- 查看JSON -->
              <a-button type="primary" ghost class="mr-12px" @click="viewPushContent" v-auth="'btn_viewJSON'">
                {{ t('dict.CommonCol.viewJSON') }}
              </a-button>
              <!-- 批量导出 -->
              <a-button class="mr-12px" @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>

          <template #result="{ row }">
            <LydcTag v-if="row.result.toLowerCase() === 'ok'" theme="green" text="OK"></LydcTag>
            <LydcTag v-else theme="red" text="NG"></LydcTag>
          </template>
          <template #sendStatus="{ row }">
            <!-- 待提交 -->
            <LydcTag v-if="row.sendStatus === 1" theme="gray" :text="t('common.submitTodo')"></LydcTag>
            <!-- 审核中 -->
            <LydcTag v-if="row.sendStatus === 2" theme="blue" :text="t('common.auditing')"></LydcTag>
            <!-- 审核失败 -->
            <LydcTag v-if="row.sendStatus === 3" theme="red" :text="t('dict.CommonCol.reviewFailed')"></LydcTag>
            <!-- 待发送 -->
            <LydcTag v-if="row.sendStatus === 4" theme="gray" :text="t('dict.CommonCol.toBeSent')"></LydcTag>
            <!-- 发送中 -->
            <LydcTag v-if="row.sendStatus === 5" theme="blue" :text="t('dict.CommonCol.sending')"></LydcTag>
            <!-- 发送失败 -->
            <LydcTag v-if="row.sendStatus === 6" theme="red" :text="t('dict.CommonCol.failedToSend')"></LydcTag>
            <!-- 发送成功 -->
            <LydcTag v-if="row.sendStatus === 7" theme="green" :text="t('dict.CommonCol.sentSuccessfully')"></LydcTag>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ViewPushContentModal @register="registerViewPushContent" @reload="reload"> </ViewPushContentModal>
    <ViewPushRecordModal @register="registerViewPushRecord"> </ViewPushRecordModal>
    <AuditModal @register="registerAudit" @reload="reload"> </AuditModal>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, toRaw } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { schema, column } from './config';
  import { downloadByUrl } from '/@/utils/file/download';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import Decimal from 'decimal.js';
  import { getAOISizeDataReportList, AOISizeDataReportExport, AOISizeDataReportSendSerin } from '/@/api/productionDeal/AOICustomerDataReport';
  import { message } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import ViewPushContentModal from './components/viewPushContentModal.vue';
  import ViewPushRecordModal from './components/viewPushRecordModal.vue';
  import AuditModal from './components/auditModal.vue';
  import { flowwithdraw } from '/@/api/productionDeal/AOIDataAudit';
  import { processGroupColumn } from '../AOIDataReport/utils';

  const { t } = useI18n();

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const [registerViewPushContent, { openModal: openViewPushContent }] = useModal();
  const [registerViewPushRecord, { openModal: openViewPushRecord }] = useModal();
  const [registerAudit, { openModal: openAudit }] = useModal();
  const { createConfirm } = useMessage();

  async function handleGetAOISizeDataReportList(params) {
    if (!params.product || (!params.serialNumbers && !params.creatorTimeStart)) return {};
    const res = await getAOISizeDataReportList({ ...params, dataType: 0 });
    return res;
  }

  const [Grid, { getFromValue, reloadData, reloadColumn, getSelectRows, reload, getSelectRowKeys, setLoading }] = useVbenVxeGrid({
    formOptions: {
      // showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: schema,
    },
    gridOptions: {
      // id: 'productionDeal-basicReport-AOICustomerDataReport-list',
      columns: column,
      showIndexColumn: true,
      api: handleGetAOISizeDataReportList,
      // toolbarConfig: {
      //   custom: false,
      // },
      beforeFetch: params => handleParams(params),
      afterFetch: data => {
        // const colorList = ['header-orange', 'header-blue', 'header-skeyblue', 'header-green', 'header-red'];
        // const columnList = data?.columns.map(item => {
        //   if (item.field === 'result') {
        //     return {
        //       ...item,
        //       width: '130px',
        //       slots: { default: 'result' },
        //     };
        //   } else if (item.field === 'sendStatus') {
        //     return {
        //       ...item,
        //       width: '130px',
        //       slots: { default: 'sendStatus' },
        //     };
        //   } else if (item.group) {
        //     const colorIndex = (Number(item.group) - 1) % colorList.length;
        //     if (item.children && item.children.length > 0) {
        //       const childrenItem = item.children.map(children1 => {
        //         return {
        //           ...children1,
        //           children: children1.children.map(children2 => {
        //             return {
        //               ...children2,
        //               children: children2.children.map(children3 => {
        //                 return {
        //                   ...children3,
        //                   width: 100,
        //                   className: ({ row }) => {
        //                     // 标准值
        //                     const standardValue = Number(children1.title);
        //                     // 上公差
        //                     const upperTolerance = Number(children2.title);
        //                     // 下公差
        //                     const lowerTolerance = Number(children3.title);
        //                     return Number(row[children3.field]) > Number(Decimal(standardValue).plus(Decimal(upperTolerance))) ||
        //                       Number(row[children3.field]) < Number(Decimal(standardValue).plus(Decimal(lowerTolerance)))
        //                       ? 'cell-red'
        //                       : '';
        //                   },
        //                 };
        //               }),
        //             };
        //           }),
        //         };
        //       });
        //       return {
        //         ...item,
        //         width: '130px',
        //         headerClassName: colorList[colorIndex],
        //         children: childrenItem,
        //       };
        //     } else {
        //       return {
        //         ...item,
        //         width: '130px',
        //         headerClassName: colorList[colorIndex],
        //       };
        //     }
        //   } else {
        //     return {
        //       ...item,
        //       width: '130px',
        //     };
        //   }
        // });
        // columnList?.length && columnList.unshift({ field: 'checkbox', width: 50, type: 'checkbox' });
        // const actionColumn = {
        //   title: '操作',
        //   field: 'action',
        //   slots: { default: 'action' },
        //   width: '60',
        //   fixed: 'right',
        // };
        // reloadColumn([...(columnList || []), actionColumn]);
        // reloadData(data?.list);
        const processColumn = column => {
          switch (true) {
            case column.field === 'result':
              return {
                ...column,
                width: '130px',
                slots: { default: 'result' },
              };
            case column.field === 'sendStatus':
              return {
                ...column,
                width: '130px',
                slots: { default: 'sendStatus' },
              };
            case !!column.group:
              return processGroupColumn(column);
            default:
              return {
                ...column,
                width: '130px',
              };
          }
        };
        const columnList = data?.columns?.map(processColumn) || [];
        columnList?.length && columnList.unshift({ field: 'checkbox', width: 50, type: 'checkbox' });
        const actionColumn = {
          title: '操作',
          field: 'action',
          slots: { default: 'action' },
          width: '60',
          fixed: 'right',
        };
        reloadColumn([...columnList, actionColumn]);
        reloadData(data?.list);
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: viewPushRecord.bind(null, record),
        tooltip: t('dict.CommonCol.viewPushRecords'),
        auth: 'btn_pushRecord',
      },
    ];
  }

  const viewPushRecord = record => {
    openViewPushRecord(true, record);
  };

  // 处理参数
  function handleParams(params) {
    params.type = props.searchKey;
    if (params.pickerVal && params.pickerVal.length > 0) {
      params.creatorTimeStart = dateUtil(params.pickerVal[0]).valueOf();
      params.creatorTimeEnd = dateUtil(params.pickerVal[1]).valueOf();
    }
    delete params.pickerVal;
    return params;
  }

  // 审核
  const handleAudit = async () => {
    const formValue = await getFromValue();
    const params = handleParams(toRaw(formValue));
    if (!params.product) return message.warning(t('dict.CommonCol.productQueryRequired'));
    if (!params.serialNumbers && !params.creatorTimeStart) return message.warning(t('dict.CommonCol.searchCriteria'));
    openAudit(true, params);
  };

  // 撤回
  const handleFlowwithdraw = () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length === 0) return message.warning(t('common.selectText'));
    if (idList.length > 1) return message.warning(t('dict.CommonCol.selectedOneData'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.batchRecallOperationTip'),
      onOk: async () => {
        const { msg, code } = await flowwithdraw({ id: idList[0] });
        if (code === 200) {
          message.success(msg);
          reload();
        }
      },
    });
  };

  const handlePush = () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    if (list.some(item => item.sendStatus === 5 || item.sendStatus === 7)) return message.warning(t('dict.CommonCol.pushedDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performPushTip'),
      onOk: async () => {
        const { code, msg } = await AOISizeDataReportSendSerin(list.map(item => item.id));
        if (code === 200) {
          message.success(msg);
          reload();
        }
      },
    });
  };

  const viewPushContent = () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    if (list.length > 1) return message.warning(t('dict.CommonCol.selectedOneData'));
    openViewPushContent(true, list[0]);
  };

  // 批量导出
  const handleExport = async () => {
    const params = cloneDeep(await getFromValue());
    const requestParams = handleParams(params);
    if (!requestParams.product || (!requestParams.serialNumbers && !requestParams.creatorTimeStart)) return message.warning(t('dict.CommonCol.checkDataFirst'));
    setLoading(true);
    AOISizeDataReportExport(requestParams)
      .then(res => {
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      })
      .finally(() => setLoading(false));
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  ::v-deep(.header-orange) {
    color: #ff7b00;
  }

  ::v-deep(.header-blue) {
    color: blue;
  }

  ::v-deep(.header-green) {
    color: green;
  }

  ::v-deep(.header-red) {
    color: red;
  }

  ::v-deep(.header-skeyblue) {
    color: skeyblue;
  }

  ::v-deep(.cell-red) {
    color: red;
  }
</style>
