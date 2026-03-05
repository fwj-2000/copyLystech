<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable" :searchInfo="{ ...state.searchInfo, menuId: getMenuId(route) }">
          <template #tableTitle>
            <a-button type="primary" @click="apply()" v-auth="'btn_review'">{{ t('common.review') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <GenerateProducePop @register="registerGeneratePop" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, nextTick, onMounted, h } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, BasicColumn, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText, getMenuId } from '/@/utils';
  import GenerateProducePop from './components/GenerateProduce.vue';
  import { getEngineerInfoReviewList } from '/@/api/engineering/review';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PRODUCTION_TYPE_LIST, REVIEW_STATUS_OPTIONS } from './config';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  defineOptions({ name: 'engine-data-produce' });
  const { createMessage } = useMessage();

  interface State {
    activeKey: string;
    keyword: string;
    startTime: number;
    endTime: number;
    industryTypeList: any[];
    visible: Boolean;
    detailData: any;
    searchInfo: any;
  }

  const state = reactive<State>({
    activeKey: '1',
    keyword: '',
    startTime: 0,
    endTime: 0,
    industryTypeList: [],
    visible: false,
    detailData: {},
    searchInfo: {},
  });

  const { t } = useI18n();
  const [registerForm] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    labelAlign: 'left',
    labelWidth: 70,
    // actionColOptions: {
    //   span: 12,
    // },
    schemas: [
      {
        field: 'ApplyNo',
        label: '',
        component: 'Input',
        labelWidth: 100,
        componentProps: { placeholder: '量试单号', maxlength: 50 },
        rules: [
          // { required: true, trigger: 'blur', message: '必填' },
          // { validator: formValidate('enCode'), trigger: 'blur' },
        ],
      },
      {
        field: 'InnerMaterialNumber',
        label: '',
        component: 'Input',
        componentProps: { placeholder: '产品内部料号', maxlength: 50 },
        rules: [
          // { required: true, trigger: 'blur', message: '必填' },
          // { validator: formValidate('enCode'), trigger: 'blur' },
        ],
      },
      {
        field: 'TerminalCustomerCode',
        label: '',
        // label: t('views.dashboard.production.manaulYield.factory'),
        component: 'Input',
        componentProps: {
          placeholder: '终端客户代码',
        },
      },
      {
        field: 'TerminalCustomerProjectCode',
        label: '',
        // label: t('views.dashboard.production.manaulYield.factory'),
        component: 'Input',
        componentProps: {
          placeholder: '终端项目代码',
        },
      },
      {
        field: 'pickerVal',
        label: '',
        labelWidth: 100,
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: ['开始日期', '结束日期'],
        },
      },
    ],
    fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
  });

  const columns: BasicColumn[] = [
    { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', sorter: true, width: 240 },
    { title: '量试单号', dataIndex: 'ApplyNo', key: 'ApplyNo', width: 160, sorter: true },
    {
      title: '状态',
      dataIndex: 'MakeReviewStatus',
      sorter: true,
      width: 100,
      ellipsis: true,
      customRender: ({ record }) => {
        const tempObj = REVIEW_STATUS_OPTIONS.filter(o => o.id === record.MakeReviewStatus) || [];
        const color = tempObj.length > 0 ? tempObj[0].color : REVIEW_STATUS_OPTIONS[0].color;
        return h('span', { style: { color } }, tempObj.length > 0 ? tempObj[0].fullName : '-');
      },
    },
    { title: '工厂', dataIndex: 'Factory', key: 'Factory', width: 160, sorter: true },
    { title: '量试数量(pcs)', dataIndex: 'PeakQty', key: 'PeakQty', width: 160, sorter: true },
    {
      title: '生产类型',
      dataIndex: 'ProductionType',
      sorter: true,
      width: 100,
      ellipsis: true,
      customRender: ({ record }) => {
        const tempObj = PRODUCTION_TYPE_LIST.filter(o => `${o.id}` == record.ProductionType) || [];
        return tempObj.length ? tempObj[0].fullName : '';
      },
    },
    { title: '交期时间', dataIndex: 'DeliveryTime', key: 'DeliveryTime', width: 140, sorter: true },
    { title: '客户要求交期', dataIndex: 'CustomerDeliveryTime', key: 'CustomerDeliveryTime', width: 140, sorter: true },
    { title: '客户要求', dataIndex: 'CustomerRequestDesc', key: 'CustomerRequestDesc', width: 300, sorter: true },
    // {
    //   title: 'PCC类型', dataIndex: 'projectCode', sorter: true, width: 100, ellipsis: true,
    //   customRender: ({ index }) => {
    //     const tempObj = pccOptions.filter(o => o.id == `${index}`.slice(0, 1)) || [];
    //     const color = tempObj.length > 0 ? tempObj[0].color : '#B2B2B2';
    //     return h('span', { style: { color } }, tempObj.length > 0 ? tempObj[0].fullName : pccOptions[0].fullName);
    //   }
    // },
    { title: '脱敏图纸', dataIndex: 'DesensitizedDrawingsName', key: 'DesensitizedDrawingsName', width: 300, sorter: true },
    { title: '终端客户代码', dataIndex: 'TerminalCustomerCode', key: 'TerminalCustomerCode', width: 160, sorter: true },
    { title: '终端项目代码', dataIndex: 'TerminalCustomerProjectCode', key: 'TerminalCustomerProjectCode', width: 160, sorter: true },
    { title: '终端项目阶段', dataIndex: 'ProjectPhase', key: 'ProjectPhase', width: 160, sorter: true },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', key: 'TerminalCustomerPartNumber', width: 160, sorter: true },
    { title: '当前处理人', dataIndex: 'CurrentProcessor', width: 160, sorter: true },
    { title: '申请人', dataIndex: 'ApplyUserName', key: 'ApplyUserName', width: 160 },
    { title: 'PM备注', dataIndex: 'PMDesc', key: 'PMDesc', width: 200 },
  ];
  const [registerTable, { reload, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    api: getEngineerInfoReviewList,
    columns,
    useSearchForm: false,
    // showTableSetting: true,
    // bordered: true,
    // pagination: false,
    striped: true,
    ellipsis: true,
    rowKey: 'Id',
    tableSetting: {
      redo: false,
      // expand: true,
      // size: true,
      // setting: true,
      // fullScreen: true,
    },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
    },
    // showIndexColumn: false,
    // rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
    // isCanResizeParent: true,
    // canResize: true,
    pagination: {
      pageSize: 100,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  const [registerGeneratePop, { openPopup: openGeneratePopup }] = usePopup();

  function apply() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(' 请选择要审核的资料');
    openGeneratePopup(true, { ids: idList, title: '工程资料评审', type: 'review' });
  }
  function handleDetail(id) {
    console.log(id, 'id');
    openGeneratePopup(true, { ids: [id], title: '工程资料详情', type: 'view' });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        // label: t('common.editText'),
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.Id),
        auth: 'btn_detail',
      },
    ];
  }
  function handleSubmit(values) {
    state.searchInfo = {
      ...values,
    };
    handleSearch();
  }
  function handleReset() {
    state.searchInfo = {};
    clearSelectedRowKeys();
    handleSearch();
  }
  function handleSearch() {
    nextTick(() => {
      reload();
      console.log('handleSearch');
    });
  }
  onMounted(() => {
    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
