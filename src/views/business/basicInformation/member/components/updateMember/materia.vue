<template>
  <div class="mb-30px">
    <div v-if="props.type == 'add'" class="flex" style="width: 200px; margin-bottom: 10px">
      <a-input-number v-model:value="state.line" :min="1" addon-before="添加" addon-after="行"></a-input-number
      ><a-button type="primary" @click="addColumn('materia')">添加</a-button>
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
        <template v-if="column.compType == 'ApiSelect'">
          <ApiSelect
            :api="getFactorylist"
            :show-search="true"
            :api-search="{
              show: true,
              searchName: 'code',
            }"
            :params="{ mainProcess: props.mainProcess }"
            v-model:value="state.tempList[index][column.dataIndex]"
            result-field="data"
            :value-field="column?.fieldNames?.value"
            :label-field="column?.fieldNames?.label"
            :nameFormat="column.nameFormat"
            :filter-option="false"
            :not-found-content="null"
            :immediate="true" />
        </template>
        <template v-if="column.editComponent == 'CustomUserSelect'">
          <lydc-custom-user-select
            v-model:value="state.tempList[index][column.dataIndex]"
            :label="state.tempList[index][column.dataIndex + 'Name']"
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
  import { getSonconfigtypelist, getFactorylist, checkidentical, getSlectOps, maintainSave, updateDetail, getDetail } from '/@/api/business/member';
  import { cloneDeep } from 'lodash-es';
  import { setDynamicTitle, setTableList } from '../config';
  import { message } from 'ant-design-vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  const t = useI18n();

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
    line: '1',
    dyamicKey: {}, // 动态字段
    tabeleSource: [{}],
    tempList: [{}],
    show: true,
    initColumn: [
      {
        title: '料件号',
        dataIndex: 'materialPartsNumber',
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
            type: 3,
            code: v,
            mainProcess: props.mainProcess,
          });
          if (r.code == 200) {
            state.materialPartsNumberList = r.data;
          }
        },
      },
      {
        title: '工厂',
        dataIndex: 'factoryId',
        compType: 'ApiSelect',
        mode: 'searchInput',
        fieldNames: {
          value: 'Id',
          label: 'Name',
        },
        nameFormat: ['Name', ' / ', 'Code'],
      },
    ],
    column: [],
  });

  const [registerTable] = useTable({
    rowKey: 'id',
    striped: true,
    useSearchForm: false, // 使用搜索表单
    bordered: true, // 显示表格边框
    showIndexColumn: false, // 显示序号
    pagination: false,
    canResize: true,
    showTableSetting: false,
    resizeHeightOffset: 20,
  });

  //  监听id变化时，更新数据
  watch(
    () => [props.ids],
    () => {
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
    const r = await getDetail(props.ids);
    state.tempList = [{}];
    state.tabeleSource = [{}];
    const d = setTableList(r.data);

    state.tempList = cloneDeep(d);
    state.tabeleSource = cloneDeep(d);
  }

  function setInitVal(sourceList) {
    const d = setDynamicTitle(sourceList);
    if (props.type == 'add') {
      state.dyamicKey = d.dynamicKeys;
      state.tabeleSource = [cloneDeep(d.dynamicKeys)];
      state.tempList = [cloneDeep(d.dynamicKeys)];
    }
    let _column: any = state.initColumn.concat(d.column);
    _column.push({
      title: '生产类型',
      dataIndex: 'productionType',
      compType: 'Select',
      width: 100,
      options: [
        {
          id: 1,
          fullName: '自制',
        },
        {
          id: 2,
          fullName: '外购',
        },
      ],
    });
    state.column = _column;
  }
  // 获取表头
  function getDyamicTitleByMainProcess() {
    getSonconfigtypelist(props.mainProcess).then(res => {
      setInitVal(res.data.materialPartsNumberConfigList);
    });
  }
  onMounted(() => {
    if (props.type == 'add') {
      getDyamicTitleByMainProcess();
    }
  });

  const addColumn = type => {
    const _Type = state;
    const _dyamicKey = state.dyamicKey;
    for (let k = 0; k < Number(_Type.line); k++) {
      _Type.tempList.push(cloneDeep(_dyamicKey));
      _Type.tabeleSource.push(cloneDeep(_dyamicKey));
    }
  };
  // 动态获取数据
  async function onChange(index, column, id, data) {
    state.tempList[index][column.dataIndex] = id;
    const { materialPartsNumber, factoryId } = state.tempList[index];
    await checkidentical({
      code: materialPartsNumber,
      factoryId: factoryId,
    });
  }

  // 获取onUserIdChange
  function onUserIdChange(id, data, index, column) {
    // 用户变动时，顺势填充到角色数组中
    const _item = state.tempList[index];
    const k = column.dataIndex + '__obj';
    if (_item[k]) {
      _item[k].memberId = data.id;
      _item[k].memberName = data.fullName;
    } else {
      _item[k] = {
        configColumnName: column.customTitle,
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
    // const KEYS = {
    //   materia: 'materialPartsNumber',
    //   customer: 'immediateCustomerId',
    // };
    return _list.filter((item, i) => {
      if (!item['materialPartsNumber']) {
        return false;
      }
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
  function handleSave() {
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
    methods(params)
      .then(res => {
        message.success(t('sys.api.operationSuccess'));
        state.loading = false;
        // 数据提交后清空数据
        state.tabeleSource = [{}];
        state.tempList = [{}];
        emit('reload');
      })
      .catch(() => {
        state.loading = false;
        emit('error');
      });
  }

  defineExpose({
    saveMateria: handleSave,
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
