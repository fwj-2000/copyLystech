<template>
  <div>
    <BasicForm @register="registerForm">
      <template #formFooter>
        <a-button type="primary" class="ml-3" @click="search">查询</a-button>
        <a-button class="ml-3" @click="reset">重置</a-button>
      </template>
    </BasicForm>
  </div>
  <BasicTable :columns="state[memberStore.memberType].column" :loading="state.loading" @register="registerTable" @edit-change="onEditChange">
    <template #tableTitle>
      <a-button @click="addColumn">添加一行</a-button>
    </template>
    <template #headerCell="{ column }">
      <div @dblclick="dbClickTitle(column)">
        {{ column.customTitle }}
      </div>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.key == 'action'">
        <TableAction :actions="getTableActions(index, record)" />
      </template>
      <template v-if="column.editComponent == 'CustomUserSelect'">
        <lydc-custom-user-select
          v-model:value="record[column.dataIndex]"
          :label="record[column.dataIndex + 'Name']"
          placeholder="选择人员"
          show-search
          @change="(id, data) => onEditChange({ column, value: id, record, data: [data], index })" />
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSonconfigtypelist, getFactorylist, saveTeam, delTeam, getTeamList } from '/@/api/business/member';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { useMemberStore } from '/@/store/modules/projectMember';
  import { setTableList, setDynamicTitle, randomRange } from '../config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();
  const memberStore = useMemberStore();
  const userStore = useUserStore();

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
  });

  const state = reactive({
    type: 'add',
    loading: false,
    materialPartsNumberList: [],
    factoryList: [],
    insideProjectCodeList: [],
    materia: {
      line: '1',
      dyamicKey: {}, // 动态字段
      show: true,
      initColumn: [
        {
          title: '项目组名称',
          dataIndex: 'teamName',
          compType: 'Input',
          editRow: true,
          editComponent: 'Input',
          editComponentProps: {
            placeholder: '项目组名称',
          },
        },
        {
          title: '工厂',
          dataIndex: props.updateType == 'listView' ? 'factory' : 'factoryId',
          editRow: true,
          editComponent: props.updateType == 'listView' ? 'Input' : 'ApiSelect',
          editComponentProps: {
            labelField: 'Name',
            valueField: 'Id',
            showSearch: true,
            api: async v => {
              const r = await getFactorylist({
                mainProcess: memberStore.mainProcess,
                code: v,
              });
              if (r.code == 200) {
                return r.data.map(el => {
                  el.Name = el.Name + '/' + el.Code;
                  return el;
                });
              }
            },
          },
        },
      ],
      column: [],
    },
    customer: {
      line: '1',
      dyamicKey: {}, // 动态字段
      show: true,
      initColumn: [
        {
          title: '项目组名称',
          dataIndex: 'teamName',
          compType: 'Input',
          editRow: true,
          editComponent: 'Input',
          editComponentProps: {
            placeholder: '项目组名称',
          },
        },
      ],
      column: [],
    },
    innerCode: {
      line: '1',
      dyamicKey: {}, // 动态字段
      show: true,
      initColumn: [
        {
          title: '项目组名称',
          dataIndex: 'teamName',
          compType: 'Input',
          editRow: true,
          editComponent: 'Input',
          editComponentProps: {
            placeholder: '项目组名称',
          },
        },
      ],
      column: [],
    },
    tempList: [{}],
    tableList: [{}],
  });
  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    schemas: [
      {
        field: 'teamName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入项目项目组名称',
          submitOnPressEnter: true,
        },
      },
      {
        field: 'factoryId',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: getFactorylist,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          labelField: 'Name',
          valueField: 'Id',
          resultField: 'data',
          params: { mainProcess: props.mainProcess || '1' },
          nameFormat: ['Name', '/', 'Code'],
          showSearch: true,
          immediate: false,
          filterOption: false,
          placeholder: '请选择工厂',
        },
      },
      {
        field: 'memberConfigJson',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '请选择配置角色',
        },
      },
      {
        field: 'member',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入成员名称',
        },
      },
      {
        field: 'creatorUserId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '请选择创建人员',
          showSearch: true,
        },
      },
    ],
  });
  const tabelConfig: any = {
    rowKey: 'id',
    striped: true,
    useSearchForm: false, // 使用搜索表单
    bordered: true, // 显示表格边框
    showIndexColumn: false, // 显示序号
    pagination: false,
    canResize: true,
    showTableSetting: false,
    resizeHeightOffset: 80,
    scroll: {
      y: 500,
    },
  };
  const [
    registerTable,
    { setProps, getSelectRows, setTableData, deleteTableDataRecord, insertTableDataRecord, clearSelectedRowKeys, getDataSource, updateTableDataRecord },
  ] = useTable(tabelConfig);
  function getTableActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, index),
      },
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        // disabled: index < 1,
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }
  async function handleDelete(record) {
    const _item = record;
    if (_item.id.indexOf('index_') < 0) {
      // 调用接口
      const r = await delTeam(_item.id);
      if (r.code !== 200) {
        message.success(t('sys.api.operationSuccess'));
        return false;
      }
    }
    deleteTableDataRecord(_item.id);
    if (!getDataSource().length) {
      addColumn();
    }
  }
  function handleCopy(index) {
    const _data = getDataSource();
    const _item: any = cloneDeep(_data[index]);
    _item.id = 'index_' + randomRange(10, 22);
    const a = index + 1;
    insertTableDataRecord(_item, a);
  }
  const addColumn = () => {
    const _Type = state[memberStore.memberType];
    for (let k = 0; k < Number(_Type.line); k++) {
      const _obj = getItem();
      insertTableDataRecord(_obj);
    }
  };
  function onEditChange({ column, value, record, data }) {
    if (column.editComponent === 'CustomUserSelect') {
      console.log('----', data);
      data = data[0];
      const kName = column.dataIndex + '__obj';
      updateTableDataRecord(record.id, {
        _dynamic: {
          ...record._dynamic,
          [kName]: {
            configColumnName: column.customTitle,
            configType: column.dataIndex,
            memberId: data.id,
            memberName: data.fullName,
          },
        },
      });
    }
  }

  // 双击表头
  function dbClickTitle(column) {
    // const { dataIndex } = column;
    // const list = getDataSource();
    // console.log('dbl', column);
    // if (dataIndex && list.length) {
    //   // 抓取出第一行的数据，赋值到其他行列去
    //   const data = list[0];
    //   const Id = data[dataIndex];
    //   const Name = data[dataIndex + 'Name'];
    //   list.forEach((el, index) => {
    //     if (index > 0) {
    //       updateTableDataRecord(el.id, {
    //         [dataIndex]: Id,
    //         [dataIndex + 'Name']: Name,
    //       });
    //       // el[dataIndex] = Id;
    //       // el[dataIndex + 'Name'] = Name;
    //       // const k = column.dataIndex + '__obj';
    //       // el[k] = {
    //       //   configColumnName: column.customTitle,
    //       //   configType: column.dataIndex,
    //       //   memberId: Id,
    //       //   memberName: Name,
    //       // };
    //     }
    //   });
    // }
  }

  function getItem() {
    const _Type = state[memberStore.memberType];
    return {
      teamName: '',
      factoryId: '',
      id: 'index_' + randomRange(10, 22),
      _dynamic: {},
      editable: true,
      ..._Type.dyamicKey,
    };
  }

  // 设置参数查询和返回数据处理
  async function getDetail() {
    state.loading = true;
    const params: any = {
      ...getFieldsValue(),
      configType: memberStore.configType,
    };
    if (params.memberConfigJson && params.member) {
      params.memberConfigJson = params.memberConfigJson + '-' + params.member;
    }
    if (!params.memberConfigJson && params.member) {
      params.memberConfigJson = params.member;
    }
    const r = await getTeamList(params);
    const view = props.updateType != 'listView';
    const d = setTableList(r.data, { editable: view, tableView: !view });
    let _data = d;
    if (!r.data.length) {
      const _obj = getItem();
      _data = [_obj];
    }
    setTableData(_data);
    state.loading = false;
  }

  watch(
    () => [props.reload],
    () => {
      init();
    },
  );
  async function init() {
    state.loading = true;
    if (props.updateType == 'listView') {
      setProps({
        rowSelection: { type: 'radio' },
      });
    } else {
      setProps({
        actionColumn: {
          width: 100,
          title: t('common.action'),
          dataIndex: 'action',
        },
      });
    }
    updateSchema({
      field: 'creatorUserId',
      defaultValue: userStore.getUserInfo.userId,
    });
    await getDyamicTitleByMainProcess();
    clearSelectedRowKeys();
    getDetail();
  }

  // 设置初始值
  function setInitVal(sourceList) {
    const type = memberStore.memberType;
    const view = props.updateType != 'listView';
    const d = setDynamicTitle(sourceList, { editable: view, tableView: !view });
    state[type].dyamicKey = d.dynamicKeys;
    let _column = state[type].initColumn.concat(d.column);
    state[type].column = _column;
    updateSchema({
      field: 'memberConfigJson',
      componentProps: {
        options: d.configTypeList,
      },
    });
  }
  // 获取表头
  async function getDyamicTitleByMainProcess() {
    const res = await getSonconfigtypelist(memberStore.mainProcess);
    switch (memberStore.memberType) {
      case 'materia':
        setInitVal(res.data.materialPartsNumberConfigList);
        break;
      case 'customer':
        setInitVal(res.data.immediateCustomerCodeConfigList);
        break;
      case 'innerCode':
        setInitVal(res.data.insideProjectCodeConfigList);
        break;
    }
  }
  function setFormat() {
    const _list = cloneDeep(getDataSource());
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
        item.id = '';
      }
      return item;
    });
  }
  const emit = defineEmits(['ok', 'error']);
  function handleSave() {
    // 转换数据，传给后端
    const { t } = useI18n();
    saveTeam(setFormat(), memberStore.configType)
      .then(() => {
        message.success(t('sys.api.operationSuccess'));
        // 数据提交后清空数据
        emit('ok');
      })
      .catch(() => {
        emit('error');
      });
  }
  function search() {
    getDetail();
  }
  function reset() {
    resetFields().then(() => {
      setTimeout(() => {
        getDetail();
      }, 0);
    });
  }
  function getSelectGroup() {
    const item = getSelectRows();
    if (!item.length) {
      message.info('未选择数据');
      return false;
    }
    return item;
  }
  defineExpose({
    saveMateria: handleSave,
    getSelectGroup: getSelectGroup,
  });
</script>
<style lang="less" scope>
  .footer {
    display: flex;
    justify-content: flex-end;
    position: sticky;
    bottom: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #e9e9e9;
    padding: 20px;
    width: 100%;
  }
</style>
