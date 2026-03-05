<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 打印 -->
              <a-button type="primary" v-auth="'btn_print'" @click="handleAdd">{{ t('common.LabelPrinting') }}</a-button>

              <a-button type="primary" v-auth="'btn_print'" ghost @click="handleBatchReprint">{{ t('dict.CommonCol.batchReprint') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
          <template #Time="{ row, column }"> {{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD HH:mm:ss') : '' }} </template>
          <template #Date="{ row, column }">{{ row[column.field] ? dayjs(row[column.field]).format('YYYY-MM-DD') : '' }} </template>
        </Grid>
      </div>
    </div>
    <AddModal @register="registerAdd" @reload="reloadPrint"></AddModal>
    <PrintPop @register="registerPrintPop" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, unref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getSplitPrintPage } from '/@/api/productionDeal/splitPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import AddModal from './components/AddModal.vue';
  import PrintPop from './components/printPop.vue';
  import { usePrePrintModel } from '/@/views/productionDeal/dieCut/prePrint/hooks/usePrePrintModel';
  import { SharePageType } from '/@/views/productionDeal/dieCut/prePrint/const';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import dayjs from 'dayjs';
  import { usePopup } from '/@/components/Popup';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-dieCut-splitPrint' });
  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();

  const getColumns = async () => {
    const { getTableColumns } = usePrePrintModel({
      pageType: unref(SharePageType.SplitPrint),
      operationType: unref('SplitPrint'),
      orgId: unref(''),
    });
    let columns = (await getTableColumns()).map(item => {
      return {
        ...item,
        field: item.dataIndex,
      };
    });
    columns.forEach(item => {
      if (['DictType', 'ApiType', 'Personnel', 'Organize'].includes(procRuleTempEnum[item.dataType])) {
        item.field = item.field + 'Name';
      }
      if (item.field.includes('Time')) {
        item.slots = { default: 'Time' };
      }
      if (item.field.includes('Date')) {
        item.slots = { default: 'Date' };
      }
    });

    columns.unshift({ field: 'checkbox', width: 50, type: 'checkbox' });

    columns.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 50,
      fixed: 'right',
    });
    return columns || [];
  };

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: getFormSchema(),
    i18nConfig: {
      moduleCode: 'SplitPrintColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, reloadColumn, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-scopeMaintenance-list',
      columns: [],
      api: getSplitPrintPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'SplitPrintColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
        };
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: () => handlePrintFn(row, 'small'),
        auth: 'btn_print',
        tooltip: t('dict.CommonCol.printSmallTag'),
      },
      // {
      //   icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
      //   onClick: () => handlePrintFn(row, 'big'),
      //   auth: 'btn_print',
      //   tooltip: t('dict.CommonCol.printBigTag'),
      // },
    ];
  }

  function handleSearch() {
    reload();
  }

  function handleReset() {
    clearValidate();
    reload();
  }

  function handlePrintFn(row, type) {
    openPrintPop(true, { row: [row], type }); // 打开打印页面
  }

  // 打印
  const handleAdd = () => {
    openAddModal(true, { operationType: 'SplitPrint' });
  };

  // 批量补打
  const handleBatchReprint = () => {
    const list = getSelectRows();
    if (list.length === 0) return message.warning(t('dict.CheckDataTip'));
    openPrintPop(true, { row: list, type: 'small' }); // 打开打印页面
  };

  function reloadPrint(dataList) {
    reload();
    openPrintPop(true, { row: dataList, type: 'small' }); // 打开打印页面
  }

  const reloadTable = async () => {
    const columns = await getColumns(); // 获取表格列
    reloadColumn(columns);
    reload();
  };

  onMounted(() => {
    reloadTable();
  });
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
