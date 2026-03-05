<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" ghost @click="handleAddFn()" v-auth="'btn_startWork'" v-if="pageType === SharePageType.StartWork">{{
              t('common.startProduction')
            }}</a-button>

            <a-button type="primary" @click="handlePrePrintFn" v-if="pageType === SharePageType.PrePrint">{{ t('common.printLabelForCirculation') }}</a-button>
          </template>
          <template #Status="{ row }">
            <LydcTag :theme="STARTWORKSTATUS_OPTIONS[row['status']]?.theme" :text="row['statusName']"></LydcTag>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <addModal @register="registeraddModal" @refresh="reload" />
    <addPop @register="registerAddPopup" @refresh="reload" />
    <PrintModal @register="registerPrintModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, unref, nextTick, toRefs, onMounted } from 'vue';
  import { ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import addModal from './components/addModal.vue';
  import addPop from './components/addPop.vue';
  import dayjs from 'dayjs';
  import { usePrePrintModel } from './hooks/usePrePrintModel';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import NodeModal from '/@/views/productionDeal/dieCut/receiveMaterials/components/NodeModal.vue';
  import { usePopup } from '/@/components/Popup';
  import { getProcesspreprintDetail } from '/@/api/productionDeal/dieCutPerPrint';
  import { PrintModal } from '/@/components/CommonModal';
  import { OperationType, STARTWORKSTATUS_OPTIONS, SharePageType } from './const';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  defineOptions({ name: `productionDeal-dieCut-prePrint` });
  const { t } = useI18n();
  interface Props {
    operationType: string;
    pageType: SharePageType;
  }

  const props = withDefaults(defineProps<Props>(), {
    operationType: 'PrePrint',
    pageType: SharePageType.PrePrint,
  });

  const { operationType, pageType } = toRefs(props);
  const curOrgId = ref('');

  const [registeraddModal, { openModal: openAddModal }] = useModal();
  const [registerPrintModal, { openModal: openPrintModal }] = useModal();
  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.includes(inputValue));
  };

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: () => handleDetailFn(record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: () => handlePrintFn(record),
        auth: 'btn_print',
      },
    ];
  }

  function openPrintModalFn(data: any = []) {
    let printList: any = [];
    printList = [data].map(item => {
      if (item.printDate) {
        item.printDate = dayjs(item.printDate).tz().format('YYYY-MM-DD HH:mm:ss');
      }
      if (item.creatorTime) {
        item.creatorTime = dayjs(item.printDate).tz().format('YYYY-MM-DD HH:mm:ss');
      }
      item.productCode = item.productCode || item.mouldNo;
      item.machineNo = item.machineNo || '';
      item.sheetQuantity = item.sheetQuantity || '';
      item.batchNo = item.batchNo || '';
      item.creatorUserName = item.creatorUserName || '';
      item.creatorTime = item.creatorTime || '';
      item.documentNumber = item.documentNumber || '';
      item.workOrderNo = item.workOrderNo || '';
      item.title = `系统流转${item.tagType === 1 ? '（首件）' : ''}标签`;
      item.teethQuantity = item.teethQuantity || '';
      item.dieCutMaterials = item.dieCutMaterials || '';
      item.customer = item.customer || '';
      item.relationWorkOrderNo = item.relationWorkOrderNo || '';
      item.mouldldNo = item.mouldldNo || '';

      return item;
    });
    openPrintModal(true, {
      printData: printList,
      templateId: data?.templateId || '657424936553414597',
    });
  }

  async function getProcesspreprintDetailFn(id: string): Promise<void> {
    const { code, data } = await getProcesspreprintDetail(id);
    if (code === 200) {
      openPrintModalFn(data);
    }
  }

  async function handlePrintFn(record: any = {}): Promise<void> {
    await getProcesspreprintDetailFn(record.id);
  }
  function handleDetailFn(data: any = {}): void {
    if (unref(pageType) === SharePageType.PrePrint) {
      handlePrePrintFn(data);
    } else {
      handleAddFn(data);
    }
  }
  function handlePrePrintFn(data: any = {}): void {
    const templistParams = { operationType, orgId: unref(curOrgId) };
    const title = data.id === undefined ? t('common.printText') : t('component.upload.view');
    openAddPopup(true, { data, title, templistParams, pageType: unref(pageType) });
  }
  async function handleAddFn(data: any = {}): Promise<void> {
    const templistParams = { operationType, orgId: unref(curOrgId) };
    const title = data.id === undefined ? OperationType[unref(pageType)] : t('component.upload.view');
    openAddModal(true, { data, title, templistParams, pageType: unref(pageType) });
  }

  const getDataSources = () => {
    if (pageType.value === SharePageType.PrePrint) {
      return 1;
    }
    if (pageType.value === SharePageType.Change) {
      return 2;
    }
    return '';
  };
  const { searchFormSchema, getTableColumns, getTableData } = usePrePrintModel({
    pageType: unref(pageType),
    operationType: unref(operationType),
    orgId: unref(curOrgId),
  });
  async function getColumns() {
    let columns = (await getTableColumns({ operationType: unref(operationType), orgId: unref(curOrgId), pageType: unref(pageType) })).map(item => {
      return {
        ...item,
        field: item.dataIndex,
      };
    });

    columns.forEach(item => {
      if (['DictType', 'ApiType', 'Personnel', 'Organize'].includes(procRuleTempEnum[item.dataType])) {
        if (item.field !== 'lineCode') {
          item.field = item.field + 'Name';
        }
      }
      if (item.field === 'status') {
        item.slots = { default: 'Status' };
      }
      if (item.field.includes('Time')) {
        item.cellRender = {
          name: 'Date',
        };
      }
      if (item.field.includes('Date')) {
        item.cellRender = {
          name: 'Date',
        };
      }
    });
    if (pageType.value === SharePageType.PrePrint) {
      columns.push({
        title: '操作',
        field: 'action',
        slots: { default: 'action' },
        width: 100,
        fixed: 'right',
      });
    }

    return columns || [];
  }
  watch(
    () => [curOrgId.value],
    val => {
      if (val.includes('')) return;
      setGridOptions({ api: getTableData });
      nextTick(() => {
        reloadTable();
      });
    },
  );
  searchFormSchema.forEach(item => {
    item.fieldName = item.field;
    if (item.component === 'DateRange') {
      item.component = 'RangePicker' as any;
    }
  });

  const [Grid, { reload, reloadColumn, setGridOptions, updateSchema }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-prePrint',
      columns: [],
      // api: getTableData,
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
          factory: curOrgId.value,
          dataSources: getDataSources(),
        };
        if (params.produceDate && params.produceDate.length > 0) {
          _params.StartTime = dateUtil(params.produceDate[0]).valueOf();
          _params.EndTime = dateUtil(params.produceDate[1]).valueOf();
          delete _params.produceDate;
        }
        return _params;
      },
    },
  });

  function handleNodeModal(record) {
    openNodeModal(true, record);
  }

  const reloadTable = async () => {
    let columns = await getColumns(); // 获取表格列
    columns = columns.map(item => {
      return {
        ...item,
        width: 150,
      };
    });
    reloadColumn(columns);
    reload();
  };
  onMounted(() => {
    updateSchema([
      {
        fieldName: 'factory',
        componentProps: {
          onChange: e => {
            curOrgId.value = e;
          },
        },
      },
    ]);
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    &-select {
      background: #fff;
      display: flex;
      align-items: flex-start;
      padding: 16px 0 0 12px;
      height: 60px;
      border: 1px solid #f0f0f0;
    }
  }

  :deep(.process-select .ant-select-selection-item) {
    color: #000;
    font-weight: bolder !important;
    font-size: 14px;
  }
</style>
