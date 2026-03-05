<!--
 * @Author: wenzhenjin
 * @Date: 2025-05-20 14:27:40
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-21 20:31:55
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\quotationView\index.vue
-->

<script setup lang="ts">
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, ref, defineAsyncComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { DicChildItem, useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getQuotationMadeList, exportQuotationMade } from '/@/api/engineering/quotatios';
  import { exportCost } from '/@/api/business/priceConfirmation';
  import { downloadByUrl } from '/@/utils/file/download';
  import { doneGetFormConfig, doneGetColumns } from '/@/views/engineering/quotationBom/makeQuotation/use-wait-grid';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { omit } from 'lodash-es';

  const NodeModal = defineAsyncComponent(() => import('/@/components/CustomComponents/src/quality/NodeModal.vue'));
  const ExportModal = defineAsyncComponent(() => import('/@/components/ExportModal/index.vue'));
  const DetailPopup = defineAsyncComponent(() => import('../components/DetailPopup.vue'));

  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-quotationBom-quotationView' });

  const { createMessage } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();

  const statusList = ref<DicChildItem[]>([]);
  const cacheList = ref([]);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: doneGetFormConfig(),
      i18nConfig: {
        moduleCode: 'QuotationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-quotationBom-quotationView-list',
      columns: doneGetColumns() as any,
      api: getQuotationMadeList as any,
      showIndexColumn: true,
      beforeFetch: params => {
        if (params.time && params.time.length > 0) {
          params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD');
          params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD');
          delete params.time;
        }
        return params;
      },
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
      afterFetch: data => {
        cacheList.value = data.list;
      },
    },
  });

  const { getSelectRowKeys, getFetchParams } = gridApi;

  async function handleExport() {
    const exportColumns = doneGetColumns();

    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportQuotationMade,
      listQuery: {
        ...params,
        ...omit(pager, 'total'),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function handleApprove(_, index) {
    openDetailPopup(true, {
      cacheList: cacheList.value,
      mode: 'view',
      index,
    });
  }

  // 价格明细导出
  async function handlePriceExport() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    if (idList.length > 10) return createMessage.warning('最多可导出十条数据');
    const { code, data, msg } = await exportCost({ ids: idList.join(',') });
    // 导出文件
    if (code == 200) {
      downloadByUrl({
        url: data.url,
      });
      createMessage.success(msg);
    } else {
      createMessage.error(msg);
    }
  }

  // handleNotPriceExport
  async function handleNotPriceExport() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    const { code, data, msg } = await exportCost({
      ids: idList.join(','),
      isPrice: false,
    });
    // 导出文件
    if (code == 200) {
      downloadByUrl({
        url: data.url,
      });
      createMessage.success(msg);
    } else {
      createMessage.error(msg);
    }
  }

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: () => handleApprove('unReview', index, record),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  async function getTypeOptions() {
    statusList.value = (await baseStore.getDictionaryData('DrawingsReview.Status')) as DicChildItem[];
  }

  onMounted(() => {
    getTypeOptions();
  });
</script>
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }} </a-button>
              <a-button v-auth="'btn_priceExport'" @click="handlePriceExport"> {{ t('common.priceExport') }} </a-button>
              <a-button v-auth="'btn_notPriceExport'" @click="handleNotPriceExport"> {{ t('dict.notPriceExport') }} </a-button>
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getTableActions(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetailPopup" />
  </div>
</template>
