<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.LabelPrinting')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-button v-if="!handled" class="ml-12px" @click="handleSubmit(0)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <ScrollContainer class="p-10px h-[100%]">
      <Subtitle :title="t('common.LabelPrinting')"></Subtitle>
      <Grid>
        <template #material="{ rowIndex, row }">
          <lydc-input v-model:value="row['material']" :placeholder="row.placeholder" />
        </template>
        <template #demandQty="{ rowIndex, row }">
          <lydc-input v-model:value="row['demandQty']" :placeholder="row.placeholder" />
        </template>
        <template #QA="{ rowIndex, row }">
          <span :style="{ color: '#999' }">
            {{ t('common.signatureAea') }}
          </span>
        </template>
        <template #EN="{ rowIndex, row }">
          <span :style="{ color: '#999' }">
            {{ t('common.signatureAea') }}
          </span>
        </template>
        <template #SA="{ rowIndex, row }">
          <span :style="{ color: '#999' }">
            {{ t('common.signatureAea') }}
          </span>
        </template>

        <template #action="{ rowIndex, row }">
          <TableAction :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </ScrollContainer>
  </BasicPopup>
  <PrintModal @register="registerPrintModal" />
</template>
<script setup lang="ts">
  import type { ActionItem } from '/@/components/Table';

  import { ref } from 'vue';
  import { buildBitUUID } from '/@/utils/uuid';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { addSamplelabelprint, updateSamplelabelprint } from '/@/api/engineering/sampleApply';
  import { PrintModal } from '/@/components/CommonModal';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const emits = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerPrintModal, { openModal: openPrintModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const { t } = useI18n();

  let columns = [
    { title: '直接客户代码', field: 'immediateCustomerCode', i18nField: 'CommonCol.immediateCustomerCode', width: 200, disabled: true },
    { title: '内部项目代码', field: 'insideProjectCode', i18nField: 'CommonCol.insideProjectCode', width: 200 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
    { title: '直接客户料号', field: 'immediateCustomerPartNumber', i18nField: 'CommonCol.immediateCustomerPartNumber', width: 200, disabled: true },
    { title: t('dict.PCCColumn.productDesc'), field: 'productDesc', width: 160 },
    { title: '材料', field: 'material', compType: 'Input', slots: { default: 'material' } },
    { title: '需求数量(PCS)', field: 'demandQty', compType: 'Input', slots: { default: 'demandQty' } },
    { title: '日期', field: 'customerDeliveryTime', format: 'date|YYYY-MM-DD' },
    { title: '品质', field: 'QA', i18nField: 'CommonCol.QA', width: 160, compType: 'Text', placeholder: t('common.signatureAea'), slots: { default: 'QA' } },
    {
      title: '工程',
      field: 'EN',
      i18nField: 'CommonCol.EN',
      width: 160,
      compType: 'Text',
      disabled: true,
      placeholder: t('common.signatureAea'),
      slots: { default: 'EN' },
    },
    {
      title: '销售',
      field: 'SA',
      i18nField: 'CommonCol.SA',
      width: 160,
      compType: 'Text',
      disabled: true,
      placeholder: t('common.signatureAea'),
      slots: { default: 'SA' },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: '100',
      fixed: 'right',
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-design-list',
      columns,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'SampleLabelPrintColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
    },
  });
  /**
   * 是否为`已处理`，如果为`true`，则不显示暂存按钮
   */
  const handled = ref<boolean>(false);
  async function init({ dataSource, isHandled }: { dataSource: Array<any>; isHandled: boolean }) {
    const _dataSource = dataSource.map(item => {
      item.customerDeliveryTime = dayjs().format('YYYY-MM-DD');
      return item;
    });
    handled.value = isHandled;
    gridApi.reloadData(_dataSource);
  }

  function getTableActions(record: any, index: number): ActionItem[] {
    const list: ActionItem[] = [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, record, index),
      },
    ];

    // 存在`isCopyData`，则表示当前行数据是复制数据，可删除，所以增加删除按钮
    record.isCopyData &&
      list.push({
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record),
      });

    return list;
  }

  function handleCopy(record: any, index: number) {
    const _id = buildBitUUID();
    const tableData = gridApi.getDataSource();
    // 设置自定义`id`用于`rowKey`，方便数据的展示及后续的删除操作
    // 设置自定义`isCopyData`，是用于识别该数据是复制数据
    const copyRowData = cloneDeep({ ...record, id: _id, isCopyData: true });
    tableData.splice(index + 1, 0, copyRowData);
    gridApi.reloadData(tableData);
  }

  function handleDelete(record: any) {
    // 只能删除复制的数据，此时改`id`为复制时自定义的`_id`，与实际`id`无关，可用于删除作用
    record.isCopyData && gridApi.grid.remove(record);
  }

  async function handleSubmit(type = 1) {
    changeLoading(true);
    try {
      // 暂存或者提交时，过滤掉复制数据
      const list = gridApi.getDataSource().filter(item => !item.isCopyData);
      const api = handled.value ? updateSamplelabelprint(list) : addSamplelabelprint({ type, list });
      const { code, msg } = await api;
      if (code == 200) {
        createMessage.success(msg);
        if (type === 1) {
          openPrintModalFn();
        } else {
          closePopup();
        }
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit error');
    } finally {
      changeLoading(false);
    }
  }

  function openPrintModalFn() {
    const printData = gridApi.getDataSource();
    console.log(printData);
    let printList: any = [];
    if (!printData.length) return;
    printData.forEach(item => {
      const _insidePartNumber = item.immediateCustomerPartNumber
        ? item.insidePartNumber || '' + '/' + item.immediateCustomerPartNumber || ''
        : item.insidePartNumber || '';
      printList.push({
        immediateCustomerCode: item.immediateCustomerCode || '',
        insideProjectCode: item.insideProjectCode || '',
        insidePartNumber: _insidePartNumber,
        immediateCustomerPartNumber: item.immediateCustomerPartNumber || '',
        productDesc: item.productDesc || '',
        material: item.material || '',
        demandQty: item.demandQty || '',
        customerDeliveryTime: item.customerDeliveryTime || '',
        QA: '',
        EN: '',
        SA: '',
      });
    });
    openPrintModal(true, {
      printData: printList,
      templateId: '636327493271289797',
      customPrint,
    });
  }

  /**
   * 自定义打印
   */
  function customPrint(iframe: HTMLIFrameElement) {
    const iframeDocument = iframe.contentWindow?.document;
    if (!iframeDocument) {
      return false;
    }
    (iframeDocument?.querySelector('div[title="Print"] a') as HTMLLinkElement)?.click();
  }
</script>
<style scoped lang="scss">
  .scrollbar__wrap {
    height: 100%;
  }
  :deep(.scrollbar__view) {
    height: calc(100% - 40px) !important;
  }
</style>
