<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white">
      <Grid>
        <template #toolbar-actions>
          <template v-if="isTodoPage">
            <!-- 审核 -->
            <a-button v-auth="'btn_review'" type="primary" @click="handleAudit">{{ t('common.audit') }}</a-button>
          </template>
          <template v-else>
            <!-- 撤回 -->
            <!-- <ModelConfirmButton
              v-auth="'btn_recall'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
              }">
              <span>{{ t('common.revoke') }}</span>
            </ModelConfirmButton> -->
          </template>

          <!-- 下载图纸 -->
          <a-button v-auth="'btn_drawingsDownload'" type="primary" ghost @click="handleDownloadDrawings">{{ t('common.downloadDrawingText') }}</a-button>
          <!-- 导出 -->
          <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.exportText') }}</a-button>
        </template>

        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>

        <template #nodeDetail="{ row }">
          <div class="table-a cursor-pointer" @click="() => handleNodeModal(row)"> {{ t('common.detailText') }} </div>
        </template>

        <template #moldDrawings="{ row }">
          <FileListCell :row="row" :list="row.moldDrawings" />
        </template>
      </Grid>
    </div>

    <NodeModal @register="registerNodeModal" />
    <ExportModal @register="registerExportModal" />

    <Teleport defer to="#EngineeringMouldBusinessMoldDrawingApproval">
      <AuditDetailPop @register="registerAuditeDetailPop" @reload="gridApi.reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { TABS_ENUM } from '../config';
  import { columns, getSchemas } from './dataTableConfig';
  import { downloadMoldDrawings } from '/@/views/engineering/mouldBusiness/components/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMoldDrawingAuditPage, getNodeList } from '/@/api/engineering/moldDrawingLibrary';

  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import AuditDetailPop from './auditDetailPop/index.vue';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  /** 是否为`待处理`页面 */
  const isTodoPage = computed(() => props.type === TABS_ENUM.待处理);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      commonConfig: {
        labelClass: 'w-0',
      },
      schema: getSchemas(isTodoPage.value),
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `engineering-mouldBusiness-moldDrawingApproval-${isTodoPage.value ? 'todo' : 'done'}`,
      columns: columns,
      api: getMoldDrawingAuditPage,
      beforeFetch: (params: any) => ({
        ...params,
        type: props.type,
      }),
      rowConfig: {
        keyField: 'id',
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    },
  });

  function getTableActions(record: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, [record]),
      },
    ];
  }

  const [registerAuditeDetailPop, { openPopup: openAuditeDetailPopup }] = usePopup();
  function goDetail(rows: Array<any>, isAudit = false) {
    if (!Array.isArray(rows) || rows.length === 0) {
      return false;
    }

    const drawingSource = rows[0]?.drawingSource || '';
    if (rows.some(item => item.drawingSource !== drawingSource)) {
      // 如果`来源类型`不一致，不允许进入详情页
      createMessage.warning(t('dict.Common.pleaseSelectDataOfTheSameType'));
      return false;
    }

    openAuditeDetailPopup(true, {
      list: rows,
      isAudit,
      sourceType: `${drawingSource}`,
    });
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  /** 导出 */
  const handleExport = async () => {
    const params = await gridApi.getFetchParams();

    openExportModal(true, {
      // TODO 接口联调
      api: () => Promise.resolve(),
      listQuery: { ...params },
      exportOptions: columns.filter(col => col.field !== 'nodeDetail'),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    });
  };

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点详情 */
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  /** 审核 */
  function handleAudit() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    goDetail(rows, true);
  }

  /** 图纸下载 */
  function handleDownloadDrawings() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    downloadMoldDrawings(rows);
  }

  /** 撤回 */
  // const handleRecall = async () => {
  //   const idList = gridApi.getSelectRowKeys() || [];
  //   if (idList.length) {
  //     return Promise.resolve(idList).then(() => {
  //       createMessage.success(t('sys.api.operationSuccess'));
  //       gridApi.clearSelectedRowKeys();
  //       gridApi.reload();
  //     });
  //   }
  //   createMessage.info(t('common.selectText'));
  // };
</script>
