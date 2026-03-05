<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <!-- 编辑 -->
            <a-button v-auth="'btn_edit'" type="primary" @click="handleEditPlan">{{ t('dict.CommonCol.processPlan') }}</a-button>
            <a-button v-auth="'btn_outsource'" type="primary" ghost @click="handleOutsource">{{ t('dict.CommonCol.outsource') }}</a-button>
            <a-button v-auth="'btn_agree'" type="primary" ghost @click="handleAgree">{{ t('common.agree') }}</a-button>
            <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
            <!-- <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button> -->
            <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item key="import" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </a-menu-item>
                  <a-menu-item key="export" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </a-menu-item>
                  <a-menu-item key="exportTemplate" v-if="hasBtnP('btn_exportImportTemp')">{{ t('common.exportImportTemplate') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download') || hasBtnP('btn_exportImportTemp')">{{
                t('common.batchImportOrExport')
              }}</a-button>
            </a-dropdown>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'processDemandAttaFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'processDemandAttaName', 'processDemandAttaUrl', t('dict.CommonCol.processingFile'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'drawing3dFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'drawing3dName', 'drawing3dUrl', t('dict.CommonCol.drawing3d'))">{{
                t('common.viewDetails')
              }}</div>
            </template>
            <template v-if="column.dataIndex === 'drawing2dFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'drawing2dName', 'drawing2dUrl', t('dict.CommonCol.drawing2d'))">{{
                t('common.viewDetails')
              }}</div>
            </template>
            <template v-if="column.dataIndex === 'dfmAttaFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'dfmAttaName', 'dfmAttaUrl', t('dict.CommonCol.DFMFile'))">{{
                t('common.viewDetails')
              }}</div>
            </template>
            <template v-if="column.dataIndex === 'customerDrawAttaFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'customerDrawAttaName', 'customerDrawAttaUrl', t('dict.CommonCol.customerDraw'))"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'processDemandAtta'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'processDemandAttaName', 'processDemandAttaUrl', t('dict.CommonCol.partProcessDrawings'))"
                >{{ t('common.viewDetails') }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'drawingSpecialFile'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'drawingSpecialName', 'drawingSpecialUrl', t('dict.CommonCol.drawingSpecial'))"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <a-table
              v-if="record.partPlanList && record.partPlanList.length"
              :data-source="record.partPlanList"
              :columns="partSubColumns"
              size="small"
              :pagination="false"
              :scroll="{ y: '400px', x: '1800px' }"
              rowKey="id"
              :row-selection="{
                hideSelectAll: false,
                selectedRowKeys: record.subSelectedRowKeys,
                onChange: (a, b) => {
                  record.subSelectedRowKeys = a;
                  record.selectItem = b;
                },
              }">
              <template #bodyCell="{ column, record, text }">
                <template v-if="column.dataIndex === 'status'">
                  <Lydc-tag v-if="text == 0" theme="gray">{{ t('dict.planProgress.0') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 1" theme="blue">{{ t('dict.planProgress.1') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 2" theme="green">{{ t('dict.planProgress.2') }}</Lydc-tag>
                </template>
                <template v-if="column.dataIndex === 'planStatus'">
                  <Lydc-tag v-if="text == 0" theme="gray">{{ t('dict.planMakeStatus.0') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 1" theme="green">{{ t('dict.planMakeStatus.1') }}</Lydc-tag>
                </template>
                <template v-if="column.dataIndex === 'stopStatus'">
                  <Lydc-tag v-if="text == 0" theme="green">{{ t('dict.stopStatus.0') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 1" theme="yellow">{{ t('dict.stopStatus.1') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 2" theme="red">{{ t('dict.stopStatus.2') }}</Lydc-tag>
                </template>
                <template v-if="column.dataIndex === 'isOutsource'">
                  <div class="table-a" @click="goOutsourcingList">{{ isOrNoFn(record.isOutsource) }}</div>
                </template>
                <template v-if="column.dataIndex === 'issueTime'">
                  <div>{{ record.issueTime ? dayjs(record.issueTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</div>
                </template>
                <template v-if="column.dataIndex === 'issueStatus'">
                  <Lydc-tag v-if="text == 0" theme="gray">{{ t('dict.issueStatus.0') }}</Lydc-tag>
                  <Lydc-tag v-if="text == 1" theme="green">{{ t('dict.issueStatus.1') }}</Lydc-tag>
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
    <FileListModal @register="registerFile" @reload="reload"></FileListModal>
    <OutsourceModal @register="registerOutsource" @reload="reload"> </OutsourceModal>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getMoldpartplange,
    moldpartplanExport,
    moldpartplanExportImportTemp,
    moldpartplanIssue,
    issuepartplan,
    agreestop,
    rejectstop,
    importtemplate,
    importSaveBatchData,
    importExcel,
  } from '/@/api/engineering/mould';
  import { schemas, partColumns, partSubColumns, importColumns } from '../config';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import OutsourceModal from '/@/views/engineering/mouldRoom/codeEngineering/components/outsourceModal.vue';
  import { message } from 'ant-design-vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const router = useRouter();

  const { createConfirm } = useMessage();
  const { hasBtnP } = usePermission();

  const emits = defineEmits(['machiningPlan', 'batchImportFile']);
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerOutsource, { openModal: openOutsource }] = useModal();
  const [registerTable, { getSelectRows, reload, getSelectRowKeys, getDataSource, expandRows }] = useTable({
    api: getMoldpartplange,
    title: '',
    columns: partColumns,
    rowKey: 'id',
    canResize: true,
    formConfig: {
      labelWidth: 100,
      schemas,
      showAdvancedButton: false,
      i18nConfig: {
        moduleCode: 'MoldPartPlanColumn', // 字典分类EnCode
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
    // rowSelection: {
    //   type: 'checkbox',
    //   // onChange: (a, b) => {
    //   //   handleParentSelectFn(a, b);
    //   // },
    // },
    actionColumn: {
      width: 50,
      title: t('common.action'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    afterFetch: data => {
      const expandedRowKeys = data.filter(item => item.partPlanList && item.partPlanList.length).map(item => item.id);
      expandRows(expandedRowKeys);
    },
    i18nConfig: {
      moduleCode: 'MoldPartPlanColumn',
    },
  });

  function batchImportOrExport({ key }) {
    if (key === 'import') {
      batchImportFile();
    }
    if (key === 'export') {
      handleExport();
    }
    if (key === 'exportTemplate') {
      handleExportTemplate();
    }
  }

  async function handleExportTemplate() {
    if (getSelectRowKeys().length === 0 && getAllSelectKeys('id').length === 0) {
      return message.warning(t('dict.CheckDataTip'));
    }
    const ids = [...getSelectRowKeys(), ...getAllSelectKeys('id')];
    const res = await moldpartplanExportImportTemp(ids);
    const { code, data, msg } = res;
    if (code === 200) {
      if (!data.url) return;
      downloadByUrl({ url: data.url, fileName: data.name });
      message.success(msg);
      reload();
    }
  }

  function batchImportFile() {
    // openImportPopup(true, {
    //   importPreviewApi: importExcel,
    //   importSaveApi: importSaveBatchData,
    //   templateApi: importtemplate,
    //   version: '2',
    //   templateUrl: '/api/Production/moldpartplan/download/importtemplate',
    //   previewColumn: importColumns,
    //   usePolling: false,
    //   pollingParams: {
    //     interval: 5000,
    //   },
    //   apiParams: {
    //     importSave: {
    //       isoperation: hasBtnP('btn_review') ? 1 : 0,
    //     },
    //   },
    // });
    emits('batchImportFile', {
      importPreviewApi: importExcel,
      importSaveApi: importSaveBatchData,
      templateApi: importtemplate,
      version: '2',
      templateUrl: '/api/Production/moldpartplan/download/importtemplate',
      previewColumn: importColumns,
      usePolling: false,
      pollingParams: {
        interval: 5000,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  const isOrNoFn = status => {
    if (status === 1) {
      return t('dict.YesOrNoStatus.1');
    } else if (status === 0) {
      return t('dict.YesOrNoStatus.2');
    }
  };

  const goOutsourcingList = () => {
    router.push('/purchase/outsourcingManagement');
  };

  // 主子表格select关联
  function handleParentSelectFn(a, b) {
    const _tableData = getDataSource();
    _tableData.forEach(o => {
      if (a.includes(o.id)) {
        const subIds = o.partPlanList?.map(o => o.id);
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

  function getTableActions(record): ActionItem[] {
    return [
      // {
      //   icon: 'icon-ym icon-ym-edit',
      //   onClick: goEditFn.bind(null, record, 'parent'),
      //   auth: 'btn_edit',
      //   tooltip: t('common.editText'),
      // },
      {
        icon: 'icon-ym icon-ym-btn-download',
        // issuepartplan
        onClick: issuepartplanFn.bind(null, record),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
      },
    ];
  }

  const issuepartplanFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await issuepartplan(record.id);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  const moldpartplanIssueFn = async record => {
    if (record.planStatus === 0) {
      return message.warning(t('dict.CommonCol.createPlanTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await moldpartplanIssue(record.id);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  function getSubTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goEditFn.bind(null, record, 'children'),
        tooltip: t('common.editText'),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: moldpartplanIssueFn.bind(null, record),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
      },
    ];
  }

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
    return subKeys;
  }

  function getSelect() {
    return {
      parent: getDataSource().filter(o => {
        return o.subSelectedRowKeys?.length;
      }),
      children: getDataSource()
        .map(item => item.partPlanList.filter(bom => getAllSelectKeys('id').includes(bom.id)))
        .flat(),
    };
  }

  //导出
  const handleExport = async () => {
    if (getSelectRowKeys().length === 0 && getAllSelectKeys('id').length === 0) {
      return message.warning(t('dict.CheckDataTip'));
    }
    const ids = [...getSelectRowKeys(), ...getAllSelectKeys('id')];
    const res = await moldpartplanExport(ids);
    const { code, data, msg } = res;
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
      message.success(msg);
      reload();
    }
  };

  const selectCheck = () => {
    const parentrows = getSelectRows();
    const childrenrows = getAllSelectKeys('id');
    if (parentrows.length === 0 && childrenrows.length === 0) {
      message.warning(t('dict.CheckDataTip'));
      return false;
    }
    if (parentrows.length > 1 || childrenrows.length > 1) {
      message.warning(t('dict.NewMoldColumn.selectOneItemTip'));
      return false;
    }
    if (parentrows.length && childrenrows.length) {
      message.warning(t('dict.NewMoldColumn.selectOneItemTip'));
      return false;
    }
    return true;
  };

  const handleEditPlan = () => {
    if (!selectCheck()) return;
    const parentrows = getSelectRows();
    if (parentrows.length) {
      // 勾选父级
      goEditFn(parentrows[0], 'parent');
    } else {
      //勾选子级
      goEditFn(getSelect().children[0], 'children');
    }
  };

  const handleOutsource = () => {
    const parentrows = getSelectRowKeys();
    const childrenrows = getAllSelectKeys('id');
    if (parentrows.length === 0 && childrenrows.length === 0) {
      message.warning(t('dict.CheckDataTip'));
      return;
    }
    const rows = [...parentrows, ...childrenrows];
    openOutsource(true, { partRelationIds: rows });
  };

  const handleAgree = () => {
    const ids = getAllSelectKeys('id');
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    const stopStatusList = getAllSelectKeys('stopStatus');
    if (stopStatusList.some(item => item !== 1)) {
      message.warning(t('dict.CommonCol.handleTerminatedDataTip'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchConsentTip'),
      onOk: async () => {
        // 获取勾选的数据
        const res = await agreestop(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  const handleReject = () => {
    const ids = getAllSelectKeys('id');
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    const stopStatusList = getAllSelectKeys('stopStatus');
    if (stopStatusList.some(item => item !== 1)) {
      message.warning(t('dict.CommonCol.handleTerminatedDataTip'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchRejectionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const res = await rejectstop(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  const goEditFn = (record: any, level: string) => {
    emits('machiningPlan', { type: 'edit', record, level });
  };

  defineExpose({
    reload,
  });
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
