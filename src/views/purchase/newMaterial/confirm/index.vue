<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_sendEmail'" @click="handleEmail"> {{ t('common.sendEmail') }} </a-button>
                <a-button type="primary" v-auth="'btn_sendSample'" ghost @click="handleSample">{{ t('common.sendSample') }}</a-button>
                <!-- <a-button type="primary" ghost v-auth="'btn_edit'" @click="handleDetail">{{ t('common.updateMetariaInfo') }}</a-button> -->
                <a-button type="primary" ghost v-auth="'btn_recommend'" @click="handleRecommend">{{ t('common.reRecommend') }}</a-button>
                <a-button type="primary" ghost v-auth="'btn_stop'" @click="handleStop"> {{ t('common.stopText') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridTodo>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleExportDone">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <StopModal @register="registerStopModal" @reload="refresh" />
    <DetailPopup @register="registerDetail" @reload="refresh" />
    <SamplePopup @register="registerSamplePopup" @reload="refresh"></SamplePopup>
    <EmailPopup @register="registerEmailPopup" @reload="clearSelectedRowKeys"></EmailPopup>
    <Recommend @register="registerRecommendPopup" @reload="refresh"></Recommend>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, nextTick } from 'vue';
  import { schemaList, columns, columnsDone, columnsExport, columnsDoneExport, schemaDoneList } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getMaterialConfirmList, exportMaterialConfirmExcel, bulkBackReview, bulkBackTermination, getNodelist } from '/@/api/purchase/newMateriaConfirm';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import Recommend from './components/Recommend.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import EmailPopup from './components/EmailPopup.vue';
  import SamplePopup from './components/SendSample.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  defineOptions({ name: 'purchase-newMaterial-confirm' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const userStore = useUserStore();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerEmailPopup, { openPopup: openEmailPopup }] = usePopup();
  const [registerSamplePopup, { openPopup: openSamplePopup }] = usePopup();
  const [registerRecommendPopup, { openPopup: openRecommendPopup }] = usePopup();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });

  const tableConfig: any = {
    api: getMaterialConfirmList,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  };

  const baseFormConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder'],
    },
  };

  // 待处理：currentProcessorId 带默认值
  const todoFormConfig = {
    ...baseFormConfig,
    schema: schemaList.map(item => {
      if (item.fieldName === 'currentProcessorId') {
        return {
          ...item,
          componentProps: {
            ...item.componentProps,
            defaultValue: userStore.getUserInfo.userId,
          },
        };
      }
      return item;
    }),
  };

  // 已处理：不带默认当前处理人
  const doneFormConfig = {
    ...baseFormConfig,
    schema: schemaDoneList,
  };

  const [
    GridTodo,
    {
      reload: reloadTodo,
      getFetchParams: getFetchParamsTodo,
      getSelectRowKeys: getSelectRowKeysTodo,
      clearSelectedRowKeys: clearSelectedRowKeysTodo,
      getSelectRows,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      ...todoFormConfig,
    },
    gridOptions: {
      ...tableConfig,
      columns,
      id: 'purchase-newMaterial-confirm-todolist',
    },
  });
  const [
    GridDone,
    { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone },
  ] = useVbenVxeGrid({
    formOptions: {
      ...doneFormConfig,
    },
    gridOptions: {
      ...tableConfig,
      columns: columnsDone,
      id: 'purchase-newMaterial-confirm-Donelist',
    },
  });

  // 刷新页面
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }
  function reload() {
    if (state.activeKey == '1') {
      return reloadTodo();
    }
    return reloadDone();
  }
  async function getFetchParams() {
    if (state.activeKey == '1') {
      return await getFetchParamsTodo();
    }
    return await getFetchParamsDone();
  }
  function getSelectRowKeys() {
    if (state.activeKey == '1') {
      return getSelectRowKeysTodo();
    }
    return getSelectRowKeysDone();
  }
  function clearSelectedRowKeys() {
    if (state.activeKey == '1') {
      return clearSelectedRowKeysTodo();
    }
    return clearSelectedRowKeysDone();
  }

  function getActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  function handleDetail(record) {
    if (record.id) {
      return openDetail(true, {
        ids: [record.id],
        type: 'view',
      });
    }
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openDetail(true, {
        ids: idList,
        type: 'view',
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  async function handleExport() {
    openExportModal(true, {
      api: exportMaterialConfirmExcel,
      listQuery: {
        identification: state.activeKey,
        ...(await getFetchParams()),
      },
      exportOptions: cloneDeep(columnsExport),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }
  async function handleExportDone() {
    openExportModal(true, {
      api: exportMaterialConfirmExcel,
      listQuery: {
        identification: state.activeKey,
        ...(await getFetchParams()),
      },
      exportOptions: cloneDeep(columnsDoneExport),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // 送样确认
  function handleSample() {
    const idList = getSelectRows() || [];
    if (idList.length) {
      // 现有材料和复核状态为不满足的，均不可送样
      const hasNotSafity = idList.find(el => el.engineeringStatus == 2);
      if (hasNotSafity) {
        return createMessage.info(t('common.metariaSampleTip'));
      }
      const isExistMetaria = idList.find(el => el.materialCode);
      if (isExistMetaria) {
        return createMessage.info(t('common.metariaSampleTip2'));
      }
      return openSamplePopup(true, {
        ids: idList.map(el => el.id),
      });
    }
    createMessage.info(t('common.selectText'));
  }
  // 重新推荐
  function handleRecommend() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRecommendPopup(true, {
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }
  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }
  // 撤回
  async function handleRecall() {
    handleSelectData(bulkBackReview);
  }

  // 发送邮件
  function handleEmail() {
    const idList = getSelectRows() || [];
    if (idList.length) {
      return openEmailPopup(true, {
        list: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  //  终止
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        api: bulkBackTermination,
        required: true,
        ids: idList,
        beforeFetch: params => {
          return {
            terminationRemarks: params.remark,
            ids: idList,
          };
        },
      });
    }
    createMessage.info(t('common.selectText'));
  }

  const route = useRoute();
  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleDetail(id);
      });
    }
  });

  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    // 没有 id 就不用处理了
    if (!id) return;
    // 有 tab 就先切到对应 tab（比如 1：待办，2：已办）
    if (tab) {
      state.activeKey = tab;
    }
    nextTick(() => {
      openSamplePopup(true, {
        index: 0,
        ids: [id],
      });
    });
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
