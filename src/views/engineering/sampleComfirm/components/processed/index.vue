<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('views.filings.sureRevokeData'),
                    onOk: handleRecall.bind(null),
                  },
                  type: 'primary',
                  ghost: true,
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton> -->
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
    <NodeModal @register="registerNodeModal" />

    <Teleport to="#EngineeringSampleComfirm">
      <ViewDetail @register="registerDetail" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  // import { message } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { getNodeList, exportExcel, /** recallPro, */ confirmPageList } from '/@/api/engineering/sample';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumn } from './configVxe';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { STATUS_ENUM } from '../../config';

  // import { ModelConfirmButton } from '/@/components/Button';
  import ViewDetail from '/@/views/engineering/sampleApply/components/ViewPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
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
      id: 'engineering-sampleConfirm-processed-list',
      columns: getColumn(),
      api: (params: any) => confirmPageList({ ...params, isConfirm: true }),
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

  const { /** getSelectRowKeys, */ getFetchParams, reload /** getSelectRows */ } = gridApi;

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

  // async function handleRecall() {
  //   const selectedRows = getSelectRows() || [];

  //   const idList = selectedRows.reduce((arr, item) => {
  //     item.confirmStatus === STATUS_ENUM.不满足 && arr.push(item.id);
  //     return arr;
  //   }, []);
  //   if (idList.length === 0 && selectedRows.length !== 0) {
  //     message.warning(t('dict.SampleApply.revokeTip'));
  //     return Promise.resolve();
  //   }

  //   if (idList.length) {
  //     return recallPro(idList).finally(reload);
  //   }
  //   message.info(t('common.selectText'));
  //   return Promise.resolve();
  // }

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
</script>
