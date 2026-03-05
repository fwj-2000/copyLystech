<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Todo_Grid>
              <template #toolbar-actions>
                <ModelConfirmButton
                  v-auth="'btn_reject'"
                  type="primary"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('确认同意分配该料号的占有数量？'),
                      onOk: handleAgree.bind(null),
                    },
                  }">
                  <span>{{ t('common.agree') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_agree'" @click="handleReject">{{ t('common.rejectText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.children" />
              </template>
            </Todo_Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Check_Grid>
              <template #toolbar-actions>
                <!-- <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton> -->
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.children" />
              </template>
            </Check_Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <RejectModal @register="registerRejectModal" @reload="reload"></RejectModal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { columns, formSchema, doneColumns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getAsignList, exportAsign, auditAsign, refuseAsign } from '/@/api/mps/productionPlan/availableAudit';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubTable from './components/SubTable.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  defineOptions({ name: 'productionPlan-asignMetaria' });
  const { t } = useI18n();

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  function createFormOptions() {
    return {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formSchema,
      fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'CommonCol',
        transferRange: ['placeholder'],
      },
    };
  }

  const baseGridOptions = {
    showIndexColumn: false,
    api: getAsignList,
    toolbarConfig: {
      expandAll: true,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  } as const;

  const [Todo_Grid, { reload: todoReload, getFetchParams: todoGetFetchParams, getSelectRowKeys: todoGetSelectRowKeys, setAllRowExpand: todoSetAllRowExpand }] =
    useVbenVxeGrid({
      formOptions: createFormOptions(),
      gridOptions: {
        ...baseGridOptions,
        columns,
        id: 'productionPlan-main-asignMetaria-todoGrid',
        beforeFetch: params => {
          params.dataFilter = '1';
          return params;
        },
        afterFetch: todoAfterFetch,
      },
    });

  const [
    Check_Grid,
    { reload: checkReload, getFetchParams: checkGetFetchParams, getSelectRowKeys: checkGetSelectRowKeys, setAllRowExpand: checkSetAllRowExpand },
  ] = useVbenVxeGrid({
    formOptions: createFormOptions(),
    gridOptions: {
      ...baseGridOptions,
      columns: doneColumns,
      id: 'productionPlan-main-asignMetaria',
      beforeFetch: params => {
        params.dataFilter = '2';
        return params;
      },
      afterFetch: checkAfterFetch,
    },
  });

  function todoAfterFetch() {
    setTimeout(() => {
      todoSetAllRowExpand(true);
    }, 300);
  }

  function checkAfterFetch() {
    setTimeout(() => {
      checkSetAllRowExpand(true);
    }, 300);
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      id: record.id,
    });
  }

  async function reload() {
    if (state.activeKey === '1') {
      return todoReload();
    }
    if (state.activeKey === '2') {
      return checkReload();
    }
  }

  async function getFetchParams() {
    if (state.activeKey === '1') {
      return (await todoGetFetchParams()) || {};
    }
    if (state.activeKey === '2') {
      return (await checkGetFetchParams()) || {};
    }
  }

  function getSelectRowKeys() {
    if (state.activeKey === '1') {
      return todoGetSelectRowKeys() || [];
    }
    if (state.activeKey === '2') {
      return checkGetSelectRowKeys() || [];
    }
  }

  async function handleUnReviewExport() {
    openExportModal(true, {
      api: exportAsign,
      listQuery: {
        ...(await getFetchParams()),
        dataFilter: state.activeKey,
      },
      exportOptions: state.activeKey == 1 ? columns : doneColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // Recall selected records
  // async function handleRecall() {
  //   const idList =  getSelectRowKeys() ;
  //   if (idList.length) {
  //     const r = await recallMaterial(idList);
  //     if (r.code == 200) {
  //       createMessage.success(t('sys.api.operationSuccess'));
  //       await reload();
  //     }
  //   }
  //   createMessage.info(t('common.selectText'));
  // }
  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: refuseAsign,
        ids: idList,
        beforeFetch: params => {
          return {
            ...params,
            remark: params.rejectRemark,
          };
        },
      });
    }
    createMessage.info(t('common.selectText'));
  };

  // Resubmit sample
  async function handleAgree() {
    const idList = getSelectRowKeys();
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    const r = await auditAsign(idList);
    if (r.code == 200) {
      createMessage.success(t('sys.api.operationSuccess'));
      await reload();
    }
  }
</script>
<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
