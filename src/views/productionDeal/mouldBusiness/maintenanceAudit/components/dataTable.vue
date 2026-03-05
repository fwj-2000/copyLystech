<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <template v-if="props.type === TABS_ENUM.待处理">
                <!-- 同意 -->
                <a-button v-auth="'btn_agree'" type="primary" @click="() => handleAudit(AUDIT_ENUM.同意)">
                  {{ t('common.agree') }}
                </a-button>
                <!-- 驳回 -->
                <a-button v-auth="'btn_reject'" type="primary" ghost @click="() => handleAudit(AUDIT_ENUM.驳回)">
                  {{ t('common.rejectText') }}
                </a-button>
              </template>
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
            <span class="table-a" @click="openDetail(row)">{{ row.moldRepairApplyNo }}</span>
          </template>
          <template #drawingsName="{ row }">
            <span v-if="row.drawingsId" class="table-a" @click="handlePreview(row)">{{ row.drawingsName }}</span>
            <FileCell v-else :list="row.fileJson" @click="handlePreview" />
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <!-- 导出 界面 -->
    <ExportModal @register="registerExportModal" />
    <!-- 节点详情 界面 -->
    <NodeModal @register="registerNodeModal" />
    <!-- 审核 界面 -->
    <AuditModal @register="registerAuditModal" @reload="reload" />

    <!-- 文件 预览页面 -->
    <PreviewModal ref="filePreviewRef" />

    <Teleport to="#ProductionDealMouldBusinessMaintenanceAudit">
      <!-- 模具维修 详情页面 -->
      <MaintenancePopup @register="registerMaintenancePopup" @reload="reload" />
      <AbnormalPopup @register="registerAbnormalPopup" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { omit } from 'lodash-es';
  import { getMoldBusinessMaintenanceList, bulkbackreview, exportExcel, getnodelist } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal /** StopModal */ } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn, AUDIT_ENUM } from './configVxe';
  import { TABS_ENUM, STATUS_ENUM } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TYPE_ENUM as MAINTENANCE_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopupConfig';
  import { TYPE_ENUM as ABNORMAL_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopupConfig';
  import { DEMAND_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/config';

  import MaintenancePopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopup.vue';
  import AbnormalPopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopup.vue';
  import AuditModal from './auditModal.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { PreviewModal, FileCell } from '/@/components/Upload';

  const props = defineProps({
    type: {
      type: String as PropType<`${TABS_ENUM}`>,
      default: TABS_ENUM.待处理,
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();

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
      schema: props.type === TABS_ENUM.待处理 ? getFormConfig() : getFormConfig().slice(0, -1),
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
        transferRange: ['placeholder'],
      },
      routeConfig: {
        enabled: true,
      },
    },
    gridOptions: {
      id: `productionDeal-mouldBusiness-maintenanceAudit-${props.type === TABS_ENUM.待处理 ? 'todo' : 'done'}-list`,
      columns: getColumn(),
      api: (params: any) =>
        getMoldBusinessMaintenanceList({ ...params, identification: props.type }).then(res => {
          const list = res?.data?.list || [];
          const isTodoList = props.type === TABS_ENUM.待处理;
          const statusFieldList = ['reviewStatus', 'leaderReviewStatus', 'supervisorReviewStatus'];
          res.data.list = list.map((item: any) => {
            if (item.demandType === DEMAND_TYPE_ENUM.在库维修) {
              item.status = item.reviewStatus;
              return item;
            }

            // 如果异常单，对于状态的取值进行特殊处理
            let status = '';
            // 多个审批使用同一个页面，具有多个审批处理状态，在待处理界面，按顺序显示第一个非`已处理`的状态；在已处理页面，显示为`已处理`
            if (isTodoList) {
              const field = statusFieldList.find(field => item[field] && `${item[field]}` !== `${STATUS_ENUM.已处理}`);
              if (field) {
                status = `${item[field]}`;
              }
            } else {
              status = STATUS_ENUM.已处理;
            }
            item.status = status;
            return item;
          });
          return res;
        }),
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

  const [registerAuditModal, { openModal: openAuditModal }] = useModal();
  function handleAudit(type: `${AUDIT_ENUM}`) {
    const list = getSelectRows() || [];
    if (!list.length) {
      return message.info(t('common.selectText'));
    }

    // 判断所选数据的`需求类型`是否相同，不相同则不允许同时处理
    const demandType = list[0]?.demandType;
    if (list.some(item => item.demandType !== demandType)) {
      return message.info(t('dict.MoldRepairApply.differentDemandTypeTip'));
    }

    openAuditModal(true, { list, type, demandType });
  }

  // 维修详情
  const [registerMaintenancePopup, { openPopup: openMaintenancePopup }] = usePopup();
  /**
   * 展示维修详情弹窗
   */
  function showMaintenancePopup(data: any = {}) {
    openMaintenancePopup(true, data);
  }

  // 异常详情
  const [registerAbnormalPopup, { openPopup: openAbnormalPopup }] = usePopup();
  /**
   * 展示异常详情弹窗
   */
  function showAbnormalPopup(data: any = {}) {
    openAbnormalPopup(true, data);
  }

  /**
   * 打开详情
   * @param row 行数据
   */
  function openDetail(row: any) {
    if (`${row.demandType}` === DEMAND_TYPE_ENUM.在库维修) {
      showMaintenancePopup({
        ...row,
        type: MAINTENANCE_TYPE_ENUM.详情,
      });
    } else {
      showAbnormalPopup({
        ...row,
        type: ABNORMAL_TYPE_ENUM.详情,
      });
    }
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
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item: any) {
    const params = item.drawingsId
      ? {
          name: item.drawingsName,
          Id: item.drawingsId,
          previewType: 'localPreview',
          noCache: false,
          isCopy: 0,
          // previewApi: Promise.resolve(),
        }
      : {
          name: item.fileName,
          filePath: item.filePath,
          version: 2,
        };
    filePreviewRef.value?.init(params);
  }

  defineExpose({
    openDetail,
  });
</script>
