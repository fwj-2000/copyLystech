<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_placeAnOrder'" type="primary" @click="openPlaceAnOrder">{{ t('dict.AddWorkOrderColumn.placeAnOrder') }}</a-button>
              <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
              <!-- <a-button class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button> -->
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <!-- <ExportModal @register="registerExportModal" /> -->
    <PlaceAnOrderPop @register="registerPlaceAnOrderPop" @reload="reloadTable"></PlaceAnOrderPop>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted } from 'vue';
  import { poOrderList, poOrderExport, poSyncsap } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { column, getFormSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import PlaceAnOrderPop from './components/PlaceAnOrderPop.vue';
  import { RejectModal } from '/@/components/CustomComponents';
  import dayjs from 'dayjs';

  defineOptions({ name: 'productionPlan-main-addWorkOrder' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createConfirm } = useMessage();

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  // const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerPlaceAnOrderPop, { openPopup: openPlaceAnOrderPop }] = usePopup();

  const [Grid, { reload, getSelectRows, getFetchParams, reloadColumn, getSelectRowKeys, getFromValue, setLatestSubmissionValues, resetForm }] = useVbenVxeGrid({
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
      //   moduleCode: 'AddWorkOrderColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'productionPlan-main-addWorkOrder-list',
      columns: column,
      // api: poOrderList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'AddWorkOrderColumn',
      },
      data: [{ factory: '测试一厂', id: 'xx001', childrenData: [] }] as any[],
      proxyConfig: {
        autoLoad: false,
      } as any,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
    },
  });

  // 去下单
  const openPlaceAnOrder = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));

    const { id } = rows[0];
    openPlaceAnOrderPop(true, { id });
  };

  const handleReject = async () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    if (ids.length) {
      return openRejectModal(true, {
        // api: prReject,
        ids,
      });
    }
  };

  // 批量导出
  // const handleExport = async () => {
  //   openExportModal(true, {
  //     // api: exportProductLineExcel,
  //     listQuery: {
  //       ...getFetchParams(),
  //     },
  //     exportOptions: column,
  //     nameProps: 'title',
  //     idProps: 'field',
  //     i18nConfig: {
  //       moduleCode: 'AddWorkOrderColumn',
  //     },
  //   });
  // };
  // const exportAction = query => {
  //   poOrderExport(query).then(res => {
  //     if (!res.data.url) return;
  //     downloadByUrl({ url: res.data.url });
  //     closeModal();
  //   });
  // };

  const reloadTable = () => {
    // gridApi.reload();
  };
</script>
