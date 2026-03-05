<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleTechMaintenance"> {{ t('dict.TechInfoColumn.techMaintenance') }} </a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">
              {{ t('common.batchExport') }}
            </a-button>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList">
              {{ t('common.batchDelText') }}
            </a-button>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <TechMaintenancePopup @register="registerTechMaintenancePop" @reload="reload" @colse="reload" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { schema, columns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep, omit } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import TechMaintenancePopup from './components/TechMaintenancePopup.vue';
  import { getTechnicalUpdateConfig, bulkDelete, del, Export } from '/@/api/qms/technicalTransformation';
  import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';

  defineOptions({ name: 'qms-intelligentButler-technicalTransformation' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const { createMessage, createConfirm } = useMessage();
  const [registerTechMaintenancePop, { openPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [Grid, { reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams, updateSchema, setFieldValue, getFromValue }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema,
      i18nConfig: {
        moduleCode: 'TechInfoColumn',
        transferRange: ['placeholder'], // 缺少会加上label
      },
    },
    gridOptions: {
      id: 'qms-intelligentButler-technicalTransformation-list',
      api: getTechnicalUpdateConfig,
      beforeFetch: (params: any) => {
        const query = {
          ...omit(params, 'pickerVal'),
          startTime: params?.pickerVal?.[0] || '',
          endTime: params?.pickerVal?.[1] || '',
        };
        return query;
      },
      columns,
      i18nConfig: {
        moduleCode: 'TechInfoColumn',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'ym-diecut ym-diecut-edit-1',
        onClick: handleEdit.bind(null, cloneDeep(record)),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  async function handleTechMaintenance() {
    const data = await getFromValue();
    openPopup(true, { factoryArea: data.factoryArea });
  }

  async function handleEdit(record) {
    const data = await getFromValue();
    openPopup(true, {
      type: 'edit',
      data: record,
      factoryArea: data.factoryArea,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    del(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    let list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      console.log(list);
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await bulkDelete(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.log(e);
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  function handleExport() {
    openExportModal(true, {
      listQuery: { ...getFetchParams() },
      api: Export,
      // exportOptions: columns.slice(1).map(item => {
      //   return {
      //     ...item,
      //     title: item.title,
      //     dataIndex: item.field,
      //   };
      // }),
      // nameProps: 'title',
      // idProps: 'dataIndex',
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns.slice(1),
      i18nConfig: {
        moduleCode: 'TechInfoColumn',
      },
    });
  }

  async function updateMachineNoList(e) {
    const { data } = await getMachinelCodeList({ factoryArea: e });
    updateSchema([
      {
        fieldName: 'machineNo',
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
          onChange: e => {
            updateMachineNoList(e);
            setFieldValue('machineNo', null);
          },
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  :deep(.icon-ym) {
    font-size: 18px;
  }

  :deep(.ym-diecut) {
    font-size: 18px;
  }
</style>
