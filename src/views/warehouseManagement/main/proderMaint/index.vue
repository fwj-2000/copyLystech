<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd()">{{ t('common.add') }}</a-button>
              <ModelConfirmButton
                v-auth="'btn_review'"
                type="primary"
                ghost
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.beforeActionTip', [t('common.review')]),
                    onOk: handleAction.bind(null, 1),
                  },
                }">
                <span>{{ t('common.audit') }}</span>
              </ModelConfirmButton>
              <ModelConfirmButton
                v-auth="'btn_backReview'"
                type="primary"
                ghost
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.beforeActionTip', [t('common.audit')]),
                    onOk: handleAction.bind(null, 5),
                  },
                }">
                <span>{{ t('common.backAudit') }}</span>
              </ModelConfirmButton>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <ModelConfirmButton
                v-auth="'btn_disable'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.beforeDisableTip'),
                    onOk: handleAction.bind(null, 3),
                  },
                }">
                <span>{{ t('common.disableText') }}</span>
              </ModelConfirmButton>
              <ModelConfirmButton
                type="primary"
                ghost
                v-auth="'btn_enable'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.beforeEnableTip'),
                    onOk: handleAction.bind(null, 2),
                  },
                }">
                <span>{{ t('common.enableText') }}</span>
              </ModelConfirmButton>
              <ModelConfirmButton
                v-auth="'btn_batchRemove'"
                v-bind="{
                  modelConfirm: {
                    onOk: handleAction.bind(null, 4),
                  },
                }">
                <span>{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApplyPop" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <UpdateModal @register="registerUpdatePop" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
  import {
    getProductionPersonnelList,
    bulkReviewProductionPersonnel,
    bulkEnableProductionPersonnel,
    bulkDisableProductionPersonnel,
    bulkDeleteProductionPersonnel,
    exportProductionPersonnel,
    bulkReverseReviewProductionBase,
  } from '/@/api/warehouse/mainProder';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPop from './components/ApplyPopupVxe.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { ModelConfirmButton } from '/@/components/Button';
  import UpdateModal from './components/UpdateModal.vue';

  const route = useRoute();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'warehouse-main-proderMaint' });

  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerUpdatePop, { openModal: openUpdateModdal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: false,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
      i18nConfig: {
        moduleCode: 'ProductionPersonnelColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'warehouse-main-proderMaint',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getProductionPersonnelList,
      beforeFetch: params => {
        return {
          ...params,
        };
      },
      i18nConfig: {
        moduleCode: 'ProductionPersonnelColumn',
      },
    },
  });
  const { getSelectRowKeys, reload, clearSelectedRowKeys, getFetchParams } = gridApi;
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goDetail.bind(null, record.id),
      },
    ];
  }

  // 添加新数据
  function handleAdd(id = '') {
    openApplyPopup(true, { id });
  }

  // 处理数据
  function handleAction(type) {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    let method;
    switch (type) {
      case 1:
        // 审核
        method = bulkReviewProductionPersonnel;
        break;
      case 2:
        // 启用
        method = bulkEnableProductionPersonnel;
        break;
      case 3:
        // 禁用
        method = bulkDisableProductionPersonnel;
        break;
      case 4:
        // 删除
        method = bulkDeleteProductionPersonnel;
        break;
      case 5:
        // 反审核
        method = bulkReverseReviewProductionBase;
        break;
    }
    method(idList).then(res => {
      reload();
      clearSelectedRowKeys();
      createMessage.success(res.msg);
    });
  }

  // 导出数据
  const handleExport = async () => {
    openExportModal(true, {
      api: exportProductionPersonnel,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columnsVxe,
      i18nConfig: {
        moduleCode: 'ProductionPersonnelColumn',
      },
    });
  };

  // 跳转详情
  function goDetail(id = '') {
    openUpdateModdal(true, { id });
  }
</script>
