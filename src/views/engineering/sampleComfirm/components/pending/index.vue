<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_comfirm'" type="primary" @click="handleConfirm">
                {{ t('common.materialComfirm') }}
              </a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ rowIndex, row }">
            <i class="icon-ym icon-ym-btn-preview text-orange-400 cursor-pointer mx-1" @click="handleEdit(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>

    <Teleport to="#EngineeringSampleComfirm">
      <ViewDetail @register="registerDetail" @reload="reload" />
      <ComfirmPopup @register="registerConfirmPopup" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { omit } from 'lodash-es';
  import { getNodeList, exportExcel, confirmPageList } from '/@/api/engineering/sample';
  import { message } from 'ant-design-vue';
  import ViewDetail from '/@/views/engineering/sampleApply/components/ViewPopup.vue';
  import ComfirmPopup from './comfirmPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal /** StopModal */ } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn } from './configVxe';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { dateUtil } from '/@/utils/dateUtil';

  defineOptions({ name: 'engineering-sampleApply' });

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-sampleConfirm-pending-list',
      columns: getColumn(),
      api: params => confirmPageList({ ...params, isConfirm: false }),
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        // searchField: ['requestStartDate', 'requestEndDate'],
        if (params.applyDate && params.applyDate.length > 0) {
          params.applyDateStart = dateUtil(params.applyDate[0]).format('YYYY-MM-DD');
          params.applyDateEnd = dateUtil(params.applyDate[1]).format('YYYY-MM-DD');
          delete params.applyDate;
        }
        if (params.requestArrivalDate && params.requestArrivalDate.length > 0) {
          params.requestArrivalDateStart = dateUtil(params.requestArrivalDate[0]).format('YYYY-MM-DD');
          params.requestArrivalDateEnd = dateUtil(params.requestArrivalDate[1]).format('YYYY-MM-DD');
          delete params.requestArrivalDate;
        }
        if (params.arrivalDate && params.arrivalDate.length > 0) {
          params.arrivalDateStart = dateUtil(params.arrivalDate[0]).format('YYYY-MM-DD');
          params.arrivalDateEnd = dateUtil(params.arrivalDate[1]).format('YYYY-MM-DD');
          delete params.arrivalDate;
        }
        return params;
      },
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload } = gridApi;

  const handleEdit = (_, record: any) => {
    openDetail(true, {
      ...record,
      isShowReplyInfo: true,
      isCanEdit: false,
    });
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), isPurchaseUser: false },
      api: exportExcel,
      exportOptions: getColumn().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    });
  };

  const [registerConfirmPopup, { openPopup: openConfirmPopup }] = usePopup();
  function handleConfirm() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openConfirmPopup(true, { ids: idList });
  }
  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    openConfirmPopup(true, { ids: [params.id] });
  });
</script>
