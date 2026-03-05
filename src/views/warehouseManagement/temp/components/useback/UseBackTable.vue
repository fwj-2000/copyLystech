<template>
  <GridTemp>
    <template #toolbar-actions>
      <a-button type="primary" v-auth="'btn_addUseTemp'" @click="handleApply">{{ t('common.addUseTemp') }} </a-button>
      <a-button type="primary" v-auth="'btn_addBackTemp'" @click="handleApplyBack">{{ t('common.addBackTemp') }} </a-button>
      <a-button type="primary" ghost v-auth="'btn_writeOff'" @click="handleWriteoff">{{ t('common.writeOff') }}</a-button>
      <a-button v-auth="'btn_edit'" @click="handleUpdate">{{ t('common.updateText') }}</a-button>
      <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
      <ModelConfirmButton
        type="primary"
        ghost
        danger
        v-auth="'btn_batchRemove'"
        v-bind="{
          modelConfirm: {
            onOk: handleDel.bind(null),
          },
        }">
        <span>{{ t('common.batchDelText') }} </span>
      </ModelConfirmButton>
    </template>
    <!-- <template #action="{ row }">
          <TableAction outside :actions="getActions(row)" />
        </template> -->
  </GridTemp>
  <ExportModal @register="registerExportModal" />
  <Teleport to="#MouldBusinessTemp">
    <WriteOffPopup @register="registerWriteOff" @reload="reload" />
    <ApplyPopup @register="registerApply" @reload="reload"></ApplyPopup>
    <ApplyBackPopup @register="registerApplyBack" @reload="reload" />
  </Teleport>
</template>
<script lang="ts" setup>
  // import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, nextTick, defineAsyncComponent } from 'vue';
  import { schemaLists, writeoffUseColumn, writeoffBackColumn, tempColums } from './usebackConfig';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUseBackList, exportExcel, bulkBackDelete } from '/@/api/productionDeal/moIdUseBack';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import WriteOffPopup from './WriteOffPopup.vue';
  import ApplyPopup from './ApplyPopup.vue';
  import ApplyBackPopup from './ApplyBackPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';

  // const ReviewModal = defineAsyncComponent(() => import('/@/views/productionDeal/mouldBusiness/useAudit/components/ReviewModal.vue'));
  defineOptions({ name: 'warehouse-mouldBusiness-useBack' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerWriteOff, { openPopup: openWriteOff }] = usePopup();
  const [registerApply, { openPopup: openApply }] = usePopup();
  const [registerApplyBack, { openPopup: openApplyBack }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const state = reactive({
    activeKey: '3',
  });

  const tableConfig: any = {
    api: getUseBackList,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
  };
  const formConfig = {
    showCollapseButton: false,
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: schemaLists,
    // i18nConfig: {
    //   moduleCode: 'MoldReceiveRefundColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const [GridTemp, { reload, getFetchParams, getSelectRowKeys, clearSelectedRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'warehouse-mouldBusiness-useBack-temp',
      columns: tempColums,
    },
  });

  // function getActions(record): ActionItem[] {
  //   return [
  //     {
  //       icon: 'icon-ym icon-ym-view',
  //       onClick: handleDetail.bind(null, record),
  //     },
  //   ];
  // }

  // 批量导出
  function handleExport() {
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: tempColums,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
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

  // 删除
  function handleDel() {
    handleSelectData(bulkBackDelete);
  }

  // 申请
  function handleApply() {
    openApply(true, {
      mode: 'add',
    });
  }

  // 申请退回
  function handleApplyBack() {
    openApplyBack(true, {
      mode: 'add',
    });
  }

  // 判断是否是相同类型的数据，如果是则返回类型code，否则返回false
  function checkTypeCode(rows) {
    let mode = rows[0].orderTypeCode; // 领退类型 操作相同类型的数据
    let hasChange = false;
    // rows.length > 1
    //   ? rows.forEach(el => {
    //       if (mode !== el.orderTypeCode) {
    //         hasChange = true;
    //       }
    //     })
    //   : '';
    if (rows.length > 1) {
      rows.forEach(el => {
        if (mode !== el.orderTypeCode) {
          hasChange = true;
        }
      });
    }
    // 判断是否是相同类型的数据
    if (hasChange) {
      createMessage.info('只能选择同一种单据类型的数据');
      return false;
    } else {
      return mode;
    }
  }

  // 核销
  async function handleWriteoff() {
    const rows = getSelectRows() || [];
    if (rows.length) {
      const orderTypeCode = checkTypeCode(rows);
      if (!orderTypeCode) {
        return;
      }
      openWriteOff(true, {
        list: rows,
        columns: orderTypeCode == 'RefundTemporaryNo' ? writeoffBackColumn : writeoffUseColumn,
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 修改
  function handleUpdate() {
    const rows = getSelectRows() || [];
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    const mode = checkTypeCode(rows);
    if (!mode) {
      return;
    }
    const hasNotTemp = rows.every(el => el.statusEnum !== 0);
    if (hasNotTemp) {
      return createMessage.info('只有暂存数据可以修改');
    }
    if (mode == 'RefundTemporaryNo') {
      openApplyBack(true, {
        mode: 'update',
        ids: rows.map(el => el.id),
      });
    } else {
      openApply(true, {
        mode: 'update',
        ids: rows.map(el => el.id),
      });
    }
  }
</script>
