<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
              <a-button @click="batchExportFn">{{ t('common.batchExport') }}</a-button>
              <a-button type="error" @click="batchDeleteFn">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
        </Grid>
      </div>
    </div>
    <AddPop @register="registerAddPop" @refresh="reload" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { reactive, nextTick, onMounted, h, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { getQuantitationApplyListLine, getNodelist, batchDelQuantitationApplyByIds, exportTableData } from '/@/api/business/quantitation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import AddPop from './components/AddPop.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, columnsVxe, subColumns, schemas } from './config';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';
  // import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  // import { CopyOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'qms-IntelligentBitler-abnormalMsgConfig' });

  const { hasBtnP } = usePermission();

  const route = useRoute();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  interface State {
    ApplyNo: string;
    InnerMaterialNumber: string | number;
    CurrentProcessor: string;
    Status: string;
    StartTime: string;
    EndTime: string;
    industryTypeList: any[];
    visible: boolean;
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

  const [registerForm] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    // i18nConfig: {
    //   moduleCode: 'QuantitativeApplyColumn',
    //   transferRange: ['placeholder'],
    // },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-IntelligentBitler-abnormalMsgConfig-list',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getQuantitationApplyListLine,
      beforeFetch: params => {
        return {
          ...params,
          ...state.searchInfo,
        };
      },
      // i18nConfig: {
      //   moduleCode: 'QuantitativeApplyColumn',
      // },
    },
  });
  const { getSelectRowKeys, reload, getSelectRows, clearSelectedRowKeys, getFetchParams } = gridApi;

  function addOrUpdateHandle(id = '') {
    openAddPop(true, { id, title: t('common.add'), isDevPlatform: false });
  }

  const batchExportFn = async () => {
    openExportModal(true, {
      api: exportTableData,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns.concat(subColumns),
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
      },
    });
  };
  function goDetail(id = '') {
    openAddPop(true, { id, title: t('common.editText'), type: 'view' });
  }
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record.applyNo),
        auth: 'btn_detail',
      },
    ];
  }
  function batchDeleteFn() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    } else {
      try {
        batchDelQuantitationApplyByIds(idList).then(res => {
          createMessage.success(res.msg);
          reload();
        });
      } catch (e) {
        console.log(e);
        reload();
      }
    }
  }
  function handleSubmit(values) {
    state.searchInfo = {
      ...values,
      // StartTime: values?.StartTime ? dateUtil(values?.StartTime).format('YYYY-MM-DD') : '',
      // EndTime: values?.EndTime ? dateUtil(values?.EndTime).format('YYYY-MM-DD') : '',
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

  // function handleExpand() {
  //   expandAll.value = !expandAll.value;
  //   console.log(expandAll.value);
  //   // if (expandAll.value) {
  //   //   generalWidthOptions;
  //   // }
  // }
  onMounted(() => {
    const { id } = route.query as any;
    reload();
    if (id) {
      goDetail(id);
    }
  });
</script>
