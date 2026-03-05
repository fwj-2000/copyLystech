<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="t('common.deliveryDate')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <a-button class="ml-12px" @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <ScrollContainer class="p-10px">
      <BasicTable @register="registerEditTable">
        <template #tableTitle>
          <div style="position: relative; top: 8px">
            <Subtitle :title="t('common.deliveryDate')"></Subtitle>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record)" />
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <BasicTable @register="registerSubTable" :dataSource="record.quantitativePlanMaterials"></BasicTable>
        </template>
      </BasicTable>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { getColumns, getMaterialColumns } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { storageMcDetail, updateMcAPI, getMcDetails } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { nextTick } from 'vue';
  import dayjs from 'dayjs';
  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [registerSubTable] = useTable({
    columns: getMaterialColumns(),
    useSearchForm: false,
    immediate: false,
    striped: true,
    ellipsis: true,
    canResize: false,
    pagination: false,
    showIndexColumn: false,
    showTableSetting: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  });
  const [registerEditTable, { setTableData, getDataSource, expandAll, deleteTableDataRecord }] = useTable({
    columns: getColumns(),
    tableSetting: {
      redo: false,
    },
    isTreeTable: true,
    defaultExpandAllRows: true,
    pagination: false,
    striped: true,
    canResize: true,
    resizeHeightOffset: 20,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
    },
  });
  async function init(data) {
    changeLoading(true);
    const r = await getMcDetails(data.ids);
    if (r.code == 200) {
      setTableData(
        r.data.map(item => {
          item = {
            ...item,
            estimatedMaterialsTime: item.estimatedMaterialsTime ? dayjs(item.estimatedMaterialsTime).tz().format('YYYY/MM/DD') : '',
            onEdit: true,
            editable: true,
          };
          return item;
        }),
      );
      nextTick(() => {
        expandAll();
        changeLoading(false);
      });
    } else {
      changeLoading(false);
    }
  }

  // 操作栏
  function createActions(record): ActionItem[] {
    return [
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record.id),
      },
    ];
  }

  // 处理删除栏
  async function handleDelete(id) {
    deleteTableDataRecord(id);
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = getDataSource().map(item => {
      return {
        id: item.id,
        estimatedMaterialsTime: item.estimatedMaterialsTime,
        mcRemark: item.mcRemark,
      };
    });
    // 如果数据都被删除了，直接关闭弹窗
    if (params.length) {
      try {
        const r = type == 'storage' ? await storageMcDetail(params) : await updateMcAPI(params);
        if (r.code == 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          if (type != 'storage') {
            closePopup();
            emits('reload');
          }
        }
        changeOkLoading(false);
      } catch (error) {
        changeOkLoading(false);
      }
    } else {
      closePopup();
    }
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
