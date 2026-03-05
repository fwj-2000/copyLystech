<!--
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-15 15:28:12
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-18 11:38:46
 * @FilePath: \lydc.server.web\src\views\business\basicInformation\materialRatio\index.vue
 * @Description: 片卷料比例 - 列表页
-->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <VxeBasicTable :tableStyle="{ width: '100%' }" class="lydc-basic-table ant-table-cell">
          <template #buttons>
            <a-button v-auth="'btn_add'" type="primary" @click="add"> {{ t('common.add2Text') }} </a-button>
            <!-- <a-button type="primary" ghost class="ml-3" @click="modify"> 修改 </a-button> -->
            <vShowDropdown class="ml-3">
              <template #overlay>
                <button v-auth="'btn_upload'" @click="batchImportOrExport({ key: BUTTON_ENUM.导入 })">{{ t('common.batchImport') }}</button>
                <button v-auth="'btn_download'" @click="batchImportOrExport({ key: BUTTON_ENUM.导出 })">{{ t('common.batchExport') }}</button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" class="ml-3" @click="comfirmBatchDelete"> {{ t('common.batchDelText') }} </a-button>
          </template>

          <template #terminalCustomerPartNumber="{ row }">
            <span class="table-a" @click="() => modify(row.terminalCustomerPartNumber, row.mainProcess)">
              {{ row.terminalCustomerPartNumber }}
            </span>
          </template>
        </VxeBasicTable>
      </div>
    </div>

    <!-- <ExportModal @register="registerExportModal" /> -->
    <ImportModal @register="registerImportPop" @reload="reload" @close="reload" />
    <DetailPopup @register="registerFormPop" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { vxeTableColumns, vxeTableFormSchema, BUTTON_ENUM, FORM_TYPE_ENUM, formatShipPatternPercent, MATERIA_FORM_ENUM } from './config';
  import { getSalesShipPattern, importSalesShipPattern, /** exportSalesShipPattern, */ bulkDeleteSalesShipPattern } from '/@/api/business/materialRatio';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';

  // import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/batchImport.vue';
  import DetailPopup from './components/detail.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'business-basicInformation-materialRatio' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createConfirm, createMessage } = useMessage();

  const [registerFormPop, { openPopup: openDetailPopup }] = usePopup();
  // const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

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
        moduleCode: 'SalesShipPatternColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      // id: 'business-basicInformation-materialRatio-list',
      mouseConfig: {
        area: false, // 是否开启区域选取
        extension: false,
      },
      columns: vxeTableColumns,
      columnConfig: {
        resizable: true,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      height: 'auto',
      pagerConfig: {
        autoHidden: false,
      },
      api: getTableData,
      toolbarConfig: {
        export: false,
        print: false,
        slots: { buttons: 'buttons' },
      },
      exportConfig: {
        excludeFields: ['checkbox'],
      },
      checkboxConfig: {
        // checkMethod: ({ row }) => row.status === STATUS_ENUM.禁用,
      },
      scrollY: {
        enabled: true,
        mode: 'wheel',
      },
      scrollX: {
        enabled: true,
      },
      i18nConfig: {
        moduleCode: 'SalesShipPatternColumn',
      },
    },
  });

  async function getTableData(params: any) {
    return getSalesShipPattern(params).then(async res => {
      const list = res?.data?.list || [];
      await tableRef.reloadColumn(getTableColumns(list));
      res.data.list = formatTableData(list);
      return res;
    });
  }

  function getTableColumns(
    list: Array<{
      patterns: Array<{ site: string }>;
    }>,
  ) {
    const columns = [...vxeTableColumns];

    if (!Array.isArray(list) || list.length === 0) {
      return columns;
    }

    const columnMap = {};
    list.forEach(item => {
      const patterns = item.patterns;
      if (!Array.isArray(patterns) || patterns.length === 0) {
        return;
      }
      patterns.forEach(({ site }) => {
        if (!columnMap[site]) {
          columnMap[site] = true;
          columns.push({
            field: site,
            title: site,
            width: 100,
            align: 'center',
            children: [
              {
                field: `${site}_${MATERIA_FORM_ENUM.片料}`,
                title: t('dict.DieCutShipPattern.P'),
                width: 120,
                formatter: ({ cellValue }) => formatShipPatternPercent(cellValue),
              },
              {
                field: `${site}_${MATERIA_FORM_ENUM.卷料}`,
                title: t('dict.DieCutShipPattern.R'),
                width: 120,
                formatter: ({ cellValue }) => formatShipPatternPercent(cellValue),
              },
            ],
          });
        }
      });
    });

    return columns;
  }

  /**
   * 格式化数据，如果`terminalCustomerPartNumber`、`immediateCustomerCode`相同，则视为同一条数据
   * 对此，创建`${site}_${shipPattern}`字段，其值为`shipPatternPercent`，新增一个`ids`字段，存储数据的`id`
   * @param list
   */
  function formatTableData(
    list: Array<{
      terminalCustomerPartNumber: string;
      immediateCustomerCode: string;
      ids?: Array<string>;
      status?: string | number;
      statusDesc?: string;
      patterns: Array<{
        site: string;
        shipPattern: string | number;
        shipPatternPercent: string;
        id: string;
        status: string | number;
        statusDesc: string;
      }>;
    }>,
  ) {
    if (!Array.isArray(list) || !list.length) {
      return [];
    }

    list.forEach(item => {
      const ids: Array<string> = [];
      Array.isArray(item.patterns) &&
        item.patterns.forEach(el => {
          item[`${el.site}_${el.shipPattern}`] = el.shipPatternPercent;
          ids.push(el.id);
        });
      item.ids = ids;
      if (item.patterns[0]) {
        item.status = item.patterns[0].status;
        item.statusDesc = item.patterns[0].statusDesc;
      }
    });

    return list;
  }

  function batchImportOrExport({ key }: { key: string }) {
    if (key === BUTTON_ENUM.导入) {
      return openImportPopup(true, {
        importPreviewApi: importSalesShipPattern,
        importSaveApi: () => Promise.resolve({}),
        templateApi: () => Promise.resolve({}),
        previewColumn: vxeTableColumns.map(item => ({
          ...item,
          dataIndex: item.field,
        })),
        usePolling: false,
        pollingParams: {
          interval: 0,
        },
        i18nConfig: {
          moduleCode: 'SalesShipPatternColumn',
        },
      });
    } else if (key === BUTTON_ENUM.导出) {
      // openExportModal(true, {
      //   listQuery: {},
      //   api: null,
      //   selectIds: tableRef.getSelectRowKeys(),
      // });

      tableRef.grid.exportData({
        filename: `${dayjs().format('YYYY-MM-DD')}_sales_ship_pattern`,
        type: 'xlsx',
        useStyle: true,
        mode: 'current',
      });
    }
  }

  function add() {
    openDetailPopup(true, {
      type: FORM_TYPE_ENUM.新增,
    });
  }

  function modify(terminalCustomerPartNumber: string, mainProcess: string) {
    openDetailPopup(true, {
      type: FORM_TYPE_ENUM.编辑,
      terminalCustomerPartNumber,
      mainProcess,
    });
  }

  function reload() {
    tableRef!.reload();
  }

  function comfirmBatchDelete() {
    const checkList = tableRef.grid.getCheckboxRecords();
    if (checkList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    const ids = checkList.reduce((list, item) => {
      list.push(...item.ids);
      return list;
    }, []);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDeleteSalesShipPattern(ids)
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
  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }
</style>
