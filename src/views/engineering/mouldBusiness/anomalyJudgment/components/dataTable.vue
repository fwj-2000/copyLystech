<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 待处理 按钮 -->
              <template v-if="props.type === TABS_ENUM.待处理">
                <!-- 判定 -->
                <a-button v-auth="'btn_judge'" type="primary" @click="() => handleJudge()">
                  {{ t('common.judgeText') }}
                </a-button>
              </template>
              <!-- 未处理 按钮 -->
              <template v-else>
                <!-- 撤回 -->
                <ModelConfirmButton
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
                </ModelConfirmButton>
              </template>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #moldRepairApplyNo="{ row }">
            <span class="table-a cursor-pointer" @click="showDetail(row)">{{ row.moldRepairApplyNo }}</span>
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal" />

    <Teleport to="#engineeringMouldBusinessAnomalyJudgment">
      <AbnormalPopup @register="registerAbnormalPopup" @reload="reload" />
      <DetailPopup @register="registerJudgePopup" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { omit } from 'lodash-es';
  import { getMoldBusinessMaintenanceList, bulkbackreview, exportExcel, getnodelist } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal /** StopModal */ } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn } from './config';
  import { TABS_ENUM } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { TYPE_ENUM as ABNORMAL_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopupConfig';

  import AbnormalPopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopup.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { TableAction } from '/@/components/Table';
  import DetailPopup from './detailPopup.vue';

  const props = defineProps({
    type: {
      type: String as PropType<`${TABS_ENUM}`>,
      default: TABS_ENUM.待处理,
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `engineering-mouldBusiness-anomalyJudgment-${props.type === '31' ? 'todo' : 'done'}-list`,
      columns: getColumn(),
      api: (params: any) => getMoldBusinessMaintenanceList({ ...params, identification: props.type }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  const { getSelectRows, getFetchParams, reload } = gridApi;

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getnodelist,
      id: record.id,
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), identification: props.type },
      api: exportExcel,
      exportOptions: getColumn().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    });
  };

  const [registerJudgePopup, { openPopup: openJudgePopup }] = usePopup();
  /**
   * 批量判定
   */
  function handleJudge() {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      message.warning(t('common.selectText'));
      return false;
    }

    showJudgePopup(selectedRows.map(item => item.id));
  }

  function showJudgePopup(ids: Array<string>) {
    openJudgePopup(true, {
      ids,
      isCanEdit: hasBtnP('btn_judge'),
    });
  }

  function getTableActions(row: any) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_judge',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: () => {
          openJudgePopup(true, {
            ids: [row.id],
            isCanEdit: props.type === TABS_ENUM.已处理 ? false : hasBtnP('btn_judge'),
          });
        },
      },
    ];
  }

  const [registerAbnormalPopup, { openPopup: openAbnormalPopup }] = usePopup();
  /**
   * 打开详情
   * @param row
   */
  function showDetail(row: any) {
    openAbnormalPopup(true, { ...row, type: ABNORMAL_TYPE_ENUM.详情 });
  }

  async function handleRecall() {
    const selectedRows = getSelectRows() || [];

    // const idList = selectedRows.reduce((arr, item) => {
    //   // item.confirmStatus === STATUS_ENUM.不满足 && arr.push(item.id);
    //   arr.push(item.id);
    //   return arr;
    // }, []);
    // if (idList.length === 0 && selectedRows.length !== 0) {
    //   message.warning(t('dict.SampleApply.revokeTip'));
    //   return Promise.resolve();
    // }

    const idList = selectedRows.map(item => item.id);

    if (idList.length) {
      return bulkbackreview(idList).finally(reload);
    }
    message.info(t('common.selectText'));
    return Promise.resolve();
  }

  defineExpose({
    showDetail,
    showJudgePopup,
  });
</script>
