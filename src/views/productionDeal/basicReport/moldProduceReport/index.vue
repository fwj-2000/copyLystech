<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #moldNoDetail="{ row }">
            <span class="table-a" @click="handleDetailModal(row)"> {{ row.moldNo }} </span>
          </template>
        </Grid>
      </div>
    </div>
    <DetailModal @register="registerDetailModal"></DetailModal>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getMoldProduceReport, moldProduceReportExport } from '/@/api/productionDeal/moldProduceReport';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useModal } from '/@/components/Modal';
  import { dateUtil } from '/@/utils/dateUtil';
  import DetailModal from './components/detailModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-basicReport-moldProduceReport' });

  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'MoldProduceReportColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicReport-moldProduceReport-list',
      columns,
      api: getMoldProduceReport,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MoldProduceReportColumn',
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.orderDate && params.orderDate.length > 0) {
          _params.orderDateStart = dateUtil(params.orderDate[0]).valueOf();
          _params.orderDateEnd = dateUtil(params.orderDate[1]).valueOf();
          delete _params.orderDate;
        }

        if (params.deliveryDate && params.deliveryDate.length > 0) {
          _params.deliveryDateStart = dateUtil(params.deliveryDate[0]).valueOf();
          _params.deliveryDateEnd = dateUtil(params.deliveryDate[1]).valueOf();
          delete _params.deliveryDate;
        }
        return _params;
      },
    },
  });

  function handleDetailModal(record) {
    openDetailModal(true, record);
  }

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    moldProduceReportExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
