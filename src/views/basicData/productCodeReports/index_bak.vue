<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #headerCell="{ column }">
            <div style="cursor: pointer" @dblclick="handleCopyColumn(column)">{{ column.customTitle }}</div>
          </template>
          <template #tableTitle>
            <div class="btn-wrapper">
              <a-button v-auth="'btn_download'" @click="handleExport">导出</a-button>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Status'">
              <a-tag v-if="record.Status == '1'" color="success">生效</a-tag>
              <a-tag v-if="record.Status == '2'" color="error">失效</a-tag>
              <a-tag v-if="record.Status == '3'" color="default">未审核</a-tag>
            </template>
            <template v-if="column.key === 'ImmediateCustomerCode'"> {{ record.ImmediateCustomerName }} ({{ record.ImmediateCustomerCode }}) </template>
            <template v-if="column.key === 'TerminalCustomerCode'"> {{ record.TerminalCustomerName }} ({{ record.TerminalCustomerCode }}) </template>
            <template v-if="column.key === 'ProductLineCode'"> {{ record.ProductLineName }} / {{ record.ProductLineCode }} </template>
            <!-- :disabled="!hasBtnP('btn_detail')" -->

            <template v-if="column.key === 'InsidePartNumber'">
              <a-button :type="hasBtnP('btn_detail') ? 'link' : 'text'" @click="handleSingleClick(record)" @dblclick="handleDoubleClick(record)">{{
                record.InsidePartNumber
              }}</a-button>
            </template>
            <template v-if="column.key === 'CustomerDrawingsName'">
              <a
                @click="
                  () => {
                    if (!hasBtnP('btn_preview')) return;
                    filePreviewRef.init({
                      name: record.CustomerDrawingsName,
                      Id: record.CustomerDrawingsId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                  }
                "
                >{{ record.CustomerDrawingsName }}</a
              >
            </template>
            <template v-if="column.key === 'DesensitizedDrawingsName'">
              <a
                @click="
                  () => {
                    if (!hasBtnP('btn_detail')) return;
                    filePreviewRef.init({
                      name: record.DesensitizedDrawingsName,
                      Id: record.DesensitizedDrawingsId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                  }
                "
                >{{ record.DesensitizedDrawingsName }}</a
              >
            </template>
            <template v-if="column.key === 'MainProcess'">
              <div v-if="record.MainProcess == '1'">模切</div>
              <div v-if="record.MainProcess == '2'">冲压</div>
              <div v-if="record.MainProcess == '3'">CNC</div>
            </template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
  <Detail @register="registerDetail" @reload="reload" />
  <ExportModal @register="registerExportModal" @export="exportAction" />
  <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  <Preview ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRefs } from 'vue';
  import { message } from 'ant-design-vue';
  import {
    deletePartNumberApply,
    exportPartNumberApplyExcel,
    getCustomerList,
    getPartNumberApply,
    getTemplateDownload,
    getTerminalCustomerCodeList,
    importExcel,
    partnumberapplyEnable,
    partnumberapplyReview,
    saveBatchData,
  } from '/@/api/basicData/productCodeApply';
  import { usePopup } from '/@/components/Popup';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { downloadByUrl } from '/@/utils/file/download';
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { cloneDeep } from 'lodash-es';
  import { ImportModal } from '/@/components/ImportModal';
  import Detail from './components/Detail.vue';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'basicData-productCodeApply' });

  const modalRef = ref<ModalComponent | null>(null);
  const projectModalRef = ref<ModalComponent | null>(null);
  const filePreviewRef = ref<ModalComponent | null>(null);

  const [registerDetail, { openPopup: openDetailPopup }] = usePopup();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const state = reactive({
    directCustomerList: [],
    terminalCustomerList: [],
    stateTypes: [],
    Id: '',
    cacheList: [],
    timer: null,
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();

  const columns: BasicColumn[] = [
    { title: '申请单号', dataIndex: 'ApplyCode', width: 150 },
    { title: '产品内部料号', dataIndex: 'InsidePartNumber', width: 220 },
    { title: '内部项目代码', dataIndex: 'InsideProjectCode', width: 140 },
    { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 120 },
    { title: '直接客户项目代码', dataIndex: 'ImmediateCustomerProjectCode', width: 120 },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 120 },
    { title: '终端料号版本', dataIndex: 'TerminalCustomerPartVersion', width: 150 },
    { title: '出货形态', dataIndex: 'ShipPatternName', width: 120 },
    { title: 'Config', dataIndex: 'Config', width: 110 },
    { title: '工厂', dataIndex: 'Factory', width: 110 },
    { title: '产品线代码', dataIndex: 'ProductLineCode', width: 170 },
    { title: '主要制程', dataIndex: 'MainProcess', width: 120 },
    { title: '申请人', dataIndex: 'ApplyUserName', width: 120 },
    { title: '申请部门', dataIndex: 'ApplyDeptName', width: 220 },
    { title: '申请日期', dataIndex: 'ApplyDate', width: 160, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '失效日期', dataIndex: 'ExpiryDate', width: 160, format: 'date|YYYY-MM-DD' },
    { title: '修改日期', dataIndex: 'LastModifyTime', width: 160, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '最后修改人', dataIndex: 'LastModifyUserName', width: 0 },
    { title: '终端项目代码', dataIndex: 'TerminalCustomerProjectCode', width: 150 },
    { title: '产品描述', dataIndex: 'ProductDesc', width: 220 },
    { title: '直接客户料号版本', dataIndex: 'ImmediateCustomerPartVersion', width: 160 },
    { title: '旧版成品编码', dataIndex: 'InsidePartNumberOld', width: 150 },
    { title: '客户原图', dataIndex: 'CustomerDrawingsName', width: 220 },
    { title: '脱敏图纸', dataIndex: 'DesensitizedDrawingsName', width: 220 },
    { title: '预留码', dataIndex: 'ReserveCode', width: 70 },
    { title: '状态', dataIndex: 'Status', width: 120 },
    { title: '备注', dataIndex: 'Remark', width: 120 },
  ];

  const [registerTable, { reload, setLoading, getForm, getFetchParams, getSelectRows, clearSelectedRowKeys, getCacheColumns, getColumns }] = useTable({
    api: getPartNumberApply,
    columns,
    rowKey: 'Id',
    immediate: false,
    useSearchForm: true,
    formConfig: getFormConfig(),
    afterFetch: data => {
      state.cacheList = data;
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      // baseColProps: {
      //   span: 6,
      // },
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: 'ApplyUserName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '申请人',
            submitOnPressEnter: true,
          },
        },
        {
          field: 'InsidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '产品内部料号',
          },
        },
        {
          field: 'TerminalCustomerCode',
          label: '',
          component: 'Input',
          componentProps: {
            // api: getTerminalCustomerCodeList,
            placeholder: '终端客户代码',
            // showSearch: true,
            // apiSearch: {
            //   show: true,
            //   // 搜索字段名
            //   searchName: 'keyword',
            // },
            // immediate: true,
            // resultField: 'data',
            // labelField: 'TerminalCustomerCode',
            // valueField: 'TerminalCustomerCode',
            // filterOption: false,
            // notFoundContent: null,
          },
        },
        {
          field: 'ImmediateCustomerCode',
          label: '',
          component: 'Input',
          componentProps: {
            // api: getCustomerList,
            placeholder: '直接客户信息',
            // showSearch: true,
            // // TerminalCustomerCode
            // apiSearch: {
            //   show: true,
            //   // 搜索字段名
            //   searchName: 'keyword',
            // },
            // labelField: 'name',
            // valueField: 'customerCode',
            // resultField: 'data',
            // filterOption: false,
            // // nameFormat: ['Code', '-', 'Name'],
            // notFoundContent: null,
            // immediate: true,
          },
        },
        // {
        //   field: 'OrgId',
        //   label: '组织',
        //   component: 'Select',
        //   componentProps: {
        //     placeholder: '请选择组织',
        //   },
        // },
        {
          field: 'Status',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: '状态',
          },
        },
        {
          field: 'ImmediateCustomerPartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '直接客户料号',
          },
        },
        {
          field: 'TerminalCustomerPartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '终端客户料号',
          },
        },
        {
          field: 'ProductDesc',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '产品描述',
          },
        },
        {
          field: 'InsideProjectCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '内部项目代码',
          },
        },
        {
          field: 'ApplyCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '申请单号',
          },
        },
        {
          field: 'Factory',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '工厂',
          },
        },
      ],
    };
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleRuleEdit.bind(null, {
          ...record,
          cacheList: state.cacheList,
        }),
      },
    ];
  }

  async function onDelete(Id) {
    const { code } = await deletePartNumberApply(Id);
    if (code === 200) {
      message.success('操作成功');
      reload();
    }
  }

  function handleSingleClick(record) {
    if (state.timer !== null) {
      clearTimeout(state.timer);
      state.timer = null;
      // return;
    }
    state.timer = setTimeout(() => {
      console.log('单击');
      handleRuleEdit({ ...record, cacheList: state.cacheList });
    }, 250);
  }

  function handleCopyColumn(column) {
    let copyList;
    const rows = getSelectRows();
    if (rows.length === 0) {
      copyList = state.cacheList;
    } else {
      copyList = rows;
    }
    if (column.flag) {
      // console.log();
      const columns = getColumns();
      const columnOrder = columns.map(col => {
        if (!col.flag) {
          return col.dataIndex;
        }
        return '';
      });
      let str = '';
      copyList.map(row => {
        let line;
        line = columnOrder
          .map(column => {
            if (column) {
              return row[column] || '';
            }
          })
          .join('\t');
        if (line) {
          str = line + '\n' + str;
        }
      });
      copyTextToClipboard(str);
      return;
    }
    const dataIndex = column.dataIndex;
    const customTitle = column.customTitle;
    const copyStr = copyList.map(item => item[dataIndex]).join('\n');
    copyTextToClipboard(copyStr);
    message.success(`复制${customTitle}成功`);
  }

  function handleDoubleClick(record) {
    clearTimeout(state.timer);
    state.timer = null;
    copyTextToClipboard(record.InsidePartNumber);
    message.success('复制成功');
  }

  function exportAction(query) {
    exportPartNumberApplyExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importExcel,
      importSaveApi: saveBatchData,
      templateApi: getTemplateDownload,
      previewColumn: columns,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  function initData(isInit = false) {
    if (isInit) setLoading(true);
    if (isInit) reload({ page: 1 });
    getTypeOptions();
  }

  async function getTypeOptions() {
    // 直接客户选择
    // const { data: ImmediateRs } = await getImmediateCustomerCodeList();
    // 终端客户选择
    // const { data: TerminalRs } = await getTerminalCustomerCodeList();
    // getForm().updateSchema({
    //   field: 'TerminalCustomerCode',
    //   componentProps: {
    //     options: TerminalRs.map(item => ({
    //       id: item.TerminalCustomerCode,
    //       fullName: item.TerminalCustomerCode,
    //     })),
    //   },
    // });
    // 组织分类
    const orgRs = await baseStore.getDictionaryData('OrganizeType');
    getForm().updateSchema({
      field: 'OrgId',
      componentProps: {
        options: orgRs,
        fieldNames: { value: 'encode' },
      },
    });

    const statusTypes = await baseStore.getDictionaryData('PartNumberApplyStatus');
    state.stateTypes = statusTypes;
    getForm().updateSchema({
      field: 'Status',
      componentProps: {
        options: statusTypes,
        fieldNames: { value: 'enCode' },
      },
    });
  }

  function handleUploadAction(record) {
    state.Id = record.Id;
    openUpload(true, {
      Id: record.Id,
    });
    // if (record.type === 'project') {
    //   return projectModalRef.value.setVisible(true);
    // }
    // const modalVal = modalRef.value!;
    // modalVal.setVisible(true);
  }

  const handleRuleEdit = (record: any) => {
    // console.log(record);
    openDetailPopup(true, record);
  };

  const handleSingleApply = () => {
    // console.log('单个申请');
    openApplyPop(true, {});
  };
  const handleExport = () => {
    const exportColumns = cloneDeep(columns);
    const index = exportColumns.findIndex(item => item.dataIndex === 'DesensitizedDrawingsName');
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  };
  function handleBatchEnable() {
    // 批量启用
    const selectRows = getSelectRows();
    if (selectRows.length === 0) return message.error('请选择要启用的数据');

    let p1, p2;
    // 1 生效 2 失效 3 审核
    const enableList = [];
    const reviewList = [];

    selectRows.forEach(item => {
      if (item.Status == 2) {
        enableList.push(item.Id);
      } else if (item.Status == 3) {
        reviewList.push(item.Id);
      }
    });

    if (enableList.length !== 0) {
      p1 = partnumberapplyEnable(enableList);
    }
    if (reviewList.length !== 0) {
      p2 = partnumberapplyReview(reviewList);
    }

    Promise.all([p1, p2]).then(res => {
      clearSelectedRowKeys();
      reload();
    });
  }
  onMounted(() => {
    initData(true);
  });
  const { directCustomerList, terminalCustomerList } = toRefs(state);
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
