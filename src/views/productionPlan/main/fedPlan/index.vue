<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_pushMaterialList'" type="primary" @click="openPushMaterialList">{{ t('dict.FeedPlanColumn.pushMaterialList') }}</a-button>
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #poOrderNo="{ row }">
            <div class="table-a cursor-pointer" @click="openDetail(row)"> {{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <PODetailModal @register="registerPODetailModal" @reload="reloadTable"> </PODetailModal>
    <PushMaterialListPop @register="registerPushMaterialListPop" @reload="reloadTable"></PushMaterialListPop>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getFeedPlanList, poFeedPlanExport } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { column, getFormSchema, columnExport } from './config';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import PODetailModal from './components/PODetailModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import PushMaterialListPop from './components/PushMaterialListPop.vue';

  defineOptions({ name: 'productionPlan-main-fedPlan' });

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerPODetailModal, { openModal: openPODetailModal }] = useModal();
  const [registerPushMaterialListPop, { openPopup: openPushMaterialListPop }] = usePopup();

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      // i18nConfig: {
      //   moduleCode: 'FeedPlanColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'productionPlan-main-fedList-list',
      columns: column,
      api: getFeedPlanList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
        };
      },
    },
  });

  function openDetail(row) {
    openPODetailModal(true, {
      row,
    });
  }

  // 下推进料表
  const openPushMaterialList = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    // const poNos = rows.flatMap(item => {
    //   return item.poOrderNo.split(',');
    // });
    const ids = rows.map(item => item.id);
    openPushMaterialListPop(true, { ids });
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      api: poFeedPlanExport,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columnExport,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
      },
    });
  };

  const reloadTable = () => {
    reload();
  };
</script>
