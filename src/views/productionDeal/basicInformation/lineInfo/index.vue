<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
              <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <PrintPop @register="registerPrintPop" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction } from '/@/components/Table';
  import { getLineInfo, deleteLineInfo, blukDeleteLineInfo, exportLineInfoExcel, lineTypeList } from '/@/api/productionDeal/lineInfo';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from './config';
  import { omit } from 'lodash-es';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import PrintPop from './components/printPop.vue';
  defineOptions({ name: 'productionDeal-basicInformation-lineInfo' });

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();

  const [Grid, { reload, getFetchParams, getSelectRows, updateSchema, setFieldValue, setLatestSubmissionValues, getFromValue, query }] = useVbenVxeGrid({
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
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'LineInfoColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-lineInfo-list',
      columns: columns,
      api: getLineInfo,
      proxyConfig: {
        autoLoad: false,
      },
      beforeFetch: (params: any) => {
        const query = {
          ...omit(params, 'pickerVal'),
          startTime: params?.pickerVal?.[0] || '',
          endTime: params?.pickerVal?.[1] || '',
        };
        return query;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'LineInfoColumn',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        tooltip: t('common.delText'),
      },
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: () => reloadPrint(record),
        tooltip: t('common.printText'),
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();
  function reloadPrint(dataList) {
    reload();
    openPrintPop(true, dataList); // 打开打印页面
  }
  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteLineInfo(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const selectRows = getSelectRows();
    const selectKeys = selectRows.map(item => item.Id);
    if (selectKeys.length === 0) {
      return createMessage.error(t('common.selectText'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          const { code } = await blukDeleteLineInfo(selectKeys);
          if (code == 200) {
            message.success(t('common.delSuccess'));
            reload();
          }
        },
      });
    }
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportLineInfoExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'LineInfoColumn',
      },
    });
  }

  async function updateLineTypeList(e) {
    const { data } = await lineTypeList({ factoryArea: e });
    updateSchema([
      {
        fieldName: 'lineType',
        componentProps: {
          options: data,
        },
      },
    ]);
  }

  onMounted(async () => {
    updateSchema([
      {
        fieldName: 'factoryArea',
        componentProps: {
          onChange: async e => {
            updateLineTypeList(e);
            setFieldValue('lineType', null);
            setLatestSubmissionValues(await getFromValue());
            query();
          },
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }

  :deep(.ym-diecut) {
    font-size: 18px;
  }
</style>
