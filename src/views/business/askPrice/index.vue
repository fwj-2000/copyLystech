<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <WaitGrid>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_edit'" @click="handleBtn">{{ t('dict.Quotation.ConfirmOriginType.1') }} </a-button>
                <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleBatchTransfer">{{ t('dict.Flow.NodeAction.4') }} </a-button>
                <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }} </a-button>
                <a-button @click="handleInTag"> 询价标记 </a-button>
                <ModelConfirmButton
                  v-auth="'btn_transfer'"
                  :modelConfirm="{
                    onOk: handleBatchDispose,
                    content: t('dict.PriceInquiryColumn.ConfirmBatchProcessed'),
                  }">
                  {{ t('dict.PriceInquiryColumn.BatchProcessed') }}
                </ModelConfirmButton>
                <!--								<a-button v-auth="'btn_transfer'"-->
                <!--								          @click="handleBatchDispose"-->
                <!--								> 批量已处理-->
                <!--								</a-button>-->
              </template>
            </WaitGrid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <DoneGrid />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="reloadTable" />
    <DrawModal @register="registerDrawModal" />
    <TransferModal @register="registerModal" @reload="waitReload"></TransferModal>
    <RejectModal @register="registerRejectModal" @reload="reloadTable(activeKey)" />
    <FileListModal @register="registerFiles" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, toRefs, h } from 'vue';
  import { getPriceInquiry, getTransferuserAPI, linkPrices, rejectPriceInquiry, markQuotation, startInquiry } from '/@/api/engineering/ecn';
  import { waitGetColumns, formSchemas } from './CONFIG';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import DrawModal from './components/DrawModal.vue';
  import { RejectModal, TransferModal } from '/@/components/CustomComponents/index';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ModelConfirmButton } from '/@/components/Button/index';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import ContinueInquiryTip from './components/ContinueInquiryTip.vue';
  import FileListModal from '/@/views/engineering/quotationBom/components/HalfFinished/FilesModal.vue';
  import { getHalfFinishedPartFile } from '/@/api/engineering/quotatios';
  import ApplyPopup from '/@/views/purchase/basicInformation/materialPrice/components/ApplyPopup.vue';
  import { usePopup } from '/@/components/Popup';

  defineOptions({ name: 'business-askPrice' });

  const { t } = useI18n();

  const [registerDrawModal, { openModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();

  const { createMessage, createConfirm } = useMessage();
  const state = reactive({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const [
    WaitGrid,
    {
      reload: waitReload,
      getSelectRowKeys: waitGetSelectRowKeys,
      getSelectRows: waitGetSelectRows,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      setLoading: waitSetLoading,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formSchemas(),
      i18nConfig: {
        moduleCode: 'PriceInquiryColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-askPrice-wait-list',
      columns: waitGetColumns(handleDraw, showFilesModal, false),
      api: getPriceInquiry,
      beforeFetch: params => {
        params.dataFilter = 1;
        if (params.time && params.time.length > 0) {
          params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
          params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
          delete params.time;
        }
        return params;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'PriceInquiryColumn',
      },
      toolbarConfig: {
        delStatus: true,
      },
    },
  });

  const handleReject = async () => {
    const idList = waitGetSelectRowKeys();
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectPriceInquiry,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };

  function handleBatchDispose() {
    const idList = waitGetSelectRowKeys();
    linkPrices({
      ids: idList,
    }).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reloadTable();
      } else {
        createMessage.error(msg);
      }
    });
  }

  const [DoneGrid, { reload: doneReload, setLoading: doneSetLoading }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formSchemas(),
      i18nConfig: {
        moduleCode: 'PriceInquiryColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-askPrice-done-list',
      columns: waitGetColumns(handleDraw, showFilesModal, true),
      api: getPriceInquiry,
      beforeFetch: params => {
        params.dataFilter = 2;
        if (params.time && params.time.length > 0) {
          params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
          params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
          delete params.time;
        }
        return params;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'PriceInquiryColumn',
      },
      toolbarConfig: {
        delStatus: true,
      },
    },
  });

  // 处理转办
  const [registerModal, { openModal: openTransferModal }] = useModal();
  // 批量转办
  const handleBatchTransfer = async () => {
    const ids = waitGetSelectRows();
    if (ids && ids.length === 0) {
      return message.warning(t('common.selectTransferContent'));
    }
    openTransferModal(true, {
      id: ids || [],
      hasRemark: false,
      submitCallback: handleTransferCB,
    });
  };
  const handleTransferCB = async data => {
    const r = await getTransferuserAPI({
      ids: data.id.map(el => el.id),
      remark: data.remark,
      handlerId: data.transferUser,
    });
    return r;
  };

  async function handleBtn() {
    const list = waitGetSelectRows();
    console.log(list);
    if (list.length == 0) {
      return createMessage.warning(t('common.selectText'));
    }

    // 材料类型(materialAreaCode)是委外半成品(Delegate)、外购半成品(Outsourcing)                                      校验“半成品料号(materialCode)”是否重复
    // 材料类型(materialAreaCode)是辅材(AuxiliaryMaterials)、包材(PackagingMaterials)、杂项(Sundry)                   校验“材料内部料号(materialCode)”是否重复
    // 材料类型(materialAreaCode)是主材(MainMaterials)                                                              校验“材料内部料号(materialCode)+终端客户(terminalCustomerCode)+产品线(productLineCode)”是否重复
    // 不存在料号的项目，不校验
    // 重复的不能进入新建报价的界面
    const seenKeys = new Set();
    let duplicateItem: any = null;
    // 委外半成品、外购半成品：校验materialCode
    const type1List = ['Delegate', 'Outsourcing'];
    // 辅材、包材、杂项：校验materialCode
    const type2List = ['AuxiliaryMaterials', 'PackagingMaterials', 'Sundry', 'Out'];
    for (const item of list) {
      const { materialAreaCode, materialCode, terminalCustomerCode, productLineCode } = item;
      if (!materialCode) {
        continue;
      }
      let key = '';
      if (type1List.includes(materialAreaCode)) {
        // 委外半成品、外购半成品：校验materialCode
        key = `type1:${materialCode}`;
      } else if (type2List.includes(materialAreaCode)) {
        // 辅材、包材、杂项：校验materialCode
        key = `type2:${materialCode}`;
      } else if (materialAreaCode === 'MainMaterials') {
        // 主材：校验materialCode+terminalCustomerCode+productLineCode
        key = `type3:${materialCode}_${terminalCustomerCode}_${productLineCode}`;
      }
      // 检查键是否已存在
      if (seenKeys.has(key)) {
        duplicateItem = item;
        break;
      }
      materialAreaCode && seenKeys.add(key);
    }
    // 如果存在重复项，提示用户并中断流程
    if (duplicateItem) {
      createMessage.warn(t('dict.PriceInquiry.duplicateDataTip', [duplicateItem.materialCode, duplicateItem.materialAreaName]));
      return false;
    }

    /** 如果有处于询价中的数据，询问用户是否继续询价 */
    let flag = true;
    const inquiringList = list.filter(item => +item.isInquiry === 1);
    if (inquiringList.length > 0) {
      await new Promise(resolve => {
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          width: 580,
          content: h(ContinueInquiryTip, { list: inquiringList }),
          onOk: async () => {
            resolve(true);
          },
          onCancel: async () => {
            flag = false;
            resolve(false);
          },
        });
      });
    }

    if (!flag) {
      return false;
    }

    // 标记为询价中
    const noInquiryList = list.filter(item => +item.isInquiry !== 1);
    noInquiryList.length > 0 && startInquiry(noInquiryList.map(item => item.id));

    openApplyPop(true, {
      mode: 'edit',
      index: 0,
      cacheList: list,
      source: 'askPrice',
      showSubmit: true,
    });
  }

  // 询价标记
  const handleInTag = async () => {
    const selectedRowKeys = waitGetSelectRowKeys();
    if (selectedRowKeys?.length === 0) return message.info(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '如果该数据已被标记过，则取消标记',
      onOk: async () => {
        try {
          const { msg, code } = await markQuotation(selectedRowKeys);
          if (code === 200) {
            waitClearSelectedRowKeys();
            message.success(msg);
            reloadTable(state.activeKey);
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:322 ~ handleInTag ~ e:', e);
          waitClearSelectedRowKeys();
          reloadTable(state.activeKey);
        }
      },
    });
  };

  function handleDraw(record) {
    console.log(record.originId, 'record.originId');
    openModal(true, {
      id: record.originId,
      applyNo: record.applyNo,
    });
  }

  function reloadTable(e?) {
    const key = e || state.activeKey;
    if (key == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }

  const [registerFiles, { openModal: openFilesModal }] = useModal();
  /** 展示文件列表弹窗 */
  function showFilesModal(row: any) {
    activeKey.value === '1' ? waitSetLoading(true) : doneSetLoading(true);
    getHalfFinishedPartFile(row.originId)
      .then(res => {
        openFilesModal(true, { drawingFile: res.data || [], halfFinishedPart: row.materialCode, disabled: true });
      })
      .finally(() => {
        activeKey.value === '1' ? waitSetLoading(false) : doneSetLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
