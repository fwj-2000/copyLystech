<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.add') }}</a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="handleExport">
                  <i class="icon-ym icon-ym-btn-download button-preIcon"> </i>
                  {{ t('common.batchExport') }}
                </button>
                <button @click="handleImport">
                  <i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>
                  {{ t('common.batchImport') }}
                </button>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_syncSAP'" type="link" @click="syncEquipmentFromSAP">
              <i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.syncSap') }}
            </a-button>
          </template>

          <template #Type="{ row }">{{ state.typeOption.find(c => c.id == row.Type)?.fullName }}</template>
          <template #ServiceLife="{ row }">{{ state.serviceLifeList.find(c => c.id == row.ServiceLife)?.fullName }}</template>
          <template #Exist="{ row }">
            <a-tag :color="row.Exist === 1 ? 'success' : 'error'">{{ row.Exist === 1 ? t('common.yesText') : t('common.noText') }}</a-tag>
          </template>
          <template #Status="{ row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.yesText') : t('common.noText') }}</a-tag>
          </template>
          <template #UseStatus="{ row }">{{ state.useStatusList.find(c => c.id == row.UseStatus)?.fullName }}</template>
          <template #UseSpecial="{ row }">
            <a-tag :color="row.UseSpecial === 1 ? 'success' : 'error'">{{ row.UseSpecial === 1 ? t('common.yesText') : t('common.noText') }}</a-tag>
          </template>
          <template #Category="{ row }">{{ state.equipmentClassList.find(c => c.id == row.Category)?.fullName }}</template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
    <syncSap @register="registerSyncSap" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getEquipment,
    deleteEquipment,
    blukDeleteEquipment,
    getLineInfoListBySearchKey,
    getSupplierList,
    exportEquipmentExcel,
  } from '/@/api/equipment/information';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { getColumn, getFormConfig } from './config';
  import { TableAction } from '/@/components/Table';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import syncSap from './components/syncSap.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useRoute } from 'vue-router';
  defineOptions({ name: 'Equipment-Information' });

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const route = useRoute();
  const equipmentType = route.query.equipmentType || 0; // 设备类型
  interface State {
    typeOption: any[];
    lineInfo: any[];
    useStatusList: any[];
    serviceLifeList: any[];
    supplierList: any[];
    equipmentClassList: any[];
    faultReasonList: any[];
  }

  const state = reactive<State>({
    typeOption: [],
    lineInfo: [],
    useStatusList: [],
    serviceLifeList: [],
    supplierList: [],
    equipmentClassList: [],
    faultReasonList: [],
  });
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerSyncSap, { openModal: openSyncSap }] = useModal();
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'EquipmentInformationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'Equipment-Information-list',
      rowConfig: {
        keyField: 'Id',
      },
      columns: getColumn(),
      beforeFetch: params => {
        return { ...params, equipmentType };
      },
      api: getEquipment,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentInformationColumn',
      },
    },
  });
  const { updateSchema, reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams, getFromValue } = gridApi;
  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id, record.SupplierName),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }
  const { createMessage, createConfirm } = useMessage();

  function addOrUpdateHandle(id = '', supplierName = '') {
    openFormModal(true, {
      id,
      supplierName,
      typeOption: state.typeOption,
      lineInfo: state.lineInfo,
      useStatusList: state.useStatusList,
      serviceLifeList: state.serviceLifeList,
      supplierList: state.supplierList,
      equipmentClassList: state.equipmentClassList,
      faultReasonList: state.faultReasonList,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteEquipment(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }
  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list.length === 0) return createMessage.warning(t('common.selectText'));

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code } = await blukDeleteEquipment(list);
          if (code == 200) {
            clearSelectedRowKeys();
            createMessage.warning(t('common.delSuccess'));
          }
          reload();
        } catch (e) {
          clearSelectedRowKeys();
          reload();
          throw e;
        }
      },
    });
  }
  //导入
  async function handleImport() {
    openImportModal(true, {});
    // let dataRow = [];
    // openImportModal(true, {
    //   importPreviewApi: async params => {
    //     const { data } = await Uploader(params);
    //     const res = await importEquipmentPreview({ fileName: data?.name });
    //     dataRow = res?.data?.dataRow || [];
    //     console.log('🚀 ~ handleImport ~ dataRow:', dataRow);
    //     return res;
    //   },
    //   templateApi: templateDownload,
    //   importSaveApi: async params => {
    //     const res = await importEquipmentData({ ...params, Data: dataRow, equipmentType: 0 });
    //     return res;
    //   },
    //   previewColumn: importColumns,
    //   usePolling: false,
    //   apiParams: {
    //     // importSaveApi: {
    //     //   equipmentType: 0,
    //     // },
    //   },
    //   // usePolling: true,
    //   // pollingParams: {
    //   //   getTaskStatus: getImportTasks,
    //   //   getTaskDataList: importTaskData,
    //   //   cancelTask: cancelImportTask,
    //   //   taskRead: importTaskRead,
    //   // },
    //   i18nConfig: {
    //     moduleCode: 'EquipmentInformationColumn',
    //   },
    // });
  }

  //导出
  const handleExport = async () => {
    const listQuery = await getFetchParams();
    openExportModal(true, {
      api: exportEquipmentExcel,
      listQuery: { ...listQuery, equipmentType },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: getColumn(),
      i18nConfig: {
        moduleCode: 'EquipmentInformationColumn',
      },
    });
  };
  function syncEquipmentFromSAP() {
    openSyncSap(true, {});
  }
  onMounted(async () => {
    const optionList = await getLineInfoListBySearchKey();

    state.lineInfo = optionList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.LineName,
      };
    });

    //查询供应商
    state.supplierList = (await getSupplierList('')).data.map(i => {
      return {
        id: i.id,
        fullName: i.name,
      };
    });

    //设备类型
    state.typeOption = ((await baseStore.getDictionaryData('EquipmentType')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });

    //使用状态
    state.useStatusList = ((await baseStore.getDictionaryData('UseStatus')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });

    //使用年限
    state.serviceLifeList = ((await baseStore.getDictionaryData('ServiceLife')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });

    //设备分类
    const equipmentClassList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.equipmentClassList = equipmentClassList;

    //设备故障原因
    const faultReasonList = ((await baseStore.getDictionaryData('equipmentFaultReason')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.faultReasonList = faultReasonList;

    updateSchema([
      {
        fieldName: 'Type',
        componentProps: {
          options: state.typeOption,
        },
      },
    ]);
  });
</script>
