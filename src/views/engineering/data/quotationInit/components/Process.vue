<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <div>
          <div style="display: flex; flex-direction: row; justify-content: space-between">
            <a-space>
              <Subtitle :title="props.title" id="process" />
              <div v-if="hasBtnP('price-process')" class="total">
                {{ t('dict.QuotationColumn.totalExpenses') }}:
                <p>{{
                  tableList
                    .reduce((pre, next) => {
                      pre += Number(next.actualManufacturingCost);
                      return pre;
                    }, 0)
                    .toFixed(2)
                }}</p></div
              >
            </a-space>
            <AddCustomRows :defaultValue="2" @submit="addRow({ rows: $event })" />
          </div>
          <BasicTable @register="registerTable" :dataSource="state.tempList" :style="getTableStyle()">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.compType == 'Input'">
                <template v-if="column.dataIndex === 'materialTypeFromManufacturer'">
                  <lydc-input
                    v-if="!props.detailed"
                    :disabled="!!state.tableList[index]['insideCode'] ? true : column?.disabled"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    :placeholder="column.placeholder || t('common.inputText')" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else>
                  <lydc-input
                    v-if="!props.detailed"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :disabled="column?.disabled" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
              </template>
              <template v-if="column.compType == 'InputNumber'">
                <template v-if="column.dataIndex === 'utilizationRate' || column.dataIndex === 'yield' || column.dataIndex === 'fpy'">
                  <LydcInputNumber
                    v-if="!props.detailed"
                    @change="calcValues(index)"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :disabled="column?.disabled"
                    :rate="true" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else>
                  <LydcInputNumber
                    v-if="!props.detailed"
                    @change="calcValues(index)"
                    :precision="column?.precision"
                    :step="column?.step"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :disabled="column?.disabled" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
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
                    :autoSelect="column.dataIndex === 'processCode'"
                    :disabled="column?.disabled"
                    :params="column.beforeParams ? column.beforeParams(state.tableList[index]) : {}"
                    :value="state.tableList[index][column.dataIndex]"
                    result-field="data"
                    :name-format="column.nameFormat ? column.nameFormat : []"
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
                  :placeholder="t('common.chooseText')"
                  :allowClear="true"
                  show-search
                  @change="(id, data) => onUserIdChange(id, data, index, column)">
                </lydc-custom-user-select>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <TableAction :actions="getTableActions(index)" />
              </template>
            </template>
            <template #summary>
              <a-table-summary fixed="bottom">
                <a-table-summary-row>
                  <a-table-summary-cell :index="0" :col-span="4">合计: </a-table-summary-cell>
                  <a-table-summary-cell :index="4" :col-span="3"
                    >{{
                      subtract(
                        bignumber(100),
                        state.tableList.reduce((pre, next) => {
                          pre = add(subtract(bignumber(100), bignumber(next.yield || 100)), pre);
                          console.log(pre);
                          return pre;
                        }, bignumber(0)),
                      )
                        .toNumber()
                        .toFixed(2)
                    }}%
                  </a-table-summary-cell>
                </a-table-summary-row>
              </a-table-summary>
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
  import { isString } from '/@/utils/is';
  import { add, bignumber, divide, multiply, subtract } from 'mathjs';
  import { getLaborRateList } from '/@/api/engineering/quotatios';
  import { cloneDeep } from 'lodash-es';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
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

  const emit = defineEmits(['getProcessData', 'register']);

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
    () => props.fieldsValue,
    (newValue, oldValue) => {
      calcValues(0);
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

  const [registerTable, { setColumns, setTableData, getColumns }] = useTable({
    columns: props.columns.filter(item => !item.show),
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    pagination: false,
    striped: true,
    // summaryFunc: handleSummary,
    // showSummary: true,
    isCanResizeParent: true,
    canResize: false, // 自适应高度
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'QuotationColumn',
    },
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

  function handleSummary(tableData: Recordable[]) {
    const totalNo = tableData.reduce((prev, next) => {
      prev += next.no;
      return prev;
    }, 0);
    return [
      {
        _row: '合计',
        _index: '平均值3',
        no: totalNo,
        colSpan: 3,
      },
      {
        _row: '合计',
        _index: '平均值1',
        no: totalNo,
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
    nextTick(() => {
      calcValues(0);
    });
  };

  function onUserIdChange(id, data, index, column) {
    // if (!id) {
    //   state.tableList[index][column.dataIndex] = '';
    //   state.tableList[index][column.extraKey] = '';
    //   return;
    // }
    // state.tableList[index][column.dataIndex] = id || '';
    // column?.extraKey && (state.tableList[index][column.extraKey] = data?.fullName || '');
  }

  function formatSelectValue(record, column) {
    const { dataIndex, options = [] } = column;
    const list = (options.length && options.filter(c => c.id == record[dataIndex])) || [];
    return list.length ? list[0].fullName : record[column.dataIndex] || '-';
  }

  const filterOption = (inputValue, option) => {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  async function onChange(index, column, e, option) {
    if (column.compType == 'Input') {
      state.tableList[index][column.dataIndex] = (e && e.target.value) || '';
    } else if (column.compType == 'Select') {
      if (column.mode == 'searchInput') {
        console.log(state.tableList[index], 'state.tableList[index]----------');
        // 获取需要带出的字段在数据
        console.log(column.assignFields, 'column.assignFields--------');
        console.log(option, 'option------');
        let fieldsObj = Object.keys(column.assignFields).reduce((acc, cur) => {
          // 遍历需要带出的字段，可以是assignFields的value，也可以是key
          acc[cur] = (option && option[column.assignFields[cur] || cur]) || '';
          return acc;
        }, {});
        if (column.dataIndex === 'processCode') {
          const { code, data } = await getLaborRateList({ workingProcedure: e });
          console.log('🚀 ~ onChange ~ data:---------------------- ', data);
          if (code == '200' && data.length > 0) {
            console.log(state.laborRateList);
            state.laborRateList = data[0].laborRateDetailedOutputs;
          } else {
            state.laborRateList = [];
          }
          // console.log("🚀 ~ onChange ~ state.laborRateList: ", state.laborRateList);
          // console.log(fieldsObj, 'before fieldsObj');

          // 折旧年限
          if (state.tableList[index]['periodOfDepreciation']) {
            const laborRate = state.laborRateList.find(item => item.laborRateType == state.tableList[index]['periodOfDepreciation']);
            fieldsObj = {
              ...fieldsObj,
              equipmentLaborRate: laborRate?.subtotals,
              fixedEquipmentRate: laborRate?.fixedCost,
              dynamicEquipmentRate: laborRate?.changeCost,
            };
          }
        }
        if (column.dataIndex === 'periodOfDepreciation') {
          const laborRate = state.laborRateList.find(item => item.laborRateType == e);
          fieldsObj = {
            ...fieldsObj,
            equipmentLaborRate: laborRate?.subtotals,
            fixedEquipmentRate: laborRate?.fixedCost,
            dynamicEquipmentRate: laborRate?.changeCost,
          };
        }
        if (fieldsObj.processCode?.startsWith('4') || fieldsObj.processCode?.startsWith('5')) {
          fieldsObj.utilizationRate = 100;
        } else {
          fieldsObj.utilizationRate = 90;
        }
        // 工费率
        console.log(fieldsObj, '------------fieldsObj---------');
        Object.keys(fieldsObj).forEach(key => {
          if (fieldsObj[key] === '' || fieldsObj[key] === undefined || fieldsObj[key] === null) {
            delete fieldsObj[key];
          }
        });

        console.log(fieldsObj, '------------fieldsObj---------');

        delete state.tableList[index].equipmentLaborRate;
        delete state.tableList[index].dynamicEquipmentRate;
        delete state.tableList[index].fixedEquipmentRate;
        state.tableList[index] = {
          ...state.tableList[index],
          [`${column.dataIndex}`]: e || '',
          ...fieldsObj, // 赋值需要带出的数据
        };
      } else {
        state.tableList[index][column.dataIndex] = e;
      }
    } else if (column.compType == 'Date') {
      state.tableList[index][column.dataIndex] = e || '';
    }
    calcValues(index);
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
    console.log('🚀 ~ calcValues ~ index: ', index);
    // const length = state.tableList.length;
    emit('getProcessData');
    state.tableList = state.tableList.map((item, index) => ({ ...item, seqNumber: index + 1 }));
    console.log('🚀 ~ calcValues ~ state.tableList: ', state.tableList);
    try {
      state.tableList.map((item, index) => {
        console.log('🚀 ~  ~ item------------: ', item);
        console.log('🚀 ~  ~ index-----------: ', index);
        // 还原直通率
        let fpy = state.tableList
          .filter((s, i) => s.seqNumber >= item.seqNumber) // 过滤出 seqNumber 大于等于 process.seqNumber 的元素
          .map(item => bignumber(item.yield) || bignumber(1))
          .reduce((a, b) => {
            return multiply(a, divide(b, 100));
          }, 1);

        state.tableList[index].fpy = multiply(fpy, bignumber(100)).toNumber().toFixed(2);

        // 人工成本 人工成本= 人工费 / 产能 * 人数
        // laborCost
        console.log('🚀 ~  ~ props.fieldsValue?.wageRate?.total && item.capacity: ', props.fieldsValue?.wageRate?.total && item.capacity);
        if (props.fieldsValue?.wageRate?.total && item.capacity) {
          const wageRate = bignumber(props.fieldsValue.wageRate.total);
          const laborCost = multiply(
            divide(wageRate, bignumber(item.capacity == Infinity || item.capacity == 0 ? 1 : item.capacity)),
            bignumber(item.numberOfUsers == Infinity ? 1 : item.numberOfUsers),
          ).toFixed(6);
          console.log('🚀 ~  ~ laborCost: ', laborCost);
          state.tableList[index].laborCost = parseFloat(laborCost);

          if (item.utilizationRate) {
            // 理论制造成本 理论制造成本=（设备工费率/产能+人工成本）/嫁动率
            console.log(item.equipmentLaborRate, 'item.equipmentLaborRate');
            console.log(item.capacity, 'item.capacity');
            console.log(item.laborCost, 'item.laborCost');
            console.log(item.utilizationRate, 'item.utilizationRate');
            const theoreticalManufacturingCost = divide(
              add(divide(item.equipmentLaborRate || 0, item.capacity), item.laborCost),
              divide(item.utilizationRate, 100),
            );
            state.tableList[index].theoreticalManufacturingCost = theoreticalManufacturingCost;
          }
          // 实际制造费用 实际制造费用2=（实际制造费用1+理论制造成本）*（1-制程良率）/制程良率+人工成本
          //                            0   +  23.671454154400024) * (1-0.95) /
          let actualManufacturingCostTotal = state.tableList
            .filter((s, i) => s.seqNumber < item.seqNumber) // 过滤出 seqNumber 大于等于 process.seqNumber 的元素
            .reduce((a, b) => add(bignumber(a), bignumber(b?.actualManufacturingCost || 0)), 0);
          const yie = divide(bignumber(item.yield), 100);
          const theoreticalManufacturingCost = bignumber(item.theoreticalManufacturingCost);
          // yield 制程良率
          // laborCost 人工成本
          // theoreticalManufacturingCost 理论制造成本

          // const actualManufacturingCost = evaluate(
          //   `(${actualManufacturingCostTotal} + ${theoreticalManufacturingCost}) * ( 1 - ${yie})/${yie} + ${laborCost}`,
          // );
          const actualManufacturingCost = add(
            multiply(add(actualManufacturingCostTotal, theoreticalManufacturingCost), divide(subtract(1, yie), yie)),
            theoreticalManufacturingCost,
          );
          // laborCost
          state.tableList[index].actualManufacturingCost = parseFloat(actualManufacturingCost.toFixed(6));
        }
      });
    } catch (e) {
      console.trace(e);
    }
    console.log('🚀 ~ calcValues ~ state.tableList-last: ', state.tableList);
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
        ? cloneDeep(props.list)
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
