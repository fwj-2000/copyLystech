<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable" :searchInfo="{ ...state.searchInfo, menuId: getMenuId(route) }">
          <template #expandedRowRender="{ record }">
            <div class="sub-table">
              <BasicTable @register="registerSubTable" :dataSource="record.ItemList"> </BasicTable>
            </div>
          </template>
        </BasicTable>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <!-- <ApplyPop @register="registerApplyPop" @refresh="reload" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { basicProps } from './props';
  import { reactive, nextTick, onMounted, h } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, TableAction, useTable, ActionItem, FormSchema } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import dayjs from 'dayjs';
  import { columns, subColumns } from './config';
  import { useRoute } from 'vue-router';
  import { page, getItemlist } from '/@/api/productionDeal/ProcessRetrospectReverseReport';
  import { useBaseStore } from '/@/store/modules/base';
  import { formatTableDefaultText, getMenuId } from '/@/utils';
  // import ApplyPop from './components/ApplyPopupVxe.vue';
  import { useModal } from '/@/components/Modal';

  const route = useRoute();
  const { t } = useI18n();

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  defineOptions({ name: 'business-quantitation-requirement' });
  defineProps({ ...basicProps });

  // const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();

  interface State {
    ApplyNo: string;
    InnerMaterialNumber: string | number;
    CurrentProcessor: string;
    Status: string;
    StartTime: string;
    EndTime: string;
    industryTypeList: any[];
    visible: Boolean;
    detailData: any;
    searchInfo: any;
  }

  const state = reactive<State>({
    ApplyNo: '',
    InnerMaterialNumber: '',
    CurrentProcessor: '',
    Status: '',
    StartTime: '',
    EndTime: '',
    industryTypeList: [],
    visible: false,
    detailData: {},
    searchInfo: {},
  });

  // const baseStore = useBaseStore();
  const [registerForm] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    // labelAlign: 'left',
    // labelWidth: 70,
    actionColOptions: {
      span: 4,
    },
    schemas: [
      // {
      //   field: 'BatchNo',
      //   label: '',
      //   component: 'Input',
      //   labelWidth: 100,
      //   componentProps: { placeholder: '生产批次号', maxlength: 50 },
      // },
      // {
      //   field: 'ProductCode',
      //   label: '',
      //   component: 'Input',
      //   componentProps: { placeholder: '物料编号', maxlength: 50 },
      // },
      {
        field: 'RawMaterialBatchNo',
        label: '',
        component: 'Input',
        componentProps: { placeholder: '原材料批次号', maxlength: 50 },
      },
      {
        field: 'WorkOrderNo',
        label: '',
        component: 'Input',
        componentProps: { placeholder: '工单编号', maxlength: 50 },
      },
    ],
    i18nConfig: {
      moduleCode: 'processRetrospectReport',
      transferRange: ['placeholder'],
    },
  });

  const [registerTable, { reload, getFetchParams, clearSelectedRowKeys, getSelectRowKeys, getSelectRows }] = useTable({
    api: page,
    columns,
    useSearchForm: false,
    rowKey: 'BatchNo',
    immediate: false,
    striped: true,
    ellipsis: true,
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
    indexColumnProps: {
      flag: 'INDEX',
    },
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 100,
    },
    defaultExpandAllRows: false,
    i18nConfig: {
      moduleCode: 'processRetrospectReport',
    },
  });
  const [registerSubTable] = useTable({
    columns: subColumns,
    useSearchForm: false,
    rowKey: 'id',
    immediate: false,
    striped: true,
    ellipsis: true,
    showTableSetting: false,
    canResize: false,
    pagination: false,
    showIndexColumn: false,
    i18nConfig: {
      moduleCode: 'processRetrospectReport',
    },
  });

  function handleSubmit(values) {
    state.searchInfo = {
      ...values,
      StartTime: values?.StartTime ? dayjs(values?.StartTime).format('YYYY-MM-DD') : '',
      EndTime: values?.EndTime ? dayjs(values?.EndTime).format('YYYY-MM-DD') : '',
    };
    handleSearch();
  }
  function handleReset() {
    state.searchInfo = {};
    clearSelectedRowKeys();
    handleSearch();
  }
  function handleSearch() {
    clearSelectedRowKeys();
    nextTick(() => {
      reload();
    });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.ant-table-expanded-row-fixed) {
    width: auto !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .sub-table {
    :deep(.ant-table) {
      padding: 0 !important;
    }
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
