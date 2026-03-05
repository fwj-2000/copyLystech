<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <div class="nodata-block" v-show="!hasTableData">
          <img :src="nodata" />
          <a-button type="primary" @click="handleAddFn" v-auth="'btn_add'">{{ t('common.scanText') }}</a-button>
        </div>
        <Grid v-show="hasTableData">
          <template #toolbar-actions>
            <a-button type="primary" @click="handleAddFn" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
            <a-button type="primary" @click="handleAddSNFn" v-if="operationType === 'ApplyWork'" v-auth="'btn_singleProductReport'">{{
              t('dict.CommonCol.singleProductReport')
            }}</a-button>
          </template>
          <template #Status="{ rowIndex, row }">
            <LydcTag :theme="TRANSFERSTATUS_OPTIONS[row['labelStatus']]?.theme" :text="row['labelStatusName']"></LydcTag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <addModal @register="registeraddModal" @refresh="reload" />
    <addSNModal @register="registeraddSNModal" @refresh="reload" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, watch, unref, computed, nextTick } from 'vue';
  import { ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import addModal from './components/addModal.vue';
  import addSNModal from './components/addSNModal.vue';
  import { useTallyModel } from './hooks/useTallyModel';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import nodata from '/@/assets/images/process/nodata.png';
  import { TRANSFERSTATUS_OPTIONS } from './hooks/config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { alllistbyfactory } from '/@/api/engineering/mould';

  defineOptions({ name: `productionDeal-dieCut-dieCuttingTally` });
  const props = defineProps({
    operationType: { type: String, default: 'ApplyWork' },
  });
  const tableColumns: any = ref([]);
  const curWorkType: any = ref('');
  const curOrgId = ref('');

  const { operationType } = props;

  const [registeraddModal, { openModal: openaddModal }] = useModal();
  const [registeraddSNModal, { openModal: openaddSNModal }] = useModal();

  const { t } = useI18n();
  const { searchFormSchema, getTableColumns, getTableData } = useTallyModel({ workType: unref(curWorkType), operationType, orgId: unref(curOrgId) });
  searchFormSchema.unshift({
    field: 'factory',
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
  searchFormSchema.forEach((item: any) => {
    item.fieldName = item.field;
    if (item.component === 'DateRange') {
      item.component = 'RangePicker' as any;
    }
  });
  const [Grid, { reload, setFieldValue, reloadColumn, setGridOptions, updateSchema }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      // showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema as any,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-dieCuttingTally',
      columns: [],
      // api: getTableData,
      showIndexColumn: true,
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      pagerConfig: {
        layouts: ['Home', 'PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'End', 'Sizes', 'Total'],
      },
      beforeFetch: params => {
        const _params = {
          ...params,
          factory: curOrgId.value,
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
  const hasTableData = computed(() => {
    return tableColumns.value.length;
  });

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.indexOf(inputValue) > -1);
  };

  function handleWorkTypeChange(e) {
    if (!e) return localStorage.setItem('workType', '');
    localStorage.setItem('workType', e);
  }

  function handleWorkTypeOptionsChange(options) {
    const workType = localStorage.getItem('workType');
    if (!workType) {
      curWorkType.value = options[0].value;
    }
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        // label: '查看详情',
        icon: 'icon-ym icon-ym-view',
        onClick: () => handleAddFn(record),
        // auth: 'btn_detail',
      },
    ];
  }
  function handleAddFn(data: any = {}) {
    const templistParams = { processName: unref(curWorkType), operationType, orgId: unref(curOrgId) };
    const addText = operationType === 'Exchange' ? t('dict.CommonCol.dddNewCirculation') : t('dict.CommonCol.newReportQuantity');
    openaddModal(true, { data, title: data.id ? t('component.upload.view') : addText, templistParams });
  }

  function handleAddSNFn(data) {
    const templistParams = { processName: unref(curWorkType), operationType, orgId: unref(curOrgId) };
    openaddSNModal(true, { data, templistParams });
  }

  async function getColumns() {
    let columns = (await getTableColumns({ operationType, orgId: unref(curOrgId) })).map(item => {
      return {
        ...item,
        field: item.dataIndex,
      };
    });

    columns.forEach(item => {
      if (['DictType', 'ApiType', 'Personnel', 'Organize'].includes(procRuleTempEnum[item.dataType])) {
        item.field = item.field + 'Name';
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

  async function setFormProcessOptions(options) {
    updateSchema([
      {
        fieldName: 'processName',
        componentProps: {
          options,
        },
      },
    ]);
    setFieldValue('processName', null);
  }

  watch(
    () => [curOrgId.value],
    async val => {
      if (!val) return;
      if (val.includes('')) return;

      setGridOptions({ api: getTableData });
      const res = await alllistbyfactory({ factoryArea: val[0] });
      nextTick(async () => {
        await reloadTable();
        setFormProcessOptions(res.data);
      });
    },
  );
  const reloadTable = async () => {
    const columns = await getColumns(); // 获取表格列
    tableColumns.value = columns.map(item => {
      return {
        ...item,
        width: 150,
      };
    });
    reloadColumn(tableColumns.value);
    reload();
  };
  onMounted(() => {
    // reloadTable();
  });
</script>

<style lang="less" scoped>
  // .lydc-content-wrapper {
  //   &-select {
  //     background: #fff;
  //     display: flex;
  //     align-items: flex-start;
  //     padding: 16px 0 0 12px;
  //     height: 60px;
  //     border: 1px solid #f0f0f0;
  //   }
  // }

  // :deep(.process-select .ant-select-selection-item) {
  //   color: #000;
  //   font-weight: bolder !important;
  //   font-size: 14px;
  // }

  .nodata-block {
    background: #fff;
    height: 100%;
    margin-top: -100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 233px;
      height: 252px;
    }
  }
</style>
