<template>
  <div class="mb-30px">
    <div v-if="props.type == 'add'" class="flex" style="width: 200px; margin-bottom: 10px">
      <a-input-number v-model:value="state.line" :min="1" addon-before="添加" addon-after="行"></a-input-number
      ><a-button type="primary" @click="addColumn">添加</a-button>
    </div>
    <BasicTable :columns="state.column" :data-source="state.tabeleSource" @register="registerTable">
      <template #headerCell="{ column }">
        <div @dblclick="dbClickTitle(column)">
          {{ column.customTitle }}
        </div>
      </template>
      <template #bodyCell="{ column, index }">
        <template v-if="column.compType == 'Select'">
          <lydc-select
            v-if="column.mode == 'searchInput'"
            v-model:value="state.tempList[index][column.dataIndex]"
            :fieldNames="column.fieldNames"
            :showArrow="false"
            allowClear
            show-search
            :filter-option="false"
            :not-found-content="null"
            :defaultActiveFirstOption="true"
            :options="state[column.opsName]"
            :disabled="column.disabled"
            @search="e => column.searchFunc(e)"
            @focus="column.searchFunc($event.target.value)"
            @change="(id, data) => onChange(index, column, id, data)" />
          <lydc-select v-else v-model:value="state.tempList[index][column.dataIndex]" :options="column.options"></lydc-select>
        </template>
        <template v-if="column.editComponent == 'CustomUserSelect'">
          <lydc-custom-user-select
            v-model:value="state.tempList[index][column.dataIndex]"
            :label="state.tempList[index][column.dataIndex + 'Name']"
            placeholder="选择人员"
            show-search
            @change="(id, data) => onUserIdChange(id, data, index, column)" />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, h, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSonconfigtypelist, getSlectOps, maintainSave, updateDetail, getDetail } from '/@/api/business/member';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { useMemberStore } from '/@/store/modules/projectMember';
  import { setDynamicTitle, setTableList } from '../config';
  const t = useI18n();
  const memberStore = useMemberStore();

  const props = defineProps({
    type: {
      type: String,
      default: 'add',
    },
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
    dyamicKey: {}, // 动态字段
    tabeleSource: [{}],
    tempList: [{}],
    line: '1',
    show: true,
    initColumn: [
      {
        title: '内部项目代码',
        dataIndex: 'insideProjectCode',
        disabled: props.type == 'update',
        compType: 'Select',
        mode: 'searchInput',
        fieldNames: {
          value: 'code',
          label: 'code',
        },
        opsName: 'materialPartsNumberList',
        searchFunc: async v => {
          // 动态获取数据
          const r = await getSlectOps({
            type: 1,
            code: v,
            mainProcess: props.mainProcess,
          });
          if (r.code == 200) {
            state.materialPartsNumberList = r.data;
          }
        },
      },
    ],
    column: [],
    materia: {},
  });

  const [registerTable, { setProps }] = useTable({
    rowKey: 'id',
    striped: true,
    useSearchForm: false, // 使用搜索表单
    bordered: true, // 显示表格边框
    showIndexColumn: false, // 显示序号
    pagination: false,
    canResize: true,
    showTableSetting: false,
    scroll: {
      y: 600,
    },
  });

  //  监听id变化时，更新数据
  watch(
    () => [props.ids],
    () => {
      state.show = true;
      getDataDetail();
      getDyamicTitleByMainProcess();
    },
  );
  watch(
    () => [props.reload, props.mainProcess],
    () => {
      getDyamicTitleByMainProcess();
    },
  );

  // 获取详情
  async function getDataDetail() {
    setProps({
      loading: true,
    });
    const r = await getDetail(props.ids);
    const d = setTableList(r.data);
    state.tempList = [{}];
    state.tabeleSource = [{}];
    state.tempList = cloneDeep(d);
    state.tabeleSource = cloneDeep(d);
    setProps({
      loading: false,
    });
  }

  // 设置初始化
  function setInitVal(sourceList) {
    const d = setDynamicTitle(sourceList);
    if (props.type == 'add') {
      state.dyamicKey = d.dynamicKeys;
      state.tabeleSource = [cloneDeep(d.dynamicKeys)];
      state.tempList = [cloneDeep(d.dynamicKeys)];
    }

    let _column: any = state.initColumn.concat(d.column);
    state.column = _column;
  }
  // 获取表头
  function getDyamicTitleByMainProcess() {
    getSonconfigtypelist(props.mainProcess).then(res => {
      setInitVal(res.data.insideProjectCodeConfigList);
    });
  }
  onMounted(() => {
    if (props.type == 'add') {
      getDyamicTitleByMainProcess();
    }
  });

  const addColumn = type => {
    const _Type = state[type];
    const _dyamicKey = _Type.dyamicKey;
    for (let k = 0; k < Number(_Type.line); k++) {
      _Type.tempList.push(cloneDeep(_dyamicKey));
      _Type.tabeleSource.push(cloneDeep(_dyamicKey));
    }
  };
  // 动态获取数据
  async function onChange(index, column, id, data) {
    state.tempList[index][column.dataIndex] = id;
    // const { immediateCustomerId, insideProjectCode } = state.tempList[index];
    // await checkidentical({
    //   code: immediateCustomerId,
    //   insideProjectCode: insideProjectCode,
    // });
  }

  // 获取onUserIdChange
  function onUserIdChange(id, data, index, column) {
    // 用户变动时，顺势填充到角色数组中
    const _item = state.tempList[index];
    if (_item[column.dataIndex + '__obj']) {
      _item[column.dataIndex + '__obj'].memberId = data.id;
      _item[column.dataIndex + '__obj'].memberName = data.fullName;
    } else {
      _item[column.dataIndex + '__obj'] = {
        configColumnName: column.title,
        configType: column.dataIndex,
        memberId: data.id,
        memberName: data.fullName,
      };
    }
  }

  // 双击表头
  function dbClickTitle(column) {
    const { dataIndex } = column;
    if (dataIndex && state.tempList.length) {
      // 抓取出第一行的数据，赋值到其他行列去
      const data = state.tempList[0];
      const Id = data[dataIndex];
      const Name = data[dataIndex + 'Name'];
      state.tempList.forEach((el, index) => {
        if (index > 0) {
          el[dataIndex] = Id;
          el[dataIndex + 'Name'] = Name;
          const k = column.dataIndex + '__obj';
          el[k] = {
            configColumnName: column.customTitle,
            configType: column.dataIndex,
            memberId: Id,
            memberName: Name,
          };
          state.tabeleSource[index][dataIndex] = Id;
          state.tabeleSource[index][dataIndex + 'Name'] = Name;
        }
      });
    }
  }

  function setFormat() {
    const _list = cloneDeep(state.tempList);
    return _list.filter((item, i) => {
      const memberConfigList: any = [];
      for (let k in item) {
        if (k.indexOf('__obj') > 0) {
          memberConfigList.push({
            ...item[k],
          });
          delete item[k];
        }
      }
      item.memberConfigList = memberConfigList;
      return item;
    });
  }
  const emit = defineEmits(['reload', 'error']);
  async function handleSave() {
    state.loading = true;
    // 转换数据，传给后端
    let params = {
      mainProcess: props.mainProcess,
      projectMembersCrInputList: [],
    };
    let methods = props.type == 'add' ? maintainSave : updateDetail;
    if (props.type == 'add') {
      methods = maintainSave;
      params.projectMembersCrInputList = setFormat() || [];
      if (!params.projectMembersCrInputList.length) {
        state.loading = false;
        return message.info('请填写数据');
      }
    } else {
      methods = updateDetail;
      params = setFormat();
    }
    const { t } = useI18n();
    try {
      const res = await methods(params);
      message.success(t('sys.api.operationSuccess'));
      state.loading = false;
      // 数据提交后清空数据
      state.tabeleSource = [{}];
      state.tempList = [{}];
      emit('reload');
    } catch (error) {
      emit('error');
      state.loading = false;
    }
  }

  defineExpose({
    handleSave: handleSave,
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
