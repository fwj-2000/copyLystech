<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="handleApply">
                {{ t('common.add') }}
              </a-button>
              <a-button type="primary" ghost v-auth="'btn_desensitization'" @click="handleDesensitization">
                {{ t('common.desensitizedInformationMaint') }}
              </a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">
                {{ t('common.batchExport') }}
              </a-button>
              <a-button type="primary" danger ghost v-auth="'btn_batchRemove'" @click="handleDel">
                {{ t('common.batchDelText') }}
              </a-button>
            </a-space>
          </template>
          <template #convertConfig="{ row }">
            <span class="table-a" v-if="row.convertConfig" @click="handleDesensitization(row)">{{ t('common.viewDetails') }}</span>
            <span v-else>{{ t('common.toMaintain') }}</span>
          </template>
          <template #productStage="{ row }">
            <div class="table-a" @click="handleDetailView(row)">{{ t('common.viewDetails') }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApply" @reload="refresh" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="refresh" />
    <DesensitizationInfo @register="registerDesensitization" @reload="refresh"></DesensitizationInfo>
    <ProductStageModal @register="registerProductStage" @reload="refresh"></ProductStageModal>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApplyPop from './components/ApplyPop.vue';
  import { getList, del, batchDel, template, importSave, importPreview, exportExcel } from '/@/api/business/terminalCustomer';
  import { usePopup } from '/@/components/Popup';
  import { StatusList } from './config';
  import { onMounted, reactive } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import DesensitizationInfo from './components/DesensitizationInfoModal.vue';
  import { getMainProcess } from '/@/utils/business/index';
  import ProductStageModal from './components/ProductStageModal.vue';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'business-basicInformation-terminalCustomer' });

  const { t } = useI18n();
  const baseStore = useBaseStore();

  const { createMessage, createConfirm } = useMessage();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();
  const [registerProductStage, { openModal: openProductStage }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerDesensitization, { openModal: openDesensitization }] = useModal();

  const state = reactive({
    mainProcessOptions: [] as Array<{ id: string | number; fullName: string }>,
    cacheList: [],
  });
  const STATUS_OPTIONS = [
    { id: 0, theme: 'gray', rowKey: 'status', fullName: '' }, // 空状态无需翻译
    { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'status' }, // 启用
    { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'status' }, // 禁用
  ];
  // 定义VXE表格列
  const column = [
    { type: 'checkbox', field: 'checkbox', width: 45 },
    {
      title: '编码',
      field: 'terminalCustomerCode',
      width: 60,
    },
    {
      title: '简称',
      field: 'terminalCustomerName',
      width: 100,
    },
    {
      title: '全称',
      field: 'terminalCustomerFullName',
      width: 160,
    },
    {
      title: '产品阶段',
      field: 'productStage',
      width: 80,
      slots: { default: 'productStage' },
    },
    {
      title: '主要制程',
      field: 'mainProcess',
      width: 100,
      formatter: ({ cellValue }) => {
        const option = state.mainProcessOptions.find(el => el.id == cellValue);
        return option ? option.fullName : '';
      },
    },
    {
      title: '所属组织',
      field: 'orgName',
      width: 170,
    },
    {
      title: '状态',
      field: 'status',
      i18nField: 'status',
      width: 80,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '脱敏信息',
      field: 'convertConfig',
      width: 80,
      i18nField: 'desensitizationText',
      slots: { default: 'convertConfig' },
    },
    {
      title: '备注',
      field: 'remarks',
      width: 120,
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      width: 140,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 120,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      width: 140,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      width: 120,
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  // 使用vxe表格
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [
        {
          fieldName: 'terminalCustomerCode',
          component: 'Input',
          componentProps: {
            placeholder: '编码',
          },
        },
        {
          fieldName: 'terminalCustomerName',
          component: 'Input',
          componentProps: {
            placeholder: '简称',
          },
        },
        {
          fieldName: 'mainProcess',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '主要制程',
            allowClear: true,
            api: () => baseStore.getDictionaryData('MainProcess'),
            resultField: '',
            labelField: 'fullName',
            valueField: 'enCode',
          },
        },
        {
          fieldName: 'status',
          component: 'Select',
          componentProps: {
            placeholder: '状态',
            options: StatusList,
            fieldNames: { label: 'fullName', value: 'id' },
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'TerminalCustomerColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-terminalCustomer-list',
      columns: column,
      api: getList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'TerminalCustomerColumn',
      },
      afterFetch: data => {
        state.cacheList = data.list;
      },
    },
  });

  const { reload, getSelectRowKeys, clearSelectedRowKeys, updateSchema, getFetchParams } = gridApi;

  const handleDetailView = row => {
    openProductStage(true, row);
  };

  function handleApply() {
    openApplyPop(true, {});
  }

  async function handleDel() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await batchDel(selectKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e: any) {
          createMessage.error(e);
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_detail',
        tooltip: t('common.editText'),
      },
      {
        auth: 'btn_remove',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, row.id),
        },
        tooltip: t('common.delText'),
      },
    ];
  }

  function handleEdit(record) {
    openApplyPop(true, {
      type: 'edit',
      id: record.id,
    });
  }

  async function onDelete(id) {
    const { code, msg } = await del(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  async function handleExport() {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      api: exportExcel,
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'TerminalCustomerColumn',
      },
    });
  }

  function handleDesensitization(row) {
    if (row.id) {
      return openDesensitization(true, row);
    }
    const rows = gridApi.getSelectRows();
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    openDesensitization(true, rows[0]);
  }
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  onMounted(async () => {
    const r = await getMainProcess();
    state.mainProcessOptions = r;
    updateSchema([
      {
        fieldName: 'mainProcess',
        componentProps: {
          options: r,
        },
      },
    ]);
  });
</script>
