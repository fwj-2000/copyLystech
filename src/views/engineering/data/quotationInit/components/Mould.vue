<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <div>
          <div style="display: flex; flex-direction: row; justify-content: space-between">
            <a-space>
              <Subtitle :title="props.title" id="mould" />
              <div v-if="hasBtnP('price-mould')" class="total"
                >{{ t('dict.QuotationColumn.totalExpenses') }}:
                <p>{{
                  divide(
                    bignumber(
                      tableList.reduce((pre, next) => {
                        pre += Number(next.cost || 0);
                        return pre;
                      }, 0),
                    ),
                    bignumber(1),
                  ).toString()
                }}</p></div
              >
            </a-space>
            <AddCustomRows :defaultValue="2" @submit="addRow({ rows: $event })" />
          </div>
          <BasicTable @register="registerTable" :dataSource="state.tempList" :style="getTableStyle()">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.compType == 'Input'">
                <lydc-input
                  v-if="!props.detailed"
                  @change="calcValues(index)"
                  v-model:value="state.tableList[index][column.dataIndex]"
                  :placeholder="column.placeholder || t('common.inputText')"
                  :disabled="column?.disabled" />
                <div v-else>{{ record[column.dataIndex] || '-' }}</div>
              </template>
              <template v-if="column.compType == 'InputNumber'">
                <LydcInputNumber
                  v-if="!props.detailed"
                  @change="calcValues(index)"
                  v-model:value="state.tableList[index][column.dataIndex]"
                  :placeholder="column.placeholder || t('common.inputText')"
                  :disabled="column?.disabled" />
                <div v-else>{{ record[column.dataIndex] || '-' }}</div>
              </template>
              <template v-if="column.compType == 'Date'">
                <lydc-date-picker
                  v-if="!props.detailed"
                  :value="formatDate(state.tableList[index][column.dataIndex])"
                  allowClear
                  format="YYYY-MM-DD"
                  :disabled="formatCompStatus(column, state.tableList[index])"
                  @change="onChange(index, column, $event, {})" />
                <div v-else>{{ state.tableList[index][column.dataIndex] || '-' }}</div>
              </template>
              <template v-if="column.compType == 'Select'">
                <template v-if="column.mode == 'searchInput'">
                  <ApiSelect
                    v-if="!props.detailed"
                    :api="column.searchFunc"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :show-search="true"
                    :api-search="{
                      show: true,
                      searchName: 'keyword',
                    }"
                    :params="column.beforeParams ? column.beforeParams(state.tableList[index]) : {}"
                    :value="state.tableList[index][column.dataIndex]"
                    result-field="data"
                    :label-field="column.fieldNames.label"
                    :value-field="column.fieldNames.value"
                    :filter-option="false"
                    :not-found-content="null"
                    @change="(value, option) => onChange(index, column, value, option)"
                    :immediate="true" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else>
                  <lydc-select
                    v-if="!props.detailed"
                    :disabled="column?.disabled"
                    :value="state.tableList[index][column.dataIndex]"
                    :options="column.options"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :fieldNames="column.fieldNames"
                    @change="onChange(index, column, $event, {})" />
                  <div v-else>{{ formatSelectValue(record, column) }}</div>
                </template>
              </template>
              <template v-if="column.compType == 'UserSelect'">
                <!--                <lydc-user-select-->
                <!--                  v-model:value="state['tableList'][index][column.dataIndex]"-->
                <!--                  :multiple="false"-->
                <!--                  placeholder="选择人员"-->
                <!--                  @change="(id, data) => onUserIdChange(id, data, index, column)" />-->
                <lydc-custom-user-select
                  v-model:value="state['tableList'][index][column.dataIndex]"
                  :placeholder="t('common.selectText')"
                  :allowClear="true"
                  show-search
                  @change="(id, data) => onUserIdChange(id, data, index, column)">
                </lydc-custom-user-select>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <TableAction :actions="getTableActions(index)" />
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, reactive, toRefs, watch } from 'vue';
  import { ActionItem, BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { formatTableDefaultText } from '/@/utils';
  import dayjs from 'dayjs';
  import { debounce } from '/@/utils/debounce';
  import { isString } from '/@/utils/is';
  import { bignumber, divide } from 'mathjs';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { cloneDeep } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';

  defineOptions({ name: 'enginee-table' });

  const props = defineProps({
    columns: {
      type: Array as PropType<BasicColumn[]>,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array as PropType<Recordable[]>,
      default: () => [] as any[],
    },
    detailed: {
      type: Boolean,
      default: false,
    },
    extraText: {
      type: String,
      default: '',
    },
    tableHeight: {
      type: [String, Number],
      default: 0,
    },
    tableScrollHeight: {
      type: [String, Number],
      default: 300,
    },
    fieldsValue: {
      type: Object,
    },
  });
  const { hasBtnP } = usePermission();

  interface State {
    activeKey: string;
    keyword: string;
    startTime: number;
    endTime: number;
    visible: Boolean;
    detailData: any;
    tableList: any[];
    tempList: any[];
    searchRsList: any[];
    laborRateList: any[];
  }

  const state = reactive<State>({
    activeKey: '1',
    keyword: '',
    startTime: 0,
    endTime: 0,
    visible: false,
    detailData: {},
    tableList: [],
    tempList: [],
    searchRsList: [],
    laborRateList: [],
  });

  const { tableList } = toRefs(state);

  const { t } = useI18n();

  watch(
    () => props.detailed,
    val => {
      val &&
        nextTick(() => {
          const tempColumns: BasicColumn[] = props.columns;
          setTableData(state.tempList);
        });
    },
    { immediate: true },
  );

  watch(
    () => props.fieldsValue,
    (newValue, oldValue) => {
      console.log('fieldsValue changed:', newValue);
      console.log(state.tableList);
    },
    { deep: true },
  );

  const actionColumn = {
    title: t('common.action'),
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right',
  };

  // const defaultColumns: BasicColumn[] = [];
  const [registerTable, { setColumns, setTableData }] = useTable({
    columns: props.columns.filter(item => !item.show),
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    pagination: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false, // 自适应高度
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function getTableActions(index): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAdd.bind(null, index),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, index),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, index),
        },
      },
    ];
  }

  const getTableStyle = () => {
    if (!props.tableHeight) return {};
    return {
      height: isString(props.tableHeight) ? props.tableHeight : props.tableHeight + 'px',
    };
  };

  const getColumn = columnList => {
    const tempObj = {};
    columnList.forEach(item => {
      if (item.dataIndex !== 'action') {
        tempObj[item.dataIndex] = item.defaultValue || null;
      }
    });
    // console.log(tempObj, 'tempObj');
    return tempObj;
  };

  const getData = () => {
    return state.tableList;
  };

  const resetData = () => {
    state.tableList = [];
    state.tempList = [];
  };

  const setData = (index, key, value) => {
    state.tableList[index][key] = value;
  };

  const handleDelete = index => {
    console.log(index, 'record');
    state.tempList.splice(index, 1);
    state.tableList.splice(index, 1);
  };

  const handleAdd = index => {
    state.tempList.splice(index + 1, 0, getColumn(cloneDeep(props.columns)));
    state.tableList.splice(index + 1, 0, getColumn(cloneDeep(props.columns)));
  };
  const handleCopy = index => {
    const data = cloneDeep(state.tableList[index]);
    delete data.id;
    state.tempList.splice(index + 1, 0, cloneDeep(data));
    state.tableList.splice(index + 1, 0, cloneDeep(data));
  };

  function onUserIdChange(id, data, index, column) {
    console.log(id, data, index, column, 'id, data, index, column');
  }

  function formatSelectValue(record, column) {
    const { dataIndex, options = [] } = column;
    const list = (options.length && options.filter(c => c.id == record[dataIndex])) || [];
    return list.length ? list[0].fullName : record[column.dataIndex] || '-';
  }

  const filterOption = (inputValue, option) => {
    console.log(inputValue, option, 'inputValue, option');
    return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  const handleSearch = debounce(async (e = '', column) => {
    const res = await column.searchFunc(e);
    const { data } = res;
    state.searchRsList = data || res || [];
  }, 300);

  async function onChange(index, column, e, option) {
    console.log(index, column, e, option, 'index, column, e, option');
    if (column.compType == 'Input') {
      state.tableList[index][column.dataIndex] = (e && e.target.value) || '';
    } else if (column.compType == 'Select') {
      if (column.mode == 'searchInput') {
        // 获取需要带出的字段在数据
        let fieldsObj = Object.keys(column.assignFields).reduce((acc, cur) => {
          // 遍历需要带出的字段，可以是assignFields的value，也可以是key
          acc[cur] = (option && option[column.assignFields[cur] || cur]) || '';
          return acc;
        }, {});
        state.tableList[index] = {
          ...state.tableList[index],
          [`${column.dataIndex}`]: e || '',
          ...fieldsObj, // 赋值需要带出的数据
        };
      } else if (column.compType == 'Date') {
        state.tableList[index][column.dataIndex] = e || '';
      }
    }
  }

  const formatCompStatus = (column, record) => {
    const { NewMaterial } = record;
    return NewMaterial != 1;
  };
  const addRow = data => {
    for (let i = 0; i < data.rows; i++) {
      state.tempList.push({
        ...getColumn(props.columns),
      });
      state.tableList.push({
        ...getColumn(props.columns),
      });
    }
  };

  onMounted(() => {
    init();
  });

  const calcValues = index => {
    const length = state.tableList.length;
    state.tableList = state.tableList.map((item, index) => ({ ...item, seqNumber: index + 1 }));

    const moldLifespan = state.tableList[index].moldLifespan;
    const price = state.tableList[index].price;
    if (moldLifespan && price) {
      const bigCost = divide(bignumber(price), bignumber(moldLifespan));
      state.tableList[index].cost = parseFloat(bigCost.toFixed(6));
    }
  };

  async function init() {
    const tempColumns: BasicColumn[] = props.detailed ? props.columns : ([...props.columns, actionColumn] as any[]);
    setColumns(tempColumns.filter(item => !item.show));
    nextTick(() => {
      state.tempList = props.list.length
        ? cloneDeep(props.list)
        : props.detailed
        ? []
        : [
            {
              ...getColumn(props.columns),
            },
          ];
      state.tableList = props.list.length
        ? props.list
        : props.detailed
        ? []
        : [
            {
              ...getColumn(props.columns),
            },
          ];
      console.log(state.tableList);
      // setTableData(state.tempList);
    });
  }

  const formatViewData = (key, options) => {
    const arr = options.filter(c => c.id == key);
    return arr.length ? arr[0].fullName : '-';
  };

  const formatDate = val => {
    if (!val) return '';
    return dayjs(val).tz().valueOf();
  };

  defineExpose({ getData, resetData, setData, init });
</script>

<style lang="less" scoped>
  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  //:deep(.ant-form-item) {
  //  margin-bottom: 12px !important;
  //}
  //
  //:deep(.ant-form-item-label) {
  //  padding: 0;
  //}
  //
  //b {
  //  display: inline-block;
  //  margin-bottom: 8px;
  //}
  .total {
    display: flex;
    flex-direction: row;
    color: #1a1a1a;

    p {
      margin-left: 10px;
      color: #1890ff;
      font-weight: 700;
    }
  }
</style>
