<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="false"
    :title="title"
    :destroy-on-close="true"
    @ok="handleSave"
    @visible-change="handleVisibleChange"
    style="position: relative"
    class="top-0">
    <!-- <template #insertToolbar>
      <a-button type="primary" v-show="state.type == 'add'" @click="addColumn"> <i class="icon-ym icon-ym-btn-add .text-12px" />插入一行数据 </a-button>
      <a-button v-if="state.type == 'view'" class="ml-3" @click="toEdit">{{ t('common.editText') }}</a-button>
      <a-divider type="vertical" class="ml-10px"></a-divider>
    </template> -->
    <div>
      <!-- <div v-if="state.type == 'add'" class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <Descriptions v-bind="descOptions">
          <Descriptions.Item label="申请人">
            {{ getUserInfo.userName }}
          </Descriptions.Item>
          <Descriptions.Item label="申请部门">
            {{ getUserInfo.departmentName }}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div v-else class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <Descriptions v-bind="descOptions">
          <template v-for="(item, i) in simpleDesc" :key="i">
            <Descriptions.Item v-if="state.base[item.dataIndex]" :label="item.title">
              {{ toVal(item, state.base) }}
            </Descriptions.Item>
          </template>
        </Descriptions>
      </div> -->
      <Subtitle
        :title="t('views.quantitation.common.quatoRequire')"
        class="mt-2px pl-12px pr-12px"
        style="padding-bottom: 8px"
        :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #afterTitle>
          <!-- <a-button type="primary" v-auth="'btn_recall'" ghost v-if="state.type !== 'add'" class="mr-3" @click="handleBackReview">撤回</a-button>
          <a-button type="primary" v-auth="'btn_stop'" ghost v-if="state.type !== 'add'" class="mr-3" @click="handleStop">终止</a-button> -->
          <!-- <a-divider type="vertical" class="ml-10px"></a-divider> -->
          <a-button v-show="state.type == 'add'" type="primary" ghost @click="openModal">批量添加</a-button>
        </template>
        <template #extra>
          <div class="flex" v-show="state.type == 'add'">
            添加行：<lydc-input-number style="max-width: 72px" size="middle" min="1" max="100" v-model:value="state.line" />
            <a-button type="primary" ghost size="middle" @click="addColumn" class="ml-8px">添加</a-button>
          </div>
        </template>
      </Subtitle>
      <BasicTable @register="registerApplyPopTable" :columns="menuTableColumns" :dataSource="state.tableList">
        <template #bodyCell="{ column, index }">
          <template v-if="column.key != 'action'">
            <template v-if="column.compType == 'Input'">
              <lydc-input
                v-model:value="state.tempList[index][column.dataIndex]"
                :placeholder="column.placeholder || t('common.inputText')"
                :disabled="column?.disabled || state.type == 'view'" />
            </template>
            <template v-if="column.compType == 'Date'">
              <lydc-date-picker
                :value="state.tempList[index][column.dataIndex]"
                :defaultValue="column.defaultValue"
                :disabled="column?.disabled || state.type == 'view'"
                allowClear
                format="YYYY-MM-DD"
                @change="onChange(index, column, $event)" />
            </template>
            <template v-if="column.compType == 'ApiSelect'">
              <ApiSelect
                v-model:value="state.tempList[index][column.dataIndex]"
                :disabled="column.disabled"
                :api="column.api"
                :show-search="true"
                :api-search="{
                  show: true,
                  searchName: column.searchKey || 'keyword',
                }"
                :params="column.params"
                placeholder="请选择"
                :label-field="column?.fieldNames?.label"
                :value-field="column?.fieldNames?.value"
                :name-format="column.nameFormat || []"
                result-field="data"
                allowClear
                :filter-option="false"
                :immediate="true"
                @change="(id, data) => onChange(index, column, id, data)" />
              <!-- :not-found-content="null" -->
            </template>
            <template v-if="column.compType == 'Select'">
              <lydc-select
                v-if="column.mode == 'searchInput'"
                :value="state.tempList[index][column.dataIndex]"
                :options="state.innerMaterialNumList"
                :fieldNames="column.fieldNames"
                :dispatchChange="state.type == 'add' && initFlag"
                show-search
                :showArrow="false"
                allowClear
                :filter-option="false"
                :not-found-content="state.fetching ? undefined : null"
                :defaultActiveFirstOption="true"
                :disabled="column?.disabled || state.type == 'view'"
                @search="e => column.searchFunc(e, 'focus')"
                @focus="column.searchFunc($event.target.value, 'focus')"
                @change="(id, data) => onChange(index, column, id, data)">
                <template v-if="state.fetching" #notFoundContent>
                  <a-spin size="small" />
                </template>
              </lydc-select>
              <lydc-select
                v-else
                :value="state.tempList[index][column.dataIndex]"
                :options="state[column.optionsName]"
                :defaultValue="column.defaultValue"
                :disabled="column?.disabled || state.type == 'view'"
                @change="(id, data) => onChange(index, column, id, data)" />
            </template>
            <template v-if="column.compType == 'UserSelect'">
              <lydc-custom-user-select
                v-model:value="state.tempList[index][column.dataIndex]"
                :multiple="false"
                show-search
                placeholder="选择人员"
                :disabled="column?.disabled || state.type == 'view'"
                @change="(id, data) => onUserIdChange(id, data, index, column)" />
            </template>
          </template>
          <template v-else>
            <TableAction :actions="getTableActions(index)" />
          </template>
        </template>
      </BasicTable>
    </div>
    <div style="padding: 20px; display: flex; justify-content: flex-end">
      <a-button>ddsaasdsdaasd</a-button>
      <a-button>ddsaasdsdaasd</a-button>
      <a-button>ddsaasdsdaasd</a-button>
      <a-button>ddsaasdsdaasd</a-button>
    </div>
    <BatchAdd @register="registerAddModal" @reload="handleBatchAdd"></BatchAdd>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep } from 'lodash-es';
  import { debounce } from '/@/utils/debounce';
  import { createFilingsApply, getFilingsApplyDetail, getinnermaterialnumberlist } from '/@/api/customerSerivce/index';
  import { getHarhorList } from '/@/api/basicData/harhor';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { getCustomerList } from '/@/api/basicData/customer';
  import { useBaseStore } from '/@/store/modules/base';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { Subtitle } from '/@/components/Subtitle';
  import BatchAdd from '../extends/BatchAddModal.vue';
  import { useModal } from '/@/components/Modal';

  const emits = defineEmits(['register', 'refresh']);
  const baseStore = useBaseStore();

  interface State {
    type: 'view' | 'add';
    Id: string;
    role: string;
    title: string;
    base: any;
    tableList: any[];
    tempList: any[];
    innerMaterialNumList: any[];
    harhorList: any[];
    factoryList: any[];
    customerList: any[];
    langList: any[];
    shipmentList: any[];
    fetching: boolean;
    line: number;
  }

  const { t } = useI18n();
  const initFlag = ref(true);
  const state = reactive<State>({
    type: 'add',
    role: '',
    base: {},
    Id: '',
    title: '',
    tableList: [],
    tempList: [],
    innerMaterialNumList: [],
    harhorList: [],
    factoryList: [],
    customerList: [],
    langList: [
      {
        id: 1,
        fullName: '英文',
      },
      {
        id: 2,
        fullName: '中文',
      },
    ],
    shipmentList: [],
    fetching: false,
    line: 1,
  });
  const { title } = toRefs(state);

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const columnOption = {
    Role: '',
    InnerMaterialNumber: '',
    TerminalCustomerMaterialNumber: '',
    ProductArea: '',
    DirectCustomerName: '',
    FilingsLanguage: '',
    Prot: '',
    ShipmentType: '',
    DutyId: '',
    DutyName: '',
  };

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const [registerApplyPopTable] = useTable({
    immediate: false,
    pagination: false,
    useSearchForm: false,
    ellipsis: true,
    canResize: true,
    resizeHeightOffset: 80,
    showTableSetting: false,
    striped: true,
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });
  const [registerAddModal, { openModal }] = useModal();

  const fetchDataByApplyMaterialId = debounce((v, type) => {
    state.fetching = true;
    getinnermaterialnumberlist(v.trim())
      .then(res => {
        state.innerMaterialNumList = res?.data || [];
      })
      .catch(err => {
        state.innerMaterialNumList = [];
      })
      .finally(() => {
        state.fetching = false;
      });
  }, 500);
  fetchDataByApplyMaterialId('');

  // 客户列表
  async function getCustomers(keyword?: '') {
    const list = (await getCustomerList(keyword)).data;
    state.customerList = list
      ? list.map(i => {
          return {
            id: i.name,
            fullName: i.name,
            Harhor: i.harhor,
            ShipmentMode: i.shipmentMode,
          };
        })
      : [];
  }
  // 获取出货方式
  async function getApplyTypes() {
    const list = (await baseStore.getDictionaryData('ShipmentType')) as any;
    state.shipmentList = (list || []).map(i => {
      return {
        id: Number(i.enCode),
        fullName: i.fullName,
      };
    });
  }
  getCustomers();
  getApplyTypes();

  const menuTableColumns: any[] = [
    {
      title: '产品内部料号',
      dataIndex: 'InnerMaterialNumber',
      width: 240,
      maxLength: 24,
      compType: 'ApiSelect',
      api: getinnermaterialnumberlist,
      searchKey: 'InnerMaterialNumber',
      mode: 'searchInput',
      fieldNames: {
        label: 'InnerMaterialNumber',
        value: 'InnerMaterialNumber',
      },
    },
    {
      title: '口岸',
      dataIndex: 'Prot',
      width: 160,
      compType: 'ApiSelect',
      searchKey: 'harhorName',
      api: getHarhorList,
      fieldNames: {
        label: 'Name',
        value: 'Name',
      },
    },
    {
      title: '出货方式',
      dataIndex: 'ShipmentType',
      width: 160,
      compType: 'Select',
      optionsName: 'shipmentList',
    },
    { title: '出货备案法人', dataIndex: 'SellCorporation', compType: 'Input' },
    {
      title: '备案语言',
      dataIndex: 'FilingsLanguage',
      width: 160,
      compType: 'Select',
      optionsName: 'langList',
    },
    { title: 'PD', dataIndex: 'DutyId', extraKey: 'DutyName', width: 160, compType: 'UserSelect' },
    {
      title: '工厂',
      dataIndex: 'ProductArea',
      width: 160,
      mode: 'factory',
      compType: 'ApiSelect',
      api: getFactoryList,
      nameFormat: ['Name', '/', 'Code'],
      fieldNames: {
        label: 'Name',
        value: 'Code',
      },
    },
    { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 200, compType: 'Input', disabled: true },
    {
      title: '终端客户料号',
      dataIndex: 'TerminalCustomerMaterialNumber',
      width: 160,
      disabled: true,
      compType: 'Input',
    },
    // { title: '客服', dataIndex: 'CustomersId', extraKey: 'CustomersName', width: 160, compType: 'UserSelect' },
    // { title: '备注', dataIndex: 'Remark', width: 200, compType: 'Input' },
    {
      title: '直接客户名称',
      dataIndex: 'DirectCustomerName',
      width: 160,
      compType: 'Input',
      mode: 'customer',
      disabled: true,
      placeholder: t('common.inputText'),
    },
  ];

  const assignMember = (list: any[]) => {
    if (!list || !list.length) return;
    const tempObj = {};
    list.length &&
      list.forEach(item => {
        if (item.configType == 'PDTLeader') {
          tempObj['EPMId'] = item.memberId;
          tempObj['EPM'] = item.memberName;
        }
      });
    return tempObj;
  };

  // 批量添加
  function handleBatchAdd(data) {
    const fields = {
      ...menuTableColumns[0].assignFields,
      innerMaterialNumber: 'InsidePartNumber',
    };
    (data || []).forEach(item => {
      const _item = {
        ...item,
        ...assignMember(item.Members),
      };
      const fieldObj = {};
      for (let k in fields) {
        fieldObj[k] = _item[fields[k] || k] || '';
      }
      state.tempList.push({
        ...columnOption,
        ...fieldObj,
      });
      state.tableList.push({
        ...columnOption,
        ...fieldObj,
      });
    });
  }

  async function init(data) {
    changeLoading(true);
    state.Id = data.id;
    state.type = data.type || 'add';
    state.title = data.title;
    initFlag.value = false;
    state.role = data.Role || 1;

    // 设置表格显示初始值
    columnOption.Role = state.role;
    const _tableConfg = {
      Role: state.role,
    };
    switch (data.type) {
      case 'add':
        if (data.list && data.list.length) {
          state.tableList = data.list.map(el => {
            return {
              ..._tableConfg,
              DutyId: '',
              DutyName: '',
              ...cloneDeep(el),
            };
          });
        } else {
          state.tableList = [
            {
              ...cloneDeep(columnOption),
            },
          ];
        }
        break;
      case 'edit':
      case 'view':
        const r = await getFilingsApplyDetail({
          id: state.Id,
          role: state.role,
        } as any);
        state.tableList = r.data.DataList;
        state.base = r.data;
        break;
    }
    state.tempList = cloneDeep(state.tableList);
    changeLoading(false);
  }
  function getTableActions(index): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, index),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        disabled: state.tableList.length <= 1,
        modelConfirm: {
          onOk: handleDelete.bind(null, index),
        },
      },
    ];
  }
  function handleDelete(index) {
    console.log(index, 'delete');
    state.tableList.splice(index, 1);
    state.tempList.splice(index, 1);
  }
  function handleCopy(index) {
    const _item = state.tempList[index];
    state.tableList.splice(index, 0, cloneDeep(_item));
    state.tempList.splice(index, 0, cloneDeep(_item));
  }
  function toEdit() {
    state.type = 'edit' as any;
  }
  function addColumn() {
    for (let i = 0; i < state.line; i++) {
      state.tableList.push({
        ...cloneDeep(columnOption),
      });
      state.tempList.push({
        ...cloneDeep(columnOption),
      });
    }
  }
  async function onChange(index, column, e, data?: any) {
    switch (column.dataIndex) {
      case 'InnerMaterialNumber':
        const { TerminalCustomerMaterialNumber, DutyId, DutyName, DirectCustomerMaterialNumber, DirectCustomerName, ProductArea, PmId, PmName } = data;
        state.tempList[index] = {
          ...state.tempList[index],
          [`${column.dataIndex}`]: e,
          TerminalCustomerMaterialNumber,
          DirectCustomerName,
          DirectCustomerMaterialNumber,
          ProductArea,
        };
        if (DutyId) {
          state.tempList[index].DutyId = DutyId;
          state.tempList[index].DutyName = DutyName;
        }
        if (PmId) {
          state.tempList[index].CustomersId = PmId;
          state.tempList[index].CustomersName = PmName;
        }
        // 直接客户带出其他数据
        const list = (await getCustomerList(DirectCustomerName)).data;
        const { harhor, shipmentMode } = list[0];
        state.tempList[index].Prot = harhor;
        // const shipment = state.shipmentList.find(el => {
        //   return el.id == Number(shipmentMode);
        // });
        if (shipmentMode) {
          state.tempList[index].ShipmentType = Number(shipmentMode);
        }
        break;
      case 'factory':
        const { managerName } = data;
        state.tempList[index].SellCorporation = managerName;
        break;
    }
    // if (column.compType == 'Input') {
    //   state.tempList[index][column.dataIndex] = e.target.value;
    // } else if (column.compType == 'Select') {
    //   if (column.mode == 'searchInput') {
    //   } else {
    //     state.tempList[index][column.dataIndex] = e;
    //     switch (column.mode) {
    //       case 'factory':
    //     }
    //   }
    // } else if (column.compType == 'Date') {
    //   state.tempList[index][column.dataIndex] = e;
    // }
  }
  function onUserIdChange(id, data, index, column) {
    if (!id) {
      state.tempList[index][column.dataIndex] = '';
      state.tempList[index][column.extraKey] = '';
      return;
    }
    state.tempList[index][column.dataIndex] = id || '';
    column?.extraKey && (state.tempList[index][column.extraKey] = data?.fullName || '');
  }
  function handleSave() {
    const list = cloneDeep(state.tempList).map(e => ({
      ...e,
      Role: state.role,
      CustomerDeliveryTime: e.CustomerDeliveryTime ? dayjs(e.CustomerDeliveryTime).format('YYYY-MM-DD') : '',
    }));
    const params = {
      data: list,
    };
    changeOkLoading(true);
    createFilingsApply(params)
      .then(res => {
        changeOkLoading(true);
        closePopup();
        createMessage.success(res?.msg || '保存成功');
      })
      .catch(err => {
        changeOkLoading(false);
      });
  }
  function handleVisibleChange(v) {
    if (!v) {
      emits('refresh');
    }
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-table) {
    height: calc(100% - 70px);
  }
</style>
