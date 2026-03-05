<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle" v-if="hasBtnP('btn_add')">{{ t('common.add') }}</a-button>
              <a-button type="primary" ghost @click="handleFrozen" v-if="hasBtnP('btn_frozen')">{{ t('dict.Flow.NodeAction.5') }}</a-button>
              <a-button type="primary" ghost @click="handleThaw" v-if="hasBtnP('btn_thaw')">{{ t('dict.Flow.NodeAction.6') }}</a-button>
              <a-button type="primary" ghost @click="handleStop" v-if="hasBtnP('btn_stop')">{{ t('dict.prOrderStatus.7') }}</a-button>
              <a-button @click="handleDeleteList()" v-if="hasBtnP('btn_batchRemove')">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #top>
            <div class="routeFrozenTip" v-if="showRouteFrozenTip">
              <div class="tip">{{ t('dict.ProcessRouteColumn.routeFrozenTip') }}</div>
              <i class="icon icon-ym icon-ym-fail" @click="closeRouteFrozenTip" />
            </div>
          </template>
          <!-- <template #insidePartNumber="{ row }">
            {{ row.processRouteType === 2 ? row.lineName : row.material }}
          </template> -->
          <template #action="{ row }">
            <!--  :dropDownActions="getDropDownActions(row)" -->
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <AddPopup @register="registerAddPop" @refresh="reload" />
    <AddProcessBindPopup @register="registerProcessBind" @refresh="reload"></AddProcessBindPopup>
    <DetailsPopup @register="registerDetailsPop"></DetailsPopup>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import AddProcessBindPopup from '/@/views/productionPlan/processBind/components/processMaintenance/addPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, h, ref } from 'vue';
  import { message, Input } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import AddPopup from './components/addPopup.vue';
  import DetailsPopup from './components/detailsPopup.vue';
  import {
    getProcessroutebindList,
    deleteProcessroutebind,
    muliteDeleteProcessroutebind,
    thawProcessroutebind,
    frozenProcessroutebind,
    stopProcessroutebind,
    isexistfrozenroute,
  } from '/@/api/productionDeal/processroutebind';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { readJSON } from 'fs-extra';

  const { hasBtnP } = usePermission();

  defineOptions({ name: 'productionPlan-processBind' });

  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerDetailsPop, { openPopup: openDetailsPop }] = usePopup();
  const [registerProcessBind, { openPopup: openProcessBind }] = usePopup();

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    routeTypeList: any[];
    sourceTypeOptions: { id: number; fullName: string }[];
  }

  const showRouteFrozenTip = ref(false);

  const state = reactive<State>({
    routeTypeList: [],
    sourceTypeOptions: [
      { id: 1, fullName: t('common.add2Text') },
      { id: 2, fullName: t('dict.CommonCol.platform') },
    ],
  });
  const STATUS_OPTIONS = [
    { id: 0, theme: 'gray', rowKey: 'statusName' },
    { id: 1, fullName: t('dict.processRouteBindStatus.1'), theme: 'green', rowKey: 'statusName' },
    { id: 2, fullName: t('dict.processRouteBindStatus.2'), theme: 'red', rowKey: 'statusName' },
    { id: 3, fullName: t('dict.processRouteBindStatus.3'), theme: 'blue', rowKey: 'statusName' },
  ];
  const column = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '来源',
      field: 'routeSourceType',
      width: 100,
      formatter: ({ cellValue }) => {
        const option = state.sourceTypeOptions.find(el => el.id === cellValue);
        return option ? option.fullName : '';
      },
      i18nField: 'CommonCol.sourceTypeName',
    },
    { title: '工艺路线类型', field: 'processRouteTypeName', minWidth: 130 },
    {
      title: '厂内模号',
      field: 'factoryMoldNo',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 100,
    },
    {
      title: '内部料号',
      field: 'material',
      i18nField: 'CommonCol.innerMaterialNumber',
      width: 190,
      formatter: ({ row }) => (row.processRouteType === 2 ? row.lineName : row.material),
    },
    { title: '工艺路线编码', field: 'routeCode', width: 130 },
    { title: '工艺路线名称', field: 'routeName', width: 130 },
    {
      title: '状态',
      field: 'status',
      i18nField: 'CommonCol.status',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('processRouteBindStatus'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
        },
      },
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    { title: '版本', field: 'version', width: 80 },
    { title: '创建人', field: 'creatorUserName', width: 180 },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
      width: 140,
    },
    { title: '修改人', field: 'lastModifyUserName', width: 180 },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: 140,
    },
    { title: '备注', field: 'remark' },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 60, fixed: 'right' },
  ];

  function getVxeSchema() {
    return [
      {
        fieldName: 'routeCode',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入工艺路线编码',
        },
        colProps: { span: 5 },
      },
      {
        fieldName: 'routeName',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入工艺路线名称',
        },
        colProps: { span: 5 },
      },
      {
        fieldName: 'processRouteType',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('ProcessRoute.RouteType'),
          placeholder: '请选择',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 5,
        },
      },
      {
        fieldName: 'material',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '内部料号',
        },
        i18nField: 'innerMaterialNumber',
        colProps: { span: 5 },
      },
    ];
  }

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
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-processBind-list',
      columns: column,
      api: getProcessroutebindList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys, updateSchema, getFromValue, query } = gridApi;

  // const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
  //   api: getProcessroutebindList,
  //   title: '',
  //   columns,
  //   rowKey: 'id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     autoAdvancedLine: 0, //自动展开行
  //     showAdvancedButton: false,
  //     showResetButton: false,
  //     baseColProps: { span: 5 },
  //     actionColOptions: {
  //       span: 5,
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: false, //刷新按钮,默认打开
  //   bordered: true, //显示表格边框
  //   showIndexColumn: false, //显示序号
  //   pagination: {
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 120,
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ProcessRouteColumn',
  //   },
  // });

  const reason: any = ref(''); // 用于绑定输入框的值

  // function getDropDownActions(record): ActionItem[] {
  //   return [
  //     {
  //       label: t('dict.Flow.NodeAction.5'),
  //       modelConfirm: {
  //         title: t('common.tipTitle'),
  //         // content: '是否确定要冻结，冻结后工序不能流转',
  //         content: h('div', [
  //           h('p', t('common.isfreezeProcess')),
  //           h(Input, {
  //             placeholder: t('common.reasonInput'),
  //             VModel: reason.value,
  //             onChange: e => (reason.value = e.target.value),
  //           }),
  //         ]),
  //         onOk: handleFrozen.bind(null, record),
  //       },
  //     },
  //     {
  //       label: t('dict.Flow.NodeAction.6'),
  //       modelConfirm: {
  //         title: t('common.tipTitle'),
  //         content: t('common.isFreeProcess'),
  //         onOk: handleThaw.bind(null, record),
  //       },
  //     },
  //     {
  //       label: t('dict.prOrderStatus.7'),
  //       modelConfirm: {
  //         title: t('common.tipTitle'),
  //         // content: '是否确定终止，终止后将不能使用该工艺路线',
  //         content: h('div', [
  //           h('p', t('common.isStopProcessRoute')),
  //           h(Input, {
  //             placeholder: t('common.reasonInput'),
  //             VModel: reason.value,
  //             onChange: e => (reason.value = e.target.value),
  //           }),
  //         ]),
  //         onOk: handleStop.bind(null, record),
  //       },
  //     },
  //     {
  //       label: t('dict.ProgressStatusEnum.8'),
  //       // icon: 'icon-ym icon-ym-delete',
  //       modelConfirm: {
  //         title: t('common.delText'),
  //         content: t('common.delTip'),
  //         onOk: handleDelete.bind(null, record),
  //       },
  //       auth: 'btn_remove',
  //     },
  //   ];
  // }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: setProcess.bind(null, record.id),
        auth: 'btn_preview',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  function setProcess(id = '') {
    openDetailsPop(true, { id, title: t('common.viewDetails') });
  }

  function closeRouteFrozenTip() {
    showRouteFrozenTip.value = false;
    query();
  }
  //新增或者修改
  function addOrUpdateHandle(data: any) {
    if (data.routeSourceType === 2) {
      // 工艺路线绑定-可修改工艺路线
      const { id, material, processRouteType, partRelationId } = data;

      openProcessBind(true, {
        data: { id, processRouteType, material, partRelationId },
        title: t('common.editText'),
        from: 'generate',
      });
    } else {
      // 工艺路线绑定
      openAddPop(true, { data, title: data?.id ? t('common.editText') : t('common.addText') });
    }
  }

  function handleThaw() {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.isFreeProcess'),
      onOk: async () => {
        thawProcessroutebind({ ids }).then(res => {
          createMessage.success(res.msg);
          reload();
        });
      },
    });
  }
  function handleFrozen() {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: h('div', [
        h('p', t('common.isfreezeProcess')),
        h(Input, {
          placeholder: t('common.reasonInput'),
          VModel: reason.value,
          onChange: e => (reason.value = e.target.value),
        }),
      ]),
      onOk: async () => {
        frozenProcessroutebind({ ids, reason: reason.value }).then(res => {
          createMessage.success(res.msg);
          reason.value = '';
          reload();
        });
      },
    });
  }
  function handleStop() {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: h('div', [
        h('p', t('common.isStopProcessRoute')),
        h(Input, {
          placeholder: t('common.reasonInput'),
          VModel: reason.value,
          onChange: e => (reason.value = e.target.value),
        }),
      ]),
      onOk: async () => {
        stopProcessroutebind({ ids, reason: reason.value }).then(res => {
          createMessage.success(res.msg);
          reason.value = '';
          reload();
        });
      },
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessroutebind(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  function handleAddFn(id) {
    if (id) {
      setProcess(id);
    }
    // reload();
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDataToDelete'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await muliteDeleteProcessroutebind(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  const handleViewFlow = record => {
    // console.log(record, 'record');
    // openFlowModal(true, {
    //   title: t('common.add'),
    //   flowId: record.id,
    //   flowApi: getRouteDetail,
    // });
  };

  const getIsexistfrozenroute = async () => {
    const { data } = await isexistfrozenroute();
    if (data) {
      showRouteFrozenTip.value = true;
    }
  };

  onMounted(async () => {
    const process = (await baseStore.getDictionaryData('ProcessRoute.RouteType')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.routeTypeList = optionsProcess;
    updateSchema([
      {
        fieldName: 'routeType',
        componentProps: {
          options: optionsProcess,
        },
      },
    ]);
    getIsexistfrozenroute();
    // getFrom.setProps({
    //   submitButtonOptions: {
    //     text: t('common.searchText'),
    //   },
    // });
  });
</script>
<style scoped lang="less">
  .routeFrozenTip {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background: #fff1f0;
    border: 1px solid #ffa39e;

    .tip {
      flex: 1;
      font-size: 13px;
    }

    .icon {
      font-size: 12px;
      cursor: pointer;
    }
  }
</style>
