<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <div>
          <div style="display: flex; flex-direction: row; justify-content: space-between">
            <a-space>
              <Subtitle :title="props.title" id="material" />
              <div v-if="hasBtnP('price-material')" class="total">
                {{ t('dict.QuotationColumn.costSubtotal') }}:
                <p>{{
                  round(
                    divide(
                      bignumber(
                        tableList.reduce((pre, next) => {
                          pre += Number(next.cost || 0);
                          return pre;
                        }, 0),
                      ),
                      bignumber(1),
                    ),
                    10,
                  ).toString()
                }}</p>
              </div>
              <!-- 实际价格合计改为： 隐藏不显示 -->
              <!-- <div v-if="hasBtnP('price-material')" class="total">
								{{ t('dict.QuotationColumn.costActual') }}:
								<p>{{
									divide(
										bignumber(
											tableList.reduce((pre, next) => {
												pre += Number(next.costActual || 0);
												return pre;
											}, 0),
										),
										bignumber(1),
									).toString()
								}}</p>
							</div> -->
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
                    @change="onChange(index, column, $event, {})"
                    :placeholder="column.placeholder || t('common.inputText')" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>

                <template v-else-if="column.dataIndex === 'eightCode'">
                  <lydc-input
                    v-if="!props.detailed"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    @change="
                      e => {
                        if (e) {
                          state.tableList[index]['originInsideCode'] = null;
                          state.tableList[index]['insideCode'] = '';
                        }
                      }
                    "
                    :placeholder="column.placeholder || t('common.inputText')"
                    :disabled="column?.disabled || !!state.tableList[index]['materialTypeFromManufacturer']" />
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
                <!--                <LydcInputNumber-->
                <!--                  v-if="!props.detailed"-->
                <!--                  @change="calcValues(index, column.dataIndex)"-->
                <!--                  v-model:value="state.tableList[index][column.dataIndex]"-->
                <!--                  :placeholder="column.placeholder || t('common.inputText')"-->
                <!--                  :disabled="column?.disabled" />-->
                <!--                <div v-else>{{ record[column.dataIndex] || '-' }}</div>-->
                <template v-if="column.dataIndex === 'singleProcessLosses'">
                  <LydcInputNumber
                    v-if="!props.detailed"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    @change="calcValues(index, column.dataIndex)"
                    :placeholder="column.placeholder || t('common.inputText')"
                    :disabled="true"
                    :rate="true" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else-if="column.dataIndex === 'wholeWidth' || column.dataIndex === 'wholeLength'">
                  <LydcInputNumber
                    v-if="!props.detailed"
                    :disabled="!!state.tableList[index]['insideCode'] || !!state.tableList[index]['materialTypeFromManufacturer']"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    :placeholder="column.placeholder || t('common.inputText')" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else-if="column.dataIndex === 'singleWidth'">
                  <LydcInputNumber
                    v-if="!props.detailed"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    @change="
                      () => {
                        nextTick(() => {
                          state.tableList[index]['originInsideCode'] = null;
                          state.tableList[index]['insideCode'] = null;
                          calcValues(index, column.dataIndex);
                        });
                      }
                    "
                    :placeholder="column.placeholder || t('common.inputText')" />
                  <div v-else>{{ record[column.dataIndex] || '-' }}</div>
                </template>
                <template v-else>
                  <LydcInputNumber
                    v-if="!props.detailed"
                    v-model:value="state.tableList[index][column.dataIndex]"
                    @change="calcValues(index, column.dataIndex)"
                    :rate="column.rate"
                    :placeholder="column.relevancy && state.tableList[index]['hasPrice'] === 'false' ? '无' : column.placeholder || t('common.inputText')"
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
                  <!--                  <lydc-select-->
                  <!--                    v-if="!props.detailed"-->
                  <!--                    :value="state.tableList[index][column.dataIndex]"-->
                  <!--                    :options="state.searchRsList"-->
                  <!--                    :fieldNames="column.fieldNames"-->
                  <!--                    :showArrow="false"-->
                  <!--                    :defaultActiveFirstOption="true"-->
                  <!--                    show-search-->
                  <!--                    allowClear-->
                  <!--                    :filter-option="false"-->
                  <!--                    :not-found-content="null"-->
                  <!--                    @search="handleSearch($event, column, index)"-->
                  <!--                    @focus="handleSearch($event.target.value, column, index)"-->
                  <!--                    @change="(value, option) => onChange(index, column, value, option)" />-->
                  <ApiSelect
                    v-if="!props.detailed"
                    :api="column.searchFunc"
                    :placeholder="column.placeholder"
                    :show-search="true"
                    :api-search="{
                      show: true,
                      searchName: 'keyword',
                    }"
                    :singleDefaultFirst="column.dataIndex === 'originInsideCode'"
                    :allowClear="column.dataIndex === 'originInsideCode' || column.dataIndex === 'materialTypeFromManufacturer'"
                    :disabled="
                      column.dataIndex === 'originInsideCode'
                        ? !!state.tableList[index]['materialTypeFromManufacturer']
                          ? true
                          : false
                        : column.dataIndex === 'materialTypeFromManufacturer'
                        ? !!state.tableList[index]['originInsideCode']
                          ? true
                          : false
                        : false
                    "
                    :params="column.beforeParams ? column.beforeParams(state.tableList[index]) : {}"
                    :value="state.tableList[index][column.dataIndex]"
                    result-field="data"
                    :label-field="column.fieldNames.label"
                    :value-field="column.fieldNames.value"
                    :filter-option="false"
                    :not-found-content="null"
                    :afterFetch="column.afterFetch || undefined"
                    :nameFormat="column.nameFormat || []"
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
                    :placeholder="column.placeholder"
                    :fieldNames="column.fieldNames"
                    @change="onChange(index, column, $event, {})" />
                  <div v-else>{{ formatSelectValue(record, column) }}</div>
                </template>
              </template>
              <template v-if="column.compType == 'UserSelect'">
                <lydc-custom-user-select
                  v-model:value="state['tableList'][index][column.dataIndex]"
                  :placeholder="state['tableList'][index]['hasPrice'] === 'false' || !state['tableList'][index]['hasPrice'] ? column.placeholder : '无需选择'"
                  :allowClear="true"
                  show-search
                  :disabled="state.tableList[index]['hasPrice'] == 'true'"
                  @change="(id, data) => onUserIdChange(id, data, index, column)">
                </lydc-custom-user-select>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <TableAction :actions="getTableActions(index, record)" />
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
  import { bignumber, divide, floor, multiply, round, subtract } from 'mathjs';
  import { getMaterialPriceList } from '/@/api/engineering/quotatios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { cloneDeep, findIndex } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { technologyRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { buildUUID } from '/@/utils/uuid';

  defineOptions({ name: 'enginee-table' });

  const emit = defineEmits(['getProcessData']);
  const props = defineProps({
    columns: {
      type: Array as PropType<BasicColumn[]>,
      default: () => [],
    },
    processData: {
      type: Array,
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
    currentData: {
      type: Object,
    },
  });

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
  const { hasBtnP } = usePermission();

  watch(
    () => props.detailed,
    val => {
      val &&
        nextTick(() => {
          const tempColumns: BasicColumn[] = props.columns;
          console.log(tempColumns, 'tempColumns');
          // setColumns(tempColumns);
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

  const { createMessage } = useMessage();

  // const defaultColumns: BasicColumn[] = [];
  const [registerTable, { setColumns, setTableData }] = useTable({
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
    // scroll: {
    //   y: props.tableScrollHeight,
    // },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function getTableActions(index, record): ActionItem[] {
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
          onOk: handleDelete.bind(null, index, record),
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

  const handleDelete = (index, record) => {
    console.log(record, 'recordrecordrecordrecord');
    const targetIndex = findIndex(state.tableList, item => (item.uuid || item.id) === (record.uuid || record.id));
    console.log(targetIndex, 'targetIndextargetIndextargetIndex');
    state.tempList.splice(targetIndex, 1);
    state.tableList.splice(targetIndex, 1);
  };

  const handleAdd = index => {
    const data = state.tableList[0];

    const addData = getColumn(cloneDeep(props.columns));
    if (data.singleProcessLosses) {
      addData.singleProcessLosses = data.singleProcessLosses;
    }
    const uuid = buildUUID();
    state.tempList.splice(index + 1, 0, {
      ...addData,
      uuid,
    });
    state.tableList.splice(index + 1, 0, {
      ...addData,
      uuid,
    });
  };
  const handleCopy = index => {
    const data = cloneDeep(state.tableList[index]);
    delete data.id;
    const uuid = buildUUID();
    state.tempList.splice(
      index + 1,
      0,
      cloneDeep({
        ...data,
        uuid,
      }),
    );
    state.tableList.splice(
      index + 1,
      0,
      cloneDeep({
        ...data,
        uuid,
      }),
    );
  };

  function onUserIdChange(id, data, index, column) {
    console.log(id, data, index, column, 'id, data, index, column');
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
    console.log(inputValue, option, 'inputValue, option');
    return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  const handleSearch = debounce(async (e = '', column, index) => {
    if (column.dataIndex == 'materialTypeFromManufacturer') {
      e = {
        insideCode: state.tableList[index]?.insideCode || '',
        materialTypeFromManufacturer: e,
      };
    }
    const res = await column.searchFunc(e);
    const { data } = res;
    state.searchRsList = data?.constructor == 'Array' ? data[0] : data || res || [];
  }, 300);

  async function handleNetPriceChange(column, e, option) {
    console.log(option, '111111111option111111111');
    // 获取需要带出的字段在数据
    let fieldsObj = Object.keys(column.assignFields).reduce((acc, cur) => {
      // 遍历需要带出的字段，可以是assignFields的value，也可以是key
      acc[cur] = (option && option[column.assignFields[cur] || cur]) || '';
      return acc;
    }, {});
    const { terminalCustomerCode, productLineCode } = props.currentData;
    console.log(terminalCustomerCode, productLineCode, 'terminalCustomerCode productLineCode');
    console.log(option);
    console.log(props.currentData);
    fieldsObj = {
      ...fieldsObj,
      wholePrice: null,
      hasPrice: 'false',
    };
    // if (column.dataIndex === 'insideCode' && e) {
    // state.tableList['index'].insideCodeDisabled = true
    // }
    if (column.dataIndex === 'materialTypeFromManufacturer' && e) {
      // state.tableList['index'].materialTypeFromManufacturerDisabled = true
    }
    const param = {
      // originInsideCode: column.dataIndex === 'originInsideCode' ? e : '',
      insideCode: column.dataIndex === 'originInsideCode' ? e : '',
      materialTypeFromManufacturer: column.dataIndex === 'materialTypeFromManufacturer' ? e : '',
    };
    const { code, data: dataArr } = await getMaterialPriceList({
      terminalCustomerCode,
      productLineCode,
      status: 1,
      ...param,
    });
    const data = dataArr[0];
    console.log('--------------------');
    console.log(data);
    fieldsObj.hasPrice = 'false';
    if (code == '200' && data && e) {
      console.log(data, 'data');
      console.log(props.fieldsValue.isBonded, 'isBonded');
      console.log(data.generalTradePricePriceUnit >= 0);
      console.log(props.fieldsValue.isBonded && data.generalTradePricePriceUnit >= 0);
      // 是否是保税价格 且报价是否大于0
      console.log(fieldsObj, 'pre');
      console.log(data);
      if (props.fieldsValue.isBonded == 'true' && data.generalTradePricePriceUnit >= 0) {
        fieldsObj = {
          ...fieldsObj,
          wholeLength: data.materialLength,
          wholeWidth: data.materialWidth,
          wholeThickness: data.materialThickness,
          wholePrice: data.bondedPricePriceUnit,
          price: data.bondedPricePriceUnit,
          // wholeUnit: data.purchasingUnit,
          purchaserId: data.developmentPurchaserId,
          priceActual: data.actualPurchasePrice,
          hasPrice: 'true',
          materialTypeFromManufacturer: data.materialTypeFromManufacturer,
        };
      } else {
        //   generalTradePricePurchasingUnit
        fieldsObj = {
          ...fieldsObj,
          wholeLength: data.materialLength,
          wholeWidth: data.materialWidth,
          wholeThickness: data.materialThickness,
          wholePrice: data.generalTradePricePriceUnit,
          price: data.generalTradePricePriceUnit,
          // wholeUnit: data.purchasingUnit,
          purchaserId: data.developmentPurchaserId,
          priceActual: data.actualPurchasePrice,
          hasPrice: 'true',
          materialTypeFromManufacturer: data.materialTypeFromManufacturer,
        };
      }
    } else {
      fieldsObj = {
        ...fieldsObj,
        hasPrice: 'false',
      };
      delete fieldsObj.purchaserId;
      createMessage.warning(t('dict.QuotationColumn.noResultPrice'));
    }
    return fieldsObj;
  }

  async function onChange(index, column, e, option) {
    console.log('change');
    console.log(index, column, e, option, 'index, column, e, option');
    if (column.compType == 'Input') {
      console.log(123123123, e);
      state.tableList[index][column.dataIndex] = e || '';
      if (column.dataIndex === 'materialTypeFromManufacturer') {
        state.tableList[index]['hasPrice'] = 'false';
      }
      if (column.dataIndex === 'materialTypeFromManufacturer') {
        console.log('materialTypeFromManufacturer');
        const fieldsObj = await handleNetPriceChange(column, e, option);
        state.tableList[index] = {
          ...state.tableList[index],
          [`${column.dataIndex}`]: e || '',
          ...fieldsObj, // 赋值需要带出的数据
        };
      }
    } else if (column.compType == 'Select') {
      if (column.mode == 'searchInput') {
        console.log(option, '111111111option111111111');
        // 获取需要带出的字段在数据
        let fieldsObj = Object.keys(column.assignFields).reduce((acc, cur) => {
          // 遍历需要带出的字段，可以是assignFields的value，也可以是key
          acc[cur] = (option && option[column.assignFields[cur] || cur]) || '';
          return acc;
        }, {});
        console.log(fieldsObj, '1111111111111fieldsObj11111111111');

        if (column.dataIndex === 'originInsideCode' || column.dataIndex === 'materialTypeFromManufacturer') {
          const { terminalCustomerCode, productLineCode } = props.currentData;
          console.log(terminalCustomerCode, productLineCode, 'terminalCustomerCode productLineCode');
          console.log(option);
          console.log(props.currentData);
          fieldsObj = {
            ...fieldsObj,
            wholePrice: null,
            hasPrice: 'false',
          };
          // if (column.dataIndex === 'insideCode' && e) {
          // state.tableList['index'].insideCodeDisabled = true
          // }
          if (column.dataIndex === 'materialTypeFromManufacturer' && e) {
            // state.tableList['index'].materialTypeFromManufacturerDisabled = true
          }
          const param = {
            // originInsideCode: column.dataIndex === 'originInsideCode' ? e : '',
            insideCode: column.dataIndex === 'originInsideCode' ? e : '',
            materialTypeFromManufacturer: column.dataIndex === 'materialTypeFromManufacturer' ? e : '',
          };
          const { code, data: dataArr } = await getMaterialPriceList({
            terminalCustomerCode,
            productLineCode,
            status: 1,
            ...param,
          });
          const data = dataArr[0];
          console.log('--------------------');
          console.log(data);
          fieldsObj.hasPrice = 'false';
          if (code == '200' && data && e) {
            console.log(data, 'data');
            console.log(props.fieldsValue.isBonded, 'isBonded');
            console.log(data.generalTradePricePriceUnit >= 0);
            console.log(props.fieldsValue.isBonded && data.generalTradePricePriceUnit >= 0);
            // 是否是保税价格 且报价是否大于0
            console.log(fieldsObj, 'pre');
            console.log(data);
            if (props.fieldsValue.isBonded == 'true' && data.generalTradePricePriceUnit >= 0) {
              fieldsObj = {
                ...fieldsObj,
                wholeLength: data.materialLength,
                wholeWidth: data.materialWidth,
                wholeThickness: data.materialThickness,
                wholePrice: data.bondedPricePriceUnit,
                price: data.bondedPricePriceUnit,
                // wholeUnit: data.purchasingUnit,
                purchaserId: data.developmentPurchaserId,
                priceActual: data.actualPurchasePrice,
                hasPrice: 'true',
                materialTypeFromManufacturer: data.materialTypeFromManufacturer,
              };
            } else {
              //   generalTradePricePurchasingUnit
              fieldsObj = {
                ...fieldsObj,
                wholeLength: data.materialLength,
                wholeWidth: data.materialWidth,
                wholeThickness: data.materialThickness,
                wholePrice: data.generalTradePricePriceUnit,
                price: data.generalTradePricePriceUnit,
                // wholeUnit: data.purchasingUnit,
                purchaserId: data.developmentPurchaserId,
                priceActual: data.actualPurchasePrice,
                hasPrice: 'true',
                materialTypeFromManufacturer: data.materialTypeFromManufacturer,
              };
            }
          } else {
            fieldsObj = {
              ...fieldsObj,
              hasPrice: 'false',
            };
            delete fieldsObj.purchaserId;
            createMessage.warning(t('dict.QuotationColumn.noResultPrice'));
          }
        }
        if (column.dataIndex === 'originInsideCode' && e) {
          const [startCode, eightCode, calcWidth] = e.split('-');
          state.tableList[index].insideCode = e;
          state.tableList[index].eightCode = eightCode;
          // state.tableList[index].singleWidth = calcWidth;
          // state.tableList['index'].materialTypeFromManufacturerDisabled = true
          delete fieldsObj.materialTypeFromManufacturer;
        }
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
    calcValues(index, column.dataIndex);
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

  // watchEffect(() => {
  //   console.log(props.processData, 'props.processData');
  //   const fpy = props?.processData ? props?.processData[0]?.fpy || 0 : 0;
  //
  //   state.tableList.forEach(item => {
  //     let singleProcessLosses = subtract(bignumber(100), bignumber(fpy));
  //     console.log(singleProcessLosses.toString(), 'singleProcessLosses tostring');
  //     state.tableList[index].singleProcessLosses = singleProcessLosses.toString();
  //   })
  // })
  watch(
    () => props.processData,
    (newVal, oldVal) => {
      if (!newVal) return;
      const fpy = newVal[0]?.fpy || 0;
      state.tableList.forEach((item, index) => {
        let singleProcessLosses = subtract(bignumber(100), bignumber(fpy));
        console.log(singleProcessLosses.toString(), 'singleProcessLosses tostring');
        state.tableList[index].singleProcessLosses = singleProcessLosses.toNumber().toFixed(2);
        console.log('🚀 ~  ~watchwatchwatchwatch singleProcessLosses: ', singleProcessLosses);
        calcValues(index, 'singleProcessLosses', 'deep');
      });
    },
    { deep: true },
  );

  const calcValues = (index, dataIndex, source) => {
    console.log('calc start');
    emit('getProcessData');
    nextTick(() => {
      console.log(props.processData);
      if (!props.processData) {
        return createMessage.warning(t('dict.ShippingSpaceColumn.pleaseEnterProcessData'));
      }
      const fpy = props.processData[0]?.fpy || 0;

      // if (state.tableList[index]['singleWidth'] > state.tableList[index]['wholeWidth']) {
      //   return createMessage.warning('当前使用宽度大于整支宽度!');
      // }

      state.tableList = state.tableList.map((item, index) => ({ ...item, seqNumber: index + 1 }));

      state.tableList.map((item, index) => {
        try {
          let singleProcessLosses = subtract(bignumber(100), bignumber(fpy || 0));
          console.trace('🚀 ~  ~ dataIndex: ', dataIndex);
          if (dataIndex !== 'singleProcessLosses') {
            state.tableList[index].singleProcessLosses = singleProcessLosses.toNumber().toFixed(2);
          } else {
            console.log('🚀 ~  ~ item.singleProcessLosses: ', item.singleProcessLosses);
            singleProcessLosses = divide(bignumber(item.singleProcessLosses || 0), bignumber(100));
          }

          console.log('🚀 ~  ~ singleProcessLosses: ', singleProcessLosses.toFixed(2));

          console.log(item?.wholePrice, 'item.wholePrice');
          console.log(item?.wholeLength, 'item.wholeLength');
          console.log(item?.singleWidth, 'item.singleWidth');
          console.log(item?.singleStepDistance, 'item.singleStepDistance');
          console.log(item?.singleModulus, 'item.singleModulus');
          if (item?.singleWidth && item?.wholeWidth) {
            const widthRate = divide(bignumber(item.wholeWidth || 0), bignumber(item?.singleWidth || 0));
            state.tableList[index].utilizationRate = round(divide(floor(widthRate), widthRate), 4) * 100;
          }

          console.log(item.singleWidth, item.singleStepDistance, item.singleModulus);
          const singleUseQty = divide(
            divide(multiply(bignumber(item.singleWidth || 0), bignumber(item.singleStepDistance || 0)), bignumber(item.singleModulus || 1)),
            1000000,
          );
          console.log('🚀 ~  ~ singleUseQty.toFixed(): ', singleUseQty.toFixed());

          if (item.wholePrice && item.wholeLength && item.singleWidth && item.singleStepDistance && item.singleModulus) {
            console.log(item, singleProcessLosses, 'params');
            // if(source === 'deep'){
            // 	singleProcessLosses = divide(bignumber(singleProcessLosses || 0), bignumber(100));
            // }
            // state.tableList[index].singleProcessLosses
            console.log('🚀 ~  ~ state.tableList[index].singleProcessLosses: ', state.tableList[index].singleProcessLosses);
            // TODO
            const evalSingleProcessLosses = divide(bignumber(state.tableList[index].singleProcessLosses || 0), bignumber(100));
            // parseFloat(divide(bignumber(state.tableList[index].singleProcessLosses, bignumber(100)))
            const [cost, costActual] = evalFunc(item, evalSingleProcessLosses);
            console.log('🚀 ~  ~ cost: ', parseFloat(cost.toFixed(6)));
            state.tableList[index].cost = parseFloat(cost.toFixed(6));
            state.tableList[index].costActual = parseFloat(costActual.toFixed(6));
          }
          state.tableList[index].singleUseQty = singleUseQty.toFixed(6);
        } catch (e) {}
      });
    });
  };

  const batchCalcVales = () => {
    nextTick(() => {
      state.tableList.map((item, index) => {
        calcValues(index, '');
      });
    });
  };

  async function init() {
    const tempColumns: BasicColumn[] = props.detailed ? props.columns : ([...props.columns, actionColumn] as any[]);
    const col = tempColumns.map(item => {
      return {
        ...item,
        children: item.children?.filter(value => !value.show) || [],
      };
    });
    setColumns(col);
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

  const evalFunc = (item, singleProcessLosses) => {
    console.log('🚀 ~ evalFunc ~ item: ', item);
    // 1TS-P5244000-0940
    // console.log(singleProcessLosses.toString(), 'singleProcessLosses');

    // (整支采购价格*（整支宽度/1000）*整支长度) / (INT(整支宽度 / 单个宽度) * (整支长度 / 单个步距) * 单个模数 * (1 - 单个制程损耗).

    // 整支采购价格
    const wholePrice = bignumber(item.wholePrice);
    console.log('🚀 ~ evalFunc ~ wholePrice: ', wholePrice.toFixed(2));
    // 整支宽度
    const wholeWidth = bignumber(item.wholeWidth);
    console.log('🚀 ~ evalFunc ~ wholeWidth: ', wholeWidth.toFixed(2));
    // 整支长度
    const wholeLength = bignumber(item.wholeLength);
    console.log('🚀 ~ evalFunc ~ wholeLength: ', wholeLength.toFixed(2));
    // 单个宽度
    const singleWidth = bignumber(item.singleWidth);
    console.log('🚀 ~ evalFunc ~ singleWidth: ', singleWidth.toFixed(2));
    // 单个步距
    const singleStepDistance = bignumber(item.singleStepDistance);
    console.log('🚀 ~ evalFunc ~ singleStepDistance: ', singleStepDistance.toFixed(2));
    // 单个模数
    const singleModulus = bignumber(item.singleModulus);
    console.log('🚀 ~ evalFunc ~ singleModulus: ', singleModulus.toFixed(2));
    // 单个制程损耗
    // const bigSingleProcessLosses = bignumber((singleProcessLosses || item.singleProcessLosses))
    console.log('🚀 ~ evalFunc ~ singleProcessLosses: ', singleProcessLosses.toFixed(2));

    // (整支采购价格*（整支宽度/1000）*整支长度) / (INT(整支宽度 / 单个宽度) * (整支长度 / 单个步距) * 单个模数 * (1 - 单个制程损耗)
    // 计算整支宽度可容纳的单个产品数量（向下取整）
    const countPerWidth = floor(divide(wholeWidth, singleWidth));

    // 计算整支长度可容纳的步距数量
    const stepsPerLength = divide(wholeLength, singleStepDistance);

    // 计算分母部分：(1 - 损耗率)
    const denominatorPart = subtract(1, singleProcessLosses);

    // 计算分母整体
    const denominator = multiply(countPerWidth, stepsPerLength, singleModulus, denominatorPart);

    // 计算分子部分
    const numerator = multiply(
      wholePrice,
      divide(wholeWidth, 1000), // 宽度从mm转换为m
      wholeLength,
    );

    // 最终计算结果
    const result = divide(numerator, denominator);
    console.log('🚀 ~ evalFunc ~ denominator: ', denominator.toFixed(2));
    console.log('🚀 ~ evalFunc ~ numerator: ', numerator.toFixed(2));
    console.log('🚀 ~ evalFunc ~ result: ', result.toFixed(2));

    return [result, null];

    // floor(整只材料宽度 / 录入原材料宽度)
    // const floor = Math.floor(parseFloat(divide(bignumber(item.wholeWidth), bignumber(item.singleWidth))));
    // console.log(floor, 'floor12312');

    // // 整只材料长度/步距
    // let num1 = divide(bignumber(item.wholeLength), bignumber(item.singleStepDistance));
    // console.log(num1, 'num1');
    // let num2 = multiply(num1, bignumber(item.singleModulus));
    // console.log(num2, 'num2');
    // let num3 = multiply(floor, num2);
    // console.log(num3, 'num3');
    // let num4 = multiply(num3, subtract(100, singleProcessLosses));
    // console.log(num4, 'num4');
    // let result1 = divide(bignumber(item.wholePrice), num4);
    // console.log(result1, 'result1');
    // let result2 = divide(bignumber(item.priceActual || 0), num4);
    // console.log(result2, 'result2');
    // return [result1, result2];
  };

  defineExpose({ getData, resetData, setData, init });
</script>

<style lang="less" scoped>
  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

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
