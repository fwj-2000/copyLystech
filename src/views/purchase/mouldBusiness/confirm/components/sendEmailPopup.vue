<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.sendEmail')"
    :title="t('common.sendEmail')"
    @ok="() => handleSend()"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px">
        <Subtitle :title="t('common.sendEmail')" />
        <BasicForm @register="registerForm" />
      </div>
      <Grid style="height: calc(100vh - 160px)">
        <template #drawingsName="{ row }">
          <span v-if="row.drawingsName" class="text-orange-400 cursor-pointer" @click="handlePreview(row)">{{ row.drawingsName }}</span>
        </template>
      </Grid>
    </div>

    <!-- 文件 预览页面 -->
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSupplierlist } from '/@/api/engineering/mould';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas, getEditTableColumn, editRules } from './config';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { PreviewModal } from '/@/components/Upload';
  import { emaildatalist, emailsend } from '/@/api/productionDeal/mouldBusinessMaintenance';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();

  const [registerForm, { getFieldsValue, validate }] = useForm({
    baseColProps: {
      span: 24,
    },
    layout: 'horizontal',
    i18nConfig: {
      moduleCode: 'QuantitativeApplyColumn',
      transferRange: ['label'],
    },
    // @ts-ignore
    schemas,
  });

  const gridOptions: VxeGridProps = {
    id: 'purchase-mouldBusiness-confirm-sendEmail',
    columns: getEditTableColumn() as any,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'MoldRepairApplyColumn',
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data: { ids: Array<string> }) {
    changeLoading(true);
    return emaildatalist(data.ids)
      .then(res => {
        gridApi.grid.reloadData(res.data.list || []);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSend() {
    const flag = await validate();
    if (!flag) {
      return false;
    }

    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    const formData = getFieldsValue();
    const list = gridApi.grid.getFullData();

    changeOkLoading(true);
    return emailsend({ subject: formData.themeText, list, dataHtml: setHtmlFn() })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    const targetIndex = cols.findIndex((item: any) => item.field === 'supplier');
    if (targetIndex == -1 || rows.length === 0) return false;

    const tableData = gridApi.getDataSource();

    rows.forEach((row: any) => {
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && (item.supplier === row.supplier || item.supplierName === row.supplier));
      if (target) {
        Object.assign(row, { supplier: target.supplier, supplierName: target.supplierName });
      } else {
        getSupplierlist({ searchKey: row.supplier }).then(res => {
          const item = res?.data?.[0] || {};
          Object.assign(row, { supplier: item?.code, supplierName: item?.name });
        });
      }
    });

    return true;
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item: any) {
    const params = {
      name: item.drawingsName,
      Id: item.drawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      // previewApi: Promise.resolve(),
    };
    filePreviewRef.value?.init(params);
  }

  function getContent(column: any, row: any) {
    if (typeof column.formatter === 'function') {
      return column.formatter({ cellValue: row[column.field], row, column });
    }
    return row[column.field] || '';
  }

  function setHtmlFn() {
    const columns = gridApi.grid.getColumns();
    // 构建表头的 HTML
    const theadHtml = columns.map(header => `<th style="padding: 8px; text-align: left">${header.title}</th>`).join('');

    // 构建表身的 HTML
    const tbodyHtml: any = gridApi
      .getDataSource()
      .map(row => `<tr>${columns.map(cell => `<td style="padding: 8px">${getContent(cell, row)}</td>`).join('')}</tr>`)
      .join('');

    // 返回完整的表格 HTML
    return `
    <table border="1" style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>${theadHtml}</tr>
      </thead>
      <tbody>
        ${tbodyHtml}
      </tbody>
    </table>
  `;
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
