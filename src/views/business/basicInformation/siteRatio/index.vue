<!--
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-11 09:31:50
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-18 11:42:58
 * @FilePath: \lydc.server.web\src\views\business\basicInformation\siteRatio\index.vue
 * @Description: site比例 - 列表页
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
                <button v-auth="'btn_upload'" @click="batchImportOrExport({ key: BUTTON_ENUM.导入 })">{{ t('common.batchImport') }} </button>
                <button v-auth="'btn_download'" @click="batchImportOrExport({ key: BUTTON_ENUM.导出 })">{{ t('common.batchExport') }}</button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" class="ml-3" @click="comfirmBatchDelete"> {{ t('common.batchDelText') }} </a-button>
          </template>

          <template #terminalCustomerProjectCode="{ row }">
            <span class="table-a" @click="() => modify(row.terminalCustomerProjectCode, row.mainProcess)">
              {{ row.terminalCustomerProjectCode }}
            </span>
          </template>
        </VxeBasicTable>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @reload="reload" />
    <DetailPopup @register="registerFormPop" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid, VxeTableDefines } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { vxeTableColumns, vxeTableFormSchema, BUTTON_ENUM, FORM_TYPE_ENUM, STATUS_ENUM } from './config';
  import { getSalesSite, importSalesSite, exportSalesSite, bulkDeleteSalesSite } from '/@/api/business/siteRatio';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { createOrUpdateTableCustomData } from '/@/api/system/customData';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/batchImport.vue';
  import DetailPopup from './components/detail.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'business-basicInformation-siteRatio' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const userStore = useUserStore();
  const { createConfirm, createMessage } = useMessage();

  const [registerFormPop, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
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
        moduleCode: 'SalesSiteColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-siteRatio-list',
      mouseConfig: {
        area: false, // 是否开启区域选取
        extension: false,
      },
      columns: vxeTableColumns,
      columnConfig: {
        resizable: true,
      },
      height: 'auto',
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      api: getSalesSite,
      toolbarConfig: {
        export: false,
        print: false,
        slots: { buttons: 'buttons' },
      },
      exportConfig: {
        excludeFields: ['checkbox'],
      },
      checkboxConfig: {
        checkMethod: ({ row }) => row.status === STATUS_ENUM.禁用,
      },
      scrollY: {
        enabled: true,
        mode: 'wheel',
      },
      scrollX: {
        enabled: true,
      },
      i18nConfig: {
        moduleCode: 'SalesSiteColumn',
      },
      customConfig: {
        enabled: true,
        storage: true,
        restoreStore({ id }) {
          return (userStore.getTableCustomConfig(id) || '') as VxeTableDefines.CustomStoreData;
        },
        updateStore({ id, storeData }) {
          return new Promise<void>(resolve => {
            createOrUpdateTableCustomData(id, storeData).then(res => {
              if (res.code === 200) {
                userStore.setTableCustomConfig(id, storeData);
                createMessage.success(t('common.saveSuccessText'));
              } else {
                createMessage.error(res.msg);
              }
              resolve();
            });
          });
        },
      },
    },
  });

  function batchImportOrExport({ key }: { key: string }) {
    if (key === BUTTON_ENUM.导入) {
      return openImportPopup(true, {
        importPreviewApi: importSalesSite,
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
          moduleCode: 'SalesSiteColumn',
        },
      });
    } else if (key === BUTTON_ENUM.导出) {
      openExportModal(true, {
        listQuery: {},
        api: exportSalesSite,
        exportOptions: vxeTableColumns.slice(2),
        nameProps: 'title',
        idProps: 'field',
        i18nConfig: {
          moduleCode: 'SalesSiteColumn',
        },
      });
    }
  }

  function add() {
    openDetailPopup(true, {
      type: FORM_TYPE_ENUM.新增,
    });
  }

  function modify(terminalCustomerProjectCode: string, mainProcess: string | number) {
    openDetailPopup(true, {
      type: FORM_TYPE_ENUM.编辑,
      terminalCustomerProjectCode,
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
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDeleteSalesSite(checkList.map(item => item.id))
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

  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
