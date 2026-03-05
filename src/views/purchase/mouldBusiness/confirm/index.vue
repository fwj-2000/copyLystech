<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_sendEmail'" type="primary" @click="sendEmail">{{ t('common.sendEmail') }}</a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #moldRepairApplyNo="{ row }">
            <span class="table-a cursor-pointer" @click="openDetail(row)">{{ row.moldRepairApplyNo }}</span>
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
          <!-- <template #attachFileNames="{ row }">
            <span
              v-for="(item, index) in row.attachFileNames"
              :key="item"
              class="table-a cursor-pointer comma-separated"
              @click="() => handlePreview({ fileName: item, fileId: row.attachFileIds[index] })">
              {{ item }}
            </span>
          </template> -->
          <template #drawingsName="{ row }">
            <span v-if="row.drawingsName" class="table-a cursor-pointer" @click="() => handlePreview({ fileName: row.drawingsName, fileId: row.drawingsId })">
              {{ row.drawingsName }}
            </span>
            <FileCell v-else :list="row.fileJson" @click="handlePreview" />
          </template>
          <template #repairChangeLog="{ row }">
            <span class="table-a cursor-pointer" @click="showRepairRecordDetail(row)" style="cursor: pointer">{{ t('common.view') }}</span>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal" />
    <UploadFileModal @register="registerUploadFileModal" @reload="reload" />

    <MaintenancePopup @register="registerMaintenancePopup" @reload="reload" />
    <AbnormalPopup @register="registerAbnormalPopup" @reload="reload" />
    <SendEmailPopup @register="registerSendEmailPopup" @reload="reload" />
    <!-- 维修记录 -->
    <RepairModifyRecordModal @register="registerRepairModifyRecordModal" @reload="reload" />
    <!-- 文件 预览页面 -->
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '/@/components/Table';

  import { omit } from 'lodash-es';
  import { getMoldBusinessMaintenanceList, exportExcel, getnodelist, getDetailById } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumn } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref } from 'vue';
  import { TYPE_ENUM as MAINTENANCE_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopupConfig';
  import { TYPE_ENUM as ABNORMAL_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopupConfig';
  import { DEMAND_TYPE_ENUM } from '/@/views/productionDeal/mouldBusiness/maintenance/config';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import MaintenancePopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/maintenancePopup.vue';
  import AbnormalPopup from '/@/views/productionDeal/mouldBusiness/maintenance/components/abnormalPopup.vue';
  import SendEmailPopup from './components/sendEmailPopup.vue';
  import { TableAction } from '/@/components/Table';
  import UploadFileModal from './components/uploadFileModal.vue';
  import { PreviewModal, FileCell } from '/@/components/Upload';
  import RepairModifyRecordModal from '/@/views/productionDeal/mouldBusiness/maintenance/components/repairModifyRecordModal.vue';

  defineOptions({ name: 'productionDeal-mouldBusiness-maintenance' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { createMessage } = useMessage();

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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'purchase-mouldBusiness-confirm-list',
      columns: getColumn(),
      api: (params: any) =>
        getMoldBusinessMaintenanceList({ ...params, identification: '5' }).then(res => {
          const list = res?.data?.list || [];
          // 将list中元素的`attachFileNames`和`attachFileIds`转换为数组，重新赋值给`res.data.list`
          res.data.list = list.map((item: any) => {
            item.attachFileNames = item.attachFileNames ? item.attachFileNames.split(',') : [];
            item.attachFileIds = item.attachFileIds ? item.attachFileIds.split(',') : [];
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
    },
  });

  const { getFetchParams, reload, getSelectRowKeys } = gridApi;

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: t('component.upload.uploadFile'),
        // icon: 'icon-ym icon-ym-btn-upload',
        tooltip: t('component.upload.uploadFile'),
        onClick: showUploadFileModal.bind(null, row),
      },
    ];
  }

  function handleNodeModal(record: any) {
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
      listQuery: { ...params, ...omit(pager, 'total'), identification: '5' },
      api: exportExcel,
      exportOptions: getColumn().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    });
  };

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

  const [registerSendEmailPopup, { openPopup: openSendEmailPopup }] = usePopup();
  function sendEmail() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return createMessage.warning(t('common.selectText'));
    }
    openSendEmailPopup(true, { ids: idList });
  }

  const [registerUploadFileModal, { openModal: openUploadFileModal }] = useModal();
  /**
   * 查看维修类型变更日志
   * @param row 行数据
   */
  function showUploadFileModal(row: any) {
    openUploadFileModal(true, { ids: [row.id] });
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

  const [registerRepairModifyRecordModal, { openModal: openRepairModifyRecordModal }] = useModal();
  /**
   * 查看维修类型变更日志
   * @param row 行数据
   */
  function showRepairRecordDetail(row: any) {
    openRepairModifyRecordModal(true, { id: row.id });
  }

  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    getDetailById(params.id).then(res => {
      openDetail(res.data);
    });
  });
</script>

<style scoped lang="less">
  .comma-separated:not(:last-child)::after {
    content: ', ';
  }
</style>
