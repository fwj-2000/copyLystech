<template>
  <VxeBasicTable :tableStyle="{ width: '100%' }">
    <template #batchCode="{ row }">
      <span class="table-a" @click="() => showDetail({ batchCode: row.batchCode, mainProcess: row.mainProcess })">
        {{ row.batchCode }}
      </span>
    </template>
  </VxeBasicTable>

  <Teleport to="#businessFcRequirement">
    <BatchImport @register="registerBatchImportPop" @reload="reload" />
    <DetailPopup @register="registerDetailPop" @reload="reload" />
  </Teleport>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { vxeTableColumns, vxeTableFormSchema, STATUS_ENUM } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { /** getSalesForecastDrawingDatas, */ bulkDelete, getSalesForecast } from '/@/api/business/salesForecast';
  import { MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';

  import BatchImport from './batchImport.vue';
  import DetailPopup from './detail.vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  const { createMessage, createConfirm } = useMessage();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
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
      schema: vxeTableFormSchema,
      i18nConfig: {
        moduleCode: 'SalesForecastColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-salesForecast-reuqirement-draft-list',
      keyboardConfig: {
        isBack: false,
      },
      mouseConfig: {
        area: false, // 是否开启区域选取
        extension: false,
      },
      columns: vxeTableColumns,
      columnConfig: {
        resizable: true,
      },
      pagerConfig: {
        autoHidden: false,
      },
      height: 'auto',
      api: (params: any) => getSalesForecast(MODULE_TYPE_ENUM.草稿, { ...params, status: STATUS_ENUM.草稿 }),
      toolbarConfig: {
        export: false,
        print: false,
        buttons: [
          {
            content: t('common.submit'),
            visible: hasBtnP('btn_submit'),
            buttonRender: {
              name: 'AButton',
              props: {
                // @ts-ignore
                type: 'primary',
              },
              events: {
                click: handleSubmit,
              },
            },
          },
          {
            content: t('common.batchImport'),
            code: 'open_import',
            visible: hasBtnP('btn_upload'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: () => {
                  openImportPopup(true, {
                    title: t('common.add1Text'),
                    isDevPlatform: false,
                  });
                },
              },
            },
          },
          {
            content: t('common.batchDelText'),
            visible: hasBtnP('btn_batchRemove'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: handleBatchDelete,
              },
            },
          },
        ],
      },
      exportConfig: {
        excludeFields: ['checkbox'],
      },
      scrollX: {
        enabled: true,
      },
      scrollY: {
        mode: 'wheel',
        enabled: true,
      },
      i18nConfig: {
        moduleCode: 'SalesForecastColumn',
      },
    },
  });

  // async function getTableData(searchForm: any) {
  //   return getSalesForecastDrawingDatas(searchForm).then(res => {
  //     const { data } = res;
  //     return {
  //       data: {
  //         list: data,
  //       },
  //     };
  //   });
  // }

  function reload() {
    tableRef!.reload();
  }

  function showDetail(params: { batchCode?: string; selectedIds?: Array<string>; mainProcess?: string | number }) {
    openDetailPopup(true, params);
  }

  function handleSubmit() {
    const checkedList = tableRef!.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    const batchCodes = checkedList.map(item => item.batchCode);
    const isSameVersion = new Set(batchCodes).size <= 1;

    if (!isSameVersion) {
      return createMessage.warning(t('common.selectSameVersionTip'));
    }

    showDetail({ selectedIds: checkedList.map(item => item.id) });
  }

  function handleBatchDelete() {
    const checkedList = tableRef!.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDelete(checkedList.map(item => item.id))
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .catch(e => {
            console.warn('batch delete e:', e);
          })
          .finally(reload),
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: @primary-color;
    cursor: pointer;
  }
</style>
