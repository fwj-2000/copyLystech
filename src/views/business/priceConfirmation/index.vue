<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <GridWaiting>
              <template #toolbar-actions>
                <a-button v-auth="'btn_add'" type="primary" @click="handleApprove">{{ t('dict.QuotationFlowNode.Confirm') }} </a-button>
                <a-button v-auth="'btn_add'" type="primary" ghost @click="handleSync"> {{ t('dict.QuotationFlowNode.SyncPrice') }} </a-button>
                <a-button type="primary" v-auth="'btn_transfer'" ghost @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_priceExport'" @click="handlePriceExport(true)"> {{ t('common.priceExport') }} </a-button>
                <a-button v-auth="'btn_Export'" @click="handlePriceExport(false)"> {{ t('dict.notPriceExport') }} </a-button>
                <!--                <a-button v-auth="'btn_download'"-->
                <!--                          @click="handleExport"-->
                <!--                >{{ t("views.business.quota.export") }}-->
                <!--                </a-button>-->
                <!--            <a-button v-auth="'btn_result_input'" @click="handleEnterPrice"> 竞价结果录入 </a-button>-->
              </template>
              <template #confirmOpinion="{ row }">
                <Badge v-if="row.confirmOpinion == '2'" color="#f50" :text="t('common.disagree')" />
                <Badge v-else-if="row.confirmOpinion == '1'" color="#87d068" :text="t('common.agree')" />
              </template>
              <template #originType="{ row }">
                <a-tag v-if="row.originType == '1'" color="blue">{{ t('dict.Quotation.ConfirmOriginType.1') }}</a-tag>
              </template>
              <template #quota="{ row, rowIndex }">
                <span class="table-a" @click="handlePdDetail(row, rowIndex)">{{ t('common.searchDetail') }}</span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridWaiting>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-button @click="handleExport" type="primary">{{ t('common.quotationExport') }} </a-button>
                <a-button v-auth="'btn_priceExport'" @click="handlePriceExport(true)"> {{ t('common.priceExport') }} </a-button>
                <a-button v-auth="'btn_Export'" @click="handlePriceExport(false)"> {{ t('dict.notPriceExport') }} </a-button>
              </template>
              <template #quota="{ row, rowIndex }">
                <span class="table-a" @click="handlePdDetail(row, rowIndex)">{{ t('common.viewText') }}</span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="doneGetActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <EnterPrice @register="registerEnterPriceForm" @reload="reloadTable(activeKey)" />
    <AgreePopup @register="registerAgreePopup" @reload="reloadTable(activeKey)" @colse="reloadTable(activeKey)" />
    <AgreeDetailPopup @register="registerAgreeDetailPopup" @reload="reloadTable(activeKey)" @colse="reloadTable(activeKey)" />
    <DetailResult @register="registerDetailResultPopup" @reload="reloadTable(activeKey)" @colse="reloadTable(activeKey)" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <DetailPopup @register="registerDetail" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { Badge } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { reactive, toRefs, unref } from 'vue';
  import EnterPrice from './components/EnterPrice.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { doneGetVxeColumns, doneGetVxeFormConfig, waitGetVxeColumns, waitGetVxeFormConfig } from '/@/views/business/priceConfirmation/CONFIG';
  import { exportQuotation, getConfirmPriceList, updatePrice, exportCost } from '/@/api/business/priceConfirmation';
  import AgreePopup from './components/AgreePopup.vue';
  import AgreeDetailPopup from './components/AgreeDetailPopup.vue';
  import DetailResult from './components/DetailResult.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { confirmTransferQuotation } from '/@/api/engineering/quotatios';
  import { TransferModal } from '/@/components/CustomComponents';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import DetailPopup from '/@/views/engineering/quotationBom/components/DetailPopup.vue';

  defineOptions({ name: 'business-priceConfirmation' });
  const { t } = useI18n();
  const [registerEnterPriceForm, { openModal: openEnterPriceForm }] = useModal();
  const [registerAgreePopup, { openPopup: openAgreePopup }] = usePopup();
  const [registerAgreeDetailPopup, { openPopup: openAgreeDetailPopup }] = usePopup();
  const [registerDetailResultPopup, { openPopup: openDetailResultPopup }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();

  const { createMessage } = useMessage();

  const state = reactive({
    cacheList: [],
    activeKey: '1',
    waitCacheList: [],
    doneCacheList: [],
  });

  const { activeKey } = toRefs(state);

  const [
    GridWaiting,
    { reload: waitReload, getSelectRowKeys: waitGetSelectRowKeys, getSelectRows: waitGetSelectRows, clearSelectedRowKeys: waitClearSelectedRowKeys },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: waitGetVxeFormConfig(),
    },
    gridOptions: {
      id: 'business-priceConfirmation-todo-list',
      columns: waitGetVxeColumns() as any,
      api: getConfirmPriceList,
      beforeFetch: (params: any) => {
        params.dataFilter = 3;
        if (params.creatorTime) {
          params.purchaseQuotationStartTime = dateUtil(params.creatorTime[0]).startOf('day').format('x');
          params.purchaseQuotationEndTime = dateUtil(params.creatorTime[1]).endOf('day').format('x');
          // params.startTime = params.creatorTime[0];
          // params.endTime = params.creatorTime[1];
          delete params.creatorTime;
        }
        return params;
      },
      afterFetch: (res: any) => {
        const list = res?.list || [];
        state.waitCacheList = list;
        res.list = list.map((item: any) => ({
          ...item.parentPartInfo,
          ...item,
        }));
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
        excludeFields: ['creatorTime'],
      },
      toolbarConfig: {
        superQuery: true,
        delStatus: true,
      },
    },
  });

  const [GridDone, { reload: doneReload, getSelectRowKeys: doneGetSelectRowKeys }] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: doneGetVxeFormConfig(),
    },
    gridOptions: {
      id: 'business-priceConfirmation-done-list',
      columns: doneGetVxeColumns(),
      api: getConfirmPriceList,
      beforeFetch: (params: any) => {
        params.dataFilter = 4;
        if (params.creatorTime) {
          params.purchaseQuotationStartTime = dateUtil(params.creatorTime[0]).startOf('day').format('x');
          params.purchaseQuotationEndTime = dateUtil(params.creatorTime[1]).endOf('day').format('x');
          delete params.creatorTime;
        }
        return params;
      },
      afterFetch: (res: any) => {
        const list = res?.list || [];
        state.doneCacheList = list;
        res.list = list.map((item: any) => ({
          ...item.parentPartInfo,
          ...item,
        }));
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
        excludeFields: ['creatorTime'],
      },
      toolbarConfig: {
        superQuery: true,
        delStatus: true,
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, record, 'wait'),
      },
    ];
  }

  function doneGetActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        // onClick: handleApprove.bind(null, index, "done")
        onClick: handleAgreeDetail.bind(null, record),
      },
    ];
  }

  function handleAgreeDetail(record) {
    openAgreeDetailPopup(true, { record });
  }

  function handleDetail(record, type) {
    openDetailResultPopup(true, { record });
  }

  function reloadTable(e) {
    if (e == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }

  function handleTransfer() {
    const idList = waitGetSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await confirmTransferQuotation({
      list: id,
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  // 价格明细导出
  async function handlePriceExport(isPrice) {
    const idList = activeKey.value === '1' ? waitGetSelectRowKeys() : doneGetSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    const { code, data, msg } = await exportCost({
      ids: idList.join(','),
      isPrice,
    });
    // 导出文件
    if (code == 200) {
      downloadByUrl({
        url: data.url,
      });
      createMessage.success(msg);
    } else {
      createMessage.error(msg);
    }
  }

  function handleApprove() {
    const rows = waitGetSelectRows();
    if (rows.length == 0) return createMessage.warning(t('common.BeConfirmed'));
    openAgreePopup(true, { cacheList: rows });
    waitClearSelectedRowKeys();
  }

  function handleSync() {
    const rows = waitGetSelectRows();
    console.log(rows);
    const filterRows = rows.filter(item => item.originType == 1);
    if (filterRows.length <= 0) return createMessage.warning(t('common.ToEngineeringQuotation'));
    updatePrice(filterRows.map(item => item.id)).then(({ code, msg }) => {
      if (code == 200) {
        reloadTable(state.activeKey);
        waitClearSelectedRowKeys();
        createMessage.success(msg);
      } else {
        createMessage.error(msg);
      }
    });
  }

  function handleExport() {
    const rowKeys = doneGetSelectRowKeys();
    if (!rowKeys.length) return createMessage.warning(t('common.selectText'));
    exportQuotation({
      ids: rowKeys.join(),
    }).then(({ code, data, msg }) => {
      if (code == 200) {
        downloadByUrl({
          url: data.url,
        });
        createMessage.success(msg);
      } else {
        createMessage.error(msg);
      }
    });
  }

  function handleEnterPrice() {
    const rows = waitGetSelectRows();
    if (rows.length == 0) return createMessage.warning('请选择需要录入的报价单');
    const cacheList = rows.filter(item => item.biddingResult == 1);
    if (cacheList.length == 0) return createMessage.warning('请选择竞价成功的报价单');
    openEnterPriceForm(true, { cacheList });
  }

  function handleEditResult(record) {
    openEnterPriceForm(true, { cacheList: [record] });
  }

  function handleGetCacheList() {
    return state.activeKey == '1' ? state.waitCacheList : state.doneCacheList;
  }
  // 打开工程详情
  function handlePdDetail(record, index) {
    openDetail(true, {
      index,
      mode: 'view',
      cacheList: handleGetCacheList(),
    });
  }

  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    getConfirmPriceList({ id: params.id }).then(res => {
      openAgreePopup(true, { cacheList: res.data.list });
    });
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
