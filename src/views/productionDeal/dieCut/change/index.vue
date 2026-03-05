<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- <a-button type="primary" ghost @click="handleAddFn()" v-auth="'btn_startWork'" v-if="pageType === SharePageType.StartWork">{{
              t('common.startProduction')
            }}</a-button> -->
            <!-- v-if="pageType === SharePageType.Change" -->
            <a-button type="primary" ghost @click="handleLabelConversion()" v-auth="'btn_change'">{{ t('common.flowLabelConversion') }}</a-button>
            <!-- <a-button type="primary" @click="handlePrePrintFn" v-if="pageType === SharePageType.PrePrint">{{ t('common.printLabelForCirculation') }}</a-button> -->
          </template>
          <template #Status="{ rowIndex, row }">
            <LydcTag :theme="STARTWORKSTATUS_OPTIONS[row['status']]?.theme" :text="row['statusName']"></LydcTag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <addModal @register="registeraddModal" @refresh="reload" />
    <!-- <addPop @register="registerAddPopup" @refresh="reload" /> -->
    <detailModal @register="registerDetailModal" @refresh="reload" />
    <PrintModal @register="registerPrintModal" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, watch, unref, nextTick, toRefs } from 'vue';
  import { ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import addModal from './components/addModal.vue';
  // import addPop from './components/addPop.vue';
  import detailModal from './components/detailModal.vue';
  import dayjs from 'dayjs';
  import { usePrePrintModel } from './hooks/usePrePrintModel';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  // import { usePopup } from '/@/components/Popup';
  import { getProcesspreprintDetail } from '/@/api/productionDeal/dieCutPerPrint';
  import { PrintModal } from '/@/components/CommonModal';
  import { OperationType, STARTWORKSTATUS_OPTIONS, SharePageType } from './const';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  defineOptions({ name: `productionDeal-dieCut-change` });
  const { t } = useI18n();
  interface Props {
    operationType: string;
    pageType: SharePageType;
  }

  const props = withDefaults(defineProps<Props>(), {
    // operationType用来指定生成什么样的模板，流转标签打印和流转标签转换生成的模板是一致的
    operationType: 'PrePrint',
    pageType: SharePageType.Change,
  });

  const { operationType, pageType } = toRefs(props);
  const curOrgId = ref('');

  const [registeraddModal, { openModal: openAddModal }] = useModal();
  const [registerPrintModal, { openModal: openPrintModal }] = useModal();
  // const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.indexOf(inputValue) > -1);
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

  // 查看详情
  function handleDetailFn(data: any = {}): void {
    const templistParams = { operationType, orgId: unref(curOrgId) };
    openDetailModal(true, { data, title: t('component.upload.view'), templistParams });
  }

  // 打开打印弹窗
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

  // 获取打印详情
  async function getProcesspreprintDetailFn(id: string): Promise<void> {
    try {
      const { code, data } = await getProcesspreprintDetail(id);
      if (code === 200) {
        openPrintModalFn(data);
      }
    } catch (error) {}
  }

  // 打印
  async function handlePrintFn(record: any = {}): Promise<void> {
    await getProcesspreprintDetailFn(record.id);
  }

  // function handlePrePrintFn(data: any = {}): void {
  //   const templistParams = { operationType, orgId: unref(curOrgId) };
  //   const title = data.id === undefined ? t('common.printText') : t('component.upload.view');
  //   openAddPopup(true, { data, title, templistParams, pageType: unref(pageType) });
  // }

  // 流转标签转换
  async function handleLabelConversion(data: any = {}): Promise<void> {
    const templistParams = { operationType, orgId: unref(curOrgId) };
    const title = data.id === undefined ? '转换' : t('component.upload.view');
    openAddModal(true, { data, title, templistParams, pageType: 'Change' });
  }

  // const getDataSources = () => {
  //   if (pageType.value === SharePageType.PrePrint) {
  //     return 1;
  //   }
  //   if (pageType.value === SharePageType.Change) {
  //     return 2;
  //   }
  //   return '';
  // };
  const { searchFormSchema, getTableColumns, getTableData } = usePrePrintModel({
    pageType: 'Change',
    operationType: unref(operationType),
    orgId: unref(curOrgId),
  });
  searchFormSchema.forEach((item: any) => {
    item.fieldName = item.field;
    if (item.component === 'DateRange') {
      item.component = 'RangePicker' as any;
    }
  });
  searchFormSchema.unshift({
    fieldName: 'factory',
    label: '',
    i18nField: 'factoryAreaName',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      defaultFirstOption: true,
      allowClear: true,
      onChange: e => {
        curOrgId.value = e;
      },
    },
  });
  const [Grid, { setLoading, reload, setFieldValue, reloadColumn, setGridOptions }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema as any,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-dieCuttingTally',
      columns: [],
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
          dataSources: 2,
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
  async function getColumns() {
    let columns = (await getTableColumns()).map(item => {
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
      if (item.field === 'operatorIdName') {
        item.field = 'operatorName';
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
    columns.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
    });

    return columns || [];
  }
  watch(
    () => [curOrgId.value],
    val => {
      if (val.includes('')) return;
      setGridOptions({ api: getTableData });
      nextTick(() => {
        reload();
      });
    },
  );
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
