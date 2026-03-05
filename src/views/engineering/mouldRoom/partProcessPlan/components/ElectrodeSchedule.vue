<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <!-- 编辑 -->
            <a-button v-auth="'btn_edit'" type="primary" @click="handleEditPlan">{{ t('dict.CommonCol.processPlan') }}</a-button>
            <a-button v-auth="'btn_outsource'" type="primary" ghost @click="handleOutsource">{{ t('dict.CommonCol.outsource') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
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
                @click="handleDrawView(record, 'drawingSpecialName', 'drawingSpecialUrl', t('dict.CommonCol.drawingSpecial'), true)"
                >{{ t('common.viewDetails') }}</div
              >
            </template>
            <template v-if="column.dataIndex === 'isOutsource'">
              <div class="table-a" @click="goOutsourcingList">{{ isOrNoFn(record.isOutsource) }}</div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <a-table
              v-if="record.bomList && record.bomList.length"
              :data-source="record.bomList"
              :columns="sub_columns"
              size="small"
              :pagination="false"
              :scroll="{ y: '400px' }"
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
                <template v-if="column.dataIndex === 'isOutsource'">
                  <div class="table-a" @click="goOutsourcingList">{{ isOrNoFn(record.isOutsource) }}</div>
                </template>
                <template v-if="column.dataIndex === 'issueTime'">
                  <div>{{ dayjs(record.issueTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
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
    <PreviewModal ref="filePreviewRef" />
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
  import { ref } from 'vue';
  import { moldpartplanExport, moldpartplanIssue, getElectrodepage, issueelectrodeplan } from '/@/api/engineering/mould';
  import { schemas, columns, sub_columns } from '../config';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import OutsourceModal from '/@/views/engineering/mouldRoom/codeEngineering/components/outsourceModal.vue';
  import { message } from 'ant-design-vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';

  const filePreviewRef = ref<ModalComponent | null>(null);

  const { t } = useI18n();
  const router = useRouter();

  const { createConfirm } = useMessage();

  const emits = defineEmits(['machiningPlan']);

  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerOutsource, { openModal: openOutsource }] = useModal();
  const [registerTable, { getSelectRows, reload, getSelectRowKeys, getDataSource, expandRows }] = useTable({
    api: getElectrodepage,
    title: '',
    columns: columns,
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
      moduleCode: 'MoldPartPlanColumn', // 字典分类EnCode
    },
  });

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
        onClick: issueelectrodeplanFn.bind(null, record),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
      },
    ];
  }

  const issueelectrodeplanFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await issueelectrodeplan(record.id);
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
        subKeys = subKeys.concat(o.subSelectedRowKeys);
      }
    });
    const ids = [...subKeys].filter(item => !!item);
    return ids;
  }

  function getSelect() {
    return {
      parent: getDataSource().filter(o => {
        return o.subSelectedRowKeys?.length;
      }),
      children: getDataSource()
        .map(item => item.bomList.filter(bom => getAllSelectKeys('id').includes(bom.id)))
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

  const goEditFn = (record: any, level: string) => {
    emits('machiningPlan', { type: 'edit', record, level, isElectrodeSchedule: true });
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
