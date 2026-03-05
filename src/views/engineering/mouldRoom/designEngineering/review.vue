<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
          <template #tableTitle>
            <a-button v-auth="'btn_maintenanceWorkOrder'" type="primary" @click="openWorkOrderModal" v-if="searchKey === '0'">{{
              t('dict.CommonCol.maintainWorkOrderNo')
            }}</a-button>
            <vShowDropdown v-if="searchKey === '0'">
              <template #overlay>
                <button v-auth="'btn_createBOM'" @click="openCreateBOMModal">{{ t('dict.CommonCol.addBOM') }}</button>
                <button v-auth="'btn_upload'" @click="batchImportOrExport({ key: 'import' })">{{ t('dict.CommonCol.ImportBOM') }} </button>
              </template>
              <a-button type="primary" ghost>{{ t('dict.CommonCol.addOrImportBOM') }} </a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleUpload" v-if="searchKey === '0'">{{ t('common.uploadDrawingText') }}</a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleSpecialUpload" v-if="searchKey === '0'">{{
              t('dict.CommonCol.uploadSpecial')
            }}</a-button>
            <a-button v-auth="'btn_outsource'" type="primary" ghost @click="openOutsourceModal" v-if="searchKey === '0'">{{
              t('dict.CommonCol.outsource')
            }}</a-button>
            <a-button v-auth="'btn_reissue'" type="primary" @click="handleCanceldesignissue" v-if="searchKey === '1'">{{
              t('dict.CommonCol.reissue')
            }}</a-button>
            <a-button v-auth="'btn_stop'" type="primary" ghost @click="handleStop" v-if="searchKey === '1' && type === 'newMold'">{{
              t('common.stopText')
            }}</a-button>
            <!-- <a-button @click="handleExport()">{{ t('common.batchExport') }}</a-button> -->
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'drawing3dFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'drawing3dName', 'drawing3dUrl', t('dict.CommonCol.drawing3d'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'drawing2dFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'drawing2dName', 'drawing2dUrl', t('dict.CommonCol.drawing2d'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>

            <template v-if="column.dataIndex === 'attachmentFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'attachmentName', 'attachmentUrl', t('common.attachment'))">{{
                t('common.viewDetails')
              }}</div>
            </template>
            <template v-if="column.dataIndex === 'dfmAttaFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'dfmAttaName', 'dfmAttaUrl', t('common.DFMFile'))"
                >{{ t('common.viewDetails') }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'customerDrawAttaFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'customerDrawAttaName', 'customerDrawAttaUrl', t('dict.CommonCol.customerDraw'))"
                >{{ t('common.viewDetails') }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'drawingSpecialFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'drawingSpecialName', 'drawingSpecialUrl', t('dict.CommonCol.drawingSpecial'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>

            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <a-table
              v-if="record.bomList && record.bomList.length"
              :data-source="record.bomList"
              :columns="getSubColumns()"
              size="small"
              :pagination="false"
              rowKey="id"
              :row-selection="{
                hideSelectAll: false,
                selectedRowKeys: record.subSelectedRowKeys,
                onChange: (a, b) => {
                  record.subSelectedRowKeys = a;
                  record.selectItem = b;
                },
              }">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'stopStatus'">
                  <Lydc-tag v-if="record.stopStatus == 0" theme="green">{{ t('dict.stopStatus.0') }}</Lydc-tag>
                  <Lydc-tag v-if="record.stopStatus == 1" theme="yellow">{{ t('dict.stopStatus.1') }}</Lydc-tag>
                  <Lydc-tag v-if="record.stopStatus == 2" theme="red">{{ t('dict.stopStatus.2') }}</Lydc-tag>
                </template>
                <template v-if="column.dataIndex === 'isOutsource'">
                  <div>{{ isOrNoFn(record.isOutsource) }}</div>
                </template>
                <template v-if="column.dataIndex === 'isProvideMaterials'">
                  <div>{{ isOrNoFn(record.isProvideMaterials) }}</div>
                </template>
                <template v-if="column.dataIndex === 'issueTime'">
                  <div>{{ dayjs(record.issueTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <TableAction :actions="getSubTableActions(record)" />
                </template>
              </template>
            </a-table>
          </template>
        </BasicTable>
      </div>
    </div>
    <PreviewModal ref="filePreviewRef" />
    <UploadModals @register="registerUploads" @get-table="getDrawingList" :title1="t('dict.CommonCol.drawing3d')" :title2="t('dict.CommonCol.drawing2d')" />
    <UploadModal @register="registerUpload" @get-table="getUploadList" :title="t('common.uploadText')" :single="true" />
    <AddWorkOrderModal @register="registerWorkOrder" @reload="refreshByCheckbox"> </AddWorkOrderModal>
    <OutsourceModal @register="registerOutsource" @reload="reloadTable"> </OutsourceModal>
    <CreateBOMModal @register="registerCreateBOM" @reload="reloadTable"></CreateBOMModal>
    <FileListModal @register="registerFile" @reload="reloadTable"></FileListModal>
    <StopModal @register="registerStopModal" @reload="reloadTable" />
    <ImportModal @register="registerImportPop" @refresh="refresh" @close="refresh"></ImportModal>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import {
    moldbomExportdetail,
    moldbomDelete,
    getMoldbomPage,
    getbomlist,
    moldbomGetTemplateDownload,
    moldbomImportExcel,
    moldbomSaveBatchData,
  } from '/@/api/engineering/mould';
  import { getColumn, formSchemas, importColumns } from '../moldBOM/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, ref, computed, unref } from 'vue';
  import { uploadfiles } from '/@/api/basic/common';
  import { getDesignpage, uploaddraw, parentDesignissue, childrenDesignissue, canceldesignissue, designstop } from '/@/api/engineering/mould';
  import UploadModals from '/@/views/engineering/mouldRoom/components/UploadModals.vue';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import AddWorkOrderModal from './addWorkOrder.vue';
  import OutsourceModal from './outsourceModal.vue';
  import CreateBOMModal from './createBOMModal.vue';
  import { schemas, newMoldColumns, repairMoldColumns, sub_columns } from './config';
  import { StopModal } from '/@/components/CustomComponents';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { upload } from '/@/api/purchase/importMateria';
  import { useRoute } from 'vue-router';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import { message } from 'ant-design-vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePopup } from '/@/components/Popup';
  import dayjs from 'dayjs';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  const filePreviewRef = ref<ModalComponent | null>(null);

  const { t } = useI18n();
  const route = useRoute();

  const props = defineProps({
    searchKey: { default: '0' },
  });

  // 注塑设计工程-newMold, 设计维修模-repairMold
  const type = computed(() => (route.fullPath.includes('/engineering/mouldRoom/designEngineeringRepair') ? 'repairMold' : 'newMold'));

  const searchInfo = reactive({
    dataSourceType: type.value === 'newMold' ? 'NewMold' : 'RepairMold',
    type: props.searchKey,
  });
  const selestRows = ref<any[]>([]);
  const currentId = ref('');
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const { createMessage, createConfirm } = useMessage();
  const [registerUploads, { openModal: openUploads }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerWorkOrder, { openModal: openWorkOrder }] = useModal();
  const [registerOutsource, { openModal: openOutsource }] = useModal();

  const [registerCreateBOM, { openModal: openCreateBOM }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  //  终止
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerTable, { getSelectRows, reload, getSelectRowKeys, getDataSource, expandRows, clearSelectedRowKeys, setSelectedRowKeys }] = useTable({
    api: getDesignpage,
    title: '',
    columns: type.value === 'newMold' ? newMoldColumns(props.searchKey) : repairMoldColumns(props.searchKey),
    rowKey: 'id',
    canResize: true,
    formConfig: {
      labelWidth: 100,
      schemas,
      showAdvancedButton: false,
      i18nConfig: {
        moduleCode: 'MoldApplyColumn', // 字典分类EnCode
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showIndexColumn: true, //显示序号
    showTableSetting: true,
    isTreeTable: true,
    defaultExpandAllRows: false,
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
      // onChange: (a, b) => {
      //   handleParentSelectFn(a, b);
      // },
    },
    actionColumn: {
      width: 70,
      title: t('common.action'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    afterFetch: data => {
      const expandedRowKeys = data.filter(item => item.bomList && item.bomList.length).map(item => item.id);
      expandRows(expandedRowKeys);
    },
    i18nConfig: {
      moduleCode: 'MoldApplyColumn', // 字典分类EnCode
    },
  });
  const getSubColumns = () => {
    let table = sub_columns();
    if (props.searchKey === '0') {
      return table.filter(item => item.dataIndex !== 'issueUserName' && item.dataIndex !== 'issueTime' && item.dataIndex !== 'stopStatus');
    }
    // 设计维修模没有终止状态
    if (type.value === 'repairMold') {
      return table.filter(item => item.dataIndex !== 'stopStatus');
    }
    return table;
  };

  const isOrNoFn = status => {
    if (status === 1) {
      return t('dict.YesOrNoStatus.1');
    } else if (status === 0) {
      return t('dict.YesOrNoStatus.2');
    }
  };

  async function handleStop() {
    const idList = getAllSelectKeys('partRelationId') || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openStopModal(true, {
      api: designstop,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: idList,
          rejectRemark: params.remark,
        };
      },
    });
  }

  const reloadTable = () => {
    clearSelectedRowKeys();
    reload();
  };

  const handleCanceldesignissue = async () => {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
      return false;
    }
    if (ids.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneParentTip'));
      return;
    }
    const { code, msg } = await canceldesignissue(ids[0]);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  };

  // 主子表格select关联
  function handleParentSelectFn(a, b) {
    const _tableData = getDataSource();
    _tableData.forEach(o => {
      if (a.includes(o.id)) {
        const subIds = o.bomList?.map(o => o.id);
        o.subSelectedRowKeys = subIds ?? [];
      } else {
        o.subSelectedRowKeys = [];
      }
    });
  }

  function handleDrawView(record, name, url, title, operation?) {
    // 需要操作（增、删）的情况下需要传递id、operation、params
    const column = [
      {
        title: t('common.fileName'),
        field: 'fileName',
        slots: { default: 'File' },
      },
      {
        title: t('common.action'),
        field: 'action',
        slots: { default: 'action' },
        width: 100,
        fixed: 'right',
      },
    ];
    let list: { fileName: string; fileUrl: string }[] = [];
    if (record[name]) {
      const names = record[name].split(',');
      const urls = record[url].split(',');
      list = names.map((name, index) => ({
        fileName: name,
        fileUrl: urls[index],
      }));
    }
    openFileList(true, {
      column,
      list,
      title,
      operation: operation && record.designIssueStatus !== 1,
      params: { fileName: name, fileUrl: url, id: record.id },
    });
  }

  const checkSelectStatus = () => {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
      return false;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneParentTip'));
      return false;
    }
    return true;
  };

  // 维护工单号
  const openWorkOrderModal = () => {
    if (!checkSelectStatus()) return;
    const rows = getSelectRows();
    // if (rows[0].bomMakeStatus !== 1) {
    //   createMessage.warning(t('dict.CommonCol.createBOMFirstTip'));
    //   return;
    // }
    const { moldNo, id, factoryArea, moldTypeName } = rows[0];
    selestRows.value = [rows[0]].map(item => item.id);
    // 3-新模 4-维修模
    openWorkOrder(true, {
      // workOrderType: type.value === 'newMold' ? '3' : '4',
      record: { mouldNo: moldNo, id, factoryArea, moldTypeName },
      draft: true,
    });
  };

  // 委外
  const openOutsourceModal = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectChildrenItemTip'));
      return;
    }
    let partRelationIds: string[] = [];
    getDataSource().forEach(item => {
      item.bomList.forEach(item => {
        if (rows.includes(item.id)) {
          partRelationIds.push(item.partRelationId);
        }
      });
    });
    openOutsource(true, { partRelationIds });
  };

  const openCreateBOMModal = () => {
    if (!checkSelectStatus()) return;
    const rows = getSelectRows();
    if (!rows[0].workOrderNo) return createMessage.warning(t('dict.CommonCol.maintainWorkOrderTip'));
    // if (rows[0].isModifyDraw === 0) return createMessage.warning(t('dict.CommonCol.addBOMTip'));
    emit('openApplyPopFn', rows[0], 'add');
  };

  // 根据标识获取父id或子id
  function getAllSelectKeys(key = 'headId') {
    let subKeys: any = [];
    getDataSource().forEach(o => {
      if (key === 'headId' && o['selectItem']) {
        o['selectItem'].forEach(item => {
          if (item[key]) {
            subKeys.push(item[key]);
          }
        });
      } else {
        subKeys = subKeys.concat(o.selectItem?.map(item => item[key]) || []);
      }
    });
    const ids = [...subKeys].filter(item => !!item);
    return ids;
  }

  // 上传文件
  const handleUpload = () => {
    if (!checkSelectStatus()) return;
    currentId.value = getSelectRows()[0].id;
    openUploads(true, {
      title: t('dict.MaterialDevelopApplyColumn.files'),
      uploadApi: upload,
    });
  };

  const getDrawingList = async (drawing3d, drawing2d) => {
    const drawing3dUrl = drawing3d.map(item => item.fullPath).join(',');
    const drawing3dName = drawing3d.map(item => item.originFileName).join(',');
    const drawing2dUrl = drawing2d.map(item => item.fullPath).join(',');
    const drawing2dName = drawing2d.map(item => item.originFileName).join(',');
    const params = {
      id: currentId.value,
      drawing3dUrl,
      drawing3dName,
      drawing2dUrl,
      drawing2dName,
    };
    await uploaddraw(params);
    reload();
  };

  const handleSpecialUpload = () => {
    if (!checkSelectStatus()) return;
    currentId.value = getSelectRows()[0].id;
    openUpload(true, {
      api: uploadfiles,
    });
  };

  const getUploadList = async drawingSpecial => {
    const drawingSpecialUrl = drawingSpecial.map(item => item.fullPath).join(',');
    const drawingSpecialName = drawingSpecial.map(item => item.originFileName).join(',');
    const params = {
      id: currentId.value,
      drawingSpecialUrl,
      drawingSpecialName,
    };
    await uploaddraw(params);
    reload();
  };

  function getTableActions(record): ActionItem[] {
    // 未下发的才有下发按钮
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetailFn.bind(null, record),
        auth: 'btn_detail',
        tooltip: t('common.detailText'),
      },
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: parentDesignissueFn.bind(null, record),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
        ifShow: props.searchKey === '0',
      },
    ];
  }

  const showEditBtn = record => {
    const tableList = getDataSource();
    const parentRow: any = tableList.find(item => item.id === record.moldDetailId);
    return parentRow.isModifyDraw !== 0;
  };

  function getSubTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
        // ifShow: showEditBtn(record),
      },
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: childrenDesignissueFn.bind(null, record),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
        ifShow: props.searchKey === '0',
      },
    ];
  }

  // 编辑
  const handleEdit = (row: any) => {
    if (row.designIssueStatus === 1) return message.warning(t('dict.CommonCol.issuedTip'));
    emit('openApplyPopFn', row, 'edit');
  };

  const parentDesignissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await parentDesignissue(record.id);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  const childrenDesignissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await childrenDesignissue(record.partRelationId);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };
  function batchImportOrExport({ key }) {
    if (!checkSelectStatus()) return;
    const rows = getSelectRows();
    if (!rows[0].workOrderNo) return createMessage.warning(t('dict.CommonCol.maintainWorkOrderTip'));
    // if (rows[0].isModifyDraw === 0) return createMessage.warning(t('dict.CommonCol.addBOMTip'));
    emit('openImportPopFn', rows);
  }

  //导出
  // function handleExport() {
  //   openExportModal(true, {
  //     api: exportRequirementReview,
  //     listQuery: {
  //       ...getFetchParams(),
  //     },
  //     exportOptions: APPLY_DETAIL_COLUMNS,
  //     nameProps: 'title',
  //     idProps: 'dataIndex',
  //     i18nConfig: {
  //       moduleCode: 'MoldApplyColumn', // 字典分类EnCode
  //     },
  //   });
  // }

  const emit = defineEmits(['openDetailPopFn', 'openApplyPopFn', 'openImportPopFn']);

  function goDetailFn(record: any) {
    emit('openDetailPopFn', record, type.value);
  }

  const refresh = () => {
    clearSelectedRowKeys();
    reload();
  };

  const refreshByCheckbox = async () => {
    clearSelectedRowKeys();
    await reload();
    setSelectedRowKeys(selestRows.value);
  };

  defineExpose({ refresh, refreshByCheckbox });
</script>
<style lang="less" scoped>
  .disabled-class {
    pointer-events: none;
  }

  .status-tag {
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    padding: 2px;
  }
</style>
