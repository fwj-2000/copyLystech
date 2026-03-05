<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :title="state.title"
    destroyOnClose
    class="full-popup"
    @ok="handleSave">
    <div class="h-full p-10px approval-popup">
      <div class="flex justify-between align-middle mb-10px">
        <Subtitle style="padding-bottom: 0" :title="t('routes.customerService-information-fcAudit')"></Subtitle>
        <div v-if="state.mode == 'add'" class="flex">
          <div class="mr-3">
            <span>{{ t('dict.ApproverType') }}：</span>
            <LydcSelect
              v-model:value="state.approverType"
              :options="state.approverTypeList"
              :fieldNames="{
                value: 'enCode',
              }"
              @change="getDyamicTitleByApprover"
              style="width: 150px" />
          </div>
          <div class="mr-3">
            <span>{{ t('dict.MainProcess') }}: </span>
            <LydcSelect :value="state.mainProcess" :options="state.mainProcessList" @change="handleMainProcessChange" style="width: 150px" />
          </div>
          <AddCustomRows @submit="addColumn" />
        </div>
      </div>
      <Grid style="flex: 1" :gridEvents="{ headerCellDblclick: headerCellDblclick }">
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFcAuditConfigColumn, updateFcAudit, getFcAuditBulkDetail, addFcAudit } from '/@/api/customerSerivce/fcAudit';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { setTableList, setDynamicTitle, beforeSaveFormat } from '/@/components/CustomComponents/src/fc/utils';
  import { BasicTableProps } from '/@/components/VxeTable';
  import { listCols } from './tableConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { getFactoryList } from '/@/api/customerSerivce/index';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createConfirm } = useMessage();
  const { t } = useI18n();

  const state = reactive<any>({
    title: t('common.editText'),
    ids: [],
    loading: false,
    mainProcess: '1',
    approverType: '',
    approverTypeList: [],
    mode: 'add',
  });

  const emit = defineEmits(['reload', 'error', 'register']);
  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  // 初始化数据
  async function init(data) {
    state.ids = data.ids || [];
    state.approverType = data.approverType;
    state.approverTypeList = data.approverTypeList;
    state.mainProcessList = data.mainProcessList;
    state.mode = data.mode;
    state.title = state.mode == 'add' ? t('common.addText') : t('common.updateText');
    await getDyamicTitleByApprover();
    if (state.ids.length) {
      getDetail();
    } else {
      reloadData([{}]);
    }
  }

  const commonCols = [
    { type: 'checkbox', field: 'checkbox', width: 60 },
    {
      field: 'approverGroupName',
      title: t('common.groupName'),
      width: 200,
      editRender: {
        name: 'Input',
      },
    },
    {
      field: 'factory',
      title: t('dict.CommonCol.factoryName'),
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factoryName',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          beforeFetch: params => {
            const _params = params || {};
            _params.mainProcess = state.mainProcess;
            return _params;
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
          filterOption: false,
          immediate: true,
        },
      },
    },
  ];

  // 表格数据
  const commonOptions: BasicTableProps = {
    editConfig: { trigger: 'dblclick', mode: 'cell', showStatus: true },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    columns: commonCols,
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    pagerConfig: {
      enabled: false,
    },
    showIndexColumn: true,
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: commonOptions,
  });
  const { reloadColumn, reloadData, getDataSource, setLoading } = gridApi;
  // 设置参数查询和返回数据处理
  async function getDetail() {
    state.loading = true;
    const r = await getFcAuditBulkDetail(state.ids);
    const d = setTableList(r.data);
    let _data = d;
    if (!r.data.length) {
      _data = [{}];
    }
    reloadData(_data);
    state.loading = false;
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.addText'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }
  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 复制当前行
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  // 添加
  function addColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
      });
    }
    reloadData(list);
  }

  // 双击表头
  function headerCellDblclick({ column }) {
    // 匹配出不需要双击的字段
    const exIncludes = commonCols.concat(listCols).some(item => column.field == item.field);
    if (exIncludes) {
      return;
    }
    const data = getDataSource();
    if (data.length) {
      // 如果当前表头有数据的话，复制粘贴到该列所有数据
      let keyId = column.field;
      let keyName = keyId.replace('_Ids', '_Names');
      const fieldId = data[0][keyId];
      const fieldName = data[0][keyName];
      data.forEach(item => {
        item[keyName] = fieldName;
        item[keyId] = fieldId;
      });
    }
  }

  //  主要制程变动
  function handleMainProcessChange(e) {
    // 在变更前查询是否有填写工厂数据，若是有则弹出提示，更改主要制程会清空工厂数据，是否继续
    const list = getDataSource();
    const hasFactory = list.some(item => item.factory);
    if (hasFactory) {
      createConfirm({
        title: t('common.confirm'),
        content: '更改主要制程会清空工厂数据，是否继续?',
        iconType: 'info',
        onOk: () => {
          list.forEach(item => {
            item.factory = '';
            item.factoryName = '';
          });
          reloadData(list);
          state.mainProcess = e;
        },
        onCancel: () => {
          // 还原主要制程
          const _old = state.mainProcess;
          state.mainProcess = e;
          nextTick(() => {
            state.mainProcess = _old;
          });
        },
      });
    } else {
      state.mainProcess = e;
    }
  }

  // 获取表头
  async function getDyamicTitleByApprover() {
    setLoading(true);
    const res = await getFcAuditConfigColumn({
      approverType: state.approverType,
    });
    const { data } = res;
    const d = setDynamicTitle(data);
    let _column: any = cloneDeep(commonCols);
    // 编辑模式下，需要添加主要制程和审批类型
    if (state.mode == 'edit') {
      _column = _column.concat(listCols);
    } else {
      _column.unshift({
        title: '操作',
        field: 'action',
        width: 120,
        fixed: 'right',
        slots: { default: 'action' },
      });
    }
    _column = _column.concat(d.column);
    reloadColumn(_column);
    setLoading(false);
  }
  function handleSave() {
    // 转换数据，传给后端
    changeOkLoading(true);
    const list = beforeSaveFormat(cloneDeep(getDataSource()));
    let params;
    let method = state.mode == 'add' ? addFcAudit : updateFcAudit;
    if (state.mode == 'add') {
      params = {
        approverType: state.approverType,
        mainProcess: state.mainProcess,
        approverMaintenances: list,
      };
    } else {
      params = list;
    }
    method(params)
      .then(() => {
        message.success(t('sys.api.operationSuccess'));
        // 数据提交后清空数据
        emit('reload');
        closePopup();
        changeOkLoading(false);
      })
      .catch(() => {
        changeOkLoading(false);
        emit('error');
      });
  }
</script>
<style lang="less" scoped>
  .approval-popup {
    display: flex;
    flex-direction: column;
  }
</style>
