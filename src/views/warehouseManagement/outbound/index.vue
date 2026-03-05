<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" :destroyInactiveTabPane="true">
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <Grid>
              <template #toolbar-actions>
                <a-button type="primary" @click="handlePrintPop" v-auth="'btn_print'">{{ t('common.printDeliveryNote') }}</a-button>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <Grid>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <PrintDetailPop @register="registerPrintDetailPop" @reload="reload"></PrintDetailPop>
    <PrintPop @register="registerPrintPop" @reload="reload"></PrintPop>
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted, ref } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { COLUMNS, formConfig } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import { message } from 'ant-design-vue';
  import { getoutboundpage } from '/@/api/warehouse/warehouse';
  import PrintPop from './compoments/printPop.vue';
  import PrintDetailPop from './compoments/printDetailPop.vue';
  defineOptions({ name: 'warehouseManagement-warehouseManagement' });

  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();
  const [registerPrintDetailPop, { openPopup: openPrintDetailPop }] = usePopup();
  const activeKey = ref('0');

  const { t } = useI18n();
  // const [registerTable, { reload, getSelectRowKeys, getSelectRows }] = useTable({
  //   api: getoutboundpage,
  //   beforeFetch: params => {
  //     const _p = {
  //       ...params,
  //       type: activeKey.value,
  //     };
  //     return _p;
  //   },
  //   columns: COLUMNS,
  //   useSearchForm: true,
  //   striped: true,
  //   ellipsis: true,
  //   rowSelection: { type: 'checkbox' },
  //   clickToRowSelect: false,
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   showIndexColumn: false,
  //   isCanResizeParent: false,
  //   canResize: true,
  //   pagination: {
  //     pageSize: 100,
  //   },
  //   formConfig: formConfig as any,
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  // });
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formConfig as any,
      // i18nConfig: {
      //   moduleCode: 'ECNColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'warehouseManagement-warehousing-leadership-list',
      columns: COLUMNS,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getoutboundpage,
      useSearchForm: true,
      striped: true,
      ellipsis: true,
      clickToRowSelect: false,
      bordered: true,
      // i18nConfig: {
      //   moduleCode: 'ECNColumn',
      // },
      beforeFetch: params => {
        const _p = {
          ...params,
          type: activeKey.value,
        };
        return _p;
      },
      showIndexColumn: false,
      isCanResizeParent: false,
      canResize: true,
      pagination: {
        pageSize: 100,
      },
      transformCellText: ({ text }) => formatTableDefaultText(text),
    },
  });
  const { reload, getSelectRowKeys, getSelectRows } = gridApi;

  function handlePrintPop(record) {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    openPrintPop(true, {
      title: t('common.printDeliveryNote2'),
      data: getSelectRows(),
    });
  }

  function goDetail(record) {
    if (activeKey.value === '0') {
      openPrintPop(true, {
        title: t('common.printDeliveryNote2'),
        data: [record],
      });
    } else {
      openPrintDetailPop(true, {
        title: t('common.printPreview'),
        id: record.id,
      });
    }
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  onMounted(() => {
    reload();
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  :deep(.ant-tabs-nav) {
    padding-left: 12px !important;
  }
</style>
