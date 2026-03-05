<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <a-button v-auth="'btn_add'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
            <!-- <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item v-if="hasBtnP('btn_upload')" key="import">{{ t('common.batchImport') }}</a-menu-item>
                  <a-menu-item v-if="hasBtnP('btn_download')" key="export">{{ t('common.batchExport') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown> -->
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
  <add @register="registerForm" @reload="reload" />
  <ExportModal @register="registerExportModal" />
  <BatchUpload @register="registerBatchImportPop" @reload="reload" />
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { blukDeleteProcessPara, deleteProcessPara, exportProcessParaExcel, getProcessPara } from '/@/api/engineering/process';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'engineering-basicInformation-processPara' });
  const baseStore = useBaseStore();

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns = [
    { type: 'checkbox', field: 'checkbox' },
    { title: '工艺类型', field: 'typeCodeName', width: 100 },
    { title: '刀数', field: 'numberOfKnives', width: 100 },
    {
      title: '步距范围',
      field: 'stepRange',
      align: 'center',
      minWidth: 150,
      children: [
        {
          title: t('dict.ProcessParaColumn.stepDistanceFrom') + '(＞)',
          field: 'stepDistanceFrom',
          width: 100,
        },
        {
          title: t('dict.ProcessParaColumn.stepDistanceTo') + '(≤)',
          field: 'stepDistanceTo',
          width: 100,
        },
      ],
    },
    // {
    //   title: '模切单位',
    //   align: 'center',
    //   children: [
    //     {
    //       title: '速度',
    //       field: 'dieCutSpeed',
    //       key: 'street',
    //       align: 'center',
    //     },
    //     {
    //       title: '单位',
    //       field: 'dieCutSpeedUnit',
    //       key: 'street',
    //       align: 'center',
    //     },
    //   ],
    // },
    { title: '主机手技能', field: 'mainOperatorStaffingName' },
    { title: '辅机手技能', field: 'auxiliaryOperatorStaffingName' },
    {
      title: '建议开机速度',
      align: 'center',
      field: 'suggestedStartupSpeedField',
      minWidth: 150,
      children: [
        {
          title: t('dict.PCCColumn.speed'),
          field: 'suggestedStartupSpeed',
          width: 100,
        },
        {
          title: t('dict.PCCPackingType.unit'),
          field: 'suggestedStartupSpeedUnit',
          width: 100,
        },
      ],
    },
    { title: '建议调机时间', field: 'suggestedAdjustmentTime' },
    {
      title: '建议良率',
      field: 'suggestedYield',
      formatter: ({ row }) => {
        return row.suggestedYield ? row.suggestedYield * 100 + '%' : '';
      },
    },
    { title: '建议调机米数', field: 'suggestedAdjustmentMetres' },
    {
      title: '操作',
      field: 'actions',
      slots: { default: 'action' },
      fixed: 'right',
      width: 70,
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'typeCode',
      label: '',
      i18nField: 'typeCodeName',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        colProps: { span: 4 },
      },
    },
    {
      fieldName: 'numberOfKnives',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入刀数',
      },
      colProps: { span: 4 },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'ProcessParaColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-processPara-list',
      columns: columns,
      showIndexColumn: true,
      api: getProcessPara,
      tableSetting: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'ProcessParaColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessPara(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const ids = getSelectRowKeys();
    if (ids?.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteProcessPara(ids);
            if (code == 200) {
              createMessage.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            reload();
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }
  //导入
  function handleImport() {
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }
  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportProcessParaExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProcessParaColumn',
      },
    });
  }
</script>
