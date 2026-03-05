<template>
  <a-tabs v-model:activeKey="state.groupType" class="group-tab h-full">
    <a-tab-pane key="2" :tab="t('common.skuGroup')" class="h-full">
      <VxeBasicTable ref="tableRef2" v-bind="gridOptions2" style="width: 100%" @header-cell-dblclick="headerCellDblclick" @filter-change="handleFilterChange">
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </VxeBasicTable>
    </a-tab-pane>
    <a-tab-pane key="1" :tab="t('common.customerGroup')" class="h-full">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" style="width: 100%" @header-cell-dblclick="headerCellDblclick" @filter-change="handleFilterChange">
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </VxeBasicTable>
    </a-tab-pane>
    <template #rightExtra>
      <AddCustomRows v-if="props.updateType != 'listView'" @submit="handleAdd"></AddCustomRows>
    </template>
  </a-tabs>
</template>

<script lang="ts" setup>
  import { reactive, watch, ref, nextTick } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getProjectMembersSonConfig,
    updateProjectMembersTeamList,
    deleteProjectMembersTeamList,
    getProjectMembersTeamList,
  } from '/@/api/business/projectMember';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { setTableList, setDynamicTitle, randomRange } from '../utils';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '/@/components/VxeTable';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const { t } = useI18n();

  const props = defineProps({
    updateType: {
      type: String,
      default: '',
    },
    ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
    mainProcess: {
      type: String || Number,
      default: '',
    },
    reload: {
      type: Number,
      default: 1,
    },
    teamType: {
      type: String || Number,
      default: 1,
    },
  });

  const state = reactive<any>({
    type: 'add',
    groupType: '2',
    line: '1',
    loading: false,
    materialPartsNumberList: [],
    factoryList: [],
    insideProjectCodeList: [],
    column: [],
    initColumn: [
      {
        title: t('common.groupName'),
        field: 'groupConfigName',
        width: 200,
        showOverflow: props.updateType == 'listView',
        editRender: {
          name: 'AInput',
        },
        ...(props.updateType == 'listView' ? { filters: [{ data: '' }], filterRender: { name: 'Input' } } : {}),
      },
    ],
  });

  // 表格引用
  const tableRef = ref<VxeGridInstance>();
  const tableRef2 = ref<VxeGridInstance>();

  function getTableActions(row): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
      },
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, row),
        },
      },
    ];
  }

  const commonOptions: BasicTableProps = {
    mouseConfig: {
      area: false,
      extension: false,
    },
    keepSource: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
    columns: state.initColumn,
    columnConfig: {
      resizable: true,
    },
    rowConfig: {
      useKey: true,
      keyField: 'id',
    },
    editRules: {
      groupConfigName: [
        {
          required: true,
          message: t('common.inputText'),
          trigger: 'blur',
        },
      ],
    },
    data: [],
    formConfig: {
      enabled: false,
    },
    height: 'auto',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    scrollX: {
      enabled: true,
    },
    pagerConfig: {
      enabled: false,
    },
  };

  const gridOptions = reactive<BasicTableProps>({
    ...commonOptions,
  });
  const gridOptions2 = reactive({
    ...commonOptions,
  });

  function getDataSource(type?: string | number) {
    const _type = type || state.groupType;
    if (_type == 1) {
      return tableRef.value?.getTableData().fullData || [];
    }
    return tableRef2.value?.getTableData().fullData || [];
  }

  async function handleDelete(row) {
    const { groupType } = state;
    const _item = row;
    if (_item.id.indexOf('index_') < 0) {
      // 调用接口
      const r = await deleteProjectMembersTeamList(_item.id);
      if (r.code !== 200) {
        message.success(t('sys.api.operationSuccess'));
        return false;
      }
    }

    // 删除行
    if (groupType == 1) {
      tableRef.value?.remove(_item);
    } else {
      tableRef2.value?.remove(_item);
    }
    if (!getDataSource().length) {
      handleAdd(1);
    }
  }

  // 双击表头：整列复制首行
  function headerCellDblclick({ column }) {
    if (props.updateType == 'listView') {
      // 浏览模式下不做处理
      return;
    }
    if (column.field == 'groupConfigName') {
      return;
    }
    const data = getDataSource();
    if (data.length) {
      const FieldKeyName = column.field;
      const FieldKeyId = column.field.replace('_Name', '');
      const fieldValueName = data[0][FieldKeyName];
      const fieldValueId = data[0][FieldKeyId];
      data.forEach(item => {
        item[FieldKeyName] = fieldValueName;
        item[FieldKeyId] = fieldValueId;
        const kName = FieldKeyId + '__obj';
        item._dynamic = {
          ...item._dynamic,
          [kName]: {
            configColumnName: column.title,
            configType: FieldKeyId,
            memberId: fieldValueId,
            memberName: fieldValueName,
          },
        };
      });
    }
  }

  function handleAdd(number) {
    const len = typeof number === 'number' ? number : state.line;
    for (let i = 0; i < len; i++) {
      if (state.groupType == '1') {
        tableRef.value?.insertAt({ id: 'index_' }, -1);
      } else {
        tableRef2.value?.insertAt({ id: 'index_' }, -1);
      }
    }
  }

  function handleCopy(row) {
    const _item: any = cloneDeep(row);
    _item.id = 'index_' + randomRange(10, 22);
    const _list = getDataSource();
    const rowIndex = _list.findIndex(item => item.id === row.id);
    const newIndex = rowIndex == _list.length - 1 ? -1 : rowIndex + 1;
    if (state.groupType == '1') {
      tableRef.value?.insertAt(_item, newIndex);
    } else {
      tableRef2.value?.insertAt(_item, newIndex);
    }
  }

  function getItem() {
    return {
      id: 'index_' + randomRange(10, 22),
      _dynamic: {},
    };
  }

  // 设置参数查询和返回数据处理
  async function getDetail(groupType, filterParams: any = {}) {
    state.loading = true;

    const params: any = {
      mainProcess: props.mainProcess,
      teamType: props.teamType,
      groupType,
      ...filterParams,
    };

    // 非 listView 模式下，如果没传 creatorUserId，默认按当前人过滤
    if (props.updateType !== 'listView' && !params.creatorUserId) {
      params.creatorUserId = userStore.getUserInfo.userId;
    }

    try {
      const r = await getProjectMembersTeamList(params);
      const view = props.updateType !== 'listView';

      const tableData = r.data.length ? setTableList(r.data, { editable: view, tableView: !view }) : [getItem()];

      if (groupType === 1) {
        gridOptions.data = tableData;
      } else {
        gridOptions2.data = tableData;
      }
    } finally {
      await nextTick();
      state.loading = false;
    }
  }

  watch(
    () => [props.reload],
    () => {
      init();
    },
  );

  async function init() {
    state.loading = true;

    // 浏览-单选模式（listView）
    if (props.updateType == 'listView') {
      gridOptions.editConfig = {
        enabled: false,
      };
      gridOptions.checkboxConfig = {
        checkField: 'isChecked',
        indeterminateField: 'isIndeterminate',
      };
      gridOptions.columns?.splice(0, 0, {
        type: 'radio',
        field: 'raios',
        width: 50,
      });

      gridOptions2.editConfig = {
        enabled: false,
      };
      gridOptions2.checkboxConfig = {
        checkField: 'isChecked',
        indeterminateField: 'isIndeterminate',
      };
    } else {
      // 编辑模式
      gridOptions.columns?.push({
        title: t('common.action'),
        field: 'action',
        slots: { default: 'action' },
        width: 100,
        fixed: 'right',
      });
    }

    await getDyamicTitleByMainProcess();

    //在 listView 模式下，初始化时按“当前登录人=创建人”过滤
    const creatorUserId = userStore.getUserInfo?.userId;
    const defaultFilter = props.updateType === 'listView' && creatorUserId ? { creatorUserId } : {};

    getDetail(1, defaultFilter);
    getDetail(2, defaultFilter);
  }

  // 设置初始列
  function setInitVal(sourceList) {
    const d = setDynamicTitle(sourceList);
    const creatorId = userStore.getUserInfo?.userId || '';

    let _column = state.initColumn
      .concat({
        title: '创建人',
        field: 'creatorUserName',
        i18nField: 'CommonCol.applyUser',
        width: 200,
        //listView 模式下也默认带当前登录人作为 filter.data
        filters: [
          {
            data: creatorId,
          },
        ],
        filterRender: {
          name: 'CustomUserSelect',
          props: {
            style: 'width: 200px',
          },
        },
      })
      .concat(d.column);

    gridOptions.columns = _column;
    gridOptions2.columns = _column;
  }

  // 获取表头
  async function getDyamicTitleByMainProcess() {
    const res = await getProjectMembersSonConfig({
      mainProcess: props.mainProcess,
      teamType: props.teamType,
    });
    const { data } = res;
    setInitVal(
      data.reduce((pre, cur) => {
        return pre.concat(cur.configList);
      }, []),
    );
  }

  function setFormat(groupType) {
    const _list = cloneDeep(getDataSource(groupType));
    // 校验: 如果只有一行数据，且没有数据，则清空该列表；
    if (_list.length == 1) {
      const { groupConfigName } = _list[0];
      if (!groupConfigName) {
        _list.splice(0, 1);
        return [];
      }
    }
    return _list.map((item: any) => {
      const memberConfigList: any = [];
      for (let k in item._dynamic) {
        if (k.indexOf('__obj') > 0) {
          memberConfigList.push({
            ...item._dynamic[k],
          });
          delete item._dynamic[k];
        }
      }
      item.memberConfigList = memberConfigList;
      if (item.id.indexOf('index_') > -1) {
        delete item.id;
      }
      item.mainProcess = props.mainProcess;
      item.teamType = props.teamType;
      item.groupType = groupType;
      return item;
    });
  }

  const emit = defineEmits(['ok', 'error']);

  function handleValidate(list) {
    // 校验是否有空的项目组名称
    for (let i = 0; i < list.length; i++) {
      const { groupConfigName } = list[i];
      if (!groupConfigName) {
        message.info(t('common.inputPlaceholder') + t('common.groupName'));
        return false;
      }
    }
    return true;
  }

  function handleSave() {
    const list = setFormat(1);
    const list2 = setFormat(2);
    const valid = handleValidate(list);
    const valid2 = handleValidate(list2);
    if (!valid || !valid2) {
      return emit('error');
    }
    updateProjectMembersTeamList(list.concat(list2))
      .then(() => {
        message.success(t('sys.api.operationSuccess'));
        emit('ok');
      })
      .catch(() => {
        emit('error');
      });
  }

  function getSelectGroup() {
    const Customeritems = tableRef.value?.getRadioRecord() || null;
    const Skuitems = tableRef2.value?.getRadioRecord() || null;
    if (!Customeritems && !Skuitems) {
      message.info(t('common.selectText'));
      return false;
    }
    const params: any = {};
    if (Skuitems) params.skuTeamId = Skuitems.id;
    if (Customeritems) params.customerTeamId = Customeritems.id;
    return params;
  }

  function handleFilterChange(params: any) {
    const filterParams: any = {};
    if (params.field === 'creatorUserName') {
      // creatorUserName 筛选时，转换为 creatorUserId 传给后端
      filterParams['creatorUserId'] = params.datas.join(',');
    } else {
      filterParams[params.field] = Array.isArray(params.datas) ? params.datas.join('') : params.datas || '';
    }
    return getDetail(state.groupType, filterParams);
  }

  defineExpose({
    saveMateria: handleSave,
    getSelectGroup: getSelectGroup,
  });
</script>

<style lang="less">
  .group-tab {
    .ant-tabs-content {
      height: 100%;

      & > div {
        height: 100%;
      }
    }

    .ant-tabs-nav {
      margin: 0 !important;
    }
  }
</style>

<style lang="less" scoped>
  :deep(.ant-select) {
    width: 100%;
  }
</style>
