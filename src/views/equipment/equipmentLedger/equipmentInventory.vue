<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增  -->
              <a-button v-auth="'btn_add'" type="primary" class="mr-12px" @click="openAddModal">{{ t('common.add2Text') }}</a-button>
              <!-- 提交 -->
              <a-button class="mr-12px" v-auth="'btn_commit'" type="primary" ghost @click="handleCommitapply" :loading="btnLoading">{{
                t('common.submitText')
              }}</a-button>
              <!-- 同步3.8 -->
              <a-button class="mr-12px" v-auth="'btn_syncEquipmentLedger'" type="primary" ghost @click="handleSyncEquipmentLedger" :loading="btnLoading">{{
                t('dict.CommonCol.syncEquipmentLedger')
              }}</a-button>
              <!-- <a-button class="mr-12px" type="primary" ghost>催办</a-button> -->
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="batchImportOrExport">
                    <a-menu-item v-if="hasBtnP('btn_upload')" key="import">{{ t('common.batchImport') }} </a-menu-item>
                    <a-menu-item v-if="hasBtnP('btn_download')" key="export">{{ t('common.batchExport') }} </a-menu-item>
                  </a-menu>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </a-dropdown>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <EquipmentImportModal @register="registerEquipmentImport" @handleImport="handleImport"></EquipmentImportModal>
    <InventoryAddModal @register="registerInventoryAdd" @reload="reload"></InventoryAddModal>
    <NGReasonModal @register="registerNGReasonModal" @reload="reload"></NGReasonModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { equipmentInventoryColumn, inventorySchema, equipmentInventoryColumnExport } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import EquipmentImportModal from './components/equipmentImportModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    inventorypage,
    equipmentledgerCommitapply,
    exportinventory,
    equipmentledgerDelete,
    syncEquipmentLedger,
    checkCompareResult,
  } from '/@/api/equipment/equipmentLedger';
  import InventoryAddModal from './components/InventoryAddModal.vue';
  import NGReasonModal from './components/NGReasonModal.vue';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const props = defineProps({
    state: {
      type: Object,
      default: () => ({}),
    },
  });

  const btnLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerEquipmentImport, { openModal: openEquipmentImport }] = useModal();
  const [registerInventoryAdd, { openModal: openInventoryAddModal }] = useModal();
  const [registerNGReasonModal, { openModal: openNGReasonModal }] = useModal();
  const { createConfirm, createMessage } = useMessage();

  const emit = defineEmits(['handleImport']);

  const [Grid, { reload, getSelectRowKeys, getFetchParams, setFieldValue, getFromValue, setLatestSubmissionValues, resetForm }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: inventorySchema,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'equipment-equipmentLedger-equipmentInventory',
      columns: equipmentInventoryColumn,
      api: inventorypage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
      },
      proxyConfig: {
        autoLoad: false,
      },
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.weeks);
        return {
          ...params,
          weeks: `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
    },
  });

  async function weekTransferStr() {
    const { weeks } = await getFromValue();
    const weeksDayjs = dayjs(weeks);
    return `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
  }

  async function openAddModal() {
    const { factoryArea, weeks } = await getFromValue();
    if (!weeks) return createMessage.warning(t('dict.FcDataColumn.selectSearchDateTip'));
    openInventoryAddModal(true, { factoryArea, weeks: await weekTransferStr() });
  }

  async function handleCommitapply() {
    const { factoryArea, weeks } = await getFromValue();
    if (!factoryArea) return message.warning(t('dict.CommonCol.selectSBUTip'));
    if (!weeks) return message.warning(t('dict.FcDataColumn.selectSearchDateTip'));
    const weekFormateValue = await weekTransferStr();
    const currentYear = weekFormateValue.split('-')[0];
    const currentWeek = weekFormateValue.split('-')[1];

    openNGReasonModal(true, { factoryArea, currentYear, currentWeek });
    // 提交前校验
    // const { data } = await checkCompareResult({ factoryArea, currentYear, currentWeek });
    // if (!data) {
    //   openNGReasonModal(true, { factoryArea, currentYear, currentWeek });
    // } else {
    //   btnLoading.value = true;
    //   const res = await equipmentledgerCommitapply({
    //     factoryArea,
    //     currentYear,
    //     currentWeek,
    //   }).finally(() => {
    //     btnLoading.value = false;
    //   });
    //   createMessage.success(res.msg);
    //   reload();
    // }
  }

  // 同步3.8
  function handleSyncEquipmentLedger() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.syncEquipmentLedgerTip'),
      onOk: async () => {
        const res = await syncEquipmentLedger();
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? openImportModal : handleExport;
    openMethod();
  }

  function handleImport(data) {
    emit('handleImport', data);
  }

  // 导入
  const openImportModal = () => {
    openEquipmentImport(true, {});
  };

  // 批量删除
  const handelDelete = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    const [currentYear, currentWeek] = (await weekTransferStr()).split('-');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        const res = await equipmentledgerDelete({ ids, currentYear, currentWeek });
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  };

  // 批量导出
  const handleExport = async () => {
    const fieldsValue = await getFromValue();
    openExportModal(true, {
      listQuery: {
        ...fieldsValue,
        ...(await getFetchParams()),
        weeks: await weekTransferStr(),
      },
      exportOptions: equipmentInventoryColumnExport,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = async query => {
    exportinventory(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  onMounted(async () => {
    const { weeks, factoryArea } = props.state;
    if (weeks) {
      const [y, w] = weeks.split('-').map(Number);
      const weeksDayjs = dayjs().year(y).isoWeek(w);
      await setFieldValue('weeks', weeksDayjs);
      await setFieldValue('factoryArea', factoryArea);
    }

    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    reload();
  });

  const reloadTable = async importParams => {
    console.log(importParams, 'importParams+');
    const { weeks, factoryArea } = importParams;
    const [y, w] = weeks.split('-').map(Number);
    const weeksDayjs = dayjs().year(y).isoWeek(w);
    await resetForm();
    await setFieldValue('weeks', weeksDayjs);
    await setFieldValue('factoryArea', factoryArea);
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    reload();
  };

  defineExpose({ reload, reloadTable });
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
