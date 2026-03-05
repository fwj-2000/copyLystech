<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
          <template #tableTitle v-if="props.searchKey === '1'">
            <a-button v-auth="'btn_print'" @click="batchPrint">{{ t('common.batchPrintText') }}</a-button>
            <!-- 已下发 -->
            <!-- v-auth="'btn_download'" -->
            <!-- <a-button type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button> -->
            <!-- v-auth="'btn_download'" -->
            <!-- <a-button @click="handleExport()">{{ t('common.batchExport') }}</a-button> -->
          </template>
          <template #tableTitle v-else>
            <!-- 未下发 -->
            <a-button v-auth="'btn_processFlow'" type="primary" @click="handleProcessFlow">{{ t('common.process') }}</a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleUploadpartdraw">{{ t('dict.CommonCol.processingFile') }}</a-button>
            <a-button v-auth="'btn_outsource'" type="primary" ghost @click="openOutsourceModal">{{ t('dict.CommonCol.outsource') }}</a-button>
            <a-button v-auth="'btn_batchBindProcessRoute'" type="primary" ghost @click="handlePartbindroute">{{
              t('dict.CommonCol.batchBindProcessRoute')
            }}</a-button>
            <a-button v-auth="'btn_confirmprocess'" type="primary" ghost @click="handleConfirmprocess">{{ t('dict.CommonCol.confirmProcess') }}</a-button>
            <a-button v-auth="'btn_batchDistribution'" type="primary" ghost @click="handleBulkDistribution">{{
              t('dict.CommonCol.batchDistribution')
            }}</a-button>
            <!-- v-auth="'btn_download'" -->
            <!-- <a-button @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button> -->
            <!-- v-auth="'btn_download'" -->
            <!-- <a-button @click="handleExport()">{{ t('common.batchExport') }}</a-button> -->
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

            <template v-if="column.dataIndex === 'attachmentFile'">
              <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(record, 'attachmentName', 'attachmentUrl', t('dict.CommonCol.file'))">{{
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
            <div></div>
            <a-table
              v-if="record.bomList && record.bomList.length"
              :data-source="record.bomList"
              :columns="getSubColumns()"
              size="small"
              :scroll="{ y: 450 }"
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
                <template v-if="column.dataIndex === 'isPrint'">
                  <Lydc-tag v-if="record.isPrint == 0" theme="gray">{{ t('dict.YesOrNo.0') }}</Lydc-tag>
                  <Lydc-tag v-if="record.isPrint == 1" theme="green">{{ t('dict.YesOrNo.1') }}</Lydc-tag>
                </template>
                <template v-if="column.dataIndex === 'isOutsource'">
                  <div class="table-a" @click="jumpOutsourceList">{{ isOrNoFn(record.isOutsource) }}</div>
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
    <!-- <ExportModal @register="registerExportModal" /> -->
    <PreviewModal ref="filePreviewRef" />
    <UploadModal @register="registerUpload" @get-table="getUploadList" :title="t('common.uploadText')" :single="true" />
    <FileListModal @register="registerFile"></FileListModal>
    <OutsourceModal @register="registerOutsource" @reload="reload"> </OutsourceModal>
    <PartbindrouteModal @register="registerPartbindroute" @reload="reload"></PartbindrouteModal>
    <ConfirmprocessModal @register="registerConfirmprocess" @reload="reload"></ConfirmprocessModal>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, inject, ref } from 'vue';
  // import ExportModal from '/@/components/ExportModal/index.vue';
  import { uploadfiles } from '/@/api/basic/common';
  import { getProcesspage, uploaddraw, parentProcessissue, childrenProcessissue, bathprocessissuedetail } from '/@/api/engineering/mould';
  import { columns, schemas, sub_columns } from './config';
  import { PreviewModal } from '/@/components/Upload';
  // import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import OutsourceModal from '/@/views/engineering/mouldRoom/designEngineering/outsourceModal.vue';
  import { useRouter } from 'vue-router';
  import PartbindrouteModal from './components/PartbindrouteModal.vue';
  import ConfirmprocessModal from './components/ConfirmprocessModal.vue';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';

  const router = useRouter();
  const filePreviewRef = ref<ModalComponent | null>(null);
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openProcessBindFn: any = inject('openProcessBindFn');
  const openPrintPopFn: any = inject('openPrintPopFn');
  const { t } = useI18n();

  const props = defineProps({
    searchKey: { default: '0' },
  });
  // const pageTurnConfig = getPageConfig();
  const searchInfo = reactive({
    type: props.searchKey,
  });

  const { createMessage, createConfirm } = useMessage();
  // const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerOutsource, { openModal: openOutsource }] = useModal();
  const [registerPartbindroute, { openModal: openPartbindrouteModal }] = useModal();
  const [registerConfirmprocess, { openModal: openConfirmprocessModal }] = useModal();

  const [registerTable, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, reload, getFetchParams, getDataSource, expandRows }] = useTable({
    api: getProcesspage,
    title: '',
    columns: columns(props.searchKey),
    rowKey: 'id',
    canResize: true,
    formConfig: {
      labelWidth: 100,
      schemas: schemas(),
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
      onChange: (a, b) => {
        handleParentSelectFn(a, b);
      },
    },
    actionColumn: {
      width: 70,
      title: t('common.action'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    // afterFetch: data => {
    //   const expandedRowKeys = [data[0].id];
    //   expandRows(expandedRowKeys);
    // },
    i18nConfig: {
      moduleCode: 'MoldApplyColumn',
    },
  });

  // const gridOptions: VxeGridProps = {
  //   columns: sub_columns,
  //   height: 'auto',
  //   rowConfig: {
  //     keyField: '_X_ROW_KEY',
  //   },
  //   scrollX: { enabled: true },
  //   keyboardConfig: {
  //     isClip: true,
  //     isEdit: true,
  //     isDel: true,
  //     isEsc: true,
  //   },
  //   proxyConfig: {
  //     enabled: false,
  //   },
  //   toolbarConfig: {
  //     enabled: false,
  //   },
  //   clipConfig: {
  //     isPaste: true,
  //   },
  //   i18nConfig: {
  //     moduleCode: 'MoldApplyColumn',
  //   },
  //   showIndexColumn: true,
  //   pagerConfig: {
  //     enabled: false,
  //   },
  // };

  // const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const getSubColumns = () => {
    let table = sub_columns();
    if (props.searchKey === '0') {
      return table.filter(item => item.dataIndex !== 'issueUserName' && item.dataIndex !== 'issueTime' && item.dataIndex !== 'isPrint');
    }
    return table;
  };

  function getTableActions(record): ActionItem[] {
    // 未下发的才有下发按钮
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetailFn.bind(null, record),
        tooltip: t('common.viewDetails'),
        auth: 'btn_detail',
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

  const parentDesignissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await parentProcessissue(record.id);
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
        icon: 'ym-diecut ym-diecut-fork',
        onClick: handleEditProcessFlow.bind(null, record),
        tooltip: t('common.process'),
        auth: 'btn_processFlow',
        ifShow: record.isOutsource !== 1 && record.routeBindId,
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

  const jumpOutsourceList = () => {
    router.push('/purchase/outsourcingManagement');
  };
  const childrenDesignissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await childrenProcessissue(record.partRelationId);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  function handlePrint(record) {
    openPrintPopFn(record);
  }

  const isOrNoFn = status => {
    if (status === 1) {
      return '是';
    } else if (status === 0) {
      return '否';
    }
  };

  const selectCheck = () => {
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

  // 委外
  const openOutsourceModal = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
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

  // 绑定工艺路线
  const handlePartbindroute = () => {
    const rows = getAllSelectKeys('partRelationId');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
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
    openPartbindrouteModal(true, { partRelationIds });
  };

  // 确认加工
  const handleConfirmprocess = () => {
    const ids = getAllSelectKeys('id');
    if (ids.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    openConfirmprocessModal(true, { ids });
  };

  // 子表批量下发
  const handleBulkDistribution = async () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
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

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await bathprocessissuedetail(partRelationIds);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  const handleProcessFlow = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectChildrenItemTip'));
      return;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneChildrenItemTip'));
      return;
    }

    let isOutsource = 0;
    getDataSource().forEach(item => {
      item.bomList.forEach(item => {
        if (rows.includes(item.id)) {
          isOutsource = item.isOutsource;
        }
      });
    });

    if (isOutsource === 1) return createMessage.warning(t('dict.CommonCol.dataOutsourced'));
    const { parent, children } = getSelectDrawsList();
    const { routeBindId, partNo, partRelationId, quantity, material } = children[0];
    const { dataSourceType, moldNo, version } = parent[0];
    const data = routeBindId
      ? { id: routeBindId, processRouteType: dataSourceType, material: `${moldNo}(${partNo})`, partRelationId, version }
      : {
          processRouteType: dataSourceType,
          material: `${moldNo}(${partNo})`,
          partRelationId,
          partQuantity: quantity,
          partMaterial: material,
          version: version,
        };
    openProcessBindFn({
      data,
      title: routeBindId ? t('common.editText') : t('common.addText'),
      from: 'generate',
    });
  };

  const handleEditProcessFlow = record => {
    let parent: any = {};
    getDataSource().forEach(data => {
      if (data.bomId === record.bomId) {
        parent = data;
      }
    });
    const { routeBindId, partNo, partRelationId, quantity, material } = record;
    const { dataSourceType, moldNo, version } = parent;
    const data = {
      id: routeBindId,
      processRouteType: dataSourceType,
      material: `${moldNo}(${partNo})`,
      partRelationId,
      partQuantity: quantity,
      partMaterial: material,
      version: version,
    };
    openProcessBindFn({
      data,
      title: routeBindId ? t('common.editText') : t('common.addText'),
      from: 'generate',
    });
  };

  const currentId = ref('');
  const handleUploadpartdraw = () => {
    if (!selectCheck()) return;
    const rows = getSelectRows();
    currentId.value = rows[0].id;
    openUpload(true, {
      api: uploadfiles,
    });
  };

  const batchPrint = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
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
    openPrintPopFn(partRelationIds);
  };

  const getUploadList = async file => {
    const params = {
      id: currentId.value,
      processDemandAttaUrl: file.map(item => item.fullPath).join(','),
      processDemandAttaName: file.map(item => item.originFileName).join(','),
    };
    await uploaddraw(params);
    reload();
  };

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

  function getSelectDrawsList() {
    return {
      parent: getDataSource().filter(o => {
        return o.subSelectedRowKeys?.length;
      }),
      children: getDataSource()
        .map(item => item.bomList.filter(bom => getAllSelectKeys('id').includes(bom.id)))
        .flat(),
    };
  }

  // 根据标识获取父id或子id
  function getAllSelectKeys(key = 'headId') {
    let keys = getSelectRowKeys();
    let subKeys: any = [];
    getDataSource().forEach(o => {
      const dataSource = key === 'headId' ? 'selectItem' : 'subSelectedRowKeys';
      if (key === 'headId' && o['selectItem']) {
        o['selectItem'].forEach(item => {
          if (item[key]) {
            subKeys.push(item[key]);
          }
        });
      } else {
        subKeys = subKeys.concat(o.subSelectedRowKeys);
      }
    });
    // const ids = [...keys, ...subKeys].filter(item => !!item);
    const ids = [...subKeys].filter(item => !!item);
    return ids;
  }

  function downloadFn() {
    let rows = getSelectRows();
    if (rows.length) {
      for (let index = 0; index < rows.length; index++) {
        const curId = rows[index].moldDrawingsId;
        try {
          handleFileDownload(curId);
          console.log(`文件 ${curId} 下载成功`);
        } catch (error) {
          console.error(`文件 ${curId} 下载失败: `, error);
        }
      }
    } else {
      createMessage.warning(t('common.selectText'));
    }
  }

  async function handleFileDownload(id) {
    const { data, code } = await fileDownload(id);
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
    }
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

  function enableWorkOrderFn() {
    reload();
  }

  function goDetailFn(record: any) {
    const row = {
      ...record,
      routeBindId: record.bomList[0].routeBindId,
    };
    openDetailPopFn(row);
  }

  defineExpose({
    enableWorkOrderFn,
  });
</script>
<style lang="less" scoped>
  // ::v-deep(::-webkit-scrollbar) {
  //   display: none;
  //   width: 0;
  //   height: 0;
  //   color: transparent;
  //   background-color: transparent;
  // }
  .disabled-class {
    pointer-events: none;
  }

  .status-tag {
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    padding: 2px;
  }

  .print-content {
    width: 794px;

    .title {
      font-weight: 700;
      text-align: center;
      line-height: 28px;
      font-size: 18px;
    }

    .mold-info {
      display: flex;
      flex-wrap: wrap;

      .info-item {
        width: 33%;
      }
    }
  }
</style>
