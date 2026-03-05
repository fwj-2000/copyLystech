<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
          <template #tableTitle v-if="props.searchKey === '1'">
            <!-- 已下发 -->
            <a-button v-auth="'btn_reissue'" type="primary" @click="handleCanceldesignissue">{{ t('dict.CommonCol.reissue') }}</a-button>
            <a-button v-auth="'btn_print'" @click="batchPrint">{{ t('common.batchPrintText') }}</a-button>
          </template>
          <template #tableTitle v-else>
            <!-- 未下发 -->
            <a-button v-auth="'btn_electrode'" type="primary" @click="handleElectrode">{{ t('dict.CommonCol.electrode') }}</a-button>
            <a-button v-auth="'btn_createBOM'" type="primary" ghost @click="openCreateBOMModal">{{ t('dict.CommonCol.createBOM') }}</a-button>
            <a-button v-auth="'btn_maintenanceWorkOrder'" type="primary" ghost @click="openWorkOrderModal">{{
              t('dict.CommonCol.maintainWorkOrderNo')
            }}</a-button>
            <a-button v-auth="'btn_processFlow'" type="primary" ghost @click="handleProcessFlow">{{ t('common.process') }}</a-button>
            <a-button v-auth="'btn_outsource'" type="primary" ghost @click="openOutsourceModal">{{ t('dict.CommonCol.outsource') }}</a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleUploadSteel">{{ t('dict.CommonCol.uploadSteelProgram') }}</a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleUploadElectrode">{{ t('dict.CommonCol.uploadElectrodeProgram') }}</a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleUploadDischarge">{{ t('dict.CommonCol.dischargeDrawing') }}</a-button>
            <a-button v-auth="'btn_batchBindProcessRoute'" type="primary" ghost @click="handlePartbindroute">{{
              t('dict.CommonCol.batchBindProcessRoute')
            }}</a-button>
          </template>

          <template #bodyCell="{ column, record }">
            <!-- 钢料程式文件 -->
            <template v-if="column.dataIndex === 'programAtta'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'programAttaName', 'programAttaUrl', t('dict.CommonCol.formula'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <!-- dischargeDraw -->
            <!-- 放电图纸 -->
            <template v-if="column.dataIndex === 'dischargeDraw'">
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="
                  handleDrawView(
                    record,
                    'dischargeDrawName',
                    'dischargeDrawUrl',
                    t('dict.CommonCol.dischargeDrawing'),
                    record.electrodeBomStatus === 1 ? true : false,
                  )
                "
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'drawingSpecialFile'">
              <!-- 特殊做法文件 -->
              <div
                v-auth="'btn_detail'"
                class="table-a"
                @click="handleDrawView(record, 'drawingSpecialName', 'drawingSpecialUrl', t('dict.CommonCol.drawingSpecial'), false)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'isElectrode'">
              <div>{{ isOrNoFn(record.isElectrode) }}</div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <div></div>
            <a-table
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
                <template v-if="column.dataIndex === 'programAtta'">
                  <div
                    v-auth="'btn_detail'"
                    class="table-a"
                    @click="handleDrawView(record, 'programAttaName', 'programAttaUrl', t('dict.CommonCol.formula'), true)"
                    >{{ t('common.viewDetails') }}</div
                  >
                </template>
                <template v-if="column.dataIndex === 'isOutsource'">
                  <div class="table-a" @click="goOutsourcingList">{{ isOrNoFn(record.isOutsource) }}</div>
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
    <FileListModal @register="registerFile" @reload="reload"></FileListModal>
    <OutsourceModal @register="registerOutsource" @reload="reload"> </OutsourceModal>
    <ElectrodeModal @register="registerElectrode" @reload="reloadTable"> </ElectrodeModal>
    <CreateBOMModal @register="registerCreateBOM" @reload="reloadTable"></CreateBOMModal>
    <AddWorkOrderModal @register="registerWorkOrder" @reload="reloadTable"> </AddWorkOrderModal>
    <UploadModal @register="registerUpload" @get-table="getUploadList" :title="t('common.uploadText')" :single="true" />
    <PartbindrouteModal @register="registerPartbindroute" @reload="reload"></PartbindrouteModal>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, inject, ref } from 'vue';
  import dayjs from 'dayjs';
  import {
    getMoldprogramPage,
    parentMoldprogramDesignissue,
    childrenMoldprogramDesignissue,
    moldprogramUploaddraw,
    uploadfiles,
    cancelissue,
  } from '/@/api/engineering/mould';
  import { columns, schemas, sub_columns } from './config';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import OutsourceModal from './components/outsourceModal.vue';
  import ElectrodeModal from './components/electrodeModal.vue';
  import CreateBOMModal from './components/createBOMModal.vue';
  import AddWorkOrderModal from './components/addWorkOrder.vue';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import PartbindrouteModal from './components/PartbindrouteModal.vue';
  import { useRouter } from 'vue-router';

  const filePreviewRef = ref<ModalComponent | null>(null);
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openProcessBindFn: any = inject('openProcessBindFn');
  const openPrintPopFn: any = inject('openPrintPopFn');
  const { t } = useI18n();
  const router = useRouter();

  const props = defineProps({
    searchKey: { default: '0' },
  });
  const searchInfo = reactive({
    type: props.searchKey,
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerOutsource, { openModal: openOutsource }] = useModal();
  const [registerElectrode, { openModal: openElectrode }] = useModal();
  const [registerCreateBOM, { openModal: openCreateBOM }] = useModal();
  const [registerWorkOrder, { openModal: openWorkOrder }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerPartbindroute, { openModal: openPartbindrouteModal }] = useModal();
  //

  const [registerTable, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, reload, getDataSource }] = useTable({
    api: getMoldprogramPage,
    title: '',
    columns: columns(props.searchKey),
    rowKey: 'id',
    canResize: true,
    formConfig: {
      labelWidth: 100,
      schemas,
      showAdvancedButton: false,
      fieldMapToTime: [['pickerVal', ['creatorTimeStart', 'creatorTimeEnd']]],
      i18nConfig: {
        moduleCode: 'MoldProgramColumn', // 字典分类EnCode
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showIndexColumn: true, //显示序号
    showTableSetting: true,
    isTreeTable: true,
    defaultExpandAllRows: true,
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
    i18nConfig: {
      moduleCode: 'MoldProgramColumn',
    },
  });

  const getSubColumns = () => {
    let table = sub_columns();
    if (props.searchKey === '0') {
      return table.filter(item => item.dataIndex !== 'issueUserName' && item.dataIndex !== 'issueTime');
    }
    return table;
  };

  const reloadTable = () => {
    clearSelectedRowKeys();
    reload();
  };

  function getTableActions(record): ActionItem[] {
    // '1'已下发没有下发按钮
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
        const { code } = await parentMoldprogramDesignissue(record.id);
        if (code === 200) {
          createMessage.success(t('dict.CommonCol.issueSuccess'));
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
        ifShow: record.isOutsource !== 1 && !!record.routeBindId,
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

  const childrenDesignissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await childrenMoldprogramDesignissue(record.id);
        if (code === 200) {
          createMessage.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  const goOutsourcingList = () => {
    router.push('/purchase/outsourcingManagement');
  };

  const currentId = ref('');

  // 上传钢料程式文件
  const handleUploadSteel = () => {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
      return;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneParentTip'));
      return;
    }
    isDischarge.value = false;
    currentId.value = rows[0].id;
    openUpload(true, {
      api: uploadfiles,
    });
  };

  // 用于将钢料程式、电极程式 和 放电图纸 做区分
  const isDischarge = ref(false);
  // 上传放电图纸
  const handleUploadDischarge = () => {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
      return;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneParentTip'));
      return;
    }
    if (rows[0].electrodeBomStatus !== 1) {
      createMessage.warning(t('dict.CommonCol.createBOMFirstTip'));
      return;
    }
    isDischarge.value = true;
    currentId.value = rows[0].id;
    openUpload(true, {
      api: uploadfiles,
    });
  };

  // 绑定工艺路线
  const handlePartbindroute = () => {
    const rows = getAllSelectKeys('partRelationId');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    openPartbindrouteModal(true, { partRelationIds: rows });
  };

  // 上传电极程式文件
  const handleUploadElectrode = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectChildrenItemTip'));
      return;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectOneChildrenItemTip'));
      return;
    }
    isDischarge.value = false;
    currentId.value = rows[0];
    openUpload(true, {
      api: uploadfiles,
    });
  };

  const getUploadList = async programAtta => {
    // isDischarge为true 放电图纸（已制作的才可以上传放电图纸）
    let params = {};
    const programAttaUrl = programAtta.map(item => item.fullPath).join(',');
    const programAttaName = programAtta.map(item => item.originFileName).join(',');
    if (!isDischarge.value) {
      params = {
        id: currentId.value,
        programAttaUrl,
        programAttaName,
      };
    } else {
      params = {
        id: currentId.value,
        dischargeDrawUrl: programAttaUrl,
        dischargeDrawName: programAttaName,
      };
    }
    await moldprogramUploaddraw(params);
    reload();
  };

  const isOrNoFn = status => {
    if (status === 1) {
      return t('dict.YesOrNoStatus.1');
    } else if (status === 0) {
      return t('dict.YesOrNo.0');
    }
  };

  // 是否电极
  const handleElectrode = () => {
    const rows = getSelectRowKeys();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
      return;
    }
    openElectrode(true, { ids: rows });
  };

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
  // 制作BOM
  const openCreateBOMModal = () => {
    if (!checkSelectStatus()) return;
    const rows = getSelectRows();
    if (rows[0].isElectrode !== 1) {
      createMessage.warning(t('dict.CommonCol.makeBOMByElectrodeTip'));
      return;
    }
    const { id, moldNo, partNo } = rows[0];
    openCreateBOM(true, { id, moldNo, partNo });
  };

  // 维护工单号
  const openWorkOrderModal = () => {
    if (!checkSelectStatus()) return;
    const rows = getSelectRows();
    if (rows[0].electrodeBomStatus !== 1) {
      createMessage.warning(t('dict.CommonCol.createBOMFirstTip'));
      return;
    }
    if (rows[0].bomList[0].workOrderNo) {
      createMessage.warning(t('dict.CommonCol.workOrderMaintainedTip'));
      return;
    }
    const { moldNo, id, factoryArea, moldTypeName } = rows[0];
    openWorkOrder(true, {
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
    openOutsource(true, { partRelationIds: rows });
  };

  // 工艺流程
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
    const { partNo, moldNo } = parent[0];
    const { routeBindId, id, electrodeName } = children[0];
    const data = routeBindId
      ? { id: routeBindId, processRouteType: 5, material: `${moldNo}(${partNo})(${electrodeName})`, partRelationId: id }
      : {
          processRouteType: 5,
          material: `${moldNo}(${partNo})(${electrodeName})`,
          partRelationId: id,
        };
    openProcessBindFn({
      data,
      title: routeBindId ? t('common.editText') : t('common.addText'),
      from: 'generate',
      // 新增的情况下默认工序名称
      defaultProcessName: true,
    });
  };

  const handleEditProcessFlow = record => {
    let parent: any = {};
    getDataSource().forEach(data => {
      if (data.id === record.partRelationId) {
        parent = data;
      }
    });
    const { routeBindId, id, electrodeName } = record;
    const { moldNo, partNo } = parent;
    const data = { id: routeBindId, processRouteType: 5, material: `${moldNo}(${partNo})(${electrodeName})`, partRelationId: id };
    openProcessBindFn({
      data,
      title: routeBindId ? t('common.editText') : t('common.addText'),
      from: 'generate',
    });
  };

  const batchPrint = () => {
    const rows = getAllSelectKeys('id');
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    openPrintPopFn(rows);
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
    const { code, msg } = await cancelissue(ids[0]);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
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
      api: moldprogramUploaddraw,
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
    let subKeys: any = [];
    getDataSource().forEach(o => {
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
    const ids = [...subKeys].filter(item => !!item);
    return ids;
  }

  function enableWorkOrderFn() {
    reload();
  }

  function goDetailFn(record: any) {
    openDetailPopFn(record);
  }

  defineExpose({
    enableWorkOrderFn,
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
